"""
InvestSkill — Bot de WhatsApp via Twilio
Ejecuta un webhook Flask que Twilio llama cuando llega un mensaje.

SETUP:
1. Cuenta Twilio gratuita: https://console.twilio.com
2. Activa WhatsApp Sandbox en Twilio → Messaging → Try it out → Send a WhatsApp message
3. Configura en Twilio el webhook: http://TU_IP:5000/whatsapp
4. Para exponer localmente: usa ngrok → ngrok http 5000
5. Agrega credenciales en .env

COMANDOS (escríbelos en WhatsApp al número sandbox de Twilio):
  precio AAPL         — Precio en tiempo real
  analizar AAPL       — Análisis completo
  fundamental AAPL    — Métricas fundamentales
  dcf AAPL            — Valoración DCF
  tecnico AAPL        — Score técnico
  macro               — Indicadores macroeconómicos
  ayuda               — Ver todos los comandos
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client as TwilioClient

from core.data.fetcher import FetcherMercado, formatear_numero
from core.data.macro import condiciones_mercado
from core.analysis.fundamental import calcular_piotroski, calcular_roic_wacc
from core.analysis.valuation import calcular_dcf
from core.analysis.technical import analizar as analizar_tecnico, retornos_historicos
from core.ai.analyst import señal_inversion_final
from config import (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
                    TWILIO_WHATSAPP_NUMBER, WEBHOOK_PORT, tiene_credenciales_twilio)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def fmt_pct(v) -> str:
    return f"{v:.2f}%" if v is not None else "N/D"

def fmt_num(v, prefijo="$") -> str:
    return formatear_numero(v, prefijo=prefijo) if v else "N/D"

def responder(texto: str) -> str:
    """Genera respuesta TwiML."""
    r = MessagingResponse()
    r.message(texto)
    return str(r)


# ── Lógica de análisis ────────────────────────────────────────────────────────

def procesar_precio(ticker: str) -> str:
    try:
        f = FetcherMercado(ticker)
        p = f.precio_actual()
        em = "📈" if (p.get("cambio_pct", 0) or 0) >= 0 else "📉"
        return (
            f"*{p.get('nombre', ticker)}* ({ticker})\n\n"
            f"💰 Precio: {p.get('moneda','USD')} {p.get('precio', 'N/D'):,.4f}\n"
            f"{em} Cambio: {p.get('cambio_pct', 0):+.2f}%\n\n"
            f"📊 Rango día: {p.get('minimo_dia','N/D')} - {p.get('maximo_dia','N/D')}\n"
            f"📅 52 sem: {p.get('min_52s','N/D')} - {p.get('max_52s','N/D')}\n"
            f"🏢 Cap: {fmt_num(p.get('cap_mercado'))}\n"
            f"⏰ {p.get('timestamp','')} (retraso ~15 min)"
        )
    except Exception as e:
        return f"❌ Error al obtener precio de {ticker}: {e}"


def procesar_fundamental(ticker: str) -> str:
    try:
        f = FetcherMercado(ticker)
        fund = f.fundamentales()
        piot_raw = f.datos_piotroski()
        piot = calcular_piotroski(piot_raw)
        rw   = calcular_roic_wacc(fund, piot_raw)
        return (
            f"📊 *Fundamentales — {ticker}*\n\n"
            f"Valoración:\n"
            f"  P/E TTM: {fund.get('pe_ttm','N/D')}x\n"
            f"  EV/EBITDA: {fund.get('ev_ebitda','N/D')}x\n"
            f"  FCF Yield: {fmt_pct(fund.get('fcf_yield'))}\n\n"
            f"Rentabilidad:\n"
            f"  Margen Neto: {fmt_pct(fund.get('margen_neto'))}\n"
            f"  ROE: {fmt_pct(fund.get('roe'))}\n\n"
            f"Balance:\n"
            f"  Caja: {fmt_num(fund.get('caja_total'))}\n"
            f"  Deuda: {fmt_num(fund.get('deuda_total'))}\n"
            f"  D/E: {fund.get('deuda_equity','N/D')}x\n\n"
            f"Piotroski: {piot.get('score','N/D')}/9 - {piot.get('interpretacion','')}\n"
            f"ROIC: {rw.get('roic_pct','N/D')}% vs WACC: {rw.get('wacc_pct','N/D')}%"
        )
    except Exception as e:
        return f"❌ Error: {e}"


def procesar_dcf(ticker: str) -> str:
    try:
        f    = FetcherMercado(ticker)
        fund = f.fundamentales()
        piot = f.datos_piotroski()
        dcf  = calcular_dcf(fund, piot)
        if dcf.get("error"):
            return f"⚠️ DCF no disponible: {dcf['error']}"
        esc = dcf["escenarios"]
        b, al, ba = esc["base"], esc["alcista"], esc["bajista"]
        return (
            f"💰 *DCF — {ticker}*\n\n"
            f"WACC: {dcf.get('wacc_base_pct')}% | FCF Base: ${dcf.get('fcf_base_mm')}M\n"
            f"Precio mercado: ${dcf.get('precio_mercado',0):,.2f}\n\n"
            f"Escenarios:\n"
            f"  🐻 Bajista: ${ba['valor_intrinseco']:,.2f} (MoS: {ba.get('margen_seguridad_pct','N/D')}%)\n"
            f"  📊 Base:    ${b['valor_intrinseco']:,.2f} (MoS: {b.get('margen_seguridad_pct','N/D')}%)\n"
            f"  🐂 Alcista: ${al['valor_intrinseco']:,.2f} (MoS: {al.get('margen_seguridad_pct','N/D')}%)\n\n"
            f"Precio ponderado: ${dcf.get('precio_ponderado',0):,.2f}\n"
            f"{dcf.get('señal','')}"
        )
    except Exception as e:
        return f"❌ Error: {e}"


def procesar_tecnico(ticker: str) -> str:
    try:
        f    = FetcherMercado(ticker)
        hist = f.precio_historico("1y")
        tech = analizar_tecnico(hist)
        rets = retornos_historicos(hist)
        if tech.get("error"):
            return f"⚠️ {tech['error']}"
        sc   = tech.get("score",{})
        tend = tech.get("tendencia",{})
        rsi  = tech.get("rsi",{})
        macd = tech.get("macd",{})
        return (
            f"📈 *Técnico — {ticker}*\n\n"
            f"Score: {sc.get('score','N/D')}/10 — {sc.get('señal','')}\n"
            f"Tendencia: {tend.get('tendencia','N/D')}\n\n"
            f"RSI(14): {rsi.get('valor','N/D')} — {rsi.get('señal','')}\n"
            f"MACD: {macd.get('señal','')}\n\n"
            f"Retornos:\n"
            f"  1D: {fmt_pct(rets.get('1d'))} | 1M: {fmt_pct(rets.get('1m'))}\n"
            f"  1Y: {fmt_pct(rets.get('1y'))} | YTD: {fmt_pct(rets.get('ytd'))}\n"
            f"Volatilidad anual: {fmt_pct(rets.get('vol_anual_pct'))}"
        )
    except Exception as e:
        return f"❌ Error: {e}"


def procesar_analizar(ticker: str) -> str:
    try:
        f       = FetcherMercado(ticker)
        datos   = f.resumen_completo()
        hist_1y = f.precio_historico("1y")
        fund    = datos["fundamentales"]
        piot_raw= datos["piotroski_raw"]
        consenso= datos["consenso"]
        precio_d= datos["precio"]

        piot  = calcular_piotroski(piot_raw)
        rw    = calcular_roic_wacc(fund, piot_raw)
        dcf   = calcular_dcf(fund, piot_raw)
        tech  = analizar_tecnico(hist_1y)
        señal = señal_inversion_final(piot, rw, dcf, tech, consenso)

        sc   = señal["score"]
        ac   = señal["accion"]
        em_a = "✅" if ac == "COMPRAR" else "❌" if ac == "VENDER" else "⚠️"

        vi = dcf["escenarios"]["base"]["valor_intrinseco"] if not dcf.get("error") else None
        mg = dcf["escenarios"]["base"].get("margen_seguridad_pct") if not dcf.get("error") else None

        return (
            f"🔍 *Análisis — {precio_d.get('nombre',ticker)}* ({ticker})\n\n"
            f"💰 Precio: {precio_d.get('moneda','USD')} {precio_d.get('precio',0):,.4f} "
            f"({precio_d.get('cambio_pct',0):+.2f}%)\n\n"
            f"Valoración: P/E {fund.get('pe_ttm','N/D')}x | EV/EBITDA {fund.get('ev_ebitda','N/D')}x\n"
            f"Calidad: Piotroski {piot.get('score','N/D')}/9\n"
            f"ROIC {rw.get('roic_pct','N/D')}% vs WACC {rw.get('wacc_pct','N/D')}%\n"
            + (f"DCF Base: ${vi:,.2f} | MoS: {mg:.1f}%\n" if vi else "DCF: No disponible\n") +
            f"Técnico: {tech.get('score',{}).get('score','N/D')}/10 — {tech.get('tendencia',{}).get('tendencia','N/D')}\n\n"
            f"{em_a} *SEÑAL: {ac}* — Score {sc:.1f}/10\n"
            f"{señal.get('señal','')} | Confianza: {señal.get('confianza','')}\n\n"
            f"⚠️ Solo educativo. No es asesoramiento financiero."
        )
    except Exception as e:
        return f"❌ Error al analizar {ticker}: {e}"


def procesar_macro() -> str:
    try:
        macro = condiciones_mercado()
        em_c = "⚠️ CURVA INVERTIDA" if macro.get("curva_invertida") else "✅ Curva normal"
        return (
            f"🌐 *Macro EE.UU. — {macro.get('fecha','')}*\n\n"
            f"Régimen: {macro.get('regimen_macro','N/D')}\n\n"
            f"Desempleo: {macro.get('desempleo_pct','N/D')}%\n"
            f"Inflación YoY: {macro.get('inflacion_yoy_pct','N/D')}%\n"
            f"Fed Funds: {macro.get('fed_funds_pct','N/D')}%\n"
            f"T10Y: {macro.get('t10y_pct','N/D')}%\n"
            f"Spread 10Y-2Y: {macro.get('spread_10y_2y','N/D')} bps\n\n"
            f"{em_c}"
        )
    except Exception as e:
        return f"❌ Error macro: {e}"


AYUDA = (
    "📚 *InvestSkill WhatsApp Bot*\n\n"
    "Escribe los siguientes comandos:\n\n"
    "precio AAPL       — Precio en tiempo real\n"
    "analizar AAPL     — Análisis completo + señal\n"
    "fundamental AAPL  — P/E, ROE, balance...\n"
    "dcf AAPL          — Modelo DCF en 3 escenarios\n"
    "tecnico AAPL      — RSI, MACD, tendencia\n"
    "macro             — Indicadores Fed, inflación...\n\n"
    "Ejemplos:\n"
    "  analizar BTC-USD\n"
    "  precio FEMSA.MX\n"
    "  analizar VALE3.SA\n\n"
    "⚠️ Solo educativo. No es asesoramiento financiero."
)


# ── Webhook Flask ─────────────────────────────────────────────────────────────

@app.route("/whatsapp", methods=["POST"])
def webhook_whatsapp():
    texto_entrada = request.form.get("Body", "").strip().lower()
    partes = texto_entrada.split()
    cmd    = partes[0] if partes else ""
    args   = partes[1:] if len(partes) > 1 else []

    if cmd in ("ayuda", "help", "hola", "start"):
        respuesta = AYUDA
    elif cmd == "macro":
        respuesta = procesar_macro()
    elif cmd == "precio" and args:
        respuesta = procesar_precio(args[0].upper())
    elif cmd == "fundamental" and args:
        respuesta = procesar_fundamental(args[0].upper())
    elif cmd == "dcf" and args:
        respuesta = procesar_dcf(args[0].upper())
    elif cmd == "tecnico" and args:
        respuesta = procesar_tecnico(args[0].upper())
    elif cmd == "analizar" and args:
        respuesta = procesar_analizar(args[0].upper())
    elif len(partes) == 1 and 1 <= len(partes[0]) <= 10 and partes[0].upper().replace("-","").replace(".","").isalnum():
        respuesta = procesar_precio(partes[0].upper())
    else:
        respuesta = "No entendí. Escribe *ayuda* para ver los comandos disponibles."

    return responder(respuesta)


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok", "bot": "InvestSkill WhatsApp", "timestamp": __import__("datetime").datetime.now().isoformat()}


# ── Envío proactivo (opcional) ────────────────────────────────────────────────

def enviar_alerta(destinatario: str, mensaje: str):
    """
    Envía un mensaje proactivo via Twilio WhatsApp.
    destinatario: 'whatsapp:+573001234567'
    """
    if not tiene_credenciales_twilio():
        logger.warning("Credenciales Twilio no configuradas")
        return
    try:
        client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            body=mensaje,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=destinatario,
        )
        logger.info(f"Alerta enviada: {msg.sid}")
    except Exception as e:
        logger.error(f"Error enviando alerta: {e}")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if not tiene_credenciales_twilio():
        print("⚠️  TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN no configurados en .env")
        print("   El webhook igual funcionará para pruebas locales con ngrok.")
    print(f"🟢 InvestSkill WhatsApp Webhook corriendo en puerto {WEBHOOK_PORT}")
    print(f"   Endpoint: http://localhost:{WEBHOOK_PORT}/whatsapp")
    print(f"   Para exponer a internet: ngrok http {WEBHOOK_PORT}")
    app.run(host="0.0.0.0", port=WEBHOOK_PORT, debug=False)
