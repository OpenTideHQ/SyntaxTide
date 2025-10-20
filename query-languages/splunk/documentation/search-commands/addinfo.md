# addinfo

## Description

Adds fields to each event that contain global, common information about the search. This command is primarily an internally-used component of Summary Indexing.

## Syntax

addinfo

The following fields are added to each event when you use the `addinfo` command.

| Field | Description |
| --- | --- |
| `info_min_time` | The earliest time boundary for the search. |
| `info_max_time` | The latest time boundary for the search. |
| `info_sid` | The ID of the search that generated the event. |
| `info_search_time` | The time when the search was run. |

## Usage

The `addinfo` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### 1. Add information to each event

Add information about the search to each event.

... | addinfo

### 2. Determine which heartbeats are later than expected

You can use this example to track heartbeats from hosts, forwarders, tcpin\_connections on indexers, or any number of system components. This example uses hosts.

You have a list of host names in a lookup file called `expected_hosts`. You want to search for heartbeats from your hosts that are after an expected time range. You use the `addinfo` command to add information to each event that will help you evaluate the time range.

... | stats latest(\_time) AS latest\_time BY host
| addinfo | eval latest\_age = info\_max\_time - latest\_time | fields - info\_\*
| inputlookup append=t expected\_hosts | fillnull value=9999 latest\_age
| dedup host
| where latest\_age > 42

Use the `stats` command to calculate the latest heartbeat by host. The `addinfo` command adds information to each result. This search uses `info_max_time`, which is the latest time boundary for the search. The `eval` command is used to create a field called `latest_age` and calculate the age of the heartbeats relative to end of the time range. This allows for a time range of `-11m@m` to `-m@m`. This is the previous 11 minutes, starting at the beginning of the minute, to the previous 1 minute, starting at the beginning of the minute. The search does not work if you specify latest=null / all time because `info_max_time` would be set to +infinity.

Using the lookup file, `expected_hosts`, append the list of hosts to the results. Using this list you can determine which hosts are not sending a heartbeat in the expected time range. For any hosts that have a null value in the `latest_age` field, fill the field with the value 9999. Remove any duplicated host events with the `dedup` command. Use the `where` command to filter the results and return any heartbeats older than 42 seconds.

Note: In this example, you could use the `tstats` command, instead of the `stats` command, to improve the performance of the search.

## See also

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)
