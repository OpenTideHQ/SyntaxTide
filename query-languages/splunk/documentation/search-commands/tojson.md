# tojson

## Description

Converts events into JSON objects. You can specify which fields get converted by identifying them through exact match or through wildcard expressions. You can also apply specific JSON datatypes to field values using datatype functions. The `tojson` command converts multivalue fields into JSON arrays.

When fields are specifically named in a `tojson` search, the command generates JSON objects that are limited to the values of just those named fields. If no fields are specified for `tojson`, `tojson` generates JSON objects for all fields that would otherwise be returned by the search.

## Syntax

Required syntax is in bold.

| tojson

[<tojson-function>]...

[default\_type=<datatype>]

[fill\_null=<boolean>]

[include\_internal=<boolean>]

[output\_field=<string>]

### Optional arguments

tojson-function

Syntax: [auto | bool | json | none | num | str](<wc-field>)...

Description: Applies JSON datatype functions to values of named fields. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tojson#id_2ca5b6a9_64c4_45fb_8f87_272335dbb3e8__Usage) for details about how `tojson` interprets these datatype functions, and how `tojson` applies datatypes to field values when it converts events into JSON objects.

If you provide no fields, the `tojson` processor creates JSON objects for each event that include all available fields. In other words, it applies `none(*)` to the search.

Default: none(\*)

default\_type

Syntax: default\_type=<datatype>

Description: Specifies the datatype that the `tojson` processor should apply to fields that aren't specifically associated with a datatype function.

Default: none

fill\_null

Syntax: fill\_null=<boolean>

Description: When set to true, `tojson` outputs a literal `null` value when `tojson` skips a value. For example, normally, when `tojson` tries to apply the `json` datatype to a field that does not have proper JSON formatting, `tojson` skips the field. However, if `fill_null=true`, the `tojson` processor outputs a `null` value

Default: false

include\_internal

Syntax: include\_internal=<boolean>

