# tstats

## Description

Use the `tstats` command to perform statistical queries on indexed fields in [tsidx](https://docs.splunk.com/Splexicon:Tsidxfile) files. The indexed fields can be from indexed data or accelerated data models.

Because it searches on index-time fields instead of raw events, the `tstats` command is faster than the `stats` command.

By default, the `tstats` command runs over accelerated and unaccelerated data models.

Note: Certain restricted search commands, including `mpreview`, `mstats`, and `tstats` might stop working if your organization uses field filters to protect sensitive data. See [Plan for field filters in your organization](/en/?resourceId=Splunk_Security_planfieldfilters) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold.

| tstats

[prestats=<bool>]

[local=<bool>]

[append=<bool>]

[summariesonly=<bool>]

[include\_reduced\_buckets=<bool>]

[allow\_old\_summaries=<bool>]

[chunk\_size=<unsigned int>]

[fillnull\_value=<string>]

<stats-func>...

[ FROM datamodel=<data\_model\_name>.<root\_dataset\_name> [where nodename = <root\_dataset\_name>.<...>.<target\_dataset\_name>]]

[ WHERE <search-query> | <field> IN (<value-list>)]

[ BY (<field-list> | (PREFIX(<field>))) [span=<timespan>]]

### Required arguments

<stats-func>

Syntax: (count [<field>] | <function>(PREFIX(<string>) | <field>))... [AS <string>]

Description: Either perform a basic count of a field or perform a function on a field. For a list of the supported functions for the `tstats` command, refer to the table below. You must specify one or more functions. You can apply the function to a field, or to a `PREFIX()` directive if you want to aggregate a raw segment in your indexed events as if it were an extracted field-value pair. You can also rename the result using the `AS` keyword, unless you are in prestats mode (`prestats=true`).

You cannot specify functions without applying them to fields or `eval` expressions that resolve into fields. You cannot use wildcards to specify field names.

See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_52cb454f_4cd6_47ef_9844_bd9dfc2860e5__Usage) to learn more about using `PREFIX()`, and about searches you can run to find raw segments in your data.

The following table lists the supported functions by type of function. Use the links in the table to see descriptions and examples for each function. For an overview about using functions with commands, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

