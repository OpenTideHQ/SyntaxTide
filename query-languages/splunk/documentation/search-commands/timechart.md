# timechart

## Description

Creates a time series chart with corresponding table of statistics.

A timechart is a statistical aggregation applied to a field to produce a chart, with time used as the X-axis. You can specify a split-by field, where each distinct value of the split-by field becomes a series in the chart. If you use an `eval` expression, the split-by clause is required. With the `limit` and `agg` options, you can specify series filtering. These options are ignored if you specify an explicit where-clause. If you set limit=0, no series filtering occurs.

## Syntax

The required syntax is in bold.

timechart

[sep=<string>]

[format=<string>]

[partial=<bool>]

[cont=<bool>]

[limit=<chart-limit-opt>]

[agg=<stats-agg-term>]

[<bin-options>... ]

( (<single-agg> [BY <split-by-clause>] ) | (<eval-expression>) BY <split-by-clause> )

[<dedup\_splitvals>]

### Required arguments

When specifying `timechart` command arguments, either <single-agg> or <eval-expression> BY <split-by-clause> is required.

eval-expression

Syntax: <math-exp> | <concat-exp> | <compare-exp> | <bool-exp> | <function-call>

Description: A combination of literals, fields, operators, and functions that represent the value of your destination field. For these evaluations to work, your values need to be valid for the type of operation. For example, with the exception of addition, arithmetic operations might not produce valid results if the values are not numerical. Additionally, the search can concatenate the two operands if they are both strings. When concatenating values with a period '.' the search treats both values as strings, regardless of their actual data type.

single-agg

Syntax: count | <stats-func>(<field>)

Description: A single aggregation applied to a single field, including an evaluated field. For <stats-func>, see [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__Stats_function_options). No wildcards are allowed. The field must be specified, except when using the  `count` function, which applies to events as a whole.

split-by-clause

Syntax: <field> (<tc-options>)... [<where-clause>]

Description: Specifies a field to split the results by. If field is numerical, default discretization is applied. Discretization is defined with the `tc-options`. Use the <where-clause> to specify the number of columns to include. See the [tc options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__tc_options) and the [where clause](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__where_clause) sections in this topic.

### Optional arguments

agg=<stats-agg-term>

Syntax:agg=( <stats-func> ( <evaled-field> | <wc-field> ) [AS <wc-field>] )

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names.

bin-options

Syntax: bins | minspan | span | <start-end> | aligntime

Description: Options that you can use to specify discrete bins, or groups, to organize the information. The `bin-options` set the maximum number of bins, not the target number of bins. See the [Bin options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__Bin_options) section in this topic.

Default: bins=100

cont

Syntax: cont=<bool>

Description: Specifies whether the chart is continuous or not. If set to `true`, the Search application fills in the time gaps.

Default: true

dedup\_splitvals

Syntax: dedup\_splitvals=<boolean>

Description: Specifies whether to remove duplicate values in multivalued `<split-by-clause>` fields.

Default: false

fixedrange

Syntax: fixedrange=<bool>

Description: Specifies whether or not to enforce the earliest and latest times of the search. Setting `fixedrange=false` allows the `timechart` command to constrict or expand to the time range covered by all events in the dataset.

Default: true

format

Syntax: format=<string>

Description: Used to construct output field names when multiple data series are used in conjunction with a split-by-field. `format` takes precedence over `sep` and allows you to specify a parameterized expression with the stats aggregator and function ($AGG$) and the value of the split-by-field ($VAL$).

limit

Syntax: limit=(top | bottom)<int>

Description: Specifies a limit for the number of distinct values of the split-by field to return. If set to `limit=0`, all distinct values are used. Setting `limit=N` or `limit=topN` keeps the N highest scoring distinct values of the `split-by` field. Setting `limit=bottomN` keeps the lowest scoring distinct values of the `split-by` field. All other values are grouped into 'OTHER', as long as `useother` is not set to false. The scoring is determined as follows:

* If a single aggregation is specified, the score is based on the sum of the values in the aggregation for that split-by value. For example, for `timechart avg(host) BY <field>`, the `avg(host)` values are added up for each value of <field> to determine the scores.
* If multiple aggregations are specified, the score is based on the frequency of each value of <field>. For example, for `timechart avg(host) max(amount) BY <field>`, the top scoring values for <field> are the most common values of <field>.

