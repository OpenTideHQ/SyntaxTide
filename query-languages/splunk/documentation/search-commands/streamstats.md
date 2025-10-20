# streamstats

## Description

Adds cumulative summary statistics to all search results in a streaming manner. The `streamstats` command calculates statistics for each event at the time the event is seen. For example, you can calculate the running total for a particular field. The total is calculated by using the values in the specified field for every event that has been processed, up to the current event.

As the `streamstats` command processes each event, it adds a field to that event or result that represents the accumulation of all of the events before it in the time window. The value of that field changes per event or result as the composition of events in the window or result set changes. In other words, the `streamstats` command produces a running total that is applied to each event, or the result of another transforming search, as they stream in. The `streamstats` command operates on whatever search output it receives and is the accumulation of the average, sum, count or so on, of one the following two elements:

* All of the events in the search window that have been collected up to that point, if a window is applied. If you don't set the `time_window` or the `window` arguments, the default of 10,000 events set by the `max_stream_window` in the limits.conf file applies to your `streamstats` searches. See [Optional arguments](/en/?resourceId=Splunk_SearchReference_Streamstats).

* The results returned by a transforming command, such as the `stats`, `chart`, or `timechart` command, as each result is received and the running total of the events preceding that result is applied to it.

## Syntax

The required syntax is in bold.

streamstats

[reset\_on\_change=<bool>]

[reset\_before="("<eval-expression>")"]

[reset\_after="("<eval-expression>")"]

[current=<bool>]

[window=<int>]

[time\_window=<span-length>]

[global=<bool>]

[allnum=<bool>]

<stats-agg-term>...

[<by-clause>]

### Required arguments

stats-agg-term

Syntax: <stats-func>( <evaled-field> | <wc-field> ) [AS <wc-field>]

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#cfb366d5_7fbf_46ca_b614_5b32ffe85660__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names. For more information on eval expressions, see [Types of eval expressions](/en/?resourceId=Splunk_Search_Usetheevalcommandandfunctions) in the *Search Manual*.

### Optional arguments

allnum

Syntax: allnum=<boolean>

Description: If true, computes numerical statistics on each field only if all of the values in that field are numerical.

Default: false

by-clause

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

current

Syntax: current=<boolean>

Description: If true, the search includes the given, or current, event in the summary calculations. If false, the search uses the field value from the previous event.

Default: true

global

Syntax: global=<boolean>

Description: Used only when the `window` argument is set. Defines whether to use a single window, `global=true`, or to use separate windows based on the `by clause`. If `global=false` and `window` is set to a non-zero value, a separate window is used for each group of values of the field specified in the `by clause`.

Default: true

reset\_after

Syntax: reset\_after="("<eval-expression>")"

Description: After the streamstats calculations are produced for an event, `reset_after` specifies that all of the accumulated statistics are reset if the `eval-expression` returns `true`. The `eval-expression` must evaluate to true or false. The `eval-expression` can reference fields that are returned by the `streamstats` command. When the `reset_after` argument is combined with the `window` argument, the window is also reset when the accumulated statistics are reset.

Default: false

reset\_before

Syntax: reset\_before="("<eval-expression>")"

Description: Before the `streamstats` calculations are produced for an event, `reset_before` specifies that all of the accumulated statistics are reset when the `eval-expression` returns `true`. The `eval-expression` must evaluate to true or false. When the `reset_before` argument is combined with the `window` argument, the window is also reset when the accumulated statistics are reset.

Default: false

reset\_on\_change

Syntax: reset\_on\_change=<bool>

Description: Specifies that all of the accumulated statistics are reset when the group by fields change. The reset is as if no previous events have been seen. Only events that have all of the group by fields can trigger a reset. Events that have only some of the group by fields are ignored. When the `reset_on_change` argument is combined with the `window` argument, the window is also reset when the accumulated statistics are reset. See the Usage section.

Default: false

time\_window

Syntax: time\_window=<span-length>

Description: Specifies the window size for the `streamstats` calculations, based on time. After each time window passes, the `streamstats` calculations are reset.

The `time_window` argument is limited by range of values in the `_time` field in the events. To use the `time_window` argument, the events must be sorted in either ascending or descending time order. You can use the `window` argument with the `time_window` argument to specify the maximum number of events in a window. To specify five minutes for the span length, use `time_window=5m`. To specify 2 days, use `time_window=2d`.

