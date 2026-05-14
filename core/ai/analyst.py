"""
InvestSkill — Capa de Inteligencia Artificial
Genera narrativas de análisis en español usando Claude API (Anthropic).
Si no hay API key configurada, retorna un resumen estructurado sin IA.
"""
import json
from typing import Optional
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, tiene_api_claude
from core.data.fetcher import formatear_numero

try:
    import anthropic
    ANTHROPIC_OK = True
except ImportError:
    ANTHROPIC_OK = False


# ── Cliente Claude ────────────────────────────────────────────────────────────

def _cliente() -> Optional[object]:
    if not ANTHROPIC_OK or not tiene_api_claude():
        return None
    try:
        return anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    except Exception:
        return None


def _llamar_claude(prompt: str, max_tokens: int = 1500) -> Optional[str]:
    """Llama a Claude y retorna el texto, o None si no está disponible."""
    cliente = _cliente()
    if not cliente:
        return None
    try:
        msg = cliente.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text.strip()
    except Exception as e:
        return f"[Error al conectar con Claude API: {e}]"


# ── Prompts especializados ────────────────────────────────────────────────────

def narrativa_evaluacion_accion(datos: dict) -> str:
    """
    Genera la tesis de inversión completa en español para un activo.
    Usa datos reales del FetcherMercado.resumen_completo().
    """
    ticker   = datos.get("ticker", "")
    nombre   = datos.get("precio", {}).get("nombre", ticker)
    precio_d = datos.get("precio", {})
    fund     = datos.get("fundamentales", {})
    consenso = datos.get("consenso", {})
    desc     = datos.get("descripcion", "")[:500]

    prompt = f"""Eres un analista financiero senior. Analiza el siguiente activo y genera un informe de inversión COMPLETO en español, con datos reales y sin inventar cifras.

ACTIVO: {nombre} ({ticker})
DESCRIPCIÓN: {desc}

DATOS DE PRECIO:
- Precio actual: {precio_d.get('precio')} {precio_d.get('moneda','USD')}
- Cambio hoy: {precio_d.get('cambio_pct')}%
- Máximo 52 semanas: {precio_d.get('max_52s')}
- Mínimo 52 semanas: {precio_d.get('min_52s')}
- Posición en rango 52s: {precio_d.get('rango_52s_pct')}%
- Cap. de mercado: {formatear_numero(fund.get('cap_mercado'), prefijo='$')}
- Sector: {precio_d.get('sector')} | Industria: {precio_d.get('industria')}

VALORACIÓN:
- P/E TTM: {fund.get('pe_ttm')} | P/E Forward: {fund.get('pe_forward')}
- PEG: {fund.get('peg')} | P/Ventas: {fund.get('precio_ventas')} | EV/EBITDA: {fund.get('ev_ebitda')}
- Price/Book: {fund.get('precio_valor_libro')}
- FCF Yield: {fund.get('fcf_yield')}%

RENTABILIDAD:
- ROE: {fund.get('roe')}% | ROA: {fund.get('roa')}%
- Margen bruto: {fund.get('margen_bruto')}% | Margen operativo: {fund.get('margen_operativo')}%
- Margen neto: {fund.get('margen_neto')}% | Margen EBITDA: {fund.get('margen_ebitda')}%

CRECIMIENTO:
- Crec. ingresos YoY: {fund.get('crec_ingresos_anual')}%
- Crec. ganancias: {fund.get('crec_ganancias')}%

BALANCE Y CAJA:
- Deuda/Equity: {fund.get('deuda_equity')} | Ratio corriente: {fund.get('ratio_corriente')}
- Caja total: {formatear_numero(fund.get('caja_total'), prefijo='$')}
- Deuda total: {formatear_numero(fund.get('deuda_total'), prefijo='$')}
- Deuda neta: {formatear_numero(fund.get('deuda_neta'), prefijo='$')}

FLUJOS DE CAJA:
- FCF: {formatear_numero(fund.get('fcf'), prefijo='$')} | OCF: {formatear_numero(fund.get('ocf'), prefijo='$')}

DIVIDENDO:
- Yield: {fund.get('div_yield')}% | Payout ratio: {fund.get('payout_ratio')}%

RIESGO:
- Beta: {fund.get('beta')}

CONSENSO ANALISTAS:
- Recomendación: {consenso.get('recomendación')}
- Precio objetivo medio: ${consenso.get('precio_objetivo_medio')}
- Upside potencial: {consenso.get('upside_potencial_pct')}%
- Num. analistas: {consenso.get('num_analistas')}

Genera el informe con estas secciones exactas:

## 1. Tesis de Inversión
(2-3 párrafos sobre el caso bull/bear principal)

## 2. Fortalezas
(3-5 puntos con bullet points •)

## 3. Riesgos Principales
(3-5 puntos con bullet points •)

## 4. Valoración
(Análisis de si está caro/barato basado en los múltiplos reales arriba)

## 5. Veredicto Final
(1 párrafo claro: COMPRAR / MANTENER / VENDER con justificación)

IMPORTANTE: Solo usa los datos reales proporcionados. Si un dato es None o N/D, dilo explícitamente. No inventes cifras."""

    respuesta = _llamar_claude(prompt, max_tokens=1800)
    if respuesta:
        return respuesta
    return _narrativa_sin_ia(datos)


