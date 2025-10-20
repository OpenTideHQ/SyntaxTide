# mcollect

## Description

Converts events into metric data points and inserts the metric data points into a metric index on the search head. A metric index must be present on the search head for `mcollect` to work properly, unless you are forwarding data to the indexer.

Note: If you are forwarding data to the indexer, your data will be inserted on the indexer instead of the search head.

You can use the `mcollect` command only if your role has the `run_mcollect` capability. See [Define roles on the Splunk platform with capabilities](/en/?resourceId=Splunk_Security_Rolesandcapabilities) in *Securing Splunk Enterprise*.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold.

| mcollect index=<string>

[ file=<string> ]

[ split=<true | false | allnums> ]

[ spool=<bool> ]

[ prefix\_field=<string> ]

[ host=<string> ]

[ source=<string> ]

[ sourcetype=<string> ]

[ marker=<string> ]

[ <field-list> ]

### Required arguments

index

Syntax: index=<string>

Description: Name of the metric index where the collected metric data is added.

field-list

Syntax: <field>, ...

Description: A list of dimension fields. Required if `split=true`. Optional if `split=false` or `split=allnums`. If unspecified, which implies that `split=false`, `mcollect` treats all fields as dimensions for the data point except for the `metric_name`, `prefix_field`, and all internal fields.

Default: No default value

### Optional arguments

file

Syntax: file=<string>

Description: The file name where you want the collected metric data to be written. Only applicable when `spool=false`. You can use a timestamp or a random number for the file name by specifying either file=$timestamp$ or file=$random$.

Default: $random$\_metrics.csv

split

Syntax: split=<true | false | allnums>

