# Time modifiers

Use time modifiers to customize the time range of a search or change the format of the timestamps in the search results.

## Searching the \_time field

When an event is processed by Splunk software, its timestamp is saved as the default field `_time`. This timestamp, which is the time when the event occurred, is saved in UNIX time notation. Searching with relative time modifiers, `earliest` or `latest`, finds every event with a timestamp beginning, ending, or between the specified timestamps.

For example, when you search for `earliest=@d`, the search finds every event with a `_time` value since midnight. This example uses `@d`, which is a date format variable. See [Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables).

### Time modifiers and the Time Range Picker

When you use a time modifier in the SPL syntax, that time overrides the time specified in the Time Range Picker.

For example, suppose your search uses `yesterday` in the Time Range Picker. You add the time modifier `earliest=-2d` to your search syntax. The search uses the time specified in the time modifier and ignores the time in the Time Range Picker. Because the search does not specify the `latest` time modifier, the default value `now` is used for `latest`.

For more information, see [Specify time modifiers in your search](/en/?resourceId=Splunk_Search_Specifytimemodifiersinyoursearch) in the *Search Manual*.

### Time ranges and subsearches

Time ranges selected from the Time Range Picker apply to the base search and to subsearches.

However, time ranges specified directly in the base search do not apply to subsearches. Likewise, a time range specified directly in a subsearch applies only to that subsearch. The time range does not apply to the base search or any other subsearch.

For example, if the Time Range Picker is set to Last 7 days and a subsearch contains `earliest=2d@d`, then the earliest time modifier applies only to the subsearch and Last 7 days applies to the base search.

### Searching based on index time

You also have the option of searching for events based on when they were indexed. The UNIX time is saved in the `_indextime` field. Similar to `earliest` and `latest` for the `_time` field, you can use the relative time modifiers `_index_earliest` and `_index_latest` to search for events based on `_indextime`. For example, if you wanted to search for events indexed in the previous hour, use: `_index_earliest=-h@h _index_latest=@h`.

Note: When using index-time based modifiers such as `_index_earliest` and `_index_latest`, your search must also have an event-time window which will retrieve the events. In other words, chunks of events might be ruled out based on the non index-time window as well as the index-time window. To be certain of retrieving every event based on index-time, you must run your search using All Time.

## List of time modifiers

Use the `earliest` and `latest` modifiers to specify custom and relative time ranges. You can specify an exact time such as `earliest="10/5/2016:20:00:00"`, or a relative time such as `earliest=-h` or `latest=@w6`.

When specifying relative time, you can use the `now` modifier to refer to the current time.

| Modifier | Syntax | Description |
| --- | --- | --- |
| earliest | `earliest=[+|-]` `<time_integer><time_unit>@<time_unit>` | Specify the earliest \_time for the time range of your search.    Use `earliest=1` to specify the UNIX epoch time 1, which is UTC January 1, 1970 at 12:00:01 AM.  Use `earliest=0` to specify the earliest event in your data. |
| \_index\_earliest | `_index_earliest=[+|-]` `<time_integer><time_unit>@<time_unit>` | Specify the earliest \_indextime for the time range of your search. |
| \_index\_latest | `_index_latest=[+|-]` `<time_integer><time_unit>@<time_unit>` | Specify the latest \_indextime for the time range of your search. |
| latest | `latest=[+|-]` `<time_integer><time_unit>@<time_unit>` | Specify the latest time for the \_time range of your search. |
| now | `now()` or `now` | Refers to the current time. If set to earliest, now() is the start of the search. |
| time | `time()` | In real-time searches, time() is the current machine time. |

For more information about customizing your search window, see [Specify real-time time range windows in your search](/en/?resourceId=Splunk_Search_Specifyrealtimewindowsinyoursearch) in the *Search Manual*.

## How to specify relative time modifiers

You can define the relative time in your search with a string of characters that indicate time amount (integer and unit). You can also specify a "snap to" time unit, which is specified with the @ symbol followed by a time unit.

