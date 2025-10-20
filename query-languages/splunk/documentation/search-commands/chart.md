# chart

## Description

The `chart` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand) that returns your results in a table format. The results can then be used to display the data as a chart, such as a column, line, area, or pie chart. See the [Visualization Reference](/en/?resourceId=Splunk_Viz_Visualizationreference) in the *Dashboards and Visualizations* manual.

You must specify a statistical function when you use the chart command. See [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

## Syntax

The required syntax is in bold.

chart

[<chart-options>]

[agg=<stats-agg-term>]

( <stats-agg-term> | <sparkline-agg-term> |  "("<eval-expression>")"  )...

[ BY <row-split> <column-split> ] | [ OVER <row-split> ] [BY <column-split>]

[<dedup\_splitvals>]

### Required arguments

You must include one of the following arguments when you use the `chart` command.

stats-agg-term

Syntax: <stats-func> ( <evaled-field> | <wc-field> ) [AS <wc-field>]

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wildcard characters in field names.

sparkline-agg-term

Syntax: <sparkline-agg> [AS <wc-field>]

Description: A sparkline aggregation function. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names. See [Sparkline options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Sparkline_options).

eval-expression

Syntax: <eval-math-exp> | <eval-concat-exp> | <eval-compare-exp> | <eval-bool-exp> | <eval-function-call>

Description: A combination of literals, fields, operators, and functions that represent the value of your destination field. For more information, see the [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions). See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#f2af5a1c_1311_4740_a2c5_f4a6bab63174__Usage).

Note: For these evaluations to work, your values need to be valid for the type of operation. For example, with the exception of addition, arithmetic operations might not produce valid results if the values are not numerical. If both operands are strings, they can be concatenated. When concatenating values with a period, the search treats both values as strings regardless of their actual type.

### Optional arguments

agg

Syntax: agg=<stats-agg-term>

Description: Specify an aggregator or function. For a list of stats functions with descriptions and examples, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

chart-options

Syntax: cont | format | limit | sep

Description: Options that you can specify to refine the result. See the [Chart options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Chart_options) section in this topic.

Default:

column-split

Syntax: <field> [<tc-options>]... [<where-clause>]

Description: Specifies a field to use as the columns in the result table. By default, when the result are visualized, the columns become the data series in the chart. If the field is numerical, discretization is applied using the `tc-options` argument. See the [tc options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__tc_options) and the [where clause](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__where_clause) sections in this topic.

Default: The number of columns included is limited to 10 by default. You can change the number of columns by including a <where-clause>.

Note: When a column-split field is included, the output is a table where each column represents a distinct value of the split-by field. This is in contrast with the `by-clause`, where each row represents a single unique combination of values of the group-by fields. For additional information, see the Usage section in this topic.

dedup\_splitvals

Syntax: dedup\_splitvals=<boolean>

Description: Specifies whether to remove duplicate values in multivalued `BY` clause fields.

Default: false

row-split

Syntax: <field> [<bin-options>]...

Description: The field that you specify becomes the first column in the results table. The field values become the row labels in the results table. In a chart, the field name is used to label the X-axis. The field values become the X-axis values. See the [Bin options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Bin_options) section in this topic.

Default: None.

### Chart options

cont

Syntax: cont=<bool>

Description: Specifies if the bins are continuous. If cont=false, replots the x-axis so that a noncontinuous sequence of x-value bins show up adjacently in the output. If cont=true, bins that have no values will display with a count of 0 or null values.

Default: true

format

Syntax: format=<string>

Description: Used to construct output field names when multiple data series are used in conjunction with a split-by-field. `format` takes precedence over `sep` and allows you to specify a parameterized expression with the stats aggregator and function ($AGG$) and the value of the split-by-field ($VAL$).

limit

Syntax: limit=(top | bottom) <int>

Description: Only valid when a column-split is specified. Use the `limit` option to specify the number of results that should appear in the output. When you set `limit=N` the top or bottom N values are retained, based on the sum of each series and the prefix you have selected. If `limit=0`, all results are returned. If you opt not to provide a prefix, the Splunk software provides the top results.

Default: top 10

sep

Syntax: sep=<string>

Description: Used to construct output field names when multiple data series are used in conjunctions with a split-by field. This is equivalent to setting `format` to `$AGG$<sep>$VAL$`.

### Stats function options

stats-func

Syntax: The syntax depends on the function you use. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#f2af5a1c_1311_4740_a2c5_f4a6bab63174__Usage).

Description: Statistical and charting functions that you can use with the `chart` command. Each time you invoke the `chart` command, you can use one or more functions. However, you can only use one `BY` clause.

### Sparkline options

Sparklines are inline charts that appear within table cells in search results and display time-based trends associated with the primary key of each row.

sparkline-agg

Syntax: sparkline (count(<wc-field>), <span-length>) | sparkline (<sparkline-func>(<wc-field>), <span-length>)

Description: A sparkline specifier, which takes the first argument of an aggregation function on a field and an optional timespan specifier. If no timespan specifier is used, an appropriate timespan is chosen based on the time range of the search. If the sparkline is not scoped to a field, only the count aggregate function is permitted. You can use wild card characters in field names.

span-length

See the [Span options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Span_options) section in this topic.

sparkline-func

Syntax: c() | count() | dc() | mean() | avg() | stdev() | stdevp() | var() | varp() | sum() | sumsq() | min() | max() | range()

Description: Aggregation function to use to generate sparkline values. Each sparkline value is produced by applying this aggregation to the events that fall into each particular time bin.

Note: The size of the sparkline is defined by settings in the `limits.conf` file. The `sparkline_maxsize` setting defines the maximum number of elements to emit for a sparkline.

For more information see [Add sparklines to your search results](/en/?resourceId=Splunk_Search_Addsparklinestosearchresults) in the *Search Manual*.

### Bin options

The bin options control the number and size of the bins that the search results are separated, or discretized, into.

Syntax: bins | span | <start-end> | aligntime

Description: Discretization options.

Default:
`bins=300`

bins

Syntax: bins=<int>

Description: Sets the maximum number of bins to discretize into. For example, if bin=300, the search finds the smallest bin size that results in no more than 300 distinct bins.

Default: 300

span

Syntax: span=<log-span> | span=<span-length>

Description: Sets the size of each bin, using a span length based on time or log-based span. See the [Span options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Span_options) section in this topic.

<start-end>

Syntax: end=<num> | start=<num>

Description: Sets the minimum and maximum extents for numerical bins. Data outside of the [start, end] range is discarded.

aligntime

Syntax: aligntime=(earliest | latest | <time-specifier>)

Description: Align the bin times to something other than base UNIX time (epoch 0). The `aligntime` option is valid only when doing a time-based discretization. Ignored if `span` is in days, months, or years.

### Span options

<log-span>

Syntax: [<num>]log[<num>]

Description: Sets to a logarithm-based span. The first number is a coefficient. The second number is the base. If the first number is supplied, it must be a real number >= 1.0 and < base. Base, if supplied, must be real number > 1.0 (strictly greater than 1).

span-length

Syntax: <span>[<timescale>]

Description: A span length based on time.

<span>

Syntax: <int>

Description: The span of each bin. If using a timescale, this is used as a time range. If not, this is an absolute bucket "length."

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <month> | <subseconds>

Description: Time scale units.

| Time scale | Syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <month> | mon | month | months | Time scale in months. |
| <subseconds> | us | ms | cs | ds | Time scale in microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |

### tc options

The timechart options are part of the <column-split> argument and control the behavior of splitting search results by a field. There are options that control the number and size of the bins that the search results are separated into. There are options that control what happens when events do not contain the split-by field, and for events that do not meet the criteria of the <where-clause>.

tc-options

Syntax: <bin-options> | usenull=<bool> | useother=<bool> | nullstr=<string> | otherstr=<string>

Description: Options for controlling the behavior of splitting by a field.

bin-options

See the [Bin options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_81ec59ca_0536_40e8_aff5_9a63c2212cd0__Bin_options) section in this topic.

nullstr

Syntax: nullstr=<string>

Description: Specifies the name of the field for data series for events that do not contain the split-by field. The `nullstri` option is only applicable when the `usenull` option is set to `true`.

Default: NULL

otherstr

String: otherstr=<string>

Description: Specifies the name of the field for data series that do not meet the criteria of the <where-clause>. The `otherstr` option is only applicable when the `useother` option is set to `true`.

Default: OTHER

usenull

Syntax: usenull=<bool>

Description: Controls whether or not a series is created for events that do not contain the split-by field.

Default: true

useother

Syntax: useother=<bool>

Description: Specifies if a series should be added for data series not included in the graph because the series did not meet the criteria of the <where-clause>.

Default: true

### where clause

The <where-clause> is part of the <column-split> argument.

where clause

Syntax: <single-agg> <where-comp>

Description: Specifies the criteria for including particular data series when a field is given in the `tc-by-clause`. The most common use of this option is to select for spikes rather than overall mass of distribution in series selection. The default value finds the top ten series by area under the curve. Alternately one could replace sum with max to find the series with the ten highest spikes. This has no relation to the where command.

single-agg

Syntax: count | <stats-func>(<field>)

Description: A single aggregation applied to a single field, including an evaluated field. No wildcards are allowed. The field must be specified, except when using the  `count` aggregate function, which applies to events as a whole.

<stats-func>

See the [Statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart) section in this topic.

<where-comp>

Syntax: <wherein-comp> | <wherethresh-comp>

Description: The criteria for the <where-clause>.

<wherein-comp>

Syntax: (in | notin) (top | bottom)<int>

Description: A grouping criteria for the <where-clause>. The aggregated series value be in or not in some top or bottom grouping.

<wherethresh-comp>

Syntax: ( < | > ) <num>

Description: A threshold for the <where-clause>. The aggregated series value must be greater than or less than the specified numeric threshold.

## Usage

The `chart` command is a transforming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Evaluation expressions

You can use the `chart` command with an eval expression. Unless you specify a `split-by` clause, the eval expression must be renamed.

### Supported functions

You can use a wide range of functions with the `stats` command. For general information about using functions, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

* For a list of statistical functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* For an alphabetical list of statistical functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

### Functions and memory usage

Some functions are inherently more expensive, from a memory standpoint, than other functions. For example, the `distinct_count` function requires far more memory than the `count` function. The `values` and `list` functions also can consume a lot of memory.

If you are using the `distinct_count` function without a split-by field or with a low-cardinality split-by by field, consider replacing the `distinct_count` function with the the `estdc` function (estimated distinct count). The `estdc` function might result in significantly lower memory usage and run times.

### Apply a statistical function to all available fields

Some statistical commands, such as `stats`, process functions that are not paired with one or more fields as if they are implicitly paired with a wildcard, so the command applies the function all available fields. For example, `| stats sum` is treated as if it is `| stats sum(*)`.

The `chart` command allows this behavior only with the `count` function. If you do not specify a field for `count`, `chart` applies it to all events returned by the search. If you want to apply other functions to all fields, you must make the wildcard explicit: `| chart sum(*)` .

### X-axis

You can specify which field is tracked on the x-axis of the chart. The x-axis variable is specified with a `by` field and is discretized if necessary. Charted fields are converted to numerical quantities if necessary.

Unlike the `timechart` command which generates a chart with the `_time` field as the x-axis, the `chart` command produces a table with an arbitrary field as the x-axis.

You can also specify the x-axis field after the `over` keyword, before any `by` and subsequent `split-by` clause. The `limit` and `agg` options allow easier specification of series filtering. The `limit` and `agg` options are ignored if an explicit where-clause is provided.

### Using row-split and column-split fields

When a column-split field is included, the output is a table where each column represents a distinct value of the column-split field.
This is in contrast with the `stats` command, where each row represents a single unique combination of values of the group-by fields. The number of columns included is limited to 10 by default. You can change the number of columns by including a where-clause.

With the `chart` and `timechart` commands, you cannot specify the same field in a function and as the row-split field.

For example, you cannot run this search. The field A is specified in the `sum` function and the `row-split` argument.

... | chart sum(A) by A span=log2

You must specify a different field as in the `row-split` argument.

Alternatively, you can work around this problem by using an `eval` expression. For example:

... | eval A1=A | chart sum(A) by A1 span=log2

### Subsecond bin time spans

Subsecond `span` timescales, which are time spans that are made up of deciseconds (ds), centiseconds (cs), milliseconds (ms), or microseconds (us), should be numbers that divide evenly into a second. For example, 1s = 1000ms. This means that valid millisecond `span` values are 1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, or 500ms. In addition, `span = 1000ms` is not allowed. Use `span = 1s` instead.

## Basic examples

### 1. Chart the max(delay) for each value in a field

Return the maximum delay for each value in the `site` field.

... | chart max(delay) OVER site

### 2. Chart the max(delay) for each value in a field, split by the value of another field

Return the maximum delay for each value in the `site` field split by the value in the `org` field.

... | chart max(delay) OVER site BY org

### 3. Chart the ratio of the average to the maximum "delay" for each distinct "host" and "user" pair

Return the ratio of the average (mean) of the `size` field to the maximum "delay" for each distinct `host` and `user` pair.

... | chart eval(avg(size)/max(delay)) AS ratio BY host user

### 4. Chart the maximum "delay" by "size" and separate "size" into bins

Return the maximum value in the `delay` field by the `size` field, where size is broken down into a maximum of 10 equal sized bins.

... | chart max(delay) BY size bins=10

### 5. Chart the average size for each distinct value in a filed

Return the average (mean) value in the `size` field for each distinct value in the `host` field.

... | chart avg(size) BY host

### 6. Chart the number of events, grouped by date and hour

Return the number of events, grouped by date and hour of the day, using span to group per 7 days and 24 hours per half days. The span applies to the field immediately prior to the command.

... | chart count BY date\_mday span=3 date\_hour span=12

### 7. Align the chart time bins to local time

Align the time bins to 5am (local time). Set the span to 12h. The bins will represent 5am - 5pm, then 5pm - 5am (the next day), and so on.

...| chart count BY \_time span=12h aligntime=@d+5h

### 8. In a multivalue BY field, remove duplicate values

For each unique value of `mvfield`, chart the average value of `field`. Deduplicates the values in the `mvfield`.

...| chart avg(field) BY mvfield dedup\_splitval=true

## Extended examples

### 1. Specify <row-split> and <column-split> values with the chart command

This example uses events that list the numeric sales for each product and quarter, for example:

| products | quarter | sales |
| --- | --- | --- |
| ProductA | QTR1 | 1200 |
| ProductB | QTR1 | 1400 |
| ProductC | QTR1 | 1650 |
| ProductA | QTR2 | 1425 |
| ProductB | QTR2 | 1175 |
| ProductC | QTR2 | 1550 |
| ProductA | QTR3 | 1300 |
| ProductB | QTR3 | 1250 |
| ProductC | QTR3 | 1375 |
| ProductA | QTR4 | 1550 |
| ProductB | QTR4 | 1700 |
| ProductC | QTR4 | 1625 |

To summarize the data by product for each quarter, run this search:

source="addtotalsData.csv" | chart sum(sales) BY products quarter

In this example, there are two fields specified in the BY clause with the `chart` command.

* The `products` field is referred to as the <row-split> field. In the chart, this field forms the X-axis.
* The `quarter` field is referred to as the <column-split> field. In the chart, this field forms the data series.

The results appear on the Statistics tab and look something like this:

| products | QTR1 | QTR2 | QTR3 | QTR4 |
| --- | --- | --- | --- | --- |
| ProductA | 1200 | 1425 | 1300 | 1550 |
| ProductB | 1400 | 1175 | 1250 | 1700 |
| ProductC | 1650 | 1550 | 1375 | 1625 |

Click on the Visualization tab to see the results as a chart.

See the `addtotals` command for an example that adds a total column for each product.

### 2. Chart the number of different page requests for each Web server

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Chart the number of different page requests, GET and POST, that occurred for each Web server.

sourcetype=access\_\* | chart count(eval(method="GET")) AS GET, count(eval(method="POST")) AS POST by host

This example uses `eval` expressions to specify the different field values for the `stats` command to count. The first clause uses the `count()` function to count the Web access events that contain the `method` field value `GET`. Then, using the AS keyword, the field that represents these results is renamed GET.

The second clause does the same for POST events. The counts of both types of events are then separated by the web server, using the BY clause with the `host` field.

The results appear on the Statistics tab and look like this:

| host | GET | POST |
| --- | --- | --- |
| www1 | 8431 | 5197 |
| www2 | 8097 | 4815 |
| www3 | 8338 | 4654 |

Click the Visualization tab. If necessary, format the results as a column chart. This chart displays the total count of events for each event type, GET or POST, based on the `host` value.

![This image shows a column chart. There are 2 series in the chart, GET and POST. The host values are on the X axis.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/c938bb0d-2103-415b-a8b3-0c78d3b8be5c?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJjOTM4YmIwZC0yMTAzLTQxNWItYThiMy0wYzc4ZDNiOGJlNWMiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6Ijc5ZTQ1ZmFlZjkwNDQ0NTU5MDdiOGVmMDExMzk1YTNiIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.blkhu2DbUhazlTae2IMGo4-FKlG0XUVsg1jRA_cwdY0)

### 3. Chart the number of transactions by duration

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Create a chart to show the number of transactions based on their duration (in seconds).

sourcetype=access\_\* status=200 action=purchase | transaction clientip maxspan=10m | chart count BY duration span=log2

This search uses the `transaction` command to define a transaction as events that share the `clientip` field and fit within a ten minute time span. The `transaction` command creates a new field called `duration`, which is the difference between the timestamps for the first and last events in the transaction. (Because `maxspan=10s`, the `duration` value should not be greater than this.)

The transactions are then piped into the `chart` command. The `count()` function is used to count the number of transactions and separate the count by the duration of each transaction. Because the duration is in seconds and you expect there to be many values, the search uses the `span` argument to bucket the duration into bins of log2 (`span=log2`).

The results appear on the Statistics tab and look something like this:

| duration | count |
| --- | --- |
| 0 | 970 |
| 1-2 | 593 |
| 2-4 | 208 |
| 4-8 | 173 |
| 8-16 | 26 |
| 64-128 | 3 |
| 128-256 | 3 |
| 256-512 | 12 |
| 512-1024 | 2 |

Click the Visualization tab. If necessary, format the results as a column chart.

![This image shows the duration along the X-axis and count of transactions along the Y-axis. The first column shows zero duration and 970 transactions.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/0e436786-0ccc-419b-96a0-30a7c8c1f64b?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwZTQzNjc4Ni0wY2NjLTQxOWItOTZhMC0zMGE3YzhjMWY2NGIiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6IjhiMWRkNDVjMmM3NzQyZGRhZjA0NjBlOWUxYWMwOTJmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.4cV-0Jw0US_wF4uNfmEZ999uTvYeo2NKWS0PN5SGrRI)

In this data set, most transactions take between 0 and 2 seconds to complete.

### 4. Chart the average number of events in a transaction, based on transaction duration

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Create a chart to show the average number of events in a transaction based on the duration of the transaction.

sourcetype=access\_\* status=200 action=purchase | transaction clientip maxspan=30m | chart avg(eventcount) by duration span=log2

The `transaction` command adds two fields to the results `duration` and `eventcount`. The `eventcount` field tracks the number of events in a single transaction.

In this search, the transactions are piped into the `chart` command. The `avg()` function is used to calculate the average number of events for each duration. Because the duration is in seconds and you expect there to be many values, the search uses the `span` argument to bucket the duration into bins using logarithm with a base of 2.

Use the field format option to enable number formatting.

![This images shows the results on the Statistics tab. There are 2 columns in the results: duration and average of event count.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/b8c50153-45b6-4cac-a2a4-21815552f2a2?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiOGM1MDE1My00NWI2LTRjYWMtYTJhNC0yMTgxNTU1MmYyYTIiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6IjUyYTBhMmU5NmUxZDQyODk5OTE2YWI3OTk0ZGM1OGUyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.4UN1vcQa96uQGZwKUK2OsXooWUD80LMtRO6XNU-m6iY)

Click the Visualization tab and change the display to a pie chart.

![This image shows the results on the Visualization tab. The chart type has been changed to a pie chart.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/832a5786-1077-4baf-a538-eedbdeef3736?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4MzJhNTc4Ni0xMDc3LTRiYWYtYTUzOC1lZWRiZGVlZjM3MzYiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6ImI0NzkyMDVkMzQ0YTQ1YTNhYzFmZTJmOWY0ZTE4NGI5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.9-aJPBcz4pKieUKV_oSDNewcPcDT4cRj_zUHN2YD3uA)

Each wedge of the pie chart represents a duration for the event transactions. You can hover over a wedge to see the average values.

### 5. Chart customer purchases

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Chart how many different people bought something and what they bought at the Buttercup Games online store Yesterday.

sourcetype=access\_\* status=200 action=purchase | chart dc(clientip) OVER date\_hour BY categoryId usenull=f

This search takes the purchase events and pipes it into the `chart` command. The `dc()` or `distinct_count()` function is used to count the number of unique visitors (characterized by the `clientip` field). This number is then charted over each hour of the day and broken out based on the `category_id` of the purchase. Also, because these are numeric values, the search uses the `usenull=f` argument to exclude fields that don't have a value.

The results appear on the Statistics tab and look something like this:

| date\_hour | ACCESSORIES | ARCADE | SHOOTER | SIMULATION | SPORTS | STRATEGY | TEE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2 | 6 | 0 | 4 | 0 | 4 | 4 |
| 1 | 4 | 7 | 2 | 3 | 0 | 10 | 5 |
| 2 | 2 | 2 | 2 | 1 | 1 | 2 | 0 |
| 3 | 3 | 5 | 3 | 5 | 0 | 7 | 1 |
| 4 | 3 | 4 | 0 | 0 | 1 | 4 | 0 |
| 5 | 3 | 0 | 3 | 0 | 1 | 6 | 1 |

Click the Visualization tab. If necessary, format the results as a line chart:

![This image shows a line chart. The X-axis displays the date_hour values.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/01709bad-d801-4fdb-bbbe-a7672f7d2ac3?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwMTcwOWJhZC1kODAxLTRmZGItYmJiZS1hNzY3MmY3ZDJhYzMiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6ImEwMzQ1ZmE4OTNkYjRlOGE4ODdlZTU2MjI0NmRmMWE1IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.NY0yeWdkt1keiyLm-0cPDiMsTog0uJXWPC_qc0TaLp4)

Each line represents a different type of product that is sold at the Buttercup Games online store. The height of each line shows the number of different people who bought the product during that hour. In general, it looks like the most popular items at the online shop were Arcade games.

You can format the report as a stacked column chart, which will show you the total purchases at each hour of day.

1. Change the chart type to a Column Chart.
2. Use the Format menu, and on the General tab select stacked.

![This image shows a stacked chart from hours 0000 (midnight) to 1800 (6:00 pm).](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/1a44dd81-967d-41cf-b23b-2b1a6e4754a8?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIxYTQ0ZGQ4MS05NjdkLTQxY2YtYjIzYi0yYjFhNmU0NzU0YTgiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6ImM2YTI2NjEyZmMxOTQxNmViYWUyMTNlNWY2M2Q3YjA4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.wwYvcRbwg4cfXkIxzNmufrwlMXFDmNFHDwJcFdDTWzo)

### 6. Chart the number of earthquakes and the magnitude of each earthquake

|  |
| --- |
| This example uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and add it as an input. |

Create a chart that list the number of earthquakes, and the magnitude of each earthquake that occurred in and around Alaska. Run the search using the time range All time.

source=all\_month.csv place=\*alaska\* mag>=3.5 | chart count BY mag place useother=f | rename mag AS Magnitude

This search counts the number of earthquakes that occurred in the Alaska regions. The count is then broken down for each `place` based on the magnitude of the quake. Because the `place` value is non-numeric, the search uses the `useother=f` argument to exclude events that don't match.

The results appear on the Statistics tab and look something like this:

| Magnitude | 145km ENE of Chirikof Island, Alaska | 225km SE of Kodiak, Alaska | 250km SE of Kodiak, Alaska | 252km SE of Kodiak, Alaska | 254km SE of Kodiak, Alaska | 255km SE of Kodiak, Alaska | 259km SE of Kodiak, Alaska | 264km SE of Kodiak, Alaska | 265km SE of Kodiak, Alaska | Gulf of Alaska |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3.5 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 2 | 2 |
| 3.6 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| 3.7 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 2 |
| 3.8 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 3 |
| 3.9 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| 4.1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4.2 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4.3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4.4 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 4.6 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

Click on the Visualization tab to view the results on a chart. This chart shows the number of earthquakes by magnitude.

![This image shows a column chart. The X-axis lists the magnitudes ranging from 3.5 to 5. The Y-axis displays the count. Each region where earthquakes occurred is a data series.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/509fb410-1f0b-43c0-bb99-7d73827acf8c?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1MDlmYjQxMC0xZjBiLTQzYzAtYmI5OS03ZDczODI3YWNmOGMiLCJleHAiOjE3NjEwNjAwNjksImp0aSI6IjI5YzFhOTI2ODZiYjRkMGFhNzFhODM3NmU5MjNlZTA3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.3RYz19Pzd83YGOPsPFp6L49abmmSCcIE3ROqpDptfSw)

## See also

Commands

[timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart)

[bin](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin#e2089f64_d93c_4ca8_a05f_c1c9eb1c0179__bin)

[sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart)

Blogs

[Search commands > stats, chart, and timechart](https://www.splunk.com/blog/2018/12/10/search-commands-stats-chart-and-timechart.html)
