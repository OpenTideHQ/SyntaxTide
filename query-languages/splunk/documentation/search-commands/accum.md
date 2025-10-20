# accum

## Description

For each event where `field` is a number, the `accum` command calculates a running total or sum of the numbers. The accumulated sum can be returned to either the same field, or a `newfield` that you specify.

## Syntax

accum <field> [AS <newfield>]

### Required arguments

field

Syntax: <string>

Description: The name of the field that you want to calculate the accumulated sum for. The field must contain numeric values.

### Optional arguments

newfield

Syntax: <string>

Description: The name of a new field where you want the results placed.

## Basic example

### 1. Create a running total of a field

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

The following search looks for events from web access log files that were successful views of strategy games. A count of the events by each product ID is returned.

sourcetype=access\_\* status=200 categoryId=STRATEGY | chart count AS views by productId

The results appear on the Statistics tab and look something like this:

| productId | views |
| --- | --- |
| DB-SG-G01 | 1796 |
| DC-SG-G02 | 1642 |
| FS-SG-G03 | 1482 |
| PZ-SG-G05 | 1300 |

You can use the `accum` command to generate a running total of the views and display the running total in a new field called "TotalViews".

sourcetype=access\_\* status=200 categoryId=STRATEGY | chart count AS views by productId | accum views as TotalViews

The results appear on the Statistics tab and look something like this:

| productId | views | TotalViews |
| --- | --- | --- |
| DB-SG-G01 | 1796 | 1796 |
| DC-SG-G02 | 1642 | 3438 |
| FS-SG-G03 | 1482 | 4920 |
| PZ-SG-G05 | 1300 | 6220 |

## See also

[autoregress](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/autoregress#id_6c11d555_ad43_4b23_b0a4_0bd64d538fa3__autoregress), [delta](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/delta#aea489ea_dd56_4a9e_a42e_a6f865ed8c88__delta), [streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats), [trendline](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/trendline#id_1985bcca_9e84_45c1_877c_68cb1b56e716__trendline)
