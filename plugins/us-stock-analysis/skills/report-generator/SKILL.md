---
description: Generate professional HTML/PDF investment reports with interactive visualizations
---

# Report Generator

Generate exportable HTML/PDF reports with interactive charts and visualizations from investment analysis data.

## Report Templates

1. **Executive Summary Report**
   - High-level overview (1-2 pages)
   - Key metrics and investment thesis
   - Critical charts only
   - Ideal for stakeholder presentations

2. **Comprehensive Analysis Report**
   - Full detailed analysis (5-10 pages)
   - All data sections and visualizations
   - Methodology and assumptions
   - Complete investment case

3. **Portfolio Review Report**
   - Multi-stock comparison
   - Portfolio allocation charts
   - Risk metrics and diversification analysis
   - Performance attribution

## Visualization Components

### Financial Charts
- **Line Charts**: Revenue/earnings trends, price history
- **Bar Charts**: Quarterly comparisons, segment breakdowns
- **Stacked Area**: Balance sheet composition, revenue mix
- **Waterfall Charts**: Cash flow analysis, earnings bridges
- **Pie Charts**: Geographic/product segment revenue split

### Valuation Charts
- **Comparison Charts**: P/E, P/B, EV/EBITDA vs. peers and historical averages
- **DCF Sensitivity Tables**: Value ranges under different scenarios
- **Multiple Expansion/Contraction**: Historical valuation bands

### Technical Charts
- **Price Charts**: Candlesticks with moving averages overlay
- **Volume Bars**: Trading volume patterns
- **Indicator Panels**: RSI, MACD, Bollinger Bands
- **Support/Resistance**: Key price levels annotated

## HTML Report Structure

