# dbinspect

## Description

Returns information about the buckets in the specified index. If you are using Splunk Enterprise, this command helps you understand where your data resides so you can optimize disk usage as required. Searches on an indexer cluster return results from the primary buckets and replicated copies on other peer nodes.

The Splunk [index](https://docs.splunk.com/Splexicon:Index) is the repository for data ingested by Splunk software. As incoming data is indexed and transformed into [events](https://docs.splunk.com/Splexicon:Event), Splunk software creates files of [rawdata](https://docs.splunk.com/Splexicon:Rawdatafile) and metadata ([index files](https://docs.splunk.com/Splexicon:Indexfiles)). The files reside in sets of directories organized by age. These directories are called [buckets](https://docs.splunk.com/Splexicon:Bucket).

For more information, see [Indexes, indexers, and clusters](/en/?resourceId=Splunk_Indexer_Aboutindexesandindexers) and [How the indexer stores indexes](/en/?resourceId=Splunk_Indexer_HowSplunkstoresindexes) in *Managing Indexers and Clusters of Indexers*.

## Syntax

The required syntax is in bold.

| dbinspect

[index=<wc-string>]...

[<span> | <timeformat>]

[corruptonly=<bool>]

[cached=<bool>]

### Required arguments

None.

### Optional arguments

index

Syntax: index=<wc-string>...

Description: Specifies the name of an index to inspect. You can specify more than one index. For all internal and non-internal indexes, you can specify an asterisk ( \* ) in the index name.

Default: The default index, which is typically main.

<span>

Syntax: span=<int> | span=<int><timescale>

Description: Specifies the span length of the bucket. If using a timescale unit (second, minute, hour, day, month, or subseconds), this is used as a time range. If not, this is an absolute bucket "length".

When you invoke the `dbinspect` command with a bucket span, a table of the spans of each bucket is returned. When `span` is not specified, information about the buckets in the index is returned. See [Information returned when no span is specified](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dbinspect#id_1d42f03c_7d67_4860_8263_e491243138e4__Information_returned_when_no_span_is_specified).

<timeformat>

Syntax: timeformat=<string>

Description: Sets the time format for the `modTime` field.

Default:
`timeformat=%m/%d/%Y:%H:%M:%S`

<corruptonly>

Syntax: corruptonly=<bool>

Description: Specifies that each bucket is checked to determine if any buckets are corrupted and displays only the corrupted buckets. A bucket is corrupt when some of the files in the bucket are incorrect or missing such as `Hosts.data` or `tsidx`. A corrupt bucket might return incorrect data or render the bucket unsearchable. In most cases the software will auto-repair corrupt buckets.

When `corruptonly=true`, each bucket is checked and the following informational message appears.

Not supported on Splunk SmartStore indexes.

`INFO: The "corruptonly" option will check each of the specified buckets. This search might be slow and will take time.`

Default: false

cached

Syntax: cached=<bool>

Description: If set to `cached=true`, the `dbinspect` command gets the statistics from the bucket's manifest. If set to `cached=false`, the `dbinspect` command examines the bucket itself. For SmartStore buckets, `cached=false` examines an indexer's local copy of the bucket. However, specifying `cached=true` examines instead the bucket's manifest, which contains information about the canonical version of the bucket that resides in the remote store. For more information see [Troubleshoot SmartStore](/en/?resourceId=Splunk_Indexer_TroubleshootSmartStore) in *Managing Indexers and Clusters of Indexers*.

Default: For non-SmartStore indexes, the default is `false`. For SmartStore indexes, the default is `true`.

### Time scale units

These are options for specifying a timescale as the bucket span.

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <month> | <subseconds>

Description: Time scale units.

| Time scale | Syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <month> | mon | month | months | Time scale in months. |
| <subseconds> | us | ms | cs | ds | Time scale in microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |

### Information returned when no span is specified

When you invoke the `dbinspect` command without the `span` argument, the following information about the buckets in the index is returned.

| Field name | Description |
| --- | --- |
| `bucketId` | A string comprised of `<index>~<id>~<guId>`, where the delimiters are tilde characters. For example, `summary~2~4491025B-8E6D-48DA-A90E-89AC3CF2CE80`. |
| `endEpoch` | The timestamp for the last event in the bucket, which is the time-edge of the bucket furthest towards the future. Specify the timestamp in the number of seconds from the UNIX epoch. |
| `eventCount` | The number of events in the bucket. |
| `guId` | The globally unique identifier (GUID) of the server that hosts the index. This is relevant for index replication. |
| `hostCount` | The number of unique hosts in the bucket. |
| `id` | The local ID number of the bucket, generated on the indexer on which the bucket originated. |
| `index` | The name of the index specified in your search. You can specify `index=*` to inspect all of the indexes, and the index field will vary accordingly. |
| `modTime` | The timestamp for the last time the bucket was modified or updated, in a format specified by the `timeformat` flag. |
| `path` | The location to the bucket. The naming convention for the bucket `path` varies slightly, depending on whether the bucket rolled to warm while its indexer was functioning as a cluster peer:  * For non-clustered buckets: `db_<newest_time>_<oldest_time>_<localid>` * For clustered original bucket copies: `db_<newest_time>_<oldest_time>_<localid>_<guid>` * For clustered replicated bucket copies: `rb_<newest_time>_<oldest_time>_<localid>_<guid>`   For more information, read ["How Splunk stores indexes"](/en/?resourceId=Splunk_Indexer_HowSplunkstoresindexes) and ["Basic cluster architecture"](/en/?resourceId=Splunk_Indexer_Basicclusterarchitecture) in *Managing Indexers and Clusters of Indexers*. |
| `rawSize` | The volume in bytes of the raw data files in each bucket. This value represents the volume before compression and the addition of index files. |
| `sizeOnDiskMB` | The size in MB of disk space that the bucket takes up expressed as a floating point number. This value represents the volume of the compressed raw data files and the index files. |
| `sourceCount` | The number of unique sources in the bucket. |
| `sourceTypeCount` | The number of unique sourcetypes in the bucket. |
| `splunk_server` | The name of the Splunk server that hosts the index in a distributed environment. |
| `startEpoch` | The timestamp for the first event in the bucket (the time-edge of the bucket furthest towards the past), in number of seconds from the UNIX epoch. |
| `state` | Specifies whether the bucket is warm, hot, cold. |
| `tsidxState` | Specifies whether each bucket contains full-size or reduced tsidx files. If the value of this field in the results is `full`, the tsidx files are full-size. If the value is `mini`, the tsidx files are reduced. See [Determine whether a bucket is reduced](/en/?resourceId=Splunk_Indexer_Reducetsidxdiskusage) in Splunk Enterprise *Managing Indexers and Clusters of Indexers*. |
| `corruptReason` | Specifies the reason why the bucket is corrupt. The corruptReason field appears only when `corruptonly=true`. |

## Usage

The `dbinspect` command is a generating command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

### Accessing data and security

If no data is returned from the index that you specify with the `dbinspect` command, it is possible that you do not have the authorization to access that index. The ability to access data in the Splunk indexes is controlled by the authorizations given to each role. See [Use access control to secure Splunk data](/en/?resourceId=Splunk_Security_UseaccesscontroltosecureSplunkdata) in *Securing Splunk Enterprise*.

### Non-searchable bucket copies

For hot [non-searchable](https://docs.splunk.com/Splexicon:Non-searchable) bucket copies on target peers, tsidx and other metadata files are not maintained. Because accurate information cannot be reported, the following fields show NULL:

* eventCount
* hostCount
* sourceCount
* sourceTypeCount
* startEpoch
* endEpoch

## Examples

### 1. CLI use of the `dbinspect` command

Display a chart with the span size of 1 day, using the command line interface (CLI).

myLaptop $ splunk search "| dbinspect index=\_internal span=1d"

The results look like this:

 \_time hot-3 warm-1 warm-2
--------------------------- ----- ------ ------
2015-01-17 00:00:00.000 PST 0
2015-01-17 14:56:39.000 PST 0
2015-02-19 00:00:00.000 PST 0 1
2015-02-20 00:00:00.000 PST 2 1

### 2. Default dbinspect output

Default dbinspect output for a local \_internal index.

| dbinspect index=\_internal

The results look like this:

![Screenshot showing search results with 7 rows, and 12 columns titled bucketId, endEpoch, eventCount,guid, hostCount, id, index, modTime, path, rawSize, sizeOnDiskMB, and sourceCount.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/5c14e0d6-b0f1-47f6-ae5a-bb67aa52d02c?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1YzE0ZTBkNi1iMGYxLTQ3ZjYtYWU1YS1iYjY3YWE1MmQwMmMiLCJleHAiOjE3NjEwNjAwODksImp0aSI6ImE0YzA3ZjcxZTJlMDRiMDg5NmU1ZTNjY2YxZWRhMGY4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.u5aD4-1DY0qqmc1G6-JBoTCQJNlhIUaL4lb2w5TTlUQ)

This screenshot does not display all of the columns in the output table. On your computer, scroll to the right to see the other columns.

### 3. Check for corrupt buckets

Use the `corruptonly` argument to display information about corrupted buckets, instead of information about all buckets. The output fields that display are the same with or without the `corruptonly` argument.

| dbinspect index=\_internal corruptonly=true

### 4. Count the number of buckets for each Splunk server

Use this command to verify that the Splunk servers in your distributed environment are included in the `dbinspect` command. Counts the number of buckets for each server.

| dbinspect index=\_internal | stats count by splunk\_server

### 5. Find the index size of buckets in GB

Use dbinspect to find the index size of buckets in GB. For current numbers, run this search over a recent time range.

| dbinspect index=\_internal | eval GB=sizeOnDiskMB/1024| stats sum(GB)

### 6. Determine whether a bucket is reduced

Run the `dbinspect` search command:

| dbinspect index=\_internal

If the value of the `tsidxState` field for each bucket is `full`, the tsidx files are full-size. If the value is `mini`, the tsidx files are reduced.
