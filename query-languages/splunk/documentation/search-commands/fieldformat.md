# fieldformat

## Description

With the `fieldformat` command you can use an <eval-expression> to change the format of a field value when the results render. This command changes the appearance of the results without changing the underlying value of the field.

Because commands that come later in the search pipeline cannot modify the formatted results, use the `fieldformat` command as late in the search pipeline as possible.

The `fieldformat` command does not apply to commands that export data, such as the `outputcsv` and `outputlookup` commands. The export retains the original data format and not the rendered format. If you want the format to apply to exported data, use the `eval` command instead of the `fieldformat` command.

## Syntax

fieldformat <field>=<eval-expression>

### Required arguments

<field>

Description: The name of a new or existing field, non-wildcarded, for the output of the eval expression.

<eval-expression>

Syntax: <string>

Description: A combination of values, variables, operators, and functions that represent the value of your destination field. You can specify only one <eval-expression> with the `fieldformat` command. To specify multiple formats you must use multiple `fieldformat` commands. See [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldformat#c84c2c6c_da0a_40f0_8774_be2ed930434d__fieldformat).

For more information, see the [eval command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval).

For information about supported functions, see [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldformat#bd1ca90d_3bcc_4389_b0bb_ba2f167bd6ef__Usage).

## Usage

The `fieldformat` command is a [distributable streaming command](https://docs.splunk.com/Splexicon:Streamingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Time format variables are frequently used with the `fieldformat` command. See [Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables).

### Functions

You can use a wide range of functions with the `fieldformat` command. For general information about using functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

The following table lists the supported functions by type of function. Use the links in the table to learn more about each function, and to see examples.

| Type of function | Supported functions and syntax |  |  |
| --- | --- | --- | --- |
| [Comparison and Conditional functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions) | `case(X,"Y",...)`   `cidrmatch("X",Y)`   `coalesce(X,...)`  `false()`  `if(X,Y,Z)` | `in(VALUE-LIST)`   `like(TEXT, PATTERN)`   `match(SUBJECT, "REGEX")`  `null()` | `nullif(X,Y)`   `searchmatch(X)`   `true()`  `validate(X,Y,...)` |
| [Conversion functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/conversion-functions#a4b7f6ef_0101_463b_bac1_d6b7c3ed1c08__Conversion_functions) | `printf("format",arguments)` | `tonumber(NUMSTR,BASE)` | `tostring(X,Y)` |
| [Cryptographic functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/cryptographic-functions#id_0d634bad_651d_40cc_86a7_08ea1344bc53__Cryptographic_functions) | `md5(X)`   `sha1(X)` | `sha256(X)` | `sha512(X)` |
| [Date and Time functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/date-and-time-functions#id_190c4932_892e_47e2_aea5_479eb0e8f606__Date_and_Time_functions) | `now()`   `relative_time(X,Y)` | `strftime(X,Y)`   `strptime(X,Y)` | `time()` |
| [Informational functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/informational-functions#c6ea1274_5a31_4118_a1c5_ff4a4c95cea0__Informational_functions) | `isbool(X)`   `isint(X)`   `isnotnull(X)` | `isnull(X)`   `isnum(X)` | `isstr(X)`   `typeof(X)` |
| [Mathematical functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/mathematical-functions#id_298d0220_6a94_46da_aade_316a83f1063a__Mathematical_functions) | `abs(X)`   `ceiling(X)`   `exact(X)`  `exp(X)` | `floor(X)`   `ln(X)`   `log(X,Y)`  `pi()` | `pow(X,Y)`   `round(X,Y)`   `sigfig(X)`  `sqrt(X)` |
| [Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions) | `commands(X)`   `mvappend(X,...)`   `mvcount(MVFIELD)`  `mvdedup(X)` | `mvfilter(X)`   `mvfind(MVFIELD,"REGEX")`   `mvindex(MVFIELD,STARTINDEX,ENDINDEX)`  `mvjoin(MVFIELD,STR)` | `mvrange(X,Y,Z)`   `mvsort(X)`   `mvzip(X,Y,"Z")` |
| [Statistical eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/statistical-eval-functions#edb88796_760e_43fc_87b0_67db51ae36ee__Statistical_eval_functions) | `max(X,...)` | `min(X,...)` | `random()` |
| [Text functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/text-functions#id_6c70181c_7391_41a1_b9bf_ba22cef1eed4__Text_functions) | `len(X)`   `lower(X)`   `ltrim(X,Y)`  `replace(X,Y,Z)` | `rtrim(X,Y)`   `spath(X,Y)`   `split(X,"Y")`  `substr(X,Y,Z)` | `trim(X,Y)`   `upper(X)`   `urldecode(X)` |
| [Trigonometry and Hyperbolic functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/trig-and-hyperbolic-functions#e2d47590_0425_4b68_9c41_ac8019717682__Trig_and_Hyperbolic_functions) | `acos(X)`   `acosh(X)`   `asin(X)`  `asinh(X)`  `atan(X)` | `atan2(X,Y)`   `atanh(X)`   `cos(X)`  `cosh(X)`  `hypot(X,Y)` | `sin(X)`   `sinh(X)`   `tan(X)`  `tanh(X)` |

## Basic examples

### 1. Format numeric values to display commas

This example uses the [metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata) command to return results for the sourcetypes in the main index.

| metadata type=sourcetypes
| table sourcetype totalCount

The `metadata` command returns many fields. The `table` command is used to return only the sourcetype and totalCount fields.

The results appear on the Statistics tab and look like this:

| sourcetype | totalCount |
| --- | --- |
| access\_combined\_wcookie | 39532 |
| cisco:esa | 112421 |
| csv | 9510 |
| secure | 40088 |
| vendor\_sales | 30244 |

Use the `fieldformat` command to reformat the appearance of the field values. The values in the `totalCount` field are formatted to display the values with commas.

| metadata type=sourcetypes
| table sourcetype totalCount
| fieldformat totalCount=tostring(totalCount, "commas")

The results appear on the Statistics tab and look something like this:

| sourcetype | totalCount |
| --- | --- |
| access\_combined \_wcookie | 39,532 |
| cisco:esa | 112,421 |
| csv | 9,510 |
| secure | 40,088 |
| vendor\_sales | 30,244 |

### 2. Display UNIX time in a readable format

Assume that the `start_time` field contains UNIX time. Format the `start_time` field to display only the hours, minutes, and seconds that correspond to the UNIX time.

... | fieldformat start\_time = strftime(start\_time, "%H:%M:%S")

### 3. Add currency symbols to numerical values

To format numerical values in a field with a currency symbol, you must specify the symbol as a literal and enclose it in quotation marks. Use a period character as a binary concatenation operator, followed by the `tostring` function, which enables you to display commas in the currency values.

...| fieldformat totalSales="$".tostring(totalSales,"commas")

## Extended example

### 1. Formatting multiple fields

This example shows how to change the appearance of search results to display commas in numerical values and dates into readable formats.

First, use the [metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata) command to return results for the sourcetypes in the main index.

|metadata type=sourcetypes | table sourcetype totalCount |fieldformat totalCount=tostring(totalCount, "commas")

| metadata type=sourcetypes
| rename totalCount as Count firstTime as "First Event" lastTime as "Last Event"
recentTime as "Last Update"
| table sourcetype Count "First Event" "Last Event" "Last Update"

* The `metadata` command returns the fields `firstTime`, `lastTime`, `recentTime`, `totalCount`, and `type`.
* In addition, because the search specifies `types=sourcetypes`, a field called `sourcetype` is also returned.
* The `totalCount`, `firstTime`, `lastTime`, and `recentTime` fields are renamed to `Count`, `First Event`, `Last Event`, and `Last Update`.
* The `First Event`, `Last Event`, and `Last Update` fields display the values in UNIX time.

The results appear on the Statistics tab and look something like this:

| sourcetype | Count | First Event | Last Event | Last Update |
| --- | --- | --- | --- | --- |
| access\_combined\_wcookie | 39532 | 1520904136 | 1524014536 | 1524067875 |
| cisco:esa | 112421 | 1521501480 | 1521515900 | 1523471156 |
| csv | 9510 | 1520307602 | 1523296313 | 1523392090 |
| secure | 40088 | 1520838901 | 1523949306 | 1524067876 |
| vendor\_sales | 30244 | 1520904187 | 1524014642 | 1524067875 |

Use the `fieldformat` command to reformat the appearance of the output of these fields. The `Count` field is formatted to display the values with commas. The `First Event`, `Last Event`, and `Last Update` fields are formatted to display the values in readable timestamps.

| metadata type=sourcetypes
| rename totalCount as Count firstTime as "First Event" lastTime as "Last Event"
recentTime as "Last Update"
| table sourcetype Count "First Event" "Last Event" "Last Update"
| fieldformat Count=tostring(Count, "commas")
| fieldformat "First Event"=strftime('First Event', "%c")
| fieldformat "Last Event"=strftime('Last Event', "%c")
| fieldformat "Last Update"=strftime('Last Update', "%c")

The results appear on the Statistics tab and look something like this:

| sourcetype | Count | First Event | Last Event | Last Update |
| --- | --- | --- | --- | --- |
| access\_combined \_wcookie | 39,532 | Mon Mar 12 18:22:16 2018 | Tue Apr 17 18:22:16 2018 | Wed Apr 18 09:11:15 2018 |
| cisco:esa | 112,421 | Mon Mar 19 16:18:00 2018 | Mon Mar 19 20:18:20 2018 | Wed Apr 11 11:25:56 2018 |
| csv | 9,510 | Mon Mar 5 19:40:02 2018 | Mon Apr 9 10:51:53 2018 | Tue Apr 10 13:28:10 2018 |
| secure | 40,088 | Mon Mar 12 00:15:01 2018 | Tue Apr 17 00:15:06 2018 | Wed Apr 18 09:11:16 2018 |
| vendor\_sales | 30,244 | Mon Mar 12 18:23:07 2018 | Tue Apr 17 18:24:02 2018 | Wed Apr 18 09:11:15 2018 |

## See also

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval), [where](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/where#id_1ba3aadd_6e9f_42de_b388_3deb298f4b35__where)

[Date and time format variables](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/date-and-time-format-variables#id_95d99b4a_d3ec_4943_8ca0_54cba0f3e5ce__Date_and_time_format_variables)