Generate standalone HTML file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investment Analysis Report - [TICKER] - [DATE]</title>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        :root {
            --navy:          #0F172A;
            --navy-mid:      #1E293B;
            --sky:           #0284C7;
            --sky-light:     #E0F2FE;
            --teal:          #0D9488;
            --teal-light:    #CCFBF1;
            --emerald:       #059669;
            --emerald-light: #D1FAE5;
            --red:           #DC2626;
            --red-light:     #FEE2E2;
            --amber:         #D97706;
            --amber-light:   #FEF3C7;
            --slate:         #64748B;
            --slate-light:   #F1F5F9;
            --border:        #E2E8F0;
            --text-primary:  #0F172A;
            --text-secondary:#475569;
            --text-muted:    #94A3B8;
            --grad-hero:     linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #0284C7 100%);
            --grad-accent:   linear-gradient(90deg, #0284C7, #0D9488);
            --shadow-sm:     0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
            --shadow-md:     0 4px 16px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: #F8FAFC;
        }

        /* ── HERO ── */
        .report-hero {
            background: var(--grad-hero);
            padding: 56px 48px 48px;
            position: relative;
            overflow: hidden;
        }
        .report-hero::before {
            content: '';
            position: absolute; top: -80px; right: -80px;
            width: 420px; height: 420px; border-radius: 50%;
            background: rgba(2,132,199,.12);
        }
        .report-hero::after {
            content: '';
            position: absolute; bottom: -60px; left: -40px;
            width: 300px; height: 300px; border-radius: 50%;
            background: rgba(13,148,136,.10);
        }
        .hero-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
        .hero-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(2,132,199,.18);
            border: 1px solid rgba(2,132,199,.35);
            color: #7DD3FC;
            font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase;
            padding: 4px 14px; border-radius: 20px; margin-bottom: 22px;
        }
        .hero-ticker {
            font-size: 72px; font-weight: 800; color: #fff;
            letter-spacing: -2px; line-height: 1;
            font-family: 'JetBrains Mono', monospace;
        }
        .hero-company { font-size: 19px; font-weight: 400; color: rgba(255,255,255,.65); margin-top: 8px; }
        .hero-rule {
            width: 48px; height: 3px;
            background: var(--grad-accent); border-radius: 2px;
            margin: 24px 0;
        }
        .hero-meta { display: flex; flex-wrap: wrap; gap: 28px; }
        .hero-meta-item { display: flex; flex-direction: column; gap: 3px; }
        .hero-meta-label {
            font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
            text-transform: uppercase; color: rgba(255,255,255,.38);
        }
        .hero-meta-value { font-size: 13px; font-weight: 500; color: rgba(255,255,255,.82); }

        /* ── BODY ── */
        .report-body { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }

        /* ── TABLE OF CONTENTS ── */
        .toc {
            background: #fff; border: 1px solid var(--border);
            border-radius: 12px; padding: 28px 32px;
            margin-bottom: 32px; box-shadow: var(--shadow-sm);
        }
        .toc-label {
            font-size: 10px; font-weight: 700; letter-spacing: 1.6px;
            text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px;
        }
        .toc-grid {
            list-style: none;
            display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px 24px;
        }
        .toc-grid a {
            font-size: 13px; font-weight: 500; color: var(--sky);
            text-decoration: none; display: flex; align-items: center; gap: 6px;
        }
        .toc-grid a::before { content: '›'; font-size: 14px; color: var(--text-muted); }
        .toc-grid a:hover { color: var(--teal); }

        /* ── SECTION CARD ── */
        .section {
            background: #fff; border: 1px solid var(--border);
            border-radius: 12px; padding: 32px;
            margin-bottom: 20px; box-shadow: var(--shadow-sm);
            page-break-inside: avoid;
        }
        .section-head {
            display: flex; align-items: center; gap: 12px;
            margin-bottom: 24px; padding-bottom: 18px;
            border-bottom: 1px solid var(--border);
        }
        .section-icon {
            width: 36px; height: 36px; border-radius: 8px;
            background: var(--sky-light);
            display: flex; align-items: center; justify-content: center;
            font-size: 17px; flex-shrink: 0;
        }
        .section-title { font-size: 18px; font-weight: 700; color: var(--navy); letter-spacing: -.3px; }
        .section-sub   { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .section-num {
            margin-left: auto;
            font-size: 11px; font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-muted);
            background: var(--slate-light);
            padding: 2px 9px; border-radius: 4px;
        }

        /* ── METRIC CARDS ── */
        .metrics-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
            gap: 16px; margin: 24px 0;
        }
        .metric-card {
            background: var(--slate-light); border: 1px solid var(--border);
            border-radius: 10px; padding: 20px;
            transition: box-shadow .2s;
        }
        .metric-card:hover { box-shadow: var(--shadow-md); }
        .metric-card.positive { border-top: 3px solid var(--emerald); }
        .metric-card.negative { border-top: 3px solid var(--red); }
        .metric-card.neutral  { border-top: 3px solid var(--sky); }
        .metric-card.warning  { border-top: 3px solid var(--amber); }
        .metric-label {
            font-size: 10px; font-weight: 600; letter-spacing: .8px;
            text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;
        }
        .metric-value {
            font-size: 26px; font-weight: 800; color: var(--navy);
            letter-spacing: -.5px;
            font-family: 'JetBrains Mono', monospace;
        }
        .metric-delta {
            font-size: 11px; font-weight: 600; margin-top: 6px;
            display: flex; align-items: center; gap: 3px;
        }
        .metric-delta.up   { color: var(--emerald); }
        .metric-delta.down { color: var(--red); }
        .metric-delta.flat { color: var(--text-muted); }
        .metric-ctx { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

        /* ── CHART CONTAINER ── */
        .chart-wrap {
            background: #fff; border: 1px solid var(--border);
            border-radius: 10px; padding: 24px; margin: 20px 0;
            box-shadow: var(--shadow-sm);
        }
        .chart-label {
            font-size: 11px; font-weight: 600; letter-spacing: .6px;
            text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px;
        }
        .chart-canvas { position: relative; height: 320px; }

        /* ── TABLES ── */
        .table-scroll { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border); margin: 16px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead th {
            background: var(--navy); color: rgba(255,255,255,.80);
            padding: 11px 14px; text-align: left;
            font-size: 10px; font-weight: 600; letter-spacing: .7px; text-transform: uppercase;
            white-space: nowrap;
        }
        tbody tr:nth-child(even) { background: var(--slate-light); }
        tbody tr:hover           { background: var(--sky-light); }
        tbody td { padding: 10px 14px; border-bottom: 1px solid var(--border); }
        tbody tr:last-child td   { border-bottom: none; }
        .td-pos  { color: var(--emerald); font-weight: 600; }
        .td-neg  { color: var(--red);     font-weight: 600; }
        .td-mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

        /* ── CALLOUT / HIGHLIGHT ── */
        .callout {
            border-left: 4px solid var(--sky); background: var(--sky-light);
            border-radius: 0 8px 8px 0; padding: 14px 18px;
            margin: 14px 0; font-size: 14px; color: var(--text-secondary);
        }
        .callout.warn    { border-color: var(--amber); background: var(--amber-light); }
        .callout.danger  { border-color: var(--red);   background: var(--red-light);   }
        .callout.success { border-color: var(--emerald); background: var(--emerald-light); }

        /* ── TAGS ── */
        .tag { display: inline-block; padding: 2px 9px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .tag-buy  { background: var(--emerald-light); color: var(--emerald); }
        .tag-sell { background: var(--red-light);     color: var(--red);     }
        .tag-hold { background: var(--amber-light);   color: var(--amber);   }
        .tag-info { background: var(--sky-light);     color: var(--sky);     }

        /* ── INVESTMENT SIGNAL BOX ── */
        .signal-box {
            background: var(--navy); border-radius: 12px;
            padding: 32px 36px; margin: 32px 0;
            position: relative; overflow: hidden;
        }
        .signal-box::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: var(--grad-accent);
        }
        .signal-box.bullish .signal-watermark { color: rgba( 52,211,153,.07); }
        .signal-box.bearish .signal-watermark { color: rgba(248,113,113,.07); }
        .signal-box.neutral .signal-watermark { color: rgba(148,163,184,.07); }
        .signal-watermark {
            position: absolute; right: 28px; top: 50%;
            transform: translateY(-50%);
            font-size: 108px; font-weight: 800; letter-spacing: -4px;
            font-family: 'JetBrains Mono', monospace;
            pointer-events: none; user-select: none;
        }
        .signal-eyebrow {
            font-size: 9px; font-weight: 700; letter-spacing: 2px;
            text-transform: uppercase; color: rgba(255,255,255,.35);
            margin-bottom: 10px;
        }
        .signal-verdict {
            font-size: 44px; font-weight: 800; letter-spacing: -1.5px;
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 24px;
        }
        .signal-verdict.bullish { color: #34D399; }
        .signal-verdict.bearish { color: #F87171; }
        .signal-verdict.neutral { color: #94A3B8; }
        .signal-stats {
            display: flex; flex-wrap: wrap; gap: 20px 36px;
        }
        .signal-stat { display: flex; flex-direction: column; gap: 4px; }
        .signal-stat-label {
            font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
            text-transform: uppercase; color: rgba(255,255,255,.35);
        }
        .signal-stat-val { font-size: 14px; font-weight: 700; color: rgba(255,255,255,.88); }
        .score-track {
            background: rgba(255,255,255,.12);
            border-radius: 3px; height: 5px; margin-top: 7px; overflow: hidden;
        }
        .score-fill {
            height: 100%; border-radius: 3px;
            background: var(--grad-accent);
        }

        /* ── FOOTER ── */
        .report-footer {
            border-top: 1px solid var(--border);
            padding-top: 24px; margin-top: 48px;
            display: flex; gap: 20px; align-items: flex-start;
        }
        .footer-disc {
            font-size: 11px; color: var(--text-muted); line-height: 1.75; flex: 1;
        }
        .footer-brand {
            font-size: 11px; font-weight: 600; color: var(--text-muted);
            white-space: nowrap; text-align: right; line-height: 1.6;
        }

        /* ── PRINT ── */
        @media print {
            body { background: #fff; }
            .report-hero { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .section { box-shadow: none; }
            .chart-canvas { height: 260px; }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
            .report-hero { padding: 36px 24px 32px; }
            .hero-ticker { font-size: 48px; }
            .report-body { padding: 24px 16px 48px; }
            .section { padding: 20px; }
            .metrics-grid { grid-template-columns: repeat(2, 1fr); }
            .signal-watermark { display: none; }
        }
    </style>
</head>
<body>

    <!-- HERO HEADER -->
    <div class="report-hero">
        <div class="hero-inner">
            <div class="hero-badge">&#9679;&nbsp; Investment Analysis Report</div>
            <div class="hero-ticker">[TICKER]</div>
            <div class="hero-company">[Company Full Name] &nbsp;·&nbsp; [Exchange]</div>
            <div class="hero-rule"></div>
            <div class="hero-meta">
                <div class="hero-meta-item">
                    <span class="hero-meta-label">Report Date</span>
                    <span class="hero-meta-value">[DATE]</span>
                </div>
                <div class="hero-meta-item">
                    <span class="hero-meta-label">Report Type</span>
                    <span class="hero-meta-value">[TYPE]</span>
                </div>
                <div class="hero-meta-item">
                    <span class="hero-meta-label">Analyst</span>
                    <span class="hero-meta-value">Claude Investment Analysis</span>
                </div>
                <div class="hero-meta-item">
                    <span class="hero-meta-label">Price at Report</span>
                    <span class="hero-meta-value">$[PRICE]</span>
                </div>
            </div>
        </div>
    </div>

    <div class="report-body">

        <!-- Table of Contents -->
        <div class="toc">
            <div class="toc-label">Contents</div>
            <ul class="toc-grid">
                <li><a href="#summary">Executive Summary</a></li>
                <li><a href="#financials">Financial Performance</a></li>
                <li><a href="#valuation">Valuation Analysis</a></li>
                <li><a href="#technical">Technical Analysis</a></li>
                <li><a href="#risks">Risk Factors</a></li>
                <li><a href="#signal">Investment Signal</a></li>
            </ul>
        </div>

        <!-- 01 Executive Summary -->
        <div class="section" id="summary">
            <div class="section-head">
                <div class="section-icon">📋</div>
                <div>
                    <div class="section-title">Executive Summary</div>
                    <div class="section-sub">Key investment thesis and highlights</div>
                </div>
                <span class="section-num">01</span>
            </div>

            [Summary content]

            <div class="metrics-grid">
                <div class="metric-card positive">
                    <div class="metric-label">Revenue (TTM)</div>
                    <div class="metric-value">$[X]B</div>
                    <div class="metric-delta up">▲ [X]% YoY</div>
                </div>
                <div class="metric-card positive">
                    <div class="metric-label">Net Income</div>
                    <div class="metric-value">$[X]B</div>
                    <div class="metric-delta up">▲ [X]% YoY</div>
                </div>
                <div class="metric-card neutral">
                    <div class="metric-label">P/E Ratio</div>
                    <div class="metric-value">[X]x</div>
                    <div class="metric-ctx">vs sector [X]x</div>
                </div>
                <div class="metric-card neutral">
                    <div class="metric-label">Market Cap</div>
                    <div class="metric-value">$[X]T</div>
                    <div class="metric-ctx">[Exchange]</div>
                </div>
            </div>
        </div>

        <!-- 02 Financial Performance -->
        <div class="section" id="financials">
            <div class="section-head">
                <div class="section-icon">📊</div>
                <div>
                    <div class="section-title">Financial Performance</div>
                    <div class="section-sub">Revenue, earnings, and margin trends</div>
                </div>
                <span class="section-num">02</span>
            </div>

            <div class="chart-wrap">
                <div class="chart-label">Revenue &amp; Net Income — Annual ($B)</div>
                <div class="chart-canvas">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>

            [Analysis content]
        </div>

        <!-- 03 Valuation -->
        <div class="section" id="valuation">
            <div class="section-head">
                <div class="section-icon">💰</div>
                <div>
                    <div class="section-title">Valuation Analysis</div>
                    <div class="section-sub">DCF, multiples, and comparable companies</div>
                </div>
                <span class="section-num">03</span>
            </div>
            [Valuation content]
        </div>

        <!-- 04 Technical Analysis -->
        <div class="section" id="technical">
            <div class="section-head">
                <div class="section-icon">📈</div>
                <div>
                    <div class="section-title">Technical Analysis</div>
                    <div class="section-sub">Price action, indicators, and key levels</div>
                </div>
                <span class="section-num">04</span>
            </div>
            [Technical content]
        </div>

        <!-- 05 Risk Factors -->
        <div class="section" id="risks">
            <div class="section-head">
                <div class="section-icon">⚠️</div>
                <div>
                    <div class="section-title">Risk Factors</div>
                    <div class="section-sub">Key risks and mitigating considerations</div>
                </div>
                <span class="section-num">05</span>
            </div>
            [Risk content]
        </div>

        <!-- Investment Signal -->
        <div class="signal-box bullish" id="signal">
            <div class="signal-watermark">BULLISH</div>
            <div class="signal-eyebrow">Investment Signal</div>
            <div class="signal-verdict bullish">BULLISH</div>
            <div class="signal-stats">
                <div class="signal-stat">
                    <span class="signal-stat-label">Confidence</span>
                    <span class="signal-stat-val">HIGH</span>
                </div>
                <div class="signal-stat">
                    <span class="signal-stat-label">Time Horizon</span>
                    <span class="signal-stat-val">LONG-TERM</span>
                </div>
                <div class="signal-stat">
                    <span class="signal-stat-label">Action</span>
                    <span class="signal-stat-val">BUY</span>
                </div>
                <div class="signal-stat">
                    <span class="signal-stat-label">Conviction</span>
                    <span class="signal-stat-val">STRONG</span>
                </div>
                <div class="signal-stat">
                    <span class="signal-stat-label">Score</span>
                    <span class="signal-stat-val">8.4 / 10</span>
                    <div class="score-track">
                        <div class="score-fill" style="width: 84%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="report-footer">
            <div class="footer-disc">
                <strong>Disclaimer:</strong> This report is generated by an AI assistant for informational purposes only
                and does not constitute financial advice, a solicitation, or an offer to buy or sell any security.
                Past performance is not indicative of future results. All investments carry risk.
                Consult a licensed financial advisor before making investment decisions.
            </div>
            <div class="footer-brand">
                InvestSkill<br>Claude Investment Analysis
            </div>
        </div>

    </div><!-- /.report-body -->

    <script>
        // Revenue & Earnings combo chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Revenue ($B)',
                        data: [100, 120, 145, 175, 210],
                        backgroundColor: 'rgba(2,132,199,.75)',
                        borderRadius: 4,
                        order: 2
                    },
                    {
                        label: 'Net Income ($B)',
                        data: [22, 28, 35, 44, 56],
                        type: 'line',
                        borderColor: '#0D9488',
                        backgroundColor: 'rgba(13,148,136,.10)',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: '#0D9488',
                        tension: 0.35,
                        fill: true,
                        order: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { family: 'Inter', size: 11 }, usePointStyle: true, boxWidth: 8 }
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        titleColor: '#94A3B8',
                        bodyColor: '#FFFFFF',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 6
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter', size: 11 }, color: '#94A3B8' }
                    },
                    y: {
                        grid: { color: '#F1F5F9' },
                        ticks: { font: { family: 'Inter', size: 11 }, color: '#94A3B8' },
                        title: { display: true, text: 'Revenue ($B)', color: '#94A3B8', font: { size: 10 } }
                    },
                    y1: {
                        position: 'right',
                        grid: { display: false },
                        ticks: { font: { family: 'Inter', size: 11 }, color: '#0D9488' },
                        title: { display: true, text: 'Net Income ($B)', color: '#0D9488', font: { size: 10 } }
                    }
                }
            }
        });
    </script>