| Type of function | Supported functions and syntax |  |  |  |
| --- | --- | --- | --- | --- |
| [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions) | `avg()`   `count()`   `distinct_count()`  `estdc()` | `exactperc<int>()`   `max()`   `median()`  `min()`  `mode()` | `perc<int>()`   `range()`   `stdev()`  `stdevp()` | `sum()`   `sumsq()`   `upperperc<int>()`  `var()`  `varp()` |
| [Event order functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/event-order-functions#id_56452546_f2e2_44f8_8ccc_ca04f5dab164__Event_order_functions) | `first()` | `last()` |  |  |
| [Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions) | `values()` |  |  |  |
| [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions) | `earliest()`   `earliest_time()` | `latest()`   `latest_time()` | `rate()` |  |

### Optional arguments

append

Syntax: append=<bool>

Description: When in prestats mode (`prestats=true`), enables `append=true` where the prestats results append to existing results, instead of generating them.

Default: false

allow\_old\_summaries

Syntax: allow\_old\_summaries=true | false

Description: Only applies when selecting from an accelerated data model. When you change the constraints that define a data model but the Splunk software has not fully updated the summaries to reflect that change, the summaries may have some data that matches the old definition and some data that matches the new definition. To return results from summary directories only when those directories are up-to-date, set this parameter to `false`. If the data model definition has changed, summary directories that are older than the new definition are not used when producing output from the `tstats` command. This default ensures that the output from `tstats` always reflects your current configuration.

When set to `true`, the `tstats` command uses both current summary data and summary data that was generated prior to the definition change. This is an advanced performance feature for cases where you know that the old summaries are "good enough," meaning the old summary data is close enough to the new summary data that its results are reliable. See [When the data model definition changes and your summaries have not been updated to match it](/en/?resourceId=Splunk_Knowledge_Acceleratedatamodels) in the Splunk Cloud Platform *Knowledge Manager Manual*.

Default: false

chunk\_size

Syntax: chunk\_size=<unsigned\_int>

Description: Advanced option. This argument controls how many events are retrieved at a time from a single `tsidx` file when the Splunk software processes searches. Lower this setting from its default only when you find a particular `tstats` search is using too much memory, or when it infrequently returns events. This can happen when a search groups by excessively high-cardinality fields (fields with very large amounts of distinct values). In such situations, a lower `chunk_size` value can make `tstats` searches more responsive, but potentially slower to complete. However, a higher `chunk_size` can help long-running searches to complete faster, with the potential tradeoff of causing the search to be less responsive. For `tstats`, `chunk_size` cannot be set lower than 10000.

Default: 10000000 (10 million)

Note: The default value for the `chunk_size` argument is set by the `chunk_size` setting for the `[tstats]` stanza in `limits.conf`. If you have Splunk Cloud Platform, file a Support ticket to change this setting.

fillnull\_value

Description: This argument sets a user-specified value that the `tstats` command substitutes for null values for any field within its group-by field list. Null values include field values that are missing from a subset of the returned events as well as field values that are missing from all of the returned events. If you do not provide a `fillnull_value` argument, `tstats` omits rows for events with one or more null field values from its results.

Default: no default value

include\_reduced\_buckets

Syntax: include\_reduced\_buckets=true | false

Description: This setting only applies when `enableTSIDXReduction=true` in `indexes.conf`. When set to false, the `tstats` command generates results only from index buckets that are not reduced. Set to `true` if you want `tstats` to use results from reduced buckets.

Default: false

local

Syntax: local=true | false

Description: If `true`, forces the `tstats` search processor to run only on the search head. This setting is useful for troubleshooting. For example, you can use it to determine whether data on a search head is or has been improperly accelerated. In systems that forward search head data to indexers, this setting may cause the search to produce few or no results. See [Best practice: Forward search head data to the indexer layer](/en/?resourceId=Splunk_DistSearch_Forwardsearchheaddata) in Splunk Enterprise *Distributed Search*.

Default: false

prestats

Syntax: prestats=true | false

Description: Specifies whether to use the prestats format. The prestats format is a Splunk internal format that is designed to be consumed by commands that generate aggregate calculations. When using the prestats format you can pipe the data into the [chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats), or [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart) commands, which are designed to accept the prestats format. When `prestats=true`, AS instructions are not relevant. The field names for the aggregates are determined by the command that consumes the prestats format and produces the aggregate output.

`prestats=true` is an advanced setting. Use it only in special circumstances when you need to pass tstats-generated data directly to the `chart`, `stats`, or `timechart` command.

Default: false

summariesonly

Syntax: summariesonly=<bool>

Description: When `summariesonly` is set to `false`, if the time range of the `tstats` search exceeds the summarization range for the selected data model, the `tstats` command returns results for the entire time range of the search. It quickly returns results from the summarized data, and returns results more slowly from the raw, unsummarized data that exists outside of the data model summary range.

If an accelerated data model is running behind in its summarization, or if its summarization searches are scheduled infrequently, setting `summariesonly = false` might result in a slower `tstats` search. This is because the data model has more unsummarized data to search through than usual.

When `summariesonly` is set to `true`, the `tstats` search returns results only from summarized data, even when the time range of the search exceeds the summarization range of the data model. This means the search runs fast, but no unsummarized data is included in the search results. If you set `summariesonly` to `true`, the `tstats` won't run over unaccelerated data models. Also, when the `tstats` runs over accelerated data models, it returns events only from the data model's acceleration summary.

You might set `summariesonly = true` if you need to identify the data that is currently summarized in a given data model, or if you value search efficiency over completeness of results. See [Using the summariesonly argument](/en/?resourceId=Splunk_Knowledge_Acceleratedatamodels) in the Splunk Cloud Platform *Knowledge Manager Manual*.

Default: false

### FROM clause arguments

The FROM clause is optional. See [Selecting data](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_52cb454f_4cd6_47ef_9844_bd9dfc2860e5__Selecting_data) for more information about this clause.

datamodel

Syntax: datamodel=<data\_model\_name>.<root\_dataset\_name> [where nodename = <root\_dataset\_name>.<...>.<target\_dataset\_name>]

Description: The name of a data model, concatenated with the name of the root dataset that you are searching. If you wish to filter on a child dataset, you need to use a `where` clause that uses `nodename` to reference a specific child dataset in a dataset hierarchy in the data model. See [Selecting data](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_52cb454f_4cd6_47ef_9844_bd9dfc2860e5__Selecting_data) for more information.

### WHERE clause arguments

The optional WHERE clause is used as a filter. You can specify either a search or a field and a set of values with the IN operator.

<search-query>

Specify the search criteria to filter on.

<field> IN (<value-list>)

For the `field`, specify a list of values to include in the search results.

WHERE clauses in `tstat` searches must contain field-value pairs that are indexed, as well as characters that are not [major breakers](https://docs.splunk.com/Splexicon:Majorbreak) or [minor breakers](https://docs.splunk.com/Splexicon:Minorbreak). For example, consider the following search:

| tstats count WHERE index=\_internal sourcetype=splunkd\* by sourcetype

The results look something like this:

| sourcetype | count |
| --- | --- |
| splunkd | 2602154 |
| splunkd\_access | 319019 |
| splunkd\_conf | 19 |

This search returns valid results because `sourcetype=splunkd*` is an indexed field-value pair and wildcard characters are accepted in the search criteria. The asterisk at the end of the `sourcetype=splunkd*` clause is treated as a wildcard, and is not regarded as either a major or minor breaker.

### BY clause arguments

The BY clause is optional. You cannot use wildcards in the `BY` clause with the `tstats` command. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_52cb454f_4cd6_47ef_9844_bd9dfc2860e5__Usage). If you use the BY clause, you must specify a `field-list`. You can also specify a `span`.

<field-list>

Syntax: <field>, ...

Description: Specify one or more fields to group results.

PREFIX()

Syntax: PREFIX(<string>)

Description: Specify a raw segment in your indexed events that you want to split by as if it were an extracted field-value pair. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_52cb454f_4cd6_47ef_9844_bd9dfc2860e5__Usage) for more information about the `PREFIX()` directive, and for a search you can run to find raw segments in your indexed data.