The following table shows additional time ranges and valid values that you can set for the span length.

| Time range | Valid values |
| --- | --- |
| seconds | 1s, 2s, ... |
| minutes | 1m, 2m, … |
| hours | 1h,2h, … |
| days | 1d, 2d, ... |
| weeks | 1w, 2w, ... |
| months | 1mon, 2mon, 3mon, 4mon, 6mon, 12mon |
| quarters | 1q, 2q, 4q |
| years | 1y, 2y, ... |

Default: None. However, the value of the `max_stream_window` attribute in the `limits.conf` file applies. The default value is 10000 events.

window

Syntax: window=<integer>

Description: Specifies the number of events to use when computing the statistics.

Default: 0, which means that all previous and current events are used.

### Stats function options

stats-func

Syntax: The syntax depends on the function that you use. Refer to the table below.

Description: Statistical and charting functions that you can use with the `streamstats` command. Each time you invoke the `streamstats` command, you can use one or more functions. However, you can only use one `BY` clause. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#id_940594cd_2a36_4139_a23d_b2bdadf4bc43__Usage).

The following table lists the supported functions by type of function. Use the links in the table to see descriptions and examples for each function. For an overview about using functions with commands, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

| Type of function | Supported functions and syntax |  |  |  |
| --- | --- | --- | --- | --- |
| [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) | `avg()`   `count()`   `distinct_count()`  `estdc()`  `estdc_error()` | `exactperc<int>()`   `max()`   `median()`  `min()`  `mode()` | `perc<int>()`   `range()`   `stdev()`  `stdevp()` | `sum()`   `sumsq()`   `upperperc<int>()`  `var()`  `varp()` |
| [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) | `earliest()` | `first()` | `last()` | `latest()` |
| [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) | `list(X)` | `values(X)` |  |  |

## Usage

The `streamstats` command is a centralized streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The `streamstats` command is similar to the `eventstats` command except that it uses events before the current event to compute the aggregate statistics that are applied to each event. If you want to include the current event in the statistical calculations, use `current=true`, which is the default.

The `streamstats` command is also similar to the `stats` command in that `streamstats` calculates summary statistics on search results. Unlike `stats`, which works on the group of results as a whole, `streamstats` calculates statistics for each event at the time the event is seen.

### Statistical functions that are not applied to specific fields

With the exception of the `count` function, when you pair the `streamstats` command with functions that are not applied to specific fields or `eval` expressions that resolve into fields, the search head processes it as if it were applied to a wildcard for all fields. In other words, when you have `| streamstats avg` in a search, it returns results for `| stats avg(*)`.

This "implicit wildcard" syntax is officially deprecated, however. Make the wildcard explicit. Write `| streamstats <function>(*)` when you want a function to apply to all possible fields.

### Escaping string values

If your <eval-expression> contains a value instead of a field name, you must escape the quotation marks around the value.

The following example is a simple way to see this. Start by using the `makeresults` command to create 3 events. Use the `streamstats` command to produce a cumulative count of the events. Then use the `eval` command to create a simple test. If the value of the `count` field is equal to 2, display `yes` in the `test` field. Otherwise display `no` in the `test` field.

| makeresults count=3 | streamstats count | eval test=if(count==2,"yes","no")

The results appear something like this:

| \_time | count | test |
| --- | --- | --- |
| 2017-01-11 11:32:43 | 1 | no |
| 2017-01-11 11:32:43 | 2 | yes |
| 2017-01-11 11:32:43 | 3 | no |

Use the `streamstats` command to reset the count when the match is true. You must escape the quotation marks around the word `yes`. The following example shows the complete search.

| makeresults count=3 | streamstats count | eval test=if(count==2,"yes","no") | streamstats count as testCount reset\_after="("match(test,\"yes\")")"

Here is another example.
You want to look for the value `session is closed` in the description field. Because the value is a string, you must enclose it in quotation marks. You then need to escape those quotation marks.

... | streamstats reset\_after="("description==\"session is closed\"")"

### The `reset_on_change` argument

You have a dataset with the field "shift" that contains either the value DAY or the value NIGHT. You run this search:

...| streamstats count BY shift reset\_on\_change=true

If the dataset is:

shift

DAY

DAY

NIGHT

NIGHT

NIGHT

NIGHT

DAY

NIGHT

