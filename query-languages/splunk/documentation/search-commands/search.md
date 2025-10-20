# search

## Description

Use the `search` command to retrieve events from indexes or filter the results of a previous search command in the pipeline. You can retrieve events from your indexes, using keywords, quoted phrases, wildcards, and field-value expressions. The `search` command is implied at the beginning of any search. You do not need to specify the `search` command at the beginning of your search criteria.

You can also use the `search` command later in the search pipeline to filter the results from the previous command in the pipeline.

The search command can also be used in a subsearch. See [about subsearches](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the *Search Manual*.

After you [retrieve events](/en/?resourceId=Splunk_Search_Aboutretrievingevents), you can apply commands to transform, filter, and report on the events. Use the vertical bar ( | ) , or pipe character, to apply a command to the retrieved events.

The `search` command supports IPv4 and IPv6 addresses and subnets that use CIDR notation.

## Syntax

search <logical-expression>

### Required arguments

<expression>

Syntax: <logical-expression> | <time-opts> | <search-modifier> | NOT <logical-expression> | <index-expression> | <comparison-expression> | <logical-expression> [OR] <logical-expression>

Description: Includes all keywords or field-value pairs used to describe the events to retrieve from the index. Include parenthesis as necessary. Use Boolean expressions, comparison operators, time modifiers, search modifiers, or combinations of expressions for this argument.

The AND operator is always implied between terms and expressions. For example, `web error` is the same as `web AND error`. Specifying `clientip=192.0.2.255 earliest=-1h@h` is the same as `clientip=192.0.2.255 AND earliest=-1h@h`. So unless you want to include it for clarity reasons, you do not need to specify the AND operator.

### Logical expression options

<comparison-expression>

Syntax: <field><comparison-operator><value> | <field> IN (<value-list>)

Description: Compare a field to a literal value or provide a list of values that can appear in the field.

<index-expression>

Syntax: "<string>" | <term> | <search-modifier>

Description: Describe the events you want to retrieve from the index using literal strings and search modifiers.

<time-opts>

Syntax: [<timeformat>] (<time-modifier>)...

Description: Describe the format of the starttime and endtime terms of the search. See [Time options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_2a75b3dc_f9a6_4111_a69d_a89901208920__Time_options).

### Comparison expression options

<comparison-operator>

Syntax: = |  != | < | <= | > | >=

Description: You can use comparison operators when searching field/value pairs. Comparison expressions with the `equal ( = )` or `not equal ( != )` operator compare string values. For example, "1" does not match "1.0". Comparison expressions with greater than or less than operators `< > <= >=` numerically compare two numbers and lexicographically compare other values. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_6df4df05_8fdf_48fc_9c96_97915b2eea74__Usage).

<field>

Syntax: <string>

Description: The name of a field.

<value>

Syntax: <literal-value>

Description: In comparison-expressions, the literal number or string value of a field.

<value-list>

Syntax: (<literal-value>, <literal-value>, ...)

Description: Used with the IN operator to filter events by specifying two or more values. For example use `error IN (400, 402, 404, 500)` instead of `error=400 OR error=402 OR error=404 OR error=500`. You can also use a wildcard character ( \* ) to specify values that are similar, such as `error IN (40*)`.

See the "Multiple field-value comparisons with the IN operator" section in [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_6df4df05_8fdf_48fc_9c96_97915b2eea74__Usage).

### Index expression options

<string>

Syntax: "<string>"

