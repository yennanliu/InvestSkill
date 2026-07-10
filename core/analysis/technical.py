"""
InvestSkill — Motor de Análisis Técnico
Calcula indicadores sobre datos OHLCV reales de yfinance.
Usa la librería `ta` para máxima precisión.
"""
import pandas as pd
import numpy as np
from typing import Optional
import warnings
warnings.filterwarnings("ignore")

try:
    import ta
    TA_OK = True
except ImportError:
    TA_OK = False


# ── Análisis técnico completo ─────────────────────────────────────────────────

def analizar(df: pd.DataFrame) -> dict:
    """
    Recibe un DataFrame OHLCV (de yfinance) y calcula todos los indicadores.
    Retorna dict con indicadores, señales y score técnico 0-10.
    """
    if df is None or df.empty or len(df) < 20:
        return {"error": "Datos históricos insuficientes (mínimo 20 velas)"}

    df = df.copy().dropna(subset=["Close"])
    close = df["Close"]
    high  = df["High"]
    low   = df["Low"]
    vol   = df["Volume"] if "Volume" in df.columns else pd.Series(dtype=float)

    resultado = {"error": None}

    # ── Medias Móviles ────────────────────────────────────────────────────────
    sma20  = close.rolling(20).mean().iloc[-1]  if len(close) >= 20  else None
    sma50  = close.rolling(50).mean().iloc[-1]  if len(close) >= 50  else None
    sma200 = close.rolling(200).mean().iloc[-1] if len(close) >= 200 else None
    ema12  = close.ewm(span=12).mean().iloc[-1]
    ema26  = close.ewm(span=26).mean().iloc[-1]
    ema50  = close.ewm(span=50).mean().iloc[-1] if len(close) >= 50 else None

    precio_actual = float(close.iloc[-1])

    resultado["medias_moviles"] = {
        "precio":  round(precio_actual, 4),
        "sma20":   round(sma20, 4) if sma20 else None,
        "sma50":   round(sma50, 4) if sma50 else None,
        "sma200":  round(sma200, 4) if sma200 else None,
        "ema12":   round(ema12, 4),
        "ema26":   round(ema26, 4),
        "ema50":   round(ema50, 4) if ema50 else None,
        # Posición relativa
        "sobre_sma20":  bool(precio_actual > sma20) if sma20 else None,
        "sobre_sma50":  bool(precio_actual > sma50) if sma50 else None,
        "sobre_sma200": bool(precio_actual > sma200) if sma200 else None,
        # Golden / Death Cross
        "golden_cross": bool(sma50 > sma200) if (sma50 and sma200) else None,
    }

    # ── RSI ───────────────────────────────────────────────────────────────────
    if TA_OK and len(close) >= 14:
        rsi_series = ta.momentum.RSIIndicator(close, window=14).rsi()
        rsi = float(rsi_series.iloc[-1]) if not rsi_series.empty else None
    else:
        # RSI manual
        delta = close.diff()
        gain  = delta.where(delta > 0, 0).rolling(14).mean()
        loss  = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs    = gain / loss.replace(0, np.nan)
        rsi   = float(100 - 100 / (1 + rs.iloc[-1])) if len(close) >= 14 else None

    if rsi is not None:
        if rsi >= 70:   rsi_señal = "SOBRECOMPRADO"; rsi_color = "#ff4444"
        elif rsi <= 30: rsi_señal = "SOBREVENDIDO";  rsi_color = "#00c851"
        else:           rsi_señal = "NEUTRO";         rsi_color = "#ffc107"
    else:
        rsi_señal = "Sin datos"; rsi_color = "#aaaaaa"

    resultado["rsi"] = {
        "valor":  round(rsi, 2) if rsi else None,
        "señal":  rsi_señal,
        "color":  rsi_color,
    }

    # ── MACD ──────────────────────────────────────────────────────────────────
    macd_line  = ema12 - ema26
    signal_ema = close.ewm(span=26).mean()
    exp1 = close.ewm(span=12).mean()
    exp2 = close.ewm(span=26).mean()
    macd_s   = exp1 - exp2
    signal_s = macd_s.ewm(span=9).mean()
    histograma = float(macd_s.iloc[-1] - signal_s.iloc[-1])
    macd_val   = float(macd_s.iloc[-1])
    signal_val = float(signal_s.iloc[-1])

    # Detectar cruce
    if len(macd_s) >= 2:
        prev_hist = float(macd_s.iloc[-2] - signal_s.iloc[-2])
        if prev_hist < 0 and histograma > 0:
            macd_señal = "CRUCE ALCISTA — señal de compra"
            macd_color = "#00c851"
        elif prev_hist > 0 and histograma < 0:
            macd_señal = "CRUCE BAJISTA — señal de venta"
            macd_color = "#ff4444"
        elif histograma > 0:
            macd_señal = "Tendencia alcista"
            macd_color = "#80d9a0"
        else:
            macd_señal = "Tendencia bajista"
            macd_color = "#ff8888"
    else:
        macd_señal = "Sin datos"; macd_color = "#aaaaaa"

    resultado["macd"] = {
        "macd":       round(macd_val, 4),
        "señal_line": round(signal_val, 4),
        "histograma": round(histograma, 4),
        "señal":      macd_señal,
        "color":      macd_color,
    }

    # ── Bandas de Bollinger ───────────────────────────────────────────────────
    if len(close) >= 20:
        sma20_s  = close.rolling(20).mean()
        std20_s  = close.rolling(20).std()
        bb_upper = float(sma20_s.iloc[-1] + 2 * std20_s.iloc[-1])
        bb_lower = float(sma20_s.iloc[-1] - 2 * std20_s.iloc[-1])
        bb_mid   = float(sma20_s.iloc[-1])
        bb_width = round((bb_upper - bb_lower) / bb_mid * 100, 2)
        bb_pct_b = round((precio_actual - bb_lower) / (bb_upper - bb_lower), 3) if bb_upper != bb_lower else None

        if precio_actual > bb_upper:   bb_señal = "SOBRECOMPRADO (sobre banda superior)"
        elif precio_actual < bb_lower: bb_señal = "SOBREVENDIDO (bajo banda inferior)"
        else:                          bb_señal = f"Dentro de bandas ({bb_pct_b:.0%} del rango)" if bb_pct_b else "Dentro de bandas"

        resultado["bollinger"] = {
            "superior":   round(bb_upper, 4),
            "media":      round(bb_mid, 4),
            "inferior":   round(bb_lower, 4),
            "ancho_pct":  bb_width,
            "pct_b":      bb_pct_b,
            "señal":      bb_señal,
        }

    # ── ATR (Average True Range) — volatilidad ────────────────────────────────
    if len(df) >= 14:
        h_l  = high - low
        h_cp = (high - close.shift()).abs()
        l_cp = (low  - close.shift()).abs()
        tr   = pd.concat([h_l, h_cp, l_cp], axis=1).max(axis=1)
        atr  = float(tr.rolling(14).mean().iloc[-1])
        atr_pct = round(atr / precio_actual * 100, 2)
        resultado["atr"] = {
            "valor":   round(atr, 4),
            "pct":     atr_pct,
            "señal":   "Alta volatilidad" if atr_pct > 3 else "Volatilidad moderada" if atr_pct > 1.5 else "Baja volatilidad",
        }

    # ── Estocástico ───────────────────────────────────────────────────────────
    if len(close) >= 14:
        lowest_low   = low.rolling(14).min()
        highest_high = high.rolling(14).max()
        k_pct = (close - lowest_low) / (highest_high - lowest_low) * 100
        k_val = float(k_pct.iloc[-1]) if not k_pct.empty else None
        d_val = float(k_pct.rolling(3).mean().iloc[-1]) if not k_pct.empty else None

        if k_val:
            if k_val >= 80:   esto_señal = "SOBRECOMPRADO"
            elif k_val <= 20: esto_señal = "SOBREVENDIDO"
            else:             esto_señal = "NEUTRO"
        else:
            esto_señal = "Sin datos"

        resultado["estocastico"] = {
            "k": round(k_val, 2) if k_val else None,
            "d": round(d_val, 2) if d_val else None,
            "señal": esto_señal,
        }

    # ── Volumen ───────────────────────────────────────────────────────────────
    if not vol.empty and len(vol) >= 20:
        vol_actual  = float(vol.iloc[-1])
        vol_prom20  = float(vol.rolling(20).mean().iloc[-1])
        ratio_vol   = round(vol_actual / vol_prom20, 2) if vol_prom20 else None

        resultado["volumen"] = {
            "actual":      int(vol_actual),
            "promedio_20": int(vol_prom20),
            "ratio":       ratio_vol,
            "señal": (
                "VOLUMEN ALTO — confirma movimiento" if (ratio_vol and ratio_vol > 1.5) else
                "Volumen normal" if (ratio_vol and ratio_vol > 0.7) else
                "Volumen bajo — posible trampa"
            ),
        }

    # ── Soporte y Resistencia ─────────────────────────────────────────────────
    if len(close) >= 20:
        ventana = min(len(close), 60)
        ultimos = close.tail(ventana)
        soporte    = round(float(ultimos.quantile(0.10)), 4)
        resistencia= round(float(ultimos.quantile(0.90)), 4)
        resultado["soporte_resistencia"] = {
            "soporte":     soporte,
            "resistencia": resistencia,
            "precio":      round(precio_actual, 4),
            "distancia_soporte_pct":     round((precio_actual - soporte) / soporte * 100, 1),
            "distancia_resistencia_pct": round((resistencia - precio_actual) / precio_actual * 100, 1),
        }

    # ── Tendencia general ─────────────────────────────────────────────────────
    tendencias = _detectar_tendencia(close, sma20, sma50, sma200)
    resultado["tendencia"] = tendencias

    # ── Score técnico 0-10 ────────────────────────────────────────────────────
    resultado["score"] = _calcular_score_tecnico(resultado, precio_actual)

    return resultado