Ties in scoring are broken lexicographically, based on the value of the `split-by` field. For example, 'AMOUNT' takes precedence over 'amount', which takes precedence over 'host'. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#dab97bc4_850b_476b_b4f0_dd6f613d3d09__Usage).

Default: top10

partial

Syntax: partial=<bool>

Description: Controls if partial time bins should be retained or not. Only the first and last bin can be partial.

Default: True. Partial time bins are retained.

sep

Syntax: sep=<string>

Description: Used to construct output field names when multiple data series are used in conjunctions with a split-by field. This is equivalent to setting `format` to `$AGG$<sep>$VAL$`.

### Stats function options

stats-func

Syntax: The syntax depends on the function that you use. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_75acace1_90e1_4391_b384_403892163e8a__Usage).

Description: Statistical functions that you can use with the `timechart` command. Each time you invoke the `timechart` command, you can use one or more functions. However, you can only use one `BY` clause.

### Bin options

bins

Syntax: bins=<int>

Description: Sets the *maximum number* of bins to discretize into. This does not set the target number of bins. It finds the smallest bin size that results in no more than N distinct bins. Even though you specify a number such as 300, the resulting number of bins might be much lower.

Default: 100

minspan

Syntax: minspan=<span-length>

Description: Specifies the smallest span granularity to use automatically inferring span from the data time range. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#dab97bc4_850b_476b_b4f0_dd6f613d3d09__Usage).

span

Syntax: span=<log-span> | span=<span-length> | span=<snap-to-time>

Description: Sets the size of each bin, using either a log-based span, a span length based on time, or a span that snaps to a specific time. For descriptions of each of these options, see [Span options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__Span_options).

