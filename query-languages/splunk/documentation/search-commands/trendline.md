# trendline

## Description

Computes the moving averages of fields: simple moving average (sma), exponential moving average (ema), and weighted moving average (wma) The output is written to a new field, which you can specify.

SMA and WMA both compute a sum over the `period` of most recent values. WMA puts more weight on recent values rather than past values. EMA is calculated using the following formula.

EMA(t) = alpha \* EMA(t-1) + (1 - alpha) \* field(t)

where `alpha = 2/(period + 1)` and `field(t)` is the current value of a field.

## Syntax

trendline ( <trendtype><period>"("<field>")" [AS <newfield>] )...

### Required arguments

trendtype

Syntax: sma | ema | wma

Description: The type of trend to compute. Current supported trend types include simple moving average (sma), exponential moving average (ema), and weighted moving average (wma).

period

Syntax: <num>

Description: The period over which to compute the trend, an integer between 2 and 10000.

<field>

Syntax: "("<field>")"

Description: The name of the field on which to calculate the trend.

### Optional arguments

<newfield>

Syntax: <field>

Description: Specify a new field name to write the output to.

Default:
`<trendtype><period>(<field>)`

## Usage

## Examples

Example 1: Computes a five event simple moving average for field 'foo' and writes the result to new field called 'smoothed\_foo.' Also, in the same line, computes ten event exponential moving average for field 'bar'. Because no AS clause is specified, writes the result to the field 'ema10(bar)'.

... | trendline sma5(foo) AS smoothed\_foo ema10(bar)

Example 2: Overlay a trendline over a chart of events by month.

index="bar" | stats count BY date\_month | trendline sma2(count) AS trend | fields \* trend

## See also

[accum](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/accum#id_4a21595d_149b_464e_9ba0_b35d9336654c__accum), [autoregress](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/autoregress#id_6c11d555_ad43_4b23_b0a4_0bd64d538fa3__autoregress), [delta](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/delta#aea489ea_dd56_4a9e_a42e_a6f865ed8c88__delta), [streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats)
