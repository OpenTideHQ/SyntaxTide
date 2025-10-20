# prjob

CAUTION: The `prjob` command is an internal, unsupported, experimental command. See
[About internal commands](/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

Use the `prjob` command for parallel reduce search processing of an SPL search in a distributed search environment. The `prjob` command analyzes the specified SPL search and attempts to reduce the search runtime by automatically placing a `redistribute` command in front of the first non-streaming SPL command like `stats` or `transaction` in the search. It provides the same functionality as the `redistribute` command, but with a simpler syntax. Similar to the  `redistribute` command, use the `prjob` command to automatically speed up high cardinality searches that aggregate a large number of search results.

## Syntax

prjob [<subsearch>]

orprjob [num\_of\_reducers=<int>] [subsearch]

### Required arguments

subsearch

Syntax: [<subsearch>]

Description: Specifies the search string that the `prjob` command attempts to process in parallel.

### Optional arguments

num\_of\_reducers

Syntax: [num\_of\_reducers=<int>]

Description: Specifies the number of eligible indexers from the indexer pool that may function as intermediate reducers. For example: When a search is run on 10 indexers and the configuration is set to use 60% of the indexer pool (with a maximum value of 5), it implies that only five indexers may be used as intermediate reducers. If the value of `num_of_reducers` is set to greater than 5, only five reducers are available due to the limit. If the value of of `num_of_reducers` is set to less than 5, the number of reducers used shrinks from the maximum limit of 5.

The value for *num\_of\_reducers* is controlled by two groups of settings:

* `reducers`:
* `maxReducersPerPhase` + `winningRate`

The number of intermediate reducers is determined by the value set for `reducers`. If no value is set for `reducers`, the search uses the values set for `maxReducersPerPhase` and `winningRate` to determine the number of intermediate reducers.

For example: In a scenario where Splunk is configured so that the value of `num_of_reducers` is set to 50 percent of the indexer pool and the `maxReducersPerPhase` value is set to four indexers, a parallel reduce search that runs on six search peers will be assigned to run on three intermediate reducers. Similarly, a parallel reduce search that runs on four search peers, will be assigned to run on two intermediate reducers. However, searches that runs on ten search peers would be limited to the maximum of four intermediate reducers.

## Usage

Use the `prjob` command instead of the `redistribute` command when you want to run a parallel reduce job without determining where to insert the `redistribute` command or managing the *by-clause* field.

The `prjob` command may be used only as the first command of a search. Additionally, you must include the entire search within the `prjob` command.

To use the `prjob` command, set the `phased_execution_mode` to *multithreaded* or *auto* and set `enabled` to *true* in the `[search_optimization::pr_job_extractor]` stanza of the `limits.conf` configuration file.

The `prjob` command does not support real time or verbose mode searches. Real time or verbose mode searches with the `prjob` command may run, but the `redistribute` operation will be ignored. Also, you may not use the `prjob` and the `redistribute` command within the same search.

The `prjob` command supports the same commands as the `redistribute` command. For more information, see [redistribute](/?resourceId=Splunk_SearchReference_Redistribute). The prjob command only reduces the search runtime of an SPL search that contains at least one of the following non-streaming commands: …"

* `stats`
* `tstats`
* `streamstats`
* `eventstats`
* `sistats`
* `sichart`
* `sitimechart`
* `transaction` (only on a single field)

## Examples

Example 1: Using the `prjob` command in a search automatically places the `redistribute` command before the first non-streaming SPL command in the search. This speeds up a `stats` search that aggregates a large number of results. The `stats count by host` portion of the search is processed on the intermediate reducers and the search head aggregates the results.

Therefore, the following search:

| prjob [search index=myindex | stats count by host]

is transformed to:

search index=myindex | redistribute | stats count by host

Example 2: Speeds up a search that includes `eventstats` and uses `sitimechart` to perform the statistical calculations for a `timechart` operation. The intermediate reducers process `eventstats`, `where`, and `sitimechart` operations. The search head runs the `timechart` command to turn the reduced `sitimechart` statistics into sorted, visualization-ready results.

| prjob [search index=myindex | eventstats count by user, source | where count>10 | sitimechart max(count) by source | timechart max(count) by source]

Example 3: Speeds up a search that uses `tstats` to generate events. The `tstats` command must be placed at the start of the subsearch, and uses `prestats=t` to work with the `timechart` command. The `sitimechart` command is processed on the intermediate reducers and the `timechart` command is processed on the search head.

| prjob [search index=myindex | tstats prestats=t count by \_time span=1d | sitimechart span=1d count | timechart span=1d count]

Example 4: The `eventstats` and `where` commands are processed in parallel on the reducers, while the `sort` command and any other following commands are processed on the search head. This happens because the `sort` command is a non-streaming command that is not supported by the `prjob` command.

Note: The `prjob` command does not have an impact on this search.

| prjob [ search index=myindex | eventstats count by user, source | where count >10 | sort 0 -num(count) | ...]
