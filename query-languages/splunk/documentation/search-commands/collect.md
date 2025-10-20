# collect

## Description

Adds the results of a search to a [summary index](https://docs.splunk.com/Splexicon:Summaryindex) that you specify. You must create the summary index before you invoke the `collect` command.

You do not need to know how to use `collect` to create and use a summary index, but it can help. For an overview of summary indexing, see [Use summary indexing for increased reporting efficiency](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold.

collect

index=<string>

[<arg-options>...]

### Required arguments

index

Syntax: index=<string>

Description: Name of the summary index where the events are added. The index must exist before the events are added. The index is not created automatically.

### Optional arguments

arg-options

Syntax: addinfo=<bool> | addtime=<bool> | file=<string> | spool=<bool> | marker=<string> | uselb=<bool> | output\_format [raw | hec] | testmode=<bool> | run\_in\_preview=<bool> | host=<string> | source=<string> | sourcetype=<string> | timeformat=<string>

Description: Optional arguments for the collect command. See the arg-options section for the descriptions for each option.

### arg-options

addinfo

Syntax: addinfo=<bool>

Description: Use this option to specify whether to prefix search time and time-range information fields on to each summary index event. If set to `true`, adds fields to each event in the following format:

`info_min_time=<search_earliest_time>, info_max_time=<search_latest_time>, info_search_time=<search_exec_time>`

Default: True when summary events are destined for an events index or when `output_format=raw`. False when summary events are destined for a metrics index.

addtime

Syntax: addtime=<bool>

Description: Use this option to specify whether to prefix a time field on to each event. Some commands return results that do not have a `_raw` field, such as the [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats), [chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart) commands. If you specify `addtime=false`, the Splunk software uses its generic date detection against fields in whatever order they happen to be in the summary rows. If you specify `addtime=true`, the Splunk software uses the search time range `info_min_time`. This time range is added by the [sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats) command or `_time`. Splunk software adds the time field based on the first field that it finds: `info_min_time`, `_time`, or `now()`.

This option is not valid when `output_format=hec`.

Default: True when summary events are destined for an events index. False when summary events are destined for a metrics index.

file

Syntax: file=<string>

Description: The file name where you want the events to be written. You can use a timestamp or a random number for the file name by specifying either file=$timestamp$ or file=$random$.

Usage: ".stash" needs to be added at the end of the file name when used with "index=". Otherwise, the data is added to the main index.

Default: <random-number>\_events.stash

host

Syntax: host=<string>

Description: The name of the host that you want to specify for the events.

This option is not valid when `output_format=hec`.

marker

Syntax: marker=<string>

Description: A string, usually of key-value pairs, to append to each event written out. Each key-value pair must be separated by a comma and a space.

If the value contains spaces or commas, it must be escape quoted. For example if the key-value pair is `search_name=vpn starts and stops`, you must change it to `search_name=\"vpn starts and stops\"`.

This option is not valid when `output_format=hec`.

output\_format

Syntax: output\_format=[raw | hec]

Description: Specifies the output format for the summary indexing. If set to `raw`, uses the traditional non-structured log style summary indexing stash output format.

If set to `hec`, the `collect` command generates HTTP Event Collector (HEC) JSON formatted output.

By default, license usage is not counted in the following cases:

* When `output_format=raw` and the source type is the internal stash source type (`stash`).
* When `output_format=hec` and the source type is the internal stash source type (`stash_hec`).

To confirm whether the source type is `stash` or `stash_hec`, expand the event in the search results after you run your search.

License usage is counted when `output_format=hec` and the original source type is used instead of `stash_hec`.

When using `output_format=hec`, note that:

* All fields are automatically indexed when the stash file is indexed.
* The file that is written to the `var/spool/splunk` path ends in `.stash_hec` instead of `.stash`.
* The source, source type, and host from the original data are used directly in the summary index. These fields are not remapped to the `extract_host/extracted_sourcetype/...` path.
* The `index` and `splunk_server` fields in the original data are ignored.
* You can't use the `addtime`, `host`, `marker`, `source`, `sourcetype`, or `uselb` options.

Default: raw

run\_in\_preview

Syntax: run\_in\_preview=<bool>

Description: Controls whether the `collect` command is enabled during preview generation. Generally, you do not want to insert preview results into the summary index, `run_in_preview=false`. In some cases, such as when a custom search command is used as part of the search, you might want to turn this on to ensure correct summary indexable previews are generated.

Default: false

spool

Syntax: spool=<bool>

Description: If set to true, the summary indexing file is written to the Splunk spool directory, where it is indexed automatically. If set to false, the file is written to the `$SPLUNK_HOME/var/run/splunk/collect` directory. The file remains in this directory unless some form of further automation or administration is done. If you have Splunk Enterprise, you can use this command to troubleshoot summary indexing by dumping the output file to a location on disk where it will not be ingested as data.

Default: true

source

Syntax: source=<string>

Description: The name of the source that you want to specify for the events.

This option is not valid when `output_format=hec`.

sourcetype

Syntax: sourcetype=<string>

Description: The name of the source type that you want to specify for the events. If you specify a source type other than stash, the ingested summary data will count against your license usage.

This option is not valid when `output_format=hec`.

Default: stash

testmode

Syntax: testmode=<bool>

Description: Toggle between testing and real mode. In testing mode the results are not written into the new index but the search results are modified to appear as they would if sent to the index.

Default: false

timeformat

Syntax: timeformat=<string>

Description: Controls the format of the timestamp that is written to the stash file before it is indexed. The `addtime` argument must be set to `true` for the same invocation of the command in order to take advantage of this functionality.

Use this argument only if you need precise control over the format of output files that the `collect` command generates.

This option is not valid when `output_format=hec`.

Default: %m/%d/%Y %H:%M:%S %z

uselb

Syntax: uselb=<bool>

Description: Controls how line breaks are used to split events.

* When set to `true`, the data that is ingested using the `collect` command is split into individual events. A string identical to the LINE\_BREAKER setting defined for the `stash_new` source type in the `props.conf` file is used.
* When set to `false`, a simple line break is used to split events.
* Do not use this argument unless you are intentionally generating events with the `collect` command in a line-oriented format.
* This option is not valid when `output_format=hec`.
* NOTE: While the default behavior of the `collect` command is to use a LINE\_BREAKER setting identical to that used in the `props.conf` file, the default LINE\_BREAKER for the `collect` command is hardcoded. Changes to props.conf setting do NOT affect the behavior of the `uselb` option.

Default: true

## Usage

The events are written to a file whose name format is: `random-num_events.stash`, unless overwritten, in a directory that your Splunk deployment is monitoring. If the events contain a `_raw` field, then this field is saved. If the events do not have a `_raw` field, one is created by concatenating all the fields into a comma-separated list of key=value pairs.

The `collect` command also works with real-time searches that have a time range of All time.

### Events without timestamps

If you apply the `collect` command to events that do not have timestamps, the command designates a time for all of the events using the earliest (or minimum) time of the search range. For example, if you use the `collect` command over the past four hours (range: -4h to +0h), the command assigns a timestamp that is four hours prior to the time that the search was launched. The timestamp is applied to all of the events without a timestamp.

If you use the `collect` command with a time range of All time and the events do not have timestamps, the current system time is used for the timestamps.

For more information on summary indexing of data without timestamps, see [Use summary indexing for increased reporting efficiency](/en/?resourceId=Splunk_Knowledge_Usesummaryindexing) in the *Knowledge Manager Manual*.

### Copying events to a different index

You can use the `collect` command to copy search results to another index.
Construct a search that returns the data you want to copy, and pipe the results to the `collect` command. For example:

index=foo | ... | collect index=bar

This search writes the results into the `bar` index. The sourcetype is changed to `stash`.

You can specify a sourcetype with the `collect` command. However, specifying a sourcetype counts against your license, as if you indexed the data again.

### Change how collect summarizes multivalue fields on Splunk Enterprise

By default, the collect command summarizes multivalue fields as multivalue fields. For example, when collect summarizes the multivalue field `alphabet = a, b, c`, it adds the following field to the summary index:

alphabet: "a
b
c"

However, you might prefer the `collect` command to break multivalue fields into separate field-value pairs when it adds them to a \_raw field in a summary index. For example, if given the multivalue field `alphabet = a,b,c`, you can have the `collect` command add the following fields to a \_raw event in the summary index: `alphabet = "a", alphabet = "b", alphabet = "c"`

If you are using Splunk Enterprise and you prefer to have `collect` follow this multivalue field summarization format, set the `limits.conf` setting `format_multivalue_collect` to `true`.

To change the `format_multivalue_collect` setting in your local limits.conf file and enable `collect` to break multivalue fields into separate fields, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file at `$SPLUNK_HOME/etc/system/local`.
2. Under the `[collect]` stanza, set `format_multivalue_collect` to `true`.

### The collect and tstats commands

The `collect` command does not segment data by [major breakers](https://docs.splunk.com/Splexicon:Majorbreak) and [minor breakers](https://docs.splunk.com/Splexicon:Minorbreak), such as characters like spaces, square or curly brackets, parenthesis, semicolons, exclamation points, periods, and colons. As a result, if either major or minor breakers are found in value strings, Splunk software places quotation marks around field values when it adds events to the summary index. These extra quotation marks can cause problems for subsequent searches. In particular, field values that have quotation marks around them can't be used in [tstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#e6057acd_1ed5_49ec_9881_ecdd6240a953__tstats) searches with the [PREFIX()](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#id_79890a08_37d0_45e3_b1d6_860dbf942904__Use_PREFIX.28.29_to_aggregate_or_group_by_raw_tokens_in_indexed_data) directive. This is because `PREFIX()` does not support major breakers like quotation marks.

For example, in the following search with the `collect` command, the field values in quotes include periods as minor breakers.

| makeresults | eval application="buttercupgames.com", version="2.0" | collect index=summary source=devtest

The search results look something like this.

| \_time | application | version |
| --- | --- | --- |
| 2021-12-07 11:43:48 | buttercupgames.com | 2.0 |

So far, that looks fine, right? Not exactly. Although there aren't any extra quotation marks around the field values `buttercupgames.com` and `2.0` that are displayed in the search results, you will see them if you look in summary index. To see what is in the summary index, run the following search:

index=summary source=devtest

Now you can see `version="2.0"` and `application="buttercupgames.com"`. The results look something like this:

| Time | Event |
| --- | --- |
| 12/7/21   11:43:48.000 AM | 12/07/2021 11:43:48 -0800, info\_search\_time=1638906228.401, version="2.0", application="buttercupgames.com"   host = PF32198D | source = devtest | sourcetype = stash |

If you want to run a `tstats` search with the `PREFIX()` directive using those field values with quotation marks that are collected in a summary index like our previous example, you will need to edit your limits.conf file. You can do this by changing the `collect_ignore_minor_breakers` setting in the `[collect]` stanza from the default to `true`.

Splunk Cloud Platform

To change the `collect_ignore_minor_breakers` setting in your limits.conf file, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the `collect_ignore_minor_breakers` setting in your local limits.conf file, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps:

1. Open or create a local limits.conf file at $SPLUNK\_HOME/etc/system/local.
2. Under the `[collect]` stanza, add the line `collect_ignore_minor_breakers=true`.

## Examples

### 1. Put "download" events into an index named "download count"

eventtypetag="download" | collect index=downloadcount

### 2. Collect statistics on VPN connects and disconnects

You want to collect hourly statistics on VPN connects and disconnects by country.

index=mysummary
| geoip REMOTE\_IP
| eval country\_source=if(REMOTE\_IP\_country\_code="US","domestic","foreign")
| bin \_time span=1h
| stats count by \_time,vpn\_action,country\_source
| addinfo
| collect index=mysummary marker="summary\_type=vpn, summary\_span=3600,
summary\_method=bin, search\_name=\"vpn starts and stops\""

The `addinfo` command ensures that the search results contain fields that specify when the search was run to populate these particular index values.

### 3. Ingest fields using the collect command and HEC formatted output

Say you want to create a few fields in your index by running the following search:

| makeresults
| eval source="mysource", sourcetype="mysourcetype", host="myhost", sentinel="4", \_raw="this is an event with a key=value pair"
| collect index=main output\_format=hec

The results look like this:

| \_raw | \_time | host | sentinel | source | sourcetype |
| --- | --- | --- | --- | --- | --- |
| this is an event with a key=value pair | 2024-01-12T19:22:55.000-08:00 | myhost | 4 | mysource | mysourcetype |

To see what the event we've just generated looks like in the index, run the following search:

index=main

The following image shows that all of the fields that were specified in the search appear as fields in the index.

![Shows a partial cutout of search results for the example search. The top shows the date and time as 2024-01-12T19:22:55.000-08:00, as well as the raw event, which is "this is an event with a key=value pair". The first event is expanded. The first 3 rows show that host is set to myhost, source is set to mysource, and sourcetype is set to mysourcetype. In the subsequent rows, the Event is set to key value, the sentinel is set to 4, and the index is set to main.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/92a6f983-ac4c-41eb-acd5-278d07eb836f?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI5MmE2Zjk4My1hYzRjLTQxZWItYWNkNS0yNzhkMDdlYjgzNmYiLCJleHAiOjE3NjEwNjAwNzgsImp0aSI6IjUwZTQ3MjU1M2I1ZTRjMDE4NThjMWQwYmEyNzQxZDM4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.k-VtkjjOelivDCIZBkzMikgWMLJ60hvZk7G3bR-rRuc)

Note:

This search counts against your license usage because the search assigned a value to the source type and didn't use the default `stash_hec` sourcetype.

## See also

Commands

[overlap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/overlap#e4e479b3_a003_46ab_a284_a1f81c198597__overlap)

[sichart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sichart#bda276c3_54e7_40af_bd6e_2ae655d879b9__sichart)

[sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare)

[sistats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sistats#f6f1f215_8bf8_412c_a6de_4d9e111e6dab__sistats)

[sitimechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitimechart#id_7d2cfd23_2b7b_46d3_b65a_2082b5d1051e__sitimechart)

[sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop)

[tscollect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tscollect#b3da2b12_db21_4054_ab8a_2702ae294a44__tscollect)
