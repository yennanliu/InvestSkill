"""
InvestSkill — Motor de Valoración
DCF con escenarios, múltiplos comparables, margen de seguridad.
Todos los cálculos usan datos reales del FetcherMercado.
"""
import numpy as np
from typing import Optional
from config import (
    TASA_LIBRE_RIESGO, PRIMA_RIESGO_MERCADO,
    TASA_IMPUESTO, TASA_CRECIMIENTO_TERMINAL, WACC_DEFECTO
)


# ── DCF — Flujo de Caja Descontado ────────────────────────────────────────────

def calcular_dcf(fundamentales: dict, piotroski_raw: dict,
                 crec_fase1: float = 0.10, crec_fase2: float = 0.04,
                 margen_op_objetivo: float = None,
                 wacc_override: float = None,
                 g_terminal: float = TASA_CRECIMIENTO_TERMINAL) -> dict:
    """
    DCF en 3 escenarios (alcista / base / bajista) con datos reales.

    Args:
        fundamentales   : dict del FetcherMercado.fundamentales()
        piotroski_raw   : dict del FetcherMercado.datos_piotroski()
        crec_fase1      : tasa crecimiento años 1-5 (caso base)
        crec_fase2      : tasa crecimiento años 6-10 (caso base)
        margen_op_objetivo: margen operativo objetivo (usa real si None)
        wacc_override   : WACC personalizado (calcula automáticamente si None)
        g_terminal      : tasa crecimiento perpetuo (defecto 2.5%)
    """
    # ── Datos base ────────────────────────────────────────────────────────────
    fcf         = fundamentales.get("fcf") or 0
    ocf         = fundamentales.get("ocf") or 0
    capex       = fundamentales.get("capex") or 0
    acciones    = fundamentales.get("acciones") or 1
    deuda_neta  = fundamentales.get("deuda_neta") or 0
    beta        = fundamentales.get("beta") or 1.2
    precio      = fundamentales.get("precio") or 0
    cap_mercado = fundamentales.get("cap_mercado") or 0

    # FCF base: preferir FCF directo, sino OCF - CapEx
    fcf_base = fcf if fcf and fcf != 0 else (ocf - abs(capex)) if ocf else 0

    if fcf_base == 0:
        return {"error": "FCF insuficiente para calcular DCF — empresa sin historial de flujos"}

    # ── WACC ─────────────────────────────────────────────────────────────────
    if wacc_override:
        wacc = wacc_override
    else:
        ke   = TASA_LIBRE_RIESGO + beta * PRIMA_RIESGO_MERCADO
        deuda_total = fundamentales.get("deuda_total") or 0
        valor_total = cap_mercado + deuda_total if cap_mercado else 1
        peso_e = cap_mercado / valor_total if valor_total else 0.8
        peso_d = 1 - peso_e
        kd     = 0.06 * (1 - TASA_IMPUESTO)
        wacc   = peso_e * ke + peso_d * kd

    # ── Escenarios ────────────────────────────────────────────────────────────
    escenarios = {
        "alcista": {
            "crec_f1": crec_fase1 * 1.5,
            "crec_f2": crec_fase2 * 1.3,
            "wacc":    wacc - 0.01,
            "g":       g_terminal + 0.005,
            "prob":    0.25,
        },
        "base": {
            "crec_f1": crec_fase1,
            "crec_f2": crec_fase2,
            "wacc":    wacc,
            "g":       g_terminal,
            "prob":    0.55,
        },
        "bajista": {
            "crec_f1": crec_fase1 * 0.4,
            "crec_f2": crec_fase2 * 0.5,
            "wacc":    wacc + 0.02,
            "g":       g_terminal - 0.01,
            "prob":    0.20,
        },
    }

    resultados = {}

    for nombre, params in escenarios.items():
        cf1  = params["crec_f1"]
        cf2  = params["crec_f2"]
        w    = params["wacc"]
        g    = params["g"]

        if w <= g:
            g = w - 0.01  # evitar división por cero

        # Proyectar 10 años de FCF
        fcfs_proyectados = []
        fcf_t = fcf_base
        for t in range(1, 11):
            tasa = cf1 if t <= 5 else cf2
            fcf_t = fcf_t * (1 + tasa)
            vp = fcf_t / (1 + w) ** t
            fcfs_proyectados.append({"año": t, "fcf": round(fcf_t / 1e6, 2), "vp": round(vp / 1e6, 2)})

        # Valor terminal (Gordon Growth)
        fcf_year10   = fcf_t
        valor_terminal = fcf_year10 * (1 + g) / (w - g)
        vp_terminal    = valor_terminal / (1 + w) ** 10

        # Enterprise Value
        suma_vp_fcfs = sum(p["vp"] for p in fcfs_proyectados) * 1e6
        ev = suma_vp_fcfs + vp_terminal

        # Equity Value
        equity_value = ev - deuda_neta
        valor_por_accion = equity_value / acciones if acciones > 0 else 0

        # Margen de seguridad
        if precio and precio > 0 and valor_por_accion > 0:
            margen_seg = (valor_por_accion - precio) / valor_por_accion * 100
        else:
            margen_seg = None

        # % valor terminal sobre EV total
        pct_terminal = vp_terminal / ev * 100 if ev > 0 else None

        resultados[nombre] = {
            "crec_fase1_pct":      round(cf1 * 100, 1),
            "crec_fase2_pct":      round(cf2 * 100, 1),
            "wacc_pct":            round(w * 100, 2),
            "g_terminal_pct":      round(g * 100, 2),
            "fcfs_proyectados":    fcfs_proyectados,
            "suma_vp_fcfs_mm":     round(suma_vp_fcfs / 1e6, 1),
            "valor_terminal_mm":   round(valor_terminal / 1e6, 1),
            "vp_terminal_mm":      round(vp_terminal / 1e6, 1),
            "ev_mm":               round(ev / 1e6, 1),
            "equity_value_mm":     round(equity_value / 1e6, 1),
            "valor_intrinseco":    round(valor_por_accion, 2),
            "precio_mercado":      precio,
            "margen_seguridad_pct": round(margen_seg, 1) if margen_seg is not None else None,
            "pct_valor_terminal":  round(pct_terminal, 1) if pct_terminal else None,
            "probabilidad":        params["prob"],
        }

    # ── Precio ponderado por probabilidad ────────────────────────────────────
    precio_ponderado = sum(
        resultados[e]["valor_intrinseco"] * escenarios[e]["prob"]
        for e in escenarios
        if resultados[e]["valor_intrinseco"]
    )

    margen_seg_base = resultados["base"]["margen_seguridad_pct"]

    if margen_seg_base is not None:
        if margen_seg_base > 30:
            señal = "SIGNIFICATIVAMENTE INFRAVALORADO — margen de seguridad > 30%"
            color = "#00c851"
        elif margen_seg_base > 10:
            señal = "Moderadamente infravalorado — margen de seguridad 10–30%"
            color = "#80d9a0"
        elif margen_seg_base > -10:
            señal = "Valoración justa — cotiza cerca del valor intrínseco"
            color = "#ffc107"
        else:
            señal = "SOBREVALORADO — cotiza por encima del valor intrínseco"
            color = "#ff4444"
    else:
        señal = "Sin datos suficientes"
        color = "#aaaaaa"

    return {
        "error":             None,
        "fcf_base_mm":       round(fcf_base / 1e6, 2),
        "acciones_mm":       round(acciones / 1e6, 2),
        "deuda_neta_mm":     round(deuda_neta / 1e6, 2),
        "wacc_base_pct":     round(wacc * 100, 2),
        "escenarios":        resultados,
        "precio_ponderado":  round(precio_ponderado, 2),
        "precio_mercado":    precio,
        "señal":             señal,
        "color":             color,
    }