Running the command with `reset_on_change=true` produces the following streamstats results:

shift, count

DAY, 1

DAY, 2

NIGHT, 1

NIGHT, 2

NIGHT, 3

NIGHT, 4

DAY, 1

NIGHT, 1

### Memory and maximum results

The `streamstats` search processor uses two `limits.conf` settings to determine the maximum number of results that it can store in memory for the purpose of computing statistics.

The `maxresultrows` setting specifies a top limit for the `window` argument. This sets the number of result rows that the `streamstats` command processor can store in memory. The `max_mem_usage_mb` setting limits how much memory the `streamstats` command uses to keep track of information.

When the `max_mem_usage_mb` limit is reached, the `streamstats` command processor stops adding the requested fields to the search results.

Do not set `max_mem_usage_mb=0` as this removes the bounds to the amount of memory the `streamstats` command processor can use. This can lead to search failures.

Prerequisites

* Only users with file system access, such as system administrators, can increase the `maxresultrows` and `max_mem_usage_mb` settings using configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.
* You can have configuration files with the same name in your default, local, and app directories. Read [Where you can place (or find) your modified configuration files](/en/?resourceId=Splunk_Admin_Configurationfiledirectories) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

If you have Splunk Cloud Platform and want to change these limits, file a Support ticket.

## Basic examples

### 1. Compute the average of a field over the last 5 events

For each event, compute the average of the `foo` field over the last 5 events, including the current event.

... | streamstats avg(foo) window=5

This is similar to using the `trendline` command to compute a simple moving average (SMA), such as  `trendline sma5(foo)`.

### 2. Compute the average of a field, with a by clause, over the last 5 events

For each event, compute the average value of foo for each value of bar including only 5 events, specified by the window size, with that value of bar.

... | streamstats avg(foo) by bar window=5 global=f

### 3. For each event, add a count of the number of events processed

This example adds to each event a count field that represents the number of events seen so far, including that event. For example, it adds 1 for the first event, 2 for the second event, and so on.

... | streamstats count

If you did not want to include the current event, you would specify:

... | streamstats count current=f

### 4. Apply a time-based window to streamstats

Assume that the `max_stream_window` argument in the `limits.conf` file is the default value of 10000 events.

The following search counts the events, using a time window of five minutes.

... | streamstats count time\_window=5m

This search adds a count field to each event.

* If the events are in descending time order (most recent to oldest), the value in the count field represents the number of events in the next 5 minutes.
* If the events are in ascending time order (oldest to most recent), the count field represents the number of events in the previous 5 minutes.

If there are more events in the time-based window than the value for the `max_stream_window` argument, the `max_stream_window` argument takes precedence. The count will never be greater than 10000, even if there are actually more than 10,000 events in any 5 minute period.

## Extended examples

### 1. Create events for testing

You can use the `streamstats` command with the `makeresults` command to create a series events. This technique is often used for testing search syntax. The `eval` command is used to create events with different hours. You use 3600, the number of seconds in an hour, in the `eval` command.

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*3600)

The `makeresults` command is used to create the `count` field. The `streamstats` command calculates a cumulative count for each event, at the time the event is processed.

The results look something like this:

| \_time | count |
| --- | --- |
| 2020-01-09 15:35:14 | 1 |
| 2020-01-09 14:35:14 | 2 |
| 2020-01-09 13:35:14 | 3 |
| 2020-01-09 12:35:14 | 4 |
| 2020-01-09 11:35:14 | 5 |

Notice that the hours in the timestamp are 1 hour apart.

You can create additional fields by using the `eval` command.

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*3600)
| eval age = case(count=1, 25, count=2, 39, count=3, 31, count=4, 27, count=5, null())
| eval city = case(count=1 OR count=3, "San Francisco", count=2 OR count=4, "Seattle",count=5, "Los Angeles")

* The `eval` command is used to create two new fields, `age` and `city`. The `eval` command uses the value in the count field.
* The `case` function takes pairs of arguments, such as `count=1, 25`. The first argument is a Boolean expression. When that expression is TRUE, the corresponding second argument is returned.

The results of the search look like this:

| \_time | age | city | count |
| --- | --- | --- | --- |
| 2020-01-09 15:35:14 | 25 | San Francisco | 1 |
| 2020-01-09 14:35:14 | 39 | Seattle | 2 |
| 2020-01-09 13:35:14 | 31 | San Francisco | 3 |
| 2020-01-09 12:35:14 | 27 | Seattle | 4 |
| 2020-01-09 11:35:14 |  | Los Angeles | 5 |

