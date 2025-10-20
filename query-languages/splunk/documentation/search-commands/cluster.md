# cluster

## Description

The `cluster` command groups events together based on how similar they are to each other. Unless you specify a different field, `cluster` groups events based on the contents of the `_raw` field. The default grouping method is to break down the events into terms (`match=termlist`) and compute the vector between events. Set a higher threshold value for `t`, if you want the command to be more discriminating about which events are grouped together.

The result of the cluster command appends two new fields to each event. You can specify what to name these fields with the `countfield` and `labelfield` parameters, which default to `cluster_count` and `cluster_label`. The `cluster_count` value is the number of events that are part of the cluster, or the cluster size. Each event in the cluster is assigned the `cluster_label` value of the cluster it belongs to. For example, if the search returns 10 clusters, then the clusters are labeled from 1 to 10.

## Syntax

cluster [slc-options]...

### Optional arguments

slc-options

Syntax: t=<num> | delims=<string> | showcount=<bool> | countfield=<field> | labelfield=<field> | field=<field> | labelonly=<bool> | match=(termlist | termset | ngramset)

Description: Options for configuring simple log clusters (slc).

### SLC options

t

Syntax: t=<num>

Description: Sets the cluster threshold, which controls the sensitivity of the clustering. This value needs to be a number greater than 0.0 and less than 1.0. The closer the threshold is to 1, the more similar events have to be for them to be considered in the same cluster.

Default: 0.8

delims

Syntax: delims=<string>

Description: Configures the set of delimiters used to tokenize the raw string. By default, everything except 0-9, A-Z, a-z, and '\_' are delimiters.

showcount

Syntax: showcount=<bool>

Description: If `showcount=false`, indexers cluster its own events before clustering on the search head. When `showcount=false` the event count is not added to the event. When `showcount=true`, the event count for each cluster is recorded and each event is annotated with the count.

Default:
`showcount=false`

countfield

Syntax: countfield=<field>

Description: Name of the field to which the cluster size is to be written if `showcount=true` is true. The cluster size is the count of events in the cluster.

Default:`cluster_count`.

labelfield

Syntax: labelfield=<field>

Description: Name of the field to write the cluster number to. As the events are grouped into clusters, each cluster is counted and labelled with a number.

Default:
`cluster_label`

field

Syntax: field=<field>

Description: Name of the field to analyze in each event.

Default: `_raw`

labelonly

Description: labelonly=<bool>

Syntax: Select whether to preserve incoming events and annotate them with the cluster they belong to (labelonly=true) or output only the cluster fields as new events (labelonly=false). When labelonly=false, outputs the list of clusters with the event that describes it and the count of events that combined with it.

Default:
`false`

match

Syntax: match=(termlist | termset | ngramset)

Description: Select the method used to determine the similarity between events. `termlist` breaks down the field into words and requires the exact same ordering of terms. `termset` allows for an unordered set of terms. `ngramset` compares sets of trigram (3-character substrings). `ngramset` is significantly slower on large field values and is most useful for short non-textual fields, like `punct`.

Default:
`termlist`

## Usage

The `cluster` command is a streaming command or a dataset processing command, depending on which arguments are specified with the command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Use the `cluster` command to find common or rare events in your data. For example, if you are investigating an IT problem, use the `cluster` command to find anomalies. In this case, anomalous events are those that are not grouped into big clusters or clusters that contain few events. Or, if you are searching for errors, use the `cluster` command to see approximately how many different types of errors there are and what types of errors are common in your data.

## Examples

### Example 1

Quickly return a glimpse of anything that is going wrong in your Splunk deployment.
Your role must have the appropriate capabilities to access the internal indexes.

index=\_internal source=\*splunkd.log\* log\_level!=info | cluster showcount=t | table cluster\_count \_raw | sort -cluster\_count

This search takes advantage of what Splunk software logs about its operation in the \_internal index. It returns all logs where the log\_level is DEBUG, WARN, ERROR, FATAL and clusters them together. Then it sorts the clusters by the count of events in each cluster.

