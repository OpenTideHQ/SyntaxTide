# outputcsv

## Description

If you have Splunk Enterprise, this command saves search results to the specified CSV file on the local search head in the `$SPLUNK_HOME/var/run/splunk/csv` directory. Updates to `$SPLUNK_HOME/var/run/*.csv` using the `outputcsv` command are not replicated across the cluster.

If you have Splunk Cloud Platform, you cannot use this command. Instead, you have these options:

* Export search results using Splunk Web. See [Export data using Splunk Web](/en/?resourceId=Splunk_Search_ExportdatausingSplunkWeb) in the *Search Manual*.
* Export search results using REST API. See [Export data using the REST APIs](/en/?resourceId=Splunk_Search_ExportdatausingRESTAPI) in the *Search Manual*.
* Create an alert action that includes a CSV file as an email attachment. See [Email notification action](/en/?resourceId=Splunk_Alert_Emailnotification) in the *Alerting Manual*.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

outputcsv [append=<bool>] [create\_empty=<bool>] [override\_if\_empty=<bool>] [dispatch=<bool>] [usexml=<bool>] [singlefile=<bool>] [<filename>]

### Optional arguments

append

Syntax: append=<bool>

Description: If `append` is true, the command attempts to append to an existing CSV file, if the file exists. If the CSV file does not exist, a file is created. If there is an existing file that has a CSV header already, the command only emits the fields that are referenced by that header. The command cannot append to .gz files.

Default:
`false`

create\_empty

Syntax: create\_empty=<bool>

Description: If set to `true` and there are no results, a zero-length file is created. When set to `false` and there are no results, no file is created. If the file previously existed, the file is deleted.

Default: false

dispatch

Syntax: dispatch=<bool>

Description: If set to true, refers to a file in the job directory in `$SPLUNK_HOME/var/run/splunk/dispatch/<job id>/`.

filename

Syntax: <filename>

Description: Specify the name of a CSV file to write the search results to. This file should be located in `$SPLUNK_HOME/var/run/splunk/csv`. Directory separators are not permitted in the filename. If no filename is specified, the command rewrites the contents of each result as a CSV row into the `_xml` field. Otherwise the command writes into a file. The `.csv` file extension is appended to the filename if the filename has no file extension.

override\_if\_empty

Syntax: override\_if\_empty=<bool>

Description: If `override_if_empty=true` and no results are passed to the output file, the existing output file is deleted, If `override_if_empty=false` and no results are passed to the output file, the command does not delete the existing output file.

Default: true

singlefile

Syntax: singlefile=<bool>

Description: If `singlefile` is set to true and the output spans multiple files, collapses it into a single file.

Default:
`true`

usexml

Syntax: usexml=<bool>

Description: If there is no filename, specifies whether or not to encode the CSV output into XML. This option should not be used when invoking the `outputcsv` from the UI.

## Usage

There is no limit to the number of results that can be saved to the CSV file.

### Internal fields and the `outputcsv` command

When the `outputcsv` command is used there are internal fields that are automatically added to the CSV file. The internal fields that are added to the output in the CSV file are:

* \_raw
* \_time
* \_indextime
* \_serial
* \_sourcetype
* \_subsecond

To exclude internal fields from the output, use the `fields` command and specify the fields that you want to exclude. For example:

... | fields - \_indextime \_sourcetype \_subsecond \_serial | outputcsv MyTestCsvFile

### Multivalued fields

The `outputcsv` command merges values in a multivalued field into single space-delimited value.

### Distributed deployments

The `outputcsv` command is not compatible with [search head pooling](https://docs.splunk.com/Splexicon:Searchheadpooling) and  [search head clustering](https://docs.splunk.com/Splexicon:Searchheadclustering).

The command saves the `*.csv` file on the local search head in the `$SPLUNK_HOME/var/run/splunk/` directory. The `*.csv` files are not replicated on the other search heads.

## Examples

### 1. Output search results to a CSV file

Output the search results to the `mysearch.csv` file. The CSV file extension is automatically added to the file name if you don't specify the extension in the search.

... | outputcsv mysearch

### 2. Add a dynamic timestamp to the file name

You can add a timestamp to the file name by using a subsearch.

... | outputcsv [stats count | eval search=strftime(now(), "mysearch-%y%m%d-%H%M%S.csv")]

### 3. Exclude internal fields from the output CSV file

You can exclude unwanted internal fields from the output CSV file. In this example, the fields to exclude are `_indextime`, `_sourcetype`, `_subsecond`, and `_serial`.

index=\_internal sourcetype="splunkd" | head 5 | fields \_raw \_time | fields - \_indextime \_sourcetype \_subsecond \_serial | outputcsv MyTestCsvfile

### 4. Do not delete the CSV file if no search results are returned

Output the search results to the `mysearch.csv` file if results are returned from the search. Do not delete the `mysearch.csv` file if no results are returned.

... | outputcsv mysearch.csv override\_if\_empty=false

## See also

[inputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_452fa3a9_a932_4597_a452_aec4c5be1d3e__inputcsv)