### 2. Calculate a snapshot of summary statistics

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

You want to determine the number of the bytes used over a set period of time. The following search uses the first 5 events. Because search results typically display the most recent event first, the `sort` command is used to sort the 5 events in ascending order to see the oldest event first and the most recent event last. Ascending order enables the `streamstats` command to calculate statistics over time.

sourcetype=access\_combined\* | head 5 | sort \_time

![This image shows the most recent 5 events in the data set. The events are in ascending order by time.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/674325c3-c7cb-45a8-9ddc-9d09b8df2414?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI2NzQzMjVjMy1jN2NiLTQ1YTgtOWRkYy05ZDA5YjhkZjI0MTQiLCJleHAiOjE3NjEwNjAyMjIsImp0aSI6IjNhZTlhY2JkYTM1OTQxMjBiNGY4MWM1MTkwM2NmODViIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.Mu_U0FNgdjPIrB7UDRRxcW_traSv-vf7uMKgMS6MXQU)

Add the `streamstats` command to the search to generate a running total of the bytes over the 5 events and organize the results by `clientip`.

sourcetype=access\_combined\* | head 5 |sort \_time | streamstats sum(bytes) AS ASimpleSumOfBytes BY clientip

When you click on the `ASimpleSumOfBytes` field in the list of Interesting fields, an information window shows the cumulative sum of the bytes, as shown in this image:

![This image shows the ASimpleSumOfBytes field selected in the list of Interesting fields. A popup window shows the cumulative sum of the bytes.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ea5edb69-5fb2-4276-bd19-4229da4d75ac?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlYTVlZGI2OS01ZmIyLTQyNzYtYmQxOS00MjI5ZGE0ZDc1YWMiLCJleHAiOjE3NjEwNjAyMjIsImp0aSI6ImI0ZGEwMWM5ZTgzNzQwMTU5MzJlOTA1NWY1ZDVmN2I4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ._S1ir5bbMCciVxpekzZKnBvQpRlFQXt-5lczb_Ybqv8)

The `streamstats` command aggregates the statistics to the original data, which means that all of the original data is accessible for further calculations.

Add the `table` command to the search to display the only the values in the `_time`, `clientip`, `bytes`, and `ASimpleSumOfBytes` fields.

sourcetype=access\_combined\* | head 5 |sort \_time | streamstats sum(bytes) as ASimpleSumOfBytes by clientip | table \_time, clientip, bytes, ASimpleSumOfBytes

Each event shows the timestamp for the event, the clientip, and the number of `bytes` used. The `ASimpleSumOfBytes` field shows a cumulative summary of the bytes for each `clientip`.

![This image shows the Statistics tab with the columns _time, clientip, bytes, ASimpleSumOfBytes.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/aca01c1f-5da2-4029-8c4b-b47a5e62625d?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJhY2EwMWMxZi01ZGEyLTQwMjktOGM0Yi1iNDdhNWU2MjYyNWQiLCJleHAiOjE3NjEwNjAyMjIsImp0aSI6ImE5OGVmY2VmMDFmOTQ0MWQ4MWI3MWQ3NDMyYjVmMWMyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.TpEyEKkFh7ZFmEfXknkV9T_hgPpeLKbkN075KgxS6Kg)

### 3. Calculate the running total of distinct users over time

Each day you track unique users, and you would like to track the cumulative count of distinct users. This example calculates the running total of distinct users over time.

eventtype="download" | bin \_time span=1d as day | stats values(clientip) as ips dc(clientip) by day | streamstats dc(ips) as "Cumulative total"

The `bin` command breaks the time into days. The `stats` command calculates the distinct users (clientip) and user count per day. The `streamstats` command finds the running distinct count of users.

This search returns a table that includes: `day`, `ips`, `dc(clientip)`, and `Cumulative total`.

### 4. Calculate hourly cumulative totals

This example uses `streamstats` to produce hourly cumulative totals.

... | timechart span=1h sum(bytes) as SumOfBytes | streamstats global=f sum(\*) as accu\_total\_\*

This search returns 3 columns: \_time, SumOfBytes, and accu\_total\_SumOfBytes.

