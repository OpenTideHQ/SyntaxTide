# folderize

## Description

Creates a higher-level grouping, such as replacing filenames with directories. Replaces the `attr` attribute value with a more generic value, which is the result of grouping the attr value with other values from other results, where grouping occurs by tokenizing the attr value on the sep separator value.

For example, the `folderize` command can group search results, such as those used on the Splunk Web home page, to list hierarchical buckets (e.g. directories or categories). Rather than listing 200 sources, the `folderize` command breaks the source strings by a separator (e.g. `/`) and determines if looking only at directories results in the number of results requested.

## Syntax

folderize attr=<string> [sep=<string>] [size=<string>] [minfolders=<int>] [maxfolders=<int>]

### Arguments

attr

Syntax: attr=<string>

Description: Replaces the `attr` attribute value with a more generic value, which is the result of grouping it with other values from other results, where grouping occurs by tokenizing the attribute (attr) value on the separator (sep) value.

sep

Syntax: sep=<string>

Description: Specify a separator character used to construct output field names when multiple data series are used in conjunction with a split-by field.

Default: ::

size

Syntax: size=<string>

Description: Supply a name to be used for the size of the folder.

Default: totalCount

minfolders

Syntax: minfolders=<int>

Description: Set the minimum number of folders to group.

Default: 2

maxfolders

Syntax: maxfolders=<int>

Description: Set the maximum number of folders to group.

Default: 20

## Examples

### 1. Group results into folders based on URI

Consider this search.

index=\_internal | stats count(uri) by uri

The following image shows the results of the search run using the All Time time range. Many of the results start with `/en-US/account`. Because some of the URIs are very long, the image does not show the second column on the far right. That column is the `count(uri)` column created by the `stats` command.

![This image shows the results in a table on the Statistics tab. There are two columns in the results: uri and count(uri). There are thousands of results.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/e2b419c4-e391-46b3-9738-f13708833f3a?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlMmI0MTljNC1lMzkxLTQ2YjMtOTczOC1mMTM3MDg4MzNmM2EiLCJleHAiOjE3NjEwNjAxMTQsImp0aSI6ImRhNDhmNTEwMGI3YjRkNTZiNjNjY2E1ZTUxODZkMmUxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.4eBxZ41GS3oxFtXIDTxd3VAl2gPHo1s146j_XemQWT4)

Using the `folderize` command, you can summarize the URI values into more manageable groupings.

index=\_internal | stats count(uri) by uri | folderize size=count(uri) attr=uri sep="/"

The following image shows the URIs grouped in the result set.

![This image shows the results in a table on the Statistics tab. There are three columns in the results: uri, count(uri), and memberCount. All of the URIs that begin with /en-US/ are grouped together on one line in the results. In this example, the URIs are grouped into eight results.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/dffe15b3-8dbe-4f59-80b3-722e472a0f04?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJkZmZlMTViMy04ZGJlLTRmNTktODBiMy03MjJlNDcyYTBmMDQiLCJleHAiOjE3NjEwNjAxMTQsImp0aSI6IjNkNDBjNmIwM2I3ZDQ4ZmE5YjgyZmFhODQ1ZWI5ZjMxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.QeUi69QqgrnJ0cZ3AeAxvmmuwTIV2AcdHUMJlXlTsnw)

In this example, the `count(uri)` column is the count of the unique URIs that were returned from the `stats` command. The
`memberCount` column shows the count of the URIs in each group. For example, the `/en-US/` URI was found 22 times in the events, as shown in the `count(uri)` column. When the `folderize` command arranges the URI into groups, there is only 1 member in the `/en-US/` group. Whereas the URIs that start with `/services/` occurred 10088 times in the events, but there are only 1648 unique members in the `/services/*` group.
