# Statistical and charting functions

You can use the statistical and charting functions with the
`chart`,
`stats`, and
`timechart` commands.

## Support for related commands

The functions can also be used with related statistical and charting commands. The following table lists the commands supported by the statistical and charting functions and the related command that can also use these functions.

| Command | Supported related commands |
| --- | --- |
| `chart` | * `sichart` |
| `stats` | * `eventstats` * `streamstats` * `geostats` * `sistats` * For the `tstats` and the `mstats` commands, see the documentation for each command for a list of the supported functions. |
| `timechart` | * `sitimechart` |

Functions that you can use to create sparkline charts are noted in the documentation for each function. Sparkline is a function that applies to only the `chart` and `stats` commands, and allows you to call other functions. For more information, see [Add sparklines to search results](/en/?resourceId=Splunk_Search_Addsparklinestosearchresults) in the *Search Manual*.

## How field values are processed

Most of the statistical and charting functions expect the field values to be numbers. All of the values are processed as numbers, and any non-numeric values are ignored.

The following functions process the field values as literal string values, even though the values are numbers.

|  |  |  |  |
| --- | --- | --- | --- |
| * `count` * `distinct_count` * `earliest` | * `estdc` * `estdc_error` * `first` | * `latest` * `last` * `list` | * `max` * `min` * `mode` * `values` |

For example, you use the `distinct_count` function and the field contains values such as "1", "1.0", and "01". Each value is considered a distinct string value.

The only exceptions are the `max` and `min` functions. These functions process values as numbers if possible. For example, the values "1", "1.0", and "01" are processed as the same numeric value.

## Supported functions and syntax

There are two ways that you can see information about the supported statistical and charting functions:

