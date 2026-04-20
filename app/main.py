"""
InvestSkill — Dashboard Principal
Plataforma de análisis de inversiones en tiempo real
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from datetime import datetime

from core.data.fetcher import FetcherMercado, formatear_numero, color_cambio
from core.analysis.fundamental import calcular_piotroski, calcular_roic_wacc, calidad_ganancias
from core.analysis.valuation import calcular_dcf, valoracion_multiples, score_valoracion
from core.analysis.technical import analizar as analizar_tecnico, retornos_historicos
from core.ai.analyst import narrativa_evaluacion_accion, señal_inversion_final
from config import MERCADOS, INDICES_REFERENCIA, tiene_api_claude

# ── Configuración de página ───────────────────────────────────────────────────
st.set_page_config(
    page_title="InvestSkill — Análisis de Inversiones",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS personalizado ─────────────────────────────────────────────────────────
st.markdown("""
<style>
  .metric-card {
    background: #1e2530;
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    border: 1px solid #2d3748;
  }
  .metric-label { color: #8892a4; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .metric-value { color: #ffffff; font-size: 24px; font-weight: 700; margin: 4px 0; }
  .metric-change-pos { color: #00c851; font-size: 14px; }
  .metric-change-neg { color: #ff4444; font-size: 14px; }
  .signal-block {
    font-family: monospace;
    background: #0e1117;
    border: 1px solid #2d3748;
    border-radius: 8px;
    padding: 16px;
    white-space: pre;
    font-size: 13px;
  }
  .tag-bullish  { background:#00c851; color:#000; padding:3px 10px; border-radius:12px; font-weight:700; font-size:12px; }
  .tag-neutral  { background:#ffc107; color:#000; padding:3px 10px; border-radius:12px; font-weight:700; font-size:12px; }
  .tag-bearish  { background:#ff4444; color:#fff; padding:3px 10px; border-radius:12px; font-weight:700; font-size:12px; }
  div[data-testid="stHorizontalBlock"] > div { gap: 0.5rem; }
  .stTabs [data-baseweb="tab"] { font-size: 15px; }
</style>
""", unsafe_allow_html=True)


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/stock-share.png", width=60)
    st.title("InvestSkill")
    st.caption("Análisis de inversiones en tiempo real")
    st.divider()

    # Buscador de ticker
    ticker_input = st.text_input(
        "🔍 Ticker del activo",
        value=st.session_state.get("ticker_actual", "AAPL"),
        placeholder="Ej: AAPL, BTC-USD, FEMSA.MX",
        help="Ingresa el símbolo del activo. Para LatAm agrega el sufijo (.MX, .SA, .BA...)"
    ).strip().upper()

    mercado = st.selectbox(
        "🌎 Mercado",
        options=list(MERCADOS.keys()),
        format_func=lambda k: f"{MERCADOS[k]['emoji']} {MERCADOS[k]['nombre']}",
        index=0,
    )

    analizar_btn = st.button("📊 Analizar", type="primary", use_container_width=True)

    st.divider()
    st.caption("**Módulos disponibles**")
    st.page_link("pages/1_📊_Fundamental.py",  label="📊 Análisis Fundamental")
    st.page_link("pages/2_💰_Valoracion.py",   label="💰 Valoración DCF")
    st.page_link("pages/3_📈_Tecnico.py",       label="📈 Análisis Técnico")
    st.page_link("pages/4_🌐_Macro.py",         label="🌐 Economía Macro")
    st.page_link("pages/5_💼_Portafolio.py",    label="💼 Mi Portafolio")
    st.page_link("pages/6_📋_Reporte.py",       label="📋 Reporte Completo")
    st.divider()

    # Estado de API
    if tiene_api_claude():
        st.success("🤖 Claude API activa", icon="✅")
    else:
        st.warning("🤖 Claude API no configurada\nAgrega ANTHROPIC_API_KEY en .env", icon="⚠️")

    st.caption(f"Datos: Yahoo Finance (retraso ~15 min)\n{datetime.now().strftime('%d/%m/%Y %H:%M')}")


# ── Lógica principal ──────────────────────────────────────────────────────────
if analizar_btn or "datos_cargados" not in st.session_state:
    st.session_state["ticker_actual"] = ticker_input
    st.session_state["mercado_actual"] = mercado
    st.session_state["datos_cargados"] = False

ticker_sel = st.session_state.get("ticker_actual", "AAPL")
mercado_sel = st.session_state.get("mercado_actual", "us")


@st.cache_data(ttl=300, show_spinner=False)
def cargar_datos(ticker: str, mercado: str) -> dict:
    f = FetcherMercado(ticker, mercado)
    return f.resumen_completo()


@st.cache_data(ttl=300, show_spinner=False)
def cargar_historial(ticker: str, mercado: str, periodo: str = "1y"):
    f = FetcherMercado(ticker, mercado)
    return f.precio_historico(periodo)


@st.cache_data(ttl=300, show_spinner=False)
def cargar_indices() -> dict:
    resultados = {}
    for nombre, sym in list(INDICES_REFERENCIA.items())[:6]:
        try:
            f = FetcherMercado(sym)
            p = f.precio_actual()
            resultados[nombre] = p
        except Exception:
            pass
    return resultados


# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("# 📈 InvestSkill — Dashboard de Inversiones")
st.caption("Datos en tiempo real • Análisis fundamental, técnico y macroeconómico • IA en español")

# Barra de índices en tiempo real
with st.spinner("Cargando índices..."):
    indices = cargar_indices()

if indices:
    cols_idx = st.columns(len(indices))
    for i, (nombre, data) in enumerate(indices.items()):
        precio = data.get("precio")
        cambio = data.get("cambio_pct", 0)
        with cols_idx[i]:
            color = "#00c851" if cambio >= 0 else "#ff4444"
            signo = "▲" if cambio >= 0 else "▼"
            st.markdown(
                f"<div style='text-align:center; padding:4px'>"
                f"<div style='color:#8892a4; font-size:11px'>{nombre}</div>"
                f"<div style='color:#fff; font-size:15px; font-weight:700'>{precio:,.2f}</div>"
                f"<div style='color:{color}; font-size:12px'>{signo} {abs(cambio):.2f}%</div>"
                f"</div>",
                unsafe_allow_html=True,
            )

st.divider()

# ── Cargar activo seleccionado ────────────────────────────────────────────────
with st.spinner(f"Cargando datos de {ticker_sel}..."):
    try:
        datos     = cargar_datos(ticker_sel, mercado_sel)
        hist_1y   = cargar_historial(ticker_sel, mercado_sel, "1y")
        datos_cargados = True
    except Exception as e:
        st.error(f"Error al cargar datos: {e}")
        st.stop()

precio_d  = datos["precio"]
fund      = datos["fundamentales"]
consenso  = datos["consenso"]
noticias  = datos["noticias"]

nombre_activo = precio_d.get("nombre", ticker_sel)
precio_val    = precio_d.get("precio")
cambio_pct    = precio_d.get("cambio_pct", 0)
moneda        = precio_d.get("moneda", "USD")

# ── Encabezado del activo ─────────────────────────────────────────────────────
col_titulo, col_señal = st.columns([3, 1])

with col_titulo:
    color_p = "#00c851" if cambio_pct >= 0 else "#ff4444"
    signo_p = "▲" if cambio_pct >= 0 else "▼"
    st.markdown(
        f"## {nombre_activo} &nbsp; `{ticker_sel}`\n"
        f"### <span style='color:{color_p}'>{moneda} {precio_val:,.4f} &nbsp; {signo_p} {abs(cambio_pct):.2f}%</span>",
        unsafe_allow_html=True,
    )
    st.caption(f"{precio_d.get('sector', '')} • {precio_d.get('industria', '')} • {precio_d.get('pais', '')} • {precio_d.get('intercambio', '')}")

# Calcular señal final
with col_señal:
    piot_raw   = datos.get("piotroski_raw", {})
    piotroski  = calcular_piotroski(piot_raw)
    roic_wacc  = calcular_roic_wacc(fund, piot_raw)
    dcf_res    = calcular_dcf(fund, piot_raw)
    tech_res   = analizar_tecnico(hist_1y)

    señal_final = señal_inversion_final(piotroski, roic_wacc, dcf_res, tech_res, consenso)
    score_f = señal_final["score"]
    accion  = señal_final["accion"]
    conf    = señal_final["confianza"]
    c_f     = señal_final["color"]

    st.markdown(
        f"<div style='background:{c_f}22; border:2px solid {c_f}; border-radius:12px; "
        f"padding:16px; text-align:center'>"
        f"<div style='color:{c_f}; font-size:22px; font-weight:900'>{accion}</div>"
        f"<div style='color:#fff; font-size:28px; font-weight:700'>{score_f}/10</div>"
        f"<div style='color:#8892a4; font-size:12px'>Confianza: {conf}</div>"
        f"</div>",
        unsafe_allow_html=True,
    )

st.divider()

# ── Métricas clave ────────────────────────────────────────────────────────────
col1, col2, col3, col4, col5, col6 = st.columns(6)

metricas = [
    ("Cap. Mercado",    formatear_numero(fund.get("cap_mercado"), prefijo="$"), None),
    ("P/E TTM",         f"{fund.get('pe_ttm', 'N/D')}x" if fund.get("pe_ttm") else "N/D", None),
    ("EV/EBITDA",       f"{fund.get('ev_ebitda', 'N/D')}x" if fund.get("ev_ebitda") else "N/D", None),
    ("Margen Neto",     f"{fund.get('margen_neto', 'N/D')}%" if fund.get("margen_neto") else "N/D", fund.get("margen_neto")),
    ("FCF Yield",       f"{fund.get('fcf_yield', 'N/D')}%" if fund.get("fcf_yield") else "N/D", fund.get("fcf_yield")),
    ("Beta",            f"{fund.get('beta', 'N/D')}" if fund.get("beta") else "N/D", None),
]

for col, (label, valor, delta) in zip([col1, col2, col3, col4, col5, col6], metricas):
    with col:
        st.metric(label=label, value=valor)

# ── Gráfico de precio ─────────────────────────────────────────────────────────
st.subheader("Precio histórico")

periodo_sel = st.radio("Período", ["1m", "3m", "6m", "1y", "2y", "5y"],
                        index=3, horizontal=True, key="periodo_precio")

@st.cache_data(ttl=300, show_spinner=False)
def _hist(t, m, p): return cargar_historial(t, m, p)

hist = _hist(ticker_sel, mercado_sel, periodo_sel)

if hist is not None and not hist.empty:
    fig = go.Figure()

    # Área de precio
    fig.add_trace(go.Scatter(
        x=hist.index, y=hist["Close"],
        fill="tozeroy",
        fillcolor="rgba(26,115,232,0.1)",
        line=dict(color="#1a73e8", width=2),
        name="Precio cierre",
        hovertemplate=f"{moneda} %{{y:,.4f}}<extra></extra>",
    ))

    # SMA 50 y 200
    if len(hist) >= 50:
        sma50 = hist["Close"].rolling(50).mean()
        fig.add_trace(go.Scatter(x=hist.index, y=sma50, line=dict(color="#ffc107", width=1.5, dash="dot"),
                                  name="SMA 50", hovertemplate="SMA50: %{y:,.2f}<extra></extra>"))
    if len(hist) >= 200:
        sma200 = hist["Close"].rolling(200).mean()
        fig.add_trace(go.Scatter(x=hist.index, y=sma200, line=dict(color="#ff7043", width=1.5, dash="dot"),
                                  name="SMA 200", hovertemplate="SMA200: %{y:,.2f}<extra></extra>"))

    fig.update_layout(
        template="plotly_dark",
        height=380,
        margin=dict(l=0, r=0, t=10, b=0),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor="#1e2530"),
        hovermode="x unified",
    )
    st.plotly_chart(fig, use_container_width=True)

    # Volumen
    if "Volume" in hist.columns:
        vol_colors = ["#00c851" if c >= o else "#ff4444"
                      for c, o in zip(hist["Close"], hist["Open"])]
        fig_vol = go.Figure(go.Bar(
            x=hist.index, y=hist["Volume"],
            marker_color=vol_colors, opacity=0.7, name="Volumen",
        ))
        fig_vol.update_layout(template="plotly_dark", height=120,
                               margin=dict(l=0, r=0, t=0, b=0),
                               xaxis=dict(showgrid=False), yaxis=dict(showgrid=False),
                               showlegend=False)
        st.plotly_chart(fig_vol, use_container_width=True)
else:
    st.warning("No hay datos históricos disponibles para este período.")

# ── Tabs de análisis ──────────────────────────────────────────────────────────
tab_resumen, tab_fund, tab_tesis, tab_noticias = st.tabs([
    "📊 Resumen",
    "📋 Fundamentales",
    "🤖 Tesis IA",
    "📰 Noticias",
])

# ── Tab Resumen ───────────────────────────────────────────────────────────────
with tab_resumen:
    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown("**Valoración**")
        data_val = {
            "Métrica": ["P/E TTM", "P/E Forward", "PEG", "P/Ventas", "P/Libro", "EV/EBITDA"],
            "Valor":   [
                f"{fund.get('pe_ttm', 'N/D')}x",
                f"{fund.get('pe_forward', 'N/D')}x",
                f"{fund.get('peg', 'N/D')}x",
                f"{fund.get('precio_ventas', 'N/D')}x",
                f"{fund.get('precio_valor_libro', 'N/D')}x",
                f"{fund.get('ev_ebitda', 'N/D')}x",
            ]
        }
        st.dataframe(pd.DataFrame(data_val), hide_index=True, use_container_width=True)

    with c2:
        st.markdown("**Rentabilidad**")
        data_rent = {
            "Métrica": ["Margen Bruto", "Margen Op.", "Margen Neto", "EBITDA Margin", "ROE", "ROA"],
            "Valor":   [
                f"{fund.get('margen_bruto', 'N/D')}%",
                f"{fund.get('margen_operativo', 'N/D')}%",
                f"{fund.get('margen_neto', 'N/D')}%",
                f"{fund.get('margen_ebitda', 'N/D')}%",
                f"{fund.get('roe', 'N/D')}%",
                f"{fund.get('roa', 'N/D')}%",
            ]
        }
        st.dataframe(pd.DataFrame(data_rent), hide_index=True, use_container_width=True)

    with c3:
        st.markdown("**Balance y Caja**")
        data_bal = {
            "Métrica": ["Deuda/Equity", "Ratio Corriente", "Caja Total", "Deuda Total", "Deuda Neta", "FCF"],
            "Valor":   [
                f"{fund.get('deuda_equity', 'N/D')}x",
                f"{fund.get('ratio_corriente', 'N/D')}x",
                formatear_numero(fund.get("caja_total"), prefijo="$"),
                formatear_numero(fund.get("deuda_total"), prefijo="$"),
                formatear_numero(fund.get("deuda_neta"), prefijo="$"),
                formatear_numero(fund.get("fcf"), prefijo="$"),
            ]
        }
        st.dataframe(pd.DataFrame(data_bal), hide_index=True, use_container_width=True)

    # Consenso analistas
    st.divider()
    st.markdown("**Consenso de Analistas**")
    ca1, ca2, ca3, ca4 = st.columns(4)
    ca1.metric("Recomendación", consenso.get("recomendacion", "N/D"))
    ca2.metric("Precio objetivo",
               f"${consenso.get('precio_objetivo_medio', 'N/D')}" if consenso.get("precio_objetivo_medio") else "N/D")
    ca3.metric("Upside potencial",
               f"{consenso.get('upside_potencial_pct', 'N/D')}%" if consenso.get("upside_potencial_pct") else "N/D",
               delta=None)
    ca4.metric("Nº analistas", consenso.get("num_analistas", "N/D"))

    # Piotroski y score técnico
    st.divider()
    ps1, ps2 = st.columns(2)
    with ps1:
        piot_score = piotroski.get("score")
        st.markdown("**Piotroski F-Score**")
        if piot_score is not None:
            st.markdown(
                f"<h2 style='color:{piotroski.get(\"color\")}'>{piot_score}/9</h2>"
                f"<p>{piotroski.get('interpretacion')}</p>",
                unsafe_allow_html=True,
            )
        else:
            st.info("Sin datos para calcular Piotroski")

    with ps2:
        st.markdown("**Score Técnico**")
        tech_sc = tech_res.get("score", {})
        if tech_sc and not tech_res.get("error"):
            st.markdown(
                f"<h2 style='color:{tech_sc.get(\"color\")}'>{tech_sc.get('score')}/10</h2>"
                f"<p>{tech_sc.get('señal')}</p>",
                unsafe_allow_html=True,
            )
        else:
            st.info("Sin datos técnicos")

# ── Tab Fundamentales ─────────────────────────────────────────────────────────
with tab_fund:
    estados = datos.get("estados", {})
    ingresos = estados.get("ingresos", {})
    años = ingresos.get("años", [])

    if años:
        st.markdown("**Evolución financiera (últimos 4 años)**")

        métricas_grafico = {
            "Ingresos (MM USD)":      ingresos.get("ingresos_totales", {}),
            "Beneficio Bruto (MM)":   ingresos.get("beneficio_bruto", {}),
            "Beneficio Neto (MM)":    ingresos.get("beneficio_neto", {}),
        }

        for titulo, serie_dict in métricas_grafico.items():
            if any(v is not None for v in serie_dict.values()):
                df_plot = pd.DataFrame({"Año": list(serie_dict.keys()), "Valor": list(serie_dict.values())})
                df_plot = df_plot.dropna(subset=["Valor"])
                if not df_plot.empty:
                    fig_bar = px.bar(df_plot, x="Año", y="Valor", title=titulo,
                                     color_discrete_sequence=["#1a73e8"], template="plotly_dark")
                    fig_bar.update_layout(height=250, margin=dict(l=0, r=0, t=30, b=0),
                                          showlegend=False)
                    st.plotly_chart(fig_bar, use_container_width=True)
    else:
        st.info("Estados financieros detallados disponibles en la página de Análisis Fundamental.")

# ── Tab Tesis IA ──────────────────────────────────────────────────────────────
with tab_tesis:
    if st.button("🤖 Generar análisis con IA", type="primary"):
        with st.spinner("Analizando con Claude..."):
            tesis = narrativa_evaluacion_accion(datos)
        st.markdown(tesis)
    else:
        st.info("Haz clic en el botón para generar el análisis narrativo completo con IA en español.")
        if not tiene_api_claude():
            st.warning("Para activar IA: agrega `ANTHROPIC_API_KEY=sk-ant-...` en el archivo `.env` y reinicia la app.")

# ── Tab Noticias ──────────────────────────────────────────────────────────────
with tab_noticias:
    if noticias:
        for n in noticias:
            with st.container():
                st.markdown(
                    f"**[{n['titulo']}]({n['url']})**  \n"
                    f"<span style='color:#8892a4; font-size:12px'>{n['fuente']} • {n['fecha']}</span>",
                    unsafe_allow_html=True,
                )
                if n.get("resumen"):
                    st.caption(n["resumen"][:200] + "..." if len(n.get("resumen","")) > 200 else n["resumen"])
                st.divider()
    else:
        st.info("No hay noticias recientes disponibles para este activo.")

# ── Footer ────────────────────────────────────────────────────────────────────
st.divider()
st.caption(
    "⚠️ **Aviso:** Este análisis es solo educativo. No constituye asesoramiento financiero. "
    "Los datos tienen retraso de ~15 minutos. Verifica siempre la información antes de invertir. "
    f"| InvestSkill v2.0 | {datetime.now().strftime('%d/%m/%Y %H:%M')}"
)
