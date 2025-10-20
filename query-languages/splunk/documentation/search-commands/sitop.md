# sitop

Summary indexing is a method you can use to speed up long-running searches that *do not* qualify for report acceleration, such as searches that use commands that are not [streamable](https://docs.splunk.com/Splexicon:Streamingcommand) before the reporting command. For more information, see [Overview of summary-based search acceleration](/en/?resourceId=Splunk_Knowledge_Aboutsummaryindexing) and [Use summary indexing for increased reporting efficiency](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

## Description

The `sitop` command is the summary indexing version of the `top` command, which returns the most frequent value of a field or combination of fields. The `sitop` command populates a summary index with the statistics necessary to generate a top report. After you populate the summary index, use the regular `top` command with the exact same search string as the `sitop` command search to report against it.

## Syntax

sitop [<N>] [<top-options>...] <field-list> [<by-clause>]

Note: This is the exact same syntax as that of the `top` command.

### Required arguments

<field-list>

Syntax: <field>, ...

Description: Comma-delimited list of field names.

### Optional arguments

<N>

Syntax: <int>

Description: The number of results to return.

<top-options>

Syntax: countfield=<string> | limit=<int> | otherstr=<string> | percentfield=<string> | showcount=<bool> | showperc=<bool> | useother=<bool>

Description: Options for the `sitop` command. See Top options.

<by-clause>

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

### Top options

countfield

Syntax: countfield=<string>

Description: The name of a new field that the value of count is written to.

Default: count

limit

Syntax: limit=<int>

Description: Specifies how many tuples to return, "0" returns all values.

Default: "10"

otherstr

Syntax: otherstr=<string>

Description: If useother is true, specify the value that is written into the row representing all other values.

Default: "OTHER"

percentfield

Syntax: percentfield=<string>

Description: Name of a new field to write the value of percentage.

Default: "percent"

showcount

Syntax: showcount=<bool>

Description: Specify whether to create a field called "count" (see "countfield" option) with the count of that tuple.

Default: true

showperc

Syntax: showperc=<bool>

Description: Specify whether to create a field called "percent" (see "percentfield" option) with the relative prevalence of that tuple.

Default: true

useother

Syntax: useother=<bool>

Description: Specify whether or not to add a row that represents all values not included due to the limit cutoff.

Default: false

## Examples

### Example 1:

Compute the necessary information to later do 'top foo bar' on summary indexed results.

... | sitop foo bar

### Example 2:

Populate a summary index with the top source IP addresses in a scheduled search that runs daily:

eventtype=firewall | sitop src\_ip

Save the search as, "Summary - firewall top src\_ip".

Later, when you want to retrieve that information and report on it, run this search over the past year:

index=summary search\_name="summary - firewall top src\_ip" |top src\_ip

Additionally, because this search specifies the search name, it filters out other data that have been placed in the summary index by other summary indexing searches.

## See also

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap), [sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart), [sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare), [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats), [sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart)
