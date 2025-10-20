# inputlookup

## Description

Use the `inputlookup` command to search the contents of a lookup table. The lookup table can be a CSV lookup or a KV store lookup.

## Syntax

The required syntax is in bold.

| inputlookup

[append=<bool>]

[strict=<bool>]

[start=<int>]

[max=<int>]

<filename> | <tablename>

[WHERE <search-query>]

### Required arguments

You must specify either a <filename> or a <tablename>.

<filename>

Syntax: <string>

Description: The name of the lookup file must end with `.csv` or `.csv.gz`. If the lookup does not exist, a warning message is displayed (but no syntax error is generated).

<tablename>

Syntax: <string>

Description: The name of the lookup table as specified by a stanza name in the `transforms.conf` file. The lookup table can be configured for any lookup type (CSV, external, or KV store).

### Optional arguments

append

Syntax: append=<bool>

Description: If set to `true`, the data returned from the lookup file is appended to the current set of results rather than replacing it. Defaults to `false`.

strict

Syntax: strict=<bool>

Description: When set to `true` this argument forces the search to fail completely if `inputlookup` raises an error. This happens even when the errors apply to a subsearch. When set to `false`, many `inputlookup` error conditions return warning messages but do not otherwise cause the search to fail. Certain error conditions cause the search to fail even when `strict=false`.

Default: false

max

Syntax max=<int>

Description: Specify the maximum number of events to be read from the file. Defaults to `1000000000`.

start

Syntax: start=<int>

Description: Specify the 0-based offset of the first event to read. If `start=0`, it begins with the first event. If `start=4`, it begins with the fifth event. Defaults to 0.

WHERE clause

Syntax: WHERE <search-query>

Description: Use this clause to improve search performance by prefiltering data returned from the lookup table. Supports a limited set of search query operators: =, !=, <, >, <=, >=, AND, OR, NOT. Any combination of these operators is permitted. Also supports wildcard string searches.

## Usage

The `inputlookup` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.
The `inputlookup` command can be first command in a search or in a subsearch.

The lookup can be a file name that ends with `.csv` or `.csv.gz`, or a lookup table definition in Settings > Lookups > Lookup definitions.

### Appending or replacing results

When using the `inputlookup` command in a subsearch, if `append=true`, data from the lookup file or KV store collection is appended to the search results from the main search. When `append=false` the main search results are replaced with the results from the lookup search.

### Working with large CSV lookup tables

The WHERE clause allows you to narrow the scope of the query that `inputlookup` makes against the lookup table. It restricts `inputlookup` to a smaller number of lookup table rows, which can improve search efficiency when you are working with significantly large lookup tables.

### Testing geometric lookup files

You can use the `inputlookup` command to verify that the geometric features on the map are correct. The syntax is `| inputlookup <your_lookup>`.

1. For example, to verify that the geometric features in built-in geo\_us\_states lookup appear correctly on the choropleth map, run the following search:

   | inputlookup geo\_us\_states
2. On the Visualizations tab, zoom in to see the geometric features. In this example, the states in the United States.

### Strict error handling

Use the `strict` argument to make `inputlookup` searches fail whenever they encounter an error condition. You can set this at the system level for all `inputcsv` and `inputlookup` searches by changing `input_errors_fatal` in `limits.conf`.

Note: If you use Splunk Cloud Platform, file a Support ticket to change the `input_errors_fatal` setting.

Use the `strict` argument to override the `input_errors_fatal` setting for an `inputlookup` search.

### Additional information

For more information about creating lookups, see [About lookups](/en/?resourceId=Splunk_Knowledge_Aboutlookupsandfieldactions) in the *Knowledge Manager Manual*.

For more information about the App Key Value store, see [About KV store](/en/?resourceId=Splunk_Admin_AboutKVstore) in the *Admin Manual*.

## Examples

### 1. Read in a lookup table

Read in a `usertogroup` lookup table that is defined in the `transforms.conf` file.

| inputlookup usertogroup

### 2. Append lookup table fields to the current search results

Using a subsearch, read in the `usertogroup` lookup table that is defined by a stanza in the `transforms.conf` file. Append the fields to the results in the main search.

... [| inputlookup append=t usertogroup]

### 3. Read in a lookup table in a CSV file

Search the `users.csv` lookup file, which is in the `$SPLUNK_HOME/etc/system/lookups` or `$SPLUNK_HOME/etc/apps/<app_name>/lookups` directory.

| inputlookup users.csv

### 4. Read in a lookup table from a KV store collection

Search the contents of the KV store collection `kvstorecoll` that have a `CustID` value greater than 500 and a `CustName` value that begins with the letter P. The collection is referenced in a lookup table called `kvstorecoll_lookup`. Provide a count of the events received from the table.

| inputlookup kvstorecoll\_lookup where (CustID>500) AND (CustName="P\*")
| stats count

Note: In this example, the lookup definition explicitly defines the `CustID` field as a type of "number". If the field type is not explicitly defined, the where clause does not work. Defining field types is optional.

### 5. View the internal key ID values for the KV store collection

Example 5: View internal key ID values for the KV store collection `kvstorecoll`, using the lookup table `kvstorecoll_lookup`. The internal key ID is a unique identifier for each record in the collection. This example uses the `eval` and `table` commands.

| inputlookup kvstorecoll\_lookup
| eval CustKey = \_key
| table CustKey, CustName, CustStreet, CustCity, CustState, CustZip

### 6. Update field values for a single KV store collection record

Update field values for a single KV store collection record. This example uses the `inputlookup`, `outputlookup`, and `eval` commands. The record is indicated by the its internal key ID (the `_key` field) and this search updates the record with a new customer name and customer city. The record belongs to the KV store collection `kvstorecoll`, which is accessed through the lookup table `kvstorecoll_lookup`.

| inputlookup kvstorecoll\_lookup
| search \_key=544948df3ec32d7a4c1d9755
| eval CustName="Claudia Garcia"
| eval CustCity="San Francisco"
| outputlookup kvstorecoll\_lookup append=true key\_field=\_key

### 7. Write the contents of a CSV file to a KV store collection

Write the contents of a CSV file to the KV store collection `kvstorecoll` using the lookup table `kvstorecoll_lookup`. The CSV file is in the `$SPLUNK_HOME/etc/system/lookups` or `$SPLUNK_HOME/etc/apps/<app_name>/lookups` directory.

| inputlookup customers.csv
| outputlookup kvstorecoll\_lookup

## See also

Commands

[inputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_452fa3a9_a932_4597_a452_aec4c5be1d3e__inputcsv)

[join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join)

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

[outputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputlookup#e143e626_d3c6_4b38_a299_073dbcc87b58__outputlookup)
