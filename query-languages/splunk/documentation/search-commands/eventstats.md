# eventstats

## Description

Generates summary statistics from fields in your events and saves those statistics in a new field.

Only those events that have fields pertinent to the aggregation are used in generating the summary statistics. The generated summary statistics can be used for calculations in subsequent commands in your search. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#id_37ad4f39_7bb2_447d_b910_c2eec51cc830__Usage).

## Syntax

The required syntax is in bold.

eventstats

[allnum=<bool>]

<stats-agg-term> ...

[<by-clause>]

### Required arguments

<stats-agg-term>

Syntax: <stats-func>( <evaled-field> | <wc-field> ) [AS <wc-field>]

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#fceca838_aaa5_4286_bdf1_7c1e2cc69e1c__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names.

### Optional arguments

allnum

Syntax: allnum=<bool>

Description: If set to `true`, computes numerical statistics on each field, if and only if ,all of the values of that field are numerical. If you have a BY clause, the `allnum` argument applies to each group independently.

Default: false

<by-clause>

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

### Stats function options

stats-func

Syntax: The syntax depends on the function that you use. Refer to the table below.

Description: Statistical and charting functions that you can use with the `eventstats` command. Each time you invoke the `eventstats` command, you can use one or more functions. However, you can only use one `BY` clause. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#id_37ad4f39_7bb2_447d_b910_c2eec51cc830__Usage).

The following table lists the supported functions by type of function. Use the links in the table to see descriptions and examples for each function. For an overview about using functions with commands, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

| Type of function | Supported functions and syntax |  |  |  |
| --- | --- | --- | --- | --- |
| [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) | `avg()`   `count()`   `distinct_count()`  `estdc()`  `estdc_error()` | `exactperc<int>()`   `max()`   `median()`  `min()`  `mode()` | `perc<int>()`   `range()`   `stdev()`  `stdevp()` | `sum()`   `sumsq()`   `upperperc<int>()`  `var()`  `varp()` |
| [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) | `earliest()` | `first()` | `last()` | `latest()` |
| [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) | `list(X)` | `values(X)` |

## Usage

The `eventstats` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The `eventstats` search processor uses a `limits.conf` file setting named `max_mem_usage_mb` to limit how much memory the `eventstats` command can use to keep track of information. When the limit is reached, the `eventstats` command processor stops adding the requested fields to the search results.

Do not set `max_mem_usage_mb=0` as this removes the bounds to the amount of memory the `eventstats` command processor can use. This can lead to search failures.

Splunk Cloud Platform

To change the `max_mem_usage_mb` setting, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the `max_mem_usage_mb` setting, follow these steps.

Prerequisites

* Have the permissions to change the `max_mem_usage_mb` setting. Only users with file system access, such as system administrators, can increase the `max_mem_usage_mb` setting using configuration files.
* Know how to edit configuration files. Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.
* Decide which directory to store configuration file changes in. There can be configuration files with the same name in your default, local, and app directories. See [Where you can place (or find) your modified configuration files](/en/?resourceId=Splunk_Admin_Configurationfiledirectories) in the *Splunk Enterprise Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file at $SPLUNK\_HOME/etc/system/local.
2. Under the [default] stanza, look for the `max_mem_usage_mb` setting.
3. Under Note, read the information about the `eventstats` command and how the `max_mem_usage_mb` and the `maxresultrows` settings are used to determine the maximum number of results to return.
4. Change the value for the `max_mem_usage_mb` setting and if necessary the `maxresultrows` setting.

### Differences between eventstats and stats

The `eventstats` command is similar to the `stats` command. You can use both commands to generate aggregations like average, sum, and maximum.

The differences between these commands are described in the following table:

| stats command | eventstats command |
| --- | --- |
| Events are transformed into a table of aggregated search results | Aggregations are placed into a new field that is added to each of the events in your output |
| You can only use the fields in your aggregated results in subsequent commands in the search | You can use the fields in your events in subsequent commands in your search, because the events have not been transformed |

### How eventstats generates aggregations

The `eventstats` command looks for events that contain the field that you want to use to generate the aggregation. The command creates a new field in every event and places the aggregation in that field. The aggregation is added to every event, even events that were not used to generate the aggregation.

For example, you have 5 events and 3 of the events have the field you want to aggregate on. the `eventstats` command generates the aggregation based on the data in the 3 events. A new field is added to every event and the aggregation is added to that field in every event.

