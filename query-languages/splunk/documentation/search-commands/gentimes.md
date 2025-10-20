# gentimes

## Description

The `gentimes` command is useful in conjunction with the [map](/en/?resourceId=Splunk_SearchReference_Map) command.

Generates timestamp results starting with the exact time specified as start time. Each result describes an adjacent, non-overlapping time range as indicated by the increment value. This terminates when enough results are generated to pass the endtime value.

The `gentimes` command generates events up to the end time, but not including the end time.

## Syntax

| gentimes start=<timestamp> [end=<timestamp>] [increment=<increment>]

### Required arguments

start

Syntax: start=<timestamp>

Description: Specify as start time.

<timestamp>

Syntax: MM/DD/YYYY[:HH:MM:SS] | <int>

Description: Indicate the timeframe, using either a timestamp or an integer value. For example: `10/1/2020` for October 1, 2020, `4/1/2021:12:34:56` for April 1, 2021 at 12:34:56, or `-5` for five days ago.

### Optional arguments

end

Syntax: end=<timestamp>

Description: Specify an end time.

Default: midnight, prior to the current time in local time

increment

Syntax: increment=<int>(s | m | h | d)

Description: Specify a time period to increment from the start time to the end time. Supported increments are seconds, minutes, hours, and days.

Default: 1d

## Usage

The `gentimes` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

The `gentimes` command returns four fields.

| Field | Description |
| --- | --- |
| starttime | The starting time range in UNIX time. |
| starthuman | The human readable time range in the format DDD MMM DD HH:MM:SS YYYY. For example Sun Apr 4 00:00:00 2021. |
| endtime | The ending time range in UNIX time. |
| endhuman | The human readable time range in the format DDD MMM DD HH:MM:SS YYYY. For example Fri Apr 16 23:59:59 2021. |

To specify future dates, you must include the `end` argument.

## Examples

### 1. Generate daily time ranges by specifying dates

Generates daily time ranges from April 4 to April 7 in 2021. This search generates events up to the end time, but not including the end time. This search generates three intervals covering one day periods aligning with the calendar days April 4, 5, and 6, during 2021. The `gentimes` command generates events up to the end time, but not including the end time.

| gentimes start=4/4/21 end=4/7/21

The results look like this:

| endhuman | endtime | starthuman | starttime |
| --- | --- | --- | --- |
| Sun Apr 4 23:59:59 2021 | 1617605999 | Sun Apr 4 00:00:00 2021 | 1617519600 |
| Mon Apr 5 23:59:59 2021 | 1617692399 | Mon Apr 5 00:00:00 2021 | 1617606000 |
| Tue Apr 6 23:59:59 2021 | 1617778799 | Tue Apr 6 00:00:00 2021 | 1617692400 |

### 2. Generate daily time ranges by specifying relative times

Generate daily time ranges from 30 days ago until 27 days ago.

| gentimes start=-30 end=-27

### 3. Generate hourly time ranges

Generate hourly time ranges from December 1 to December 5 in 2021.

| gentimes start=12/1/21 end=12/5/21 increment=1h

### 4. Generate time ranges by only specifying a start date

Generate daily time ranges from April 25 to today.

| gentimes start=4/25/22

### 5. Generate weekly time ranges

Although the week increment is not supported, you can generate a weekly increment by specifying `increment=7d`.

This examples generates weekly time ranges from December 1, 2021 to April 30, 2022.

| gentimes start=12/1/21 end=4/30/22 increment=7d

## See also

Commands

[makeresults](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makeresults#ddcd3bee_0938_4097_8a43_4f6bf0ea9aa2__makeresults)

[map](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/map#id_05347ef5_9f31_49fa_a0c2_01558b2effb8__map)
