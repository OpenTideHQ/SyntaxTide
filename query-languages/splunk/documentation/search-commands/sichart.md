# sichart

Summary indexing is a method you can use to speed up long-running searches that *do not* qualify for report acceleration, such as searches that use commands that are not [streamable](https://docs.splunk.com/Splexicon:Streamingcommand) before the reporting command. For more information, see ["About report accelleration and summary indexing"](/en/?resourceId=Splunk_Knowledge_Aboutsummaryindexing) and ["Use summary indexing for increased reporting efficiency"](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

## Description

The summary indexing version of the `chart` command. The `sichart` command populates a summary index with the statistics necessary to generate a chart visualization. For example, it can create a column, line, area, or pie chart. After you populate the summary index, you can use the `chart` command with the exact same search that you used with the `sichart` command to search against the summary index.

## Syntax

Required syntax is in bold.

sichart

[sep=<string>]

[format=<string>]

[cont=<bool>]

[limit=<int>]

[agg=<stats-agg-term>]

( <stats-agg-term> | <sparkline-agg-term> | "("<eval-expression>")" )...

[ BY <field> [<bins-options>... ] [<split-by-clause>] ] | [ OVER <field> [<bins-options>...] [BY <split-by-clause>] ]

For syntax descriptions, refer to the [chart](/en/?resourceId=Splunk_SearchReference_Chart) command.

## Usage

### Supported functions

You can use a wide range of functions with the `sichart` command. For general information about using functions, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

* For a list of functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* For an alphabetical list of functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

## Examples

### Example 1:

Compute the necessary information to later do 'chart avg(foo) by bar' on summary indexed results.

... | sichart avg(foo) by bar

## See also

[chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart),
[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap), [sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare), [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats), [sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop)