Description: Determines how `mcollect` identifies the measures in an event. See [How to use the split argument](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mcollect#id_5483f6da_190a_46ef_8413_d9ba5ec4d4ba__How_to_use_the_split_argument).

Default: false

spool

Syntax: spool=<bool>

Description: If set to true, the metrics data file is written to the Splunk spool directory, `$SPLUNK_HOME/var/spool/splunk`, where the file is indexed. Once the file is indexed, it is removed. If set to false, the file is written to the `$SPLUNK_HOME/var/run/splunk` directory. The file remains in this directory unless further automation or administration is done.

Default: true

prefix\_field

Syntax: prefix\_field=<string>

Description: Only applicable when `split=true`. If specified, any data point with that field missing is ignored. Otherwise, the field value is prefixed to the metric name. See [Set a prefix field](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mcollect#id_5483f6da_190a_46ef_8413_d9ba5ec4d4ba__Set_a_prefix_field)

Default: No default value

host

Syntax: host=<string>

Description: The name of the host that you want to specify for the collected metrics data. Only applicable when `spool=true`.

Default: No default value

source

Syntax: source=<string>

Description: The name of the source that you want to specify for the collected metrics data.

Default: If the search is scheduled, the name of the search. If the search is ad-hoc, the name of the file that is written to the `var/spool/splunk` directory containing the search results.

sourcetype

Syntax: sourcetype=<string>

Description: The name of the source type that is specified for the collected metrics data. The Splunk platform does not calculate license usage for data indexed with `mcollect_stash`, the default source type. If you change the value of this setting to a different source type, the Splunk platform calculates license usage for any data indexed by the `mcollect` command.

Default: mcollect\_stash

CAUTION: Do not change this setting without assistance from Splunk Professional Services or Splunk Support. Changing the source type requires a change to the `props.conf` file.

marker

Syntax: marker=<string>

Description: A string of one or more comma-separated key/value pairs that `mcollect` adds as dimensions to the metric data points it generates, for the purpose of searching on those metric data points later. For example, you could add the name of the `mcollect` search that you are running, like this: `marker=savedsearch=firewall_top_src_ip`. This allows you to run searches later that isolate the metric data points created by that `mcollect` search, simply by adding `savedsearch=firewall_top_src_ip` to the search string.

## Usage

You use the `mcollect` command to convert events into metric data points to be stored in a metric index on the search head. The metrics data uses a specific format for the metrics fields. See
[Metrics data format](/en/?resourceId=Splunk_Metrics_GetStarted) in *Metrics*.

CAUTION: The `mcollect` command causes new data to be written to a metric index for every run of the search.

Note: All metrics search commands are case sensitive. This means, for example, that `mcollect` treats as the following as three distinct values of `metric_name`: `cap.gear`, `CAP.GEAR`, and `Cap.Gear`.

The Splunk platform cannot index metric data points that contain `metric_name` fields which are empty or composed entirely of white spaces.

### If you are upgrading to version 8.0.0

After you upgrade your search head and indexer clusters to version 8.0.x of Splunk Enterprise, edit `limits.conf` on each search head cluster and set the `always_use_single_value_output` setting under the `[mcollect]` stanza to `false`. This lets these nodes use the "multiple measures per metric data point" schema when you convert logs to metrics with the `mcollect` command or use metrics rollups. This schema increases your data storage capacity and improves metrics search performance.

### How to use the split argument

The `split` argument determines how `mcollect` identifies the measurement fields in your search. It defaults to `false`.

When `split=false`, your search needs to explicitly identify its measurement fields. If necessary it can use `rename` or `eval` conversions to do this.

* If you have single-metric events, your `mcollect` search must produce results with a `metric_name` field that provides the name of the measure, and a `_value` field that provides the measure's numeric value.
* If you have multiple-metric events, your `mcollect` search must produce results that follow this syntax: `metric_name:<metric_name>=<numeric_value>`. `mcollect` treats each of these fields as a measurement. `mcollect` treats the remaining fields as dimensions.

When you set `split=true`, you use `field-list` to identify the dimensions in your search. `mcollect` converts any field that is not in the `field-list` into a measurement. The only exceptions are internal fields beginning with an underscore and the `prefix_field`, if you have set one.

When you set `split=allnums`, `mcollect` treats all numeric fields as metric measures and all non-numeric fields as dimensions. You can optionally use `field-list` to declare that `mcollect` should treat certain numeric fields in the events as dimensions.

### Set a prefix field

Use the `prefix_field` argument to apply a prefix to the metric fields in your event data.

For example, if you have the following data:

`type=cpu usage=0.78 idle=0.22`

You have two metric fields, `usage` and `idle`.

Say you include the following in an `mcollect` search of that data:

...split=true prefix\_field=type...

Because you have set `split = true` the Splunk software automatically converts those fields into measures, because they are not otherwise identified in a `<field-list>`. Then it applies the value of the specified `prefix_field` as a prefix to the metric field names. In this case, because you have specified the `type` field as the prefix field, its value, `cpu`, becomes the metric name prefix. The results look like this:

| metric\_name:cpu.usage | metric\_name:cpu.idle |
| --- | --- |
| 0.78 | 0.22 |

### Time

If the `_time` field is present in the results, the Splunk software uses it as the timestamp of the metric data point. If the `_time` field is not present, the current time is used.

### field-list

If `field-list` is not specified, `mcollect` treats all fields as dimensions for the metric data points it generates, except for the `prefix_field` and internal fields (fields with an underscore '\_' prefix). If `field-list` is specified, the list must appear at the end of the `mcollect` command arguments. If `field-list` is specified, all fields are treated as metric values, except for the fields in `field-list`, the `prefix-field`, and internal fields.

The name of each metric value is the field name prefixed with the `prefix_field` value.

Effectively, one metric data point is returned for each qualifying field that contains a numerical value. If one search result contains multiple qualifying metric name/value pairs, the result is split into multiple metric data points.

## Examples

The following examples show how to use the `mcollect` command to convert events into multiple-value metric data points.

### 1: Generate metric data points that break out jobs and latency metrics by user

The following example specifies the metrics that should appear in the resulting metric data points, and splits them by user. Note that it does not use the `split` argument, so the search has to use a `rename` conversion to explicitly identify the measurements that will appear in the data points.

index="\_audit" search\_id info total\_run\_time
| stats count(search\_id) as jobs avg(total\_run\_time) as latency by user
| rename jobs as metric\_name:jobs latency as metric\_name:latency
| mcollect index=mcollect\_test

Here are example results of that search:

| \_time | user | metric\_name:jobs | metric\_name:latency |
| --- | --- | --- | --- |
| 1563318689 | admin | 25 | 3.8105555555555575 |
| 1563318689 | splunk-system-user | 129 | 0.2951162790697676 |

### 2: Generate metric data points that break out event counts and total runtimes by user

This search sets `split=true` so it automatically converts fields not otherwise identified as dimensions by the `<field-list>` into metrics. The search identifies `user` as a dimension.

index="\_audit" info=completed
| stats max(total\_run\_time) as runtime max(event\_count) as events by user
| mcollect index=mcollect\_test split=t user

Here are example results of that search:

| \_time | user | metric\_name:runtime | metric\_name:events |
| --- | --- | --- | --- |
| 1563318968 | admin | 0.29 | 293 |
| 1563318968 | splunk-system-user | 0.04 | 3 |

## See also

Commands

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect)

[meventcollect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/meventcollect#id_821ce9c1_7842_4262_9eb6_2be5145ed1f7__meventcollect)