</body>
</html>
```

## Chart Data Format

When receiving analysis data, structure chart data as follows:

```javascript
// Line chart data structure
{
    chartType: 'line',
    title: 'Revenue Growth Trend',
    xAxis: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
        {
            label: 'Revenue ($B)',
            data: [100, 120, 145, 175, 210],
            color: '#0284C7'   // sky — primary series
        }
    ]
}

// Bar chart with multiple series
{
    chartType: 'bar',
    title: 'Quarterly Earnings Comparison',
    xAxis: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
        {
            label: '2023',
            data: [1.2, 1.5, 1.8, 2.1],
            color: '#0284C7'   // sky — primary
        },
        {
            label: '2024',
            data: [1.5, 1.8, 2.2, 2.5],
            color: '#0D9488'   // teal — secondary
        }
    ]
}
```

## PDF Export Instructions

To export the generated HTML report to PDF:

### Method 1: Browser Print-to-PDF
1. Open the HTML file in a web browser
2. Press Ctrl+P (Cmd+P on Mac) or File → Print
3. Select "Save as PDF" or "Microsoft Print to PDF"
4. Adjust settings: margins, orientation, scale
5. Save the PDF file

### Method 2: wkhtmltopdf (Command Line)
```bash
# Install wkhtmltopdf
# macOS: brew install wkhtmltopdf
# Linux: apt-get install wkhtmltopdf

