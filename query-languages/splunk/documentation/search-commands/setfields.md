# setfields

## Description

Sets the field values for all results to a common value.

Sets the value of the given fields to the specified values for each event in the result set. Delimit multiple definitions with commas. Missing fields are added, present fields are overwritten.

Whenever you need to change or define field values, you can use the more general purpose `eval` command. See usage of an eval expression to set the value of a field in Example 1.

## Syntax

setfields <setfields-arg>, ...

### Required arguments

<setfields-arg>

Syntax: string="<string>", ...

Description: A key-value pair, with the value quoted. If you specify multiple key-value pairs, separate each pair with a comma. Standard key cleaning is performed. This means all non-alphanumeric characters are replaced with '\_' and leading '\_' are removed.

## Examples

### Example 1:

Specify a value for the ip and foo fields.

... | setfields ip="10.10.10.10", foo="foo bar"

To do this with the [eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval) command:

... | eval ip="10.10.10.10" | eval foo="foo bar"

## See also

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval),
[fillnull](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fillnull#ea500f11_dc13_4c3b_bb16_32e3345d99f7__fillnull),
[rename](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rename#dc72aa4f_a698_4dda_8d71_c3974cdad2ef__rename)