The starting time of a bin might not match your local timezone. see [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#dab97bc4_850b_476b_b4f0_dd6f613d3d09__Usage).

<start-end>

Syntax: end=<num> | start=<num>

Description: Sets the minimum and maximum extents for numerical bins. Data outside of the [start, end] range is discarded.

aligntime

Syntax: aligntime=(earliest | latest | <time-specifier>)

Description: Align the bin times to something other than base UNIX time (epoch 0). The `aligntime` option is valid only when doing a time-based discretization. Ignored if `span` is in days, months, or years.

### Span options

<log-span>

Syntax: [<num>]log[<num>]

Description: Sets to log-based span. The first number is a coefficient. The second number is the base. If the first number is supplied, it must be a real number greater than or equal to 1.0 and less than the base. If supplied, the base must be real number greater than 1.0 and strictly greater than 1.

The `log-span` option must come at the end of the `timechart` command in the search like this:

...| timechart dc(data.search\_props.sid) by data.search\_props.type span=log2

<span-length>

Syntax: <int>[<timescale>]

Description: A span of each bin, based on time. If the timescale is provided, this is used as a time range. If not, this is an absolute bin length.

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <week> | <month> | <quarter> | <subseconds>

Description: Timescale units.

Default: <sec>

| Timescale | Valid syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <week> | w | week | weeks | Time scale in weeks. |
| <month> | mon | month | months | Time scale in months. |
| <quarter> | q | qtr | qtrs | quarter | quarters | Time scale in quarters. |
| <subseconds> | us | ms | cs | ds | Time scale in microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |

<snap-to-time>

Syntax: [+|-] [<time\_integer>] <relative\_time\_unit>@<snap\_to\_time\_unit>

Description: A span of each bin, based on a relative time unit and a snap to time unit. The <snap-to-time> must include a relative\_time\_unit, the @ symbol, and a snap\_to\_time\_unit. The offset, represented by the plus (+) or minus (-) is optional. If the <time\_integer> is not specified, 1 is the default. For example, if you specify w as the relative\_time\_unit, 1 week is assumed.

### tc options

The <tc-option> is part of the <split-by-clause>.

tc-option

Syntax: <bin-options> | usenull=<bool> | useother=<bool> | nullstr=<string> | otherstr=<string>

Description: Timechart options for controlling the behavior of splitting by a field.

bin-options

See the [Bin options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0ace3a15_f19d_4eb6_8207_13b892b1e200__Bin_options) section in this topic.

nullstr

Syntax: nullstr=<string>

Description: If `usenull=true`, specifies the label for the series that is created for events that do not contain the split-by field.

Default: NULL

otherstr

Syntax: otherstr=<string>

Description: If `useother=true`, specifies the label for the series that is created in the table and the graph.

Default: OTHER

usenull

Syntax: usenull=<bool>

Description: Controls whether or not a series is created for events that do not contain the split-by field. The label for the series is controlled by the `nullstr` option.

Default: true

useother

Syntax: useother=<bool>

Description: You specify which series to include in the results table by using the <agg>, <limit>, and <where-clause> options. The `useother` option specifies whether to merge all of the series not included in the results table into a single new series. If `useother=true`, the label for the series is controlled by the `otherstr` option.

Default: true

### where clause

The <where-clause> is part of the <split-by-clause>. The <where-clause> is comprised of two parts, a single aggregation and some options. See [Where clause examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_775d8258_efc9_441f_83fd_a4f343cbcea4__Where_clause_examples).

where clause

Syntax: <single-agg> <where-comp>

Description: Specifies the criteria for including particular data series when a field is given in the <tc-by-clause>. The most common use of this option is to look for spikes in your data rather than overall mass of distribution in series selection. The default value finds the top ten series by area under the curve. Alternately one could replace sum with max to find the series with the ten highest spikes. Essentially the default is the same as specifying `where sum in top10`. The <where-clause> has no relation to the `where` command.

<where-comp>

Syntax: <wherein-comp> | <wherethresh-comp>

Description: Specify either a grouping for the series or the threshold for the series.

<wherein-comp>

Syntax: (in | notin) (top | bottom)<int>

Description: A grouping criteria that requires the aggregated series value be in or not in some top or bottom group.

<wherethresh-comp>

Syntax: (< | >) [" "] <num>

Description: A threshold criteria that requires the aggregated series value be greater than or less than some numeric threshold. You can specify the threshold with or without a space between the sign and the number.

## Usage

The `timechart` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Note: Do not run searches that modify the \_time field using `eval` and `timechart` commands with the `span` argument. The `_time` field is an [internal field](https://docs.splunk.com/Splexicon:Internalfield) that should not be overwritten. See [Use default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields)[Use default fields](/en/?resourceId=SplunkCloud_Knowledge_Usedefaultfields).

### bins and span arguments

The `timechart` command accepts either the `bins` argument OR the `span` argument. If you specify both `bins` and `span`, `span` is used. The `bins` argument is ignored.

If you do not specify either `bins` or `span`, the `timechart` command uses the default `bins=100`.

### Default time spans

If you use the predefined time ranges in the time range picker, and do not specify the `span` argument, the following table shows the default span that is used.

| Time range | Default span |
| --- | --- |
| Last 15 minutes | 10 seconds |
| Last 60 minutes | 1 minute |
| Last 4 hours | 5 minutes |
| Last 24 hours | 30 minutes |
| Last 7 days | 1 day |
| Last 30 days | 1 day |
| Previous year | 1 month |

(Thanks to Splunk users [MuS](https://answers.splunk.com/users/2122/MuS) and [Martin Mueller](https://answers.splunk.com/users/134323/martin_mueller) for their help in compiling this default time span information.)

### Spans used when minspan is specified

When you specify a `minspan` value, the span that is used for the search must be equal to or greater than one of the span threshold values in the following table. For example, if you specify `minspan=15m` that is equivalent to 900 seconds. The minimum span that can be used is 1800 seconds, or 30 minutes.

| Span threshold | Time equivalents |
| --- | --- |
| 1 second |  |
| 5 seconds |  |
| 10 seconds |  |
| 30 seconds |  |
| 60 seconds | 1 minute |
| 300 seconds | 5 minutes |
| 600 seconds | 10 minutes |
| 1800 seconds | 30 minutes |
| 3600 seconds | 1 hour |
| 86400 seconds | 1 day |
| 2592000 seconds | 30 days |

### Bin time spans and local time

The `span` argument always rounds down the starting date for the first bin. There is no guarantee that the bin start time used by the timechart command corresponds to your local timezone. In part this is due to differences in daylight savings time for different locales. To use day boundaries, use span=1d. Do not use not span=86400s, or span=1440m, or span=24h.

### Bin time spans versus per\_\* functions

The functions, `per_day()`, `per_hour()`, `per_minute()`, and `per_second()` are aggregator functions and are not responsible for setting a time span for the resultant chart. These functions are used to get a consistent scale for the data when an explicit span is not provided. The resulting span can depend on the search time range.

For example, `per_hour()` converts the field value so that it is a rate per hour, or sum()/<hours in the span>. If your chart span ends up being 30m, it is sum()\*2.

If you want the span to be 1h, you still have to specify the argument `span=1h` in your search.

Note: You can do `per_hour()` on one field and `per_minute()` (or any combination of the functions) on a different field in the same search.

### Subsecond bin time spans

Subsecond `span` timescales, which are time spans that are made up of deciseconds (ds), centiseconds (cs), milliseconds (ms), or microseconds (us), should be numbers that divide evenly into a second. For example, 1s = 1000ms. This means that valid millisecond `span` values are 1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, or 500ms. In addition, `span = 1000ms` is not allowed. Use `span = 1s` instead.

### Split-by fields

If you specify a split-by field, ensure that you specify the `bins` and `span` arguments *before* the split-by field. If you specify these arguments after the split-by field, Splunk software assumes that you want to control the bins on the split-by field, not on the time axis.

If you use `chart` or `timechart`, you cannot use a field that you specify in a function as your split-by field as well. For example, you will not be able to run:

... | chart sum(A) by A span=log2

However, you can work around this with an `eval` expression, for example:

... | eval A1=A | chart sum(A) by A1 span=log2

### Prepending VALUE to the names of some fields that begin with underscore (  \_  )

In timechart searches that include a split-by-clause, when search results include a field name that begins with a leading underscore (  \_  ), Splunk software prepends the field name with `VALUE` and creates as many columns as there are unique entries in the argument of the BY clause. Prepending the string with `VALUE` distinguishes the field from internal fields and avoids naming a column with a leading underscore, which ensures that the field is not hidden in the output schema like most internal fields.

For example, consider the following search:

index="\_internal" OR index="\_audit" | timechart span=1m sum(linecount) by index

The results look something like this:

| \_time | VALUE\_audit | VALUE\_internal |
| --- | --- | --- |
| 2023-06-26 21:00:00 | 1 | 586 |
| 2023-06-26 21:01:00 | 1 | 295 |
| 2023-06-26 21:02:00 | 1 | 555 |

The columns are displayed in the search results as `VALUE_audit` and `VALUE_internal`.

### Supported functions

You can use a wide range of functions with the `timechart` command. For general information about using functions, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

* For a list of functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* For an alphabetical list of functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

### Functions and memory usage

Some functions are inherently more expensive, from a memory standpoint, than other functions. For example, the `distinct_count` function requires far more memory than the `count` function. The `values` and `list` functions also can consume a lot of memory.

If you are using the `distinct_count` function without a split-by field or with a low-cardinality split-by by field, consider replacing the `distinct_count` function with the the `estdc` function (estimated distinct count). The `estdc` function might result in significantly lower memory usage and run times.

### Lexicographical order

Lexicographical order sorts items based on the values used to encode the items in computer memory. In Splunk software, this is almost always UTF-8 encoding, which is a superset of ASCII.

* Numbers are sorted before letters. Numbers are sorted based on the first digit. For example, the numbers 10, 9, 70, 100 are sorted lexicographically as 10, 100, 70, 9.
* Uppercase letters are sorted before lowercase letters.
* Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.

You can specify a custom sort order that overrides the lexicographical order. See the blog [Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html).

## Basic Examples

### 1. Chart the product of the average "CPU" and average "MEM" for each "host"

For each minute, compute the product of the average "CPU" and average "MEM" for each "host".

... | timechart span=1m eval(avg(CPU) \* avg(MEM)) BY host

### 2. Chart the average of cpu\_seconds by processor

This example uses an eval expression that includes a statistical function, `avg` to calculate the average of `cpu_seconds` field, rounded to 2 decimal places. The results are organized by the values in the `processor` field. When you use a eval expression with the `timechart` command, you must also use BY clause.

... | timechart eval(round(avg(cpu\_seconds),2)) BY processor

### 3. Chart the average of "CPU" for each "host"

For each minute, calculate the average value of "CPU" for each "host".

... | timechart span=1m avg(CPU) BY host

### 4. Chart the average "cpu\_seconds" by "host" and remove outlier values

Calculate the average "cpu\_seconds" by "host". Remove outlying values that might distort the timechart axis.

... | timechart avg(cpu\_seconds) BY host | outlier action=tf

### 5. Chart the average "thruput" of hosts over time

... | timechart span=5m avg(thruput) BY host

### 6. Chart the eventypes by source\_ip

For each minute, count the eventypes by `source_ip`, where the count is greater than 10.

sshd failed OR failure | timechart span=1m count(eventtype) BY source\_ip usenull=f WHERE count>10

### 7. Align the chart time bins to local time

Align the time bins to 5am (local time). Set the span to 12h. The bins will represent 5am - 5pm, then 5pm - 5am (the next day), and so on.

...| timechart \_time span=12h aligntime=@d+5h

### 8. In a multivalue BY field, remove duplicate values

For each unique value of `mvfield`, return the average value of `field`. Deduplicates the values in the `mvfield`.

...| timechart avg(field) BY mvfield dedup\_splitval=true

### 9. Rename fields prepended with VALUE

To rename fields with leading underscores that are prepended with `VALUE`, add the following command to your search:

... | rename VALUE\_\* as \*

The columns in your search results now display without the leading `VALUE_` in the field name.

## Extended Examples

### 1. Chart revenue for the different products

|  |
| --- |
| This example uses the sample dataset from the Search Tutorial and a field lookup to add more information to the event data. To try this example for yourself:  * Download the `tutorialdata.zip` file from [this topic in the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to upload the file to your Splunk deployment. * Download the `Prices.csv.zip` file from [this topic in the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) and follow the instructions to set up your field lookup. * Use the time range Yesterday when you run the search.   The tutorialdata.zip file includes a `productId` field that is the catalog number for the items sold at the Buttercup Games online store. The field lookup uses the `prices.csv` file to add two new fields to your events: `productName`, which is a descriptive name for the item, and `price`, which is the cost of the item. |

Chart the revenue for the different products that were purchased yesterday.

sourcetype=access\_\* action=purchase | timechart per\_hour(price) by productName usenull=f useother=f

* This example searches for all purchase events (defined by the `action=purchase`).
* The results are piped into `timechart` command.
* The `per_hour()` function sums up the values of the `price` field for each `productName` and organizes the total by time.

This search produces the following table of results in the Statistics tab. To format the numbers to the proper digits for currency, click the format icon in the column heading. On the Number Formatting tab, select the Precision.

![This image shows the time in the first column. Each product has it's own column with the review for each time. Use the format icon, which looks like a pencil, to format the numbers to display two digits.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/49dd79e3-5269-4ef2-8d0d-91cc8e923bad?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0OWRkNzllMy01MjY5LTRlZjItOGQwZC05MWNjOGU5MjNiYWQiLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6ImUzYzc5M2Y0ZTUyODQ5MjA5MzlkZmY3NmQ1MzQ1MTk0IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.EJnRGH0sb7qumisqLFc7ohS8-JNrUPYKDOy-8Dueo4Q)

Click the Visualization tab. If necessary, change the chart to a column chart. On the Format menu, the General tab contains the Stack Mode option where you can change the chart to a stacked chart.

![This image shows the stacked column chart. The Format menu is also displayed to show how to change the chart to a stacked chart.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/5b2f6381-c276-4aa9-bd41-740715697847?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1YjJmNjM4MS1jMjc2LTRhYTktYmQ0MS03NDA3MTU2OTc4NDciLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6IjBjMThmMTMzY2U4NjQ5MjJiN2FiOGQ0NTc3NmViMDM3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.9KlVL4uo4DRYiB7bRFP0Wj9CBAOvbWBciuYjfctzLD0)

After you create this chart, you can position your mouse pointer over each section to view more metrics for the product purchased at that hour of the day.

Notice that the chart does not display the data in hourly spans. Because a span is not provided (such as span=1hr), the per\_hour() function converts the value so that it is a sum per hours in the time range (which in this example is 24 hours).

### 2. Chart daily purchases by product type

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Chart the number of purchases made daily for each type of product.

sourcetype=access\_\* action=purchase | timechart span=1d count by categoryId usenull=f

* This example searches for all purchases events, defined by the `action=purchase`, and pipes those results into the `timechart` command.
* The `span=1day` argument buckets the count of purchases over the week into daily chunks.
* The `usenull=f` argument ignore any events that contain a NULL value for `categoryId`.

The results appear on the Statistics tab and look something like this:

| \_time | ACCESSORIES | ARCADE | SHOOTER | SIMULATION | SPORTS | STRATEGY | TEE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-03-29 | 5 | 17 | 6 | 3 | 5 | 32 | 9 |
| 2018-03-30 | 62 | 63 | 39 | 30 | 22 | 127 | 56 |
| 2018-03-31 | 65 | 94 | 38 | 42 | 34 | 128 | 60 |
| 2018-04-01 | 54 | 82 | 42 | 39 | 13 | 115 | 66 |
| 2018-04-02 | 52 | 63 | 45 | 42 | 22 | 124 | 52 |
| 2018-04-03 | 46 | 76 | 34 | 42 | 19 | 123 | 59 |
| 2018-04-04 | 57 | 70 | 36 | 38 | 20 | 130 | 56 |
| 2018-04-05 | 46 | 72 | 35 | 37 | 13 | 106 | 46 |

Click the Visualization tab. If necessary, change the chart to a column chart.

![This image shows _time on the X-axis. Each of the categories, ACCESSORIES, ARCADE, SHOOTER, are the data series.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/b71828a5-6312-42b4-8df5-2c4121dd95c9?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiNzE4MjhhNS02MzEyLTQyYjQtOGRmNS0yYzQxMjFkZDk1YzkiLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6ImFlOGM2Mzg4ZWJmOTQwOGZiMTY4ZjhjN2FlODczOWI5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.ooxaHrX-vGGhcqrDuwou_sugQoGYqlvBnLaZiv_diwc)

Compare the number of different items purchased each day and over the course of the week.

### 3. Display results in 1 week intervals

|  |
| --- |
| This search uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and upload the file to your Splunk instance. This example uses the All Earthquakes data from the past 30 days. |

This search counts the number of earthquakes in Alaska where the magnitude is greater than or equal to 3.5. The results are organized in spans of 1 week, where the week begins on Monday.

source=all\_month.csv place=\*alaska\* mag>=3.5 | timechart span=w@w1 count BY mag

* The <by-clause> is used to group the earthquakes by magnitude.
* You can only use week spans with the snap-to span argument in the `timechart` command. For more information, see [Specify a snap to time unit](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/time-modifiers#f6b51910_831b_4b80_9728_343ed65e2b80__Specify_a_snap_to_time_unit).

The results appear on the Statistics tab and look something like this:

| \_time | 3.5 | 3.6 | 3.7 | 3.8 | 4 | 4.1 | 4.1 | 4.3 | 4.4 | 4.5 | OTHER |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2018-03-26 | 3 | 3 | 2 | 2 | 3 | 1 | 0 | 2 | 1 | 1 | 1 |
| 2018-04-02 | 5 | 7 | 2 | 0 | 3 | 2 | 1 | 0 | 0 | 1 | 1 |
| 2018-04-09 | 2 | 3 | 1 | 2 | 0 | 2 | 1 | 1 | 0 | 1 | 2 |
| 2018-04-16 | 6 | 5 | 0 | 1 | 2 | 2 | 2 | 0 | 0 | 2 | 1 |
| 2018-04-23 | 2 | 0 | 0 | 0 | 0 | 2 | 1 | 2 | 2 | 0 | 1 |

### 4. Count the revenue for each item over time

|  |
| --- |
| This example uses the sample dataset from the Search Tutorial and a field lookup to add more information to the event data. Before you run this example:  * Download the data set from [this topic in the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to upload it to your Splunk deployment. * Download the `Prices.csv.zip` file from [this topic in the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) and follow the instructions to set up your field lookup.   The original data set includes a `productId` field that is the catalog number for the items sold at the Buttercup Games online store. The field lookup adds two new fields to your events: `productName`, which is a descriptive name for the item, and `price`, which is the cost of the item. |

Count the total revenue made for each item sold at the shop over the last 7 days. This example shows two different searches to generate the calculations.

Search 1

The first search uses the `span` argument to bucket the times of the search results into 1 day increments. The search then uses the `sum()` function to add the `price` for each `product_name`.

sourcetype=access\_\* action=purchase | timechart span=1d sum(price) by productName usenull=f

Search 2

This second search uses the `per_day()` function to calculate the total of the `price` values for each day.

sourcetype=access\_\* action=purchase | timechart per\_day(price) by productName usenull=f

Both searches produce similar results. Search 1 produces values with two decimal places. Search 2 produces values with six decimal places. The following image shows the results from Search 1.

![This image shows the results on the Statistics tab. The time increments are in the first column. Each product has it's own column with the revenue for each time increment.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/442eb1cc-0f8e-4065-986a-131fcf359fe0?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0NDJlYjFjYy0wZjhlLTQwNjUtOTg2YS0xMzFmY2YzNTlmZTAiLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6ImRhZTRhOTU1MWE2NzQ5YzJhNjJmNGQ2Y2M3YzA2ZDc2IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.3oUQOZpfE7C73JxMujIoyZ1Ot-CVvUt7iBaopqSEG6s)

Click the Visualization tab. If necessary, change the chart to a column chart.

![This image shows the column chart.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/efe5bf70-0b67-4e89-8d8d-fbddb37bdbab?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlZmU1YmY3MC0wYjY3LTRlODktOGQ4ZC1mYmRkYjM3YmRiYWIiLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6ImQ3ZGM5ZDk2Y2ZmNjRlODBiNTVjMDAwYmJiMDEzZTYwIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.OqiQX8Jfqmd65JzPfHM47tMUcMJIu9-LAzgBME7Z8Eg)

Now you can compare the total revenue made for items purchased each day and over the course of the week.

### 5. Chart product views and purchases for a single day

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Chart a single day's views and purchases at the Buttercup Games online store.

sourcetype=access\_\* | timechart per\_hour(eval(method="GET")) AS Views, per\_hour(eval(action="purchase")) AS Purchases

* This search uses the `per_hour()` function and `eval` expressions to search for page views (`method=GET`) and purchases (`action=purchase`).
* The results of the `eval` expressions are renamed as `Views` and `Purchases`, respectively.

The results appear on the Statistics tab and look something like this:

| \_time | Views | Purchases |
| --- | --- | --- |
| 2018-04-05 00:00:00 | 150.000000 | 44.000000 |
| 2018-04-05 00:30:00 | 166.000000 | 54.000000 |
| 2018-04-05 01:00:00 | 214.000000 | 72.000000 |
| 2018-04-05 01:30:00 | 242.000000 | 80.000000 |
| 2018-04-05 02:00:00 | 158.000000 | 26.000000 |
| 2018-04-05 02:30:00 | 166.000000 | 20.000000 |
| 2018-04-05 03:00:00 | 220.000000 | 56.000000 |

Click the Visualization tab. Format the results as an area chart.

![This image shows overlapping area charts. The purchases area chart is in front of the views area chart.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/3818bc75-7719-49e0-9e9d-3f7c6ee807cd?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIzODE4YmM3NS03NzE5LTQ5ZTAtOWU5ZC0zZjdjNmVlODA3Y2QiLCJleHAiOjE3NjEwNjAyMjgsImp0aSI6IjEyOTQzYzhkNjQ4YTQ0YzBhYjcxYTVkNmZiYTNjYWI1IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.QWZdwxWuA7l0PZmiIqGaC2lAlmZBgKx3BJpAX0V89Ps)

The difference between the two areas indicates that many of the views did not become to purchases. If all of the views became purchases, you would expect the areas to overlay on top each other completely. There would be no difference between the two areas.

## Where clause examples

These examples use the `where` clause to control the number of series values returned in the time-series chart.

Example 1: Show the 5 most rare series based on the minimum count values. All other series values will be labeled as "other".

index=\_internal | timechart span=1h count by source WHERE min in bottom5

Example 2: Show the 5 most frequent series based on the maximum values. All other series values will be labeled as "other".

index=\_internal | timechart span=1h count by source WHERE max in top5

These two searches return six data series: the five top or bottom series specified and the series labeled `other`. To hide the "other" series, specify the argument `useother=f`.

Example 3: Show the source series count of INFO events, but only where the total number of events is larger than 100. All other series values will be labeled as "other".

index=\_internal | timechart span=1h sum(eval(if(log\_level=="INFO",1,0))) by source WHERE sum > 100

Example 4: Using the where clause with the count function measures the total number of events over the period. This yields results similar to using the sum function.

The following two searches returns the sources series with a total count of events greater than 100. All other series values will be labeled as "other".

index=\_internal | timechart span=1h count by source WHERE count > 100

index=\_internal | timechart span=1h count by source WHERE sum > 100

## See also

Commands

[bin](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin#e2089f64_d93c_4ca8_a05f_c1c9eb1c0179__bin)

[chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart)

[sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart)

[timewrap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timewrap#id_66c856c0_3ba0_447a_bd57_46ec47ac634c__timewrap)

Blogs

[Search commands > stats, chart, and timechart](https://www.splunk.com/blog/2018/12/10/search-commands-stats-chart-and-timechart.html)
