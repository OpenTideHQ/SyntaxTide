# metadata

## Description

The `metadata` command returns a list of sources, sourcetypes, or hosts from a specified index or distributed search peer. The `metadata` command returns information accumulated over time. You can view a snapshot of an index over a specific timeframe, such as the last 7 days, by using the time range picker.

See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_80147486_1472_42d0_b3f4_944439f35fb2__Usage).

## Syntax

| metadata type=<metadata-type> [<index-specifier>]... [splunk\_server=<wc-string>] [splunk\_server\_group=<wc-string>]...<datatype>

### Required arguments

type

Syntax: type= hosts | sources | sourcetypes

Description: The type of metadata to return. This must be one of the three literal strings: hosts, sources, or sourcetypes.

### Optional arguments

index-specifier

Syntax: index=<index\_name>

Description: Specifies the index from which to return results. You can specify more than one index. Wildcard characters (\*) can be used. To match non-internal indexes, use `index=*`. To match internal indexes, use `index=_*`.

Example:
`| metadata type=hosts index=cs* index=na* index=ap* index=eu*`

Default: The default index, which is usually the main index.

splunk\_server

Syntax: splunk\_server=<wc-string>

Description: Specifies the distributed search peer from which to return results.

If you are using Splunk Cloud Platform, omit this parameter.

If you are using Splunk Enterprise, you can specify only one `splunk_server` argument. However, you can use a wildcard when you specify the server name to indicate multiple servers. For example, you can specify `splunk_server=peer01` or `splunk_server=peer*`. Use `local` to refer to the search head.

Default: All configured search peers return information

splunk\_server\_group

Syntax: splunk\_server\_group=<wc-string>...

Description: Limits the results to one or more server groups. If you are using Splunk Cloud, omit this parameter. You can specify a wildcard character in the string to indicate multiple server groups.

datatype-options

Syntax: datatype=[metric|event]

Description: Specifies whether to limit the search to the metrics index or the event index.

## Usage

The `metadata` command is a [report-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

Although the `metadata` command fetches data from all peers, any command run after it runs only on the search head.

The command shows the first, last, and most recent events that were seen for each value of the specified `metadata` type. For example, if you search for:

| metadata type=hosts

Your results should look something like this:

![This image shows a table of metadata information by host. The fields are host, type, firstTime, lastTime, recentTime, and totalCount.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/6d5a32c8-9aa7-4068-beeb-e32504dd85d8?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI2ZDVhMzJjOC05YWE3LTQwNjgtYmVlYi1lMzI1MDRkZDg1ZDgiLCJleHAiOjE3NjEwNjAxNTQsImp0aSI6IjUxOTM3MDI5NTA0ODQ1OWM5MDkzY2EyMGZkZDFlNTc4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.gl66nLc4QI4F-w8tMxFLadXxZrP0Ke7DDrIWdkINazs)

* The `firstTime` field is the timestamp for the first time that the indexer saw an event from this host.
* The `lastTime` field is the timestamp for the last time that the indexer saw an event from this host.
* The `recentTime` field is the `indextime` for the most recent time that the index saw an event from this host. In other words, this is the time of the last update.
* The `totalcount` field is the total number of events seen from this host.
* The `type` field is the specified type of metadata to display. Because this search specifies `type=hosts`, there is also a `host` column.

In most cases, when the data is streaming live, the `lastTime` and `recentTime` field values are equal. If the data is historical, however, the values might be different.

In small testing environments, the data is complete. However, in environments with large numbers of values for each category, the data might not be complete. This is intentional and allows the `metadata` command to operate within reasonable time and memory usage.

### Real-time searches

Running the `metadata` command in a real-time search that returns a large number of results will very quickly consume all the available memory on the Splunk server. Use caution when you use the `metadata` command in real-time searches.

### Time ranges

Set the time range using the Time Range Picker. You cannot use the `earliest` or `latest` time range modifiers in the search string. Time range modifiers must be set before the first piped command and generating commands in general do not allow anything to be specified before the first pipe.

If you specify a time range other than `All Time` for your search, the search results might not be precise. The metadata is stored as aggregate numbers for each bucket on the index. A bucket is either included or not included based on the time range you specify.

For example, you run the following search specifying a time range of `Last 7 days`. The time range corresponds to January 1st to January 7th.

| metadata type=sourcetypes index=ap

There is a bucket on the index that contains events from both December 31st and January 1st. The metadata from that bucket is included in the information returned from search.

### Maximum results

By default, a maximum of 10,000 results are returned. This maximum is controlled by the `maxresultrows` setting in the `[metadata]` stanza In the [limits.conf](/en/?resourceId=Splunk_Admin_Limitsconf) file.

## Examples

### 1. Search multiple indexes

Return the metadata for indexes that represent different regions.

| metadata type=hosts index=cs\* index=na\* index=ap\* index=eu\*

### 2. Search for sourcetypes

Return the values of `sourcetypes` for events in the `_internal` index.

| metadata type=sourcetypes index=\_internal

This returns the following report.

![This image shows a table of information for the _internal index by sourcetype.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ccca40e8-56a2-440d-8481-bb7d03d82ebd?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJjY2NhNDBlOC01NmEyLTQ0MGQtODQ4MS1iYjdkMDNkODJlYmQiLCJleHAiOjE3NjEwNjAxNTQsImp0aSI6IjY5MDUxNmYxODExOTRmNTZhZDBlZmM0ODQzNzAzYzY2IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.6ECw0yvxRx6wpPljaa17g8DzQX2oSMcBfENmH58lvuk)

### 3. Search for values of host

Return the values of `host` for data points in the `mymetrics` index.

| metadata type=hosts index=mymetrics datatype=metric

### 4. Format the results from the metadata command

You can also use the [fieldformat command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldformat#c84c2c6c_da0a_40f0_8774_be2ed930434d__fieldformat) to format the results of the firstTime, lastTime, and recentTime columns to be more readable.

| metadata type=sourcetypes index=\_internal | rename totalCount as Count firstTime as "First Event" lastTime as "Last Event" recentTime as "Last Update" | fieldformat Count=tostring(Count, "commas") | fieldformat "First Event"=strftime('First Event', "%c") | fieldformat "Last Event"=strftime('Last Event', "%c") | fieldformat "Last Update"=strftime('Last Update', "%c")

Click on the Count field label to sort the results and show the highest count first. Now, the results are more readable:

![This image shows how the results of renaming the fields returned by the metadata command.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/4c38a5df-60af-4765-b9d6-605640d8ab40?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0YzM4YTVkZi02MGFmLTQ3NjUtYjlkNi02MDU2NDBkOGFiNDAiLCJleHAiOjE3NjEwNjAxNTQsImp0aSI6ImI4ZmFmNmVhMzBmZDRhYmRiMzEzYzU2Nzc5ODJkMjYxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.58clIe_wGkSCN7agZ9i1ylJ1zn6fEqB2yj8n_CI8Dm8)

### 5. Return values of "sourcetype" for events in a specific index on a specific server or wildcarded server

Return values of `sourcetype` for events in the `_audit` index on server peer01.

| metadata type=sourcetypes index=\_audit splunk\_server=peer01

To return values of `sourcetype` for events in the `_audit` index on any server name that begins with `peer`.

| metadata type=sourcetypes index=\_audit splunk\_server=peer\*

## See also

[dbinspect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dbinspect#id_65645b52_c80f_4b2a_80c8_e61f90cca410__dbinspect)

[tstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#e6057acd_1ed5_49ec_9881_ecdd6240a953__tstats)