* [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

### Function list by category

The following table is a quick reference of the supported statistical and charting functions, organized by category. This table provides a brief description for each functions. Use the links in the table to learn more about each function and to see examples.

| Type of function | Supported functions and syntax | Description |
| --- | --- | --- |
| [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) | `avg(<value>)` | Returns the average of the values in the field specified. |
| `count(<value>)` | Returns the number of occurrences where the field that you specify contains any value (is not empty). You can also count the occurrences of a specific value in the field by using the `eval` command with the `count` function. For example: `count( eval(field_name="value"))`. |
| `distinct_count(<value>)` | Returns the count of distinct values in the field specified. |
| `estdc(<value>)` | Returns the estimated count of the distinct values in the field specified. |
| `estdc_error(<value>)` | Returns the theoretical error of the estimated count of the distinct values in the field specified. The error represents a ratio of the `absolute_value(estimate_distinct_count - real_distinct_count)/real_distinct_count`. |
| `exactperc<percentile>(<value>)` | Returns a percentile value of the numeric field specified. Provides the exact value, but is very resource expensive for high cardinality fields. An alternative is `perc`. |
| `max(<value>)` | Returns the maximum value in the field specified. If the field values are non-numeric, the maximum value is found using lexicographical ordering. This function processes field values as numbers if possible, otherwise processes field values as strings. |
| `mean(<value>)` | Returns the arithmetic mean of the values in the field specified. |
| `median(<value>)` | Returns the middle-most value of the values in the field specified. |
| `min(<value>)` | Returns the minimum value in the field specified. If the field values are non-numeric, the minimum value is found using lexicographical ordering. |
| `mode(<value>)` | Returns the most frequent value in the field specified. |
| `percentile<percentile>(<value>)` | Returns the N-th percentile value of all the values in the numeric field specified. Valid field values are integers from 1 to 99.    Additional percentile functions are `upperperc<percentile>(<value>)` and `exactperc<percentile>(<value>)`. |
| `range(<value>)` | If the field values are numeric, returns the difference between the maximum and minimum values in the field specified. |
| `stdev(<value>)` | Returns the sample standard deviation of the values in the field specified. |
| `stdevp(<value>)` | Returns the population standard deviation of the values in the field specified. |
| `sum(<value>)` | Returns the sum of the values in the field specified. |
| `sumsq(<value>)` | Returns the sum of the squares of the values in the field specified. |
| `upperperc<percentile>(<value>)` | Returns an approximate percentile value, based on the requested percentile of the numeric field.    When there are more than 1000 values, the upperperc function gives the approximate upper bound for the percentile requested. Otherwise the upperperc function returns the same percentile as the `perc` function. |
| `var(<value>)` | Returns the sample variance of the values in the field specified. |
| `varp(<value>)` | Returns the population variance of the values in the field specified. |
| [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) | `first(<value>` | Returns the first seen value in a field. In general, the first seen value of the field is the most recent instance of this field, relative to the input order of events into the stats command. |
| `last(<value>)` | Returns the last seen value in a field. In general, the last seen value of the field is the oldest instance of this field relative to the input order of events into the stats command. |
| [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) | `list(<value>)` | Returns a list of up to 100 values in a field as a multivalue entry. The order of the values reflects the order of input events. |
| `values(<value>)` | Returns the list of all distinct values in a field as a multivalue entry. The order of the values is lexicographical. |
| [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) | `earliest(<value>)` | Returns the chronologically earliest (oldest) seen occurrence of a value in a field. |
| `earliest_time(<value>)` | Returns the UNIX time of the earliest (oldest) occurrence of a value of the field. Used in conjunction with the `earliest`, `latest`, and `latest_time` functions to calculate the rate of increase for an accumulating counter. |
| `latest(<value>)` | Returns the chronologically latest (most recent) seen occurrence of a value in a field. |
| `latest_time(<value>)` | Returns the UNIX time of the latest (most recent) occurrence of a value of the field. Used in conjunction with the `earliest`, `earliest_time`, and `latest` functions to calculate the rate of increase for an accumulating counter. |
| `per_day(<value>)` | Returns the values in a field or eval expression for each day. |
| `per_hour(<value>)` | Returns the values in a field or eval expression for each hour. |
| `per_minute(<value>)` | Returns the values in a field or eval expression for each minute. |
| `per_second(<value>)` | Returns the values in a field or eval expression for each second. |
| `rate(<value>)` | Returns the per-second rate change of the value of the field. Represents `(latest - earliest) / (latest_time - earliest_time)` Requires the `earliest` and `latest` values of the field to be numerical, and the `earliest_time` and `latest_time` values to be different. |
| `rate_avg(<value>)` | Returns the average rates for the time series associated with a specified accumulating counter metric. |
| `rate_sum(<value>)` | Returns the summed rates for the time series associated with a specified accumulating counter metric. |

### Alphabetical list of functions

The following table is a quick reference of the supported statistical and charting functions, organized alphabetically. This table provides a brief description for each function. Use the links in the table to learn more about each function and to see examples.

| Supported functions and syntax | Description | Type of function |
| --- | --- | --- |
| `avg(<value>)` | Returns the average of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `count(<value>)` | Returns the number of occurrences where the field that you specify contains any value (is not empty). You can also count the occurrences of a specific value in the field by using the `eval` command with the `count` function. For example: `count(eval(field_name="value"))`. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `distinct_count(<value)` | Returns the count of distinct values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `earliest(<value>)` | Returns the chronologically earliest (oldest) seen occurrence of a value in the field specified. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `earliest_time(<value>)` | Returns the UNIX time of the earliest (oldest) occurrence of a value in the field specified. Used in conjunction with the `earliest`, `latest`, and `latest_time` functions to calculate the rate of increase for an accumulating counter. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `estdc(<value>)` | Returns the estimated count of the distinct values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `estdc_error(<value>)` | Returns the theoretical error of the estimated count of the distinct values in the field specified. The error represents a ratio of the `absolute_value(estimate_distinct_count - real_distinct_count)/real_distinct_count`. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `exactperc<percentile>(<value>)` | Returns a percentile value for the numeric field specified. Provides the exact value, but is very resource expensive for high cardinality fields. An alternative is `perc`. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `first(<value>)` | Returns the first seen value in a field. In general, the first seen value of the field is the most recent instance of this field, relative to the input order of events into the stats command. | [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) |
| `last(<value>)` | Returns the last seen value in a field. In general, the last seen value of the field is the oldest instance of this field relative to the input order of events into the stats command. | [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) |
| `latest(<value>)` | Returns the chronologically latest (most recent) seen occurrence of a value in a field. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `latest_time(<value>)` | Returns the UNIX time of the latest (most recent) occurrence of a value of the field. Used in conjunction with the `earliest`, `earliest_time`, and `latest` functions to calculate the rate of increase for an accumulating counter. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `list(<value>)` | Returns a list of up to 100 values in a field as a multivalue entry. The order of the values reflects the order of input events. | [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) |
| `max(<value>)` | Returns the maximum value in the field specified. If the field values are non-numeric, the maximum value is found using lexicographical ordering. This function processes field values as numbers if possible, otherwise processes field values as strings. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `mean(<value>)` | Returns the arithmetic mean of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `median(<value>)` | Returns the middle-most value of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `min(<value>)` | Returns the minimum value in the field specified. If the field values are non-numeric, the minimum value is found using lexicographical ordering. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `mode(<value>)` | Returns the most frequent value in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `perc<percentile>(<value>)` | Returns the N-th percentile value of all the values in the numeric field specified. Valid field values are integers from 1 to 99.    Additional percentile functions are `upperperc` and `exactperc`. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `per_day(<value>)` | Returns the values in a field or eval expression for each day. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `per_hour(<value>)` | Returns the values in a field or eval expression for each hour. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `per_minute(<value>)` | Returns the values in a field or eval expression for each minute. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `per_second(<value>)` | Returns the values in a field or eval expression for each second. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `range(<value>)` | If the field values are numeric, returns the difference between the maximum and minimum values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `rate(<value>)` | Returns the per-second rate change of the value of the field. Represents `(latest - earliest) / (latest_time - earliest_time)` Requires the `earliest` and `latest` values of the field to be numerical, and the `earliest_time` and `latest_time` values to be different. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `rate_avg(<value>)` | Returns the average rates for the time series associated with a specified accumulating counter metric. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `rate_sum(<value>)` | Returns the summed rates for the time series associated with a specified accumulating counter metric. | [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) |
| `stdev(<value>)` | Returns the sample standard deviation of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `stdevp(<value>)` | Returns the population standard deviation of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `sum(<value>)` | Returns the sum of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `sumsq(<value>)` | Returns the sum of the squares of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `upperperc<percentile>(<value>)` | Returns an approximate percentile value, based on the requested percentile of the numeric field.    When there are more than 1000 values, the upperperc function gives the approximate upper bound for the percentile requested. Otherwise the upperperc function returns the same percentile as the `perc` function. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `values(<value>)` | Returns the list of all distinct values in a field as a multivalue entry. The order of the values is lexicographical. | [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) |
| `var(<value>)` | Returns the sample variance of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |
| `varp(<value>)` | Returns the population variance of the values in the field specified. | [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) |

## See also

Commands

[chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart)

[geostats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geostats#b15723e5_eb2a_484e_814b_4a5c3ef3c899__geostats)

[eventstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#d50b254f_0c46_4fb9_8fed_a8a94363a53c__eventstats)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats)

[timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart)

Functions

[Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions)

## Answers

Have questions? Visit [Splunk Answers](http://splunk-base.splunk.com) and search for a specific function or command.
