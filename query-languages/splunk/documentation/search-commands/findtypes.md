# findtypes

## Description

Generates suggested event types by taking the results of a search and producing a list of potential event types. At most, 5000 events are analyzed for discovering event types.

## Syntax

findtypes max=<int> [notcovered] [useraw]

### Required arguments

max

Datatype: <int>

Description: The maximum number of events to return.

Default: 10

### Optional arguments

notcovered

Description: If this keyword is used, the `findtypes` command returns only event types that are not already covered.

useraw

Description: If this keyword is used, the `findtypes` command uses phrases in the \_raw text of events to generate event types.

## Examples

### Example 1:

Discover 10 common event types.

... | findtypes

### Example 2:

Discover 50 common event types and add support for looking at text phrases.

... | findtypes max=50 useraw

## See also

[typer](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/typer#id_972a3406_8aaf_461b_844a_2076dd3272a0__typer)
