# fromjson

## Description

Converts JSON-formatted objects into multivalue fields. If you give the `fromjson` command a single field name that points to proper JSON objects, `fromjson` returns keys as fields and key values as field values.

## Syntax

Required syntax is in bold.

| fromjson<string>

[ prefix=<string>]

### Optional arguments

prefix

Syntax: prefix=<string>

Description: Prepends a string to the fields that `fromjson` extracts from a JSON-formatted object. For example, including `prefix=my_` in the search adds `my_` to the beginning of field names in the results.

Default: none

## Usage

The `fromjson` command is a [streaming command](https://docs.splunk.com/Splexicon:Streamingcommand), which means that it turns JSON-formatted objects into fields as each JSON object is received. See [Types of commands](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### 1. Expand a JSON object to create new fields

Use the `fromjson` command to expand a JSON-formatted object and return the values in the search result. This example creates two new fields called `name` and `age`, and outputs the corresponding values in the search results.

| makeresults | eval object=json\_object("name", "Albert", "age", 63) | fromjson object

The results look like this.

| \_time | age | name | object |
| --- | --- | --- | --- |
| 2020-11-09 17:01:22 | 63 | Albert | {"name":"Albert", "age":63} |

### 2. Prepend the name of extracted fields

You can use the optional argument `prefix` to prepend a string to fields extracted from a JSON-formatted object. This example creates two new fields called `json_name` and `json_age`.

| makeresults | eval object=json\_object("name", "Albert", "age", 63) | fromjson object prefix=my\_

The results look something like this.

| \_time | my\_age | my\_name | object |
| --- | --- | --- | --- |
| 2020-11-09 17:01:22 | 63 | Albert | {"name":"Albert", "age":63} |

### 3. Expand nested JSON objects

When you use `fromjson` to expand JSON-formatted objects into multivalue fields, you can retain the formatting of JSON objects by nesting them within the main object. In the following example, the object called `json_obj` with the key-value pair "school" and "city", is nested within another JSON object called `object`.

| makeresults | eval object=json\_object("age", 19, "name", "Sally", "new", false(), "classes", json\_array("math", "history", "science"), "another\_json\_object", json\_object("school", "city"), "null", null)| fromjson object

The results look something like this.

| \_time | age | another\_json\_obj | classes | name | new | object |
| --- | --- | --- | --- | --- | --- | --- |
| 2020-11-09 17:01:22 | 19 | {"school":"city"} | math history   science | Sally | false | {"age":19,"name":"Sally","new":false,"classes": ["math","history","science"],"another\_json\_object":{"school":"city"},"null":null} |

## See also

Commands

[tojson](/en/?resourceId=Splunk_SearchReference_Tojson)

Evaluation functions

[JSON functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/json-functions#e208618e_0a58_428d_8be9_194c0b1c17b6__JSON_functions)
