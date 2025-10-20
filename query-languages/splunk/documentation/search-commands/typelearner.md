# typelearner

CAUTION: The `typelearner` command is deprecated as of Splunk Enterprise version 5.0. This means that although the command continues to function, it might be removed in a future version.Use the `findtypes` command instead.

## Description

Generates suggested event types by taking previous search results and producing a list of potential searches that can be used as event types. By default, the `typelearner` command initially groups events by the value of the grouping-field. The search then unifies and merges these groups based on the keywords they contain.

## Syntax

typelearner [<grouping-field>] [<grouping-maxlen>]

### Optional arguments

grouping-field

Syntax: <field>

Description: The field with values for the `typelearner` comman to use when initially grouping events.

Default:`punct`, the punctuation seen in `_raw`

grouping-maxlen

Syntax: maxlen=<int>

Description: Determines how many characters in the grouping-field value to look at. If set to negative, the entire value of the grouping-field value is used to group events.

Default: 15

## Examples

### Example 1:

Have the search automatically discover and apply event types to search results.

... | typelearner

## See also

[typer](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/typer#id_972a3406_8aaf_461b_844a_2076dd3272a0__typer)
