# metasearch

## Description

Retrieves event `metadata` from indexes based on terms in the <logical-expression>.

## Syntax

metasearch [<logical-expression>]

### Optional arguments

<logical-expression>

Syntax: <time-opts> | <search-modifier> | [NOT] <logical-expression> | <index-expression> | <comparison-expression> | <logical-expression> [OR <logical-expression>]

Description: Includes time and search modifiers, comparison and index expressions.

### Logical expression

<comparison-expression>

Syntax: <field><cmp><value>

Description: Compare a field to a literal value or values of another field.

<index-expression>

Syntax: "<string>" | <term> | <search-modifier>

<time-opts>

Syntax: [<timeformat>] [<time-modifier>]...

### Comparison expression

<cmp>

Syntax: = | != | < | <= | > | >=

Description: Comparison operators.

<field>

Syntax: <string>

Description: The name of one of the fields returned by the `metasearch` command. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metasearch#id_63dde957_6a15_4fc6_a001_345f2d5e52be__Usage).

<lit-value>

Syntax: <string> | <num>

Description: An exact, or literal, value of a field that is used in a comparison expression.

<value>

Syntax: <lit-value> | <field>

Description: In comparison-expressions, the literal value of a field or another field name. The <lit-value> must be a number or a string.

### Index expression

<search-modifier>

Syntax: <field-specifier> | <savedsplunk-specifier> | <tag-specifier>

### Time options

The search allows many flexible options for searching based on time. For a list of time modifiers, see the topic [Time modifiers for search](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/time-modifiers#id_8fb27868_8604_41f9_ad6e_9a259b75e51a__Time_modifiers) in the *Search Manual*.

<timeformat>

Syntax: timeformat=<string>

Description: Set the time format for starttime and endtime terms. By default, timestamp is formatted: `timeformat=%m/%d/%Y:%H:%M:%S` .

<time-modifier>

Syntax: earliest=<time\_modifier> | latest=<time\_modifier>

Description: Specify start and end times using relative or absolute time. For more about the time modifier index, see [Specify time modifiers in your search](/en/?resourceId=Splunk_Search_Specifytimemodifiersinyoursearch) in the *Search Manual*.

## Usage

The `metasearch` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

The `metasearch` command returns these fields:

| Field | Description |
| --- | --- |
| host | A default field that contains the host name or IP address of the network device that generated an event. |
| index | The repository for data. When the Splunk platform indexes raw data, it transforms the data into searchable events. |
| source | A default field that identifies the source of an event, that is, where the event originated. |
| sourcetype | A default field that identifies the data structure of an event. |
| splunk\_server | The name of the instance where Splunk Enterprise is installed. |
| \_time | The \_time field contains an event's timestamp expressed in UNIX time. |

## Examples

### Example 1:

Return metadata on the default index for events with "404" and from host "webserver1".

| metasearch 404 host="webserver1"

## See also

Commands

[metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata)

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)
