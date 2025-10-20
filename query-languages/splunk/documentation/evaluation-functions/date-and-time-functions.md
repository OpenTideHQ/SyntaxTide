# Date and Time functions

The following list contains the functions that you can use to calculate dates and time.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

In addition to the functions listed in this topic, there are also variables and modifiers that you can use in searches.

* [Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables)
* [Time modifiers](/en/?resourceId=Splunk_SearchReference_SearchTimeModifiers)

## now()

### Description

This function takes no arguments and returns the time that the search was started.

### Usage

The `now()` function is often used with other data and time functions.

The time returned by the `now()` function is represented in UNIX time, or in seconds since Epoch time.

When used in a search, this function returns the UNIX time when the search is run. If you want to return the UNIX time when each result is returned, use the `time()` function instead.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

The following example determines the UNIX time value of the start of yesterday, based on the value of `now()`. This example uses a "snap-to" time modifier to snap to the start of the day. See [How to specify relative time modifiers](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/time-modifiers#f6b51910_831b_4b80_9728_343ed65e2b80__How_to_specify_relative_time_modifiers).

... | eval n=relative\_time(now(), "-1d@d")

### Extended example

If you are looking for events that occurred within the last 30 minutes you need to calculate the event hour, event minute, the current hour, and the current minute. You use the `now()` function to calculate the current hour (curHour) and current minute (curMin). The event timestamp, in the `_time` field, is used to calculate the event hour (eventHour) and event minute (eventMin). For example:

... earliest=-30d
| eval eventHour=strftime(\_time,"%H")
| eval eventMin=strftime(\_time,"%M")
| eval curHour=strftime(now(),"%H")
| eval curMin=strftime(now(),"%M")
| where (eventHour=curHour and eventMin > curMin - 30) or
(curMin < 30 and eventHour=curHour-1 and eventMin>curMin+30)
| bucket \_time span=1d
| chart count by \_time

## relative\_time(<time>,<specifier>)

### Description

This function takes a UNIX time as the first argument and a relative time specifier as the second argument and returns the UNIX time value of <specifier> applied to <time>.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example determines the UNIX time value of the start of yesterday, based on the value of `now()`. This example uses a "snap-to" time modifier to snap to the the start of the day. See [How to specify relative time modifiers](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/time-modifiers#f6b51910_831b_4b80_9728_343ed65e2b80__How_to_specify_relative_time_modifiers).

... | eval n=relative\_time(now(), "-1d@d")

The following example specifies an earliest time of 2 hours ago snapped to the hour and a latest time of 1 hour ago snapped to the hour. The offset `-2h` is processed first, followed by the snap-to time `@h`.

... | where \_time>relative\_time(now(), "-2h@h") AND \_time<relative\_time(now(), "-1h@h")

## strftime(<time>,<format>)

### Description

This function takes a UNIX time value as the first argument and renders the time as a string using the format specified. The UNIX time must be in seconds. Use the first 10 digits of a UNIX time to use the time in seconds.

You can use time format variables with the `strftime` function. For a complete list and descriptions of the format options, see
[Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables).

### Usage

If the time is in milliseconds, microseconds, or nanoseconds you must convert the time into seconds. You can use the `pow` function to convert the number.

* To convert from milliseconds to seconds, divide the number by 1000 or 10^3.
* To convert from microseconds to seconds, divide the number by 10^6.
* To convert from nanoseconds to seconds, divide the number by 10^9.

The following search uses the `pow` function to convert from nanoseconds to seconds:

| makeresults | eval StartTimestamp="1521467703049000000"| eval starttime=strftime(StartTimestamp/pow(10,9),"%Y-%m-%dT%H:%M:%S.%Q")

The results appear on the Statistics tab and look like this:

| StartTimeStamp | \_time | starttime |
| --- | --- | --- |
| 1521467703049000000 | 2018-08-10 09:04:00 | 2018-03-19T06:55:03.049 |

In these results, the `_time` value is the date and time when the search was run.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example returns the hour and minute from the `_time` field.

...| eval hour\_min=strftime(\_time, "%H:%M")

If the `_time` field value is `2022-08-10 11:48:23`, the value returned in the `hour_min` field is `11:48`.

The following example creates a new field called `starttime` in your search results. For the `strftime`values, the `now()` function is used to generate the current UNIX time and date and time variables are used to specify the ISO 8601 timestamp format;

...| eval starttime=strftime(now(),"%Y-%m-%dT%H:%M:%S.%Q")

The results look something like this:

| \_starttime |
| --- |
| 2022-02-11T01:55:00.000 |

For more information about date and time variables, see [Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables).

### Extended example

The following example creates a single result using the `makeresults` command.

| makeresults

For example:

| \_time |
| --- |
| 2022-08-14 14:00:15 |

The `_time` field is stored in UNIX time, even though it displays in a human readable format. To convert the UNIX time to some other format, you use the `strftime` function with the date and time format variables. The variables must be in quotations marks.

For example, to return the week of the year that an event occurred in, use the `%V` variable.

| makeresults | eval week=strftime(\_time,"%V")

The results show that August 14th occurred in week `33`.

| \_time | week |
| --- | --- |
| 2022-08-14 14:00:15 | 33 |

To return the date and time with subseconds and the time designator (the letter T) that precedes the time components of the format, use the `%Y-%m-%dT%H:%M:%S.%Q` variables. For example:

| makeresults | eval mytime=strftime(\_time,"%Y-%m-%dT%H:%M:%S.%Q")

The results are:

| \_time | mytime |
| --- | --- |
| 2022-08-14 14:00:15 | 2022-08-14T14:00:15.000 |

## strptime(<str>,<format>)

### Description

This function takes a time represented by a string and parses the time into a UNIX timestamp format. You use date and time variables to specify the format that matches string. For a complete list and descriptions of the variables, see [Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables).

The `strptime` function doesn't work with timestamps that consist of only a month and year. The timestamps must include a day.

For example, if string X is `2022-08-13 11:22:33`, the format Y must be `%Y-%m-%d %H:%M:%S` . The string X date must be January 1, 1971 or later. The `strptime` function takes any date from January 1, 1971 or later, and calculates the UNIX time, in seconds, from January 1, 1970 to the date you provide.

Note: The `_time` field is in UNIX time. In Splunk Web, the `_time` field appears in a human readable format in the UI but is stored in UNIX time. If you attempt to use the `strptime` function on the `_time` field, no action is performed on the values in the field.

### Usage

With the `strptime` function, you must specify the time format of the string so that the function can convert the string time into the correct UNIX time. The following table shows some examples:

| String time | Matching time format variables |
| --- | --- |
| `Mon July 23 2022 17:19:01.89` | `%a %B %d %Y %H:%M:%S.%N` |
| `Mon 7/23/2022 17:19:01.89` | `%a %m/%d/%Y %H:%M:%S.%N` |
| `2022/07/23 17:19:01.89` | `%Y/%m/%d %H:%M:%S.%N` |
| `2022-07-23T17:19:01.89` | `%Y-%m-%dT%H:%M:%S.%N` |

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

If the values in the `timeStr` field are hours and minutes, such as `11:59`, the following example returns the time as a timestamp:

... | eval n=strptime(timeStr, "%H:%M")

### Extended example

This example shows the results of using the `strptime` function. The following search does several things:

* The `gentimes` command generates a set of times with 6 hour intervals. This command returns four fields: `startime`, `starthuman`, `endtime`, and `endhuman`.
* The `fields` command returns only the `starthuman` and `endhuman` fields.
* The `eval` command takes the string time values in the `starthuman` field and returns the UNIX time that corresponds to the string time values.

| gentimes start=8/13/18 increment=6h
| fields starthuman endhuman
| eval startunix=strptime(starthuman,"%a %B %d %H:%M:%S.%N %Y")

The results appear on the Statistics tab and look something like this:

| starthuman | endhuman | startunix |
| --- | --- | --- |
| Mon Aug 13 00:00:00 2018 | Mon Aug 13 05:59:59 2018 | 1534143600.000000 |
| Mon Aug 13 06:00:00 2018 | Mon Aug 13 11:59:59 2018 | 1534165200.000000 |
| Mon Aug 13 12:00:00 2018 | Mon Aug 13 17:59:59 2018 | 1534186800.000000 |
| Mon Aug 13 18:00:00 2018 | Mon Aug 13 23:59:59 2018 | 1534208400.000000 |
| Tue Aug 14 00:00:00 2018 | Tue Aug 14 05:59:59 2018 | 1534230000.000000 |
| Tue Aug 14 06:00:00 2018 | Tue Aug 14 11:59:59 2018 | 1534251600.000000 |
| Tue Aug 14 12:00:00 2018 | Tue Aug 14 17:59:59 2018 | 1534273200.000000 |
| Tue Aug 14 18:00:00 2018 | Tue Aug 14 23:59:59 2018 | 1534294800.000000 |

## time()

### Description

This function returns the wall-clock time, in the UNIX time format, with microsecond resolution.

### Usage

The value of the `time()` function will be different for each event, based on when that event was processed by the `eval` command.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example shows the results of using the `time()` function. The following search does several things:

* The `gentimes` command generates a set of times with 6 hour intervals. This command returns four fields: `startime`, `starthuman`, `endtime`, and `endhuman`.
* The `fields` command returns only the `startime` and `starthuman` fields.
* The first `eval` command takes the numbers in the `starttime` field and returns them with microseconds included.
* The second `eval` command creates the `testtime` field and returns the UNIX time at the instant the result was processed by the `eval` command.

| gentimes start=8/13/18 increment=6h
| fields starttime starthuman
| eval epoch\_time=strptime(starttime,"%s")
| eval testtime=time()

The results appear on the Statistics tab and look something like this:

| starttime | starthuman | epoch\_time | testtime |
| --- | --- | --- | --- |
| 1534143600 | Mon Aug 13 00:00:00 2018 | 1534143600.000000 | 1534376565.299298 |
| 1534165200 | Mon Aug 13 06:00:00 2018 | 1534165200.000000 | 1534376565.299300 |
| 1534186800 | Mon Aug 13 12:00:00 2018 | 1534186800.000000 | 1534376565.299302 |
| 1534208400 | Mon Aug 13 18:00:00 2018 | 1534208400.000000 | 1534376565.299304 |
| 1534230000 | Tue Aug 14 00:00:00 2018 | 1534230000.000000 | 1534376565.299305 |
| 1534251600 | Tue Aug 14 06:00:00 2018 | 1534251600.000000 | 1534376565.299306 |
| 1534273200 | Tue Aug 14 12:00:00 2018 | 1534273200.000000 | 1534376565.299308 |
| 1534294800 | Tue Aug 14 18:00:00 2018 | 1534294800.000000 | 1534376565.299309 |

Notice the difference in the microseconds between the values in the `epoch_time` and `test_time` fields. You can see that the `test_time` values increase with each result.