The `timechart` command buckets the events into spans of 1 hour and counts the total values for each category. The `timechart` command also fills NULL values, so that there are no missing values. Then, the `streamstats` command is used to calculate the accumulated total.

This example uses `streamstats` to produce hourly cumulative totals for category values.

... | timechart span=1h sum(value) as total by category | streamstats global=f | addtotals | accum Total | rename Total as accu\_total

### 5. Calculate when a DHCP IP lease address changed for a specific MAC address

This example uses `streamstats` to figure out when a DHCP IP lease address changed for a MAC address, 54:00:00:00:00:00.

source=dhcp MAC=54:00:00:00:00:00 | head 10 | streamstats current=f last(DHCP\_IP) as new\_dhcp\_ip last(\_time) as time\_of\_change by MAC

You can also clean up the presentation to display a table of the DHCP IP address changes and the times the occurred.

source=dhcp MAC=54:00:00:00:00:00 | head 10 | streamstats current=f last(DHCP\_IP) as new\_dhcp\_ip last(\_time) as time\_of\_change by MAC | where DHCP\_IP!=new\_dhcp\_ip | convert ctime(time\_of\_change) as time\_of\_change | rename DHCP\_IP as old\_dhcp\_ip | table time\_of\_change, MAC, old\_dhcp\_ip, new\_dhcp\_ip

For more details, refer to [the Splunk Blogs post](http://blogs.splunk.com/2013/10/31/streamstats-example/) for this example.

### 6. Compare a number with itself over a few months

Say a community needs to find out how their vaccination booster campaign is going. They want to check the gap after their citizens get the second booster shot, which should keep up with their target of about 6 months between the second and third doses. The following search is across the daily number of people by number of doses.

... | sort \_time
| streamstats time\_window=153d earliest(two\_doses) as two\_doses\_5mon
| streamstats time\_window=183d earliest(two\_doses) as two\_doses\_6mon
| streamstats time\_window=214d earliest(two\_doses) as two\_doses\_7mon
| foreach two\_doses\_\* [ eval booster\_gap\_<<MATCHSTR>> = <<FIELD>> - three\_doses ]
| timechart span=1d max(booster\_gap\_\*) as booster\_gap\_\*

The search results return a graph that looks something like this, with 3 lines for the second booster showing the gap at 5 months, 6 months, and 7 months, which shows that the community is almost keeping up with a 6-month booster gap:

![Graph with population on the Y axis from -5 million to 20 million, and the Y axis shows months from July 5 to November 22. The orange line shows that the 7 month booster gap starts from population 0, is flat until November 8 when the line drops to just slightly above -5 million after November 22. The next line, the green line, shows that the 6 month booster gap starts from population 0 and gradually rises until it is just above 5 million after November 22. The top line, the blue line, starts at population 0 and gradually increases to about 5 million in the end of September, and then steeply increases to just above 20 million after November 22.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/4078f62a-5baf-4b72-8f44-f6f75eaa6a16?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0MDc4ZjYyYS01YmFmLTRiNzItOGY0NC1mNmY3NWVhYTZhMTYiLCJleHAiOjE3NjEwNjAyMjIsImp0aSI6ImNlNjkyMTI1MjIxZDRlOWZhODJmMTBkNTM3MWFmZDRhIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.2AScZOg7WJjpv9PZBRTNyn_W-3aQ4XOxOvUlZhsDkCc)

## See also

Commands

[accum](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/accum#id_4a21595d_149b_464e_9ba0_b35d9336654c__accum)

[autoregress](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/autoregress#id_6c11d555_ad43_4b23_b0a4_0bd64d538fa3__autoregress)

[delta](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/delta#aea489ea_dd56_4a9e_a42e_a6f865ed8c88__delta)

[fillnull](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fillnull#ea500f11_dc13_4c3b_bb16_32e3345d99f7__fillnull)

[eventstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#d50b254f_0c46_4fb9_8fed_a8a94363a53c__eventstats)

[makeresults](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makeresults#ddcd3bee_0938_4097_8a43_4f6bf0ea9aa2__makeresults)

[trendline](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/trendline#id_1985bcca_9e84_45c1_877c_68cb1b56e716__trendline)

Blogs

[Getting started with stats, eventstats and streamstats](https://www.splunk.com/blog/2014/04/01/search-command-stats-eventstats-and-streamstats-2.html)
