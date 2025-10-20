# rangemap

## Description

Use the `rangemap` command to categorize the values in a numeric field. The command adds in a new field called `range` to each event and displays the category in the `range` field. The values in the `range` field are based on the numeric ranges that you specify.

Set the `range` field to the names of any `attribute_name` that the value of the input `field` is within. If no range is matched, the `range` value is set to the `default` value.

The ranges that you set can overlap. If you have overlapping values, the `range` field is created as a multivalue field containing all the values that apply. For example, if low=1-10, elevated=5-15, and the input field value is 10, `range=low` and `code=elevated`.

## Syntax

The required syntax is in bold.

rangemap

field=<string>

[<attribute\_name>=<numeric\_range>]...

[default=<string>]

### Required arguments

field

Syntax: field=<string>

Description: The name of the input field. This field must contain numeric values.

### Optional arguments

attribute\_name=numeric\_range

Syntax: <string>=<num>-<num>

Description: The <attribute\_name> is a string value that is output when the <numeric\_range> matches the value in the <field>. The <attribute\_name> is a output to the `range` field. The <numeric\_range> is the starting and ending values for the range. The values can be integers or floating point numbers. The first value must be lower than the second. The <numeric\_range> can include negative values.

Example: Dislike=-5--1 DontCare=0-0 Like=1-5

default

Syntax: default=<string>

Description: If the input field does not match a range, use this to define a default value.

Default: "None"

## Usage

The `rangemap` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Basic examples

### Example 1:

Set `range` to "green" if the date\_second is between 1-30; "blue", if between 31-39; "red", if between 40-59; and "gray", if no range matches (for example, if date\_second=0).

... | rangemap field=date\_second green=1-30 blue=31-39 red=40-59 default=gray

### Example 2:

Sets the value of each event's `range` field to "low" if its `count` field is 0 (zero); "elevated", if between 1-100; "severe", otherwise.

... | rangemap field=count low=0-0 elevated=1-100 default=severe

## Extended example

|  |
| --- |
| This example uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded.    You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and add it as an input. The following examples uses the All Earthquakes under the Past 30 days list. |

This search counts the number and magnitude of each earthquake that occurred in and around Alaska. Then a color is assigned to each magnitude using the `rangemap` command.

source=all\_month.csv place=\*alaska\* mag>=3.5
| stats count BY mag
| rename mag AS magnitude
| rangemap field=magnitude light=3.9-4.3 strong=4.4-4.9 severe=5.0-9.0 default=weak

The results look something like this:

| magnitude | count | range |
| --- | --- | --- |
| 3.7 | 15 | weak |
| 3.8 | 31 | weak |
| 3.9 | 29 | light |
| 4 | 22 | light |
| 4.1 | 30 | light |
| 4.2 | 15 | light |
| 4.3 | 10 | light |
| 4.4 | 22 | strong |
| 4.5 | 3 | strong |
| 4.6 | 8 | strong |
| 4.7 | 9 | strong |
| 4.8 | 6 | strong |
| 4.9 | 6 | strong |
| 5 | 2 | severe |
| 5.1 | 2 | severe |
| 5.2 | 5 | severe |

### Summarize the results by range value

source=all\_month.csv place=\*alaska\* mag>=3.5
| stats count BY mag
| rename mag AS magnitude
| rangemap field=magnitude green=3.9-4.2 yellow=4.3-4.6 red=4.7-5.0 default=gray
| stats sum(count) by range

The results look something like this:

| range | sum(count) |
| --- | --- |
| gray | 127 |
| green | 96 |
| red | 23 |
| yellow | 43 |

### Arrange the results in a custom sort order

By default the values in the search results are in descending order by the `sum(count)` field. You can apply a custom sort order to the results using the `eval` command with the `case` function.

source=all\_month.csv place=\*alaska\* mag>=3.5
| stats count BY mag
| rename mag AS magnitude
| rangemap field=magnitude green=3.9-4.2 yellow=4.3-4.6 red=4.7-5.0 default=gray
| stats sum(count) by range
| eval sort\_field=case(range="red",1, range="yellow",2, range="green",3, range="gray",4)
| sort sort\_field

The results look something like this:

| range | sum(count) | sort\_field |
| --- | --- | --- |
| red | 23 | 1 |
| yellow | 43 | 2 |
| green | 96 | 3 |
| gray | 127 | 4 |

## See also

Commands

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval)

Blogs

[Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html)
