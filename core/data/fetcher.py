"""
InvestSkill — Motor universal de datos en tiempo real
Fuente principal: yfinance (Yahoo Finance) — gratuito, sin API key
Soporta: acciones USA, mercados LatAm, criptomonedas, índices
"""
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Optional
import warnings
warnings.filterwarnings("ignore")


# ── Helpers de símbolo ───────────────────────────────────────────────────────

def normalizar_ticker(ticker: str, mercado: str = "us") -> str:
    """Normaliza un ticker según el mercado seleccionado."""
    t = ticker.strip().upper()
    sufijos = {
        "mx": ".MX", "br": ".SA", "ar": ".BA",
        "co": ".CL", "cl": ".SN",
    }
    if mercado in sufijos and not t.endswith(sufijos[mercado]):
        return t + sufijos[mercado]
    if mercado == "crypto" and not t.endswith("-USD"):
        return t + "-USD"
    return t


def detectar_tipo_activo(ticker: str) -> str:
    """Detecta si el ticker es acción, crypto, ETF, índice o forex."""
    t = ticker.upper()
    if t.startswith("^"):
        return "indice"
    if t.endswith("-USD") or t in ("BTC-USD","ETH-USD","SOL-USD","ADA-USD","BNB-USD"):
        return "crypto"
    if t.endswith("=F"):
        return "futuro"
    if t.endswith("=X"):
        return "forex"
    return "accion"


# ── Clase principal ──────────────────────────────────────────────────────────

