# addcoltotals

## Description

The `addcoltotals` command appends a new result to the end of the search result set. The result contains the sum of each numeric field or you can specify which fields to summarize. Results are displayed on the Statistics tab. If the `labelfield` argument is specified, a column is added to the statistical results table with the name specified.

## Syntax

addcoltotals [labelfield=<field>] [label=<string>] [<wc-field-list>]

### Optional arguments

<wc-field-list>

Syntax: <field> ...

Description: A space delimited list of valid field names. The `addcoltotals` command calculates the sum only for the fields in the list you specify. You can use the asterisk ( \* ) as a wildcard to specify a list of fields with similar names. For example, if you want to specify all fields that start with "value", you can use a wildcard such as `value*`.

Default: Calculates the sum for all of the fields.

labelfield

Syntax: labelfield=<fieldname>

Description: Specify a field name to add to the result set.

Default: none

label

Syntax: label=<string>

Description: Used with the `labelfield` argument to add a label in the summary event. If the `labelfield` argument is absent, the `label` argument has no effect.

Default: Total

## Basic examples

### 1. Compute the sums of all the fields

Compute the sums of all the fields, and put the sums in a summary event called "change\_name".

... | addcoltotals labelfield=change\_name label=ALL

### 2. Add a column total for two specific fields

Add a column total for two specific fields in a table.

sourcetype=access\_\* | table userId bytes avgTime duration | addcoltotals bytes duration

### 3. Create the totals for a field that match a field name pattern

Filter fields for two name-patterns, and get totals for one of them.

... | fields user\*, \*size | addcoltotals \*size

### 4. Specify a field name for the column totals

Augment a chart with a total of the values present.

index=\_internal source="metrics.log" group=pipeline | stats avg(cpu\_seconds) by processor | addcoltotals labelfield=processor

## Extended example

### 1. Generate a total for a column

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

The following search looks for events from web access log files that were successful views of strategy games. A count of the events by each product ID is returned.

sourcetype=access\_\* status=200 categoryId=STRATEGY | chart count AS views by productId

The results appear on the Statistics tab and look like this:

| productId | views |
| --- | --- |
| DB-SG-G01 | 1796 |
| DC-SG-G02 | 1642 |
| FS-SG-G03 | 1482 |
| PZ-SG-G05 | 1300 |

You can use the `addcoltotals` command to generate a total of the views and display the total at the bottom of the column.

sourcetype=access\_\* status=200 categoryId=STRATEGY | chart count AS views by productId | addcoltotals

The results appear on the Statistics tab and look something like this:

| productId | views |
| --- | --- |
| DB-SG-G01 | 1796 |
| DC-SG-G02 | 1642 |
| FS-SG-G03 | 1482 |
| PZ-SG-G05 | 1300 |
|  | 6220 |

You can use add a field to the results that labels the total.

sourcetype=access\_\* status=200 categoryId=STRATEGY | chart count AS views by productId | addcoltotals labelfield="Total views"

The results appear on the Statistics tab and look something like this:

| productId | views | Total views |
| --- | --- | --- |
| DB-SG-G01 | 1796 |  |
| DC-SG-G02 | 1642 |  |
| FS-SG-G03 | 1482 |  |
| PZ-SG-G05 | 1300 |  |
|  | 6220 | Total |

## See also

Commands

[addtotals](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/addtotals#e6382db2_bfaa_47e2_b54f_ef0636acbb77__addtotals)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)
