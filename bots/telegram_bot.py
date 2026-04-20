"""
InvestSkill — Bot de Telegram
Comandos disponibles:
  /start            — Bienvenida
  /analizar TICKER  — Análisis completo de un activo
  /precio TICKER    — Precio en tiempo real
  /fundamental TICKER — Métricas fundamentales
  /dcf TICKER       — Valoración DCF rápida
  /tecnico TICKER   — Score técnico
  /macro            — Resumen macroeconómico
  /portafolio       — Ver portafolio guardado
  /ayuda            — Lista de comandos
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from datetime import datetime

from telegram import Update
from telegram.ext import (
    Application, CommandHandler, MessageHandler,
    filters, ContextTypes,
)
from telegram.constants import ParseMode

from core.data.fetcher import FetcherMercado, formatear_numero
from core.data.macro import condiciones_mercado
from core.analysis.fundamental import calcular_piotroski, calcular_roic_wacc
from core.analysis.valuation import calcular_dcf, valoracion_multiples
from core.analysis.technical import analizar as analizar_tecnico, retornos_historicos
from core.ai.analyst import narrativa_evaluacion_accion, señal_inversion_final
from config import TELEGRAM_BOT_TOKEN, tiene_token_telegram

logging.basicConfig(
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


# ── Helpers de formato ────────────────────────────────────────────────────────

def emoji_cambio(v: float) -> str:
    return "🟢" if v > 0 else "🔴" if v < 0 else "⚪"

def fmt_pct(v) -> str:
    return f"{v:.2f}%" if v is not None else "N/D"

def fmt_num(v, prefijo="$") -> str:
    return formatear_numero(v, prefijo=prefijo) if v else "N/D"


def bloque_señal(señal: dict) -> str:
    s  = señal["score"]
    ac = señal["accion"]
    sn = señal["señal"]
    cn = señal["confianza"]
    em = "🟢" if ac == "COMPRAR" else "🔴" if ac == "VENDER" else "🟡"
    return (
        f"\n╔══════════════════════════╗\n"
        f"║   SEÑAL DE INVERSIÓN      ║\n"
        f"╠══════════════════════════╣\n"
        f"║ {em} Acción:  {ac:<16}║\n"
        f"║ 📊 Score:   {s:.1f}/10{' ':10}║\n"
        f"║ 🎯 Señal:   {sn[:16]:<16}║\n"
        f"║ 💪 Confianza: {cn:<13}║\n"
        f"╚══════════════════════════╝"
    )


# ── Handlers de comandos ──────────────────────────────────────────────────────

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 *¡Bienvenido a InvestSkill!*\n\n"
        "Soy tu asistente de análisis de inversiones en tiempo real.\n\n"
        "📊 *Comandos disponibles:*\n"
        "• `/precio AAPL` — Precio en tiempo real\n"
        "• `/analizar AAPL` — Análisis completo\n"
        "• `/fundamental AAPL` — Métricas fundamentales\n"
        "• `/dcf AAPL` — Valoración DCF\n"
        "• `/tecnico AAPL` — Score técnico\n"
        "• `/macro` — Economía EE.UU.\n"
        "• `/ayuda` — Ver todos los comandos\n\n"
        "_También puedes escribir directamente el ticker y te respondo._",
        parse_mode=ParseMode.MARKDOWN,
    )


async def cmd_ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📚 *Comandos de InvestSkill*\n\n"
        "`/precio TICKER` — Precio en tiempo real con cambio %\n"
        "`/fundamental TICKER` — Valoración, márgenes, balance\n"
        "`/dcf TICKER` — Modelo DCF en 3 escenarios\n"
        "`/tecnico TICKER` — RSI, MACD, tendencia, score\n"
        "`/analizar TICKER` — Análisis completo + señal IA\n"
        "`/macro` — PIB, inflación, tasas, curva de rendimientos\n"
        "`/portafolio` — Ver portafolio guardado\n\n"
        "💡 *Ejemplos:*\n"
        "• `/analizar AAPL` — Apple\n"
        "• `/analizar BTC-USD` — Bitcoin\n"
        "• `/analizar FEMSA.MX` — FEMSA (México)\n"
        "• `/analizar VALE3.SA` — Vale (Brasil)\n\n"
        "⚠️ _Uso educativo. No es asesoramiento financiero._",
        parse_mode=ParseMode.MARKDOWN,
    )


async def cmd_precio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: `/precio TICKER`\nEjemplo: `/precio AAPL`",
                                         parse_mode=ParseMode.MARKDOWN)
        return

    ticker = context.args[0].upper()
    msg = await update.message.reply_text(f"⏳ Obteniendo precio de *{ticker}*...", parse_mode=ParseMode.MARKDOWN)

    try:
        f = FetcherMercado(ticker)
        p = f.precio_actual()
        em = emoji_cambio(p.get("cambio_pct", 0))
        texto = (
            f"*{p.get('nombre', ticker)}* (`{ticker}`)\n\n"
            f"💰 *Precio:* {p.get('moneda','USD')} `{p.get('precio', 'N/D'):,.4f}`\n"
            f"{em} *Cambio:* `{p.get('cambio_pct', 0):+.2f}%` ({p.get('cambio', 0):+.4f})\n\n"
            f"📊 *Rango del día:*\n"
            f"  Min: `{p.get('minimo_dia', 'N/D')}` | Max: `{p.get('maximo_dia', 'N/D')}`\n\n"
            f"📈 *Rango 52 semanas:*\n"
            f"  Min: `{p.get('min_52s', 'N/D')}` | Max: `{p.get('max_52s', 'N/D')}`\n"
            f"  Posición: `{p.get('rango_52s_pct', 'N/D')}%` del rango\n\n"
            f"🏢 Sector: {p.get('sector', 'N/D')}\n"
            f"💹 Cap. Mercado: {fmt_num(p.get('cap_mercado'))}\n"
            f"🕐 _{p.get('timestamp', '')} (Yahoo Finance, ~15 min retraso)_"
        )
        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error al obtener precio de `{ticker}`: {e}", parse_mode=ParseMode.MARKDOWN)


async def cmd_fundamental(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: `/fundamental TICKER`", parse_mode=ParseMode.MARKDOWN)
        return

    ticker = context.args[0].upper()
    msg = await update.message.reply_text(f"⏳ Cargando fundamentales de *{ticker}*...", parse_mode=ParseMode.MARKDOWN)

    try:
        f = FetcherMercado(ticker)
        fund = f.fundamentales()
        piot_raw = f.datos_piotroski()
        piot = calcular_piotroski(piot_raw)
        rw   = calcular_roic_wacc(fund, piot_raw)

        texto = (
            f"📊 *Análisis Fundamental — {ticker}*\n\n"
            f"*📐 Valoración*\n"
            f"  P/E TTM: `{fund.get('pe_ttm','N/D')}x` | P/E Fwd: `{fund.get('pe_forward','N/D')}x`\n"
            f"  PEG: `{fund.get('peg','N/D')}x` | EV/EBITDA: `{fund.get('ev_ebitda','N/D')}x`\n"
            f"  P/Ventas: `{fund.get('precio_ventas','N/D')}x` | P/Libro: `{fund.get('precio_valor_libro','N/D')}x`\n"
            f"  FCF Yield: `{fmt_pct(fund.get('fcf_yield'))}`\n\n"
            f"*💰 Rentabilidad*\n"
            f"  Margen Bruto: `{fmt_pct(fund.get('margen_bruto'))}`\n"
            f"  Margen Operativo: `{fmt_pct(fund.get('margen_operativo'))}`\n"
            f"  Margen Neto: `{fmt_pct(fund.get('margen_neto'))}`\n"
            f"  ROE: `{fmt_pct(fund.get('roe'))}` | ROA: `{fmt_pct(fund.get('roa'))}`\n\n"
            f"*🏦 Balance*\n"
            f"  Caja: `{fmt_num(fund.get('caja_total'))}`\n"
            f"  Deuda Total: `{fmt_num(fund.get('deuda_total'))}`\n"
            f"  Deuda Neta: `{fmt_num(fund.get('deuda_neta'))}`\n"
            f"  D/E: `{fund.get('deuda_equity','N/D')}x` | Corriente: `{fund.get('ratio_corriente','N/D')}x`\n\n"
            f"*🎯 Piotroski F-Score:* `{piot.get('score','N/D')}/9`\n"
            f"  _{piot.get('interpretacion','')}_\n\n"
            f"*⚡ ROIC/WACC*\n"
            f"  ROIC: `{rw.get('roic_pct','N/D')}%` | WACC: `{rw.get('wacc_pct','N/D')}%`\n"
            f"  Spread: `{rw.get('spread_roic_wacc','N/D')}pp` | EVA: `{fmt_num(rw.get('eva_mm'))}M`\n"
            f"  _{rw.get('señal','')}_"
        )
        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error: {e}", parse_mode=ParseMode.MARKDOWN)


async def cmd_dcf(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: `/dcf TICKER`", parse_mode=ParseMode.MARKDOWN)
        return

    ticker = context.args[0].upper()
    msg = await update.message.reply_text(f"⏳ Calculando DCF de *{ticker}*...", parse_mode=ParseMode.MARKDOWN)

    try:
        f = FetcherMercado(ticker)
        fund = f.fundamentales()
        piot_raw = f.datos_piotroski()
        dcf = calcular_dcf(fund, piot_raw)

        if dcf.get("error"):
            await msg.edit_text(f"⚠️ DCF no disponible para `{ticker}`:\n_{dcf['error']}_",
                                  parse_mode=ParseMode.MARKDOWN)
            return

        esc = dcf["escenarios"]
        b = esc["base"]; al = esc["alcista"]; ba = esc["bajista"]
        señal_e = dcf["señal"]
        em_s = "🟢" if "INFRA" in señal_e else "🔴" if "SOBRE" in señal_e else "🟡"

        texto = (
            f"💰 *DCF — {ticker}*\n\n"
            f"*FCF base:* `${dcf.get('fcf_base_mm','N/D')}M`\n"
            f"*WACC:* `{dcf.get('wacc_base_pct','N/D')}%`\n"
            f"*Precio mercado:* `${dcf.get('precio_mercado',0):,.2f}`\n\n"
            f"📊 *Escenarios:*\n"
            f"  🐻 Bajista:  `${ba['valor_intrinseco']:,.2f}` (MoS: `{ba.get('margen_seguridad_pct','N/D')}%`)\n"
            f"  📊 Base:     `${b['valor_intrinseco']:,.2f}` (MoS: `{b.get('margen_seguridad_pct','N/D')}%`)\n"
            f"  🐂 Alcista:  `${al['valor_intrinseco']:,.2f}` (MoS: `{al.get('margen_seguridad_pct','N/D')}%`)\n\n"
            f"*Precio ponderado:* `${dcf.get('precio_ponderado',0):,.2f}`\n\n"
            f"{em_s} _{señal_e}_"
        )
        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error: {e}", parse_mode=ParseMode.MARKDOWN)


async def cmd_tecnico(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: `/tecnico TICKER`", parse_mode=ParseMode.MARKDOWN)
        return

    ticker = context.args[0].upper()
    msg = await update.message.reply_text(f"⏳ Analizando gráficos de *{ticker}*...", parse_mode=ParseMode.MARKDOWN)

    try:
        f = FetcherMercado(ticker)
        hist = f.precio_historico("1y")
        tech = analizar_tecnico(hist)
        rets = retornos_historicos(hist)

        if tech.get("error"):
            await msg.edit_text(f"⚠️ {tech['error']}", parse_mode=ParseMode.MARKDOWN)
            return

        sc    = tech.get("score",{})
        tend  = tech.get("tendencia",{})
        rsi   = tech.get("rsi",{})
        macd  = tech.get("macd",{})
        mm    = tech.get("medias_moviles",{})
        bb    = tech.get("bollinger",{})
        sr    = tech.get("soporte_resistencia",{})

        texto = (
            f"📈 *Análisis Técnico — {ticker}*\n\n"
            f"*Score técnico:* `{sc.get('score','N/D')}/10` — _{sc.get('señal','')}_\n"
            f"*Tendencia:* _{tend.get('tendencia','N/D')}_\n\n"
            f"*📐 Medias Móviles:*\n"
            f"  Precio: `${mm.get('precio','N/D'):,.4f}`\n"
            f"  SMA50: `{mm.get('sma50','N/D')}` | SMA200: `{mm.get('sma200','N/D')}`\n"
            f"  Golden Cross: `{'✅ Sí' if mm.get('golden_cross') else '❌ No'}`\n\n"
            f"*📊 Indicadores:*\n"
            f"  RSI(14): `{rsi.get('valor','N/D')}` — _{rsi.get('señal','')}_\n"
            f"  MACD: `{macd.get('macd','N/D')}` — _{macd.get('señal','')}_\n"
            f"  Bollinger: _{bb.get('señal','N/D')}_\n\n"
            f"*📉 Soporte/Resistencia:*\n"
            f"  Soporte: `${sr.get('soporte','N/D')}` ({sr.get('distancia_soporte_pct','N/D')}% abajo)\n"
            f"  Resistencia: `${sr.get('resistencia','N/D')}` (+{sr.get('distancia_resistencia_pct','N/D')}%)\n\n"
            f"*📅 Retornos:*\n"
            f"  1D: `{fmt_pct(rets.get('1d'))}` | 1M: `{fmt_pct(rets.get('1m'))}` | "
            f"1Y: `{fmt_pct(rets.get('1y'))}` | YTD: `{fmt_pct(rets.get('ytd'))}`\n"
            f"  Volatilidad anual: `{fmt_pct(rets.get('vol_anual_pct'))}`"
        )
        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error: {e}", parse_mode=ParseMode.MARKDOWN)


async def cmd_analizar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso: `/analizar TICKER`\nEjemplo: `/analizar AAPL`",
                                         parse_mode=ParseMode.MARKDOWN)
        return

    ticker = context.args[0].upper()
    msg = await update.message.reply_text(
        f"⏳ Analizando *{ticker}* — esto puede tomar unos segundos...",
        parse_mode=ParseMode.MARKDOWN,
    )

    try:
        f = FetcherMercado(ticker)
        datos    = f.resumen_completo()
        hist_1y  = f.precio_historico("1y")
        fund     = datos["fundamentales"]
        piot_raw = datos["piotroski_raw"]
        consenso = datos["consenso"]
        precio_d = datos["precio"]

        piot    = calcular_piotroski(piot_raw)
        rw      = calcular_roic_wacc(fund, piot_raw)
        dcf     = calcular_dcf(fund, piot_raw)
        tech    = analizar_tecnico(hist_1y)
        señal   = señal_inversion_final(piot, rw, dcf, tech, consenso)

        nombre = precio_d.get("nombre", ticker)
        precio = precio_d.get("precio", 0)
        cambio = precio_d.get("cambio_pct", 0)
        em_p   = emoji_cambio(cambio)

        vi_base = dcf["escenarios"]["base"]["valor_intrinseco"] if not dcf.get("error") else None
        mg_base = dcf["escenarios"]["base"].get("margen_seguridad_pct") if not dcf.get("error") else None

        texto = (
            f"📊 *Análisis Completo — {nombre}* (`{ticker}`)\n\n"
            f"💰 *Precio:* `{precio_d.get('moneda','USD')} {precio:,.4f}` {em_p} `{cambio:+.2f}%`\n"
            f"🏢 Cap. Mercado: `{fmt_num(fund.get('cap_mercado'))}`\n\n"
            f"*📐 Valoración:*\n"
            f"  P/E TTM: `{fund.get('pe_ttm','N/D')}x` | EV/EBITDA: `{fund.get('ev_ebitda','N/D')}x`\n"
            f"  FCF Yield: `{fmt_pct(fund.get('fcf_yield'))}`\n\n"
            f"*💡 Rentabilidad:*\n"
            f"  Margen Neto: `{fmt_pct(fund.get('margen_neto'))}` | ROE: `{fmt_pct(fund.get('roe'))}`\n\n"
            f"*🎯 Calidad:*\n"
            f"  Piotroski: `{piot.get('score','N/D')}/9` — _{piot.get('interpretacion','')}_\n"
            f"  ROIC: `{rw.get('roic_pct','N/D')}%` vs WACC: `{rw.get('wacc_pct','N/D')}%`\n\n"
            f"*💰 DCF Caso Base:*\n"
            f"  Valor intrínseco: `${vi_base:,.2f}`\n"
            f"  Margen de seguridad: `{mg_base:.1f}%`\n" if vi_base else "  _DCF no disponible_\n"
            f"\n*📈 Técnico:*\n"
            f"  Score: `{tech.get('score',{}).get('score','N/D')}/10` | "
            f"Tendencia: _{tech.get('tendencia',{}).get('tendencia','N/D')}_\n"
            f"  RSI: `{tech.get('rsi',{}).get('valor','N/D')}` — _{tech.get('rsi',{}).get('señal','')}_\n\n"
            f"*🗣️ Consenso:*\n"
            f"  {consenso.get('recomendacion','N/D')} | "
            f"Obj: `${consenso.get('precio_objetivo_medio','N/D')}` | "
            f"Upside: `{fmt_pct(consenso.get('upside_potencial_pct'))}`"
        )
        texto += bloque_señal(señal)

        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error al analizar `{ticker}`: {e}", parse_mode=ParseMode.MARKDOWN)


async def cmd_macro(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = await update.message.reply_text("⏳ Cargando indicadores macro desde FRED...",
                                           parse_mode=ParseMode.MARKDOWN)
    try:
        macro = condiciones_mercado()
        texto = (
            f"🌐 *Economía EE.UU. — {macro.get('fecha','')}*\n\n"
            f"*Régimen:* _{macro.get('regimen_macro','N/D')}_\n\n"
            f"*📊 Indicadores clave:*\n"
            f"  Desempleo: `{macro.get('desempleo_pct','N/D')}%`\n"
            f"  Inflación YoY: `{macro.get('inflacion_yoy_pct','N/D')}%`\n"
            f"  Fed Funds Rate: `{macro.get('fed_funds_pct','N/D')}%`\n"
            f"  T10Y: `{macro.get('t10y_pct','N/D')}%`\n"
            f"  Spread 10Y-2Y: `{macro.get('spread_10y_2y','N/D')} bps`\n\n"
            f"{'⚠️ *CURVA INVERTIDA* — señal histórica de recesión' if macro.get('curva_invertida') else '✅ Curva de rendimientos normal'}"
        )
        await msg.edit_text(texto, parse_mode=ParseMode.MARKDOWN)
    except Exception as e:
        await msg.edit_text(f"❌ Error: {e}", parse_mode=ParseMode.MARKDOWN)


async def manejar_mensaje(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Si el usuario escribe un ticker directamente, ejecutar análisis rápido."""
    texto = update.message.text.strip().upper()
    if 1 <= len(texto) <= 10 and texto.replace("-", "").replace(".", "").isalnum():
        context.args = [texto]
        await cmd_precio(update, context)
    else:
        await update.message.reply_text(
            "No entendí tu mensaje. Escribe `/ayuda` para ver los comandos disponibles.",
            parse_mode=ParseMode.MARKDOWN,
        )


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not tiene_token_telegram():
        print("ERROR: TELEGRAM_BOT_TOKEN no configurado en .env")
        print("Obtén tu token con @BotFather en Telegram y agrégalo al .env")
        return

    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start",       cmd_start))
    app.add_handler(CommandHandler("ayuda",       cmd_ayuda))
    app.add_handler(CommandHandler("help",        cmd_ayuda))
    app.add_handler(CommandHandler("precio",      cmd_precio))
    app.add_handler(CommandHandler("fundamental", cmd_fundamental))
    app.add_handler(CommandHandler("dcf",         cmd_dcf))
    app.add_handler(CommandHandler("tecnico",     cmd_tecnico))
    app.add_handler(CommandHandler("analizar",    cmd_analizar))
    app.add_handler(CommandHandler("macro",       cmd_macro))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, manejar_mensaje))

    print("🤖 InvestSkill Bot de Telegram iniciado. Presiona Ctrl+C para detener.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
