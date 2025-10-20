# overlap

Note:

You should not use the `overlap` command to fill or backfill summary indexes. Splunk Enterprise provides a script called `fill_summary_index.py` that backfills your indexes or fill summary index gaps. If you have Splunk Cloud Platform and need to backfill, open a Support ticket and specify the time range, app, search name, user and any other details required to enable Splunk Support to backfill the required data. For more information, see ["Manage summary index gaps"](/en/?resourceId=Splunk_Knowledge_Managesummaryindexgapsandoverlaps) in the *Knowledge Manager Manual*.

## Description

Find events in a summary index that overlap in time, or find gaps in time during which a scheduled saved search might have missed events.

* If you find a gap, run the search over the period of the gap and summary index the results using "| collect".
* If you find overlapping events, manually delete the overlaps from the summary index by using the search language.

The `overlap` command invokes an external python script `$SPLUNK_HOME/etc/apps/search/bin/sumindexoverlap.py`. The script expects input events from the summary index and finds any time overlaps and gaps between events with the same 'info\_search\_name' but different 'info\_search\_id'.

Important: Input events are expected to have the following fields: 'info\_min\_time', 'info\_max\_time' (inclusive and exclusive, respectively) , 'info\_search\_id' and 'info\_search\_name' fields. If the index contains raw events (\_raw), the `overlap` command does not work. Instead, the index should contain events such as `chart`, `stats`, and `timechart` results.

## Syntax

overlap

## Examples

### Example 1:

Find overlapping events in the "summary" index.

index=summary | overlap

## See also

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect), [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop), [sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare), [sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart), [sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart)
