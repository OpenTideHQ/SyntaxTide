# sirare

Summary indexing is a method you can use to speed up long-running searches that *do not* qualify for report acceleration, such as searches that use commands that are not [streamable](https://docs.splunk.com/Splexicon:Streamingcommand) before the reporting command. For more information, see ["About report accelleration and summary indexing"](/en/?resourceId=Splunk_Knowledge_Aboutsummaryindexing) and ["Use summary indexing for increased reporting efficiency"](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

## Description

The `sirare` command is the summary indexing version of the `rare` command, which returns the least common values of a field or combination of fields. The `sirare` command populates a summary index with the statistics necessary to generate a rare report. After you populate the summary index, use the regular `rare` command with the exact same search string as the `rare` command search to report against it.

## Syntax

sirare [<top-options>...] <field-list> [<by-clause>]

### Required arguments

<field-list>

Syntax: <string>,...

Description: Comma-delimited list of field names.

### Optional arguments

<by-clause>

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

<top-options>

Syntax: countfield=<string> | limit=<int> | percentfield=<string> | showcount=<bool> | showperc=<bool>

Description: Options that specify the type and number of values to display. These are the same <top-options> used by the `rare` and `top` commands.

### Top options

countfield

Syntax: countfield=<string>

Description: Name of a new field to write the value of count.

Default: "count"

limit

Syntax: limit=<int>

Description: Specifies how many tuples to return, "0" returns all values.

percentfield

Syntax: percentfield=<string>

Description: Name of a new field to write the value of percentage.

Default: "percent"

showcount

Syntax: showcount=<bool>

Description: Specify whether to create a field called "count" (see "countfield" option) with the count of that tuple.

Default: true

showpercent

Syntax: showpercent=<bool>

Description: Specify whether to create a field called "percent" (see "percentfield" option) with the relative prevalence of that tuple.

Default: true

## Examples

### Example 1:

Compute the necessary information to later do 'rare foo bar' on summary indexed results.

... | sirare foo bar

## See also

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap), [sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart), [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats), [sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop)