### Statistical functions that are not applied to specific fields

With the exception of the `count` function, when you pair the `eventstats` command with functions that are not applied to specific fields or `eval` expressions that resolve into fields, the search head processes it as if it were applied to a wildcard for all fields. In other words, when you have `| eventstats avg` in a search, it returns results for `| eventstats avg(*)`.

This "implicit wildcard" syntax is officially deprecated, however. Make the wildcard explicit. Write `| eventstats <function>(*)` when you want a function to apply to all possible fields.

### Functions and memory usage

Some functions are inherently more expensive, from a memory standpoint, than other functions. For example, the `distinct_count` function requires far more memory than the `count` function. The `values` and `list` functions also can consume a lot of memory.

If you are using the `distinct_count` function without a split-by field or with a low-cardinality split-by by field, consider replacing the `distinct_count` function with the the `estdc` function (estimated distinct count). The `estdc` function might result in significantly lower memory usage and run times.

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

When you use the `stats` and `eventstats` commands for ordering events based on time, use the `earliest` and `latest` functions.

The following search is the same as the previous search except the `first` and `last` functions are replaced with the `earliest` and `latest` functions.

index=test sourcetype=testDb
| eventstats latest(LastPass) AS LastPass, earliest(\_time) AS mostRecentTestTime
BY testCaseId
| where startTime==LastPass OR \_time==mostRecentTestTime
| stats latest(startTime) AS startTime, latest(status) AS status,
latest(histID) AS currentHistId, earliest(histID) AS lastPassHistId BY testCaseId

## Basic examples

### 1. Calculate the overall average duration

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Calculate the overall average duration of a set of transactions, and place the calculation in a new field called `avgdur`.

host=www1
| transaction clientip host maxspan=30s maxpause=5s
| eventstats avg(duration) AS avgdur

Because no BY clause is specified, a single aggregation is generated and added to every event in a new field called `avgdur` .

When you look at the list of Interesting Fields, you will see that `avgdur` has only one value.

![This image shows the list of Interesting Fields in Splunk Web with the avgdur field highlighted. Only one value is listed](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/5b2d8209-2230-4050-9317-e5eca335c13b?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1YjJkODIwOS0yMjMwLTQwNTAtOTMxNy1lNWVjYTMzNWMxM2IiLCJleHAiOjE3NjEwNjAxMDAsImp0aSI6ImM4Y2Y2YWUxZjQ3MDRmMzVhOWU4Njg0OTRlYmE3NmE0IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.3BmLr3tJqQKHGoJ4VWfwjUxK3GloG2nh4fBrfBloHrk)

### 2. Calculate the average duration grouped by a specific field

This example is the same as the previous example except that an average is calculated for each distinct value of the `date_minute` field. The new field `avgdur` is added to each event with the average value based on its particular value of `date_minute`.

host=www1
| transaction clientip host maxspan=30s maxpause=5s
| eventstats avg(duration) As avgdur BY date\_minute

When you look at the list of Interesting Fields, you will see that `avgdur` has 79 values, based on the timestamp, duration, and date\_minute values.

![This image shows the list of Interesting Fields in Splunk Web with the avgdur field highlighted. There are 79 separate values.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/79ccc957-5764-4f25-aea6-6f411b775b32?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3OWNjYzk1Ny01NzY0LTRmMjUtYWVhNi02ZjQxMWI3NzViMzIiLCJleHAiOjE3NjEwNjAxMDAsImp0aSI6IjcyN2FlYzgxY2E3MzRhODJiNzNiMDljNjkzZTNkZmE5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.L5J0mydUETRz8uGwO6oJ132i-i_8IHk2dhibE0da2ig)

### 3. Search for spikes in the volume of errors

This searches for spikes in error volume. You can use this search to trigger an alert if the count of errors is higher than average, for example.

eventtype="error" | eventstats avg(bytes) AS avg | where bytes>avg

## Extended example

The following example provides you with a better understanding of how the `eventstats` command works. This example is actually a progressive set of small examples, where one example builds on or extends the previous example.

It's much easier to see what the `eventstats` command does by showing you examples, using a set of simple events.

These examples use the `makeresults` command to create a set of events. The `streamstats` and `eval` commands are used to create additional fields in the events.

### Creating a set of events

Let's start by creating a set of four events. One of the events contains a null value in the `age` field.

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, null())
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")

