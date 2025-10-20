# format

## Description

This command is used implicitly by subsearches. This command takes the results of a [subsearch](https://docs.splunk.com/Splexicon:Subsearch), formats the results into a single result and places that result into a new field called `search`.

The `format` command performs similar functions as the `return` command.

## Syntax

The required syntax is in bold.

format

[mvsep="<mv separator>"]

[maxresults=<int>]

["<row prefix>" "<column prefix>" "<column separator>" "<column end>" "<row separator>" "<row end>"]

[emptystr="<string>"]

If you want to specify a row or column options, you must specify all of the row and column options.

### Required arguments

None.

### Optional arguments

mvsep

Syntax: mvsep="<string>"

Description: The separator to use for multivalue fields.

Default: OR

maxresults

Syntax: maxresults=<int>

Description: The maximum results to return.

Default: 0, which means no limitation on the number of results returned.

<row prefix>

Syntax: "<string>"

Description: The value to use for the row prefix.

Default: The open parenthesis character "("

<column prefix>

Syntax: "<string>"

Description: The value to use for the column prefix.

Default: The open parenthesis character "("

<column separator>

Syntax: "<string>"

Description: The value to use for the column separator.

Default: AND

<column end>

Syntax: "<string>"

Description: The value to use for the column end.

Default: The close parenthesis character ")"

<row separator>

Syntax: "<string>"

Description: The value to use for the row separator.

Default: OR

<row end>

Syntax: "<string>"

Description: The value to use for the column end.

Default: The close parenthesis character ")"

emptystr

Syntax: emptystr="<string>"

Description: The value that the `format` command outputs instead of the default empty string `NOT( )` if the results generated up to that point are empty and no fields or values other than internal fields are returned. You can set this argument to a custom string that is displayed instead of the default empty string whenever your search results are empty.

Default: NOT( )

## Usage

By default, when you do not specify any of the optional row and column arguments, the output of the `format` command defaults to: `"(" "(" "AND" ")" "OR" ")"`.

### Specifying row and column arguments

There are several reasons to specify the row and column arguments:

Subsearches

There is an implicit `format` at the end of a subsearch that uses the default values for column and row arguments. For example, you can specify OR for the column separator by including the `format` command at the end of the subsearch.

Export the search to a different system

Specify the row and column arguments when you need to export the search to another system that requires different formatting.

## Examples

### 1. Example with no optional parameters

Suppose that you have results that look like this:

| source | sourcetype | host |
| --- | --- | --- |
| syslog.log | syslog | my\_laptop |
| bob-syslog.log | syslog | bobs\_laptop |
| laura-syslog.log | syslog | lauras\_laptop |

The following search returns the top 2 results, and creates a search based on the host, source, and sourcetype fields. The default format settings are used.

... | head 2 | fields source, sourcetype, host | format

This search returns the syntax for a search that is based on the field values in the top 2 results. The syntax is placed into a new field called search.

| source | sourcetype | host | search |
| --- | --- | --- | --- |
|  |  |  | ( ( host="mylaptop" AND source="syslog.log" AND sourcetype="syslog" ) OR ( host="bobslaptop" AND source="bob-syslog.log" AND sourcetype="syslog" ) ) |

### 2. Example using the optional parameters

You want to produce output that is formatted to use on an external system.

... | format "[" "[" "&&" "]" "||" "]"

Using the data in Example 1, the result is:

| source | sourcetype | host | search |
| --- | --- | --- | --- |
|  |  |  | [ [ host="mylaptop" && source="syslog.log" && sourcetype="syslog" ] | | [ host="bobslaptop" && source="bob-syslog.log" && sourcetype="syslog" ] ] |

### 3. Multivalue separator example

The following search uses the `eval` command to create a field called "foo" that contains one value "eventtype,log\_level". The `makemv` command is used to make the foo field a mulitvalue field and specifies the comma as the delimiter between the values. The search then outputs only the foo field and formats that field.

index=\_internal |head 1 |eval foo="eventtype,log\_level" | makemv delim="," foo | fields foo | format mvsep="mvseparator" "{" "[" "AND" "]" "AND" "}"

This results in the following output:

| foo | search |
| --- | --- |
|  | { [ ( foo="eventtype" mvseparator foo="log\_level" ) ] } |

### 4. Use emptystr to indicate empty results

When a search generates empty results, the `format` command returns internal fields and the contents of `emptystr`. You can change the value of `emptystr` from the default to a custom string. For example, the results in the following search are empty, so `format` returns a customized string "Error Found" in a new field called `search`.

| makeresults count=1 | format emptystr="Error Found"

The results look something like this.

| search |
| --- |
| Error Found |

If your search doesn't include `emptystr` like the following example, the `format` command displays the default empty string to indicate that the results are empty.

| makeresults count=1 | format

The results look like this.

| search |
| --- |
| NOT ( ) |

### 5. Use emptystr in a subsearch as a failsafe

Customizing your empty string as shown in the last example is one way to use `emptystr`. However, it is more typical to use the `format` command as a subsearch that is operating as a search filter, and then use `emptystr` as a failsafe in case your search returns empty results. For example, perhaps your index isn't generating results because one of the fields you're specifying in the subsearch doesn't exist or there's a typo or some other error in your search. You can include the `emptystr` argument and set it to a default source type that you know is always present, such as `splunkd`. Then, instead of returning nothing, your search will return some results that you can use for further filtering.

You can use the following sample search to make sure you get results even if your search contains errors.

index=\_internal sourcetype=
[search index=does\_not\_exist | head 1
| fields sourcetype
| format emptystr="splunkd"]

The results look something like this.

| i | Time | Event |
| --- | --- | --- |
| > | 11/16/21 3:11:33.745 PM | 11-16-2021 15:11:33.745 -0800 INFO Metrics - group=thruput, name=thruput, instantaneous\_kbps=4.984, instantaneous\_eps=20.935, average\_kbps=1.667, total\_k\_processed=182447.000, kb=154.505, ev=649 host = PF32198Dsource = C:\Program Files\Splunk\var\log\splunk\metrics.logsourcetype = splunkd |
| > | 11/16/21 3:11:33.745 PM | 11-16-2021 15:11:33.745 -0800 INFO Metrics - group=thruput, name=syslog\_output, instantaneous\_kbps=0.000, instantaneous\_eps=0.000, average\_kbps=0.000, total\_k\_processed=0.000, kb=0.000, ev=0 host = PF32198Dsource = C:\Program Files\Splunk\var\log\splunk\metrics.logsourcetype = splunkd |
| > | 11/16/21 3:11:33.745 PM | 11-16-2021 15:11:33.745 -0800 INFO Metrics - group=thruput, name=index\_thruput, instantaneous\_kbps=4.971, instantaneous\_eps=19.355, average\_kbps=1.667, total\_k\_processed=182424.000, kb=154.094, ev=600 host = PF32198Dsource = C:\Program Files\Splunk\var\log\splunk\metrics.logsourcetype = splunkd |
| > | 11/16/21 3:11:33.745 PM | 11-16-2021 15:11:33.745 -0800 INFO Metrics - group=queue, name=winparsing, max\_size\_kb=500, current\_size\_kb=0, current\_size=0, largest\_size=0, smallest\_size=0 host = PF32198Dsource = C:\Program Files\Splunk\var\log\splunk\metrics.logsourcetype = splunkd |

## See also

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search), [return](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/return#id_818adc4d_fd0c_4b1d_8bd9_0fca08c5bf98__return)
