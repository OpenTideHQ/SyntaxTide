# history

## Description

Use this command to view your search history in the current application. This search history is presented as a set of events or as a table.

## Syntax

| history [events=<bool>]

### Required arguments

None.

### Optional arguments

events

Syntax: events=<bool>

Description: When you specify `events=true`, the search history is returned as events. This invokes the event-oriented UI which allows for convenient highlighting, or field-inspection. When you specify `events=false`, the search history is returned in a table format for more convenient aggregate viewing.

Default: false

Fields returned when `events=false`.

| Output field | Description |
| --- | --- |
| `_time` | The time that the search was started. |
| `api_et` | The earliest time of the API call, which is the earliest time for which events were requested. |
| `api_lt` | The latest time of the API call, which is the latest time for which events were requested. |
| `event_count` | If the search retrieved or generated events, the count of events returned with the search. |
| `exec_time` | The execution time of the search in integer quantity of seconds into the Unix epoch. |
| `is_realtime` | Indicates whether the search was real-time (1) or historical (0). |
| `result_count` | If the search is a transforming search, the count of results for the search. |
| `scan_count` | The number of events retrieved from a Splunk index at a low level. |
| `search` | The search string. |
| `search_et` | The earliest time set for the search to run. |
| `search_lt` | The latest time set for the search to run. |
| `sid` | The search job ID. |
| `splunk_server` | The host name of the machine where the search was run. |
| `status` | The status of the search. |
| `total_run_time` | The total time it took to run the search in seconds. |

## Usage

The `history` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) and should be the first command in the search. Generating commands use a leading pipe character.

The `history` command returns your search history only from the application where you run the command.

## Examples

### Return search history in a table

Return a table of the search history. You do not have to specify `events=false`, since that this the default setting.

| history

![This image shows the fields that are created when you run the history command using the default setting.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/da6b5e90-cbb1-4d26-8189-6f5f1f0bff61?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJkYTZiNWU5MC1jYmIxLTRkMjYtODE4OS02ZjVmMWYwYmZmNjEiLCJleHAiOjE3NjEwNjAxMjUsImp0aSI6IjQwNDExMTEwZmY5NjRmMjc4YTE1YWRiNzJiODRkYmQ5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.Y6C63aGukLo7NmE0FDipYPvUSrHT4Z1mazj-RBZ6lOE)

### Return search history as events

Return the search history as a set of events.

| history events=true

![This image shows the search history as a set of events.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/5b632674-44b7-4db7-9194-6b575ade8ddd?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1YjYzMjY3NC00NGI3LTRkYjctOTE5NC02YjU3NWFkZThkZGQiLCJleHAiOjE3NjEwNjAxMjUsImp0aSI6ImQ5ZWM5ZmI1NzJiYzRmMzRhZmM4MGE4NjIyYjgwM2FhIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.I0Shvztcq8eC5Gg8lxCde60b8K-p1eyyoYGS0wVcobc)

## See also

Commands

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)
