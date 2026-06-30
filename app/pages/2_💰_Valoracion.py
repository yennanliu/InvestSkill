"""InvestSkill — Página: Valoración DCF y múltiplos"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import plotly.graph_objects as go
import pandas as pd
import numpy as np

from core.data.fetcher import FetcherMercado, formatear_numero
from core.analysis.valuation import calcular_dcf, valoracion_multiples, tabla_sensibilidad, score_valoracion
from core.analysis.fundamental import calcular_piotroski
from core.ai.analyst import narrativa_dcf

st.set_page_config(page_title="Valoración — InvestSkill", page_icon="💰", layout="wide")
st.title("💰 Valoración: DCF y Múltiplos")

# ── Input ─────────────────────────────────────────────────────────────────────
col_t, col_b = st.columns([4, 1])
with col_t:
    ticker = st.text_input("Ticker", value=st.session_state.get("ticker_actual", "AAPL")).strip().upper()
with col_b:
    st.write("")
    st.button("Analizar", type="primary", use_container_width=True)

# Parámetros del DCF
with st.expander("⚙️ Ajustar parámetros del DCF"):
    p1, p2, p3, p4 = st.columns(4)
    crec_f1 = p1.slider("Crecimiento Fase 1 (años 1-5) %", 0, 50, 10) / 100
    crec_f2 = p2.slider("Crecimiento Fase 2 (años 6-10) %", 0, 20, 4) / 100
    g_term  = p3.slider("Crecimiento terminal %", 0, 5, 2) / 100
    wacc_ov = p4.slider("WACC personalizado % (0=auto)", 0, 20, 0) / 100
    wacc_override = wacc_ov if wacc_ov > 0 else None


@st.cache_data(ttl=3600, show_spinner=False)
def cargar(ticker):
    f = FetcherMercado(ticker)
    fund     = f.fundamentales()
    piot_raw = f.datos_piotroski()
    return fund, piot_raw


with st.spinner(f"Cargando datos de {ticker}..."):
    fund, piot_raw = cargar(ticker)

# ── DCF ───────────────────────────────────────────────────────────────────────
st.subheader("Modelo DCF — Flujo de Caja Descontado")
dcf = calcular_dcf(fund, piot_raw, crec_f1, crec_f2, wacc_override=wacc_override, g_terminal=g_term)

if dcf.get("error"):
    st.error(f"DCF no disponible: {dcf['error']}")
else:
    # Escenarios
    esc = dcf["escenarios"]
    cols_e = st.columns(3)
    for i, (nombre, col) in enumerate(zip(["bajista", "base", "alcista"], cols_e)):
        e = esc[nombre]
        vi = e["valor_intrinseco"]
        pm = e["precio_mercado"] or 0
        mg = e["margen_seguridad_pct"]
        color = "#00c851" if (mg and mg > 0) else "#ff4444"
        etiqueta = {"bajista": "🐻 Caso Bajista", "base": "📊 Caso Base", "alcista": "🐂 Caso Alcista"}
        with col:
            st.markdown(
                f"<div style='background:#1e2530; border:1px solid {'#00c851' if nombre=='alcista' else '#ff4444' if nombre=='bajista' else '#ffc107'}; "
                f"border-radius:10px; padding:16px; text-align:center'>"
                f"<div style='color:#8892a4; font-size:13px; margin-bottom:8px'>{etiqueta[nombre]}</div>"
                f"<div style='font-size:28px; font-weight:700; color:#fff'>${vi:,.2f}</div>"
                f"<div style='color:{color}; font-size:14px; margin-top:4px'>"
                f"{'▲' if (mg and mg>0) else '▼'} Margen: {abs(mg or 0):.1f}%</div>"
                f"<div style='color:#8892a4; font-size:12px; margin-top:8px'>"
                f"WACC: {e['wacc_pct']}% | g: {e['crec_fase1_pct']}%/{e['crec_fase2_pct']}%</div>"
                f"<div style='color:#8892a4; font-size:12px'>Prob: {int(e['probabilidad']*100)}%</div>"
                f"</div>",
                unsafe_allow_html=True,
            )

    st.markdown(f"**Precio mercado:** ${dcf.get('precio_mercado', 0):,.2f} &nbsp;|&nbsp; "
                f"**Precio ponderado (prob.):** ${dcf.get('precio_ponderado', 0):,.2f}")
    st.markdown(
        f"<div style='background:{dcf['color']}22; border-left:4px solid {dcf['color']}; "
        f"padding:10px 16px; border-radius:4px'>{dcf['señal']}</div>",
        unsafe_allow_html=True,
    )

    # Gráfico de FCFs proyectados
    base_fcfs = esc["base"]["fcfs_proyectados"]
    if base_fcfs:
        df_fcf = pd.DataFrame(base_fcfs)
        fig_fcf = go.Figure()
        fig_fcf.add_trace(go.Bar(x=df_fcf["año"], y=df_fcf["fcf"],
                                  name="FCF Proyectado (MM)", marker_color="#1a73e8"))
        fig_fcf.add_trace(go.Scatter(x=df_fcf["año"], y=df_fcf["vp"],
                                      name="VP Descontado (MM)", mode="lines+markers",
                                      line=dict(color="#ffc107", width=2)))
        fig_fcf.update_layout(template="plotly_dark", height=300, barmode="group",
                               margin=dict(l=0, r=0, t=10, b=0),
                               xaxis_title="Año", yaxis_title="MM USD")
        st.plotly_chart(fig_fcf, use_container_width=True)

    # Tabla de sensibilidad
    st.divider()
    st.subheader("Tabla de Sensibilidad — Valor Intrínseco por Acción")
    st.caption("Filas: WACC | Columnas: Tasa de crecimiento terminal")

    with st.spinner("Calculando tabla de sensibilidad..."):
        tabla = tabla_sensibilidad(fund, piot_raw)

    df_sens = pd.DataFrame(tabla).T
    precio_actual = fund.get("precio") or 0

    def colorear(val):
        if val is None: return ""
        try:
            v = float(val)
            if v > precio_actual * 1.3:    return "background-color: #004d1a; color: #00c851"
            elif v > precio_actual * 1.1:  return "background-color: #003311; color: #80d9a0"
            elif v > precio_actual * 0.9:  return "background-color: #332a00; color: #ffc107"
            else:                           return "background-color: #330000; color: #ff4444"
        except Exception:
            return ""

    styled = df_sens.style.applymap(colorear).format("{:.2f}", na_rep="N/D")
    st.dataframe(styled, use_container_width=True)

    # Narrativa IA
    st.divider()
    if st.button("🤖 Interpretar DCF con IA"):
        with st.spinner("Analizando..."):
            texto = narrativa_dcf(dcf, ticker)
        st.markdown(texto)

# ── Valoración por múltiplos ──────────────────────────────────────────────────
st.divider()
st.subheader("Valoración por Múltiplos de Mercado")
mult = valoracion_multiples(fund)

if mult["metodos"]:
    cols_m = st.columns(len(mult["metodos"]))
    for i, (clave, m) in enumerate(mult["metodos"].items()):
        vi = m["valor"]
        pm = mult["precio_mercado"] or 0
        diff_pct = round((vi - pm) / pm * 100, 1) if pm else None
        color = "#00c851" if (diff_pct and diff_pct > 0) else "#ff4444"
        with cols_m[i]:
            st.markdown(
                f"<div style='background:#1e2530; border-radius:8px; padding:12px; text-align:center'>"
                f"<div style='color:#8892a4; font-size:11px'>{m['metodo']}</div>"
                f"<div style='color:#fff; font-size:22px; font-weight:700; margin:4px 0'>${vi:,.2f}</div>"
                f"<div style='color:{color}; font-size:13px'>{'▲' if (diff_pct and diff_pct>0) else '▼'} {abs(diff_pct or 0):.1f}%</div>"
                f"<div style='color:#8892a4; font-size:11px; margin-top:4px'>{m['unidad_base']}: {m['base']}</div>"
                f"</div>",
                unsafe_allow_html=True,
            )

    precio_prom = mult.get("precio_promedio")
    if precio_prom:
        st.markdown(
            f"**Precio promedio (todos los métodos):** ${precio_prom:,.2f} &nbsp;|&nbsp; "
            f"**Precio mercado:** ${mult.get('precio_mercado', 0):,.2f} &nbsp;|&nbsp; "
            f"**Upside estimado:** {mult.get('upside_pct', 'N/D')}%"
        )

    # Football field chart
    pm = mult.get("precio_mercado") or 0
    fig_ff = go.Figure()
    colores_ff = ["#1a73e8", "#00c851", "#ffc107", "#ff7043"]
    for i, (clave, m) in enumerate(mult["metodos"].items()):
        fig_ff.add_trace(go.Bar(
            y=[m["metodo"]], x=[m["valor"]],
            orientation="h", name=m["metodo"],
            marker_color=colores_ff[i % len(colores_ff)],
        ))
    if pm:
        fig_ff.add_vline(x=pm, line_dash="dash", line_color="#ffffff",
                         annotation_text=f"Precio actual ${pm:.2f}", annotation_position="top right")
    fig_ff.update_layout(template="plotly_dark", height=200,
                          margin=dict(l=0, r=0, t=10, b=0), showlegend=False,
                          xaxis_title="Valor por acción (USD)")
    st.plotly_chart(fig_ff, use_container_width=True)
else:
    st.info("No hay suficientes datos para calcular valoración por múltiplos.")