# ── Tabla de sensibilidad DCF ─────────────────────────────────────────────────

def tabla_sensibilidad(fundamentales: dict, piotroski_raw: dict,
                       waccs: list = None, tasas_g: list = None) -> dict:
    """
    Genera una tabla de sensibilidad: valor intrínseco para combinaciones de WACC y g.
    """
    if waccs is None:
        waccs = [0.07, 0.08, 0.09, 0.10, 0.11, 0.12]
    if tasas_g is None:
        tasas_g = [0.015, 0.020, 0.025, 0.030, 0.035]

    tabla = {}
    for w in waccs:
        fila = {}
        for g in tasas_g:
            dcf = calcular_dcf(fundamentales, piotroski_raw,
                               wacc_override=w, g_terminal=g)
            if not dcf.get("error"):
                vi = dcf["escenarios"]["base"]["valor_intrinseco"]
                fila[f"{g*100:.1f}%"] = vi
            else:
                fila[f"{g*100:.1f}%"] = None
        tabla[f"{w*100:.0f}%"] = fila

    return tabla


# ── Valoración por múltiplos ──────────────────────────────────────────────────

def valoracion_multiples(fundamentales: dict) -> dict:
    """
    Estima valor intrínseco usando múltiplos de mercado:
    P/E, EV/EBITDA, P/S, P/FCF.
    """
    precio    = fundamentales.get("precio") or 0
    eps_ttm   = None
    margen_n  = fundamentales.get("margen_neto")
    pe_ttm    = fundamentales.get("pe_ttm")
    pe_fwd    = fundamentales.get("pe_forward")
    ev_ebitda = fundamentales.get("ev_ebitda")
    ps        = fundamentales.get("precio_ventas")
    cap       = fundamentales.get("cap_mercado") or 0
    fcf       = fundamentales.get("fcf") or 0
    acciones  = fundamentales.get("acciones") or 1

    resultados = {}

    # Múltiplo P/E histórico (15x = media histórica S&P 500)
    if pe_ttm and precio:
        eps_ttm = precio / pe_ttm
        pe_hist = 17.0  # promedio histórico S&P 500
        vi_pe = eps_ttm * pe_hist
        resultados["PE_historico"] = {
            "metodo":     "P/E Histórico S&P 500 (17x)",
            "valor":      round(vi_pe, 2),
            "multiplo":   pe_hist,
            "base":       round(eps_ttm, 4),
            "unidad_base":"EPS TTM",
        }

    # Múltiplo P/E sector (usa forward PE si disponible)
    if pe_fwd and precio:
        eps_fwd = precio / pe_fwd
        pe_sect = 20.0  # estimado sector tecnología / promedio
        vi_pe_fwd = eps_fwd * pe_sect
        resultados["PE_forward"] = {
            "metodo":     "P/E Forward Sector (20x)",
            "valor":      round(vi_pe_fwd, 2),
            "multiplo":   pe_sect,
            "base":       round(eps_fwd, 4),
            "unidad_base":"EPS Forward",
        }

    # EV/EBITDA
    if ev_ebitda and cap > 0 and acciones > 0:
        ebitda = cap / (ps or 1)  # aproximación si no hay EBITDA directo
        ev     = fundamentales.get("ev") or 0
        if ev and ev_ebitda:
            ebitda_real = ev / ev_ebitda
            ev_objetivo = ebitda_real * 12  # 12x = múltiplo neutral
            deuda_neta  = fundamentales.get("deuda_neta") or 0
            equity_obj  = ev_objetivo - deuda_neta
            vi_ev_ebitda = equity_obj / acciones
            resultados["EV_EBITDA"] = {
                "metodo":     "EV/EBITDA Neutral (12x)",
                "valor":      round(vi_ev_ebitda, 2),
                "multiplo":   12,
                "base":       round(ebitda_real / 1e6, 1),
                "unidad_base":"EBITDA (MM USD)",
            }

    # P/FCF
    if fcf and acciones > 0:
        fcf_por_accion = fcf / acciones
        pfcf_neutral   = 20.0  # 20x FCF = valoración neutral
        vi_pfcf = fcf_por_accion * pfcf_neutral
        resultados["P_FCF"] = {
            "metodo":     "P/FCF Neutral (20x)",
            "valor":      round(vi_pfcf, 2),
            "multiplo":   pfcf_neutral,
            "base":       round(fcf_por_accion, 4),
            "unidad_base":"FCF por acción",
        }

    # ── Precio promedio de métodos disponibles ──
    valores = [v["valor"] for v in resultados.values() if v["valor"] and v["valor"] > 0]
    promedio = round(sum(valores) / len(valores), 2) if valores else None
    upside   = round((promedio / precio - 1) * 100, 1) if (promedio and precio) else None

    return {
        "metodos":           resultados,
        "precio_promedio":   promedio,
        "precio_mercado":    precio,
        "upside_pct":        upside,
        "señal": (
            "INFRAVALORADO" if (upside and upside > 15) else
            "SOBREVALORADO" if (upside and upside < -15) else
            "VALORACIÓN JUSTA" if upside is not None else "Sin datos"
        ),
    }