def narrativa_dcf(dcf_result: dict, ticker: str) -> str:
    """Explica los resultados del DCF en lenguaje claro."""
    if dcf_result.get("error"):
        return f"DCF no disponible: {dcf_result['error']}"

    base = dcf_result["escenarios"]["base"]
    alcista = dcf_result["escenarios"]["alcista"]
    bajista = dcf_result["escenarios"]["bajista"]

    prompt = f"""Eres un analista financiero. Explica los siguientes resultados del modelo DCF de {ticker} en español claro y profesional (máximo 300 palabras):

RESULTADOS DCF:
- FCF Base: ${dcf_result.get('fcf_base_mm')}M
- WACC utilizado: {dcf_result.get('wacc_base_pct')}%

Escenario BASE (probabilidad 55%):
  - Crecimiento fase 1 (años 1-5): {base['crec_fase1_pct']}%
  - Crecimiento fase 2 (años 6-10): {base['crec_fase2_pct']}%
  - Valor intrínseco: ${base['valor_intrinseco']}
  - Precio de mercado: ${base['precio_mercado']}
  - Margen de seguridad: {base['margen_seguridad_pct']}%

Escenario ALCISTA (probabilidad 25%):
  - Valor intrínseco: ${alcista['valor_intrinseco']}
  - Margen de seguridad: {alcista['margen_seguridad_pct']}%

Escenario BAJISTA (probabilidad 20%):
  - Valor intrínseco: ${bajista['valor_intrinseco']}
  - Margen de seguridad: {bajista['margen_seguridad_pct']}%

Precio ponderado (promedio ponderado): ${dcf_result.get('precio_ponderado')}

Señal: {dcf_result.get('señal')}

Explica: 1) Qué significan estos resultados, 2) Si el precio de mercado es atractivo, 3) Qué supuestos son los más sensibles."""

    respuesta = _llamar_claude(prompt, max_tokens=500)
    if respuesta:
        return respuesta
    return (f"El modelo DCF estima un valor intrínseco de ${base['valor_intrinseco']} en el caso base, "
            f"comparado con el precio de mercado de ${base['precio_mercado']}. "
            f"Margen de seguridad: {base['margen_seguridad_pct']}%.")


