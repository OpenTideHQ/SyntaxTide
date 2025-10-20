# anomalousvalue

## Description

The `anomalousvalue` command computes an anomaly score for each field of each event, relative to the values of this field across other events. For numerical fields, it identifies or summarizes the values in the data that are anomalous either by frequency of occurrence or number of standard deviations from the mean.

For fields that are determined to be anomalous, a new field is added with the following scheme. If the field is numeric, such as `size`, the new field will be `Anomaly_Score_Num(size)`. If the field is non-numeric, such as `name`, the new field will be `Anomaly_Score_Cat(name)`.

Note: Use current Splunk machine learning (ML) tools to take advantage of the latest algorithms and get the most powerful results. See [About the Splunk Machine Learning Toolkit](/?resourceId=MLApp_User_AboutMLTK)
in the *Splunk Machine Learning Toolkit*.

## Syntax

anomalousvalue <av-options>... [action] [pthresh] [field-list]

### Required arguments

None.

### Optional arguments

<av-options>

Syntax: minsupcount=<int> | maxanofreq=<float> | minsupfreq=<float> | minnormfreq=<float>

Description: Specify one or more option to control which fields are considered for discriminating anomalies.

Descriptions for the av-option arguments

maxanofreq

Syntax: maxanofreq=<float>

Description: Maximum anomalous frequency is expressed as a floating point number between 0 and 1. Omits a field from consideration if the field is too frequently anomalous. If the ratio of anomalous occurrences of the field to the total number of occurrences of the field is greater than the `maxanofreq` value, then the field is removed from consideration.

Default 0.05

minnormfreq

Syntax: minnormfreq=<float>

Description: Minimum normal frequency is expressed as a floating point number between 0 and 1. Omits a field from consideration if the field is not anomalous frequently enough. If the ratio of anomalous occurrences of the field to the total number of occurrences of the field is smaller than *p*, then the field is removed from consideration.

Default: 0.01

minsupcount

Syntax: minsupcount=<int>

Description: Minimum supported count must be a positive integer. Drops a field that has a small number of occurrences in the input result set. If the field appears fewer than *N* times in the input events, the field is removed from consideration.

Default: 100

minsupfreq

Syntax: minsupfreq=<float>

Description: Minimum supported frequency is expressed as a floating point number between 0 and 1. Drops a field that has a low frequency of occurrence. The `minsupfreq` argument checks the ratio of occurrences of the field to the total number of events. If this ratio is smaller than *p* the field is removed from consideration.

Default: 0.05

action

Syntax: action=annotate | filter | summary

Description: Specify whether to return the anomaly score (annotate), filter out events that are not anomalous values (filter), or return a summary of anomaly statistics (summary).

Default: filter

Descriptions for the action arguments

annotate

Syntax: action=annotate

Description: The `annotate` action adds new fields to the events containing anomalous values. The fields that are added are `Anomaly_Score_Cat(field)`, `Anomaly_Score_Num(field)`, or both.

filter

Syntax: action=filter

Description: The `filter` action returns events with anomalous values. Events without anomalous values are removed. The events that are returned are annotated, as described for `action=annotate`.

summary

Syntax: action=summary

Description: The `summary` action returns a table summarizing the anomaly statistics for each field generated. The table includes how many events contained this field, the fraction of events that were anomalous, what type of test (categorical or numerical) were performed, and so on.

| Output field | Description |
| --- | --- |
| `fieldname` | The name of the field. |
| `count` | The number of times the field appears. |
| `distinct_count` | The number of unique values of the field. |
| `mean` | The calculated mean of the field values. |
| `catAnoFreq%` | The anomalous frequency of the categorical field. |
| `catNormFreq%` | The normal frequency of the categorical field. |
| `numAnoFreq%` | The anomalous frequency of the numerical field. |
| `stdev` | The standard deviation of the field value. |
| `supportFreq%` | The support frequency of the field. |
| `useCat` | Use categorical anomaly detection. Categorical anomaly detection looks for rare values. |
| `useNum` | Use numerical anomaly detection. Numerical anomaly detection looks for values that are far from the mean value. This anomaly detection is Gaussian distribution based. |
| `isNum` | Whether or not the field is numerical. |

field-list

Syntax: <field> ...

Description: The List of fields to consider.

Default: If no field list is provided, all fields are considered.

pthresh

Syntax: pthresh=<num>

Description: Probability threshold (as a decimal) that has to be met for a value to be considered anomalous.

Default: 0.01.

## Usage

By default, a maximum of 50,000 results are returned. This maximum is controlled by the `maxresultrows` setting in the `[anomalousvalue]` stanza in the [limits.conf](/?resourceId=Splunk_Admin_Limitsconf) file. Increasing this limit can result in more memory usage.

Note: Only users with file system access, such as system administrators, can edit the configuration files.
Never change or copy the configuration files in the `default` directory. The files in the `default` directory must remain intact and in their original location. Make the changes in the `local` directory.

See [How to edit a configuration file](/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile).

## Basic examples

### 1. Return only uncommon values from the search results

... | anomalousvalue

This is the same as running the following search:

...| anomalousvalue action=filter pthresh=0.01

### 2. Return uncommon values from the host "reports"

host="reports" | anomalousvalue action=filter pthresh=0.02

## Extended example

### 1. Return a summary of the anomaly statistics for each numeric field

|  |
| --- |
| This search uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and upload the file to your Splunk instance. This example uses the All Earthquakes data from the past 30 days. |

Search for anomalous values in the earthquake data.

source="all\_month.csv"| anomalousvalue action=summary pthresh=0.02 | search isNum=YES

![This image shows all of the columns that the anomalousvalue command returns. Twenty one results are returned, one for each field name in the earthquake events.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/080fdbd6-bbcf-42ba-a3ed-f1931e8bf960?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwODBmZGJkNi1iYmNmLTQyYmEtYTNlZC1mMTkzMWU4YmY5NjAiLCJleHAiOjE3NjEwNjAwNTMsImp0aSI6Ijc0OWE2MDczNTMyZjQ0YzA5N2E2OWY2M2ZhYjk2OTk2IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.UvN7aRKjm9KMsVcJ3Y3kG4Dp-Hpk5jj_39Z-3NSX14g)

The numeric results are returned with multiple decimals. Use the field formatting icon, which looks like a pencil, to enable number formatting and specify the decimal precision to display.

![This image shows the previous image with the field formatting dialog box. The number formatting has been changed in the catNormFreq% column to display two decimal places.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8146b461-492c-4769-8dcc-056d26ba9e5b?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4MTQ2YjQ2MS00OTJjLTQ3NjktOGRjYy0wNTZkMjZiYTllNWIiLCJleHAiOjE3NjEwNjAwNTMsImp0aSI6IjY2ZmM1OTIxOGYyZTRjNzY4YjYzNjc1YzVlNjIyYTFiIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.FyZICXN_TASrrFwtZfaFGL9qUJNcNgc-RD3TSGbxQS8)

## See also

[analyzefields](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/analyzefields#id_9b8ac476_dd48_4778_a9aa_54b0c357bbae__analyzefields), [anomalies](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalies#de225778_642c_4dcc_9fba_c4b8041e2af1__anomalies), [cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster), [kmeans](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kmeans#d0a3cb28_4602_427c_8c30_fa3e06f4fa95__kmeans), [outlier](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outlier#id_3e2dc81a_03fd_40f0_b0cb_a689011fe4a0__outlier)
