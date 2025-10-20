# datamodel

## Description

Examine and search data model datasets.

Use the `datamodel` command to return the JSON for all or a specified data model and its datasets. You can also search against the specified data model or a dataset within that datamodel.

A data model is a hierarchically-structured search-time mapping of semantic knowledge about one or more datasets. A data model encodes the domain knowledge necessary to build a variety of specialized searches of those datasets. For more information, see [About data models](/en/?resourceId=Splunk_Knowledge_Aboutdatamodels) and [Design data models](/en/?resourceId=Splunk_Knowledge_Designdatamodelobjects) in the *Knowledge Manager Manual*.

The `datamodel` search command lets you search existing data models and their datasets from the search interface.

The `datamodel` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) and should be the first command in the search. Generating commands use a leading pipe character.

## Syntax

| datamodel [<data model name>] [<dataset name>] [<data model search mode>] [strict\_fields=<bool>] [allow\_old\_summaries=<bool>] [summariesonly=<bool>]

### Required arguments

None

### Optional arguments

data model name

Syntax: <string>

Description: The name of the data model to search. When only the data model is specified, the search returns the JSON for the single data model.

dataset name

Syntax: <string>

Description: The name of a data model dataset to search. Must be specified after the data model name. The search returns the JSON for the single dataset.

data model search mode

Syntax: <data model search result mode> | <data model search string mode>

Description: You can use `datamodel` to run a search against a data model or a data model dataset that returns either results or a search string. If you want to do this, you must provide a `<data model search mode>`. There are two `<data model search mode>` subcategories: modes that return results and modes that return search strings. See [<data model search mode> options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel).

allow\_old\_summaries

Syntax: allow\_old\_summaries=<bool>

Description: This argument applies only to accelerated data models. When you change the constraints that define a data model but the Splunk software has not fully updated the summaries to reflect that change, the summaries may have some data that matches the old definition and some data that matches the new definition. By default, `allow_old_summaries = false`, which means that the search head does not use summary directories that are older than the new summary definition. This ensures that the `datamodel` search results always reflect your current configuration. When you set `allow_old_summaries = true`, `datamodel` uses both current summary data and summary data that was generated prior to the definition change. You can set `allow_old_summaries=true` in your search if you feel that the old summary data is close enough to the new summary data that its results are reliable.

Default: false

summariesonly

Syntax: summariesonly=<bool>

Description: This argument applies only to accelerated data models. When set to false, the `datamodel` search returns both summarized and unsummarized data for the selected data model. When set to true, the search returns results only from the data that has been summarized in TSIDX format for the selected data model. You can use this argument to identify what data is currently summarized for a given data model, or to ensure that a particular data model search runs efficiently.

Default: false

strict\_fields

Syntax: strict\_fields=<bool>

Description: Determines the scope of the `datamodel` search in terms of fields returned. When `strict_fields=true`, the search returns only default fields and fields that are included in the constraints of the specified data model dataset. When `strict_fields=false`, the search returns all fields defined in the data model, including fields inherited from parent data model datasets, extracted fields, calculated fields, and fields derived from lookups.

You can also arrange for `strict_fields` to default to `false` for a specific data model. See [Design data models](/en/?resourceId=Splunk_Knowledge_Designdatamodelobjects) in the *Knowledge Manager Manual*.

Default: true

### <data model search mode> options

data model search result mode

Syntax: search | flat | acceleration\_search

Description: The modes for running searches on a data model or data model dataset that return results.

| Mode | Description |
| --- | --- |
| `search` | Returns the search results exactly how they are defined. |
| `flat` | Returns the same results as the `search`, except that it strips the hierarchical information from the field names. For example, where `search` mode might return a field named `dmdataset.server`, the `flat` mode returns a field named `server`. |
| `acceleration_search` | Runs the search that the search head uses to accelerate the data model. This mode works only on root event datasets and root search datasets that only use streaming commands. |

data model search string mode

Syntax: search\_string | flat\_string | acceleration\_search\_string

Description: These modes return the strings for the searches that the Splunk software is actually running against the data model when it runs your SPL through the corresponding `<data model search result mode>`. For example, if you choose `acceleration_search_string`, the Splunk software returns the search string it would actually use against the data model when you run your SPL through `acceleration_search` mode.

## Usage

The `datamodel` command is a report-generating command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

## Examples

### 1. Return the JSON for all data models

Return JSON for all data models available in the current app context.

| datamodel

![This image shows the JSON for the built-in data models for the Search app.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/9951b36c-eec7-4011-8357-766d7a6fcc72?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI5OTUxYjM2Yy1lZWM3LTQwMTEtODM1Ny03NjZkN2E2ZmNjNzIiLCJleHAiOjE3NjEwNjAwODEsImp0aSI6ImVlZjVhYTVlZjQ5NDQyYTViMDgzNzRkZWNjY2VhMDE4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.eMLSx_HspSPs5J9424JqngZ7Ekkt9GHvtCtW5UBrwh8)

### 2. Return the JSON for a specific datamodel

Return JSON for the Splunk's Internal Audit Logs - SAMPLE data model, which has the model ID internal\_audit\_logs.

| datamodel internal\_audit\_logs

![This image shows the JSON for the internal audit logs, which is a built-in datamodel.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/63912d67-2c9e-4c59-bebd-1e8d6080f483?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI2MzkxMmQ2Ny0yYzllLTRjNTktYmViZC0xZThkNjA4MGY0ODMiLCJleHAiOjE3NjEwNjAwODEsImp0aSI6IjJmOTQ5ZjMwZWQ0OTRiYWZiYjlmMzc3YmJiYWJjYmM2IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.d8VyrcXk1GXZh97ZyZt9ppzY8csoz5pULl3jtMDgomI)

### 3. Return the JSON for a specific dataset

Return JSON for Buttercup Games's Client\_errors dataset.

| datamodel Tutorial Client\_errors

### 4. Run a search on a specific dataset

Run the search for Buttercup Games's Client\_errors.

| datamodel Tutorial Client\_errors search

### 5. Run a search on a dataset for specific criteria

Search Buttercup Games's Client\_errors dataset for 404 errors and count the number of events.

| datamodel Tutorial Client\_errors search | search Tutorial.status=404 | stats count

### 6. For an accelerated data model, reveal what data has been summarized over a selected time range

After the Tutorial data model is accelerated, this search uses the `summariesonly` argument in conjunction with `timechart` to reveal what data has been summarized for the Client\_errors dataset over a selected time range.

| datamodel Tutorial summariesonly=true search | timechart span=1h count

## See also

[pivot](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/pivot#b81328af_56c1_4628_ab25_58ad01fb3c63__pivot)
