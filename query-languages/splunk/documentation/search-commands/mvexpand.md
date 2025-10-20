# mvexpand

## Description

Expands the values of a multivalue field into separate events, one event for each value in the multivalue field. For each result, the `mvexpand` command creates a new result for every multivalue field.

Note: The `mvexpand` command can't be applied to internal fields.

See [Use default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields) in the *Knowledge Manager Manual*.

## Syntax

mvexpand <field> [limit=<int>]

### Required arguments

field

Syntax: <field>

Description: The name of a multivalue field.

### Optional arguments

limit

Syntax: limit=<int>

Description: Specify the number of values of <field> to use for each input event.

Default: 0, or no limit

## Usage

The `mvexpand` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

You can use [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) and [statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions) on multivalue fields or to return multivalue fields.

### Limits

A limit exists on the amount of RAM that the `mvexpand` command is permitted to use while expanding a batch of results. By default the limit is 500MB. The input chunk of results is typically `maxresultrows` or smaller in size, and the expansion of all these results resides in memory at one time. The total necessary memory is the average result size multiplied by the number of results in the chunk multiplied by the average size of the multivalue field being expanded.

If this attempt exceeds the configured maximum on any chunk, the chunk is truncated and a warning message is emitted. If you have Splunk Enterprise, you can adjust the limit by editing the `max_mem_usage_mb` setting in the `limits.conf` file.

Prerequisites

* Have the permissions to increase the `maxresultrows` and `max_mem_usage_mb` settings. Only users with file system access, such as system administrators, can increase the `maxresultrows` and `max_mem_usage_mb` settings using configuration files.
* Know how to edit configuration files. Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.
* Decide which directory to store configuration file changes in. There can be configuration files with the same name in your default, local, and app directories. See [Where you can place (or find) your modified configuration files](/en/?resourceId=Splunk_Admin_Configurationfiledirectories) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

If you use Splunk Cloud Platform and encounter problems because of this limit, file a Support ticket.

## Examples

### Example 1:

Create new events for each value of multivalue field, "foo".

... | mvexpand foo

### Example 2:

Create new events for the first 100 values of multivalue field, "foo".

... | mvexpand foo limit=100

### Example 3:

The `mvexpand` command only works on one multivalue field. This example walks through how to expand an event with more than one multivalue field into individual events for each field value. For example, given these events, with sourcetype=data:

2018-04-01 00:11:23 a=22 b=21 a=23 b=32 a=51 b=24
2018-04-01 00:11:22 a=1 b=2 a=2 b=3 a=5 b=2

First, use the [rex command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex) to extract the field values for a and b. Then use the [eval command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval) and [mvzip function](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) to create a new field from the values of a and b.

source="mvexpandData.csv"
| rex field=\_raw "a=(?<a>\d+)" max\_match=5
| rex field=\_raw "b=(?<b>\d+)" max\_match=5
| eval fields = mvzip(a,b)
| table \_time fields

The results appear on the Statistics tab and look something like this:

| \_time | fields |
| --- | --- |
| 2018-04-01 00:11:23 | 22,21   23,32  51,24 |
| 2018-04-01 00:11:22 | 1,2   2,3  5,2 |

Use the mvexpand command and the [rex command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex) on the new field, fields, to create new events and extract the alpha and beta values:

source="mvexpandData.csv"
| rex field=\_raw "a=(?<a>\d+)" max\_match=5
| rex field=\_raw "b=(?<b>\d+)" max\_match=5
| eval fields = mvzip(a,b)
| mvexpand fields
| rex field=fields "(?<alpha>\d+),(?<beta>\d+)"
| table \_time alpha beta

Use the [table command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/table#a4df0a30_3b45_471a_ab81_c60b7477dfad__table) to display only the \_time, alpha, and beta fields in a results table.

The results appear on the Statistics tab and look something like this:

| \_time | alpha | beta |
| --- | --- | --- |
| 2018-04-01 00:11:23 | 23 | 32 |
| 2018-04-01 00:11:23 | 51 | 24 |
| 2018-04-01 00:11:22 | 1 | 2 |
| 2018-04-01 00:11:22 | 2 | 3 |
| 2018-04-01 00:11:22 | 5 | 2 |

(Thanks to Splunk user Duncan for this example.)

## See also

Commands:

[makemv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makemv#fe8c2a8f_f15f_4663_b420_fd9634997d7d__makemv)[mvcombine](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_8805ef66_c6da_4ab1_bfaa_d1e6a903a04e__mvcombine)[nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv)

Functions:

[Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)[Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions)[split](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)
