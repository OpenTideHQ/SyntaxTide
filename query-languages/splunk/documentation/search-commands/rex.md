# rex

## Description

Use this command to either extract fields using regular expression named groups, or replace or substitute characters in a field using sed expressions.

The `rex` command matches the value of the specified field against the unanchored regular expression and extracts the named groups into fields of the corresponding names.

When `mode=sed`, the given sed expression used to replace or substitute characters is applied to the value of the chosen field. This sed-syntax is also used to mask, or anonymize, sensitive data at [index-time](https://docs.splunk.com/Splexicon:Indextime). Read about using sed to [anonymize data](/en/?resourceId=Splunk_Data_Anonymizedata) in the *Getting Data In* Manual.

Note: If a field is not specified, the regular expression or sed expression is applied to the `_raw` field. Running the `rex` command against the `_raw` field might have a performance impact.

Use the `rex` command for [search-time](https://docs.splunk.com/Splexicon:Searchtime) [field extraction](https://docs.splunk.com/Splexicon:Fieldextraction) or string replacement and character substitution.

## Syntax

The required syntax is in bold.

rex [field=<field>]

( <regex-expression> [max\_match=<int>] [offset\_field=<string>] ) | (mode=sed <sed-expression>)

### Required arguments

You must specify either <regex-expression> or mode=sed <sed-expression>.

regex-expression

Syntax: "<string>"

Description: The PCRE regular expression that defines the information to match and extract from the specified field.

mode

Syntax: mode=sed

Description: Specify to indicate that you are using a sed (UNIX stream editor) expression.

sed-expression

Syntax: "<string>"

Description: When mode=sed, specify whether to replace strings (s) or substitute characters (y) in the matching regular expression. No other sed commands are implemented. Sed mode supports the following flags: global (g) and Nth occurrence (N), where N is a number that is the character location in the string.

### Optional arguments

field

Syntax: field=<field>

Description: The field that you want to extract information from.

Default:
`_raw`

max\_match

Syntax: max\_match=<int>

Description: Controls the number of times the regex is matched. If greater than 1, the resulting fields are multivalued fields. Use 0 to specify unlimited matches. Multiple matches apply to the repeated application of the whole pattern. If your regex contains a capture group that can match multiple times within your pattern, only the last capture group is used for multiple matches.

Default: 1

offset\_field

Syntax: offset\_field=<string>

Description: Creates a field that lists the position of certain values in the `field` argument, based on the regular expression specified in `regex-expression`. For example, if the `rex` expression is `"(?<tenchars>.{10})"` the first ten characters of the `field` argument are matched. The `offset_field` shows `tenchars=0-9`. The offset calculation always uses zero ( 0 ) for the first position. For another example, see [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_9ea82255_82e5_4400_950a_41363c6170f7__Examples).

Default: No default

## Usage

The `rex` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### rex command or regex command?

Use the `rex` command to either extract fields using regular expression named groups, or replace or substitute characters in a field using sed expressions.

Use the `regex` command to remove results that do not match the specified regular expression.

### Regular expressions

Splunk SPL supports perl-compatible regular expressions (PCRE).

When you use regular expressions in searches, you need to be aware of how characters such as pipe ( | ) and backslash ( \ ) are handled. See [SPL and regular expressions](/en/?resourceId=Splunk_Search_SPLandregularexpressions) in the *Search Manual*.

For general information about regular expressions, see [About Splunk regular expressions](/en/?resourceId=Splunk_Knowledge_AboutSplunkregularexpressions) in the *Knowledge Manager Manual*.

### Sed expressions

When using the `rex` command in sed mode, you have two options: replace (s) or character substitution (y).

The syntax for using sed to replace (s) text in your data is: `"s/<regex>/<replacement>/<flags>"`

* <regex> is a PCRE regular expression, which can include capturing groups.
* <replacement> is a string to replace the regex match. Use `\n` for back references, where "n" is a single digit.
* <flags> can be either `g` to replace all matches, or a number to replace a specified match.

The syntax for using sed to substitute characters is: `"y/<string1>/<string2>/"`

* This substitutes the characters that match <string1> with the characters in <string2>.

When using the `rex` command in `sed` mode, the `rex` command supports the same `sed` expressions as the `SEDCMD` setting in the props.conf.in file.

### Anonymize multiline text using sed expressions

The Splunk platform doesn't support applying `sed` expressions in multiline mode. To use a `sed` expression to anonymize multiline events, use 2 `sed` expressions in succession by first removing the newlines and then performing additional replacements. For example, the following search uses the `rex` command to replace all newline characters in a multiline event containing HTML content, and then redacts all of the HTML content.

index=main html
| rex mode=sed field=\_raw "s/\\n/NEWLINE\_REMOVED/g"
| rex mode=sed field=\_raw "s/<html.\*html>/REDACTED/g"

## Examples

### 1. Extract email values using regular expressions

Extract email values from events to create `from` and `to` fields in your events. For example, you have events such as:

Mon Mar 19 20:16:27 2018 Info: Bounced: DCID 8413617 MID 19338947 From: <MariaDubois@example.com> To: <zecora@buttercupgames.com> RID 0 - 5.4.7 - Delivery expired (message too old) ('000', ['timeout'])
Mon Mar 19 20:16:03 2018 Info: Delayed: DCID 8414309 MID 19410908 From: <WeiZhang@example.com> To: <mcintosh@buttercupgames.com> RID 0 - 4.3.2 - Not accepting messages at this time ('421', ['4.3.2 try again later'])
Mon Mar 19 20:16:02 2018 Info: Bounced: DCID 0 MID 19408690 From: <Exit\_Desk@sample.net> To: <lyra@buttercupgames.com> RID 0 - 5.1.2 - Bad destination host ('000', ['DNS Hard Error looking up mahidnrasatyambsg.com (MX): NXDomain'])
Mon Mar 19 20:15:53 2018 Info: Delayed: DCID 8414166 MID 19410657 From: <Manish\_Das@example.com> To: <dash@buttercupgames.com> RID 0 - 4.3.2 - Not accepting messages at this time ('421', ['4.3.2 try again later'])

When the events were indexed, the From and To values were not identified as fields. You can use the `rex` command to extract the field values and create `from` and `to` fields in your search results.

The from and to lines in the \_raw events follow an identical pattern. Each from line is From: and each to line is To:. The email addresses are enclosed in angle brackets. You can use this pattern to create a regular expression to extract the values and create the fields.

source="cisco\_esa.txt" | rex field=\_raw "From: <(?<from>.\*)> To: <(?<to>.\*)>"

You can remove duplicate values and return only the list of address by adding the `dedup` and `table` commands to the search.

source="cisco\_esa.txt" | rex field=\_raw "From: <(?<from>.\*)> To: <(?<to>.\*)>" | dedup from to | table from to

The results look something like this:

![This image shows the results of the search. There are two columns, from and to, that display email addresses.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/09b616a5-bc8e-41d1-aa3d-59ccdef794be?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwOWI2MTZhNS1iYzhlLTQxZDEtYWEzZC01OWNjZGVmNzk0YmUiLCJleHAiOjE3NjEwNjAxOTMsImp0aSI6IjBmZTI3MTM2YmVkMDQyYWNhZDQwZTY0ODVkZTFiNjhmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.jSNX3hPLomWTsFUqXWzMtC09C6hXRwoIdUOetYtN9m8)

### 2. Extract from multi-valued fields using max\_match

You can use the `max_match` argument to specify that the regular expression runs multiple times to extract multiple values from a field.

For example, use the `makeresults` command to create a field with multiple values:

| makeresults
| eval test="a$1,b$2"

The results look something like this:

| \_time | test |
| --- | --- |
| 2019-12-05 11:15:28 | a$1,b$2 |

To extract each of the values in the `test` field separately, you use the `max_match` argument with the `rex` command. For example:

...| rex field=test max\_match=0 "((?<field>[^$]\*)\$(?<value>[^,]\*),?)"

The results look something like this:

| \_time | field | test | value |
| --- | --- | --- | --- |
| 2019-12-05 11:36:57 | a b | a$1,b$2 | 1 2 |

### 3. Extract values from a field in scheduler.log events

Extract "user", "app" and "SavedSearchName" from a field called "savedsearch\_id" in scheduler.log events. If `savedsearch_id=bob;search;my_saved_search` then `user=bob` , `app=search` and `SavedSearchName=my_saved_search`

... | rex field=savedsearch\_id "(?<user>\w+);(?<app>\w+);(?<SavedSearchName>\w+)"

### 4. Use a sed expression

Use `sed` syntax to match the regex to a series of numbers and replace them with an anonymized string.

... | rex field=ccnumber mode=sed "s/(\d{4}-){3}/XXXX-XXXX-XXXX-/g"

### 5. Use a sed expression with capture replace for strings

This example shows how to use the `rex` command sed expression with capture replace using \1, \2 to reuse captured pieces of a string.

This search creates an event with three fields, `_time`, `search`, and `orig_search`. The regular expression removes the quotation marks and any leading or trailing spaces around the quotation marks.

|makeresults
|eval orig\_search="src\_ip=TERM( \"10.8.2.33\" ) OR src\_ip=TERM( \"172.17.154.197\" )", search=orig\_search
|rex mode=sed field=search "s/\s\"(\d+\.\d+\.\d+\.\d+)\"\s/\1/g"

The results look like this:

| \_time | orig\_search | search |
| --- | --- | --- |
| 2021-05-31 23:36:29 | src\_ip=TERM( "10.8.2.33" ) OR src\_ip=TERM( "172.17.154.197" ) | src\_ip=TERM(10.8.2.33) OR src\_ip=TERM(172.17.154.197) |

### 6. Use an offset\_field

To identify the position of certain values in a field, use the `rex` command with the `offset_field` argument and a regular expression.

The following example starts with the `makeresults` command to create a field with a value:

| makeresults
| eval list="abcdefghijklmnopqrstuvwxyz"

The results look something like this:

| \_time | list |
| --- | --- |
| 2022-05-21 11:36:57 | abcdefghijklmnopqrstuvwxyz |

Add the `rex` command with the `offset_field` argument to the search to create a field called `off`. You can identify the position of the first five values in the field `list` using the regular expression `"(?<firstfive>abcde)"`. For example:

| makeresults
| eval list="abcdefghijklmnopqrstuvwxyz"
| rex offset\_field=off field=list "(?<firstfive>abcde)"

The results look something like this:

| \_time | firstfive | list | off |
| --- | --- | --- | --- |
| 2022-05-21 11:36:57 | abcde | abcdefghijklmnopqrstuvwxyz | firstfive=0-4 |

You can identify the position of several of the middle values in the field `list` using the regular expression `"(?<middle>fgh)"`. For example:

| makeresults
| eval list="abcdefghijklmnopqrstuvwxyz"
| rex offset\_field=off field=list "(?<middle>fgh)"

The results look something like this:

| \_time | list | middle | off |
| --- | --- | --- | --- |
| 2022-05-21 11:36:57 | abcdefghijklmnopqrstuvwxyz | fgh | middle=5-7 |

### 7. Display IP address and ports of potential attackers

Display IP address and ports of potential attackers.

sourcetype=linux\_secure port "failed password" | rex "\s+(?<ports>port \d+)" | top src\_ip ports showperc=0

This search uses the `rex` command to extract the port field and values. The search returns a table that lists the top source IP addresses (src\_ip) and ports of the potential attackers.

## See also

Commands

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract)

[kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform)

[multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv)

[regex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/regex#id_1e8bb767_f5bf_4585_aa2d_da477342a282__regex)

[spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath)

[xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv)
