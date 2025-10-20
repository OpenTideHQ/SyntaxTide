# stats

## Description

Calculates aggregate statistics, such as average, count, and sum, over the results set. This is similar to SQL aggregation.
If the `stats` command is used without a `BY` clause, only one row is returned, which is the aggregation over the entire incoming result set. If a `BY` clause is used, one row is returned for each distinct value specified in the `BY` clause.

The `stats` command can be used for several SQL-like operations. If you are familiar with SQL but new to SPL, see [Splunk SPL for SQL users](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/splunk-spl-for-sql-users#e4bc11a8_84ab_4f96_8374_ddd2b86db298__Splunk_SPL_for_SQL_users).

### Difference between stats and eval commands

The `stats` command calculates statistics based on fields in your events. The `eval` command creates new fields in your events by using existing fields and an arbitrary expression.

![An image that shows two tables and an example of the stats command in between the tables. The top table shows 2 columns: Time and Event. There are two rows in the table that show sample events. There are timestamps in the Time column. The Event column shows the beginning of the events. The first row shows a GET with an item added to a cart. The second row shows a POST.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/b80224c7-4d7d-4d06-a5a8-a740db1e1aec?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiODAyMjRjNy00ZDdkLTRkMDYtYTVhOC1hNzQwZGIxZTFhZWMiLCJleHAiOjE3NjEwNjAyMTgsImp0aSI6ImY1ZmZlZjk2MDg0ZTQ3MTA4MjczYTk3NDM3MmE5YmIxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.NoGVq0ccbUkXTo9L7QenLoHLWbRD3zhP72YR4P2_ZcU)

## Syntax

Simple:

stats (stats-function(*field*) [AS *field*])... [BY *field-list*]

Complete:

Required syntax is in bold.

| stats

[partitions=<num>]

[allnum=<bool>]

[delim=<string>]

( <stats-agg-term>... | <sparkline-agg-term>... )

[<by-clause>]

[<dedup\_splitvals>]

### Required arguments

stats-agg-term

Syntax: <stats-func>(<evaled-field> | <wc-field>) [AS <wc-field>]

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_174c719b_e1d9_4e32_855a_4197a5c12471__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names. For more information on eval expressions, see [Types of eval expressions](/en/?resourceId=Splunk_Search_Usetheevalcommandandfunctions) in the *Search Manual*.

sparkline-agg-term

Syntax: <sparkline-agg> [AS <wc-field>]

Description: A sparkline aggregation function. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in the field name.

### Optional arguments

allnum

Syntax: allnum=<bool>

Description: If true, computes numerical statistics on each field if and only if all of the values of that field are numerical.

Default: false

by-clause

Syntax: BY <field-list>

Description: The name of one or more fields to group by. You cannot use a wildcard character to specify multiple fields with similar names. You must specify each field separately. The `BY` clause returns one row for each distinct value in the `BY` clause fields. If no `BY` clause is specified, the `stats` command returns only one row, which is the aggregation over the entire incoming result set.

dedup\_splitvals

Syntax: dedup\_splitvals=<boolean>

Description: Specifies whether to remove duplicate values in multivalued `BY` clause fields.

Default: false

delim

Syntax: delim=<string>

Description: Specifies how the values in the list() or values() aggregation are delimited.

Default: a single space

partitions

Syntax: partitions=<num>

Description: Partitions the input data based on the split-by fields for multithreaded reduce. The `partitions` argument runs the reduce step (in parallel reduce processing) with multiple threads in the same search process on the same machine. Compare that with parallel reduce, using the [redistribute](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/redistribute#id_0988423c_ae57_4cbf_81bc_8a2a136e9309__redistribute) command, that runs the reduce step in parallel on multiple machines.

When `partitions=0`, the value of the `partitions` argument is the same as the value of the `default_partitions` setting in the limits.conf file.

Default: 0. Set to the same value as the `default_partitions` setting in the limits.conf file, which is `1` by default.

### Stats function options

stats-func

Syntax: The syntax depends on the function that you use. Refer to the table below.

Description: Statistical and charting functions that you can use with the `stats` command. Each time you invoke the `stats` command, you can use one or more functions. However, you can only use one `BY` clause. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_75acace1_90e1_4391_b384_403892163e8a__Usage).

The following table lists the supported functions by type of function. Use the links in the table to see descriptions and examples for each function. For an overview about using functions with commands, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

| Type of function | Supported functions and syntax |  |  |  |
| --- | --- | --- | --- | --- |
| [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) | `avg()`   `count()`   `distinct_count()`  `estdc()`  `estdc_error()` | `exactperc<num>()`   `max()`   `median()`  `min()`  `mode()` | `perc<num>()`   `range()`   `stdev()`  `stdevp()` | `sum()`   `sumsq()`   `upperperc<num>()`  `var()`  `varp()` |
| [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) | `first()` | `last()` |  |  |
| [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) | `list()` | `values()` |  |  |
| [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) | `earliest()`   `earliest_time()` | `latest()`   `latest_time()` | `rate()` |  |

### Sparkline function options

Sparklines are inline charts that appear within table cells in search results to display time-based trends associated with the primary key of each row. Read more about how to "[Add sparklines to your search results](/en/?resourceId=Splunk_Search_Addsparklinestosearchresults)" in the Search Manual.

sparkline-agg

Syntax: sparkline (count(<wc-field>), <span-length>) | sparkline (<sparkline-func>(<wc-field>), <span-length>)

Description: A sparkline specifier, which takes the first argument of a aggregation function on a field and an optional timespan specifier. If no timespan specifier is used, an appropriate timespan is chosen based on the time range of the search. If the sparkline is not scoped to a field, only the count aggregator is permitted. You can use wildcard characters in the field name. See the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_75acace1_90e1_4391_b384_403892163e8a__Usage) section.