# ── Regla de Chowder (dividendos) ────────────────────────────────────────────

def regla_chowder(fundamentales: dict) -> Optional[dict]:
    """
    Chowder Rule: Dividend Yield + Dividend Growth Rate >= 12% (acciones valor)
    o >= 8% (acciones crecimiento con yield < 3%).
    """
    div_yield = fundamentales.get("div_yield") or 0
    crec_gan  = fundamentales.get("crec_ganancias") or 0

    if div_yield == 0:
        return None

    chowder_num = div_yield + crec_gan
    umbral = 8.0 if div_yield < 3 else 12.0

    return {
        "div_yield_pct":   div_yield,
        "crec_estimado_pct": crec_gan,
        "chowder_number":  round(chowder_num, 2),
        "umbral":          umbral,
        "pasa":            chowder_num >= umbral,
        "señal": f"{'PASA' if chowder_num >= umbral else 'FALLA'} — Chowder Number {chowder_num:.1f}% vs umbral {umbral}%",
    }


# ── Score de valoración global ────────────────────────────────────────────────

def score_valoracion(dcf_result: dict, multiples_result: dict, fundamentales: dict) -> dict:
    """
    Genera un score de valoración global 0-10 combinando DCF y múltiplos.
    """
    puntos = 0
    max_pts = 10
    detalles = []

    # DCF base (4 puntos)
    if not dcf_result.get("error"):
        mg = dcf_result["escenarios"]["base"].get("margen_seguridad_pct")
        if mg is not None:
            if mg > 40:   pts = 4; desc = "DCF: gran descuento (+40%)"
            elif mg > 20: pts = 3; desc = "DCF: buen descuento (20-40%)"
            elif mg > 0:  pts = 2; desc = "DCF: ligero descuento (0-20%)"
            elif mg > -20:pts = 1; desc = "DCF: ligera prima (0-20%)"
            else:         pts = 0; desc = "DCF: prima elevada (>20%)"
            puntos += pts
            detalles.append(desc)

    # Múltiplos (3 puntos)
    upside = multiples_result.get("upside_pct")
    if upside is not None:
        if upside > 30:   pts = 3; desc = "Múltiplos: muy atractivos"
        elif upside > 10: pts = 2; desc = "Múltiplos: atractivos"
        elif upside > -10:pts = 1; desc = "Múltiplos: neutral"
        else:             pts = 0; desc = "Múltiplos: caros"
        puntos += pts
        detalles.append(desc)

    # FCF yield (2 puntos)
    fcf_yield = fundamentales.get("fcf_yield")
    if fcf_yield is not None:
        if fcf_yield > 6:   pts = 2; desc = f"FCF yield {fcf_yield:.1f}% — excelente"
        elif fcf_yield > 3: pts = 1; desc = f"FCF yield {fcf_yield:.1f}% — aceptable"
        else:               pts = 0; desc = f"FCF yield {fcf_yield:.1f}% — bajo"
        puntos += pts
        detalles.append(desc)

    # PEG (1 punto)
    peg = fundamentales.get("peg")
    if peg is not None:
        if peg < 1:   pts = 1; desc = f"PEG {peg:.2f} — infravalorado vs crecimiento"
        else:         pts = 0; desc = f"PEG {peg:.2f} — caro vs crecimiento"
        puntos += pts
        detalles.append(desc)

    score = round(min(puntos / max_pts * 10, 10), 1)

    if score >= 7:
        señal = "COMPRAR"; color = "#00c851"
    elif score >= 5:
        señal = "MANTENER/VIGILAR"; color = "#ffc107"
    else:
        señal = "CAUTELA/VENDER"; color = "#ff4444"

    return {
        "score":    score,
        "señal":    señal,
        "color":    color,
        "detalles": detalles,
    }
