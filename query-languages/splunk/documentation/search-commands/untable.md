# untable

## Description

Converts results from a tabular format to a format similar to [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats) output. This command is the inverse of the [xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries) command.

### Syntax

untable <x-field> <y-name-field> <y-data-field>

### Required arguments

<x-field>

Syntax: <field>

Description: The field to use for the x-axis labels or row names. This is the first field in the output.

<y-name-field>

Syntax: <field>

Description: A name for the field to contain the labels for the data series. All of the field names, other than <x-field>, are used as the values for the <y-name-field> field. You can specify any name for this field.

<y-data-field>

Syntax: <field>

Description: A name for the field to contain the data to chart. All of the values from the fields, other than <x-field>, are used as the values for the <y-data-field> field. You can specify any name for this field.

## Usage

The `untable` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Results with duplicate field values

When you untable a set of results and then use the `xyseries` command to combine the results, results that contain duplicate values are removed.

You can use the `streamstats` command create unique record numbers and use those numbers to retain all results. See [Extended examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#e9b983f3_da0a_436b_9c67_7444d21a3778__Extended_example).

## Basic example

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

To show how to use the `untable` command, we need results that appear in a table format. Run this search.

sourcetype=access\_\* status=200 action=purchase | top categoryId

The results appear on the Statistics tab and look something like this:

| categoryId | count | percent |
| --- | --- | --- |
| STRATEGY | 806 | 30.495649 |
| ARCADE | 493 | 18.653046 |
| TEE | 367 | 13.885736 |
| ACCESSORIES | 348 | 13.166856 |
| SIMULATION | 246 | 9.307605 |
| SHOOTER | 245 | 9.269769 |
| SPORTS | 138 | 5.221339 |

The `top` command automatically adds the count and percent fields to the results.

For each categoryId, there are two values, the count and the percent. When you untable these results, there will be three columns in the output:

* The first column lists the category IDs
* The second column lists the type of calculation: count or percent
* The third column lists the values for each calculation

When you use the `untable` command to convert the tabular results, you must specify the categoryId field first. You can use any field name you want for the type of calculation and the values. For example:

sourcetype=access\_\* status=200 action=purchase | top categoryId | untable categoryId calculation value

The results appear on the Statistics tab and look something like this:

| categoryId | calculation | value |  |
| --- | --- | --- | --- |
| STRATEGY | count | 806 |
| STRATEGY | percent | 30.495649 |
| ARCADE | count | 493 |
| ARCADE | percent | 18.653046 |
| TEE | count | 367 |
| TEE | percent | 13.885736 |
| ACCESSORIES | count | 348 |
| ACCESSORIES | percent | 13.166856 |
| SIMULATION | count | 246 |
| SIMULATION | percent | 9.307605 |

## Extended example

The `untable` command does exactly what the name says, it converts tabular information into individual rows of results. Suppose you have this search:

...| table \_time EventCode Message

The search produces these results:

| \_time | EventCode | Message |
| --- | --- | --- |
| date-time1 | 4136 | Too late now |
| date\_time2 | 1234 | I dont know |
| date\_time3 | 3456 | Too busy, ask again later |
| date\_time4 | 1256 | Everything is happening at once |
| date\_time4 | 1257 | And right now, as well |

Notice that this set of events has duplicate values in the `_time` field for `date_time4`. We will come back to that in a moment.

Use the `untable` command to remove the tabular format.

`...| untable _time FieldName FieldValue`

Here are the results from the `untable` command:

| \_time | FieldName | FieldValue |
| --- | --- | --- |
| date-time1 | EventCode | 4136 |
| date-time1 | Message | Too late now |
| date\_time2 | EventCode | 1234 |
| date-time2 | Message | I dont know |
| date\_time3 | EventCode | 3456 |
| date-time3 | Message | Too busy, ask again later |
| date\_time4 | EventCode | 1256 |
| date-time4 | Message | Everything is happening at once |
| date\_time4 | EventCode | 1257 |
| date-time4 | Message | And right now, as well |

### Events with duplicate timestamps

Remember that the original set of events in this example had duplicates for `date_time4`. If you want to process the events in some way and then put the events back together, you can avoid eliminating the duplicate events by using the `streamstats` command.

Use the `streamstats` command to give each event a unique record number and use that unique number as the key field for the `untable` and `xyseries` commands.

For example, you can add the `streamstats` command to your original search.

...| table \_time EventCode Message | streamstats count as recno

The search produces these results:

| \_time | EventCode | Message | recno |
| --- | --- | --- | --- |
| date-time1 | 4136 | Too late now | 1 |
| date\_time2 | 1234 | I dont know | 2 |
| date\_time3 | 3456 | Too busy, ask again later | 3 |
| date\_time4 | 1256 | Everything is happening at once | 4 |
| date\_time4 | 1257 | And right now, as well | 5 |

You can then add the `untable` command to your search, using `recno` as the <x-field>:

...| table \_time EventCode Message | streamstats count as recno | untable recno FieldName FieldValue

The search produces these results:

| recno | FieldName | FieldValue |
| --- | --- | --- |
| 1 | EventCode | 4136 |
| 1 | Message | Too late now |
| 2 | EventCode | 1234 |
| 2 | Message | I dont know |
| 3 | EventCode | 3456 |
| 3 | Message | Too busy, ask again later |
| 4 | EventCode | 1256 |
| 4 | Message | Everything is happening at once |
| 4 | EventCode | 1257 |
| 4 | Message | And right now, as well |

These events can be put back together by using the `xyseries` command, again using the `recno` field as the <x-field>. For example:

...| xyseries recno FieldName FieldValue

The search produces these results:

| recno | EventCode | Message |
| --- | --- | --- |
| 1 | 4136 | Too late now |
| 2 | 1234 | I dont know |
| 3 | 3456 | Too busy, ask again later |
| 4 | 1256 | Everything is happening at once |
| 5 | 1257 | And right now, as well |

### Restoring the timestamps

In addition to using the `streamstats` command to generate a record number, you can use the `rename` command to restore the timestamp information after the `xyseries` command. For example:

...| table \_time EventCode Message
| streamstats count as recno
| rename \_time as time
| untable recno FieldName FieldValue
| xyseries recno FieldName FieldValue
| rename time as \_time

(Thanks to Splunk users [DalJeanis](https://answers.splunk.com/users/455764/DalJeanis.html) and BigCosta for their help with this example.)

## See also

[xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries)
