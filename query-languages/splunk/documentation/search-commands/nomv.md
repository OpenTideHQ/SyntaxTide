# nomv

## Description

Converts values of the specified multivalue field into one single value. Separates the values using a new line `"\n` delimiter.

Overrides the configurations for the multivalue field that are set in the `fields.conf` file.

## Syntax

nomv <field>

### Required arguments

field

Syntax: <field>

Description: The name of a multivalue field.

## Usage

The `nomv` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

You can use [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) and [statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions) on multivalue fields or to return multivalue fields.

## Examples

### Example 1:

For sendmail events, combine the values of the senders field into a single value. Display the top 10 values.

eventtype="sendmail" | nomv senders | top senders

## See also

Commands:

[makemv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makemv#fe8c2a8f_f15f_4663_b420_fd9634997d7d__makemv)[mvcombine](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_8805ef66_c6da_4ab1_bfaa_d1e6a903a04e__mvcombine)[mvexpand](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvexpand#abbcfd3b_7a2a_40a1_a15f_29efd5660135__mvexpand)[convert](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/convert#a9b0018b_50a9_4dc5_955d_d9535af8ff4d__convert)

Functions:

[Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)[Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions)[split](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)
