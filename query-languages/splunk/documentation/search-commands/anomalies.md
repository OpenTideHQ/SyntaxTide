# anomalies

## Description

Use the `anomalies` command to look for events or field values that are unusual or unexpected.

The `anomalies` command assigns an unexpectedness score to each event and places that score in a new field named `unexpectedness`. Whether the event is considered anomalous or not depends on a `threshold` value. The `threshold` value is compared to the unexpectedness score. The event is considered unexpected or anomalous if the unexpectedness score is greater than the `threshold` value.

After you use the `anomalies` command in a search, look at the Interesting Fields list in the Search & Reporting window. Select the `unexpectedness` field to see information about the values in your events.

The unexpectedness score of an event is calculated based on the similarity of that event (X) to a set of previous events (P).

The formula for unexpectedness is:

unexpectedness = [s(P and X) - s(P)] / [s(P) + s(X)]

In this formula, `s( )` is a metric of how similar or uniform the data is. This formula provides a measure of how much adding X affects the similarity of the set of events. The formula also normalizes the results for the differing event sizes.

Note: Use current Splunk machine learning (ML) tools to take advantage of the latest algorithms and get the most powerful results. See [About the Splunk Machine Learning Toolkit](/en/?resourceId=MLApp_User_AboutMLTK)
in the *Splunk Machine Learning Toolkit*.

## Syntax

The required syntax is in bold.

anomalies

[threshold=<num>]

[labelonly=<bool>]

[normalize=<bool>]

[maxvalues=<num>]

[field=<field>]

[denylist=<filename>]

[denylistthreshold=<num>]

[by-clause]

### Optional arguments

threshold

Syntax: threshold=<num>

Description: A number to represent the upper limit of expected or normal events. If unexpectedness calculated for an event is greater than this threshold limit, the event is considered unexpected or anomalous.

Default: 0.01

labelonly

Syntax: labelonly=<bool>

Description: Specifies if you want the output result set to include all events or only the events that are above the threshold value. The `unexpectedness` field is appended to all events. If `labelonly=true`, no events are removed. If `labelonly=false`, events that have a unexpectedness score less than the threshold are removed from the output result set.

Default: false

normalize

Syntax: normalize=<bool>

Description: Specifies whether or not to normalize numeric text in the fields. All characters in the field from 0 to 9 are considered identical for purposes of the algorithm. The placement and quantity of the numbers remains significant. When a field contains numeric data that should not be normalized but treated as categories, set `normalize=false`.

Default: true

maxvalues

Syntax: maxvalues=<num>

Description: Specifies the size of the sliding set of previous events to include when determining the unexpectedness of a field value. By default the calculation uses the previous 100 events for the comparison. If the current event number is 1000, the calculation uses the values in events 900 to 999 in the calculation. If the current event number is 1500, the calculation uses the values in events 1400 to 1499 in the calculation. You can specify a number between 10 and 10000. Increasing the value of `maxvalues` increases the total CPU cost per event linearly. Large values have very long search runtimes.

Default: 100

field

Syntax: field=<field>

Description: The field to analyze when determining the unexpectedness of an event.

Default:
`_raw`

denylist

Syntax: denylist=<filename>

Description: The name of a CSV file that contains a list of events that are expected and should be ignored. Any incoming event that is similar to an event in the denylist is treated as not anomalous, or expected, and given an unexpectedness score of 0.0. The CSV file must be located in the `$SPLUNK_HOME/var/run/splunk/csv` directory on the search head. If you have Splunk Cloud Platform and want to configure a denylist file, file a Support ticket.

denylistthreshold

Syntax: denylistthreshold=<num>

Description: Specifies a similarity score threshold for matching incoming events to denylisted events. If the incoming event has a similarity score above the `denylistthreshold`, the event is marked as unexpected.

Default: 0.05

by-clause

Syntax: by <fieldlist>

Description: Use to specify a list of fields to segregate the results for anomaly detection. For each combination of values for the specified fields, the events with those values are treated entirely separately.

## Examples

### 1. Specify a denylist file of the events to ignore

The following example shows the interesting events, ignoring any events in the denylist 'boringevents'. Sort the event list in descending order, with highest value in the unexpectedness field listed first.

... | anomalies denylist=boringevents | sort -unexpectedness

