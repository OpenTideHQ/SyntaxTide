# tail

## Description

Returns the last N number of specified results. The events are returned in reverse order, starting at the end of the result set. The last 10 events are returned if no integer is specified

## Syntax

tail [<N>]

### Required arguments

None.

### Optional arguments

<N>

Syntax: <int>

Description: The number of results to return.

Default: 10

## Usage

The `tail` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

Return the last 20 results in reverse order.

... | tail 20

## See also

[head](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/head#id_59ebb3d9_7e57_4ad1_8457_3c04ef2acbe4__head), [reverse](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/reverse#id_7c85ccb6_6bc2_4463_9b61_c1ca705f8d70__reverse)
