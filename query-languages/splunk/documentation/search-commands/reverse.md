# reverse

## Description

Reverses the order of the results.

The `reverse` command does not affect which results are returned by the search, only the order in which the results are displayed. For the CLI, this includes any default or explicit `maxout` setting.

Note: On very large result sets, which means sets with millions of results or more, `reverse` command requires large amounts of temporary storage, I/O, and time.

## Syntax

reverse

## Usage

The `reverse` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

Reverse the order of a result set.

... | reverse

## See also

Commands

[head](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/head#id_59ebb3d9_7e57_4ad1_8457_3c04ef2acbe4__head)

[sort](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sort#id_2a60b861_704d_4298_918f_274b501ec80d__sort)

[tail](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tail#id_19606654_05b8_40f6_925a_f848b331f05b__tail)
