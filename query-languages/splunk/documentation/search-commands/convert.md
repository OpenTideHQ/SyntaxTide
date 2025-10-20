# convert

## Description

The `convert` command converts field values in your search results into numerical values. Unless you use the AS clause, the original values are replaced by the new values.

Alternatively, you can use [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) such as `strftime()`, `strptime()`, or `tonumber()` to convert field values.

## Syntax

convert [timeformat=string] (<convert-function> [AS <field>] )...

### Required arguments

<convert-function>

Syntax: auto() | ctime() | dur2sec() | memk() | mktime() | mstime() | none() | num() | rmcomma() | rmunit()

Description: Functions to use for the conversion.

### Optional arguments

timeformat

Syntax: timeformat=<string>

Description: Specify the output format for the converted time field. The `timeformat` option is used by `ctime` and `mktime` functions. For a list and descriptions of format options, see [Common time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables) in the *Search Reference*.

Default:`%m/%d/%Y %H:%M:%S`. Note that this default does not conform to the locale settings.

<field>

Syntax: <string>

Description: Creates a new field with the name you specify to place the converted values into. The original field and values remain intact.

### Convert functions

auto()

Syntax: auto(<wc-field>)

Description: Automatically convert the fields to a number using the best conversion. Note that if not all values of a particular field can be converted using a known conversion type, the field is left untouched and no conversion at all is done for that field. You can use a wildcard ( \* ) character to specify all fields.

ctime()

Syntax: ctime(<wc-field>)

Description: Convert a UNIX time to an ASCII human readable time. Use the `timeformat` option to specify the exact format to convert to. You can use a wildcard ( \* ) character to specify all fields.

dur2sec()

Syntax: dur2sec(<wc-field>)

Description: Convert a duration format "[D+]HH:MM:SS" to seconds. You can use a wildcard ( \* ) character to specify all fields.

memk()

Syntax: memk(<wc-field>)

Description: Accepts a positive number (integer or float) followed by an optional "k", "m", or "g". The letter k indicates kilobytes, m indicates megabytes, and g indicates gigabytes. If no letter is specified, kilobytes is assumed. The output field is a number expressing quantity of kilobytes. Negative values cause data incoherency. You can use a wildcard ( \* ) character to specify all fields.

mktime()

Syntax: mktime(<wc-field>)

Description: Convert a human readable time string to an epoch time. Use `timeformat` option to specify exact format to convert from. You can use a wildcard ( \* ) character to specify all fields.

mstime()

Syntax: mstime(<wc-field>)

Description: Convert a [MM:]SS.SSS format to seconds. You can use a wildcard ( \* ) character to specify all fields.

none()

Syntax: none(<wc-field>)

Description: In the presence of other wildcards, indicates that the matching fields should not be converted. You can use a wildcard ( \* ) character to specify all fields.

num()

Syntax: num(<wc-field>)

Description: Like auto(), except non-convertible values are removed. You can use a wildcard ( \* ) character to specify all fields.

rmcomma()

Syntax: rmcomma(<wc-field>)

Description: Removes all commas from value, for example rmcomma(1,000,000.00) returns 1000000.00. You can use a wildcard ( \* ) character to specify all fields.

rmunit()

Syntax: rmunit(<wc-field>)

Description: Looks for numbers at the beginning of the value and removes trailing text. You can use a wildcard ( \* ) character to specify all fields.

## Usage

The `convert` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Basic examples

### 1. Convert all field values to numeric values

Use the `auto` convert function to convert all field values to numeric values.

... | convert auto(\*)

### 2. Convert field values except for values in specified fields

Convert every field value to a number value except for values in the field `src_ip`. Use the `none` convert function to specify fields to ignore.

... | convert auto(\*) none(src\_ip)

### 3. Change the duration values to seconds for the specified fields

Change the duration values to seconds for the specified fields

... | convert dur2sec(xdelay) dur2sec(delay)

### 4. Change the sendmail syslog duration format to seconds