Description: Specify keywords or quoted phrases to match. When searching for strings and quoted strings (anything that's not a search modifier), Splunk software searches the `_raw` field for the matching events or results.

<search-modifier>

Syntax: <sourcetype-specifier> | <host-specifier> | <hosttag-specifier> | <source-specifier> | <savedsplunk-specifier> | <eventtype-specifier> | <eventtypetag-specifier> | <splunk\_server-specifier>

Description: Search for events from specified fields or field tags. For example, search for one or a combination of hosts, sources, source types, saved searches, and event types. Also, search for the field tag, with the format: `tag::<field>=<string>`.

* Read more about [searching with default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields) in the *Knowledge Manager manual*.
* Read more about [using tags and field aliases](/en/?resourceId=Splunk_Knowledge_Abouttagsandaliases) in the *Knowledge Manager manual*.

<sourcetype-specifier>

Syntax: sourcetype=<string>

Description: Search for events from the specified sourcetype field.

<host-specifier>

Syntax: host=<string>

Description: Search for events from the specified host field.

<hosttag-specifier>

Syntax: hosttag=<string>

Description: Search for events that have hosts that are tagged by the string.

<eventtype-specifier>

Syntax: eventtype=<string>

Description: Search for events that match the specified event type.

<eventtypetag-specifier>

Syntax: eventtypetag=<string>

Description: Search for events that would match all eventtypes tagged by the string.

<savedsplunk-specifier>

Syntax: savedsearch=<string> | savedsplunk=<string>

Description: Search for events that would be found by the specified saved search.

<source-specifier>

Syntax: source=<string>

Description: Search for events from the specified source field.

<splunk\_server-specifier>

Syntax: splunk\_server=<string>

Description: Search for events from a specific server. Use "local" to refer to the search head.

### Time options

For a list of time modifiers, see [Time modifiers for search](/splunk-enterprise/search/spl-search-reference/10.0/time-format-variables-and-modifiers/time-modifiers#id_8fb27868_8604_41f9_ad6e_9a259b75e51a__Time_modifiers).

<timeformat>

Syntax: timeformat=<string>

Description: Set the time format for starttime and endtime terms.

Default: timeformat=%m/%d/%Y:%H:%M:%S.

<time-modifier>

Syntax: starttime=<string> | endtime=<string> | earliest=<time\_modifier> | latest=<time\_modifier>

Description: Specify start and end times using relative or absolute time.

Note: You can also use the earliest and latest attributes to specify absolute and relative time ranges for your search. For more about this time modifier syntax, see [Specify time modifiers in your search](/en/?resourceId=Splunk_Search_Specifytimemodifiersinyoursearch) in the *Search Manual.*

starttime

Syntax: starttime=<string>

Description: Events must be later or equal to this time. Must match `timeformat`.

endtime

Syntax: endtime=<string>

Description: All events must be earlier or equal to this time.

## Usage

The `search` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand) when it is the first command in the search, before the first pipe. When the `search` command is used further down the pipeline, it is a [distributable streaming command](https://docs.splunk.com/Splexicon:Streamingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

A subsearch can be initiated through a search command such as the `search` command. See [Initiating subsearches with search commands](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the Splunk Cloud Platform *Search Manual*.

### The implied search command

The `search` command is implied at the beginning of every search.

When `search` is the first command in the search, you can use terms such as keywords, phrases, fields, boolean expressions, and comparison expressions to specify exactly which events you want to retrieve from Splunk indexes. If you don't specify a field, the search looks for the terms in the the `_raw` field.

Some examples of search terms are:

* keywords: `error login`, which is the same as specifying for `error AND login`
* quoted phrases: `"database error"`
* boolean operators: `login NOT (error OR fail)`
* wildcards: `fail*`
* field-value pairs: `status=404, status!=404, or status>200`

Note: To search field values that are SPL operators or keywords, such as `country=IN`, `country=AS`, `iso=AND`, or `state=OR`, you must enclose the operator or keyword in quotation marks. For example: `country="IN"`.

See [Use the search command](/en/?resourceId=Splunk_Search_Usethesearchcommand) in the *Search Manual*.

### Using the search command later in the search pipeline

In addition to the implied `search` command at the beginning of all searches, you can use the `search` command later in the search pipeline. The search terms that you can use depend on which fields are passed into the `search` command.

If the `_raw` field is passed into the `search` command, you can use the same types of search terms as you can when the `search` command is the first command in a search.

However, if the `_raw` field is not passed into the `search` command, you must specify field-values pairs that match the fields passed into the `search` command. Transforming commands, such as `stats` and `chart`, do not pass the `_raw` field to the next command in the pipeline.

### Boolean expressions

The order in which Boolean expressions are evaluated with the `search` command is:

1. Expressions within parentheses
2. NOT clauses
3. OR clauses
4. AND clauses

This evaluation order is different than the order used with the `eval` and `where` commands, which evaluate AND before OR clauses. The `search` command doesn't support XOR.

See [Boolean expressions with logical operators](/en/?resourceId=Splunk_Search_Booleanexpressions) in the Splunk platform *Search Manual*.

### Comparing two fields

To compare two fields, do not specify `index=myindex fieldA=fieldB` or `index=myindex fieldA!=fieldB` with the `search` command. When specifying a comparison\_expression, the `search` command expects a <field> compared with a <value>. The `search` command interprets `fieldB` as the value, and not as the name of a field.

Use the `where` command to compare two fields.

index=myindex | where fieldA=fieldB

For not equal comparisons, you can specify the criteria in several ways.

index=myindex | where fieldA!=fieldB

or

index=myindex | where NOT fieldA=fieldB

See [Difference between NOT and !=](/en/?resourceId=Splunk_Search_NOTexpressions) in the *Search Manual*.

### Filter using the IN operator

Use the IN operator when you want to determine if a field contains one of several values.

For example, use this syntax:

... error\_code IN (400, 402, 404, 500) | ...

Instead of this syntax:

... error\_code=400 OR error\_code=402 OR error\_code=404 OR error\_code=500 | ...

When used with the `search` command, you can use a wildcard character ( \* ) in the list of values for the IN operator. For example:

... error\_code IN (40\*, 500) | ...

You can use the NOT operator with the IN operator. For example:

... NOT clientip IN (211.166.11.101, 182.236.164.11, 128.241.220.82) | ...

There is also an IN function that you can use with the `eval` and `where` commands. Wild card characters are not allowed in the values list when the IN function is used with the `eval` and `where` commands. See [Comparison and Conditional functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions).

### CIDR matching

The `search` command can perform a CIDR match on a field that contains IPv4 and IPv6 addresses.

Suppose the `ip` field contains these values:

10.10.10.12

50.10.10.17

10.10.10.23

If you specify `ip="10.10.10.0/24"`, the search returns the events with the first and last values: 10.10.10.12 and 10.10.10.23.

### Lexicographical order

Lexicographical order sorts items based on the values used to encode the items in computer memory. In Splunk software, this is almost always UTF-8 encoding, which is a superset of ASCII.

* Numbers are sorted before letters. Numbers are sorted based on the first digit. For example, the numbers 10, 9, 70, 100 are sorted lexicographically as 10, 100, 70, 9.
* Uppercase letters are sorted before lowercase letters.
* Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.

You can specify a custom sort order that overrides the lexicographical order. See the blog [Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html).

### Quotes and escaping characters

In general, you need quotation marks around phrases and field values that include white spaces, commas, pipes, quotations, and brackets. Quotation marks must be balanced. An opening quotation must be followed by an unescaped closing quotation. For example:

* A search such as `error | stats count` will find the number of events containing the string error.
* A search such as `... | search "error | stats count"` would return the raw events containing error, a pipe, stats, and count, in that order.

Additionally, use quotation marks around keywords and phrases if you don't want to search for their default meaning, such as Boolean operators and field/value pairs. For example:

* A search for the keyword AND without meaning the Boolean operator: `error "AND"`
* A search for this field/value phrase: `error "startswith=foo"`

The backslash character (&nbsp\&nbsp) is used to escape quotes, pipes, and the backslash character itself. Backslash escape sequences are expanded inside quotation marks. For example:

* The sequence `\|` as part of a search sends a pipe character to the command, instead of using the pipe as a split between commands.
* The sequence `\"` sends a literal quotation mark to the command. For example, this is useful if you want to search for a literal quotation mark or insert a literal quotation mark into a field using regular expressions.
* The `\\` sequence sends a literal backslash to the command.

Unrecognized backslash sequences are not altered:

* For example, `\s` in a search string is available as `\s` to the command, because `\s` is not a known escape sequence.
* However, the search string `\\s` is available as `\s` to the command, because `\\` is a known escape sequence that is converted to `\`.

See [Backslashes](/en/?resourceId=Splunk_Search_Backslashes) in the *Search Manual*.

### Search with TERM()

You can use the TERM() directive to force Splunk software to match whatever is inside the parentheses as a single term in the index. TERM is more useful when the term contains minor segmenters, such as periods, and is bounded by major segmenters, such as spaces or commas. In fact, TERM does not work for terms that are not bounded by major breakers.

See [Use CASE and TERM to match phrases](/en/?resourceId=Splunk_Search_UseCASEandTERMtomatchphrases) in the *Search Manual*.

### Search with CASE()

You can use the CASE() directive to search for terms and field values that are case-sensitive.

See [Use CASE and TERM to match phrases](/en/?resourceId=Splunk_Search_UseCASEandTERMtomatchphrases) in the *Search Manual*.

## Examples

These examples demonstrate how to use the `search` command. You can find more examples in the [Start Searching](/en/?resourceId=Splunk_SearchTutorial_Startsearching) topic of the [Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial).

### 1. Field-value pair matching

This example demonstrates field-value pair matching for specific values of source IP (src) and destination IP (dst).

src="10.9.165.\*" OR dst="10.9.165.8"

### 2. Using boolean and comparison operators

This example demonstrates field-value pair matching with boolean and comparison operators. Search for events with code values of either 10 or 29, and any host that isn't "localhost", and an `xqp` value that is greater than 5.

(code=10 OR code=29) host!="localhost" xqp>5

In this example you could also use the IN operator since you are specifying two field-value pairs on the same field. The revised search is:

code IN(10, 29) host!="localhost" xqp>5

### 3. Using wildcards

This example demonstrates field-value pair matching with wildcards. Search for events from all the web servers that have an HTTP client or server error status.

host=webserver\* (status=4\* OR status=5\*)

In this example you could also use the IN operator since you are specifying two field-value pairs on the same field. The revised search is:

host=webserver\* status IN(4\*, 5\*)

### 4. Using the IN operator

This example shows how to use the IN operator to specify a list of field-value pair matchings. In the events from an access.log file, search the `action` field for the values `addtocart` or `purchase`.

sourcetype=access\_combined\_wcookie action IN (addtocart, purchase)

### 5. Specifying a secondary search

This example uses the `search` command twice. The `search` command is implied at the beginning of every search with the criteria `eventtype=web-traffic`. The `search` command is used again later in the search pipeline to filter out the results. This search defines a web session using the `transaction` command and searches for the user sessions that contain more than three events.

eventtype=web-traffic | transaction clientip startswith="login" endswith="logout" | search eventcount>3

### 6. Using the NOT or != comparisons

Searching with the boolean "NOT"comparison operator is not the same as using the "!=" comparison.

The following search returns everything except fieldA="value2", including all other fields.

NOT fieldA="value2"

The following search returns events where `fieldA` exists and does not have the value "value2".

fieldA!="value2"

If you use a wildcard for the value, `NOT fieldA=*` returns events where fieldA is null or undefined, and `fieldA!=*` never returns any events.

See [Difference between NOT and !=](/en/?resourceId=Splunk_Search_Usethesearchcommand) in the *Search Manual*.

### 7. Using search to perform CIDR matching

You can use the `search` command to match IPv4 and IPv6 addresses and subnets that use CIDR notation. For example, this search identifies whether the specified IPv4 address is located in the subnet.

| makeresults
| eval ip="192.0.2.56"
| search ip="192.0.2.0/24"

The IP address is located in the subnet, so search displays it in the search results, which look like this.

| time | ip |
| --- | --- |
| 2020-11-19 16:43:31 | 192.0.2.56 |

Note that you can get identical results using the `eval` command with the [cidrmatch("X",Y)](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions) function, as shown in this example.

| makeresults
| eval ip="192.0.2.56"
| where cidrmatch("192.0.2.0/24", ip)

Alternatively, if you're using IPv6 addresses, you can use the `search` command to identify whether the specified IPv6 address is located in the subnet.

| makeresults
| eval ip="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99"
| search ip="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff00/120"

The IP address is in the subnet, so the search results look like this.

| time | ip |
| --- | --- |
| 2020-11-19 16:43:31 | 2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99 |

### See also

Commands

[iplocation](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iplocation#id_4c1ae8b1_28de_453b_8d46_fbc07b9ea651__iplocation)

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

Functions

[cidrmatch](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions)
