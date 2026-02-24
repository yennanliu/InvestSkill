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

    <!-- Chart.js or Plotly.js from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        /* Professional financial report styling */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #ffffff;
        }

        /* Header styles */
        .report-header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        .report-title { font-size: 32px; font-weight: 700; color: #1e40af; }
        .report-meta { color: #6b7280; font-size: 14px; margin-top: 8px; }

        /* Section styles */
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title {
            font-size: 24px;
            font-weight: 600;
            color: #1e40af;
            border-left: 4px solid #2563eb;
            padding-left: 12px;
            margin-bottom: 20px;
        }

        /* Chart container */
        .chart-container {
            position: relative;
            height: 400px;
            margin: 20px 0;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }

        /* Table styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #d1d5db;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:hover { background: #f9fafb; }

        /* Metric cards */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric-card {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .metric-value { font-size: 24px; font-weight: 700; color: #1e40af; margin-top: 4px; }

        /* Print styles for PDF export */
        @media print {
            body { padding: 0; }
            .section { page-break-inside: avoid; }
            .chart-container { height: 300px; }
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .report-title { font-size: 24px; }
            .metrics-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1 class="report-title">[Company Name] ([TICKER]) Investment Analysis</h1>
        <div class="report-meta">
            Generated: [DATE] | Report Type: [TYPE] | Analyst: Claude Investment Analysis
        </div>
    </div>

    <!-- Content sections -->
    <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        [Summary content]
    </div>

    <div class="section">
        <h2 class="section-title">Financial Performance</h2>
        <div class="chart-container">
            <canvas id="revenueChart"></canvas>
        </div>
        [Analysis content]
    </div>

    <!-- More sections... -->

    <script>
        // Chart.js initialization
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Revenue ($B)',
                    data: [100, 120, 145, 175, 210],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Revenue Growth Trend' }
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
            color: '#2563eb'
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
            color: '#2563eb'
        },
        {
            label: '2024',
            data: [1.5, 1.8, 2.2, 2.5],
            color: '#16a34a'
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

When generating reports from other skills, the report MUST prominently display each skill's Investment Signal block in a styled box. Use the following HTML/CSS when generating HTML reports:

```html
<div class="signal-box">
  <div class="signal-header">INVESTMENT SIGNAL</div>
  <div class="signal-row"><span class="signal-label">Signal:</span> <span class="signal-bullish">BULLISH</span> / <span class="signal-neutral">NEUTRAL</span> / <span class="signal-bearish">BEARISH</span></div>
  <div class="signal-row"><span class="signal-label">Confidence:</span> HIGH / MEDIUM / LOW</div>
  <div class="signal-row"><span class="signal-label">Horizon:</span> SHORT / MEDIUM / LONG-TERM</div>
  <div class="signal-row"><span class="signal-label">Score:</span> X.X / 10</div>
  <div class="signal-divider"></div>
  <div class="signal-row"><span class="signal-label">Action:</span> BUY / HOLD / SELL</div>
  <div class="signal-row"><span class="signal-label">Conviction:</span> STRONG / MODERATE / WEAK</div>
</div>
```

CSS styling:
- Signal box: dark border, subtle background (light blue for bullish, light red for bearish, light gray for neutral)
- Score displayed as a progress bar (0-10)
- Signal word (BULLISH/BEARISH/NEUTRAL) displayed in large bold colored text

For multi-skill bundle reports (like /research-bundle), show a composite signal summary at the top of the report with individual skill scores in a grid.