# Convert HTML to PDF
wkhtmltopdf \
  --page-size A4 \
  --margin-top 15mm \
  --margin-bottom 15mm \
  --enable-local-file-access \
  report.html report.pdf
```

### Method 3: Playwright/Puppeteer (Node.js)
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///path/to/report.html');
  await page.pdf({
    path: 'report.pdf',
    format: 'A4',
    printBackground: true
  });
  await browser.close();
})();
```

## Integration with Other Skills

### Input Formats Accepted

1. **Structured JSON Data**
   ```json
   {
     "ticker": "AAPL",
     "companyName": "Apple Inc.",
     "analysisType": "fundamental",
     "metrics": {...},
     "charts": [...]
   }
   ```

2. **Markdown Analysis Output**
   - Parse markdown from fundamental-analysis, technical-analysis, or portfolio-review
   - Extract tables, metrics, and key findings
   - Generate appropriate visualizations

3. **Custom Data Tables**
   - CSV-formatted financial data
   - Excel/spreadsheet data ranges
   - Database query results

### Workflow Examples

**Example 1: Fundamental Analysis Report**
```
User: /fundamental-analysis AAPL
[Claude generates analysis]

User: /report-generator --type comprehensive --format html
[Claude generates HTML report with embedded fundamental analysis and charts]
```