The syntax for using time modifiers is `[+|-]<time_integer><time_unit>@<time_unit>`

The steps to specify a relative time modifier are:

1. Indicate the time offset from the current time.
2. Define the time amount, which is a number and a unit.
3. Specify a "snap to" time unit. The time unit indicates the nearest or latest time to which your time amount rounds down.

When a relative time modifier is processed, the offset is processed first, followed by the snap-to time. For example, if the
relative time modifier is `-2h@h` the offset `-2h`is processed first. Then the snap-to time `@h` is processed.

### Indicate the time offset

Begin your time offset with a plus (+) or minus (-) to indicate the offset from the current time.

### Define the time amount

Define your time amount with a number and a time unit. The supported time units are listed in the following table:

| Time unit | Valid unit abbreviations |
| --- | --- |
| subseconds | microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |
| second | s, sec, secs, second, seconds |
| minute | m, min, mins, minute, minutes |
| hour | h, hr, hrs, hour, hours |
| day | d, day, days |
| week | w, week, weeks |
| month | mon, month, months |
| quarter | q, qtr, qtrs, quarter, quarters |
| year | y, yr, yrs, year, years |

For example, to start your search an hour ago, use either of the following time modifiers.

`earliest=-h`

or

`earliest=-60m`

When specifying single time amounts, the number one is implied. An 's' is the same as '1s', 'm' is the same as '1m', 'h' is the same as '1h', and so forth.

Note: Subsecond time units such as `ms` can be used in metrics searches only when they are searching over metrics indexes that are enabled for millisecond timestamp resolution.

For more information about enabling metrics indexes to index metric data points with millisecond timestamp precision:

* For Splunk Cloud Platform, see [Manage Splunk Cloud Platform indexes](/en/?resourceId=SplunkCloud_Admin_ManageIndexes) in the *Splunk Cloud Platform Admin Manual*.
* For Splunk Enterprise, see [Create custom indexes](/en/?resourceId=Splunk_Indexer_Setupmultipleindexes) in *Managing indexers and clusters of indexers*.

### Specify a snap to time unit

You can specify a snap to time unit. The time unit indicates the nearest or latest time to which your time amount rounds down. Separate the time amount from the "snap to" time unit with an "@" character.

* You can use any of time units listed previously. For example:
  * @w, @week, and @w0 for Sunday
  * @month for the beginning of the month
  * @q, @qtr, or @quarter for the beginning of the most recent quarter (Jan 1, Apr 1, Jul 1, or Oct 1).
* You can specify a day of the week: w0 (Sunday), w1, w2, w3, w4, w5 and w6 (Saturday). For Sunday, you can specify w0 or w7.
* You can also specify offsets from the snap-to-time or "chain" together the time modifiers for more specific relative time definitions. For example, `@d-2h` snaps to the beginning of today (12 AM or midnight), and then applies the time offset of -2h, This results in a time of 10 PM yesterday.
  * The Splunk platform always applies the offset before it applies the snap. In other words, the left-hand side of the @ symbol is applied before the right-hand side.
* When snapping to the nearest or latest time, Splunk software always snaps backwards or rounds down to the latest time not after the specified time. For example, if it is 11:59:00 and you "snap to" hours, you will snap to 11:00 not 12:00.
* If you do not specify a time offset before the "snap to" amount, Splunk software interprets the time as "current time snapped to" the specified amount. For example, if it is currently 11:59 PM on Friday and you use `@w6` to "snap to Saturday", the resulting time is the *previous* Saturday at 12:01 A.M.

## Examples

### 1. Run a search over all time

If you want to search events from the start of UNIX time, use `earliest=1`.

When `earliest=1` and `latest=now()` are used, the search runs over all time.

...earliest=1 latest=now()

Specifying `latest=now()` does not return future events.