def _detectar_tendencia(close, sma20, sma50, sma200) -> dict:
    precio = float(close.iloc[-1])
    puntos = 0
    señales = []

    if sma20 and precio > sma20:
        puntos += 1; señales.append("Sobre SMA20 ↑")
    elif sma20:
        puntos -= 1; señales.append("Bajo SMA20 ↓")

    if sma50 and precio > sma50:
        puntos += 1; señales.append("Sobre SMA50 ↑")
    elif sma50:
        puntos -= 1; señales.append("Bajo SMA50 ↓")

    if sma200 and precio > sma200:
        puntos += 2; señales.append("Sobre SMA200 ↑ (tendencia alcista LP)")
    elif sma200:
        puntos -= 2; señales.append("Bajo SMA200 ↓ (tendencia bajista LP)")

    if sma50 and sma200 and sma50 > sma200:
        puntos += 2; señales.append("Golden Cross activo ✓")
    elif sma50 and sma200:
        puntos -= 2; señales.append("Death Cross activo ✗")

    if puntos >= 3:
        tendencia = "ALCISTA"; color = "#00c851"
    elif puntos >= 1:
        tendencia = "Alcista moderada"; color = "#80d9a0"
    elif puntos == 0:
        tendencia = "LATERAL"; color = "#ffc107"
    elif puntos >= -2:
        tendencia = "Bajista moderada"; color = "#ff8888"
    else:
        tendencia = "BAJISTA"; color = "#ff4444"

    return {"tendencia": tendencia, "color": color, "puntos": puntos, "señales": señales}