Change the sendmail syslog duration format (D+HH:MM:SS) to seconds. For example, if `delay="00:10:15"`, the resulting value is `delay="615"`.
This example uses the `dur2sec` convert function.

... | convert dur2sec(delay)

### 5. Convert field values that contain numeric and string values

Convert the values in the `duration` field, which contain numeric and string values, to numeric values by removing the string portion of the values. For example, if `duration="212 sec"`, the resulting value is `duration="212"`. This example uses the `rmunit` convert function.

... | convert rmunit(duration)

### 6. Change memory values to kilobytes

Change all memory values in the `virt` field to KBs.
This example uses the `memk` convert function.

... | convert memk(virt)

## Extended Examples

### 1. Convert a UNIX time to a more readable time format

Convert a UNIX time to a more readable time formatted to show hours, minutes, and seconds.

source="all\_month.csv" | convert timeformat="%H:%M:%S" ctime(\_time) AS c\_time | table \_time, c\_time

* The `ctime()` function converts the `_time` value in the CSV file events to the format specified by the `timeformat` argument.
* The `timeformat="%H:%M:%S"` argument tells the search to format the `_time` value as HH:MM:SS.
* The converted time `ctime` field is renamed `c_time`.
* The `table` command is used to show the original `_time` value and the `ctime` field.

The results appear on the Statistics tab and look something like this:

| \_time | c\_time |
| --- | --- |
| 2018-03-27 17:20:14.839 | 17:20:14 |
| 2018-03-27 17:21:05.724 | 17:21:05 |
| 2018-03-27 17:27:03.790 | 17:27:03 |
| 2018-03-27 17:28:41.869 | 17:28:41 |
| 2018-03-27 17:34:40.900 | 17:34:40 |
| 2018-03-27 17:38:47.120 | 17:38:47 |
| 2018-03-27 17:40:10.345 | 17:40:10 |
| 2018-03-27 17:41:55.548 | 17:41:55 |

The `ctime()` function changes the timestamp to a non-numerical value. This is useful for display in a report or for readability in your events list.

### 2. Convert a time in MM:SS.SSS to a number in seconds

Convert a time in MM:SS.SSS (minutes, seconds, and subseconds) to a number in seconds.

sourcetype=syslog | convert mstime(\_time) AS ms\_time | table \_time, ms\_time

* The `mstime()` function converts the `_time` field values from a minutes and seconds to just seconds.

The converted time field is renamed `ms_time`.

* The `table` command is used to show the original `_time` value and the converted time.

| \_time | ms\_time |
| --- | --- |
| 2018-03-27 17:20:14.839 | 1522196414.839 |
| 2018-03-27 17:21:05.724 | 1522196465.724 |
| 2018-03-27 17:27:03.790 | 1522196823.790 |
| 2018-03-27 17:28:41.869 | 1522196921.869 |
| 2018-03-27 17:34:40.900 | 1522197280.900 |
| 2018-03-27 17:38:47.120 | 1522197527.120 |
| 2018-03-27 17:40:10.345 | 1522197610.345 |
| 2018-03-27 17:41:55.548 | 1522197715.548 |

The `mstime()` function changes the timestamp to a numerical value. This is useful if you want to use it for more calculations.

### 3. Convert a string time in HH:MM:SS into a number

Convert a string field `time_elapsed` that contains times in the format HH:MM:SS into a number. Sum the `time_elapsed` by the `user_id` field. This example uses the `eval` command to convert the converted results from seconds into minutes.

...| convert num(time\_elapsed) | stats sum(eval(time\_elapsed/60)) AS Minutes BY user\_id

## See also

Commands

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval)

[fieldformat](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldformat#c84c2c6c_da0a_40f0_8774_be2ed930434d__fieldformat)

Functions

[tonumber](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/conversion-functions#a4b7f6ef_0101_463b_bac1_d6b7c3ed1c08__Conversion_functions)

[strptime](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/date-and-time-functions#id_190c4932_892e_47e2_aea5_479eb0e8f606__Date_and_Time_functions)
