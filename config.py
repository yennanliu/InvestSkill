"""
InvestSkill — Configuración central del sistema
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── IA ─────────────────────────────────────────────────────
ANTHROPIC_API_KEY   = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL        = "claude-sonnet-4-6"

# ── Bots ────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN      = os.getenv("TELEGRAM_BOT_TOKEN", "")
TWILIO_ACCOUNT_SID      = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN       = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_NUMBER  = os.getenv("TWILIO_WHATSAPP_NUMBER", "")

# ── App ─────────────────────────────────────────────────────
APP_ENV     = os.getenv("APP_ENV", "development")
APP_PORT    = int(os.getenv("APP_PORT", 8501))
DEBUG       = os.getenv("DEBUG", "true").lower() == "true"

# ── Caché (segundos) ────────────────────────────────────────
CACHE_TTL            = int(os.getenv("CACHE_TTL", 300))
CACHE_TTL_FINANCIALS = int(os.getenv("CACHE_TTL_FINANCIALS", 3600))
CACHE_TTL_NEWS       = int(os.getenv("CACHE_TTL_NEWS", 900))

# ── Parámetros financieros por defecto ─────────────────────
TASA_LIBRE_RIESGO      = 0.043   # 10Y Treasury actual
PRIMA_RIESGO_MERCADO   = 0.055   # ERP histórica
TASA_IMPUESTO          = 0.21    # Federal USA
TASA_CRECIMIENTO_TERMINAL = 0.025
WACC_DEFECTO           = 0.10

# ── Mercados soportados ─────────────────────────────────────
MERCADOS = {
    "us": {
        "nombre": "EE.UU. (NYSE/NASDAQ)",
        "sufijo": "",
        "moneda": "USD",
        "emoji": "🇺🇸",
    },
    "mx": {
        "nombre": "México (BMV)",
        "sufijo": ".MX",
        "moneda": "MXN",
        "emoji": "🇲🇽",
    },
    "br": {
        "nombre": "Brasil (B3)",
        "sufijo": ".SA",
        "moneda": "BRL",
        "emoji": "🇧🇷",
    },
    "ar": {
        "nombre": "Argentina (BYMA)",
        "sufijo": ".BA",
        "moneda": "ARS",
        "emoji": "🇦🇷",
    },
    "co": {
        "nombre": "Colombia (BVC)",
        "sufijo": ".CL",
        "moneda": "COP",
        "emoji": "🇨🇴",
    },
    "cl": {
        "nombre": "Chile (BCS)",
        "sufijo": ".SN",
        "moneda": "CLP",
        "emoji": "🇨🇱",
    },
    "crypto": {
        "nombre": "Criptomonedas",
        "sufijo": "-USD",
        "moneda": "USD",
        "emoji": "₿",
    },
}

# ── Tickers de referencia (índices y benchmarks) ────────────
INDICES_REFERENCIA = {
    "S&P 500":     "^GSPC",
    "NASDAQ 100":  "^NDX",
    "Dow Jones":   "^DJI",
    "Russell 2000": "^RUT",
    "VIX":         "^VIX",
    "Oro":         "GC=F",
    "Petróleo WTI": "CL=F",
    "Bitcoin":     "BTC-USD",
    "T-Note 10Y":  "^TNX",
}

# ── Sectores S&P 500 (ETFs representativos) ─────────────────
SECTORES_ETF = {
    "Tecnología":           "XLK",
    "Salud":                "XLV",
    "Finanzas":             "XLF",
    "Consumo Discrecional": "XLY",
    "Consumo Básico":       "XLP",
    "Energía":              "XLE",
    "Industria":            "XLI",
    "Materiales":           "XLB",
    "Servicios Públicos":   "XLU",
    "Inmobiliario":         "XLRE",
    "Comunicaciones":       "XLC",
}

# ── RSS feeds de noticias financieras (gratuito) ────────────
NEWS_FEEDS = [
    "https://feeds.finance.yahoo.com/rss/2.0/headline",
    "https://www.investing.com/rss/news.rss",
    "https://feeds.marketwatch.com/marketwatch/realtimeheadlines/",
    "https://seekingalpha.com/feed.xml",
]

# ── Validaciones ─────────────────────────────────────────────
def tiene_api_claude() -> bool:
    return bool(ANTHROPIC_API_KEY and ANTHROPIC_API_KEY.startswith("sk-ant"))

def tiene_token_telegram() -> bool:
    return bool(TELEGRAM_BOT_TOKEN and ":" in TELEGRAM_BOT_TOKEN)

def tiene_credenciales_twilio() -> bool:
    return bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)