span

Syntax: span=<timespan>

Description: The span of each time bin. If you use the BY clause to group by `_time`, use the `span` argument to group the time buckets. You can specify timespans such as `BY _time span=1h` or `BY _time span=5d`. If you do not specify a `<timespan>`, the default is `auto`, which means that the number of time buckets adjusts to produce a reasonable number of results. For example if initially seconds are used for the `<timespan>` and too many results are being returned, the `<timespan>` is changed to a longer value, such as minutes, to return fewer time buckets.

Default: auto

<timespan>

Syntax: auto | <int><timescale>

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <month>

Description: Time scale units. For the `tstats` command, `<timescale>` does not support subseconds.

Default: sec

| Time scale | Syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <month> | mon | month | months | Time scale in months. |

## Usage

The `tstats` command is a [report-generating command](https://docs.splunk.com/Splexicon:Generatingcommand), except when `prestats=true`. When `prestats=true`, the `tstats` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search, except when `prestats=true`.

By default, the `tstats` command runs over accelerated and unaccelerated data models.

Properly indexed fields should appear in the fields.conf file. See [Create custom fields at index time](/en/?resourceId=Splunk_Data_Configureindex-timefieldextraction) in *Getting Data In*.

When you use a statistical function with the `tstats` command, you can't use an eval expression as part of the statistical function. See [Complex aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_1e6e82ff_e14b_4081_a920_57f0d463d489__Complex_aggregate_functions).

### Selecting data

Use the `tstats` command to perform statistical queries on indexed fields in `tsidx` files. You can select the data for the indexed fields in several ways.

Indexed data

Use a FROM clause to specify a data model. If you do not specify a FROM clause, the Splunk software selects from index data in the same way as the `search` command. You are restricted to selecting data from your allowed indexes by user role. You control exactly which indexes you select data from by using the WHERE clause. If no indexes are mentioned in the WHERE clause, the Splunk software uses the default indexes. By default, role-based search filters are applied, but can be turned off in the [limits.conf](/en/?resourceId=Splunk_Admin_Limitsconf) file.

An accelerated data model

You can select data from a high-performance analytics store, which is a collection of `.tsidx` data summaries, for an accelerated data model. You can select data from this accelerated data model by using `FROM datamodel=<data_model_name>.<root_dataset_name>`.

When you select a data model for a `tstats` search, you also have to select the root dataset within that data model that you intend to search. You cannot select all of the root datasets within a data model at once.

Note: Search filters cannot be applied to accelerated data models. This includes both role-based and user-based search filters.

A child dataset in an accelerated data model

You can select data from a child dataset within an accelerated data model. Use a WHERE clause to specify the `nodename` of the child dataset. The `nodename` argument indicates where the target dataset is in the data model hierarchy. The syntax looks like this:

`...| tstats <stats-func> FROM datamodel=<data_model_name>.<root_dataset_name> where nodename=<root_dataset_name>.<...>.<target_dataset_name>`

For example, say you have a data model with three root datasets, each with their own dataset hierarchies.

ButtercupGamesPromos
- NYC (BaseEvent)
- TShirtStore (NYC)
- FashionShows (TShirtStore)
- Giveaways (TShirtStore)
- Chicago (BaseEvent)
- BeerAndBrautsPopup (Chicago)
- BeerSales (BeerAndBrautsPopup)
- BrautSales (BeerAndBrautsPopup)
- Tokyo (BaseSearch)
- GiantRobotBattles (Tokyo)
- UFORobotGrendizer (GiantRobotBattles)
- MechaGodzilla (GiantRobotBattles)

With this hierarchy, if you wanted to run a `tstats` search that selects from the dataset containing records of the MechaGodzilla giant robot battles staged by the Tokyo office, you would use the following search:

... | tstats count FROM datamodel=ButtercupGamesPromos.Tokyo where nodename=Tokyo.GiantRobotBattles.MechaGodzilla

Note: Search filters cannot be applied to accelerated data model datasets. This includes both role-based and user-based search filters.

### Filtering data using the WHERE clause

You can use the optional WHERE clause to filter queries with the `tstats` command in much the same ways as you use it with the `search` command. For example, WHERE supports the same time arguments, such as `earliest=-1y`, with the `tstats` command and the `search` command.

WHERE clauses used in `tstats` searches can contain only indexed fields. Fields that are extracted at search time are not supported. If you don't know which of your fields are indexed, run a search on a specific index using the [walklex](/en/?resourceId=Splunk_SearchReference_Walklex) command.

### Grouping data by \_time

You can provide any number of BY fields. If you are grouping by `_time`, supply a timespan with `span` for grouping the time buckets, for example `...BY _time span=1h` or `...BY _time span=3d`.

## Limitations

### Tstats and Federated Search for Splunk

`tstats` searches that include a `FROM` clause are blocked for transparent mode federated searches over federated providers with Splunk Cloud Platform versions lower than 9.0.2303 or Splunk Enterprise versions lower than 9.1.0. If you use multiple transparent mode federated providers, the `tstats` search is processed only on federated providers with qualifying versions.

For more information see [About Federated Search for Splunk](/en/?resourceId=Splunk_FederatedSearch_fss2sAbout) in *Federated Search*.

### Tstats and tsidx bucket reduction

`tstats` searches over indexes that have undergone tsidx bucket reduction will return incorrect results.

For more information see [Reduce tsidx disk usage](/en/?resourceId=Splunk_Indexer_Reducetsidxdiskusage) in *Managing indexers and clusters of indexers*.

### Sparkline charts

You can generate sparkline charts with the `tstats` command only if you specify the `_time` field in the BY clause and use the `stats` command to generate the actual sparkline. For example:

| tstats count from datamodel=Authentication.Authentication BY \_time, Authentication.src span=1h
| stats sparkline(sum(count),1h) AS sparkline, sum(count) AS count BY Authentication.src

### Multiple time ranges

The `tstats` command is unable to handle multiple time ranges. This is because the `tstats` command is a generating command and doesn't perform post-search filtering, which is required to return results for multiple time ranges.

The following example of a search using the `tstats` command on events with relative times of 5 seconds to 1 second in the past displays a warning that the results may be incorrect because the `tstats` command doesn't support multiple time ranges.

| tstats count where index="\_internal" (earliest =-5s latest=-4s) OR (earliest=-3s latest=-1s)

If you want to search events in multiple time ranges, use another command such as `stats`, or use multiple `tstats` commands with `append` as shown in the following example.

| tstats prestats=t count where index=\_internal earliest=-5s latest=-4s
| tstats prestats=t append=true count where index=\_internal earliest=-3s latest=-2s
| stats count

The results in this example look something like this.

| count |
| --- |
| 264 |

### Wildcard characters

The `tstats` command does not support wildcard characters in field values in aggregate functions or BY clauses.

For example, you cannot specify `| tstats avg(foo*)` or `| tstats count WHERE host=x BY source*`.

Aggregate functions include `avg()`, `count()`, `max()`, `min()`, and `sum()`. For more information, see [Aggregate functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/aggregate-functions#id_9a0ac27d_18de_4d04_8974_cd39e8844c79__Aggregate_functions).

Any results returned where the aggregate function or BY clause includes a wildcard character are only the most recent few minutes of data that has not been summarized. Include the `summariesonly=t` argument with your `tstats` command to return only summarized data.

### Statistical functions must have named fields

With the exception of `count`, the `tstats` command supports only statistical functions that are applied to fields or `eval` expressions that resolve into fields. For example, you cannot specify `| tstats sum` or `| tstats sum()`. Instead the `tstats` syntax requires that at least one field argument be provided for the function: `| tstats sum(<field>)`.

### Nested eval expressions not supported

You cannot use `eval` expressions inside aggregate functions with the `tstats` command.

For example, `| tstats count(eval(...))` is not supported.

While nested eval expressions are supported with the `stats` command, they are not supported with the `tstats` command.

### Complex aggregate functions

The `tstats` command does not support complex aggregate functions such as `...count(eval('Authentication.action'=="failure"))`.

Consider the following query. This query will not return accurate results because complex aggregate functions are not supported by the `tstats` command.

| tstats count(eval(server.status=200)) from datamodel=internal\_server.server where nodename=server.splunkdaccess by server.status uri

Instead, separate out the aggregate functions from the eval functions, as shown in the following search.

| tstats count from datamodel=internal\_server.server where nodename=server.splunkdaccess by server.status, uri
| eval success=if('server.status'="200", count, 0)
| stats sum(success) as success by uri

The results from this search look something like this:

| uri | success |
| --- | --- |
| //services/cluster/config?output\_mode=json | 0 |
| //services/cluster/config?output\_mode=json | 2862 |
| /services/admin/kvstore-collectionstats?count=0 | 1 |
| /services/admin/transforms-lookup?count=0&getsize=true | 1 |

### Limitations of CIDR matching with tstats

As with the `search` command, you can use the `tstats` command to filter events with CIDR match on fields that contain IPv4 and IPv6 addresses. However, unlike the `search` command, the `tstats` command may not correctly filter strings containing non-numeric wildcard octets. As a result, your searches may return unpredictable results.

If you are filtering fields with a CIDR match using the `tstats` command in a BY clause, you can work around this issue and correctly refilter your results by appending your search with a `search` command, `regex` command, or WHERE clause. Unfortunately, you can't use this workaround if the search doesn't include the filtered field in a BY clause.

### Example of using CIDR match with tstats in a BY clause

Let's take a look at an example of how you could use CIDR match with the `tstats` command in a BY clause. Say you create a file called data.csv containing the following lines:

ip,description
1.2.3.4,"An IP address"
5.6.7.8,"Another IP address"
this.is.a.hostname,"A hostname"
this.is.another.hostname,"Another hostname"

Then follow these steps:

1. Upload the file and set the sourcetype to `csv`, which ensures that all fields in the file are indexed as required by the `tstats` command.
2. Run the following search against the index you specified when you uploaded the file. This example uses the main index.

| tstats count where index=main source=\*data.csv ip="0.0.0.0/0" by ip

The results look like this:

| ip | count |
| --- | --- |
| 1.2.3.4 | 1 |
| 5.6.7.8 | 1 |
| this.is.a.hostname | 1 |
| this.is.another.hostname | 1 |

Even though only two addresses are legitimate IP addresses, all four rows of addresses are displayed in the results. Invalid IP addresses are displayed along with the valid IP addresses because the `tstats` command uses string matching to satisfy search requests and doesn't directly support IP address-based searches. The `tstats` command does its best to return the correct results for CIDR search clauses, but the tstats search may return more results than you want if the source data contains mixed IP and non-IP data such as host names.

To make sure your searches only return the results you want, make sure that your data set is clean and only contains data in the correct format. If that is not possible, use the `search` command or WHERE clause to do post-filtering of the search results. For example, the following search using the `search` command displays correct results because the piped `search` command further filters the results from the `tstats` command.

| tstats count where index=main source=\*data.csv ip="0.0.0.0/0" by ip
| search ip="0.0.0.0/0"

Alternatively, you can use the WHERE clause to filter your results, like this.

| tstats count where index=main source=\*data.csv ip="0.0.0.0/0" by ip
| WHERE cidrmatch("0.0.0.0/0", ip)

Both of these searches using the `search` command and the WHERE clause return only the valid IP addresses in the results, which look like this:

| ip | count |
| --- | --- |
| 1.2.3.4 | 1 |
| 5.6.7.8 | 1 |

### The tstats command doesn't respect the srchTimeWin parameter

The `tstats` command doesn't respect the `srchTimeWin` parameter in the authorize.conf file and other role-based access controls that are intended to improve search performance. This is because the `tstats` command is already optimized for performance, which makes parameters like `srchTimeWin` irrelevant.

For example, say you previously set the `srchTimeWin` parameter on a role for one of your users named Alex, so they are just allowed to run searches back over 1 day. You limited the search time range to prevent searches from running over longer periods of time, which could potentially impact overall system performance and slow down searches for other users. Alex has been running a `stats` search, but didn't notice that they were getting results for just 1 day, even though they specified 30 days. If Alex then changes their search to a `tstats` search, or changes their search in such a way that Splunk software automatically optimizes it to a `tstats` search, the 1 day setting for the `srchTimeWin` parameter no longer applies. As a result, Alex gets many times more results than before, since their search is returning all 30 days of events, not just 1 day of results. This is expected behavior.

## Performance

### Use PREFIX() to aggregate or group by raw tokens in indexed data

The `PREFIX()` directive allows you to search on a raw segment in your indexed data as if it were an extracted field. This causes the search to run over the `tsidx` file in your indexers rather than the log line. This is a practice that can significantly reduce the CPU load on your indexers.

The `PREFIX()` directive is similar to the `CASE()` and `TERM()` directives in that it matches strings in your raw data. You can use `PREFIX()` to locate a recurring [segment](https://docs.splunk.com/Splexicon:Segment) in your raw event data that is actually a key-value pair separated by a delimiter that is also a minor breaker, like `=` or `:`. You give `PREFIX()` the text that precedes the value, which is the "prefix", and then the search returns the values that follow the prefix. This enables you to group by those values and aggregate them with `tstats` functions. The values can be strings or purely numeric.

For example, say you have indexed segments in your event data that look like `kbps=10` or `kbps=333`. You can isolate the numerical values in these segments and perform aggregations or group-by operations on them by using the `PREFIX()` directive to identify `kbps=` as a common prefix string. Run a `tstats` search with `PREFIX(kbps=)` against your event data and it will return `10` and `333`. These values are perfect for `tstats` aggregation functions that require purely numeric input.

Notice that in this example you need to include the `=` delimiter. If you run `PREFIX(kbps)`, the search returns `=10` and `=333`. Efforts to aggregate on such results may return unexpected results, especially if you are running them through aggregation functions that require purely numeric values.

Note: The text you provide for the `PREFIX()` directive must be in lower case. For example, the `tstats` search processor will fail to process `PREFIX(connectionType=)`. Use `PREFIX(connectiontype=)` instead. It will still match `connectionType=` strings in your events.

The Splunk software separates events into raw segments when it indexes data, using rules specified in `segmenters.conf`. You can run the following search to identify raw segments in your indexed events:

| walklex index=<target-index> type=term | stats sum(count) by term

Note: You cannot apply the `PREFIX()` directive to segment prefixes and values that contain major breakers such as spaces, square or curly brackets, parentheses, semicolons, or exclamation points.

For more information about the `CASE()` and `TERM()` directives, see [Use CASE() and TERM() to match phrases](/en/?resourceId=Splunk_Search_UseCASEandTERMtomatchphrases) in the *Search Manual*.

For more information about the segmentation of indexed events, see [About event segmentation](/en/?resourceId=Splunk_Data_Abouteventsegmentation) in *Getting Data In*

For more information about minor and major breakers in segments, see [Event segmentation and searching](/en/?resourceId=Splunk_Search_Eventsegmentationandsearching) in the *Search Manual*.

### Memory and tstats search performance

A pair of `limits.conf` settings strike a balance between the performance of `tstats` searches and the amount of memory they use during the search process, in RAM and on disk. If your `tstats` searches are consistently slow to complete you can adjust these settings to improve their performance, but at the cost of increased search-time memory usage, which can lead to search failures.

If you have Splunk Cloud Platform, you need to file a Support ticket to change these settings.

For more information, see [Memory and stats search performance](/en/?resourceId=Splunk_Search_Memoryandstatssearchperformance) in the *Search Manual*.

### Functions and memory usage

Some functions are inherently more expensive, from a memory standpoint, than other functions. For example, the `distinct_count` function requires far more memory than the `count` function. The `values` and `list` functions also can consume a lot of memory.

If you are using the `distinct_count` function without a split-by field or with a low-cardinality split-by by field, consider replacing the `distinct_count` function with the `estdc` function (estimated distinct count). The `estdc` function might result in significantly lower memory usage and run times.

## Examples

### 1. Get a count of all events in an index

This search tells you how many events there are in the \_internal index.

| tstats count WHERE index=\_internal

### 2. Use a filter to get the average

This search returns the average of the field `size` in myindex, specifically where `test` is `value2` and the value of `result` is greater than 5. Both `test` and `result` are indexed fields.

| tstats avg(size) WHERE index=myindex test=value2 result>5

### 3. Return the count by splitting by source

This search gives the count by source for events with host=x.

| tstats count WHERE index=myindex host=x by source

### 4. Produce a timechart

This search produces a timechart of all the data in your default indexes with a day granularity. To avoid unpredictable results, the value of the `tstats` `span` argument should be smaller than or equal to the value of the `timechart` `span` argument.

| tstats prestats=t count WHERE index=\_internal BY \_time span=1h
| timechart span=1d count

### 5. Use summariesonly to get a time range of summarized data

This search uses the `summariesonly` argument to get the time range of the summary for an accelerated data model named `mydm`.

| tstats summariesonly=t min(\_time) AS min, max(\_time) AS max FROM datamodel=mydm
| eval prettymin=strftime(min, "%c")
| eval prettymax=strftime(max, "%c")

### 6. Find out how much data has been summarized

This search uses `summariesonly` in conjunction with the `timechart` command to reveal the data that has been summarized in 1 hour blocks of time for an accelerated data model called `mydm`.

| tstats summariesonly=t prestats=t count FROM datamodel=mydm BY \_time span=1h
| timechart span=1h count

The `span` argument indicates how the events are grouped into buckets or blocks of time, but it doesn't indicate how long the search should run. To run your search over a specific length of time, use the time range picker in the Search app to set the time window for your search. Alternatively, you can include a WHERE clause in your search like this, which searches events in 1 hour blocks across a 3 hour time window:

| tstats summariesonly=f prestats=t count FROM datamodel=mydm WHERE earliest=-3h BY \_time span=1h
| timechart span=1h count

### 7. Get a list of values for source returned by the internal log data model

This search uses the `values` statistical function to provide a list of all distinct values for the `source` that is returned by the internal log data model. The list is returned as a multivalue entry.

| tstats values(source) FROM datamodel=internal\_server

The results look something like this:

| values(source) |
| --- |
| /Applications/Splunk/var/log/splunk/license\_usage.log   /Applications/Splunk/var/log/splunk/metrics.log   /Applications/Splunk/var/log/splunk/metrics.log.1  /Applications/Splunk/var/log/splunk/scheduler.log  /Applications/Splunk/var/log/splunk/splunkd.log  /Applications/Splunk/var/log/splunk/splunkd\_access.log |

Note: If you don't have the `internal_server` data model defined, check under Settings->Data models for a list of the data models you have access to.

### 8. Get a list of values for source returned by the Alerts dataset in the internal log data model

This search uses the `values` statistical function to provide a list of all distinct values for `source` returned by the Alerts dataset within the internal log data model.

| tstats values(source) FROM datamodel=internal\_server where nodename=server.scheduler.alerts

### 9. Get the count and average

This search gets the count and average of a raw, unindexed term using the `PREFIX` `kbps=`, then splits this by an indexed source and another unindexed term using the `PREFIX` `group=`.

| tstats count avg(PREFIX(exec\_time=)) as avg\_exec\_time where index=\_audit by PREFIX(user=) PREFIX(action=) fillnull\_value="N/A"

## See also

Commands

[datamodel](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[walklex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/walklex#id_964d2f5b_e672_48eb_bca3_9d8251da02be__walklex)
