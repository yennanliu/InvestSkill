"""
InvestSkill — Motor de Análisis Fundamental
Calcula Piotroski F-Score, ROIC, WACC, EVA y métricas de calidad
con datos reales provenientes del FetcherMercado.
"""
import numpy as np
from typing import Optional
from config import TASA_LIBRE_RIESGO, PRIMA_RIESGO_MERCADO, TASA_IMPUESTO


# ── Piotroski F-Score ─────────────────────────────────────────────────────────

def calcular_piotroski(datos: dict) -> dict:
    """
    Calcula el Piotroski F-Score (0–9) a partir de datos financieros reales.
    Retorna puntuación, criterios individuales e interpretación.
    """
    if datos.get("error"):
        return {"error": datos["error"], "score": None}

    criterios = {}
    puntos    = {}

    ni0  = datos.get("net_income_0")
    ni1  = datos.get("net_income_1")
    ta0  = datos.get("total_assets_0")
    ta1  = datos.get("total_assets_1")
    ocf0 = datos.get("ocf_0")
    ld0  = datos.get("long_debt_0", 0)
    ld1  = datos.get("long_debt_1", 0)
    ca0  = datos.get("curr_assets_0")
    cl0  = datos.get("curr_liab_0")
    ca1  = datos.get("curr_assets_1")
    cl1  = datos.get("curr_liab_1")
    sh0  = datos.get("shares_0", 0)
    sh1  = datos.get("shares_1", 0)
    gp0  = datos.get("gross_profit_0")
    rev0 = datos.get("revenue_0")
    gp1  = datos.get("gross_profit_1")
    rev1 = datos.get("revenue_1")

    ta_prom = (ta0 + ta1) / 2 if (ta0 and ta1) else ta0

    # ── Rentabilidad ──────────────────────────────────────────────────────────

    # F1: ROA > 0
    roa0 = (ni0 / ta_prom) if (ni0 is not None and ta_prom) else None
    p1 = 1 if (roa0 is not None and roa0 > 0) else 0
    criterios["F1_ROA_positivo"] = {
        "descripcion": "ROA positivo (ganancia neta > 0)",
        "valor": round(roa0 * 100, 2) if roa0 is not None else None,
        "unidad": "%",
        "pasa": bool(p1),
        "puntos": p1,
    }

    # F2: OCF > 0
    p2 = 1 if (ocf0 is not None and ocf0 > 0) else 0
    criterios["F2_OCF_positivo"] = {
        "descripcion": "Flujo de caja operativo positivo",
        "valor": ocf0,
        "unidad": "USD",
        "pasa": bool(p2),
        "puntos": p2,
    }

    # F3: Mejora del ROA YoY
    roa1 = (ni1 / ta1) if (ni1 is not None and ta1) else None
    p3 = 1 if (roa0 is not None and roa1 is not None and roa0 > roa1) else 0
    criterios["F3_ROA_mejora"] = {
        "descripcion": "ROA mejoró respecto al año anterior",
        "valor": round((roa0 - roa1) * 100, 3) if (roa0 and roa1) else None,
        "unidad": "pp",
        "pasa": bool(p3),
        "puntos": p3,
    }

    # F4: Calidad de ganancias (OCF/TA > ROA)
    ocf_ta = (ocf0 / ta_prom) if (ocf0 and ta_prom) else None
    p4 = 1 if (ocf_ta is not None and roa0 is not None and ocf_ta > roa0) else 0
    criterios["F4_calidad_ganancias"] = {
        "descripcion": "Flujo de caja > ROA (ganancias respaldadas por caja)",
        "valor": round(ocf_ta * 100, 2) if ocf_ta else None,
        "unidad": "%",
        "pasa": bool(p4),
        "puntos": p4,
    }

    # ── Apalancamiento / Liquidez ─────────────────────────────────────────────

    # F5: Apalancamiento redujo (deuda LP / activos promedio)
    lev0 = (ld0 / ta0) if (ld0 is not None and ta0) else None
    lev1 = (ld1 / ta1) if (ld1 is not None and ta1) else None
    p5 = 1 if (lev0 is not None and lev1 is not None and lev0 < lev1) else 0
    criterios["F5_apalancamiento_baja"] = {
        "descripcion": "Apalancamiento disminuyó año a año",
        "valor": round((lev0 - lev1) * 100, 3) if (lev0 and lev1) else None,
        "unidad": "pp",
        "pasa": bool(p5),
        "puntos": p5,
    }

    # F6: Mejora del ratio corriente
    rc0 = (ca0 / cl0) if (ca0 and cl0) else None
    rc1 = (ca1 / cl1) if (ca1 and cl1) else None
    p6 = 1 if (rc0 is not None and rc1 is not None and rc0 > rc1) else 0
    criterios["F6_liquidez_mejora"] = {
        "descripcion": "Ratio corriente mejoró año a año",
        "valor": round(rc0, 3) if rc0 else None,
        "unidad": "x",
        "pasa": bool(p6),
        "puntos": p6,
    }

    # F7: Sin nueva emisión de acciones
    p7 = 1 if (sh0 is not None and sh1 is not None and sh0 <= sh1 * 1.01) else 0
    criterios["F7_sin_dilusion"] = {
        "descripcion": "No emitió nuevas acciones (sin dilución)",
        "valor": round((sh0 - sh1) / sh1 * 100, 2) if sh1 else None,
        "unidad": "% cambio",
        "pasa": bool(p7),
        "puntos": p7,
    }

    # ── Eficiencia operativa ──────────────────────────────────────────────────

    # F8: Mejora del margen bruto
    mg0 = (gp0 / rev0) if (gp0 and rev0) else None
    mg1 = (gp1 / rev1) if (gp1 and rev1) else None
    p8 = 1 if (mg0 is not None and mg1 is not None and mg0 > mg1) else 0
    criterios["F8_margen_bruto_mejora"] = {
        "descripcion": "Margen bruto mejoró año a año",
        "valor": round((mg0 - mg1) * 100, 2) if (mg0 and mg1) else None,
        "unidad": "pp",
        "pasa": bool(p8),
        "puntos": p8,
    }

    # F9: Mejora de rotación de activos
    at0 = (rev0 / ta_prom) if (rev0 and ta_prom) else None
    at1 = (rev1 / ta1) if (rev1 and ta1) else None
    p9 = 1 if (at0 is not None and at1 is not None and at0 > at1) else 0
    criterios["F9_rotacion_activos_mejora"] = {
        "descripcion": "Rotación de activos mejoró año a año",
        "valor": round(at0, 3) if at0 else None,
        "unidad": "x",
        "pasa": bool(p9),
        "puntos": p9,
    }

    # ── Score final ───────────────────────────────────────────────────────────
    score = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9

    if score >= 8:
        interpretacion = "Posición financiera FUERTE — candidato de alta calidad"
        color          = "#00c851"
    elif score >= 5:
        interpretacion = "Calidad MEDIA — señales mixtas, análisis adicional requerido"
        color          = "#ffc107"
    else:
        interpretacion = "Posición financiera DÉBIL — alto riesgo de deterioro"
        color          = "#ff4444"

    return {
        "score":          score,
        "max_score":      9,
        "criterios":      criterios,
        "interpretacion": interpretacion,
        "color":          color,
        "error":          None,
    }