**Example 2: Portfolio Review with Custom Data**
```
User: /report-generator --type portfolio --data [paste portfolio data]
[Claude generates multi-stock comparison report with allocation charts]
```

## Output

Generate a complete, standalone HTML file containing:

1. **File Metadata**
   - Filename format: `investment-report-[TICKER]-[YYYYMMDD]-[HHMMSS].html`
   - File size indication
   - Estimated PDF size after export

2. **Report Contents**
   - Professional header with company name, ticker, date
   - Table of contents (for comprehensive reports)
   - All analysis sections with appropriate formatting
   - Interactive charts with Chart.js
   - Data tables with styling
   - Key metrics highlighted in cards
   - Footer with disclaimer and generation info

3. **Technical Details**
   - Inline CSS (no external dependencies except CDN for Chart.js)
   - Responsive design (mobile and desktop)
   - Print-optimized styling for PDF export
   - Cross-browser compatible (Chrome, Firefox, Safari, Edge)

4. **Export Instructions**
   - Step-by-step guide for converting to PDF
   - Command-line examples for automated workflows
   - Browser settings recommendations

## Usage Notes

- The HTML file is fully self-contained except for Chart.js CDN (can be inlined if needed)
- Charts are interactive in HTML (hover for data points, zoom, pan)
- PDF export flattens charts to static images
- For large portfolios (>20 stocks), consider pagination or summary views
- Color scheme follows professional financial report standards (blue for primary, green for positive, red for negative)
- All monetary values should be formatted with proper thousands separators and currency symbols

