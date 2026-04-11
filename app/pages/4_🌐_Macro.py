"""InvestSkill — Página: Economía Macro (FRED)"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from datetime import datetime

from core.data.macro import dashboard_macro, curva_rendimientos, condiciones_mercado
from core.ai.analyst import narrativa_macro

st.set_page_config(page_title="Economía Macro — InvestSkill", page_icon="🌐", layout="wide")
st.title("🌐 Economía Macroeconómica — EE.UU.")
st.caption("Fuente: FRED (Federal Reserve Bank of St. Louis) — datos gratuitos y en tiempo real")


@st.cache_data(ttl=3600, show_spinner=False)
def cargar_macro():
    return condiciones_mercado()


@st.cache_data(ttl=3600, show_spinner=False)
def cargar_curva():
    return curva_rendimientos()


@st.cache_data(ttl=3600, show_spinner=False)
def cargar_dashboard():
    return dashboard_macro()


with st.spinner("Cargando indicadores macroeconómicos desde FRED..."):
    macro    = cargar_macro()
    curva    = cargar_curva()
    dash     = cargar_dashboard()

# ── Semáforo macro ────────────────────────────────────────────────────────────
regimen = macro.get("regimen_macro", "No disponible")
curva_inv = macro.get("curva_invertida", False)
color_reg = "#00c851" if "Acomodaticio" in regimen else "#ff4444" if "Restrictivo" in regimen else "#ffc107"

st.markdown(
    f"<div style='background:{color_reg}22; border:2px solid {color_reg}; border-radius:12px; "
    f"padding:16px; margin-bottom:16px'>"
    f"<b style='color:{color_reg}; font-size:16px'>Régimen Macro Actual:</b> "
    f"<span style='color:#fff; font-size:15px'>{regimen}</span>"
    f"{'<br><b style=\"color:#ff4444\">⚠️ CURVA INVERTIDA — señal histórica de recesión</b>' if curva_inv else ''}"
    f"</div>",
    unsafe_allow_html=True,
)

# ── KPIs principales ──────────────────────────────────────────────────────────
m1, m2, m3, m4, m5 = st.columns(5)
m1.metric("Desempleo", f"{macro.get('desempleo_pct', 'N/D')}%")
m2.metric("Inflación YoY", f"{macro.get('inflacion_yoy_pct', 'N/D')}%")
m3.metric("Fed Funds Rate", f"{macro.get('fed_funds_pct', 'N/D')}%")
m4.metric("Rendimiento T10Y", f"{macro.get('t10y_pct', 'N/D')}%")
m5.metric("Spread 10Y-2Y",
          f"{macro.get('spread_10y_2y', 'N/D')} bps" if macro.get("spread_10y_2y") is not None else "N/D",
          delta=macro.get("spread_10y_2y"), delta_color="inverse")

# ── Curva de rendimientos ─────────────────────────────────────────────────────
st.divider()
st.subheader("Curva de Rendimientos del Tesoro")
puntos_curva = curva.get("puntos", {})

if puntos_curva:
    orden = ["3M", "6M", "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y"]
    x_vals = [p for p in orden if p in puntos_curva]
    y_vals = [puntos_curva[p] for p in x_vals]

    color_curva = "#ff4444" if curva.get("invertida") else "#00c851"
    fig_curva = go.Figure()
    fig_curva.add_trace(go.Scatter(
        x=x_vals, y=y_vals,
        mode="lines+markers+text",
        text=[f"{v:.2f}%" for v in y_vals],
        textposition="top center",
        line=dict(color=color_curva, width=3),
        marker=dict(size=10, color=color_curva),
        fill="tozeroy", fillcolor=f"rgba({'255,68,68' if curva.get('invertida') else '0,200,81'},0.1)",
        name="Rendimiento",
    ))
    fig_curva.update_layout(
        template="plotly_dark", height=300,
        margin=dict(l=0, r=0, t=10, b=0),
        yaxis_title="Rendimiento (%)",
        xaxis_title="Vencimiento",
        annotations=[dict(
            text=f"Spread 10Y-2Y: {curva.get('spread_10y_2y')} bps — {curva.get('señal')}",
            xref="paper", yref="paper", x=0, y=1.05,
            showarrow=False, font=dict(color=color_curva, size=13),
        )],
    )
    st.plotly_chart(fig_curva, use_container_width=True)
else:
    st.info("Curva de rendimientos no disponible (requiere pandas-datareader).")

# ── Series temporales de indicadores ─────────────────────────────────────────
st.divider()
st.subheader("Indicadores en el Tiempo")

indicadores_disp = {k: v for k, v in dash.items() if v.get("valor") is not None}
if indicadores_disp:
    indicador_sel = st.selectbox(
        "Selecciona indicador",
        options=list(indicadores_disp.keys()),
        format_func=lambda k: indicadores_disp[k]["descripcion"],
    )
    ind_data = indicadores_disp.get(indicador_sel, {})
    serie = ind_data.get("serie", {})

    if serie:
        df_serie = pd.DataFrame(
            [(pd.to_datetime(str(k)), v) for k, v in serie.items()],
            columns=["Fecha", "Valor"]
        ).sort_values("Fecha")

        fig_ts = px.line(df_serie, x="Fecha", y="Valor",
                         title=ind_data["descripcion"],
                         template="plotly_dark",
                         color_discrete_sequence=["#1a73e8"])
        fig_ts.update_layout(height=300, margin=dict(l=0, r=0, t=30, b=0))
        st.plotly_chart(fig_ts, use_container_width=True)

        c_val, c_mom, c_anual = st.columns(3)
        c_val.metric("Último valor", ind_data.get("valor"), help=f"Fecha: {ind_data.get('fecha')}")
        c_mom.metric("Cambio mensual", ind_data.get("cambio_mom"),
                     delta=ind_data.get("cambio_mom") if ind_data.get("cambio_mom") else None)
        c_anual.metric("Cambio anual", ind_data.get("cambio_anual"),
                        delta=ind_data.get("cambio_anual") if ind_data.get("cambio_anual") else None)
    else:
        st.info("Serie temporal no disponible para este indicador.")
else:
    st.warning("No se pudieron cargar indicadores FRED. Verifica que pandas-datareader esté instalado.")

# ── Narrativa IA ──────────────────────────────────────────────────────────────
st.divider()
if st.button("🤖 Análisis macro con IA"):
    with st.spinner("Analizando condiciones macro..."):
        texto = narrativa_macro(macro)
    st.markdown(texto)