class FetcherMercado:
    """
    Motor central de datos de mercado.
    Todos los métodos retornan diccionarios listos para consumir por la UI y el motor de análisis.
    """

    def __init__(self, ticker: str, mercado: str = "us"):
        self.ticker_raw   = ticker.strip().upper()
        self.mercado      = mercado
        self.ticker       = normalizar_ticker(self.ticker_raw, mercado)
        self.tipo         = detectar_tipo_activo(self.ticker)
        self._yf          = yf.Ticker(self.ticker)
        self._info        = None
        self._precio_hist = None

    # ── Propiedades base ─────────────────────────────────────────────────────

    @property
    def info(self) -> dict:
        if self._info is None:
            try:
                self._info = self._yf.info or {}
            except Exception:
                self._info = {}
        return self._info

    def precio_historico(self, periodo: str = "1y", intervalo: str = "1d") -> pd.DataFrame:
        """Devuelve OHLCV histórico. Caché por sesión."""
        clave = f"{periodo}_{intervalo}"
        if self._precio_hist is None or clave not in getattr(self, "_cache_periodos", {}):
            if not hasattr(self, "_cache_periodos"):
                self._cache_periodos = {}
            try:
                df = self._yf.history(period=periodo, interval=intervalo, auto_adjust=True)
                df.index = pd.to_datetime(df.index)
                if df.index.tz is not None:
                    df.index = df.index.tz_localize(None)
                self._cache_periodos[clave] = df
            except Exception:
                self._cache_periodos[clave] = pd.DataFrame()
        return self._cache_periodos[clave]

    # ── Precio actual ────────────────────────────────────────────────────────

    def precio_actual(self) -> dict:
        """Precio en tiempo real (retrasado ~15 min en Yahoo Finance gratuito)."""
        info = self.info
        hist = self.precio_historico("5d", "1d")

        precio   = info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose", 0)
        apertura = info.get("open") or info.get("regularMarketOpen", precio)
        maximo   = info.get("dayHigh") or info.get("regularMarketDayHigh", precio)
        minimo   = info.get("dayLow") or info.get("regularMarketDayLow", precio)
        volumen  = info.get("volume") or info.get("regularMarketVolume", 0)
        cierre_anterior = info.get("previousClose") or info.get("regularMarketPreviousClose", precio)

        # Calcular variación diaria
        cambio    = precio - cierre_anterior if cierre_anterior else 0
        cambio_pct = (cambio / cierre_anterior * 100) if cierre_anterior else 0

        # 52 semanas
        max_52s = info.get("fiftyTwoWeekHigh", 0)
        min_52s = info.get("fiftyTwoWeekLow", 0)

        # Precio actual como % del rango 52 semanas
        rango_52s_pct = None
        if max_52s and min_52s and max_52s != min_52s:
            rango_52s_pct = round((precio - min_52s) / (max_52s - min_52s) * 100, 1)

        # Medias móviles rápidas
        sma50 = sma200 = None
        if not hist.empty and len(hist) >= 5:
            if len(hist) >= 50:
                sma50 = round(hist["Close"].rolling(50).mean().iloc[-1], 2)
            if len(hist) >= 200:
                sma200 = round(hist["Close"].rolling(200).mean().iloc[-1], 2)

        return {
            "ticker":          self.ticker,
            "nombre":          info.get("longName") or info.get("shortName", self.ticker),
            "precio":          round(float(precio), 4) if precio else None,
            "cambio":          round(float(cambio), 4),
            "cambio_pct":      round(float(cambio_pct), 2),
            "apertura":        round(float(apertura), 4) if apertura else None,
            "maximo_dia":      round(float(maximo), 4) if maximo else None,
            "minimo_dia":      round(float(minimo), 4) if minimo else None,
            "volumen":         int(volumen) if volumen else None,
            "vol_promedio":    info.get("averageVolume"),
            "max_52s":         round(float(max_52s), 4) if max_52s else None,
            "min_52s":         round(float(min_52s), 4) if min_52s else None,
            "rango_52s_pct":   rango_52s_pct,
            "cap_mercado":     info.get("marketCap"),
            "moneda":          info.get("currency", "USD"),
            "intercambio":     info.get("exchange", ""),
            "sector":          info.get("sector", ""),
            "industria":       info.get("industry", ""),
            "pais":            info.get("country", ""),
            "empleados":       info.get("fullTimeEmployees"),
            "sma50":           sma50,
            "sma200":          sma200,
            "tipo":            self.tipo,
            "timestamp":       datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

    # ── Datos fundamentales ──────────────────────────────────────────────────

    def fundamentales(self) -> dict:
        """Métricas de valoración y rentabilidad desde yfinance."""
        info = self.info

        def s(key, default=None):
            v = info.get(key)
            if v is None or (isinstance(v, float) and np.isnan(v)):
                return default
            return v

        # Múltiplos de valoración
        pe_ttm     = s("trailingPE")
        pe_fwd     = s("forwardPE")
        peg        = s("pegRatio")
        pb         = s("priceToBook")
        ps_ttm     = s("priceToSalesTrailing12Months")
        ev_ebitda  = s("enterpriseToEbitda")
        ev_revenue = s("enterpriseToRevenue")

        # Rentabilidad
        roe        = s("returnOnEquity")
        roa        = s("returnOnAssets")
        margen_bruto    = s("grossMargins")
        margen_op       = s("operatingMargins")
        margen_neto     = s("profitMargins")
        margen_ebitda   = s("ebitdaMargins")

        # Crecimiento
        crec_rev_trim   = s("revenueGrowth")
        crec_ganancias  = s("earningsGrowth")
        crec_rev_5y     = s("revenueQuarterlyGrowth")

        # Balance
        deuda_equity    = s("debtToEquity")
        ratio_corriente = s("currentRatio")
        ratio_rapido    = s("quickRatio")
        caja            = s("totalCash")
        caja_por_accion = s("totalCashPerShare")
        deuda_total     = s("totalDebt")

        # Flujos de caja
        fcf              = s("freeCashflow")
        ocf              = s("operatingCashflow")
        capex = (ocf - fcf) if (ocf and fcf and ocf > 0) else None

        # Dividendo
        div_yield        = s("dividendYield")
        div_rate         = s("dividendRate")
        payout_ratio     = s("payoutRatio")
        ex_div_date      = s("exDividendDate")

        # Acciones
        acciones_circulacion  = s("sharesOutstanding")
        beta                  = s("beta")

        # Precio vs. valor contable
        precio       = s("currentPrice") or s("regularMarketPrice", 0)
        bvps         = s("bookValue")

        # EV y deuda neta
        ev           = s("enterpriseValue")
        caja_v       = s("totalCash", 0)
        deuda_neta   = (deuda_total - caja_v) if (deuda_total and caja_v is not None) else None

        # FCF yield
        cap_mercado  = s("marketCap")
        fcf_yield    = (fcf / cap_mercado * 100) if (fcf and cap_mercado and cap_mercado > 0) else None

        return {
            # Valoración
            "pe_ttm":          round(pe_ttm, 2) if pe_ttm else None,
            "pe_forward":      round(pe_fwd, 2) if pe_fwd else None,
            "peg":             round(peg, 2) if peg else None,
            "precio_valor_libro": round(pb, 2) if pb else None,
            "precio_ventas":   round(ps_ttm, 2) if ps_ttm else None,
            "ev_ebitda":       round(ev_ebitda, 2) if ev_ebitda else None,
            "ev_revenue":      round(ev_revenue, 2) if ev_revenue else None,
            "ev":              ev,
            # Rentabilidad
            "roe":             round(roe * 100, 2) if roe else None,
            "roa":             round(roa * 100, 2) if roa else None,
            "margen_bruto":    round(margen_bruto * 100, 2) if margen_bruto else None,
            "margen_operativo":round(margen_op * 100, 2) if margen_op else None,
            "margen_neto":     round(margen_neto * 100, 2) if margen_neto else None,
            "margen_ebitda":   round(margen_ebitda * 100, 2) if margen_ebitda else None,
            # Crecimiento
            "crec_ingresos_anual": round(crec_rev_trim * 100, 2) if crec_rev_trim else None,
            "crec_ganancias":  round(crec_ganancias * 100, 2) if crec_ganancias else None,
            # Balance
            "deuda_equity":    round(deuda_equity, 2) if deuda_equity else None,
            "ratio_corriente": round(ratio_corriente, 2) if ratio_corriente else None,
            "ratio_rapido":    round(ratio_rapido, 2) if ratio_rapido else None,
            "caja_total":      caja,
            "caja_por_accion": caja_por_accion,
            "deuda_total":     deuda_total,
            "deuda_neta":      deuda_neta,
            # Flujos
            "fcf":             fcf,
            "ocf":             ocf,
            "capex":           capex,
            "fcf_yield":       round(fcf_yield, 2) if fcf_yield else None,
            # Dividendo
            "div_yield":       round(div_yield * 100, 2) if div_yield else None,
            "div_rate":        div_rate,
            "payout_ratio":    round(payout_ratio * 100, 2) if payout_ratio else None,
            # Otros
            "beta":            round(beta, 3) if beta else None,
            "acciones":        acciones_circulacion,
            "cap_mercado":     cap_mercado,
            "bvps":            bvps,
            "precio":          precio,
        }

    # ── Estados financieros ──────────────────────────────────────────────────

    def estados_financieros(self) -> dict:
        """
        Retorna los últimos 4 años de estados financieros reales:
        cuenta de resultados, balance y flujo de caja.
        """
        resultado = {"ingresos": {}, "balance": {}, "flujo_caja": {}, "error": None}

        try:
            # Cuenta de resultados anual
            income = self._yf.financials
            if income is not None and not income.empty:
                income = income.iloc[:, :4]  # últimas 4 columnas (años)
                años = [str(c.year) for c in income.columns]

                def fila(key):
                    """Extrae una fila del dataframe de forma segura."""
                    for k in income.index:
                        if key.lower() in str(k).lower():
                            row = income.loc[k]
                            return {años[i]: _fmt_millon(row.iloc[i]) for i in range(len(años))}
                    return {a: None for a in años}

                resultado["ingresos"] = {
                    "años":              años,
                    "ingresos_totales":  fila("Total Revenue"),
                    "beneficio_bruto":   fila("Gross Profit"),
                    "ebitda":            fila("EBITDA"),
                    "ebit":              fila("EBIT"),
                    "beneficio_neto":    fila("Net Income"),
                    "eps_basico":        fila("Basic EPS"),
                    "eps_diluido":       fila("Diluted EPS"),
                    "gastos_ida":        fila("Selling General Administrative"),
                    "i_d":               fila("Research And Development"),
                }

        except Exception as e:
            resultado["error"] = str(e)

        try:
            # Balance general anual
            balance = self._yf.balance_sheet
            if balance is not None and not balance.empty:
                balance = balance.iloc[:, :4]
                años_b = [str(c.year) for c in balance.columns]

                def fila_b(key):
                    for k in balance.index:
                        if key.lower() in str(k).lower():
                            row = balance.loc[k]
                            return {años_b[i]: _fmt_millon(row.iloc[i]) for i in range(len(años_b))}
                    return {a: None for a in años_b}

                resultado["balance"] = {
                    "años":                  años_b,
                    "activos_totales":       fila_b("Total Assets"),
                    "activos_corrientes":    fila_b("Current Assets"),
                    "caja":                  fila_b("Cash And Cash Equivalents"),
                    "inventario":            fila_b("Inventory"),
                    "pasivos_totales":       fila_b("Total Liabilities"),
                    "pasivos_corrientes":    fila_b("Current Liabilities"),
                    "deuda_largo_plazo":     fila_b("Long Term Debt"),
                    "patrimonio":            fila_b("Stockholders Equity"),
                    "acciones_emitidas":     fila_b("Ordinary Shares Number"),
                }

        except Exception:
            pass

        try:
            # Flujo de caja anual
            cashflow = self._yf.cashflow
            if cashflow is not None and not cashflow.empty:
                cashflow = cashflow.iloc[:, :4]
                años_c = [str(c.year) for c in cashflow.columns]

                def fila_c(key):
                    for k in cashflow.index:
                        if key.lower() in str(k).lower():
                            row = cashflow.loc[k]
                            return {años_c[i]: _fmt_millon(row.iloc[i]) for i in range(len(años_c))}
                    return {a: None for a in años_c}

                resultado["flujo_caja"] = {
                    "años":                  años_c,
                    "flujo_operativo":       fila_c("Operating Cash Flow"),
                    "capex":                 fila_c("Capital Expenditure"),
                    "flujo_libre":           fila_c("Free Cash Flow"),
                    "dividendos_pagados":    fila_c("Payment Of Dividends"),
                    "recompra_acciones":     fila_c("Repurchase Of Capital Stock"),
                    "deuda_emitida":         fila_c("Issuance Of Debt"),
                    "deuda_repagada":        fila_c("Repayment Of Debt"),
                }

        except Exception:
            pass

        return resultado

    # ── Datos para Piotroski F-Score ─────────────────────────────────────────

    def datos_piotroski(self) -> dict:
        """
        Extrae las métricas necesarias para calcular el Piotroski F-Score
        usando datos anuales reales de los últimos 2 años.
        """
        try:
            income   = self._yf.financials
            balance  = self._yf.balance_sheet
            cashflow = self._yf.cashflow

            if income is None or balance is None or cashflow is None:
                return {"error": "Estados financieros no disponibles"}
            if income.empty or balance.empty or cashflow.empty:
                return {"error": "Estados financieros vacíos"}

            def get_val(df, keyword, col=0):
                for k in df.index:
                    if keyword.lower() in str(k).lower():
                        v = df.iloc[df.index.tolist().index(k), col]
                        return float(v) if pd.notna(v) else None
                return None

            # Año actual (col=0) y año anterior (col=1)
            net_income_0 = get_val(income, "Net Income", 0)
            net_income_1 = get_val(income, "Net Income", 1)

            total_assets_0 = get_val(balance, "Total Assets", 0)
            total_assets_1 = get_val(balance, "Total Assets", 1)

            ocf_0 = get_val(cashflow, "Operating Cash Flow", 0)

            long_debt_0 = get_val(balance, "Long Term Debt", 0) or 0
            long_debt_1 = get_val(balance, "Long Term Debt", 1) or 0

            curr_assets_0 = get_val(balance, "Current Assets", 0)
            curr_liab_0   = get_val(balance, "Current Liabilities", 0)
            curr_assets_1 = get_val(balance, "Current Assets", 1)
            curr_liab_1   = get_val(balance, "Current Liabilities", 1)

            shares_0 = get_val(balance, "Ordinary Shares Number", 0) or 0
            shares_1 = get_val(balance, "Ordinary Shares Number", 1) or 0

            gross_profit_0 = get_val(income, "Gross Profit", 0)
            revenue_0      = get_val(income, "Total Revenue", 0)
            gross_profit_1 = get_val(income, "Gross Profit", 1)
            revenue_1      = get_val(income, "Total Revenue", 1)

            return {
                "net_income_0":    net_income_0,
                "net_income_1":    net_income_1,
                "total_assets_0":  total_assets_0,
                "total_assets_1":  total_assets_1,
                "ocf_0":           ocf_0,
                "long_debt_0":     long_debt_0,
                "long_debt_1":     long_debt_1,
                "curr_assets_0":   curr_assets_0,
                "curr_liab_0":     curr_liab_0,
                "curr_assets_1":   curr_assets_1,
                "curr_liab_1":     curr_liab_1,
                "shares_0":        shares_0,
                "shares_1":        shares_1,
                "gross_profit_0":  gross_profit_0,
                "revenue_0":       revenue_0,
                "gross_profit_1":  gross_profit_1,
                "revenue_1":       revenue_1,
                "error": None,
            }
        except Exception as e:
            return {"error": str(e)}

    # ── Noticias recientes ───────────────────────────────────────────────────

    def noticias(self, limite: int = 10) -> list[dict]:
        """Noticias más recientes del activo desde Yahoo Finance."""
        try:
            noticias_raw = self._yf.news or []
            resultado = []
            for n in noticias_raw[:limite]:
                content = n.get("content", {})
                titulo = content.get("title", n.get("title", "Sin título"))
                url    = content.get("canonicalUrl", {}).get("url", n.get("link", ""))
                pub    = content.get("pubDate", n.get("providerPublishTime", ""))
                fuente = content.get("provider", {}).get("displayName", "Yahoo Finance")
                resumen= content.get("summary", "")

                # Parsear fecha
                fecha_str = ""
                if pub:
                    try:
                        if isinstance(pub, (int, float)):
                            fecha_str = datetime.fromtimestamp(pub).strftime("%d/%m/%Y %H:%M")
                        else:
                            fecha_str = str(pub)[:16]
                    except Exception:
                        fecha_str = str(pub)[:16]

                resultado.append({
                    "titulo":  titulo,
                    "url":     url,
                    "fecha":   fecha_str,
                    "fuente":  fuente,
                    "resumen": resumen,
                })
            return resultado
        except Exception:
            return []

    # ── Analistas ────────────────────────────────────────────────────────────

    def consenso_analistas(self) -> dict:
        """Recomendaciones y precios objetivo de analistas."""
        info = self.info

        precio_obj_medio = info.get("targetMeanPrice")
        precio_obj_alto  = info.get("targetHighPrice")
        precio_obj_bajo  = info.get("targetLowPrice")
        precio_actual    = info.get("currentPrice") or info.get("regularMarketPrice", 0)

        upside = None
        if precio_obj_medio and precio_actual:
            upside = round((precio_obj_medio / precio_actual - 1) * 100, 1)

        recomendacion_media = info.get("recommendationMean")
        recomendacion_clave = info.get("recommendationKey", "")
        num_analistas       = info.get("numberOfAnalystOpinions", 0)

        # Mapeo de recomendación numérica a texto español
        mapa_rec = {
            "strong_buy":  "Compra fuerte",
            "buy":         "Comprar",
            "hold":        "Mantener",
            "underperform":"Bajo rendimiento",
            "sell":        "Vender",
        }
        rec_esp = mapa_rec.get(recomendacion_clave, recomendacion_clave)

        try:
            recs_df = self._yf.recommendations
            compras = mantener = ventas = 0
            if recs_df is not None and not recs_df.empty:
                ultimas = recs_df.tail(5)
                for _, fila in ultimas.iterrows():
                    g = str(fila.get("To Grade", "")).lower()
                    if "buy" in g or "outperform" in g or "overweight" in g:
                        compras += 1
                    elif "hold" in g or "neutral" in g or "equal" in g:
                        mantener += 1
                    elif "sell" in g or "underperform" in g or "underweight" in g:
                        ventas += 1
        except Exception:
            compras = mantener = ventas = 0

        return {
            "precio_objetivo_medio": precio_obj_medio,
            "precio_objetivo_alto":  precio_obj_alto,
            "precio_objetivo_bajo":  precio_obj_bajo,
            "upside_potencial_pct":  upside,
            "recomendacion":         rec_esp,
            "recomendacion_score":   recomendacion_media,
            "num_analistas":         num_analistas,
            "compras_recientes":     compras,
            "mantener_recientes":    mantener,
            "ventas_recientes":      ventas,
        }

    # ── Datos de opciones ────────────────────────────────────────────────────

    def opciones_resumen(self) -> dict:
        """Resumen del mercado de opciones: IV implícita, put/call ratio."""
        try:
            fechas = self._yf.options
            if not fechas:
                return {"disponible": False}

            # Usar la cadena más próxima
            chain = self._yf.option_chain(fechas[0])
            calls = chain.calls
            puts  = chain.puts

            total_vol_calls = calls["volume"].sum() if "volume" in calls else 0
            total_vol_puts  = puts["volume"].sum() if "volume" in puts else 0

            pcr = round(total_vol_puts / total_vol_calls, 3) if total_vol_calls > 0 else None

            iv_calls_media = calls["impliedVolatility"].mean() if "impliedVolatility" in calls else None
            iv_puts_media  = puts["impliedVolatility"].mean() if "impliedVolatility" in puts else None
            iv_media = round(((iv_calls_media or 0) + (iv_puts_media or 0)) / 2 * 100, 1)

            return {
                "disponible":       True,
                "fechas_exp":       list(fechas[:5]),
                "pcr":              pcr,
                "iv_media_pct":     iv_media,
                "vol_calls":        int(total_vol_calls),
                "vol_puts":         int(total_vol_puts),
            }
        except Exception:
            return {"disponible": False}

    # ── Comparables de sector ────────────────────────────────────────────────

    def pares_sector(self) -> list[dict]:
        """Lista de empresas comparables en el mismo sector (de yfinance info)."""
        similares = []
        try:
            comps = [
                self.info.get("symbol"),
                *([self.info.get("industryKey")] if self.info.get("industryKey") else [])
            ]
            # yfinance no expone directamente peers; devolvemos info básica del ticker
            precio   = self.info.get("currentPrice") or self.info.get("regularMarketPrice")
            pe       = self.info.get("trailingPE")
            cap      = self.info.get("marketCap")
            similares.append({
                "ticker":     self.ticker,
                "nombre":     self.info.get("longName", self.ticker),
                "precio":     precio,
                "pe":         round(pe, 1) if pe else None,
                "cap_mercado": cap,
            })
        except Exception:
            pass
        return similares

    # ── Resumen completo (para análisis de un clic) ──────────────────────────

    def resumen_completo(self) -> dict:
        """
        Agrega todos los datos en un solo diccionario.
        Usado por la UI y por el motor de IA para generar el informe.
        """
        precio    = self.precio_actual()
        fundament = self.fundamentales()
        estados   = self.estados_financieros()
        consenso  = self.consenso_analistas()
        noticias  = self.noticias(5)
        piotroski = self.datos_piotroski()

        return {
            "ticker":       self.ticker,
            "mercado":      self.mercado,
            "tipo":         self.tipo,
            "precio":       precio,
            "fundamentales": fundament,
            "estados":      estados,
            "consenso":     consenso,
            "noticias":     noticias,
            "piotroski_raw": piotroski,
            "descripcion":  self.info.get("longBusinessSummary", ""),
            "sitio_web":    self.info.get("website", ""),
            "timestamp":    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }


# ── Helpers de formato ───────────────────────────────────────────────────────

def _fmt_millon(valor) -> Optional[float]:
    """Convierte valores en unidades a millones, redondeado a 2 decimales."""
    if valor is None or (isinstance(valor, float) and np.isnan(valor)):
        return None
    return round(float(valor) / 1_000_000, 2)


def formatear_numero(n, decimales: int = 2, prefijo: str = "") -> str:
    """Formatea números grandes de forma legible en español."""
    if n is None:
        return "N/D"
    try:
        n = float(n)
        if abs(n) >= 1e12:
            return f"{prefijo}{n/1e12:.{decimales}f}B"   # billones
        if abs(n) >= 1e9:
            return f"{prefijo}{n/1e9:.{decimales}f}MM"   # miles de millones
        if abs(n) >= 1e6:
            return f"{prefijo}{n/1e6:.{decimales}f}M"    # millones
        if abs(n) >= 1e3:
            return f"{prefijo}{n/1e3:.{decimales}f}K"
        return f"{prefijo}{n:.{decimales}f}"
    except Exception:
        return str(n)


def color_cambio(valor: float) -> str:
    """Retorna color CSS según si el cambio es positivo, negativo o neutro."""
    if valor > 0:
        return "#00c851"   # verde
    if valor < 0:
        return "#ff4444"   # rojo
    return "#aaaaaa"       # gris