def narrativa_tecnica(tech_result: dict, ticker: str) -> str:
    """Interpreta los indicadores técnicos en lenguaje natural."""
    if tech_result.get("error"):
        return f"Análisis técnico no disponible: {tech_result['error']}"

    rsi   = tech_result.get("rsi", {})
    macd  = tech_result.get("macd", {})
    tend  = tech_result.get("tendencia", {})
    score = tech_result.get("score", {})
    mm    = tech_result.get("medias_moviles", {})

    prompt = f"""Eres un analista técnico. Resume el análisis técnico de {ticker} en español (máximo 250 palabras):

INDICADORES ACTUALES:
- Precio: ${mm.get('precio')} | SMA20: {mm.get('sma20')} | SMA50: {mm.get('sma50')} | SMA200: {mm.get('sma200')}
- Golden Cross: {mm.get('golden_cross')}
- RSI(14): {rsi.get('valor')} — {rsi.get('señal')}
- MACD: {macd.get('macd')} | Señal: {macd.get('señal_line')} | Histograma: {macd.get('histograma')}
- Señal MACD: {macd.get('señal')}
- Tendencia: {tend.get('tendencia')} | Señales: {', '.join(tend.get('señales', []))}
- Score técnico: {score.get('score')}/10 — {score.get('señal')}

Describe: 1) La tendencia actual, 2) Los niveles de entrada/salida sugeridos, 3) La confirmación o divergencia entre indicadores."""

    respuesta = _llamar_claude(prompt, max_tokens=400)
    if respuesta:
        return respuesta
    return (f"Tendencia {tend.get('tendencia', 'no disponible')}. "
            f"RSI en {rsi.get('valor', 'N/D')} ({rsi.get('señal', '')}). "
            f"MACD: {macd.get('señal', '')}. "
            f"Score técnico: {score.get('score', 'N/D')}/10.")


def narrativa_macro(macro_data: dict) -> str:
    """Interpreta las condiciones macroeconómicas y su impacto en mercados."""
    prompt = f"""Eres un economista. Analiza las siguientes condiciones macroeconómicas de EE.UU. y su impacto en los mercados financieros (máximo 350 palabras en español):

INDICADORES MACRO ACTUALES:
- Régimen: {macro_data.get('regimen_macro')}
- Desempleo: {macro_data.get('desempleo_pct')}%
- Inflación YoY: {macro_data.get('inflacion_yoy_pct')}%
- Tasa Fed Funds: {macro_data.get('fed_funds_pct')}%
- Rendimiento T10Y: {macro_data.get('t10y_pct')}%
- Spread 10Y-2Y: {macro_data.get('spread_10y_2y')} bps
- Curva invertida: {macro_data.get('curva_invertida')}

Describe: 1) El régimen macroeconómico actual, 2) Implicaciones para renta variable, 3) Sectores favorecidos y desfavorecidos, 4) Riesgos principales en el horizonte próximo."""

    respuesta = _llamar_claude(prompt, max_tokens=600)
    if respuesta:
        return respuesta
    return (f"Régimen macroeconómico: {macro_data.get('regimen_macro', 'No disponible')}. "
            f"Inflación: {macro_data.get('inflacion_yoy_pct')}%. "
            f"Fed Funds: {macro_data.get('fed_funds_pct')}%.")


