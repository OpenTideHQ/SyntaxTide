# fieldsummary

## Description

The `fieldsummary` command calculates summary statistics for all fields or a subset of the fields in your events. The summary information is displayed as a results table.

## Syntax

fieldsummary [maxvals=<unsigned\_int>] [<wc-field-list>]

### Optional arguments

maxvals

Syntax: maxvals=<unsigned\_int>

Description: Specifies the maximum distinct values to return for each field. Cannot be negative. Set `maxvals = 0` to return all available distinct values for each field.

Default: 100

wc-field-list

Syntax: <field> ...

Description: A single field name or a space-delimited list of field names. You can use the asterisk ( \* ) as a wildcard to specify a list of fields with similar names. For example, if you want to specify all fields that start with "value", you can use a wildcard such as `value*`.

## Usage

The `fieldsummary` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The `fieldsummary` command displays the summary information in a results table. The following information appears in the results table:

| Summary field name | Description |
| --- | --- |
| `field` | The field name in the event. |
| `count` | The number of events/results with that field. |
| `distinct_count` | The number of unique values in the field. |
| `is_exact` | Whether or not the field is exact. This is related to the distinct count of the field values. If the number of values of the field exceeds `maxvals`, then `fieldsummary` will stop retaining all the values and compute an approximate distinct count instead of an exact one. 1 means it is exact, 0 means it is not. |
| `max` | If the field is numeric, the maximum of its value. |
| `mean` | If the field is numeric, the mean of its values. |
| `min` | If the field is numeric, the minimum of its values. |
| `numeric_count` | The count of numeric values in the field. This would not include NULL values. |
| `stdev` | If the field is numeric, the standard deviation of its values. |
| `values` | The distinct values of the field and count of each value. The values are sorted first by highest count and then by distinct value, in ascending order. |

## Examples

### 1. Return summaries for all fields

This example returns summaries for all fields in the `_internal` index from the last 15 minutes.

index=\_internal earliest=-15m latest=now | fieldsummary

In this example, the results in the `max`, `min`, and `stdev` fields are formatted to display up to 4 decimal points.

![This image shows a results table on the Statistics tab. The fields from the events are listed in the first column. The first few fields are, "abandoned_channels", "actual_only", "autoload", and "average_kbps". The summary fields in the results table are described in the Usage section of this topic.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/aa11cd3f-b9f6-4129-8574-1f29d5bce5c4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJhYTExY2QzZi1iOWY2LTQxMjktODU3NC0xZjI5ZDViY2U1YzQiLCJleHAiOjE3NjEwNjAxMDIsImp0aSI6Ijc4YzllNmUwZmQxNjRiMzc4YjZjYmYzODM2MzliZWVkIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.e6FtelJFh3oujY7p_VMG2hE1Ar5YPrQ_Lp-nlzM3Q7k)

### 2. Return summaries for specific fields

This example returns summaries for fields in the `_internal` index with names that contain "size" and "count". The search returns only the top 10 values for each field from the last 15 minutes.

index=\_internal earliest=-15m latest=now | fieldsummary maxvals=10 \*size\* \*count\*

![This image shows a results table on the Statistics tab. The fields from the events are listed in the first column. The first few fields are, "count", "current_queue_size", "current_size", and "current_size_kb". The summary fields in the results table are described in the Usage section of this topic.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/faadc139-0f62-404e-b960-f6c0eb7e3657?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJmYWFkYzEzOS0wZjYyLTQwNGUtYjk2MC1mNmMwZWI3ZTM2NTciLCJleHAiOjE3NjEwNjAxMDIsImp0aSI6IjM2NGYzNGFiZDhjOTRlMTRiNmJkMWFhOWZjMDg3Y2QwIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.qEnSNWEj6tcWDPC7mO9HojKzbBDJps_oJnB_V6bo5js)

## See also

[analyzefields](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/analyzefields#id_9b8ac476_dd48_4778_a9aa_54b0c357bbae__analyzefields),
[anomalies](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalies#de225778_642c_4dcc_9fba_c4b8041e2af1__anomalies),
[anomalousvalue](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalousvalue#adf8d264_6647_4cfc_a5eb_3363bb55a0a7__anomalousvalue),
[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)
