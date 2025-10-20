# makejson

CAUTION: The `makejson` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

Creates a JSON object from the specified set of fields in the search results, and places the JSON object into a new field.

## Syntax

makejson <wc-field-list> output=<string>

## Required arguments

output

Syntax: output=<string>

Description: The name to use for the output field where the JSON object is placed.

## Optional arguments

wc-field-list

Syntax: <field>(,<field>) ...

Description: Comma-delimited list of fields to use to generate a JSON object. You can use a wild card character in the field names.

Default: All fields are included in the JSON object if a list is not specified.

## Usage

You cannot use the `table` or `fields` command to specify the field order in the JSON object that gets created.

## Examples

### 1. Create a JSON object using all of the available fields

The following search create a JSON object in a field called "data" taking in values from all available fields.

| makeresults count=5 | eval owner="vladimir", error=random()%3 | makejson output=data

* The `makeresults` command creates five search results that contain a timestamp.
* The `eval` command creates two fields in each search result. One field is named `owner` and contains the value `vladimir`. The other field is named `error` that takes a random number and uses the modulo mathematical operator ( % ) to divide the random number by 3.
* The `makejson` command creates a JSON object based on the values in the fields in each search result.

The results look something like this:

| \_time | owner | error | data |
| --- | --- | --- | --- |
| 2020-03-10 21:45:14 | vladimir | 1 | {"owner": "vladimir", "error": 1, "\_time": 1583901914} |
| 2020-03-10 21:45:14 | vladimir | 0 | {"owner": "vladimir", "error": 0, "\_time": 1583901914} |
| 2020-03-10 21:45:14 | vladimir | 0 | {"owner": "vladimir", "error": 0, "\_time": 1583901914} |
| 2020-03-10 21:45:14 | vladimir | 2 | {"owner": "vladimir", "error": 2, "\_time": 1583901914} |
| 2020-03-10 21:45:14 | vladimir | 1 | {"owner": "vladimir", "error": 1, "\_time": 1583901914} |

### 2. Create a JSON object from a specific set of fields

Consider the following data:

| \_time | owner | error\_code |
| --- | --- | --- |
| 2020-03-10 21:45:14 | claudia | 1 |
| 2020-03-10 20:45:17 | alex | 4 |
| 2020-03-10 06:48:11 | wei | 2 |
| 2020-03-09 21:15:35 | david | 3 |
| 2020-03-09 16:22:10 | maria | 4 |
| 2020-03-08 23:32:56 | vanya | 1 |
| 2020-03-07 14:05:14 | claudia | 2 |

The makejson command is used to create a JSON object in a field called "data" using the values from only the `_time` and `owner` fields. The `error` field is not included in the JSON object.

| makeresults count=7 | eval owner="claudia", error=random()%5 | makejson \_time, owner output=data

The results look something like this:

| data |
| --- |
| {"owner": "claudia", "\_time": 1583876714} |
| {"owner": "alex", "\_time": 1583873117} |
| {"owner": "wei", "\_time": 1583822891} |
| {"owner": "david", "\_time": 1583788535} |
| {"owner": "maria", "\_time": 1583770930} |
| {"owner": "vanya", "\_time": 1583710376} |
| {"owner": "claudia", "\_time": 1583589914} |

### 3. Create a JSON object using a wildcard list of fields

Create a JSON object in a field called "json-object" using the values from the `_time` field and fields that end in `_owner`.

| makeresults count=5 | eval product\_owner="wei", system\_owner="vanya", error=random()%5 | makejson \_time, \*\_owner output="json-object"

The results look something like this:

| \_time | product\_owner | system\_owner | error | json-object |
| --- | --- | --- | --- | --- |
| 2020-03-10 22:23:24 | wei | vanya | 3 | {"product\_owner": "wei", "system\_owner": "vanya", "\_time": 1583904204} |
| 2020-03-10 22:23:24 | wei | vanya | 2 | {"product\_owner": "wei", "system\_owner": "vanya", "\_time": 1583904204} |
| 2020-03-10 22:23:24 | wei | vanya | 1 | {"product\_owner": "wei", "system\_owner": "vanya", "\_time": 1583904204} |
| 2020-03-10 22:23:24 | wei | vanya | 3 | {"product\_owner": "wei", "system\_owner": "vanya", "\_time": 1583904204} |
| 2020-03-10 22:23:24 | wei | vanya | 2 | {"product\_owner": "wei", "system\_owner": "vanya", "\_time": 1583904204} |

### 4. Use with schema-bound lookups

You can use the `makejson` command with schema-bound lookups to store a JSON object in the description field for later processing.

Suppose that a Splunk application comes with a KVStore collection called `example_ioc_indicators`, with the fields `key` and `description`. For long term supportability purposes you do not want to modify the collection, but simply want to utilize a custom lookup within a framework, such as Splunk Enterprise Security (ES) Threat Framework.

Let's start with the first part of the search:

| makeresults count=1
| eval threat="maliciousdomain.example", threat\_expiry="2020-01-01 21:13:37 UTC", threat\_name="Sample threat", threat\_campaign="Sample threat", threat\_confidence="100"
| makejson threat\_expiry, threat\_name, threat\_campaign, threat\_confidence output=description
| table threat, description

This search produces a result that looks something like this:

| threat | description |
| --- | --- |
| maliciousdomain.example | {"threat\_name": "Sample threat", "threat\_confidence": 100, "threat\_expiry": "2020-01-01 21:13:37 UTC", "threat\_campaign": "Sample threat"} |

You would then add the `outputlookup` command to send the search results to the lookup:

... | outputlookup append=t example\_ioc\_indicators

To use this custom lookup within a framework, you would specify this in a search:

...| lookup example\_ioc\_indicators OUTPUT description AS match\_context | spath input=match\_context

## See also

Related commands

[spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath)
