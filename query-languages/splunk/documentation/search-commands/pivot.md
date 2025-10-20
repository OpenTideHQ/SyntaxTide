# pivot

## Description

The `pivot` command makes simple pivot operations fairly straightforward, but can be pretty complex for more sophisticated pivot operations. Fundamentally this command is a wrapper around the `stats` and `xyseries` commands.

The `pivot` command does not add new behavior, but it might be easier to use if you are already familiar with how Pivot works. See the [Pivot Manual](/en/?resourceId=Splunk_Pivot_IntroductiontoPivot). Also, read how to [open non-transforming searches in Pivot](/en/?resourceId=Splunk_Search_OpeninPivot).

Run pivot searches against a particular [data model](https://docs.splunk.com/Splexicon:Datamodel) object. This requires a large number of inputs: the data model, the data model object, and pivot elements.

## Syntax

| pivot <datamodel-name> <object-name> <pivot-element>

### Required arguments

datamodel-name

Syntax: <string>

Description: The name of the data model to search.

objectname

Syntax: <string>

Description: The name of a data model object to search.

pivot element

Syntax: (<cellvalue>)\* (SPLITROW <rowvalue>)\* (SPLITCOL colvalue [options])\* (FILTER <filter expression>)\* (LIMIT <limit expression>)\* (ROWSUMMARY <true | false>)\* (COLSUMMARY <true | false>)\* (SHOWOTHER <true | false>)\* (NUMCOLS <num>)\* (rowsort [options])\*

Description: Use pivot elements to define your pivot table or chart. Pivot elements include cell values, split rows, split columns, filters, limits, row and column formatting, and row sort options. Cell values always come first. They are followed by split rows and split columns, which can be interleaved, for example: `avg(val), SPLITCOL foo, SPLITROW bar, SPLITCOL baz`.

### Cell value

<cellvalue>

Syntax: <function>(fieldname) [AS <label>]

Description: Define the values of a cell and optionally rename it. Here, `label` is the name of the cell in the report.

The set of allowed functions depend on the data type of the `fieldname`:

* Strings: list, values, first, last, count, and distinct\_count (dc)
* Numbers: sum, count, avg, max, min, stdev, list, and values
* Timestamps: duration, earliest, latest, list, and values
* Object or child counts: count

### Descriptions for row split-by elements

SPLITROW <rowvalue>

Syntax: SPLITROW <field> [AS <label>] [RANGE start=<value> end=<value> max=<value> size=<value>] [PERIOD (auto | year | month | day | hour | minute | second)] [TRUELABEL <label>] [FALSELABEL <label>]

Description: You can specify one or more of these options on each SPLITROW. The options can appear in any order. You can rename the <field> using "AS <label>", where "label" is the name of the row in the report.

Other options depend on the data type of the <field> specified:

* RANGE applies only for numbers. You do not need to specify all of the options (start, end, max, and size).
* PERIOD applies only for timestamps. Use it to specify the period to bucket by.
* TRUELABEL applies only for booleans. Use it to specify the label for true values.
* FALSELABEL applies only for booleans. Use it to specify the label for false values.

### Descriptions for column split-by elements

SPLITCOL colvalue <options>

Syntax: fieldname [ RANGE start=<value> end=<value> max=<value> size=<value>] [PERIOD (auto | year | month| day | hour | minute | second)] [TRUELABEL <label>] [FALSELABEL <label>]

Description: You can have none, some, or all of these options on each SPLITCOL. They may appear in any order.

Other options depend on the data type of the field specified (fieldname):

* RANGE applies only for numbers. The options (start, end, max, and size) do not all have to be specified.
* PERIOD applies only for timestamps. Use it to specify the period to bucket by.
* TRUELABEL applies only for booleans. Use it to specify the label for true values.
* FALSELABEL applies only for booleans. Use it to specify the label for false values.

### Descriptions for filter elements

Filter <filter expression>

Syntax: <fieldname> <comparison-operator> <value>

Description: The expression used to identify values in a field. The comparison operator that you use depends on the type of field value.

* Strings: is, contains, in, isNot, doesNotContain, startsWith, endsWith, isNull, isNotNull

For example: ... filter *fieldname* in (*value1*, *value2*, ...)

* ipv4: is, contains, isNot, doesNotContain, startsWith, isNull, isNotNull
* Numbers: =, !=, <, <=, >, >=, isNull, isNotNull
* Booleans: is, isNull, isNotNull

### Descriptions for limit elements

Limit <limit expression>

Syntax: LIMIT <fieldname> BY <limittype> <number> <stats-function>(<fieldname>)

Description: Use to limit the number of elements in the pivot. The `limittype` argument specifies where to place the limit. The valid values are `top` or `bottom`. The `number` argument must be a positive integer. You can use any stats function, such as `min`, `max`, `avg`, and `sum`.

Example: LIMIT foo BY TOP 10 avg(bar)

## Usage

The `pivot` command is a [report-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

## Examples

Example 1: This command counts the number of events in the "HTTP Requests" object in the "Tutorial" data model.

| pivot Tutorial HTTP\_requests count(HTTP\_requests) AS "Count of HTTP requests"

This can be formatted as a single value report in the dashboard panel:

![Pivot command single panel.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/07b9cfcd-4435-4e1a-beff-9ebf965df903?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwN2I5Y2ZjZC00NDM1LTRlMWEtYmVmZi05ZWJmOTY1ZGY5MDMiLCJleHAiOjE3NjEwNjAxNzMsImp0aSI6IjE1ZDA3NjE0YTcyOTRiZjY4YzE5YWMxMjM5YTYxMTAyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.vMObFtm2JJGUXu76cqJ-mHk1d8QK0Ttino0N0nT6wsk)

Example 2: Using the Tutorial data model, create a pivot table for the count of "HTTP Requests" per host.

| pivot Tutorial HTTP\_requests count(HTTP\_requests) AS "Count" SPLITROW host AS "Server" SORT 100 host

![Pivot command table.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/0d17f256-f15c-453a-805a-63da0e820b18?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwZDE3ZjI1Ni1mMTVjLTQ1M2EtODA1YS02M2RhMGU4MjBiMTgiLCJleHAiOjE3NjEwNjAxNzMsImp0aSI6IjFiMTI5YmEwZTc5MjRiOTVhMjA0ZjAwMjNiZDNkOGM3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.D67Jl4mJZsq51Lp3r6_BjJZ8-8u-tsQ6k5bTkCK33Iw)

## See also

[datamodel](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel), [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats), [xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries)
