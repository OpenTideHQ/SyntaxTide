# sitimechart

[Summary indexing](https://docs.splunk.com/Splexicon:Summaryindex) is a method you can use to speed up long-running searches that *do not* qualify for report acceleration, such as searches that use commands that are not [streamable](https://docs.splunk.com/Splexicon:Streamingcommand) before the transforming command. For more information, see ["About report accelleration and summary indexing"](/?resourceId=Splunk_Knowledge_Aboutsummaryindexing) and ["Use summary indexing for increased reporting efficiency"](/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

## Description

The `sitimechart` command is the summary indexing version of the `timechart` command, which creates a time-series chart visualization with a corresponding table of statistics. The `sitimechart` command populates a summary index with the statistics necessary to generate a timechart report. After you use an `sitimechart` search to populate the summary index, use the regular `timechart` command with the exact same search string as the `sitimechart` search to report against the summary index.

## Syntax

The required syntax is in bold.

sitimechart

[sep=<string>]

[partial=<bool>]

[cont=<bool>]

[limit=<int>]

[agg=<stats-agg-term>]

[<bin-options>... ]

<single-agg> [BY <split-by-clause>] | <eval-expression> BY <split-by-clause>

When specifying `sitimechart` command arguments, either <single-agg> or <eval-expression> BY <split-by-clause> is required.

For descriptions of each of these arguments, see the [timechart command](/?resourceId=Splunk_SearchReference_Timechart).

## Usage

### Supported functions

You can use a wide range of functions with the `sitimechart` command. For general information about using functions, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

* For a list of functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* For an alphabetical list of functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

## Examples

### Example 1:

Use the `collect` command to populate a summary index called `mysummary` with the statistics about CPU usage organized by host,

... | sitimechart avg(cpu) BY host | collect index=mysummary

Note: The `collect` command adds the results of a search to a summary index that you specify. You must create the summary index before you invoke the `collect` command.

Then use the `timechart` command with the same search to generate a timechart report.

index=mysummary | timechart avg(cpu) BY host

## See also

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap), [sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart), [sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare), [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop)
