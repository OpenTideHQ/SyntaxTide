# mcatalog

CAUTION: The `mcatalog` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

The `mcatalog` command performs aggregations on the values in the `metric_name` and `dimension` fields in the metric indexes.

## Syntax

| mcatalog [prestats=<bool>] [append=<bool>] ( <values"("<field> ")"> [AS <field>] )

[WHERE <logical-expression>] [ (BY|GROUPBY) <field-list> ]

### Required arguments

values (<field>)

Syntax: values(<field>) [AS <field>]

Description: Returns the list of all distinct values of the specified field as a multivalue entry. The order of the values is lexicographical. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/mcatalog#id_7ea5abcb_a7f7_438f_90a5_cb5376ce133d__Usage).

### Optional arguments

append

Syntax: append=<bool>

Description: Valid only when `prestats=true`. This argument runs the `mcatalog` command and adds the results to an existing set of results instead of generating new results.

Default: false

<field-list>

Syntax: <field>, ...

Description: Specify one or more fields to group results.

<logical-expression>

Syntax: <time-opts>|<search-modifier>|((NOT)? <logical-expression>)|<index-expression>|<comparison-expression>|(<logical-expression> (OR)? <logical-expression>)

Description: Includes time and search modifiers, comparison, and index expressions. Does not support CASE or TERM directives. You also cannot use the WHERE clause to search for terms or phrases.

prestats

Syntax: prestats=true | false

Description: Specifies whether to use the prestats format. The prestats format is a Splunk internal format that is designed to be consumed by commands that generate aggregate calculations. When using the prestats format you can pipe the data into the [chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats), or [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart) commands, which are designed to accept the prestats format. When `prestats=true`, AS instructions are not relevant. The field names for the aggregates are determined by the command that consumes the prestats format and produces the aggregate output.

Default: false

### Logical expression options

<comparison-expression>

Syntax: <field><comparison-operator><value> | <field> IN (<value-list>)

Description: Compare a field to a literal value or provide a list of values that can appear in the field.

<index-expression>

Syntax: "<string>" | <term> | <search-modifier>

Description: Describe the events you want to retrieve from the index using literal strings and search modifiers.

<time-opts>

Syntax: [<timeformat>] (<time-modifier>)\*

Description: Describe the format of the starttime and endtime terms of the search

### Comparison expression options

<comparison-operator>

Syntax: = |  != | < | <= | > | >=

Description: You can use comparison operators when searching field/value pairs. Comparison expressions with the `equal ( = )` or `not equal ( != )` operator compare string values. For example, "1" does not match "1.0". Comparison expressions with greater than or less than operators `< > <= >=` numerically compare two numbers and lexicographically compare other values. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/mcatalog#id_7ea5abcb_a7f7_438f_90a5_cb5376ce133d__Usage).

<field>

Syntax: <string>

Description: The name of a field.

<value>

Syntax: <literal-value>

Description: In comparison-expressions, the literal number or string value of a field.

<value-list>

Syntax: (<literal-value>, <literal-value>, ...)

Description: Used with the IN operator to specify two or more values. For example use `error IN (400, 402, 404, 406)` instead of `error=400 OR error=402 OR error=404 OR error=406`

### Index expression options

<string>

Syntax: "<string>"

Description: Specify keywords or quoted phrases to match. When searching for strings and quoted strings (anything that's not a search modifier), Splunk software searches the `_raw` field for the matching events or results.

<search-modifier>

Syntax: <sourcetype-specifier> | <host-specifier> | <source-specifier> | <splunk\_server-specifier>

Description: Search for events from specified fields. For example, search for one or a combination of hosts, sources, and source types. See [searching with default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields) in the *Knowledge Manager manual*.

<sourcetype-specifier>

Syntax: sourcetype=<string>

Description: Search for events from the specified sourcetype field.

<host-specifier>

Syntax: host=<string>

Description: Search for events from the specified host field.

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

Note: You can also use the earliest and latest attributes to specify absolute and relative time ranges for your search.

For more about this time modifier syntax, see [About search time ranges](/en/?resourceId=Splunk_Search_Aboutsearchtimeranges) in the *Search Manual*.

starttime

Syntax: starttime=<string>

Description: Events must be later or equal to this time. Must match `timeformat`.

endtime

Syntax: endtime=<string>

Description: All events must be earlier or equal to this time.

## Usage

You use the `mcatalog` command to search metrics data. The metrics data uses a specific format for the metrics fields. See
[Metrics data format](/en/?resourceId=Splunk_Metrics_GetStarted) in *Metrics*. The `_values` field is not allowed with this command.

The `mcatalog` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) for reports. Generating commands use a leading pipe character. The `mcatalog` command must be the first command in a search pipeline, except when `append=true`.

Note: If your role does not have the `list_metrics_catalog` capability, you cannot use `mcatalog`.

See [About defining roles with capabilities](/en/?resourceId=Splunk_Security_Rolesandcapabilities) in the *Securing Splunk Enterprise* manual.

### WHERE

Use the WHERE clause to filter by supported dimensions.

If you do not specify an index name in the WHERE clause, the `mcatalog` command returns results from the default metrics indexes associated with your role. If you do not specify an index name and you have no default metrics indexes associated with your role, `mcatalog` returns no results. To search against all metrics indexes use `WHERE index=*`.

For more information about defining default metrics indexes for a role in Splunk Enterprise, see [Create and manage roles with Splunk Web](/en/?resourceId=Splunk_Security_Addandeditroles) in *Securing Splunk Enterprise*.

For more information about defining default metrics indexes for a role in Splunk Cloud Platform, see [Create and manage roles with Splunk Web](/en/?resourceId=Splunk_Security_Addandeditroles) in *Securing Splunk Cloud Platform*.

### Group by

You can group by `dimension` and `metric_name` fields.

Note: The `mcatalog` command does not allow grouping by time ranges. The span-length argument is not included in its syntax.

### Time dimensions

The `mcatalog` command does not recognize the following time-related dimensions.

| Unsupported dimensions |  |  |
| --- | --- | --- |
| `date_hour`   `date_mday`   `date_minute`  `date_month`  `date_second` | `date_wday`   `date_year`   `date_zone`  `metric_timestamp`  `time` | `timeendpos`   `timestamp`   `timestartpos` |

### Lexicographical order

Lexicographical order sorts items based on the values used to encode the items in computer memory. In Splunk software, this is almost always UTF-8 encoding, which is a superset of ASCII.

* Numbers are sorted before letters. Numbers are sorted based on the first digit. For example, the numbers 10, 9, 70, 100 are sorted lexicographically as 10, 100, 70, 9.
* Uppercase letters are sorted before lowercase letters.
* Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.

You can specify a custom sort order that overrides the lexicographical order. See the blog [Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html%7C).

## Examples

### 1. Return all of the metric names in a specific metric index

Return all of the metric names in the `new-metric-idx`.

| mcatalog values(metric\_name) WHERE index=new-metric-idx

### 2. Return all metric names in the default metric indexes associated with the role of the user

If the user role has no default metric indexes assigned to it, the search returns no events.

| mcatalog values(metric\_name)

### 3. Return all IP addresses for a specific metric\_name among all metric indexes

Return of the IP addresses for the `login.failure` metric name.

| mcatalog values(ip) WHERE index=\* AND metric\_name=login.failure

### 4. Return a list of all available dimensions in the default metric indexes associated with the role of the user

| mcatalog values(\_dims)

In a distributed search environment, this search is equivalent to `| mcatalog values(_dims) WHERE index=default_metric_index`.