### 2. Find anomalies in transactions

This example uses transactions to find regions of time that look unusual.

... | transaction maxpause=2s | anomalies

### 3. Identify anomalies by source

Look for anomalies in each source separately. A pattern in one source does not affect that it is anomalous in another source.

... | anomalies by source

### 4. Specify a threshold when identifying anomalies

This example shows how to tune a search for anomalies using the `threshold` value.
Start with a search that uses the default `threshold` value.

index=\_internal | anomalies BY group | search group=\*

This search looks at events in the `_internal` index and calculates an `unexpectedness` score for sets of events that have the same `group` value.

* The sliding set of events that are used to calculate the `unexpectedness` score for each unique `group` value includes only the events that have the same `group` value.
* The `search` command is used to show events that only include the `group` field.

The `unexpectedness` and `group` fields appear in the list of Interesting fields. Click on the field name and then click Yes to move the field to the Selected fields list. The fields are moved and also appear in the search results. Your results should look something like the following image.

![This image shows the search results. The unexpectedness and group fields are in the Selected fields list and are highlighted in the search results.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/abcb10c9-b88a-47f4-8e19-a5121a52430a?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJhYmNiMTBjOS1iODhhLTQ3ZjQtOGUxOS1hNTEyMWE1MjQzMGEiLCJleHAiOjE3NjEwNjAwNTcsImp0aSI6IjA2NDU2OTBiMGMyYzRmYjFhZTg2ZmY5ZGI0ZGY2ZmFlIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.YePoCviGgOu18pQZxnwgMazgOxEV0LBMqmF_QMLwXZw)

The key-value pairs in the first event include `group=pipeline`, `name=indexerpipe`, `processor=indexer`, `cpu_seconds=0.022`, and so forth.

With the default `threshold`, which is 0.01, you can see that some of these events might be very similar. The next search increases the `threshold` a little:

index=\_internal | anomalies threshold=0.03 by group | search group=\*

![This image shows the search results with the new threshold.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8c0f0e11-ee85-4470-9dbf-4f4f8c6fa9b0?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4YzBmMGUxMS1lZTg1LTQ0NzAtOWRiZi00ZjRmOGM2ZmE5YjAiLCJleHAiOjE3NjEwNjAwNTcsImp0aSI6IjA4NGRjNzg0YjY1NjRjMTFiOTE1NGU3YjI1YzExNDU1IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.fhk4okIQIdO52KQUHJxUXTKHo1V5axAveulfpLwooYs)

With the higher `threshold` value, the timestamps and key-value pairs show more distinction between each of the events.

Also, you might not want to hide the events that are not anomalous. Instead, you can add another field to your events that tells you whether or not the event is interesting to you. One way to do this is with the `eval` command:

index=\_internal | anomalies threshold=0.03 labelonly=true by group | search group=\* | eval threshold=0.03 | eval score=if(unexpectedness>=threshold, "anomalous", "boring")

This search uses `labelonly=true` so that the boring events are still retained in the results list. The `eval` command is used to define a field named `threshold` and set it to the threshold value. This has to be done explicitly because the `threshold` attribute of the `anomalies` command is not a field.

The second `eval` command is used to define another new field, `score`, that is either "anomalous" or "boring" based on how the `unexpectedness` compares to the `threshold` value. The following image shows a snapshot of the results.

![This image shows the score field added to the Selected field list. The score values are highlighted in the search results.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/952368b3-7c14-409a-88a6-c57afb1245c4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI5NTIzNjhiMy03YzE0LTQwOWEtODhhNi1jNTdhZmIxMjQ1YzQiLCJleHAiOjE3NjEwNjAwNTcsImp0aSI6ImU1ODIyYmNhMTk2ZDQyOTA4ZmQwYmQ2NzA1MmQ3NDYzIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.vjZi-Sm52kdV1rtFOY87JWf-FnJ7fD0zOuz2zq8LJIA)

## See also

[anomalousvalue](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalousvalue#adf8d264_6647_4cfc_a5eb_3363bb55a0a7__anomalousvalue), [cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster), [kmeans](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kmeans#d0a3cb28_4602_427c_8c30_fa3e06f4fa95__kmeans), [outlier](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outlier#id_3e2dc81a_03fd_40f0_b0cb_a689011fe4a0__outlier)
