# multikv

## Description

Extracts field-values from table-formatted search results, such as the results of the `top`, `tstats`, and so on. The `multikv` command creates a new event for each table row and assigns field names from the title row of the table.

An example of the type of data the `multikv` command is designed to handle:

Name Age Occupation
Josh 42 SoftwareEngineer
Francine 35 CEO
Samantha 22 ProjectManager

The key properties here are:

* Each line of text represents a conceptual record.
* The columns are aligned.
* The first line of text provides the names for the data in the columns.

The `multikv` command can transform this table from one event into three events with the relevant fields. It works more easily with the fixed-alignment though can sometimes handle merely ordered fields.

The general strategy is to identify a header, offsets, and field counts, and then determine which components of subsequent lines should be included into those field names. Multiple tables in a single event can be handled (if multitable=true), but might require ensuring that the secondary tables have capitalized or ALLCAPS names in a header row.

Auto-detection of header rows favors rows that are text, and are ALLCAPS or Capitalized.

Note: For Splunk Cloud Platform, you must create a private app to extract field-value pairs from table-formatted search results. If you are a Splunk Cloud administrator with experience creating private apps, see [Manage private apps in your Splunk Cloud deployment](/en/?resourceId=SplunkCloud_Admin_PrivateApps) in the *Splunk Cloud Admin Manual*. If you have not created private apps, contact your Splunk account representative for help with this customization.

## Syntax

multikv [conf=<stanza\_name>] [<multikv-option>...]

### Optional arguments

conf

Syntax: conf=<stanza\_name>

Description: If you have a field extraction defined in `multikv.conf`, use this argument to reference the stanza in your search. For more information, refer to the configuration file reference for [multikv.conf](/en/?resourceId=Splunk_Admin_Multikvconf) in the *Admin Manual*.

<multikv-option>

Syntax: copyattrs=<bool> | fields <field-list> | filter <term-list> | forceheader=<int> | multitable=<bool> | noheader=<bool> | rmorig=<bool>

Description: Options for extracting fields from tabular events.

### Descriptions for multikv options

copyattrs

Syntax: copyattrs=<bool>

Description: When true, `multikv` copies all fields from the original event to the events generated from that event. When false, no fields are copied from the original event. This means that the events will have no \_time field and the UI will not know how to display them.

Default: true

fields

Syntax: fields <field-list>

Description: Limit the fields set by the multikv extraction to this list. Ignores any fields in the table which are not on this list.

filter

Syntax: filter <term-list>

Description: If specified, `multikv` skips over table rows that do not contain at least one of the strings in the filter list. Quoted expressions are permitted, such as "multiple words" or "trailing\_space ".

forceheader

Syntax: forceheader=<int>

Description: Forces the use of the given line number (1 based) as the table's header. Does not include empty lines in the count.

Default: The `multikv` command attempts to determine the header line automatically.

multitable

Syntax: multitable=<bool>

Description: Controls whether or not there can be multiple tables in a single \_raw in the original events.

Default: true

noheader

Syntax: noheader=<bool>

Description: Handle a table without header row identification. The size of the table will be inferred from the first row, and fields will be named Column\_1, Column\_2, ... `noheader=true` implies `multitable=false`.

Default: false

rmorig

Syntax: rmorig=<bool>

Description: When true, the original events will not be included in the output results. When false, the original events are retained in the output results, with each original emitted after the batch of generated results from that original.

Default: true

## Usage

The `multikv` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

Example 1: Extract the "COMMAND" field when it occurs in rows that contain "splunkd".

... | multikv fields COMMAND filter splunkd

Example 2: Extract the "pid" and "command" fields.

... | multikv fields pid command

## See also

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract), [kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform), [rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex), [spath](/en/?resourceId=Splunk_SearchReference_Spath), [xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv),
