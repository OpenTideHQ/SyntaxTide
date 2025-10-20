# gauge

## Description

Use the `gauge` command to transform your search results into a format that can be used with the gauge charts. Gauge charts are a visualization of a single aggregated metric, such as a count or a sum.

The output of the `gauge` command is a single numerical value stored in a field called `x`. You can specify a range to display in the gauge or use the default range of 0 to 100.

For more information about using the `gauge` command with the gauge chart types, see [Using gauges](/en/?resourceId=Splunk_Viz_CreateGauges) in the Gauges section in *Dashboards and Visualizations*.

## Syntax

gauge <value> [<range\_val1> <range\_val2> ...]

### Required arguments

value

Syntax: field\_name | <num>

Description: A numeric field or literal number to use as the current value of the gauge. If you specify a numeric field, the `gauge` command uses the first value in that field as the value for the gauge.

### Optional arguments

range values

Syntax: <range\_val1> <range\_val2> ...

Description: A space-separated list of two or more numeric fields or numbers to use as the overall numeric range displayed in the gauge. Each range value can be a numeric field name or a literal number. If you specify a field name, the first value in that field is used as the range value. The total range of the gauge is from the first `range_val` to the last `range_val`. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/gauge#c5ed11db_4863_4532_9ba5_b6ca361d1426__Usage).

Default range: 0 to 100

## Usage

You can create gauge charts without using the `gauge` command as long as your search results in a single value. The advantage of using the `gauge` command is that you can specify a set of range values instead of using the default range values of 0 to 100.

### Specifying ranges

If you specify range values, you must specify at least two values. The gauge begins at the first value and ends at the last value that you specify.

If you specify more than two `range_val` arguments, the intermediate range values are used to split the total range into subranges. Each subrange displays in different color, which creates a visual distinction.

The range values are returned as a series of fields called `y1`, `y2`, and so on.

If you do not specify range values, the range defaults to a low value of 0 and a high value of 100.

If a single range value is specified, it is ignored.

### Gauge colors

With a gauge chart, a single numerical value is mapped against a set of colors. These colors can have particular business meaning or business logic. As the value changes over time, the gauge marker changes position within this range.

The color ranges in the gauge chart are based on the range values that you specify with the `gauge` command. When you specify range values, you define the overall numerical range represented by the gauge. You can define the size of the colored bands within that range. If you want to use the color bands, add four range values to the search string. These range values indicate the beginning and end of the range. These range values also indicate the relative sizes of the color bands within this range.

## Examples

### 1. Create a gauge with multiple ranges

Count the number of events and display the count on a gauge with four ranges, from 0-750, 750-1000, 1000-1250, and 1250-1500.

Start by generating the results table using this search. Run the search using the Last 15 minutes time range.

index=\_internal | stats count as myCount | gauge myCount 750 1000 1250 1500

The results appear on the Statistics tab and look something like this:

| x | y1 | y2 | y3 | y4 |
| --- | --- | --- | --- | --- |
| 3321 | 750 | 1000 | 1250 | 1500 |

Click on the Visualizations tab. There are three types of gauges that you can choose from: radial, filler, and marker. The following image shows the radial gauge that is created based on the search results.

![This image shows a radial gauge. The value, 3321, is greater than the highest number, 1500, in the range values. The gauge needle is at the 1500 range marker.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/21e80ee4-7ffb-4b7f-9a92-a5a170d6fc78?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyMWU4MGVlNC03ZmZiLTRiN2YtOWE5Mi1hNWExNzBkNmZjNzgiLCJleHAiOjE3NjEwNjAxMTgsImp0aSI6IjQzMGYyNWUxYmQ0YzQ3OTM5NmFkYWJhMmZkZDkxNDMxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.uIniv7TLmgrNM_8GW8sV0j2VTAMvqnKxp1YsbWWGImo)

For more information about using the `gauge` command with the gauge chart type, see the [Gauges](/en/?resourceId=Splunk_Viz_Visualizationreference) section in *Dashboard and Visualizations*.

## See also

Commands

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)
