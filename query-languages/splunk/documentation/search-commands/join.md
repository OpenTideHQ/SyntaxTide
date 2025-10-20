# join

## Description

You can use the `join` command to combine the results of a main search (left-side dataset) with the results of either another dataset or a subsearch (right-side dataset). You can also combine a search result set to itself using the `selfjoin` command.

The left-side dataset is the set of results from a search that is piped into the `join` command and then merged on the right side with the either a dataset or the results from a subsearch. The left-side dataset is sometimes referred to as the source data.

The following search example joins the source data from the search pipeline with a subsearch on the right side. Rows from each dataset are merged into a single row if the `where` predicate is satisfied.

<left-dataset>
| join left=L right=R where L.pid = R.pid [subsearch]

A maximum of 50,000 rows in the right-side dataset can be joined with the left-side dataset over a maximum runtime of 60 seconds. These maximum defaults are set to limit the impact of the `join` command on performance and resource consumption.

If you are familiar with SQL but new to SPL, see [Splunk SPL for SQL users](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/splunk-spl-for-sql-users#e4bc11a8_84ab_4f96_8374_ddd2b86db298__Splunk_SPL_for_SQL_users).

## Alternative commands

For flexibility and performance, consider using one of the following commands if you do not require join semantics. These commands provide event grouping and correlations using time and geographic location, transactions, subsearches, field lookups, and joins.

| Command | Use |
| --- | --- |
| `append` | To append the results of a subsearch to the results of your current search. The events from both result sets are retained.  * Use only with historical data. The `append` command does not produce correct results if used in a real-time search. * If you use `append` to combine the events, use a `stats` command to group the events in a meaningful way. You cannot use a `transaction` command after you use an `append` command. |
| `appendcols` | Appends the fields of the [subsearch](https://docs.splunk.com/Splexicon:Subsearch) results with the input search result fields. The first subsearch result is merged with the first main result, the second subsearch result is merged with the second main result, and so on. |
| `lookup` | Use when one of the result sets or source files remains static or rarely changes. For example, a file from an external system such as a CSV file. The lookup cannot be a subsearch. |
| `search` | In the most simple scenarios, you might need to search only for sources using the OR operator and then use a `stats` or `transaction` command to perform the grouping operation on the events. |
| `stats` | To group events by a field and perform a statistical function on the events. For example to determine the average duration of events by host name.  * To use `stats`, the field must have a unique identifier. * To view the raw event data, use the `transaction` command instead. |
| `transaction` | Use `transaction` in the following situations.  * To group events by using the `eval` command with a conditional expression, such as `if`, `case`, or `match`. * To group events by using a recycled field value, such as an ID or IP address. * To group events by using a pattern, such as a start or end time for the event. * To break up groups larger than a certain duration. For example, when a transaction does not explicitly end with a message and you want to specify a maximum span of time after the start of the transaction. * To display the raw event data for the grouped events. |

For information about when to use a join, see the flowchart in [About event grouping and correlation](/en/?resourceId=Splunk_Search_Abouteventcorrelation) in the *Search Manual*.

## Syntax

The required syntax is in bold.

join

[<join-options>...]

[<field-list>] | [left=<left-alias>] [right=<right-alias>] where <left-alias>.<field>=<right-alias>.<field> [<left-alias>.<field>=<right-alias>.<field>]...

<dataset-type>:<dataset-name>
| <subsearch>

### Required arguments

dataset-type

Syntax: datamodel | savedsearch | inputlookup

Description: The type of dataset that you want to use to join with the source data. The dataset must be a dataset that you created or are authorized to use. You can specify `datamodel`, `savedsearch`, or `inputlookup`. The dataset type must precede the dataset name. For example, `savedsearch:<dataset-name>`.

You can use either `<dataset-type>:<dataset-name>` or `<subsearch>` with the `join` command, but not both.

dataset-name

Syntax: <dataset-name>

Description: The name of the dataset that you want to use to join with the source data. The dataset must be a dataset that you created or are authorized to use. The dataset name must follow the dataset type. For example, if the dataset name is `january` and the dataset type is datamodel, you specify `datamodel:january`.

You can use either `<dataset-type>:<dataset-name>` or `<subsearch>` with the `join` command, but not both.

subsearch

Syntax: [<subsearch>]

Description: A secondary search or dataset that specifies the source of the events that you want to join to. The subsearch must be enclosed in square brackets. The results of the subsearch should not exceed available memory.

You can use either `<dataset-type>:<dataset-name>` or `<subsearch>` in a search, but not both. When `[<subsearch>]` is used in a search by itself with no join keys, the Splunk software autodetects common fields and combines the search results before the `join` command with the results of the subsearch.

### Optional arguments

join-options

Syntax: type=(inner | outer | left) | usetime=<bool> | earlier=<bool> | overwrite=<bool> | max=<int>

Description: Arguments to the join command. Use either `outer` or `left` to specify a left outer join. See [Descriptions for the join-options argument](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#id_62219ef0_0a0e_42d5_99a8_ab6e040a90cb__Descriptions_for_the_join-options_argument) in this topic.

field-list

Syntax: <field> <field> ...

Description: Specify the list of fields to use for the join. For example, to join fields `ProductA`, `ProductB`, and `ProductC`, you would specify `| join ProductA ProductB ProductC...`. If `<field-list>` is specified, one or more of the fields must be common to each dataset. If no fields are specified, all of the fields that are common to both datasets are used.

The values of the fields used in `<field-list>` are case sensitive. For example, a value that is all uppercase in the main search will not match the same value that is all lowercase in the subsearch. See the example later in this topic about [performing a case-insensitive join](/en/?resourceId=Splunk_SearchReference_Join).

left alias

Syntax: left=<left-alias>

Description: The alias to use with the left-side dataset, the source data, to avoid naming collisions. Must be combined with the right alias and `where` clause, or the alias is ignored.

The left alias must be used together with the right alias.

right alias

Syntax: right=<right-alias>

Description: The alias to use with the right-side dataset to avoid naming collisions. Must be combined with the left alias and the `where` clause, or the alias is ignored.

The right alias must be used together with the left alias.

where clause

Syntax: where <left-alias>.<field>=<right-alias>.<field>...

Description: Identifies the names of the fields in the left-side dataset and the right-side dataset that you want to join on. You must specify the left and right aliases and the field name. Fields that are joined from the left and right datasets do not have to have the same names. For example: `where L.host=R.user` matches events in the `host` field from the left dataset with events in the `user` field from the right dataset.

The `where` clause must be used with the right and left aliases and field name.

You can specify the aliases and fields in a `where` clause on either side of the equal sign. For example:

`where <left-alias>.<left-field>=<right-alias>.<right-field>`

or

`where <right-alias>.<right-field>=<left-alias>.<left-field>`

### Descriptions for the join-options argument

type

Syntax: type=inner | outer | left

Description: Indicates the type of join to perform. The difference between an `inner` and a `left` (or `outer`) join is how the events are treated in the main search that do not match any of the events in the subsearch. In both inner and left joins, events that match are joined. The results of an `inner` join do not include events from the main search that have no matches in the subsearch. The results of a `left` (or `outer`) join includes all of the events in the main search and only those values in the subsearch have matching field values.

Default:
`inner`

![An image that shows two venn diagrams. Each diagram contains two intersecting circles, circle A and circle B. The first diagram is labeled Left Join and circle A is completely shaded, including the portion of the circle where it overlaps with circle B. The second diagram is labeled Inner Join and only the portion of circle A that overlaps with circle B is shaded.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8250c582-7d48-4072-836d-953469a42636?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4MjUwYzU4Mi03ZDQ4LTQwNzItODM2ZC05NTM0NjlhNDI2MzYiLCJleHAiOjE3NjEwNjAxMzksImp0aSI6ImQxMGJhOTQ5ZTc0YjQwZWRhNDQ0M2U1NGE4NzcxNTRmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.FmxP4qbYs2_cQ_jsjokzouTVHWv2IC9XYmQ04S6wc4w)

usetime

Syntax: usetime=<bool>

Description: A Boolean value that Indicates whether to use time to limit the matches in the subsearch results. Used with the `earlier` option to limit the subsearch results to matches that are earlier or later than the main search results.

If you use the `join` command with `usetime=true` and `type=left`, the search results are similar to those of an inner join. This is because there might be non-matching results when using the left join that are the same as those produced by an inner join.

Default:
`false`

earlier

Syntax: earlier=<bool>

Description: If `usetime=true` and `earlier=true`, the main search results are matched only against earlier results from the subsearch. If `earlier=false`, the main search results are matched only against later results from the subsearch. Results that occur at the same time (second) are not eliminated by either value.

Default:
`true`

overwrite

Syntax: overwrite=<bool>

Description: If fields in the main search results and subsearch results have the same name, indicates whether fields from the subsearch results overwrite the fields from the main search results.

Default:
`true`

max

Syntax: max=<int>

Description: Specifies the maximum number of subsearch results that each main search result can join with. If set to `max=0`, there is no limit.

Default:
`1`

## Usage

The `join` command is a centralized streaming command when there is a defined set of fields to join to. Otherwise the command is a dataset processing command.
See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

A subsearch can be initiated through a search command such as the `join` command. See [Initiating subsearches with search commands](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the Splunk Cloud Platform *Search Manual*.

### Limitations on subsearches in joins

Use the `join` command when the results of the subsearch are relatively small, for example 50,000 rows or less. To minimize the impact of this command on performance and resource consumption, Splunk software imposes some default limitations on the subsearch.

Limitations on the subsearch for the `join` command are specified in the `limits.conf` file. The default limitations include a maximum of 50,000 rows in the subsearch to join against, and a maximum search time of 60 seconds for the subsearch. See [Subsearches](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the *Search Manual*.

Splunk Cloud Platform

To change the limits.conf settings `subsearch_maxout` or `subsearch_maxtime`, use one of the following methods:

* The Configure limits page in Splunk Web. For more information, see [Configure limits using Splunk Web](/en/?resourceId=SplunkCloud_Admin_ConfigureLimits) in the *Splunk Cloud Platform Admin Manual*.
* The Admin Config Service (ACS) API. For more information, see [Manage limits.conf configurations in Splunk Cloud Platform](/en/?resourceId=SplunkCloud_Config_ManageLimits) in the Splunk Cloud Platform *Admin Config Service Manual*.
* The Admin Config Service (ACS) command line interface (CLI). For more information, see [Administer Splunk Cloud Platform using the ACS CLI](/en/?resourceId=SplunkCloud_Config_ACSCLI) in the Splunk Cloud Platform *Admin Config Service Manual*.

Splunk Enterprise

To change the `subsearch_maxout` or `subsearch_maxtime` settings in your limits.conf file for `join` command subsearches, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file at $SPLUNK\_HOME/etc/system/local on the search head.
2. Under the `[join]` stanza, add the line `subsearch_maxout = <value>` or `subsearch_maxtime = <value>`.

### One-to-many and many-to-many relationships

To return matches for one-to-many, many-to-one, or many-to-many relationships, include the `max` argument in your `join` syntax and set the value to 0. By default `max=1`, which means that the subsearch returns only the first result from the subsearch. Setting the value to a higher number or to 0, which is unlimited, returns multiple results from the subsearch.

## Basic examples

### 1. A basic join

Combine the results from a main search with the results from a subsearch `search vendors`. The result sets are joined on the `product_id` field, which is common to both sources.

... | join product\_id [search vendors]

### 2. Returning all subsearch rows

By default, only the first row of the subsearch that matches a row of the main search is returned. To return all of the matching subsearch rows, include the `max=<int>` argument and set the value to 0. This argument joins each matching subsearch row with the corresponding main search row.

... | join product\_id max=0 [search vendors]

### 3. Join datasets on fields that have the same name

Combine the results from a search with the `vendors` dataset. The data is joined on the `product_id` field, which is common to both datasets.

... | join left=L right=R where L.product\_id=R.product\_id [search vendors]

### 4. Join datasets on fields that have different names

Combine the results from a search with the `vendors` dataset. The data is joined on a product ID field, which have different field names in each dataset. The field in the left-side dataset is `product_id`. The field in the right-side dataset is `pid`.

... | join left=L right=R where L.product\_id=R.pid [search vendors]

### 5. Use words instead of letters as aliases

You can use words for the aliases to help identify the datasets involved in the join. This example uses `products` and `vendors` for the aliases.

... | join left=products right=vendors where products.product\_id=vendors.pid [search vendors]

### 6. Perform a case-insensitive join

Say you want to join a field with values that have prefixes that use both upper and lower case letters. But, the `<field-list>` argument for the `join` command is case sensitive. To work around this limitation, you can make the case consistent before and after you perform the join by using the `lower()` or `upper()` evaluation function. In this example, the value for the `myfield` field is converted to lower case, which makes the case consistent for the `join` command.

... | eval myfield=lower(myfield) | join myfield [... | eval myfield=lower(myfield)]

See [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

## Extended examples

### 1. Specifying dataset aliases with a saved search dataset

This example joins each matching right-side dataset row with the corresponding source data row. This example uses `products`, which is a savedsearch type of dataset, for the right-side dataset. The field names in the left-side dataset and the right-side dataset are different. This search returns all of the matching rows in the left and right datasets by including `max=0` in the search.

... | join max=0 left=L right=R where L.vendor\_id=R.vid savedsearch:products

### 2. Use aliasing with commands following the join

Commands following the join can take advantage of the aliasing provided through the `join` command. For example, you can use the aliasing in another command like `stats` as shown in the following example.

... | join left=L right=R where L.product\_id=R.pid [search vendors] | stats count by L.product\_id

### 3. Using a join to display resource usage information

The dashboards and alerts in the distributed management console shows you performance information about your Splunk deployment. The Resource Usage: Instance dashboard contains a table that shows the machine, number of cores, physical memory capacity, operating system, and CPU architecture.

To display the information in the table, use the following search. This search includes the `join` command. The search uses the information in the dmc\_assets table to look up the instance name and machine name. The search then uses the `serverName` field to join the information with information from the `/services/server/info` REST endpoint. The `/services/server/info` is the URI path to the Splunk REST API endpoint that provides hardware and operating system information for the machine. The `$splunk_server$` part of the search is a dashboard token variable.

| inputlookup dmc\_assets
| search serverName = $splunk\_server$
| stats first(serverName) AS serverName, first(host) AS host, first(machine) AS machine
| join type=left serverName
[ | rest splunk\_server=$splunk\_server$ /services/server/info
| fields serverName, numberOfCores, physicalMemoryMB, os\_name, cpu\_arch]
| fields machine numberOfCores physicalMemoryMB os\_name cpu\_arch
| rename machine AS Machine, numberOfCores AS "Number of Cores",
physicalMemoryMB AS "Physical Memory Capacity (MB)", os\_name AS "Operating System",
cpu\_arch AS "CPU Architecture"

## See also

[selfjoin](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/selfjoin#id_47a009d1_83cc_4ce6_b4ff_de5327c1e9a9__selfjoin), [append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append), [set](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/set#id_653646ef_cdac_43a6_a15e_06f61dcfbdd9__set), [appendcols](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendcols#id_40e2fdd2_c8c8_4059_b826_db6a95005a6a__appendcols)
