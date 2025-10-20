# where

## Description

The `where` command uses eval-expressions to filter search results. These eval-expressions must be Boolean expressions, where the expression returns either true or false. The `where` command returns only the results for which the eval expression returns true.

## Syntax

where <eval-expression>

### Required arguments

eval-expression

Syntax: <eval-mathematical-expression> | <eval-concatenate-expression> | <eval-comparison-expression> | <eval-boolean-expression> | <eval-function-call>

Description: A combination of values, variables, operators, and functions that represent the value of your destination field. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/where#id_71951eb2_71d0_4364_9070_f3679a959fbc__Usage).

The <eval-expression> is case-sensitive. The syntax of the eval expression is checked before running the search, and an exception is thrown for an invalid expression.

The following table describes characteristics of eval expressions that require special handling.

| Expression characteristics | Description | Example |
| --- | --- | --- |
| Field names starting with numeric characters | If the expression references a field name that starts with a numeric character, the field name must be surrounded by single quotation marks. | `'5minutes'="late"`    This expression is a field name equal to a string value. Because the field starts with a numeric it must be enclosed in single quotations. Because the value is a string, it must be enclosed in double quotations. |
| Field names with non-alphanumeric characters | If the expression references a field name that contains non-alphanumeric characters, the field name must be surrounded by single quotation marks. | `new=count+'server-1'`    This expression could be interpreted as a mathematical equation, where the dash is interpreted as a minus sign. To avoid this, you must enclose the field name `server-1` in single quotation marks. |
| Literal strings | If the expression references a literal string, the literal string must be surrounded by double quotation marks. | `new="server-"+count`    There are two issues with this example. First, `server-` could be interpreted as a field name or as part of a mathematical equation, that uses a minus sign and a plus sign. To ensure that `server-` is interpreted as a literal string, enclose the string in double quotation marks. |

## Usage

The `where` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The <eval-expression> is case-sensitive.

The `where` command uses the same expression syntax as the `eval` command. Also, both commands interpret quoted strings as literals. If the string is not quoted, it is treated as a field name. Because of this, you can use the `where` command to compare two different fields, which you cannot use the `search` command to do.

| Command | Example | Description |
| --- | --- | --- |
| Where | ... | where ipaddress=clientip | This search looks for events where the field `ipaddress` is equal to the field `clientip`. |
| Search | | search host=www2 | This search looks for events where the field `host` contains the string value `www2`. |
| Where | ... | where host="www2" | This search looks for events where the value in the field `host` is the string value `www2`. |

### Boolean expressions

The order in which Boolean expressions are evaluated with the `where` command is:

1. Expressions within parentheses
2. NOT clauses
3. AND clauses
4. OR clauses
5. XOR clauses

This evaluation order is different than the order used with the `search` command, which evaluates OR before AND clauses, and doesn't support XOR.

See [Boolean expressions with logical operators](/?resourceId=Splunk_Search_Booleanexpressions) in the Splunk platform *Search Manual*.

### Using a wildcard with the where command

You can only specify a wildcard by using the `like` function with the `where` command. The percent ( % ) symbol is the wildcard that you use with the `like` function. See the [like()](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions) evaluation function.

### Supported functions

You can use a wide range of evaluation functions with the `where` command. For general information about using functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

* For a list of functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_8238c3d2_e1b1_4414_ae0b_d049ec2df62f__Function_list_by_category).
* For an alphabetical list of functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_8238c3d2_e1b1_4414_ae0b_d049ec2df62f__Alphabetical_list_of_functions).

## Examples

### 1. Specify a wildcard with the where command

You can only specify a wildcard with the `where` command by using the `like` function. The percent ( % ) symbol is the wildcard you must use with the `like` function. The `where` command returns `like=TRUE` if the `ipaddress` field starts with the value `198.`.

... | where like(ipaddress, "198.%")

### 2. Match IP addresses or a subnet using the where command

Return "CheckPoint" events that match the IP or is in the specified subnet.

host="CheckPoint" | where like(src, "10.9.165.%") OR cidrmatch("10.9.165.0/25", dst)

### 3. Specify a calculation in the where command expression

Return "physicsjobs" events with a speed is greater than 100.

sourcetype=physicsjobs | where distance/time > 100

## See also

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval), [search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search), [regex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/regex#id_1e8bb767_f5bf_4585_aa2d_da477342a282__regex)
