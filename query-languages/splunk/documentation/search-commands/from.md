# from

## Description

The `from` command retrieves data from a dataset, such as a data model dataset, a CSV lookup, a KV Store lookup, a saved search, or a table dataset.

Design a search that uses the `from` command to reference a dataset. Optionally add additional SPL such as lookups, eval expressions, and transforming commands to the search. Save the result as a report, alert, or dashboard panel. If you use Splunk Cloud Platform, or use Splunk Enterprise and have installed the Splunk Datasets Add-on, you can also save the search as a table dataset.

See the Usage section.

## Syntax

The required syntax is in bold.

| from

<dataset\_type>:<dataset\_name> | <dataset\_type> <dataset\_name>

You can specify a colon ( : ) or a space between <dataset\_type> and <dataset\_name>.

### Required arguments

<dataset\_type>

Syntax: <dataset\_type>

Description: The type of dataset. Valid values are: `datamodel`, `lookup`, and `savedsearch`.

The `datamodel` dataset type can be either a data model dataset or a table dataset. You create data model datasets with the Data Model Editor. You can create table datasets with the Table Editor if you use Splunk Cloud Platform, or use Splunk Enterprise and have installed the Splunk Datasets Add-on.

The `lookup` dataset type can be either a CSV lookup or a KV Store lookup.

The `savedsearch` dataset type is a saved search. You can use `from` to reference any saved search as a dataset.

See [About datasets](/en/?resourceId=Splunk_Knowledge_Aboutdatasets) in the *Knowledge Manager Manual*.

<dataset\_name>

Syntax: <dataset\_name>

Description: The name of the dataset that you want to retrieve data from. If the `dataset_type` is a data model, the syntax is `<datamodel_name>.<dataset_name>`. If the name of the dataset contains spaces, enclose the dataset name in quotation marks.

Example: If the data model name is `internal_server`, and the dataset name is `splunkdaccess`, specify `internal_server.splunkdaccess` for the `dataset_name`.

Note: In older versions of the Splunk software, the term "data model object" was used. That term has been replaced with "data model dataset".

### Optional arguments

None.

## Usage

The `from` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand). It can be either report-generating or event-generating depending on the search or knowledge object that is referenced by the command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search. However, you can use the `from` command inside the `append` command.

When you use the `from` command, you must reference an existing dataset. You can reference any dataset listed in the Datasets listing page, such as data model datasets, CSV lookup files, CSV lookup definitions, and table datasets. You can also reference saved searches and KV Store lookup definitions. See [View and manage datasets](/en/?resourceId=Splunk_Knowledge_Workwithdatasets) in the *Knowledge Manager Manual*.

### Knowledge object dependencies

When you create a knowledge object such as a report, alert, dashboard panel, or table dataset, that knowledge object has a dependency on the referenced dataset. This is referred to as a dataset extension. When you make a change to the original dataset, such as removing or adding fields, that change propagates down to the reports, alerts, dashboard panels, and tables that have been extended from that original dataset. See [Dataset extension](/en/?resourceId=Splunk_Knowledge_Extenddatasets) in the *Knowledge Manager Manual*.

### When field filtering is disabled for a data model

When you search the contents of a data model using the `from` command, by default the search returns a strictly-filtered set of fields. It returns only default fields and fields that are explicitly identified in the constraint search that defines the data model.

If you have edit access to your local `datamodel.conf` file, you can disable field filtering for specific data models by adding the  `strict_fields=false` setting to their stanzas. When you do this, `| from` searches of data models with that setting return all fields related to the data model, including fields inherited from parent data models, fields extracted at search time, calculated fields, and fields derived from lookups.

## Examples

### 1. Search a data model

Search a data model that contains internal server log events for REST API calls. In this example, `internal_server` is the data model name and `splunkdaccess` is the dataset inside the `internal_server` data model.

| from datamodel:internal\_server.splunkdaccess

### 2. Search a lookup file

Search a lookup file that contains geographic attributes for each country, such as continent, two-letter ISO code, and subregion.

| from lookup geo\_attr\_countries.csv

### 3. Retrieve data by using a lookup file

Search the contents of the KV store collection kvstorecoll that have a `CustID` value greater than 500 and a `CustName` value that begins with the letter P. The collection is referenced in a lookup table called `kvstorecoll_lookup`. Using the `stats` command, provide a count of the events received from the table.

| from lookup:kvstorecoll\_lookup | where (CustID>500) AND (CustName="P\*") | stats count

### 4. Retrieve data using a saved search

This search retrieves the timestamp and client IP from the saved search called `mysecurityquery`.

| from savedsearch:mysecurityquery | fields \_time clientip ...

The search results look something like this.

![Screenshot of a partial cutout of search results for the example search. The first result is expanded to show on the first row that the Type is Event, the Field is clientip, and the Value is 182.236.164.11. On the second row, the Type is Time, the Field is _time, and the Value is 2022-08-28T18:20:56.000-07:00.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/39b3f95e-bffa-43e5-83e1-8d4e5da473ee?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIzOWIzZjk1ZS1iZmZhLTQzZTUtODNlMS04ZDRlNWRhNDczZWUiLCJleHAiOjE3NjEwNjAxMTMsImp0aSI6IjM5YjI1OWQyYWNhMDRjMTM4ZmE3YWM5Y2NhMmMzNjZiIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.fanygSYoZA6VA5001R_vJOuZe6Ei7PPrA4otOmfpf8I)

Even if the saved search is scheduled, this search is rerun, which can be expensive and lead to concurrency issues if more searches are run at the same time than the system can support. Alternatively, you can use the [loadjob](/en/?resourceId=Splunk_SearchReference_Loadjob) command instead of the `from` command in conjunction with a scheduled search if you are concerned about the number and frequency of searches that your users run.

### 5. Specify a dataset name that contains spaces

When the name of a dataset includes spaces, enclose the dataset name in quotation marks.

| from savedsearch "Top five sourcetypes"

## See also

Commands

[datamodel](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel)

[inputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputlookup#d34e0d7d_f9ab_409b_9722_45400f8f891a__inputlookup)

[inputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_452fa3a9_a932_4597_a452_aec4c5be1d3e__inputcsv)

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

[loadjob](/en/?resourceId=Splunk_SearchReference_Loadjob)
