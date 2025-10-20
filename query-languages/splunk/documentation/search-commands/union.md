# union

## Description

Merges the results from two or more datasets into one dataset. One of the datasets can be a result set that is then piped into the `union` command and merged with a second dataset.

The `union` command appends or merges event from the specified datasets, depending on whether the dataset is streaming or non-streaming and where the command is run. The `union` command runs on indexers in parallel where possible, and automatically interleaves results on the `_time` when processing events. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/union#b419a455_4470_4059_8bd1_549536c836c4__Usage).

If you are familiar with SQL but new to SPL, see [Splunk SPL for SQL users](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/splunk-spl-for-sql-users#e4bc11a8_84ab_4f96_8374_ddd2b86db298__Splunk_SPL_for_SQL_users).

## Syntax

The required syntax is in bold.

union

[<subsearch-options>]

<dataset>

[<dataset>...]

### Required arguments

dataset

Syntax: <dataset-type>:<dataset-name> | <subsearch>

Description: The dataset that you want to perform the union on. The dataset can be either a named or unnamed dataset.

* A named dataset is comprised of <dataset-type>:<dataset-name>. For <dataset-type> you can specify a [data model](https://docs.splunk.com/Splexicon:Datamodel), a [saved search](https://docs.splunk.com/Splexicon:Savedsearch), or an inputlookup. For example `datamodel:"internal_server.splunkdaccess"`.
* A subsearch is an unnamed dataset.

When specifying more than one dataset, use a space or a comma separator between the dataset names.

### Optional arguments

subsearch-options

Syntax: maxtime=<int> maxout=<int> timeout=<int>

Description: You can specify one set of subsearch-options that apply to all of the subsearches. You can specify one or more of the subsearch-options. These options apply only when the subsearch is treated as a non-streaming search.

* The `maxtime` argument specifies the maximum number of seconds to run the subsearch before finalizing. The default is 60 seconds.
* The `maxout` argument specifies the maximum number of results to return from the subsearch. The default is 50000 results. This value is the `maxresultrows` setting is in the [searchresults] stanza in the `limits.conf` file.
* The `timeout` argument specifies the maximum amount of time, in seconds, to cache the subsearch results. The default is 300 seconds.

## Usage

The `union` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

How the `union` command processes datasets depends on whether the dataset is a streaming or non-streaming dataset. The type of dataset is determined by the commands that are used to create the dataset.
See [Types of commands](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Note: There are two types of streaming commands, distributable streaming and centralized streaming. For this discussion about the `union` command, streaming datasets refers to distributable streaming.

A subsearch can be initiated through a search command such as the `union` command. See [Initiating subsearches with search commands](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the Splunk Cloud Platform *Search Manual*.

### Where the command is run

Whether the datasets are streaming or non-streaming determines if the `union` command is run on the indexers or the search head. The following table specifies where the command is run.

| Dataset type | Dataset 1 is streaming | Dataset 1 is non-streaming |
| --- | --- | --- |
| Dataset 2 is streaming | Indexers | Search head |
| Dataset 2 is non-streaming | Search head | Search head |

### How the command is processed

The type of dataset also determines how the `union` command is processed.

| Dataset type | Impact on processing |
| --- | --- |
| Centralized streaming or non-streaming | Processed as an [append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append) command. |
| Distributable streaming | Processed as a [multisearch](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multisearch#id_1ab455e8_9d5b_4659_bdb5_c83bd133dc1b__multisearch) command.    Placing `<streaming_dataset1>` after the `union` command is more efficient. |

### Optimized syntax for streaming datasets

With streaming datasets, instead of this syntax:

`<streaming_dataset1> | union <streaming_dataset2>`

Your search is more efficient with this syntax:

`... | union <streaming_dataset1>, <streaming_dataset2>`

### Why unioned results might be truncated

Consider the following search, which uses the `union` command to merge the events from three indexes. Each index contains 60,000 events, for a total of 180,000 events.

| union maxout=10000000
[ search index=union\_1 ]
[ search index=union\_2 ]
[ search index=union\_3 ]
| stats count by index

This search produces the following union results:

| index | count |
| --- | --- |
| union\_1 | 60000 |
| union\_2 | 60000 |
| union\_3 | 60000 |

In this example, all of the subsearches are distributable streaming, so they are unioned by using same processing as the `multisearch` command. All 60,000 results for each index are unioned for a total of 180,000 merged events.

However, if you specify a centralized streaming command, such as the `head` command, in one of the subsearches the results change.

| union maxout=10000000
[ search index=union\_1 | head 60000]
[ search index=union\_2 ]
[ search index=union\_3 ]
| stats count by index

This search produces the following union results for a total of 160,000 merged events.

| index | count |
| --- | --- |
| union\_1 | 60000 |
| union\_2 | 50000 |
| union\_3 | 50000 |

Because the `head` command is a centralized streaming command rather than distributable streaming command, any subsearches that follow the `head` command are processed using the `append` command. In other words, when a command forces the processing to the search head, all subsequent commands must also be processed on the search head.

Internally, the search is converted to this:

| search index=union\_1
| head 60000
| append
[ search index=union\_2 ]
| append
[ search index=union\_3 ]
| stats count by index

When the `union` command is used with commands that are non-streaming commands, the default for the `maxout` argument is enforced. The default for the `maxout` argument is 50,000 events. In this example, the default for the `maxout` argument is enforced starting with the subsearch that used the non-streaming command. The default is enforced for any subsequent subsearches.

If the non-streaming command is on the last subsearch, the first two subsearches are processed as streaming. These subsearches are unioned using the `multisearch` command processing. The final subsearch includes a non-streaming command, the `head` command. That subsearch gets unioned using the `append` command processing.

Internally this search is converted to this:

| multisearch
[ search index=union\_1 ]
[ search index=union\_2 ]|
| append
[ search index=union\_3 | head 60000 ]
| stats count by index

In this example, the default for the `maxout` argument applies only to the last subsearch. That subsearch returns only 50,000 events instead of the entire set of 60,000 events. The total number events merged is 170,000. 60,000 events for the first and second subsearches and 50,000 events from the last subsearch.

### Interleaving results

When two datasets are retrieved from disk in descending time order, which is the default sort order, the `union` command interleaves the results. The interleave is based on the `_time` field. For example, you have the following datasets:

dataset\_A

| \_time | host | bytes |
| --- | --- | --- |
| 4 | mailsrv1 | 2412 |
| 1 | dns15 | 231 |

dataset\_B

| \_time | host | bytes |
| --- | --- | --- |
| 3 | router1 | 23 |
| 2 | dns12 | 22o |

Both datasets are descending order by `_time`. When  `| union dataset_A, dataset_B` is run, the following dataset is the result.

| \_time | host | bytes |
| --- | --- | --- |
| 4 | mailsrv1 | 2412 |
| 3 | router1 | 23 |
| 2 | dns12 | 22o |
| 1 | dns15 | 231 |

## Examples

### 1. Union events from two subsearches

The following example merges events from `index a` and `index b`. New fields `type` and `mytype` are added in each subsearch using the `eval` command.

| union [search index=a | eval type = "foo"] [search index=b | eval mytype = "bar"]

### 2. Union the results of a subsearch to the results of the main search

The following example appends the current results of the main search with the tabular results of errors from the subsearch.

... | chart count by category1 | union [search error | chart count by category2]

### 3. Union events from a data model and events from an index

The following example unions a built-in data model that is an internal server log for REST API calls and the events from `index a`.

... | union datamodel:"internal\_server.splunkdaccess" [search index=a]

### 4. Specify the subsearch options

The following example sets a maximum of 20,000 results to return from the subsearch. The example specifies to limit the duration of the subsearch to 120 seconds. The example also sets a maximum time of 600 seconds (5 minutes) to cache the subsearch results.

... | chart count by category1 | union maxout=20000 maxtime=120 timeout=600 [search error | chart count by category2]

## See also

Related information

[About subsearches](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the *Search Manual*

[About data models](/en/?resourceId=Splunk_Knowledge_Aboutdatamodels) in the *Knowledge Manager Manual*

Commands

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)

[inputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputlookup#d34e0d7d_f9ab_409b_9722_45400f8f891a__inputlookup)
