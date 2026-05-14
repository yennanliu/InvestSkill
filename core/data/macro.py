"""
InvestSkill — Datos macroeconómicos
Fuente: FRED (Federal Reserve) via pandas_datareader — gratuito, sin API key
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import warnings
warnings.filterwarnings("ignore")

try:
    import pandas_datareader.data as web
    PANDAS_DATAREADER_OK = True
except ImportError:
    PANDAS_DATAREADER_OK = False


# ── Indicadores FRED ─────────────────────────────────────────────────────────

INDICADORES_FRED = {
    # Crecimiento
    "PIB_real":              ("GDP",    "PIB Real EE.UU. (Miles de MM USD)"),
    "PIB_crecimiento":       ("A191RL1Q225SBEA", "Crecimiento PIB (%)"),
    # Empleo
    "desempleo":             ("UNRATE", "Tasa de Desempleo (%)"),
    "nominas_no_agricolas":  ("PAYEMS", "Nóminas No Agrícolas (miles)"),
    "solicitudes_desempleo": ("ICSA",   "Solicitudes Desempleo Iniciales"),
    # Inflación
    "cpi":                   ("CPIAUCSL", "IPC (Índice)"),
    "cpi_anual":             ("CPIAUCNS", "Inflación IPC YoY (%)"),
    "pce":                   ("PCEPI",   "PCE Deflactor (Índice)"),
    "pce_central":           ("PCEPILFE","PCE Subyacente (%)"),
    # Tasas de interés
    "fed_funds":             ("FEDFUNDS","Tasa Fondos Federales (%)"),
    "t_10y":                 ("DGS10",  "Rendimiento Bono 10 años (%)"),
    "t_2y":                  ("DGS2",   "Rendimiento Bono 2 años (%)"),
    "t_3m":                  ("DGS3MO", "Rendimiento Bono 3 meses (%)"),
    "spread_10y_2y":         ("T10Y2Y", "Spread 10Y-2Y (curva inversión)"),
    "spread_10y_3m":         ("T10Y3M", "Spread 10Y-3M"),
    # Manufactura / PMI
    "produccion_industrial": ("INDPRO", "Producción Industrial (índice)"),
    "utilizacion_capacidad": ("TCU",    "Utilización Capacidad Industrial (%)"),
    # Vivienda
    "permisos_construccion": ("PERMIT", "Permisos de Construcción (miles)"),
    "ventas_casas_nuevas":   ("HSN1F",  "Ventas Casas Nuevas (miles)"),
    # Consumo / Confianza
    "ventas_minoristas":     ("RSAFS",  "Ventas Minoristas (MM USD)"),
    "confianza_consumidor":  ("UMCSENT","Confianza Consumidor U. Michigan"),
    # Dinero y crédito
    "m2":                    ("M2SL",   "Oferta Monetaria M2 (Miles de MM)"),
}


def obtener_indicador_fred(codigo: str, inicio: str = "2018-01-01") -> pd.Series:
    """Obtiene un indicador de FRED. Retorna Series vacía si falla."""
    if not PANDAS_DATAREADER_OK:
        return pd.Series(dtype=float)
    try:
        df = web.DataReader(codigo, "fred", inicio, datetime.today())
        return df.iloc[:, 0].dropna()
    except Exception:
        return pd.Series(dtype=float)


def dashboard_macro() -> dict:
    """
    Retorna los indicadores macroeconómicos clave con el último valor disponible.
    """
    resultado = {}
    inicio = (datetime.today() - timedelta(days=365 * 3)).strftime("%Y-%m-%01")

    for nombre, (codigo, descripcion) in INDICADORES_FRED.items():
        serie = obtener_indicador_fred(codigo, inicio)
        if not serie.empty:
            ultimo_val  = float(serie.iloc[-1])
            anterior    = float(serie.iloc[-2]) if len(serie) >= 2 else None
            hace_1y     = float(serie.iloc[-13]) if len(serie) >= 13 else None
            cambio_mom  = round(ultimo_val - anterior, 3) if anterior is not None else None
            cambio_anual = round(ultimo_val - hace_1y, 3) if hace_1y is not None else None

            resultado[nombre] = {
                "descripcion":   descripcion,
                "codigo_fred":   codigo,
                "valor":         round(ultimo_val, 3),
                "fecha":         serie.index[-1].strftime("%Y-%m-%d"),
                "cambio_mom":    cambio_mom,
                "cambio_anual":  cambio_anual,
                "serie":         serie.tail(36).to_dict(),  # últimos 3 años
            }
        else:
            resultado[nombre] = {
                "descripcion": descripcion,
                "codigo_fred": codigo,
                "valor": None,
                "fecha": None,
                "cambio_mom": None,
                "cambio_anual": None,
                "serie": {},
            }

    return resultado


def curva_rendimientos() -> dict:
    """
    Construye la curva de rendimientos del Tesoro de EE.UU.
    Señala inversión si el spread 10Y-2Y es negativo.
    """
    plazos = {
        "3M": "DGS3MO", "6M": "DGS6MO",
        "1Y": "DGS1",   "2Y": "DGS2",
        "3Y": "DGS3",   "5Y": "DGS5",
        "7Y": "DGS7",   "10Y": "DGS10",
        "20Y": "DGS20", "30Y": "DGS30",
    }

    puntos = {}
    for plazo, codigo in plazos.items():
        serie = obtener_indicador_fred(codigo, "2023-01-01")
        if not serie.empty:
            puntos[plazo] = round(float(serie.iloc[-1]), 3)

    # Detectar inversión
    invertida = False
    spread_10y_2y = None
    if "10Y" in puntos and "2Y" in puntos:
        spread_10y_2y = round(puntos["10Y"] - puntos["2Y"], 3)
        invertida = spread_10y_2y < 0

    return {
        "puntos":        puntos,
        "spread_10y_2y": spread_10y_2y,
        "invertida":     invertida,
        "señal":         "CURVA INVERTIDA — señal histórica de recesión" if invertida else "Curva normal",
        "fecha":         datetime.today().strftime("%Y-%m-%d"),
    }


def condiciones_mercado() -> dict:
    """
    Resumen ejecutivo de las condiciones de mercado actuales
    basado en indicadores FRED clave.
    """
    # Indicadores clave
    desempleo_serie  = obtener_indicador_fred("UNRATE", "2020-01-01")
    inflacion_serie  = obtener_indicador_fred("CPIAUCSL", "2018-01-01")
    fed_funds_serie  = obtener_indicador_fred("FEDFUNDS", "2020-01-01")
    t10y_serie       = obtener_indicador_fred("DGS10", "2020-01-01")
    spread_serie     = obtener_indicador_fred("T10Y2Y", "2020-01-01")

    def ultimo(serie):
        return round(float(serie.iloc[-1]), 3) if not serie.empty else None

    def cambio_yoy_pct(serie):
        if len(serie) >= 13:
            v0 = float(serie.iloc[-13])
            v1 = float(serie.iloc[-1])
            if v0 != 0:
                return round((v1 - v0) / abs(v0) * 100, 2)
        return None

    desemp = ultimo(desempleo_serie)
    inflacion_idx = ultimo(inflacion_serie)
    inflacion_yoy = cambio_yoy_pct(inflacion_serie)
    fed = ultimo(fed_funds_serie)
    t10y = ultimo(t10y_serie)
    spread_10_2 = ultimo(spread_serie)

    # Señal de régimen macro
    if inflacion_yoy and inflacion_yoy > 4 and fed and fed > 4:
        regimen = "Restrictivo — inflación elevada, tasas altas"
    elif inflacion_yoy and inflacion_yoy < 2.5 and fed and fed < 3:
        regimen = "Acomodaticio — inflación baja, tasas bajas"
    elif spread_10_2 is not None and spread_10_2 < 0:
        regimen = "Transición — curva invertida, posible desaceleración"
    else:
        regimen = "Neutral — condiciones moderadas"

    return {
        "desempleo_pct":      desemp,
        "inflacion_yoy_pct":  inflacion_yoy,
        "fed_funds_pct":      fed,
        "t10y_pct":           t10y,
        "spread_10y_2y":      spread_10_2,
        "curva_invertida":    spread_10_2 < 0 if spread_10_2 is not None else False,
        "regimen_macro":      regimen,
        "fecha":              datetime.today().strftime("%Y-%m-%d"),
    }