sparkline-func

Syntax: c() | count() | dc() | mean() | avg() | stdev() | stdevp() | var() | varp() | sum() | sumsq() | min() | max() | range()

Description: Aggregation function to use to generate sparkline values. Each sparkline value is produced by applying this aggregation to the events that fall into each particular time bin.

## Usage

The `stats` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Eval expressions with statistical functions

When you use the `stats` command, you must specify either a statistical function or a sparkline function. When you use a statistical function, you can use an eval expression as part of the statistical function. For example:

index=\* | stats count(eval(status="404")) AS count\_status BY sourcetype

### Statistical functions that are not applied to specific fields

With the exception of the `count` function, when you pair the `stats` command with functions that are not applied to specific fields or `eval` expressions that resolve into fields, the search head processes it as if it were applied to a wildcard for all fields. In other words, when you have `| stats avg` in a search, it returns results for `| stats avg(*)`.

This "implicit wildcard" syntax is officially deprecated, however. Make the wildcard explicit. Write `| stats <function>(*)` when you want a function to apply to all possible fields.

### Numeric calculations

During calculations, numbers are treated as double-precision floating-point numbers, subject to all the usual behaviors of floating point numbers. If the calculation results in the floating-point special value NaN, it is represented as "nan" in your results. The special values for positive and negative infinity are represented in your results as "inf" and "-inf" respectively. Division by zero results in a null field.