# ── ROIC / WACC / EVA ────────────────────────────────────────────────────────

def calcular_roic_wacc(fundamentales: dict, piotroski_raw: dict) -> dict:
    """
    Calcula ROIC, WACC y EVA (Economic Value Added) con datos reales.
    """
    resultado = {"error": None}

    # Datos de entrada
    ocf         = fundamentales.get("ocf") or 0
    capex       = fundamentales.get("capex") or 0
    deuda_total = fundamentales.get("deuda_total") or 0
    caja        = fundamentales.get("caja_total") or 0
    cap_mercado = fundamentales.get("cap_mercado") or 0
    beta        = fundamentales.get("beta") or 1.2
    roe         = fundamentales.get("roe")
    roa         = fundamentales.get("roa")
    margen_op   = fundamentales.get("margen_operativo")

    ni = piotroski_raw.get("net_income_0") or 0
    ta = piotroski_raw.get("total_assets_0") or 0
    ta1= piotroski_raw.get("total_assets_1") or 0

    # ── NOPAT ──
    ebit = ni / (1 - TASA_IMPUESTO) if ni else 0
    nopat = ebit * (1 - TASA_IMPUESTO)

    # ── Capital invertido ──
    deuda_neta    = deuda_total - caja
    cap_invertido = (cap_mercado + deuda_neta) if cap_mercado else (ta - caja)
    if cap_invertido <= 0:
        cap_invertido = ta or 1

    # ── ROIC ──
    roic = (nopat / cap_invertido * 100) if cap_invertido else None

    # ── WACC (CAPM) ──
    ke   = TASA_LIBRE_RIESGO + beta * PRIMA_RIESGO_MERCADO     # costo equity
    valor_total = cap_mercado + deuda_total if cap_mercado else 1
    peso_e = cap_mercado / valor_total if valor_total else 0.8
    peso_d = deuda_total / valor_total if valor_total else 0.2

    # Costo de deuda aproximado
    kd_bruto = 0.06  # proxy si no hay deuda financiera
    kd_neto  = kd_bruto * (1 - TASA_IMPUESTO)

    wacc = (peso_e * ke) + (peso_d * kd_neto)

    # ── EVA ──
    eva = None
    if roic is not None:
        spread = (roic / 100) - wacc
        eva    = spread * cap_invertido

    # ── Señal ──
    if roic is not None:
        if roic / 100 > wacc + 0.03:
            señal_roic = "CREANDO VALOR — ROIC supera ampliamente el WACC"
            color_roic = "#00c851"
        elif roic / 100 > wacc:
            señal_roic = "Creando valor — ROIC supera WACC por margen estrecho"
            color_roic = "#80d9a0"
        else:
            señal_roic = "DESTRUYENDO VALOR — ROIC por debajo del WACC"
            color_roic = "#ff4444"
    else:
        señal_roic = "Sin datos suficientes"
        color_roic = "#aaaaaa"

    resultado.update({
        "nopat":         round(nopat / 1e6, 2) if nopat else None,
        "cap_invertido_mm": round(cap_invertido / 1e6, 2) if cap_invertido else None,
        "roic_pct":      round(roic, 2) if roic else None,
        "wacc_pct":      round(wacc * 100, 2),
        "ke_pct":        round(ke * 100, 2),
        "kd_pct":        round(kd_neto * 100, 2),
        "peso_equity":   round(peso_e * 100, 1),
        "peso_deuda":    round(peso_d * 100, 1),
        "beta":          round(beta, 3),
        "spread_roic_wacc": round((roic / 100 - wacc) * 100, 2) if roic else None,
        "eva_mm":        round(eva / 1e6, 2) if eva else None,
        "señal":         señal_roic,
        "color":         color_roic,
        "tasa_libre_riesgo_pct": round(TASA_LIBRE_RIESGO * 100, 2),
        "prima_riesgo_pct":      round(PRIMA_RIESGO_MERCADO * 100, 2),
    })

    return resultado


