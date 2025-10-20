# sistats

## Description

The `sistats` command is one of several commands that you can use to create summary indexes. Summary indexing is one of the methods that you can use to speed up searches that take a long time to run.

The `sistats` command is the summary indexing version of the `stats` command, which calculates aggregate statistics over the dataset.

The `sistats` command populates a summary index. You must then create a report to generate the summary statistics. See the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#id_2f8ac7d3_11ab_454f_ba7d_2f8c5a29c927__Usage) section.

## Syntax

sistats [allnum=<bool>] [delim=<string>] ( <stats-agg-term> | <sparkline-agg-term> ) [<by clause>]

* For descriptions of each of the arguments in this syntax, refer to the [stats](/en/?resourceId=Splunk_SearchReference_Stats) command.
* For information about functions that you can use with the `sistats` command, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

## Usage

The summary indexes exist separately from your main indexes.

After you create the summary index, create a report by running a search against the summary index. You use the exact same search string that you used to populate the summary index, substituting the `stats` command for the `sistats` command, to create your reports.

For more information, see [About report acceleration and summary indexing](/en/?resourceId=Splunk_Knowledge_Aboutsummaryindexing) and [Use summary indexing for increased reporting efficiency](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

### Statistical functions that are not applied to specific fields

With the exception of the `count` function, when you pair the `sistats` command with functions that are not applied to specific fields or `eval` expressions that resolve into fields, the search head processes it as if it were applied to a wildcard for all fields. In other words, when you have `| sistats avg` in a search, it returns results for `| sistats avg(*)`.

This "implicit wildcard" syntax is officially deprecated, however. Make the wildcard explicit. Write `| sistats <function>(*)` when you want a function to apply to all possible fields.

### Memory and sistats search performance

A pair of `limits.conf` settings strike a balance between the performance of `sistats` searches and the amount of memory they use during the search process, in RAM and on disk. If your `sistats` searches are consistently slow to complete you can adjust these settings to improve their performance, but at the cost of increased search-time memory usage, which can lead to search failures.

If you have Splunk Cloud Platform, you need to file a Support ticket to change these settings.

For more information, see [Memory and stats search performance](/en/?resourceId=Splunk_Search_Memoryandstatssearchperformance) in the *Search Manual*.

## Examples

### Example 1:

Create a summary index with the statistics about the average, for each hour, of any unique field that ends with the string "lay". For example, delay, xdelay, relay, etc.

... | sistats avg(\*lay) BY date\_hour

To create a report, run a search against the summary index using this search

index=summary | stats avg(\*lay) BY date\_hour

## See also

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap), [sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart), [sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop), [sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart)

For a detailed explanation and examples of summary indexing, see [Use summary indexing for increased reporting efficiency](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.