There are situations where the results of a calculation contain more digits than can be represented by a floating- point number. In those situations precision might be lost on the least significant digits. For an example of how to correct this, see Example 2 of the [basic examples](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/mathematical-functions#id_1ccffbba_b59f_442a_9517_1dd92136457b__Basic_examples_2) for the sigfig(X) function.

### Ensure correct search behavior when time fields are missing from input data

Ideally, when you run a `stats` search that aggregates results on a time function such as `latest()`, `latest_time()`, or `rate()`, the search should not return results when `_time` or `_origtime` fields are missing from the input data. However, searches that fit this description return results by default, which means that those results might be incorrect or random.

Correct this behavior by changing the `check_for_invalid_time` setting in `limits.conf` file.

Splunk Cloud Platform

To change the `check_for_invalid_time` setting, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the `check_for_invalid_time` setting, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can change the `check_for_invalid_time` setting in the `limits.conf` configuration file.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.
* You can have configuration files with the same name in your default, local, and app directories. Read [Where you can place (or find) your modified configuration files](/en/?resourceId=Splunk_Admin_Configurationfiledirectories) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local `limits.conf` file at $SPLUNK\_HOME/etc/system/local.
2. Under the `[stats]` stanza, set `check_for_invalid_time` to `true`.When you set `check_for_invalid_time=true`, the `stats` search processor does not return results for searches on time functions when the input data does not include the `_time` or `_origtime` fields.

### Functions and memory usage

Some functions are inherently more expensive, from a memory standpoint, than other functions. For example, the `distinct_count` function requires far more memory than the `count` function. The `values` and `list` functions also can consume a lot of memory.

If you are using the `distinct_count` function without a split-by field or with a low-cardinality split-by by field, consider replacing the `distinct_count` function with the the `estdc` function (estimated distinct count). The `estdc` function might result in significantly lower memory usage and run times.

### Memory and stats search performance

A pair of `limits.conf` settings strike a balance between the performance of `stats` searches and the amount of memory they use during the search process, in RAM and on disk. If your `stats` searches are consistently slow to complete you can adjust these settings to improve their performance, but at the cost of increased search-time memory usage, which can lead to search failures.

If you use Splunk Cloud Platform, you need to file a Support ticket to change these settings.

For more information, see [Memory and stats search performance](/en/?resourceId=Splunk_Search_Memoryandstatssearchperformance) in the *Search Manual*.

### Event order functions

Using the `first` and `last` functions when searching based on time does not produce accurate results.

* To locate the first value based on time order, use the `earliest` function, instead of the `first` function.
* To locate the last value based on time order, use the `latest` function, instead of the `last` function.

For example, consider the following search.

index=test sourcetype=testDb
| eventstats first(LastPass) as LastPass, last(\_time) as mostRecentTestTime
BY testCaseId
| where startTime==LastPass OR \_time==mostRecentTestTime
| stats first(startTime) AS startTime, first(status) AS status,
first(histID) AS currentHistId, last(histID) AS lastPassHistId BY testCaseId

Replace the `first` and `last` functions when you use the `stats` and `eventstats` commands for ordering events based on time. The following search shows the function changes.

index=test sourcetype=testDb
| eventstats latest(LastPass) AS LastPass, earliest(\_time) AS mostRecentTestTime
BY testCaseId
| where startTime==LastPass OR \_time==mostRecentTestTime
| stats latest(startTime) AS startTime, latest(status) AS status,
latest(histID) AS currentHistId, earliest(histID) AS lastPassHistId BY testCaseId

### Wildcards in BY clauses

The `stats` command does not support wildcard characters in field values in BY clauses.

For example, you cannot specify `| stats count BY source*`.

### Renaming fields

You cannot rename one field with multiple names. For example if you have field A, you cannot rename A as B, A as C. The following example is not valid.

... | stats first(host) AS site, first(host) AS report

## Basic examples

### 1. Return the average transfer rate for each host

sourcetype=access\* | stats avg(kbps) BY host

### 2. Search the access logs, and return the total number of hits from the top 100 values of "referer\_domain"

Search the access logs, and return the total number of hits from the top 100 values of "referer\_domain". The "top" command returns a count and percent value for each "referer\_domain".

sourcetype=access\_combined | top limit=100 referer\_domain | stats sum(count) AS total

### 3. Calculate the average time for each hour for similar fields using wildcard characters

Return the average, for each hour, of any unique field that ends with the string "lay". For example, delay, xdelay, relay, etc.

... | stats avg(\*lay) BY date\_hour

### 4. Remove duplicates in the result set and return the total count for the unique results

Remove duplicates of results with the same "host" value and return the total count of the remaining results.

... | stats dc(host)

### 5. In a multivalue BY field, remove duplicate values

For each unique value of `mvfield`, return the average value of `field`. Deduplicates the values in the `mvfield`.

...| stats avg(field) BY mvfield dedup\_splitvals=true

## Extended examples

### 1. Compare the difference between using the stats and chart commands

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

This search uses the `stats` command to count the number of events for a combination of HTTP status code values and host:

sourcetype=access\_\* | stats count BY status, host

The BY clause returns one row for each distinct value in the BY clause fields. In this search, because two fields are specified in the BY clause, every unique combination of status and host is listed on separate row.

The results appear on the Statistics tab and look something like this:

| status | host | count |
| --- | --- | --- |
| 200 | www1 | 11835 |
| 200 | www2 | 11186 |
| 200 | www3 | 11261 |
| 400 | www1 | 233 |
| 400 | www2 | 257 |
| 400 | www3 | 211 |
| 403 | www2 | 228 |
| 404 | www1 | 244 |
| 404 | www2 | 209 |

If you click the Visualization tab, the `status` field forms the X-axis and the `host` and `count` fields form the data series. The problem with this chart is that the host values (www1, www2, www3) are strings and cannot be measured in a chart.

Substitute the `chart` command for the `stats` command in the search.

sourcetype=access\_\* | chart count BY status, host

With the `chart` command, the two fields specified after the BY clause change the appearance of the results on the Statistics tab. The BY clause also makes the results suitable for displaying the results in a chart visualization.

* The first field you specify is referred to as the <row-split> field. In the table, the values in this field become the labels for each row. In the chart, this field forms the X-axis.
* The second field you specify is referred to as the <column-split> field. In the table, the values in this field are used as headings for each column. In the chart, this field forms the data series.

The results appear on the Statistics tab and look something like this:

| status | www1 | www2 | www3 |
| --- | --- | --- | --- |
| 200 | 11835 | 11186 | 11261 |
| 400 | 233 | 257 | 211 |
| 403 | 0 | 288 | 0 |
| 404 | 244 | 209 | 237 |
| 406 | 258 | 228 | 224 |
| 408 | 267 | 243 | 246 |
| 500 | 225 | 262 | 246 |
| 503 | 324 | 299 | 329 |
| 505 | 242 | 0 | 238 |

If you click the Visualization tab, the `status` field forms the X-axis, the values in the `host` field form the data series, and the Y-axis shows the `count`.

### 2. Use eval expressions to count the different types of requests against each Web server

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Run the following search to use the `stats` command to determine the number of different page requests, GET and POST, that occurred for each Web server.

sourcetype=access\_\* | stats count(eval(method="GET")) AS GET, count(eval(method="POST")) AS POST BY host

This example uses `eval` expressions to specify the different field values for the `stats` command to count.

* The first clause uses the `count()` function to count the Web access events that contain the `method` field value `GET`. Then, using the AS keyword, the field that represents these results is renamed GET.
* The second clause does the same for POST events.
* The counts of both types of events are then separated by the web server, using the BY clause with the `host` field.

The results appear on the Statistics tab and look something like this:

| host | GET | POST |
| --- | --- | --- |
| www1 | 8431 | 5197 |
| www2 | 8097 | 4815 |
| www3 | 8338 | 4654 |

Note: You can substitute the `chart` command for the `stats` command in this search. You can then click the Visualization tab to see a chart of the results.

### 3. Calculate a wide range of statistics by a specific field

Count the number of earthquakes that occurred for each magnitude range

|  |
| --- |
| This search uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and upload the file to your Splunk instance. This example uses the All Earthquakes data from the past 30 days. |

Run the following search to calculate the number of earthquakes that occurred in each magnitude range. This data set is comprised of events over a 30-day period.

source=all\_month.csv | chart count AS "Number of Earthquakes" BY mag span=1 | rename mag AS "Magnitude Range"

* This search uses `span=1` to define each of the ranges for the magnitude field, `mag`.
* The [rename command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rename#dc72aa4f_a698_4dda_8d71_c3974cdad2ef__rename) is then used to rename the field to "Magnitude Range".

The results appear on the Statistics tab and look something like this:

| Magnitude Range | Number of Earthquakes |
| --- | --- |
| -1-0 | 18 |
| 0-1 | 2088 |
| 1-2 | 3005 |
| 2-3 | 1026 |
| 3-4 | 194 |
| 4-5 | 452 |
| 5-4 | 109 |
| 6-7 | 11 |
| 7-8 | 3 |

Click the Visualization tab to see the result in a chart.

Calculate aggregate statistics for the magnitudes of earthquakes in an area

Search for earthquakes in and around California. Calculate the number of earthquakes that were recorded. Use statistical functions to calculate the minimum, maximum, range (the difference between the min and max), and average magnitudes of the recent earthquakes. List the values by magnitude type.

source=all\_month.csv place=\*California\* | stats count, max(mag), min(mag), range(mag), avg(mag) BY magType

The results appear on the Statistics tab and look something like this:

| magType | count | max(mag) | min(mag) | range(mag) | avg(mag) |
| --- | --- | --- | --- | --- | --- |
| H | 123 | 2.8 | 0.0 | 2.8 | 0.549593 |
| MbLg | 1 | 0 | 0 | 0 | 0.0000000 |
| Md | 1565 | 3.2 | 0.1 | 3.1 | 1.056486 |
| Me | 2 | 2.0 | 1.6 | .04 | 1.800000 |
| Ml | 1202 | 4.3 | -0.4 | 4.7 | 1.226622 |
| Mw | 6 | 4.9 | 3.0 | 1.9 | 3.650000 |
| ml | 10 | 1.56 | 0.19 | 1.37 | 0.934000 |

Find the mean, standard deviation, and variance of the magnitudes of the recent quakes

Search for earthquakes in and around California. Calculate the number of earthquakes that were recorded. Use statistical functions to calculate the mean, standard deviation, and variance of the magnitudes for recent earthquakes. List the values by magnitude type.

source=usgs place=\*California\* | stats count mean(mag), stdev(mag), var(mag) BY magType

The results appear on the Statistics tab and look something like this:

| magType | count | mean(mag) | std(mag) | var(mag) |
| --- | --- | --- | --- | --- |
| H | 123 | 0.549593 | 0.356985 | 0.127438 |
| MbLg | 1 | 0.000000 | 0.000000 | 0.000000 |
| Md | 1565 | 1.056486 | 0.580042 | 0.336449 |
| Me | 2 | 1.800000 | 0.346410 | 0.120000 |
| Ml | 1202 | 1.226622 | 0.629664 | 0.396476 |
| Mw | 6 | 3.650000 | 0.716240 | 0.513000 |
| ml | 10 | 0.934000 | 0.560401 | 0.314049 |

The `mean` values should be exactly the same as the values calculated using `avg()`.

### 4. In a table display items sold by ID, type, and name and calculate the revenue for each product

|  |
| --- |
| This example uses the sample dataset from [the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial) and a field lookup to add more information to the event data.  * Download the data set from [Add data tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to load the tutorial data. * Download the CSV file from [Use field lookups tutorial](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) and follow the instructions to set up the lookup definition to add price and productName to the events.   After you configure the field lookup, you can run this search using the time range, All time. |

Create a table that displays the items sold at the Buttercup Games online store by their ID, type, and name. Also, calculate the revenue for each product.

sourcetype=access\_\* status=200 action=purchase
| stats values(categoryId) AS Type, values(productName) AS "Product Name", sum(price)
AS "Revenue" by productId
| rename productId AS "Product ID"
| eval Revenue="$ ".tostring(Revenue,"commas")

This example uses the `values()` function to display the corresponding `categoryId` and `productName` values for each `productId`. Then, it uses the `sum()` function to calculate a running total of the values of the `price` field.

Also, this example renames the various fields, for better display. For the `stats` functions, the renames are done inline with an "AS" clause. The `rename` command is used to change the name of the `product_id` field, since the syntax does not let you rename a split-by field.

Finally, the results are piped into an `eval` expression to reformat the `Revenue` field values so that they read as currency, with a dollar sign and commas.

This returns the following table of results:

![This image shows the results on the Statistic tab. There are 14 results , organized by Product ID. There are 4 columns in the results: Product ID, Type, Product Name, and Revenue.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/f19065ed-c865-41c8-8451-5c50c9690682?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJmMTkwNjVlZC1jODY1LTQxYzgtODQ1MS01YzUwYzk2OTA2ODIiLCJleHAiOjE3NjEwNjAyMTgsImp0aSI6ImI5ZmE1ZTY1ODY1ZjQ0MTRiZThhYmQyYmQ4ZmU1MWVmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.CKhLRwhoyD6HecaBczhn43u7MVuJ0s02LTT7WDw4iRQ)

### 5. Determine how much email comes from each domain

|  |
| --- |
| This example uses sample email data. You should be able to run this search on any email data by replacing the `sourcetype=cisco:esa` with the `sourcetype` value and the `mailfrom` field with email address field name in your data. For example, the email might be `To`, `From`, or `Cc`). |

Find out how much of the email in your organization comes from .com, .net, .org or other top level domains.

The `eval` command in this search contains two expressions, separated by a comma.

sourcetype="cisco:esa" mailfrom=\*
| eval accountname=split(mailfrom,"@"), from\_domain=mvindex(accountname,-1)
| stats count(eval(match(from\_domain, "[^\n\r\s]+\.com"))) AS ".com",
count(eval(match(from\_domain, "[^\n\r\s]+\.net"))) AS ".net",
count(eval(match(from\_domain, "[^\n\r\s]+\.org"))) AS ".org",
count(eval(NOT match(from\_domain, "[^\n\r\s]+\.(com|net|org)"))) AS "other"

* The first part of this search uses the `eval` command to break up the email address in the `mailfrom` field. The `from_domain` is defined as the portion of the `mailfrom` field after the `@` symbol.
  * The `split()` function is used to break the `mailfrom` field into a multivalue field called `accountname`. The first value of `accountname` is everything before the "@" symbol, and the second value is everything after.
  * The `mvindex()` function is used to set `from_domain` to the second value in the multivalue field `accountname`.
* The results are then piped into the `stats` command. The `count()` function is used to count the results of the `eval` expression.
* The`eval` uses the `match()` function to compare the `from_domain` to a regular expression that looks for the different suffixes in the domain. If the value of `from_domain` matches the regular expression, the `count` is updated for each suffix, `.com`, `.net`, and `.org`. Other domain suffixes are counted as `other`.

The results appear on the Statistics tab and look something like this:

| .com | .net | .org | other |
| --- | --- | --- | --- |
| 4246 | 9890 | 0 | 3543 |

### 6. Search Web access logs for the total number of hits from the top 10 referring domains

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

This example searches the web access logs and return the total number of hits from the top 10 referring domains.

sourcetype=access\_\* | top limit=10 referer

This search uses the `top` command to find the ten most common referer domains, which are values of the `referer` field. Some events might use `referer_domain` instead of `referer`. The `top` command returns a count and percent value for each `referer`.

![This image shows the total number of times each referrer accesses the web site.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ccc4be7d-5c37-4dda-bbdf-ffef0f90e2d2?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJjY2M0YmU3ZC01YzM3LTRkZGEtYmJkZi1mZmVmMGY5MGUyZDIiLCJleHAiOjE3NjEwNjAyMTgsImp0aSI6IjdhMTUwZTU1MzBlZjQzNzQ5ODNhOGJjMzM1MmZkMDFjIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ._qXNRgpEI2T3g4nqtwqiy8J9a9QN9FH-WWe2IkncHQ4)

You can then use the `stats` command to calculate a total for the top 10 referrer accesses.

sourcetype=access\_\* | top limit=10 referer | stats sum(count) AS total

The `sum()` function adds the values in the `count` to produce the total number of times the top 10 referrers accessed the web site.

![This image shows a single numeric value for the total.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/d733a8b3-ecdd-485f-a859-a8d09084c38f?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJkNzMzYThiMy1lY2RkLTQ4NWYtYTg1OS1hOGQwOTA4NGMzOGYiLCJleHAiOjE3NjEwNjAyMTgsImp0aSI6IjM3YjVmMjIwNTlhOTRhMjdiYzU2ODBkZWVmZTFlZjY2IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.wI86ehW41iEMoEm0hF55mwBqHndWn_p6gCTKbRoHJbY)

## See also

Functions

[Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions)

Commands

[eventstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#d50b254f_0c46_4fb9_8fed_a8a94363a53c__eventstats)

[rare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rare#id_34e62677_1b02_434d_b298_c0c1e25c3eb3__rare)

[sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats)

[streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats)

[top](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/top#id_5d59fd51_ff0d_415f_adb1_cd3c78a8fcb1__top)

Blogs

[Getting started with stats, eventstats and streamstats](https://www.splunk.com/blog/2014/04/01/search-command-stats-eventstats-and-streamstats-2.html)

[Search commands > stats, chart, and timechart](https://www.splunk.com/blog/2018/12/10/search-commands-stats-chart-and-timechart.html)

[Smooth operator | Searching for multiple field values](https://www.splunk.com/content/splunk-blogs/en/2019/05/08/smooth-operator-searching-for-multiple-field-values.html)
