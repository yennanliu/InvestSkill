---
description: Deep fundamental analysis of US stocks using financial statements
---

# Fundamental Analysis

Conduct deep-dive fundamental analysis of US stocks using financial statements and business metrics.

## Financial Statement Analysis

1. **Income Statement Analysis**
   - Revenue breakdown and growth drivers
   - Cost structure and margin trends
   - Operating leverage analysis
   - Earnings quality assessment
   - Non-recurring items identification

2. **Balance Sheet Analysis**
   - Asset quality and composition
   - Liability structure and debt maturity
   - Working capital management
   - Off-balance sheet items
   - Shareholder equity trends

3. **Cash Flow Statement Analysis**
   - Operating cash flow generation
   - Capital expenditure requirements
   - Free cash flow calculation
   - Cash conversion cycle
   - Financing and investing activities

## Business Quality Metrics

1. **Profitability Analysis**
   - Gross margin trends
   - Operating margin consistency
   - Net profit margins
   - ROE, ROA, ROIC trends

2. **Growth Analysis**
   - Historical growth rates (3, 5, 10 years)
   - Growth quality (organic vs. acquisitions)
   - Market share trends
   - Geographic and product segment analysis

3. **Efficiency Metrics**
   - Asset turnover ratios
   - Inventory management
   - Receivables collection
   - Fixed asset productivity

4. **Capital Allocation**
   - Dividend policy and sustainability
   - Share buyback programs
   - M&A strategy and execution
   - R&D and capex investments

## Competitive Analysis

- Porter's Five Forces assessment
- Competitive moat identification
- Industry structure and dynamics
- Market share trends
- Pricing power evaluation

## Visualization Support

When `--visual` flag is used, include chart data tables for key metrics:

### 1. Revenue & Earnings Growth Chart
**Chart Type**: Line chart with dual Y-axis
**Data Table**:
```
Year    Revenue ($M)    Revenue Growth %    Net Income ($M)    EPS ($)
2020    [value]         [%]                 [value]            [value]
2021    [value]         [%]                 [value]            [value]
2022    [value]         [%]                 [value]            [value]
2023    [value]         [%]                 [value]            [value]
2024    [value]         [%]                 [value]            [value]
```

### 2. Profit Margin Trends
**Chart Type**: Line chart with percentage Y-axis
**Data Table**:
```
Year    Gross Margin %    Operating Margin %    Net Margin %    Industry Avg %
2020    [%]              [%]                   [%]             [%]
2021    [%]              [%]                   [%]             [%]
2022    [%]              [%]                   [%]             [%]
2023    [%]              [%]                   [%]             [%]
2024    [%]              [%]                   [%]             [%]
```

### 3. Balance Sheet Composition
**Chart Type**: Stacked bar chart
**Data Table**:
```
Year    Current Assets ($M)    Fixed Assets ($M)    Intangibles ($M)    Total Assets ($M)
2020    [value]               [value]              [value]             [value]
2021    [value]               [value]              [value]             [value]
2022    [value]               [value]              [value]             [value]
2023    [value]               [value]              [value]             [value]
2024    [value]               [value]              [value]             [value]

Year    Current Liab ($M)    Long-term Debt ($M)    Equity ($M)    Total L+E ($M)
2020    [value]             [value]                [value]        [value]
2021    [value]             [value]                [value]        [value]
2022    [value]             [value]                [value]        [value]
2023    [value]             [value]                [value]        [value]
2024    [value]             [value]                [value]        [value]
```

### 4. Cash Flow Waterfall
**Chart Type**: Waterfall chart
**Data Table**:
```
Component                   Amount ($M)    Notes
Operating Cash Flow         [value]        Core business generation
Capital Expenditures        [value]        Investments in assets
Free Cash Flow             [value]        Available for distribution
Dividends                  [value]        Shareholder distribution
Share Buybacks             [value]        Share repurchases
M&A Activity               [value]        Acquisitions
Debt Repayment             [value]        Debt reduction
Net Cash Change            [value]        Bottom line impact
```

### 5. Valuation Multiples Comparison
**Chart Type**: Grouped bar chart
**Data Table**:
```
Metric              Company    Industry Avg    5-Year Avg    Assessment
P/E Ratio           [value]    [value]         [value]       [Over/Under/Fair]
P/B Ratio           [value]    [value]         [value]       [Over/Under/Fair]
P/S Ratio           [value]    [value]         [value]       [Over/Under/Fair]
EV/EBITDA          [value]    [value]         [value]       [Over/Under/Fair]
PEG Ratio          [value]    [value]         [value]       [Over/Under/Fair]
```

### ASCII Chart Example (Terminal Display)
When visual charts aren't available, provide ASCII charts for key metrics:

```
Revenue Growth (5-Year Trend)
$250B ┤                                          ╭──
$200B ┤                                   ╭──────╯
$150B ┤                            ╭──────╯
$100B ┤                     ╭──────╯
$50B  ┤              ╭──────╯
      └──────┬───────┬───────┬───────┬───────┬──
           2020    2021    2022    2023    2024
```

### Integration with Report Generator
When `--visual` flag is used, output is optimized for `/report-generator` skill:
- Data tables formatted for Chart.js ingestion
- Chart type recommendations included
- Color coding suggestions (green for positive, red for negative)
- Axis labels and units clearly specified

## Output

Provide detailed fundamental report with:
- Financial strength score
- Business quality rating
- Competitive position assessment
- Key investment risks
- Fair value estimate with methodology
- Investment recommendation with time horizon

### Enhanced Output (with --visual flag)
- All standard output sections above
- Chart data tables for 5 key visualization areas
- ASCII charts for terminal display
- Chart specifications for HTML report generation
- Color-coded metrics (green/red for positive/negative trends)