Description: When set to true, `tojson` includes [internal fields](https://docs.splunk.com/Splexicon:Internalfield) such as `_time`, `_indextime`, or `_raw` in its JSON object output.

Default: false

output\_field

Syntax: output\_field=<string>

Description: Specifies the name of the field to which the `tojson` search processor writes the output JSON objects.

Default:
`_raw`

## Usage

The `tojson` command is a [streaming command](https://docs.splunk.com/Splexicon:Streamingcommand), which means it operates on each event as it is returned by the search. See [Types of commands](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Apply JSON datatypes to field values

The `tojson` command applies JSON datatypes to field values according to logic encoded in its datatype functions.

You can assign specific datatype functions to fields when you write a `tojson` search. Alternatively, you can name a set of fields without associating them with datatype functions, and then identify a `default_type` that `tojson` can apply to those unaffiliated fields.

If you do not specify any fields for the `tojson` command, the `tojson` returns JSON objects for each field that can possibly be returned by the search at that point, and applies the `none` datatype function to the values of those fields. The `none` datatype function applies the numeric datatype to field values that are purely numeric, and applies the string datatype to all other field values.

The following table explains the logic that the various datatype functions use to apply datatypes to the values of the fields with which they are associated.

| Datatype function | Conversion logic |
| --- | --- |
| auto | Converts all values of the specified field into JSON-formatted output. Automatically determines the field datatypes.  * If the value is numeric, the JSON output has a numeric output and includes a literal numeric. * If the value is the string `true` or `false` the JSON output has a Boolean type. * If the value is a literal `null,` , the JSON output has a null type and includes a null value. * If the value is a string other than the previously mentioned strings, `tojson` examines the string. If it is proper JSON, `tojson` outputs a nested JSON object. If it is not proper JSON, `tojson` includes the string in the output. |
| bool | Converts valid values of the specified field to the Boolean datatype, and skips invalid values, using string validation.  * If the value is a number, `tojson` outputs `false` only if that value is `0`. Otherwise `tojson` outputs `false`. * If the value is a string, `tojson` outputs `false` only if the value is `false`, `f`, or `no`. * The `tojson` processor outputs `true` only if the value is code `true`, `t`, or `yes`. If the value does not fit into those two sets of strings, it is skipped. * The validation for the `bool` datatype function is case insensitive. This means that it also interprets `FALSE`, `False`, `F`, and `NO` as `false`. |
| json | Converts all values of the specified field to the JSON type, using string validation. Skips values with invalid JSON.  * If the value is a number, `tojson` outputs that number. * If the value is a string, `tojson` outputs the string as a JSON block. * If the value is invalid JSON, `tojson` skips it. |
| none | Outputs all values for the specified field in the JSON type. Does not apply string validation.  * If the value is a number, `tojson` outputs a numeric datatype in the JSON block. * If the value is a string, `tojson` outputs a string datatype. |
| num | Converts all values of the specified field to the numeric type, using string validation.  * If the value is a number, `tojson` outputs that value and gives it the numeric datatype. * If the value is a string, `tojson` attempts to parse the string as a number. If it cannot, it skips the value. |
| str | Converts all values of the specified field into the string datatype, using string validation.  The `tojson` processor applies the string type to all values of the specified field, even if they are numbers, Boolean values, and so on. |

When a field includes multivalues, `tojson` outputs a JSON array and applies the datatype function logic to each element of the array.

## Examples

### 1. Convert all events returned by a search into JSON objects

This search of `index=_internal` converts all events it returns for its time range into JSON-formatted data. Because the search string does not assign datatype functions to specific fields, by default `tojson` applies the `none` datatype function to all fields returned by the search. This means all of their values get either the numeric or string datatypes.

index=\_internal | tojson

For example, say you start with events that look like this:

12-18-2020 18:19:25.601 +0000 INFO Metrics - group=thruput, name=thruput, instantaneous\_kbps=5.821, instantaneous\_eps=27.194, average\_kbps=5.652, total\_k\_processed=444500.000, kb=180.443, ev=843, load\_average=19.780

After being processed by `tojson`, such events have JSON formatting like this:

{ [-]
component: Metrics
date\_hour: 18
date\_mday: 18
date\_minute: 22
date\_month: december
date\_second: 9
date\_wday: friday
date\_year: 2020
date\_zone: 0
event\_message: group=thruput, name=thruput, instantaneous\_kbps=2.914, instantaneous\_eps=13.903, average\_kbps=5.062, total\_k\_processed=398412.000, kb=90.338, ev=431, load\_average=14.690
group: thruput
host: sh1
index: \_internal
linecount: 1
log\_level: INFO
name: thruput
punct: --\_::.\_+\_\_\_\_-\_=,\_=,\_=.,\_=.,\_=.,\_=.,\_=.,\_=,\_=.
source: /opt/splunk/var/log/splunk/metrics.log
sourcetype: splunkd
splunk\_server: idx2
timeendpos: 29
timestartpos: 0
}

### 2. Specify different datatypes for 'date' fields

The following search of the `_internal` index converts results into JSON objects that have only the `date_*` fields from each event. The numeric datatype is applied to all `date_hour` field values. The string datatype is applied to all other date field values.

index=\_internal | tojson num(date\_hour) str(date\_\*)

This search produces JSON objects like this:

{ [-]
date\_hour: 18
date\_mday: 18
date\_minute: 28
date\_month: december
date\_second: 45
date\_wday: friday
date\_year: 2020
date\_zone: 0
}

Note that all fields that do not start with `date_` have been stripped from the output.

### 3. Limit JSON object output and apply datatypes to the field values

This search returns JSON objects only for the `name`, `age`, and `isRegistered` fields. It uses the `auto` datatype function to have `tojson` automatically apply appropriate JSON datatypes to the values of those fields.

... | tojson auto(name) auto(age) auto(isRegistered)

### 4. Convert all events into JSON objects and apply appropriate datatypes to all field values

This search converts all of the fields in each event returned by the search into JSON objects. It uses the `auto` datatype function in conjunction with a wildcard to apply appropriate datatypes to the values of all fields returned by the search.

... | tojson auto(\*)

Notice that this search references the `auto` datatype function, which ensures that Boolean, JSON, and null field values are appropriately typed alongside numeric and string values.

Alternatively, you can use `default_type` to apply the `auto` datatype function to all fields returned by a search:

... | tojson default\_type=auto

### 5. Apply the Boolean datatype to a specific field

This example generates JSON objects containing values of the `isInternal` field. It uses the `bool` datatype function to apply the Boolean datatype to those field values.

... | tojson bool(isInternal)

### 6. Include internal fields and assign a 'null' value to skipped fields

This example demonstrates usage of the `include_internal` and `fill_null` arguments.

... | tojson include\_internal=true fill\_null=true

### 7. Designate a default datatype for a set of fields and write the JSON objects to another field

This search generates JSON objects based on the values of four fields. It uses the `default_type` argument to convert the first three fields to the `num` datatype. It applies the string datatype to a fourth field. Finally, it writes the finished JSON objects to the field `my_JSON_field`.

... | tojson age height weight str(name) default\_type=num output\_field=my\_JSON\_field

## See also

Commands

[fromjson](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fromjson#id_6f8c901e_3432_43db_8b55_a3f480214fd0__fromjson)

Evaluation functions

[JSON functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/json-functions#e208618e_0a58_428d_8be9_194c0b1c17b6__JSON_functions)