To return future events, specify `latest=<a_big_number>`. Future events are events that contain timestamps later than the current time `now()`.

### 2. Search the events from the beginning of the current week

...earliest=@w0

### 3. Search the events from the last full business week

...earliest=-5d@w1 latest=@w6

### 4. Search with an exact date as a boundary

With a boundary such as from November 15 at 8 PM to November 22 at 8 PM, use the timeformat `%m/%d/%Y:%H:%M:%S`.

...earliest="11/15/2022:20:00:00" latest="11/22/2022:20:00:00"

### 5. Specify multiple time windows using a fixed date time format

You can specify multiple time windows using the timeformat `%m/%d/%Y:%H:%M:%S`. For example to find events from 5-6 PM or 7-8 PM on specific dates, use the following syntax.

...(earliest="9/23/2022:17:00:00" latest="9/23/2022:18:00:00") OR (earliest="9/23/2022:19:00:00" latest="9/23/2022:20:00:00")

### 6. Specify multiple time windows using a relative time format

You can specify multiple time windows using the time modifiers and snap-to with a relative time. For example to find events for the last 24 hours but omit the events from Midnight to 1:00 A.M., use the following syntax:

...((earliest=-24h latest<@d) OR (earliest>=@d+1h))

## Other time modifiers

CAUTION: The following search time modifiers are still valid, but might be removed and their function no longer supported in a future release.

| Modifier | Syntax | Description |
| --- | --- | --- |
| daysago | `daysago=<int>` | Search events within the last integer number of days. |
| enddaysago | `enddaysago=<int>` | Set an end time for an integer number of days before Now. |
| endhoursago | `endhoursago=<int>` | Set an end time for an integer number of hours before Now. |
| endminutesago | `endminutesago=<int>` | Set an end time for an integer number of minutes before Now. |
| endmonthsago | `endmonthsago=<int>` | Set an end time for an integer number of months before Now. |
| endtime | `endtime=<string>` | Search for events before the specified time (exclusive of the specified time). Use timeformat to specify how the timestamp is formatted. |
| endtimeu | `endtimeu=<int>` | Search for events before the specific UNIX time. |
| hoursago | `hoursago=<int>` | Search events within the last integer number of hours. |
| minutesago | `minutesago=<int>` | Search events within the last integer number of minutes. |
| monthsago | `monthsago=<int>` | Search events within the last integer number of months. |
| searchtimespandays | `searchtimespandays=<int>` | Search within a specified range of days, expressed as an integer. |
| searchtimespanhours | `searchtimespanhours=<int>` | Search within a specified range of hours, expressed as an integer. |
| searchtimespanminutes | `searchtimespanminutes=<int>` | Search within a specified range of minutes, expressed as an integer. |
| searchtimespanmonths | `searchtimespanmonths=<int>` | Search within a specified range of months, expressed as an integer. |
| startdaysago | `startdaysago=<int>` | Search the specified number of days before the present time. |
| starthoursago | `starthoursago=<int>` | Search the specified number of hours before the present time. |
| startminutesago | `startminutesago=<int>` | Search the specified number of minutes before the present time. |
| startmonthsago | `startmonthsago=<int>` | Search the specified number of months before the present time. |
| starttime | `starttime=<timestamp>` | Search from the specified date and time to the present, inclusive of the specified time. |
| starttimeu | `starttimeu=<int>` | Search for events starting from the specific UNIX time. |
| timeformat | `timeformat=<string>` | Set the timeformat for the starttime and endtime modifiers. By default: `timeformat=%m/%d/%Y:%H:%M:%S` |

## See also

Functions

[Date and time functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/date-and-time-functions#id_190c4932_892e_47e2_aea5_479eb0e8f606__Date_and_Time_functions) used with evaluation commands

[Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) used with statistical and charting commands

Related information

[Specify time modifiers in your search](/en/?resourceId=Splunk_Search_Specifytimemodifiersinyoursearch) in the *Search Manual*
