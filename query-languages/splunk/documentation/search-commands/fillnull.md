# fillnull

## Description

Replaces null values with a specified value. Null values are field values that are missing in a particular result but present in another result. Use the `fillnull` command to replace null field values with a string. You can replace the null values in one or more fields. You can specify a string to fill the null field values or use the default, field value which is zero ( 0 ).
​

## Syntax

The required syntax is in bold.
​

fillnull

[value=<string>]

[<field-list>]

### Required arguments

None.
​

### Optional arguments

field-list

Syntax: <field>...

Description: A space-delimited list of one or more fields. If you specify a field list, all of the fields in that list are filled in with the `value` you specify. If you specify a field that didn't previously exist, the field is created. If you do not specify a field list, the `value` is applied to all fields.

value

Syntax: value=<string>

Description: Specify a string value to replace null values. If you do not specify a value, the default value is applied to the <field-list>.

Default: 0

## Usage

The `fillnull` command is a distributable streaming command when a `field-list` is specified. When no `field-list` is specified, the `fillnull` command fits into the dataset processing type.
See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Fields in the event set should have at least one non-null value

Due to the unique behavior of the `fillnull` command, Splunk software isn't able to distinguish between a null field value and a null field that doesn't exist in the Splunk schema. In order for a field to exist in the schema, it must have at least one non-null value in the event set. To ensure downstream processing of fields by the `fillnull` command, ensure that there is at least one non-null value for the fields in the event set.

For example, consider the following search:

| makeresults
| eval test="123123", test2=null()
| fillnull value=NULL

The results look something like this:

| \_time | test |
| --- | --- |
| 2023-06-07 17:49:45 | 123123 |

Notice that the test2 field doesn't show up in the results, even though the `eval` command created it. The reason the test2 field isn't in the results is that there isn't at least one non-null value for the field in the event set.

If a field doesn't have at least one non-null value in the event set, it's considered a nonexistent field, so downstream commands like the `fillnull` command can't process it. For example, consider the following search:

| makeresults
| eval test="123123"
| eval test2=null()
| table test test2
| fillnull value=NULL

The results look something like this:

| test | test2 |
| --- | --- |
| 123123 |  |

The search results display the test2 field, but not the intended NULL value. This is because the upstream `eval` command initially set test2 to `null`, so the field doesn't exist in the schema.

Now consider the following search:

| makeresults
| eval test1=split("123,456", ",")
| mvexpand test1
| eval test2=if(test1="123", null(), "abc")
| fillnull value=NULL

The results look something like this:

| \_time | test1 | test2 |
| --- | --- | --- |
| 2023-06-07 18:22:24 | 123 | NULL |
| 2023-06-07 18:22:24 | 456 | abc |

This search generates at least one non-null value for each field and shows the expected behavior by setting the null value of the test2 field to the NULL string. Now all the values display as expected because the test2 field has at least one non-null value.

## Examples

### 1. Fill all empty field values with the default value

​Your search has produced the following search results:
​

| \_time | ACCESSORIES | ARCADE | SHOOTER | SIMULATION | SPORTS | STRATEGY | TEE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-17 | 5 | 17 | 6 | 3 | 5 | 32 |  |
| 2021-03-16 |  | 63 | 39 | 30 | 22 | 127 | 56 |
| 2021-03-15 | 65 | 94 | 38 | 42 |  | 128 | 60 |

​
You can fill all of empty field values with the zero by adding the `fillnull` command to your search.
​

... | fillnull

​
The search results will look like this:
​

| \_time | ACCESSORIES | ARCADE | SHOOTER | SIMULATION | SPORTS | STRATEGY | TEE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-03-17 | 5 | 17 | 6 | 3 | 5 | 32 | 0 |
| 2021-03-16 | 0 | 63 | 39 | 30 | 22 | 127 | 56 |
| 2021-03-15 | 65 | 94 | 38 | 42 | 0 | 128 | 60 |

### 2. Fill all empty fields with the string "NULL"

For the current search results, fill all empty field values with the string "NULL".

... | fillnull value=NULL

### 3. Fill the specified fields with the string "unknown"

​Suppose that your search has produced the following search results:
​

| \_time | host | average\_kbps | instanenous\_kbps | kbps |
| --- | --- | --- | --- | --- |
| 2021/02/14 12:00 | danube.sample.com |  | 1.865 | 3.420 |
| 2021/02/14 11:53 | mekong.buttercupgames.com | 0.710 | 0.164 | 1.256 |
| 2021/02/14 11:47 | danube.sample.com | 1.325 |  | 2.230 |
| 2021/02/14 11:42 | yangtze.buttercupgames.com | 2.249 | 0.000 | 2.249 |
| 2021/02/14 11:39 |  | 2.874 | 3.841 | 1.906 |
| 2021/02/14 11:33 | nile.example.net | 2.023 | 0.915 |  |

​
You can fill all empty field values in the "host" and "kbps" fields with the string "unknown" by adding the `fillnull` command to your search.
​

... | fillnull value=unknown host kbps

​
​The results look like this:

| \_time | host | average\_kbps | instanenous\_kbps | kbps |
| --- | --- | --- | --- | --- |
| 2021/02/14 12:00 | danube.sample.com |  | 1.865 | 3.420 |
| 2021/02/14 11:53 | mekong.buttercupgames.com | 0.710 | 0.164 | 1.256 |
| 2021/02/14 11:47 | danube.sample.com | 1.325 |  | 2.230 |
| 2021/02/14 11:42 | yangtze.buttercupgames.com | 2.249 | 0.000 | 2.249 |
| 2021/02/14 11:39 | unknown | 2.874 | 3.841 | 1.906 |
| 2021/02/14 11:33 | nile.example.net | 2.023 | 0.915 | unknown |

​
​If you specify a field that does not exist the field is created and the value you specify is added to the new field.
​
For example if you specify `bytes` in the field list, the `bytes` field is created and filled with the string "unknown".
​

... | fillnull value=unknown host kbps bytes

​
​The results look like this:

| \_time | host | average\_kbps | instanenous\_kbps | kbps | bytes |
| --- | --- | --- | --- | --- | --- |
| 2021/02/14 12:00 | danube.sample.com |  | 1.865 | 3.420 | unknown |
| 2021/02/14 11:53 | mekong.buttercupgames.com | 0.710 | 0.164 | 1.256 | unknown |
| 2021/02/14 11:47 | danube.sample.com | 1.325 |  | 2.230 | unknown |
| 2021/02/14 11:42 | yangtze.buttercupgames.com | 2.249 | 0.000 | 2.249 | unknown |
| 2021/02/14 11:39 | unknown | 2.874 | 3.841 | 1.906 | unknown |
| 2021/02/14 11:33 | nile.example.net | 2.023 | 0.915 | unknown | unknown |

### 4. Use the fillnull command with the timechart command

Build a time series chart of web events by host and fill all empty fields with the string "NULL".

sourcetype="web" | timechart count by host | fillnull value=NULL

​

## See also

Related commands

[filldown](/en/?resourceId=Splunk_SearchReference_Filldown)

[streamstats](/en/?resourceId=Splunk_SearchReference_Streamstats)
