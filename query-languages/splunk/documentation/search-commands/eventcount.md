# eventcount

## Description

Returns the number of events in specified indexes.

## Syntax

The required syntax is in bold.

| eventcount

[index=<string>]...

[summarize=<bool>]

[report\_size=<bool>]

[list\_federated\_remote=<bool>]

[list\_vix=<bool>]

### Required arguments

None.

### Optional arguments

index

Syntax: index=<string>

Description: The name of an index to report on, or a wildcard matching a set of indexes to report on. You can specify this argument multiple times to specify multiple indexes or groups of indexes, like this: `index=* index=_*`.

Default: If no index is specified, `eventcount` returns information about the default index.

list\_federated\_remote

Syntax: list\_federated\_remote=<bool>

Description: Specify whether to return event counts from specified indexes on any [federated providers](https://docs.splunk.com/Splexicon:Federatedprovider) to which your Splunk platform deployment is connected for the purpose of running [federated searches](https://docs.splunk.com/Splexicon:Federatedsearch) over remote Splunk platform deployments. If `list_federated_remote=false`, `eventcount` returns event counts only from your local Splunk platform deployment. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventcount#id_5df56722_52ab_4e9d_801f_d532b6b0c0d3__Usage).

Default: false

list\_vix

Syntax: list\_vix=<bool>

Description: Specify whether to list virtual indexes. If `list_vix=false`, the command does not list virtual indexes.

Default: true

report\_size

Syntax: report\_size=<bool>

Description: Specify whether to report the index size. If `report_size=true`, the command returns the index size in bytes.

Default: false

summarize

Syntax: summarize=<bool>

Description: Specifies whether or not to summarize events across all indexes, providers, and search peers (servers). If `summarize=false`, the command splits the event counts by index, and additionally provides the provider and server values that correspond to each index.

Default: true

## Usage

The `eventcount` command is a [report-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

Specifying a time range has no effect on the results returned by the `eventcount` command. All of the events on the indexes you specify are counted.

### Specifying indexes

You cannot specify indexes to exclude from the results. For example, `index!=foo` is not valid syntax.

You can specify the `index` argument multiple times. For example:

|eventcount summarize=false index=\_audit index=main

### See event counts for indexes on remote Splunk platform deployments

If you use Federated Search for Splunk, you can find the count of events in specified indexes on your federated providers by running `eventcount` with `summarize=false` and `list_federated_remote=true`.

When you set `summarize=false` and `list_federated_remote=true`, `eventcount` can return event counts for specified remote indexes on federated providers to which your Splunk platform deployment is connected. The `provider` column identifies the federated providers that each specified remote index is associated with.

Indexes that are present on your local Splunk platform deployment have a `platform` value of `local`. Your local Splunk platform deployment is the Splunk platform deployment from which you run searches.

If you set `summarize=false` and do not set `list_federated_remote` or set `list_federated_remote=false`, `eventcount` returns event counts only for indexes on your local Splunk platform deployment.

See [About Federated Search for Splunk](/en/?resourceId=Splunk_FederatedSearch_fss2sAbout), in *Federated Search*.

### Running in clustered environments

Do not use the `eventcount` command to count events for comparison in indexer clustered environments. When a search runs, the `eventcount` command checks all [buckets](https://docs.splunk.com/Splexicon:Bucket), including replicated and primary buckets, across all indexers in a cluster. As a result, the search may return inaccurate event counts.

## Examples

### Example 1:

Display a count of the events in the default indexes from all of the search peers. A single count is returned.

| eventcount

### Example 2:

Return the number of events in only the internal default indexes. Display the corresponding providers and servers. Include the index size, in bytes, in the results.

| eventcount summarize=false index=\_\* report\_size=true

The results appear on the Statistics tab and will be similar to the results shown in the following table.

| count | index | provider | server | size\_bytes |
| --- | --- | --- | --- | --- |
| 52550 | \_audit | local | buttercup-mbpr15.sv.splunk.com | 7217152 |
| 1423010 | \_internal | local | buttercup-mbpr15.sv.splunk.com | 122138624 |
| 22626 | \_introspection | local | buttercup-mbpr15.sv.splunk.com | 98619392 |
| 10 | \_telemetry | local | buttercup-mbpr15.sv.splunk.com | 135168 |
| 0 | \_thefishbucket | local | buttercup-mbpr15.sv.splunk.com | 0 |

When you specify `summarize=false`, the command returns four fields: `count`, `index`, `provider`, and `server`.

When you specify `report_size=true`, the command returns the `size_bytes` field. The values in the size\_bytes field are not the same as the index size on disk.

### Example 3:

For each specified index, return an event count and its corresponding provider and server values. Filter internal indexes out of the result set.

| eventcount summarize=false index=\*

The results appear on the Statistics tab and will be similar to the results shown in the following table.

| count | index | provider | server |
| --- | --- | --- | --- |
| 0 | history | local | sting-mba13.sv.splunk.com |
| 109864 | main | local | sting-mba13.sv.splunk.com |
| 0 | summary | local | sting-mba13.sv.splunk.com |
| 6906 | usgs\_earthquake | local | sting-mba13.sv.splunk.com |

To return the count all of the indexes including the internal indexes, you must specify the internal indexes separately from the external indexes:

| eventcount summarize=false index=\* index=\_\*

### Example 4:

Return event counts for the internal indexes in your local Splunk platform deployment and the internal indexes in the remote Splunk platform deployment that is connected to your Splunk deployment as a standard mode federated provider. Filter out indexes that are not internal.

|eventcount summarize=f list\_federated\_remote=t index=access\_\* index=federated:access\_\*

Because this search runs over a standard mode federated provider, you use the `federated:` syntax to specify the indexes on the federated provider.

The results appear on the Statistics tab and will be similar to the results shown in the following table.

| count | index | provider | server |
| --- | --- | --- | --- |
| 5015002 | access\_combined | local | sting-mba13.sv.splunk.com |
| 4994000 | access\_combined | remote01 | buttercup-mbpr15.sv.splunk.com |
| 4921285 | access\_combined\_wcookie | local | sting-mba13.sv.splunk.com |
| 4741874 | access\_combined\_wcookie | remote01 | buttercup-mbpr15.sv.splunk.com |

The search returns event counts for two `access_combined` indexes and two `access_combined_wcookie` indexes, but they are not duplicates. Your local Splunk platform deployment has indexes that share names with indexes on its remote federated provider, which is expected.

See [Run federated searches over remote Splunk platform deployments](/en/?resourceId=Splunk_FederatedSearch_fss2sRunSearches), in *Federated Search*.

## See also

[metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata),
[fieldsummary](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldsummary#id_547f6d7b_7d62_461a_8c1b_22155611adc9__fieldsummary)