* The `streamstats` command is used to create the `count` field. The `streamstats` command calculates a cumulative count for each event, at the time the event is processed.
* The `eval` command is used to create two new fields, `age` and `city`. The `eval` command uses the value in the count field.
* The `case` function takes pairs of arguments, such as `count=1, 25`. The first argument is a Boolean expression. When that expression is TRUE, the corresponding second argument is returned.

The results of the search look like this:

| \_time | age | city | count |
| --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | San Francisco | 3 |
| 2020-02-05 18:32:07 |  | Seattle | 4 |

### Using eventstats with a BY clause

The BY clause in the `eventstats` command is optional, but is used frequently with this command. The BY clause groups the generated statistics by the values in a field. You can use any of the statistical functions with the `eventstats` command to generate the statistics. See the [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

In this example, the `eventstats` command generates the average age for each city. The generated averages are placed into a new field called `avg(age)`.

The following search is the same as the previous search, with the `eventstats` command added at the end:

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, null())
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")
| eventstats avg(age) BY city

* For `San Francisco`, the average age is 28 = (25 + 31) / 2.
* For `Seattle`, there is only one event with a value. The average is 39 = 39 / 1. The `eventstats` command places that average in every event for Seattle, including events that did not contain a value for `age`.

The results of the search look like this:

| \_time | age | avg(age) | city | count |
| --- | --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | 28 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 | 39 | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | 28 | San Francisco | 3 |
| 2020-02-05 18:32:07 |  | 39 | Seattle | 4 |

### Renaming the new field

By default, the name of the new field that is generated is the name of the statistical calculation. In these examples, that name is `avg(age)`. You can rename the new field using the AS keyword.

In the following search, the `eventstats` command has been adjusted to rename the new field to `average age by city`.

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, null())
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")
| eventstats avg(age) AS "average age by city" BY city

The results of the search look like this:

| \_time | age | average age by city | city | count |
| --- | --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | 28 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 | 39 | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | 28 | San Francisco | 3 |
| 2020-02-05 18:32:07 |  | 39 | Seattle | 4 |

### Events with text values

The previous examples show how an event is processed that does not contain a value in the `age` field. Let's see how events are processed that contain an alphabetic character value in the field that you want to use to generate statistics .

The following search includes the word `test` as a value in the `age` field.

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, "test")
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")

The results of the search look like this:

| \_time | age | city | count |
| --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | San Francisco | 3 |
| 2020-02-05 18:32:07 | test | Seattle | 4 |

Let's add the `eventstats` command to the search.

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, "test")
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")
| eventstats avg(age) BY city

The alphabetic values are treated like null values. The results of the search look like this:

| \_time | age | avg(age) | city | count |
| --- | --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | 28 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 | 39 | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | 28 | San Francisco | 3 |
| 2020-02-05 18:32:07 | test | 39 | Seattle | 4 |

### Using the allnum argument

But suppose you don't want statistics generated when there are alphabetic characters in the field or the field is empty?

The `allnum` argument controls how the `eventstats` command processes field values. The default setting for the `allnum` argument is FALSE. Which means that the field used to generate the statistics does not need to contain all numeric values. Fields with empty values or alphabetic character values are ignored. You've seen this in the earlier examples.

You can force the `eventstats` command to generate statistics only when the fields contain all numeric values. To accomplish this, you can set the `allnum` argument to TRUE.

| makeresults count=4
| streamstats count
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, "test")
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle")
| eventstats allnum=true avg(age) BY city

The results of the search look like this:

| \_time | age | avg(age) | city | count |
| --- | --- | --- | --- | --- |
| 2020-02-05 18:32:07 | 25 | 28 | San Francisco | 1 |
| 2020-02-05 18:32:07 | 39 |  | Seattle | 2 |
| 2020-02-05 18:32:07 | 31 | 28 | San Francisco | 3 |
| 2020-02-05 18:32:07 | test |  | Seattle | 4 |

Because the `age` field contains values for Seattle that are not all numbers, the entire set of values for Seattle are ignored. No average is calculated.

The `allnum=true` argument applies to empty values as well as alphabetic character values.

## See also

Commands

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats)

Blogs

[Search commands > stats, eventstats and streamstats](https://www.splunk.com/blog/2014/04/01/search-command-stats-eventstats-and-streamstats-2.html)