## Integration with Signal Format

When generating reports from other skills, the report MUST prominently display each skill's Investment Signal block in a styled box. Use the following HTML (matches the CSS in the template above):

```html
<!-- Bullish signal example — swap class to "bearish" or "neutral" as needed -->
<div class="signal-box bullish">
  <div class="signal-watermark">BULLISH</div>
  <div class="signal-eyebrow">Investment Signal</div>
  <div class="signal-verdict bullish">BULLISH</div>
  <div class="signal-stats">
    <div class="signal-stat">
      <span class="signal-stat-label">Confidence</span>
      <span class="signal-stat-val">HIGH</span>
    </div>
    <div class="signal-stat">
      <span class="signal-stat-label">Time Horizon</span>
      <span class="signal-stat-val">LONG-TERM</span>
    </div>
    <div class="signal-stat">
      <span class="signal-stat-label">Action</span>
      <span class="signal-stat-val">BUY</span>
    </div>
    <div class="signal-stat">
      <span class="signal-stat-label">Conviction</span>
      <span class="signal-stat-val">STRONG</span>
    </div>
    <div class="signal-stat">
      <span class="signal-stat-label">Score</span>
      <span class="signal-stat-val">X.X / 10</span>
      <div class="score-track">
        <div class="score-fill" style="width: XX%"></div>
      </div>
    </div>
  </div>
</div>
```

Design notes:
- `.signal-box` class: deep navy background with teal/sky gradient top border
- Add `bullish`, `bearish`, or `neutral` modifier class to both `.signal-box` and `.signal-verdict` to apply the correct verdict color and watermark tint
- Score progress bar uses the `score-fill` width as a percentage (e.g. `style="width: 84%"` for 8.4/10)
- Large ghost watermark text (`.signal-watermark`) reinforces the verdict at a glance

For multi-skill bundle reports (like /research-bundle), show a composite signal summary at the top of the report with individual skill scores in a row of `.signal-stat` items inside a single `.signal-box`.