The results appear on the Statistics tab and look something like this:

| cluster\_count | raw |
| --- | --- |
| 303010 | 03-20-2018 09:37:33.806 -0700 ERROR HotDBManager - Unable to create directory /Applications/Splunk/var/lib/splunk/\_internaldb/db/hot\_v1\_49427345 because No such file or directory |
| 151506 | 03-20-2018 09:37:33.811 -0700 ERROR pipeline - Uncaught exception in pipeline execution (indexer) - getting next event |
| 16390 | 04-05-2018 08:30:53.996 -0700 WARN SearchResultsMem - Failed to append to multival. Original value not converted successfully to multival. |
| 486 | 03-20-2018 09:37:33.811 -0700 ERROR BTreeCP - failed: failed to mkdir /Applications/Splunk/var/lib/splunk/fishbucket/splunk\_private\_db/snapshot.tmp: No such file or directory |
| 216 | 03-20-2018 09:37:33.814 -0700 WARN DatabaseDirectoryManager - idx=\_internal Cannot open file='/Applications/Splunk/var/lib/splunk/\_internaldb/db/.bucketManifest99454\_1652919429\_tmp' for writing bucket manifest (No such file or directory) |
| 216 | 03-20-2018 09:37:33.814 -0700 ERROR SearchResultsWriter - Unable to open output file: path=/Applications/Splunk/var/lib/splunk/\_internaldb/db/.bucketManifest99454\_1652919429\_tmp error=No such file or directory |

### Example 2

Search for events that don't cluster into large groups.

... | cluster showcount=t | sort cluster\_count

This returns clusters of events and uses the [sort](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sort#id_2a60b861_704d_4298_918f_274b501ec80d__sort) command to display them in ascending order based on the cluster size, which are the values of `cluster_count`. Because they don't cluster into large groups, you can consider these rare or uncommon events.

### Example 3

Cluster similar error events together and search for the most frequent type of error.

error | cluster t=0.9 showcount=t | sort - cluster\_count | head 20

This searches your index for events that include the term "error" and clusters them together if they are similar. The [sort](/en/?resourceId=Splunk_SearchReference_Sort) command is used to display the events in descending order based on the cluster size, `cluster_count`, so that largest clusters are shown first. The [head](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/head#id_59ebb3d9_7e57_4ad1_8457_3c04ef2acbe4__head) command is then used to show the twenty largest clusters. Now that you've found the most common types of errors in your data, you can dig deeper to find the root causes of these errors.

### Example 4

Use the `cluster` command to see an overview of your data. If you have a large volume of data, run the following search over a small time range, such as 15 minutes or 1 hour, or restrict it to a source type or index.

... | cluster labelonly=t showcount=t | sort - cluster\_count, cluster\_label, \_time | dedup 5 cluster\_label

This search helps you to learn more about your data by grouping events together based on their similarity and showing you a few of events from each cluster. It uses `labelonly=t` to keep each event in the cluster and append them with a `cluster_label`. The [sort](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sort#id_2a60b861_704d_4298_918f_274b501ec80d__sort) command is used to show the results in descending order by its size (`cluster_count`), then its `cluster_label`, then the indexed timestamp of the event (`_time`). The [dedup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dedup#cc343630_62b6_453c_a08d_39c99aa852df__dedup) command is then used to show the first five events in each cluster, using the `cluster_label` to differentiate between each cluster.

## See also

[anomalies](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalies#de225778_642c_4dcc_9fba_c4b8041e2af1__anomalies), [anomalousvalue](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalousvalue#adf8d264_6647_4cfc_a5eb_3363bb55a0a7__anomalousvalue), [kmeans](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kmeans#d0a3cb28_4602_427c_8c30_fa3e06f4fa95__kmeans), [outlier](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outlier#id_3e2dc81a_03fd_40f0_b0cb_a689011fe4a0__outlier)
