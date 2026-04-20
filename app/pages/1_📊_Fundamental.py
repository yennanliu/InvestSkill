"""InvestSkill — Página: Análisis Fundamental completo"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

from core.data.fetcher import FetcherMercado, formatear_numero
from core.analysis.fundamental import calcular_piotroski, calcular_roic_wacc, calidad_ganancias

st.set_page_config(page_title="Análisis Fundamental — InvestSkill", page_icon="📊", layout="wide")
st.title("📊 Análisis Fundamental")

# ── Input ─────────────────────────────────────────────────────────────────────
col_t, col_b = st.columns([4, 1])
with col_t:
    ticker = st.text_input("Ticker", value=st.session_state.get("ticker_actual", "AAPL"),
                            placeholder="AAPL, MSFT, VALE3.SA...").strip().upper()
with col_b:
    st.write("")
    analizar = st.button("Analizar", type="primary", use_container_width=True)


@st.cache_data(ttl=3600, show_spinner=False)
def cargar(ticker):
    f = FetcherMercado(ticker)
    return {
        "precio":    f.precio_actual(),
        "fund":      f.fundamentales(),
        "estados":   f.estados_financieros(),
        "piot_raw":  f.datos_piotroski(),
    }


with st.spinner(f"Cargando datos fundamentales de {ticker}..."):
    datos = cargar(ticker)

fund     = datos["fund"]
estados  = datos["estados"]
piot_raw = datos["piot_raw"]
precio_d = datos["precio"]

# ── Piotroski F-Score ─────────────────────────────────────────────────────────
st.subheader("Piotroski F-Score")
piot = calcular_piotroski(piot_raw)

if piot.get("error"):
    st.warning(f"No se pudo calcular Piotroski: {piot['error']}")
else:
    col_score, col_detalle = st.columns([1, 3])
    with col_score:
        score = piot["score"]
        color = piot["color"]
        st.markdown(
            f"<div style='text-align:center; background:{color}22; border:3px solid {color}; "
            f"border-radius:16px; padding:24px'>"
            f"<div style='font-size:56px; font-weight:900; color:{color}'>{score}</div>"
            f"<div style='color:#8892a4; font-size:14px'>de 9 puntos</div>"
            f"<div style='color:{color}; font-size:13px; margin-top:8px'>{piot['interpretacion']}</div>"
            f"</div>",
            unsafe_allow_html=True,
        )

    with col_detalle:
        criterios = piot["criterios"]
        filas = []
        for clave, c in criterios.items():
            filas.append({
                "Criterio":    c["descripcion"],
                "Valor":       f"{c['valor']} {c.get('unidad','')}" if c["valor"] is not None else "N/D",
                "Resultado":   "✅ PASA" if c["pasa"] else "❌ FALLA",
                "Puntos":      c["puntos"],
            })
        df_piot = pd.DataFrame(filas)
        st.dataframe(df_piot, hide_index=True, use_container_width=True,
                     column_config={"Puntos": st.column_config.NumberColumn(format="%d")})

# ── ROIC / WACC / EVA ─────────────────────────────────────────────────────────
st.divider()
st.subheader("ROIC / WACC / EVA")
rw = calcular_roic_wacc(fund, piot_raw)

r1, r2, r3, r4 = st.columns(4)
r1.metric("ROIC", f"{rw.get('roic_pct', 'N/D')}%" if rw.get("roic_pct") else "N/D")
r2.metric("WACC", f"{rw.get('wacc_pct', 'N/D')}%")
r3.metric("Spread ROIC-WACC",
          f"{rw.get('spread_roic_wacc', 'N/D')}pp" if rw.get("spread_roic_wacc") is not None else "N/D",
          delta=rw.get("spread_roic_wacc"))
r4.metric("EVA", formatear_numero(rw.get("eva_mm"), prefijo="$") + "M" if rw.get("eva_mm") else "N/D")

st.markdown(
    f"<div style='background:{rw.get('color','#333')}22; border-left:4px solid {rw.get('color','#333')}; "
    f"padding:10px 16px; border-radius:4px; margin-top:8px'>{rw.get('señal','')}</div>",
    unsafe_allow_html=True,
)

# WACC desglose
with st.expander("Desglose WACC"):
    wd1, wd2, wd3 = st.columns(3)
    wd1.metric("Costo Equity (Ke)", f"{rw.get('ke_pct')}%")
    wd2.metric("Costo Deuda (Kd)", f"{rw.get('kd_pct')}%")
    wd3.metric("Peso Equity / Deuda", f"{rw.get('peso_equity')}% / {rw.get('peso_deuda')}%")
    st.caption(f"Beta: {rw.get('beta')} | Rf: {rw.get('tasa_libre_riesgo_pct')}% | Prima riesgo: {rw.get('prima_riesgo_pct')}%")

# ── Estados Financieros ───────────────────────────────────────────────────────
st.divider()
st.subheader("Estados Financieros (últimos 4 años)")

tabs_est = st.tabs(["Cuenta de Resultados", "Balance General", "Flujo de Caja"])

with tabs_est[0]:
    ingresos = estados.get("ingresos", {})
    años = ingresos.get("años", [])
    if años:
        metricas_p = {
            "Ingresos Totales":  ingresos.get("ingresos_totales", {}),
            "Beneficio Bruto":   ingresos.get("beneficio_bruto", {}),
            "EBITDA":            ingresos.get("ebitda", {}),
            "EBIT":              ingresos.get("ebit", {}),
            "Beneficio Neto":    ingresos.get("beneficio_neto", {}),
            "EPS Básico":        ingresos.get("eps_basico", {}),
            "EPS Diluido":       ingresos.get("eps_diluido", {}),
        }
        filas_p = []
        for nombre, serie in metricas_p.items():
            fila = {"Métrica": nombre}
            fila.update(serie)
            filas_p.append(fila)
        df_p = pd.DataFrame(filas_p).set_index("Métrica")
        st.dataframe(df_p, use_container_width=True)

        # Gráfico de evolución
        ig = ingresos.get("ingresos_totales", {})
        ng = ingresos.get("beneficio_neto", {})
        if any(v is not None for v in ig.values()):
            fig = go.Figure()
            fig.add_trace(go.Bar(x=list(ig.keys()), y=[v or 0 for v in ig.values()],
                                  name="Ingresos", marker_color="#1a73e8"))
            fig.add_trace(go.Bar(x=list(ng.keys()), y=[v or 0 for v in ng.values()],
                                  name="Beneficio Neto", marker_color="#00c851"))
            fig.update_layout(template="plotly_dark", height=300, barmode="group",
                               margin=dict(l=0, r=0, t=10, b=0), yaxis_title="MM USD")
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Estados de resultados no disponibles para este activo.")

with tabs_est[1]:
    balance = estados.get("balance", {})
    años_b = balance.get("años", [])
    if años_b:
        metricas_b = {
            "Activos Totales":      balance.get("activos_totales", {}),
            "Activos Corrientes":   balance.get("activos_corrientes", {}),
            "Caja y Equivalentes":  balance.get("caja", {}),
            "Inventario":           balance.get("inventario", {}),
            "Pasivos Totales":      balance.get("pasivos_totales", {}),
            "Pasivos Corrientes":   balance.get("pasivos_corrientes", {}),
            "Deuda Largo Plazo":    balance.get("deuda_largo_plazo", {}),
            "Patrimonio":           balance.get("patrimonio", {}),
        }
        filas_b = [{"Métrica": n, **s} for n, s in metricas_b.items()]
        st.dataframe(pd.DataFrame(filas_b).set_index("Métrica"), use_container_width=True)
    else:
        st.info("Balance general no disponible.")

with tabs_est[2]:
    cf = estados.get("flujo_caja", {})
    años_c = cf.get("años", [])
    if años_c:
        metricas_c = {
            "Flujo Operativo":      cf.get("flujo_operativo", {}),
            "CapEx":                cf.get("capex", {}),
            "Flujo Libre (FCF)":    cf.get("flujo_libre", {}),
            "Dividendos Pagados":   cf.get("dividendos_pagados", {}),
            "Recompra Acciones":    cf.get("recompra_acciones", {}),
        }
        filas_c = [{"Métrica": n, **s} for n, s in metricas_c.items()]
        st.dataframe(pd.DataFrame(filas_c).set_index("Métrica"), use_container_width=True)

        # Gráfico FCF
        fcf_serie = cf.get("flujo_libre", {})
        if any(v is not None for v in fcf_serie.values()):
            fig_cf = px.bar(x=list(fcf_serie.keys()), y=[v or 0 for v in fcf_serie.values()],
                            title="Flujo Libre de Caja (FCF) — MM USD",
                            color_discrete_sequence=["#00c851"], template="plotly_dark")
            fig_cf.update_layout(height=250, margin=dict(l=0,r=0,t=30,b=0), showlegend=False)
            st.plotly_chart(fig_cf, use_container_width=True)
    else:
        st.info("Flujo de caja no disponible.")

# ── Calidad de ganancias ───────────────────────────────────────────────────────
st.divider()
st.subheader("Calidad de Ganancias")
cg = calidad_ganancias(fund, piot_raw)
cg1, cg2 = st.columns(2)
with cg1:
    st.metric("Tasa de Conversión a Caja (CCR)", f"{cg.get('tasa_conversion_caja', 'N/D')}x")
    st.caption(cg.get("ccr_señal", ""))
with cg2:
    st.metric("Ratio de Accruals", f"{cg.get('ratio_accruals_pct', 'N/D')}%")
    st.caption(cg.get("accruals_señal", ""))
