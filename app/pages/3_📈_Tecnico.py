"""InvestSkill — Página: Análisis Técnico"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import streamlit as st
import plotly.graph_objects as go
import pandas as pd

from core.data.fetcher import FetcherMercado
from core.analysis.technical import analizar, retornos_historicos
from core.ai.analyst import narrativa_tecnica

st.set_page_config(page_title="Análisis Técnico — InvestSkill", page_icon="📈", layout="wide")
st.title("📈 Análisis Técnico")

col_t, col_b = st.columns([4, 1])
with col_t:
    ticker = st.text_input("Ticker", value=st.session_state.get("ticker_actual", "AAPL")).strip().upper()
with col_b:
    st.write("")
    st.button("Analizar", type="primary", use_container_width=True)

periodo = st.radio("Período histórico", ["3m", "6m", "1y", "2y"], index=2, horizontal=True)


@st.cache_data(ttl=300, show_spinner=False)
def cargar(ticker, periodo):
    f = FetcherMercado(ticker)
    return f.precio_historico(periodo)


with st.spinner(f"Cargando datos técnicos de {ticker}..."):
    hist = cargar(ticker, periodo)

if hist is None or hist.empty:
    st.error("No hay datos históricos disponibles.")
    st.stop()

# Analizar
tech = analizar(hist)
rets = retornos_historicos(hist)

if tech.get("error"):
    st.error(tech["error"])
    st.stop()

# ── Score técnico ─────────────────────────────────────────────────────────────
sc = tech.get("score", {})
tend = tech.get("tendencia", {})

s1, s2, s3 = st.columns(3)
s1.markdown(
    f"<div style='background:{sc.get('color','#333')}22; border:2px solid {sc.get('color','#333')}; "
    f"border-radius:10px; padding:12px; text-align:center'>"
    f"<div style='color:#8892a4; font-size:12px'>SCORE TÉCNICO</div>"
    f"<div style='font-size:36px; font-weight:900; color:{sc.get('color')}'>{sc.get('score')}/10</div>"
    f"<div style='color:{sc.get('color')}; font-size:13px'>{sc.get('señal')}</div>"
    f"</div>",
    unsafe_allow_html=True,
)
s2.markdown(
    f"<div style='background:{tend.get('color','#333')}22; border:2px solid {tend.get('color','#333')}; "
    f"border-radius:10px; padding:12px; text-align:center'>"
    f"<div style='color:#8892a4; font-size:12px'>TENDENCIA</div>"
    f"<div style='font-size:24px; font-weight:700; color:{tend.get('color')}'>{tend.get('tendencia')}</div>"
    f"<div style='color:#8892a4; font-size:12px'>{'  '.join(tend.get('señales', []))}</div>"
    f"</div>",
    unsafe_allow_html=True,
)

rsi_d = tech.get("rsi", {})
s3.markdown(
    f"<div style='background:{rsi_d.get('color','#333')}22; border:2px solid {rsi_d.get('color','#333')}; "
    f"border-radius:10px; padding:12px; text-align:center'>"
    f"<div style='color:#8892a4; font-size:12px'>RSI (14)</div>"
    f"<div style='font-size:36px; font-weight:900; color:{rsi_d.get('color')}'>{rsi_d.get('valor', 'N/D')}</div>"
    f"<div style='color:{rsi_d.get('color')}; font-size:13px'>{rsi_d.get('señal')}</div>"
    f"</div>",
    unsafe_allow_html=True,
)

# ── Gráfico de velas + indicadores ───────────────────────────────────────────
st.divider()
fig = go.Figure()

# Velas
fig.add_trace(go.Candlestick(
    x=hist.index,
    open=hist["Open"], high=hist["High"],
    low=hist["Low"],  close=hist["Close"],
    name="OHLC",
    increasing_line_color="#00c851",
    decreasing_line_color="#ff4444",
))

mm = tech.get("medias_moviles", {})
if mm.get("sma50"):
    sma50 = hist["Close"].rolling(50).mean()
    fig.add_trace(go.Scatter(x=hist.index, y=sma50, name="SMA 50",
                              line=dict(color="#ffc107", width=1.5, dash="dot")))
if mm.get("sma200"):
    sma200 = hist["Close"].rolling(200).mean()
    fig.add_trace(go.Scatter(x=hist.index, y=sma200, name="SMA 200",
                              line=dict(color="#ff7043", width=1.5, dash="dot")))

# Bandas Bollinger
bb = tech.get("bollinger", {})
if bb.get("superior"):
    bb_up  = hist["Close"].rolling(20).mean() + 2 * hist["Close"].rolling(20).std()
    bb_dn  = hist["Close"].rolling(20).mean() - 2 * hist["Close"].rolling(20).std()
    fig.add_trace(go.Scatter(x=hist.index, y=bb_up, name="BB Superior",
                              line=dict(color="#7b68ee", width=1, dash="dash"), opacity=0.7))
    fig.add_trace(go.Scatter(x=hist.index, y=bb_dn, name="BB Inferior",
                              line=dict(color="#7b68ee", width=1, dash="dash"), opacity=0.7,
                              fill="tonexty", fillcolor="rgba(123,104,238,0.05)"))

fig.update_layout(
    template="plotly_dark", height=450,
    margin=dict(l=0, r=0, t=10, b=0),
    xaxis_rangeslider_visible=False,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
)
st.plotly_chart(fig, use_container_width=True)

# ── Indicadores en detalle ────────────────────────────────────────────────────
st.subheader("Indicadores Técnicos")

ind_cols = st.columns(4)
indicadores = [
    ("RSI (14)",       rsi_d.get("valor"), rsi_d.get("señal"), rsi_d.get("color")),
    ("MACD",           tech.get("macd",{}).get("macd"), tech.get("macd",{}).get("señal"), tech.get("macd",{}).get("color")),
    ("Estocástico %K", tech.get("estocastico",{}).get("k"), tech.get("estocastico",{}).get("señal"), "#ffc107"),
    ("ATR",            tech.get("atr",{}).get("pct"), tech.get("atr",{}).get("señal"), "#8892a4"),
]
for col, (label, valor, señal, color) in zip(ind_cols, indicadores):
    with col:
        st.metric(label=label, value=f"{valor:.2f}" if valor else "N/D")
        if señal:
            st.caption(f"<span style='color:{color}'>{señal}</span>", unsafe_allow_html=True)

# ── Retornos históricos ───────────────────────────────────────────────────────
st.divider()
st.subheader("Retornos Históricos")

ret_cols = st.columns(7)
ret_labels = [("1D", "1d"), ("5D", "5d"), ("1M", "1m"), ("3M", "3m"), ("6M", "6m"), ("1Y", "1y"), ("YTD", "ytd")]
for col, (label, key) in zip(ret_cols, ret_labels):
    val = rets.get(key)
    with col:
        if val is not None:
            delta_color = "normal" if val >= 0 else "inverse"
            st.metric(label=label, value=f"{val:.2f}%", delta=f"{val:.2f}%", delta_color=delta_color)
        else:
            st.metric(label=label, value="N/D")

r1, r2 = st.columns(2)
r1.metric("Volatilidad Anualizada", f"{rets.get('vol_anual_pct', 'N/D')}%" if rets.get("vol_anual_pct") else "N/D")
r2.metric("Máx. Drawdown (1Y)", f"{rets.get('max_drawdown_pct', 'N/D')}%" if rets.get("max_drawdown_pct") else "N/D")

# ── Soporte / Resistencia ─────────────────────────────────────────────────────
sr = tech.get("soporte_resistencia", {})
if sr:
    st.divider()
    st.subheader("Soporte y Resistencia")
    sc1, sc2, sc3 = st.columns(3)
    sc1.metric("Soporte", f"${sr.get('soporte', 0):,.4f}",
               delta=f"{-sr.get('distancia_soporte_pct', 0):.1f}% desde precio")
    sc2.metric("Precio actual", f"${sr.get('precio', 0):,.4f}")
    sc3.metric("Resistencia", f"${sr.get('resistencia', 0):,.4f}",
               delta=f"+{sr.get('distancia_resistencia_pct', 0):.1f}% al objetivo")

# ── Narrativa IA ──────────────────────────────────────────────────────────────
st.divider()
if st.button("🤖 Interpretar análisis técnico con IA"):
    with st.spinner("Analizando..."):
        texto = narrativa_tecnica(tech, ticker)
    st.markdown(texto)
