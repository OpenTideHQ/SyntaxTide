# inputcsv

## Description

For Splunk Enterprise deployments, loads search results from the specified .csv file, which is not modified. The filename must refer to a relative path in `$SPLUNK_HOME/var/run/splunk/csv`. If `dispatch=true`, the path must be in `$SPLUNK_HOME/var/run/splunk/dispatch/<job id>`.

If the specified file does not exist and the filename does not have an extension, then the Splunk software assumes it has a filename with a `.csv` extension.

Note: If you run into an issue with the `inputcsv` command resulting in an error, ensure that your CSV file ends with a BLANK LINE.

## Syntax

The required syntax is in bold.

| inputcsv

[dispatch=<bool>]

[append=<bool>]

[strict=<bool>]

[start=<int>]

[max=<int>]

[events=<bool>]

<filename>

[WHERE <search-query>]

### Required arguments

filename

Syntax: <filename>

Description: Specify the name of the .csv file, located in `$SPLUNK_HOME/var/run/splunk/csv`.

### Optional arguments

dispatch

Syntax: dispatch=<bool>

Description: When set to true, this argument indicates that the filename is a .csv file in the dispatch directory. The relative path is `$SPLUNK_HOME/var/run/splunk/dispatch/<job id>/`.

Default: false

append

Syntax: append=<bool>

Description: Specifies whether the data from the .csv file is appended to the current set of results (true) or replaces the current set of results (false).

Default: false

strict

Syntax: strict=<bool>

Description: When set to `true` this argument forces the search to fail completely if `inputcsv` raises an error. This happens even when the errors apply to a subsearch. When set to `false`, many `inputcsv` error conditions return warning messages but do not otherwise cause the search to fail. Certain error conditions cause the search to fail even when `strict=false`.

Default: false

events

Syntax: events=<bool>

Description: Specifies whether the data in the CSV file are treated as events or as a table of search results. By default `events=false` returns the data in a table with field names as column headings. The table appears on the Statistics tab. If you set `events=true`, the imported CSV data must have the `_time` and `_raw` fields. The data is treated as events, which appear on the Events tab.

Default: false

max

Syntax: max=<int>

Description: Controls the maximum number of events to be read from the file. If `max` is not specified, there is no limit to the number of events that can be read.

Default: 1000000000 (1 billion)

start

Syntax: start=<int>

Description: Controls the 0-based offset of the first event to be read.

Default: 0

WHERE

Syntax: WHERE <search-criteria>

Description: Use this clause to improve search performance by prefiltering data returned from the CSV file. Supports a limited set of search query operators: =, !=, <, >, <=, >=, AND, OR, NOT. Any combination of these operators is permitted. Also supports wildcard string searches.

## Usage

The `inputcsv` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

### Appending or replacing results

If the `append` argument is set to `true`, you can use the `inputcsv` command to append the data from the CSV file to the current set of search results. With `append=true`, you use the `inputcsv` command later in your search, after the search has returned a set of results. See [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_652bd6ec_a93a_4f9c_bbf6_0d01000c54eb__Examples).

The `append` argument is set to `false` by default. If the `append` argument is not specified or is set to `false`, the `inputcsv` command must be the first command in the search. Data is loaded from the specified CSV file into the search.

### Working with large CSV files

The `WHERE` clause allows you to narrow the scope of the search of the `inputcsv` file. It restricts the `inputcsv` to a smaller number of rows, which can improve search efficiency when you are working with significantly large CSV files.

### Distributed deployments

The `inputcsv` command is not compatible with [search head pooling](https://docs.splunk.com/Splexicon:Searchheadpooling) and  [search head clustering](https://docs.splunk.com/Splexicon:Searchheadclustering).

The command saves the `*.csv` file on the local search head in the `$SPLUNK_HOME/var/run/splunk/` directory. The `*.csv` files are not replicated on the other search heads.

### Strict error handling

Use the `strict` argument to make `inputcsv` searches fail whenever they encounter an error condition. You can set this at the system level for all `inputcsv` and `inputlookup` searches by changing `input_errors_fatal` in `limits.conf`

Note: If you use Splunk Cloud Platform, file a Support ticket to change the `input_errors_fatal` setting.

Use the `strict` argument to override the `input_errors_fatal` setting for an `inputcsv` search.

## Examples

### 1. Load results that contain a specific string

This example loads search results from the `$SPLUNK_HOME/var/run/splunk/csv/all.csv` file. Those that contain the string `error` are saved to the `$SPLUNK_HOME/var/run/splunk/csv/error.csv` file.

| inputcsv all.csv | search error | outputcsv errors.csv

### 2. Load a specific range of results

This example loads results 101 to 600 from either the `bar` file, if exists, or from the `bar.csv` file.

| inputcsv start=100 max=500 bar

### 3. Specifying which results to load with operators and expressions

You can use comparison operators and Boolean expression to specify which results to load.
This example loads all of the events from the CSV file `$SPLUNK_HOME/var/run/splunk/csv/students.csv` and then filters out the events that do not match the WHERE clause, where the values in the `age` field are greater than 13, less than 19, but not 16. The search returns a count of the remaining search results.

| inputcsv students.csv WHERE (age>=13 age<=19) AND NOT age=16 | stats count

### 4. Append data from a CSV file to search results

You can use the `append` argument to append data from a CSV file to a set of search results. In this example the combined data is then output back to the same CSV file.

error earliest=-d@d | inputcsv append=true all\_errors.csv | outputcsv all\_errors.csv

### 5. Appending multiple CSV files

You can also append the search results of one CSV file to another CSV file by using the `append` command and a subsearch. This example uses the `eval` command to add a field to each set of data to denote which CSV file the data originated from.

| inputcsv file1.csv | eval source="file1" | append [inputcsv file2.csv | eval source="file2"]

## See also

[outputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputcsv#id_257cd05f_fbb8_4239_bd87_75b0664f42fc__outputcsv)
