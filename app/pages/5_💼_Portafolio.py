"""InvestSkill — Página: Portafolio personal"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np

from core.data.fetcher import FetcherMercado, formatear_numero

st.set_page_config(page_title="Mi Portafolio — InvestSkill", page_icon="💼", layout="wide")
st.title("💼 Mi Portafolio")
st.caption("Agrega tus posiciones para ver el rendimiento en tiempo real")

# ── Gestión del portafolio ─────────────────────────────────────────────────────
if "portafolio" not in st.session_state:
    st.session_state["portafolio"] = [
        {"ticker": "AAPL",    "acciones": 10, "precio_compra": 150.00, "sector": "Tecnología"},
        {"ticker": "MSFT",    "acciones": 5,  "precio_compra": 310.00, "sector": "Tecnología"},
        {"ticker": "JNJ",     "acciones": 8,  "precio_compra": 155.00, "sector": "Salud"},
        {"ticker": "BRK-B",   "acciones": 15, "precio_compra": 310.00, "sector": "Finanzas"},
        {"ticker": "BTC-USD", "acciones": 0.05, "precio_compra": 42000.00, "sector": "Crypto"},
    ]

# Editor de portafolio
with st.expander("✏️ Editar portafolio", expanded=False):
    df_port = pd.DataFrame(st.session_state["portafolio"])
    edited = st.data_editor(
        df_port,
        num_rows="dynamic",
        use_container_width=True,
        column_config={
            "ticker":        st.column_config.TextColumn("Ticker"),
            "acciones":      st.column_config.NumberColumn("Acciones", format="%.4f"),
            "precio_compra": st.column_config.NumberColumn("Precio compra", format="$%.2f"),
            "sector":        st.column_config.TextColumn("Sector"),
        },
    )
    if st.button("💾 Guardar cambios", type="primary"):
        st.session_state["portafolio"] = edited.to_dict("records")
        st.cache_data.clear()
        st.rerun()


@st.cache_data(ttl=300, show_spinner=False)
def obtener_precios_portafolio(tickers: tuple) -> dict:
    precios = {}
    for t in tickers:
        try:
            f = FetcherMercado(t)
            p = f.precio_actual()
            precios[t] = p
        except Exception:
            precios[t] = {}
    return precios


portfolio = st.session_state["portafolio"]
tickers_port = tuple([p["ticker"] for p in portfolio])

with st.spinner("Actualizando precios en tiempo real..."):
    precios = obtener_precios_portafolio(tickers_port)

# ── Calcular P&L ──────────────────────────────────────────────────────────────
rows = []
for pos in portfolio:
    tick   = pos["ticker"]
    nshares = pos["acciones"]
    pc     = pos["precio_compra"]
    sector = pos.get("sector", "N/D")
    pd_act = precios.get(tick, {})
    precio_act = pd_act.get("precio") or pc

    valor_actual  = precio_act * nshares
    costo_base    = pc * nshares
    ganancia_abs  = valor_actual - costo_base
    ganancia_pct  = (ganancia_abs / costo_base * 100) if costo_base else 0
    cambio_dia    = pd_act.get("cambio_pct", 0)

    rows.append({
        "Ticker":        tick,
        "Sector":        sector,
        "Acciones":      nshares,
        "P. Compra":     pc,
        "P. Actual":     round(precio_act, 4),
        "Valor ($)":     round(valor_actual, 2),
        "Costo Base ($)": round(costo_base, 2),
        "G/P ($)":       round(ganancia_abs, 2),
        "G/P (%)":       round(ganancia_pct, 2),
        "Cambio Hoy (%)": round(cambio_dia, 2),
    })

df_result = pd.DataFrame(rows)
valor_total   = df_result["Valor ($)"].sum()
costo_total   = df_result["Costo Base ($)"].sum()
ganancia_total = valor_total - costo_total
ret_total_pct  = (ganancia_total / costo_total * 100) if costo_total else 0

# ── KPIs del portafolio ───────────────────────────────────────────────────────
k1, k2, k3, k4 = st.columns(4)
k1.metric("Valor Total",   formatear_numero(valor_total, prefijo="$"))
k2.metric("Costo Base",    formatear_numero(costo_total, prefijo="$"))
k3.metric("Ganancia/Pérdida",
          formatear_numero(ganancia_total, prefijo="$"),
          delta=f"{ret_total_pct:.2f}%",
          delta_color="normal" if ganancia_total >= 0 else "inverse")
k4.metric("Rendimiento Total", f"{ret_total_pct:.2f}%")

# ── Tabla de posiciones ───────────────────────────────────────────────────────
st.subheader("Posiciones")

def highlight_ganancia(val):
    try:
        v = float(val)
        if v > 0:  return "color: #00c851; font-weight: 700"
        elif v < 0: return "color: #ff4444; font-weight: 700"
    except Exception:
        pass
    return ""

styled_df = df_result.style \
    .applymap(highlight_ganancia, subset=["G/P ($)", "G/P (%)", "Cambio Hoy (%)"]) \
    .format({
        "P. Compra": "${:.4f}", "P. Actual": "${:.4f}",
        "Valor ($)": "${:,.2f}", "Costo Base ($)": "${:,.2f}",
        "G/P ($)": "${:,.2f}", "G/P (%)": "{:.2f}%",
        "Cambio Hoy (%)": "{:.2f}%", "Acciones": "{:.4f}",
    })

st.dataframe(styled_df, hide_index=True, use_container_width=True)

# ── Gráficos ──────────────────────────────────────────────────────────────────
st.divider()
gc1, gc2 = st.columns(2)

with gc1:
    st.subheader("Distribución por activo")
    fig_pie = px.pie(df_result, values="Valor ($)", names="Ticker",
                     template="plotly_dark", hole=0.4,
                     color_discrete_sequence=px.colors.qualitative.Set3)
    fig_pie.update_traces(textposition="inside", textinfo="percent+label")
    fig_pie.update_layout(height=320, margin=dict(l=0, r=0, t=10, b=0), showlegend=True)
    st.plotly_chart(fig_pie, use_container_width=True)

with gc2:
    st.subheader("Distribución por sector")
    df_sector = df_result.groupby("Sector")["Valor ($)"].sum().reset_index()
    fig_sec = px.bar(df_sector, x="Sector", y="Valor ($)",
                     template="plotly_dark", color="Sector",
                     color_discrete_sequence=px.colors.qualitative.Pastel)
    fig_sec.update_layout(height=320, margin=dict(l=0, r=0, t=10, b=0), showlegend=False)
    st.plotly_chart(fig_sec, use_container_width=True)

# ── Waterfall de G/P por posición ────────────────────────────────────────────
st.subheader("Ganancia/Pérdida por posición")
colores_wf = ["#00c851" if v >= 0 else "#ff4444" for v in df_result["G/P ($)"]]
fig_wf = go.Figure(go.Bar(
    x=df_result["Ticker"], y=df_result["G/P ($)"],
    marker_color=colores_wf, text=[f"${v:,.0f}" for v in df_result["G/P ($)"]],
    textposition="outside",
))
fig_wf.update_layout(template="plotly_dark", height=300,
                      margin=dict(l=0, r=0, t=10, b=0),
                      yaxis_title="USD")
st.plotly_chart(fig_wf, use_container_width=True)

# ── Rendimiento histórico del portafolio ──────────────────────────────────────
st.divider()
st.subheader("Rendimiento histórico del portafolio (últimos 12 meses)")

@st.cache_data(ttl=300, show_spinner=False)
def hist_portafolio(tickers: tuple, pesos: tuple):
    dfs = {}
    for t in tickers:
        try:
            f = FetcherMercado(t)
            h = f.precio_historico("1y")
            if not h.empty:
                dfs[t] = h["Close"]
        except Exception:
            pass
    if not dfs:
        return pd.DataFrame()
    df_precios = pd.DataFrame(dfs).dropna()
    ret = df_precios.pct_change().dropna()
    # Retorno ponderado
    pesos_arr = np.array(pesos)
    pesos_arr = pesos_arr / pesos_arr.sum()
    ret_port = (ret * pesos_arr).sum(axis=1)
    return (1 + ret_port).cumprod() * 100 - 100


tickers_val = [p["ticker"] for p in portfolio]
pesos_val   = [p["acciones"] * p["precio_compra"] for p in portfolio]
hist_p = hist_portafolio(tuple(tickers_val), tuple(pesos_val))

if not hist_p.empty:
    fig_hist = go.Figure()
    color_line = "#00c851" if float(hist_p.iloc[-1]) >= 0 else "#ff4444"
    fig_hist.add_trace(go.Scatter(
        x=hist_p.index, y=hist_p.values,
        fill="tozeroy", fillcolor=f"rgba({'0,200,81' if color_line=='#00c851' else '255,68,68'},0.1)",
        line=dict(color=color_line, width=2), name="Retorno Portafolio (%)",
    ))
    fig_hist.add_hline(y=0, line_dash="dot", line_color="#8892a4")
    fig_hist.update_layout(template="plotly_dark", height=300,
                            margin=dict(l=0, r=0, t=10, b=0),
                            yaxis_title="Retorno acumulado (%)")
    st.plotly_chart(fig_hist, use_container_width=True)
else:
    st.info("No hay suficientes datos históricos para mostrar el rendimiento del portafolio.")