# ── Calidad de ganancias ──────────────────────────────────────────────────────

def calidad_ganancias(fundamentales: dict, piotroski_raw: dict) -> dict:
    """Evalúa la calidad y sostenibilidad de las ganancias reportadas."""
    ocf   = fundamentales.get("ocf") or 0
    ni    = piotroski_raw.get("net_income_0") or 0
    ta    = piotroski_raw.get("total_assets_0") or 1
    ta1   = piotroski_raw.get("total_assets_1") or 1
    ta_prom = (ta + ta1) / 2

    # Ratio de conversión a caja
    ccr = round(ocf / ni, 3) if ni else None

    # Ratio de accruals
    accruals = round((ni - ocf) / ta_prom * 100, 2) if ta_prom else None

    # Interpretación
    if ccr is not None:
        if ccr >= 1.0:
            ccr_señal = "ALTA — Las ganancias están totalmente respaldadas por caja"
            ccr_color = "#00c851"
        elif ccr >= 0.7:
            ccr_señal = "MEDIA — Ganancias mayormente respaldadas por caja"
            ccr_color = "#ffc107"
        else:
            ccr_señal = "BAJA — Las ganancias podrían estar infladas"
            ccr_color = "#ff4444"
    else:
        ccr_señal = "Sin datos"
        ccr_color = "#aaaaaa"

    return {
        "tasa_conversion_caja": ccr,
        "ccr_señal":            ccr_señal,
        "ccr_color":            ccr_color,
        "ratio_accruals_pct":   accruals,
        "accruals_señal": (
            "Bajo — ganancias de alta calidad" if (accruals is not None and abs(accruals) < 5)
            else "Alto — revisar accruals contables" if (accruals is not None and abs(accruals) >= 5)
            else "Sin datos"
        ),
    }