def _calcular_score_tecnico(res: dict, precio: float) -> dict:
    puntos = 5.0  # neutro

    rsi = res.get("rsi", {}).get("valor")
    if rsi:
        if 40 <= rsi <= 60:  puntos += 0.5
        elif rsi < 30:       puntos += 1.5   # sobrevendido = oportunidad
        elif rsi > 70:       puntos -= 1.5

    macd_hist = res.get("macd", {}).get("histograma")
    if macd_hist:
        if macd_hist > 0:  puntos += 1
        else:              puntos -= 1

    tend_pts = res.get("tendencia", {}).get("puntos", 0)
    puntos += tend_pts * 0.3

    bb = res.get("bollinger", {})
    pct_b = bb.get("pct_b")
    if pct_b is not None:
        if pct_b < 0.2:   puntos += 0.5
        elif pct_b > 0.8: puntos -= 0.5

    vol_ratio = res.get("volumen", {}).get("ratio")
    if vol_ratio and vol_ratio > 1.5:
        tend = res.get("tendencia", {}).get("puntos", 0)
        if tend > 0:  puntos += 0.5
        else:         puntos -= 0.5

    score = round(min(max(puntos, 0), 10), 1)

    if score >= 7:   señal = "SEÑAL TÉCNICA ALCISTA"; color = "#00c851"
    elif score >= 5: señal = "Señal técnica neutral";  color = "#ffc107"
    else:            señal = "SEÑAL TÉCNICA BAJISTA";  color = "#ff4444"

    return {"score": score, "señal": señal, "color": color}


# ── Retornos históricos ───────────────────────────────────────────────────────

def retornos_historicos(df: pd.DataFrame) -> dict:
    """Calcula retornos para diferentes horizontes."""
    if df is None or df.empty:
        return {}

    close = df["Close"].dropna()
    precio_actual = float(close.iloc[-1])

    def ret(dias):
        if len(close) > dias:
            p_ant = float(close.iloc[-dias - 1])
            return round((precio_actual / p_ant - 1) * 100, 2) if p_ant else None
        return None

    # Volatilidad anualizada
    diarios = close.pct_change().dropna()
    vol_anual = round(float(diarios.std() * np.sqrt(252) * 100), 2) if len(diarios) > 1 else None

    # Máximo drawdown (1 año)
    ultimos_252 = close.tail(252)
    if len(ultimos_252) > 1:
        peak = ultimos_252.cummax()
        dd   = (ultimos_252 - peak) / peak
        max_dd = round(float(dd.min()) * 100, 2)
    else:
        max_dd = None

    return {
        "1d":   ret(1),
        "5d":   ret(5),
        "1m":   ret(21),
        "3m":   ret(63),
        "6m":   ret(126),
        "1y":   ret(252),
        "ytd":  _retorno_ytd(close),
        "vol_anual_pct":  vol_anual,
        "max_drawdown_pct": max_dd,
    }


def _retorno_ytd(close: pd.Series) -> Optional[float]:
    """Retorno desde inicio del año calendario."""
    try:
        año_actual = close.index[-1].year
        inicio_año = close[close.index.year == año_actual].iloc[0]
        return round((float(close.iloc[-1]) / float(inicio_año) - 1) * 100, 2)
    except Exception:
        return None
