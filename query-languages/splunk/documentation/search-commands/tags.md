# tags

## Description

Annotates specified fields in your search results with [tags](https://docs.splunk.com/Splexicon:Tag). If there are fields specified, only annotates tags for those fields. Otherwise, this command looks for tags for all fields. See [About tags and aliases](/en/?resourceId=Splunk_Knowledge_Abouttagsandaliases) in the *Knowledge Manager Manual*.

## Syntax

The required syntax is in bold.

tags

[outputfield=<field>]

[inclname=<bool>]

[inclvalue=<bool>]

[allowed\_tags=<string>]

<field-list>

### Required arguments

None.

### Optional arguments

allowed\_tags

Syntax: allowed\_tags=<string> | allowed\_tags="<string-list>"

Description: If specified, returns only the tag names in the `allowed_tags` argument. You can specify multiple tags using a comma-separated, double-quoted string. For example: `allowed_tags="host, sourcetype"`.

Default: None

<field-list>

Syntax: <field> <field> ...

Description: Specify the fields that you want to output the tags from. The tag names are written to the `outputfield`.

Default: All fields

inclname

Syntax: inclname=true | false

Description: If `outputfield` is specified, this controls whether or not the event field name is added to the output field, along with the tag names. Specify `true` to include the field name.

Default: false

inclvalue

Syntax: inclvalue=true | false

Description: If `outputfield` is specified, controls whether or not the event field value is added to the output field, along with the tag names. Specify `true` to include the event field value.

Default: false

outputfield

Syntax: outputfield=<field>

Description: If specified, the tag names for all of the fields are written to this one new field. If not specified, a new field is created for each field that contains tags. The tag names are written to these new fields using the naming convention `tag_name::<field>`. In addition, a new field is created called `tags` that lists all of the tag names in all of the fields.

Default: New fields are created and the tag names are written to the new fields.

## Usage

The `tags` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Viewing tag information

To view the tags in a table format, use a command before the `tags` command such as the `stats` command. Otherwise, the fields output from the `tags` command appear in the list of Interesting fields. See [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tags#f8a7798a_b203_4015_9ca7_0724a1697a09__Examples).

### Using the <outputfield> argument

If `outputfield` is specified, the tag names for the fields are written to this field. By default, the tag names are written in the format <field>::<tag\_name>. For example, `sourcetype::apache`.

If `outputfield` is specified, the `inclname` and `inclvalue` arguments control whether or not the field name and field values are added to the `outputfield`. If both `inclname` and `inclvalue` are set to `true`, then the format is <field>::<value>::<tag\_name>. For example, `sourcetype::access_combined_wcookie::apache`.

## Examples

### 1. Results using the default settings

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

This search looks for web access events and counts those events by host.

sourcetype=access\_\* | stats count by host

The results look something like this:

| host | count |
| --- | --- |
| www1 | 13628 |
| www2 | 12912 |
| www3 | 12992 |

When you use the `tags` command without any arguments, two new fields are added to the results `tag` and `tag::host`.

sourcetype=access\_\* | stats count by host | tags

The results look something like this:

| host | count | tag | tag::host |
| --- | --- | --- | --- |
| www1 | 13628 | tag2 | tag2 |
| www2 | 12912 | tag1 | tag1 |
| www3 | 12992 |  |  |

There are no tags for `host=www3`.

Add the  `sourcetype` field to the `stats` command BY clause.

sourcetype=access\_\* | stats count by host sourcetype | tags

The results look something like this:

| host | sourcetype | count | tag | tag:host | tag::sourcetype |
| --- | --- | --- | --- | --- | --- |
| www1 | access\_combined\_wcookie | 13628 | apache tag2 | tag2 | apache |
| www2 | access\_combined\_wcookie | 12912 | apache tag1 | tag1 | apache |
| www3 | access\_combined\_wcookie | 12992 | apache |  | apache |

The `tag` field list all of the tags used in the events that contain the combination of host and sourcetype.

The `tag::host` field list all of the tags used in the events that contain that host value.

The `tag::sourcetype` field list all of the tags used in the events that contain that sourcetype value.

### 2. Specifying a list of fields

Return the tags for the `host` and `eventtype` fields.

... | tags host eventtype

### 3. Specifying an output field

Write the tags for all fields to the new field `test`.

... | stats count by host sourcetype | tags outputfield=test

The results look like this:

| host | sourcetype | count | test |
| --- | --- | --- | --- |
| www1 | access\_combined\_wcookie | 13628 | apache tag2 |
| www2 | access\_combined\_wcookie | 12912 | apache tag1 |
| www3 | access\_combined\_wcookie | 12992 | apache |

### 4. Including the field names in the search results

Write the tags for the `host` and `sourcetype` fields into the `test` field. New fields are returned in the output using the format `host::<tag>` or `sourcetype::<tag>`. Include the field name in the output.

... | stats count by host sourcetype | tags outputfield=test inclname=t

The results look like this:

| host | sourcetype | count | test |
| --- | --- | --- | --- |
| www1 | access\_combined\_wcookie | 13628 | sourcetype::apache host::tag2 |
| www2 | access\_combined\_wcookie | 12912 | sourcetype::apache host::tag1 |
| www3 | access\_combined\_wcookie | 12992 | sourcetype::apache |

### 5. Identifying a specific a list of tags to return

Write the "error" and "group" tags for the `host` field into the `test` field. New fields are returned in the output using the format `host::<tag>`. Include the field name in the output.

index=main | tags outputfield=test inclname=t allowed\_tags="error, group" host

If you don't have a command before the `tags` command that organizes the results in a table format, you will see the output of the `tags` command in the Interesting fields list, as shown in the following image:

![This screen image shows the fields list with the "test" field selected. The popup information box shows two values, host::error and host::group.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/756d540a-65a1-4a83-9865-6169d5b14697?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3NTZkNTQwYS02NWExLTRhODMtOTg2NS02MTY5ZDViMTQ2OTciLCJleHAiOjE3NjEwNjAyMjcsImp0aSI6ImFjZWM0ZmIwYmM0MTQ3NDU5ZWZmYTA0ZDIzMzQyOGY4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.4JHAdj1l0L0t-7I7ZVl8MQBhYbzA9SWUY9hHbJJHVXM)

Notice that the tag field in the list of Interesting fields shows that there are 3 tag values. Because the search specified that only the `error` and `group` tags should be returned to the `test` output field, those are the only tag values that appear in the image.

## See also

Related information

[About tags and aliases](/en/?resourceId=Splunk_Knowledge_Abouttagsandaliases) in the *Knowledge Manager Manual*

[Tag field-value pairs in Search](/en/?resourceId=Splunk_Knowledge_TagandaliasfieldvaluesinSplunkWeb) in the *Knowledge Manager Manual*

[Define and manage tags in Settings](/en/?resourceId=Splunk_Knowledge_Defineandusetags)  in the *Knowledge Manager Manual*

Commands

[eval](/en/?resourceId=Splunk_SearchReference_Eval)
