"""InvestSkill — Página: Reporte completo descargable"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import pandas as pd
from datetime import datetime
import json

from core.data.fetcher import FetcherMercado, formatear_numero
from core.analysis.fundamental import calcular_piotroski, calcular_roic_wacc, calidad_ganancias
from core.analysis.valuation import calcular_dcf, valoracion_multiples
from core.analysis.technical import analizar as analizar_tecnico, retornos_historicos
from core.ai.analyst import (narrativa_evaluacion_accion, narrativa_dcf,
                               narrativa_tecnica, señal_inversion_final)
from config import tiene_api_claude

st.set_page_config(page_title="Reporte Completo — InvestSkill", page_icon="📋", layout="wide")
st.title("📋 Reporte de Análisis Completo")
st.caption("Genera un informe profesional descargable con todos los datos en tiempo real")

# ── Input ─────────────────────────────────────────────────────────────────────
col_t, col_g = st.columns([4, 1])
with col_t:
    ticker = st.text_input("Ticker del activo a reportar",
                            value=st.session_state.get("ticker_actual", "AAPL"),
                            placeholder="Ej: AAPL, MSFT, BTC-USD, FEMSA.MX").strip().upper()
with col_g:
    st.write("")
    generar = st.button("📊 Generar Reporte", type="primary", use_container_width=True)

if not generar:
    st.info("Ingresa un ticker y haz clic en **Generar Reporte** para crear el análisis completo.")
    st.stop()

# ── Carga de todos los datos ──────────────────────────────────────────────────
progress = st.progress(0, text="Iniciando análisis...")

with st.spinner(""):
    fetcher  = FetcherMercado(ticker)
    progress.progress(10, "Obteniendo precio en tiempo real...")
    datos    = fetcher.resumen_completo()

    progress.progress(25, "Descargando estados financieros...")
    hist_1y  = fetcher.precio_historico("1y")

    progress.progress(40, "Calculando Piotroski F-Score...")
    piot_raw = datos.get("piotroski_raw", {})
    fund     = datos.get("fundamentales", {})
    piotroski = calcular_piotroski(piot_raw)

    progress.progress(50, "Calculando ROIC / WACC / EVA...")
    roic_wacc = calcular_roic_wacc(fund, piot_raw)

    progress.progress(60, "Ejecutando modelo DCF...")
    dcf_res   = calcular_dcf(fund, piot_raw)

    progress.progress(70, "Analizando múltiplos de valoración...")
    mult_res  = valoracion_multiples(fund)

    progress.progress(80, "Calculando indicadores técnicos...")
    tech_res  = analizar_tecnico(hist_1y)
    rets      = retornos_historicos(hist_1y)

    progress.progress(90, "Calculando señal final de inversión...")
    señal     = señal_inversion_final(piotroski, roic_wacc, dcf_res, tech_res, datos.get("consenso", {}))

    narrativa_ia = ""
    dcf_narrativa = ""
    tech_narrativa = ""
    if tiene_api_claude():
        progress.progress(95, "Generando análisis narrativo con IA...")
        narrativa_ia   = narrativa_evaluacion_accion(datos)
        dcf_narrativa  = narrativa_dcf(dcf_res, ticker) if not dcf_res.get("error") else ""
        tech_narrativa = narrativa_tecnica(tech_res, ticker) if not tech_res.get("error") else ""

    progress.progress(100, "¡Reporte listo!")

progress.empty()

# ── Encabezado del reporte ────────────────────────────────────────────────────
precio_d   = datos["precio"]
nombre     = precio_d.get("nombre", ticker)
precio_act = precio_d.get("precio", 0)
cambio_pct = precio_d.get("cambio_pct", 0)
moneda     = precio_d.get("moneda", "USD")

st.divider()
col_h, col_s = st.columns([3, 1])
with col_h:
    st.markdown(f"# {nombre}")
    st.markdown(f"**{ticker}** • {precio_d.get('sector','')} • {precio_d.get('intercambio','')} • {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    color = "#00c851" if cambio_pct >= 0 else "#ff4444"
    st.markdown(f"<h2 style='color:{color}'>{moneda} {precio_act:,.4f} &nbsp; {'▲' if cambio_pct>=0 else '▼'} {abs(cambio_pct):.2f}%</h2>", unsafe_allow_html=True)

with col_s:
    sc = señal["score"]
    cl = señal["color"]
    st.markdown(
        f"<div style='background:{cl}22; border:3px solid {cl}; border-radius:12px; padding:20px; text-align:center'>"
        f"<div style='color:{cl}; font-size:28px; font-weight:900'>{señal['accion']}</div>"
        f"<div style='color:#fff; font-size:36px; font-weight:700'>{sc}/10</div>"
        f"<div style='color:#8892a4; font-size:12px'>{señal['señal']}<br>Confianza: {señal['confianza']}</div>"
        f"</div>", unsafe_allow_html=True,
    )

# ── Sección 1: Tesis de inversión (IA) ───────────────────────────────────────
st.divider()
st.subheader("1. Tesis de Inversión")
if narrativa_ia:
    st.markdown(narrativa_ia)
else:
    st.markdown(f"**{nombre}** opera en el sector {precio_d.get('sector','N/D')}.")
    desc = datos.get("descripcion", "")
    if desc:
        st.write(desc[:800] + "..." if len(desc) > 800 else desc)
    if not tiene_api_claude():
        st.info("Para narrativa IA: configura ANTHROPIC_API_KEY en .env")

# ── Sección 2: Métricas clave ─────────────────────────────────────────────────
st.divider()
st.subheader("2. Métricas de Valoración y Rentabilidad")

mc1, mc2, mc3 = st.columns(3)
with mc1:
    st.markdown("**Valoración**")
    st.dataframe(pd.DataFrame({
        "Métrica": ["P/E TTM", "P/E Fwd", "PEG", "P/Ventas", "P/Libro", "EV/EBITDA", "FCF Yield"],
        "Valor": [
            f"{fund.get('pe_ttm','N/D')}x", f"{fund.get('pe_forward','N/D')}x",
            f"{fund.get('peg','N/D')}x",    f"{fund.get('precio_ventas','N/D')}x",
            f"{fund.get('precio_valor_libro','N/D')}x", f"{fund.get('ev_ebitda','N/D')}x",
            f"{fund.get('fcf_yield','N/D')}%",
        ]
    }), hide_index=True, use_container_width=True)

with mc2:
    st.markdown("**Rentabilidad**")
    st.dataframe(pd.DataFrame({
        "Métrica": ["M. Bruto", "M. Operativo", "M. Neto", "EBITDA M.", "ROE", "ROA"],
        "Valor": [
            f"{fund.get('margen_bruto','N/D')}%",    f"{fund.get('margen_operativo','N/D')}%",
            f"{fund.get('margen_neto','N/D')}%",     f"{fund.get('margen_ebitda','N/D')}%",
            f"{fund.get('roe','N/D')}%",             f"{fund.get('roa','N/D')}%",
        ]
    }), hide_index=True, use_container_width=True)

with mc3:
    st.markdown("**Calidad y Riesgo**")
    st.dataframe(pd.DataFrame({
        "Métrica": ["Piotroski", "ROIC", "WACC", "Beta", "D/E", "Ratio Corriente"],
        "Valor": [
            f"{piotroski.get('score','N/D')}/9",
            f"{roic_wacc.get('roic_pct','N/D')}%",
            f"{roic_wacc.get('wacc_pct','N/D')}%",
            f"{fund.get('beta','N/D')}",
            f"{fund.get('deuda_equity','N/D')}x",
            f"{fund.get('ratio_corriente','N/D')}x",
        ]
    }), hide_index=True, use_container_width=True)

# ── Sección 3: DCF ────────────────────────────────────────────────────────────
st.divider()
st.subheader("3. Valoración DCF")
if dcf_res.get("error"):
    st.warning(f"DCF no disponible: {dcf_res['error']}")
else:
    esc = dcf_res["escenarios"]
    df_dcf = pd.DataFrame({
        "Escenario":             ["🐻 Bajista", "📊 Base", "🐂 Alcista"],
        "Valor intrínseco":      [f"${e['valor_intrinseco']:,.2f}" for e in [esc["bajista"],esc["base"],esc["alcista"]]],
        "Margen de seguridad":   [f"{e.get('margen_seguridad_pct','N/D')}%" for e in [esc["bajista"],esc["base"],esc["alcista"]]],
        "WACC":                  [f"{e['wacc_pct']}%" for e in [esc["bajista"],esc["base"],esc["alcista"]]],
        "Crec. F1/F2":           [f"{e['crec_fase1_pct']}%/{e['crec_fase2_pct']}%" for e in [esc["bajista"],esc["base"],esc["alcista"]]],
        "Probabilidad":          ["20%", "55%", "25%"],
    })
    st.dataframe(df_dcf, hide_index=True, use_container_width=True)
    st.markdown(f"**Precio ponderado:** ${dcf_res.get('precio_ponderado',0):,.2f} &nbsp;|&nbsp; **Señal:** {dcf_res.get('señal','')}")
    if dcf_narrativa:
        st.markdown(dcf_narrativa)

# ── Sección 4: Técnico ────────────────────────────────────────────────────────
st.divider()
st.subheader("4. Análisis Técnico")
if not tech_res.get("error"):
    tc1, tc2, tc3, tc4 = st.columns(4)
    tc1.metric("Tendencia",     tech_res.get("tendencia",{}).get("tendencia","N/D"))
    tc2.metric("RSI (14)",      f"{tech_res.get('rsi',{}).get('valor','N/D')}")
    tc3.metric("Score Técnico", f"{tech_res.get('score',{}).get('score','N/D')}/10")
    tc4.metric("MACD",          tech_res.get("macd",{}).get("señal","N/D"))
    if tech_narrativa:
        st.markdown(tech_narrativa)

# ── Sección 5: Retornos ───────────────────────────────────────────────────────
st.divider()
st.subheader("5. Retornos Históricos")
df_rets = pd.DataFrame({
    "Período": ["1 Día","5 Días","1 Mes","3 Meses","6 Meses","1 Año","YTD"],
    "Retorno": [
        f"{rets.get('1d','N/D')}%" if rets.get('1d') else "N/D",
        f"{rets.get('5d','N/D')}%" if rets.get('5d') else "N/D",
        f"{rets.get('1m','N/D')}%" if rets.get('1m') else "N/D",
        f"{rets.get('3m','N/D')}%" if rets.get('3m') else "N/D",
        f"{rets.get('6m','N/D')}%" if rets.get('6m') else "N/D",
        f"{rets.get('1y','N/D')}%" if rets.get('1y') else "N/D",
        f"{rets.get('ytd','N/D')}%" if rets.get('ytd') else "N/D",
    ],
    "Volatilidad Anual": [f"{rets.get('vol_anual_pct','N/D')}%"]+[""]*6,
    "Máx. Drawdown 1Y":  [f"{rets.get('max_drawdown_pct','N/D')}%"]+[""]*6,
})
st.dataframe(df_rets, hide_index=True, use_container_width=True)

# ── Sección 6: Noticias ───────────────────────────────────────────────────────
st.divider()
st.subheader("6. Noticias Recientes")
for n in datos.get("noticias", [])[:5]:
    st.markdown(f"- **[{n['titulo']}]({n['url']})** — *{n['fuente']}* {n['fecha']}")

# ── Señal final ───────────────────────────────────────────────────────────────
st.divider()
st.subheader("7. Señal de Inversión Final")
st.code(señal["bloque"], language=None)

# ── Descargar JSON ────────────────────────────────────────────────────────────
st.divider()
reporte_json = {
    "ticker": ticker, "nombre": nombre, "fecha": datetime.now().isoformat(),
    "precio": datos["precio"], "fundamentales": fund,
    "piotroski": {"score": piotroski.get("score"), "interpretacion": piotroski.get("interpretacion")},
    "roic_wacc": {"roic": roic_wacc.get("roic_pct"), "wacc": roic_wacc.get("wacc_pct"), "eva_mm": roic_wacc.get("eva_mm")},
    "dcf": {"precio_ponderado": dcf_res.get("precio_ponderado"), "señal": dcf_res.get("señal")} if not dcf_res.get("error") else {"error": dcf_res["error"]},
    "tecnico": {"score": tech_res.get("score",{}).get("score"), "tendencia": tech_res.get("tendencia",{}).get("tendencia")},
    "señal_final": {"score": señal["score"], "accion": señal["accion"], "señal": señal["señal"]},
    "consenso": datos.get("consenso", {}),
}
st.download_button(
    "⬇️ Descargar reporte JSON",
    data=json.dumps(reporte_json, ensure_ascii=False, indent=2),
    file_name=f"investskill_{ticker}_{datetime.now().strftime('%Y%m%d_%H%M')}.json",
    mime="application/json",
    type="primary",
)

st.caption("⚠️ Análisis educativo. No es asesoramiento financiero. Verifica los datos antes de invertir.")