def señal_inversion_final(piotroski: dict, roic_wacc: dict,
                           dcf: dict, tech: dict, consenso: dict) -> dict:
    """
    Genera la señal de inversión final consolidada (0-10) combinando todas las capas.
    Funciona con o sin Claude API.
    """
    score_total = 0
    componentes = {}

    # Piotroski (peso 20%)
    piot_score = piotroski.get("score")
    if piot_score is not None:
        pts = piot_score / 9 * 10
        componentes["piotroski"] = {"score": piot_score, "max": 9, "puntos": round(pts, 1)}
        score_total += pts * 0.20

    # ROIC vs WACC (peso 20%)
    spread = roic_wacc.get("spread_roic_wacc")
    if spread is not None:
        if spread > 5:    pts = 9
        elif spread > 2:  pts = 7
        elif spread > 0:  pts = 6
        elif spread > -3: pts = 4
        else:             pts = 2
        componentes["roic_wacc"] = {"spread": spread, "puntos": pts}
        score_total += pts * 0.20

    # DCF margen seguridad (peso 30%)
    if not dcf.get("error"):
        mg = dcf["escenarios"]["base"].get("margen_seguridad_pct")
        if mg is not None:
            if mg > 40:    pts = 10
            elif mg > 20:  pts = 8
            elif mg > 5:   pts = 6
            elif mg > -10: pts = 4
            else:          pts = 2
            componentes["dcf"] = {"margen_seguridad": mg, "puntos": pts}
            score_total += pts * 0.30

    # Score técnico (peso 15%)
    tech_score = tech.get("score", {}).get("score") if tech else None
    if tech_score is not None:
        componentes["tecnico"] = {"score": tech_score, "puntos": tech_score}
        score_total += tech_score * 0.15

    # Consenso analistas (peso 15%)
    upside = consenso.get("upside_potencial_pct")
    if upside is not None:
        if upside > 30:   pts = 9
        elif upside > 15: pts = 7
        elif upside > 5:  pts = 6
        elif upside > -5: pts = 5
        else:             pts = 3
        componentes["consenso"] = {"upside": upside, "puntos": pts}
        score_total += pts * 0.15

    # Normalizar
    pesos_usados = (
        (0.20 if "piotroski" in componentes else 0) +
        (0.20 if "roic_wacc" in componentes else 0) +
        (0.30 if "dcf" in componentes else 0) +
        (0.15 if "tecnico" in componentes else 0) +
        (0.15 if "consenso" in componentes else 0)
    )

    score_final = round(score_total / pesos_usados if pesos_usados > 0 else 5.0, 1)
    score_final = min(max(score_final, 0), 10)

    if score_final >= 8.0:
        señal = "ALCISTA"; accion = "COMPRAR"; conf = "ALTA"; color = "#00c851"
    elif score_final >= 6.5:
        señal = "MODERADAMENTE ALCISTA"; accion = "COMPRAR"; conf = "MEDIA"; color = "#80d9a0"
    elif score_final >= 5.0:
        señal = "NEUTRAL"; accion = "MANTENER"; conf = "MEDIA"; color = "#ffc107"
    elif score_final >= 3.5:
        señal = "MODERADAMENTE BAJISTA"; accion = "VENDER"; conf = "MEDIA"; color = "#ff8888"
    else:
        señal = "BAJISTA"; accion = "VENDER"; conf = "ALTA"; color = "#ff4444"

    return {
        "score":        score_final,
        "señal":        señal,
        "accion":       accion,
        "confianza":    conf,
        "color":        color,
        "componentes":  componentes,
        "bloque": f"""
╔══════════════════════════════════════════════╗
║           SEÑAL DE INVERSIÓN                 ║
╠══════════════════════════════════════════════╣
║ Señal:      {señal:<32}║
║ Confianza:  {conf:<32}║
║ Score:      {score_final:<5.1f} / 10                       ║
╠══════════════════════════════════════════════╣
║ Acción:     {accion:<32}║
╚══════════════════════════════════════════════╝""",
    }


# ── Fallback sin API Claude ───────────────────────────────────────────────────

def _narrativa_sin_ia(datos: dict) -> str:
    """Genera un resumen estructurado sin IA cuando no hay API key."""
    fund = datos.get("fundamentales", {})
    precio_d = datos.get("precio", {})
    ticker = datos.get("ticker", "")
    nombre = precio_d.get("nombre", ticker)

    lineas = [
        f"## {nombre} ({ticker}) — Resumen de Análisis",
        "",
        f"**Precio actual:** {precio_d.get('precio')} {precio_d.get('moneda','USD')} "
        f"({'↑' if (precio_d.get('cambio_pct') or 0) > 0 else '↓'} {abs(precio_d.get('cambio_pct') or 0):.2f}%)",
        "",
        "### Valoración",
        f"- P/E TTM: {fund.get('pe_ttm') or 'N/D'} | P/E Forward: {fund.get('pe_forward') or 'N/D'}",
        f"- EV/EBITDA: {fund.get('ev_ebitda') or 'N/D'} | FCF Yield: {fund.get('fcf_yield') or 'N/D'}%",
        "",
        "### Rentabilidad",
        f"- Margen neto: {fund.get('margen_neto') or 'N/D'}% | ROE: {fund.get('roe') or 'N/D'}%",
        f"- Margen operativo: {fund.get('margen_operativo') or 'N/D'}%",
        "",
        "### Balance",
        f"- Deuda/Equity: {fund.get('deuda_equity') or 'N/D'} | Ratio corriente: {fund.get('ratio_corriente') or 'N/D'}",
        f"- Caja: {formatear_numero(fund.get('caja_total'), prefijo='$')} | "
        f"Deuda neta: {formatear_numero(fund.get('deuda_neta'), prefijo='$')}",
        "",
        "*Para análisis narrativo con IA, configura ANTHROPIC_API_KEY en el archivo .env*",
    ]
    return "\n".join(lineas)
