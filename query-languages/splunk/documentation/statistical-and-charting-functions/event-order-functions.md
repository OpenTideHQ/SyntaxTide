# Event order functions

Use the event order functions to return values from fields based on the order in which the event is processed, which is not necessarily chronological or timestamp order.

The following table lists the timestamps from a set of events returned from a search. This table identifies which event is returned when you use the `first` and `last` event order functions, and compares them with the `earliest` and `latest` functions, which you can read more about at [Time functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/time-functions#c8a9432c_40e6_49e9_aeb4_00a7ed680302__Time_functions).

| \_time | Event order function | Description |
| --- | --- | --- |
| 2020-04-28 00:15:05 | first | This event is the first event in the search results. But this event is not chronologically the earliest event. |
| 2020-05-01 00:15:04 |  |  |
| 2020-04-30 00:15:02 |  |  |
| 2020-04-28 00:15:01 |  |  |
| 2020-05-01 00:15:05 | latest | This event is chronologically the latest event in the search results. |
| 2020-04-27 00:15:01 | earliest last | This event is both the chronologically earliest event and the last event in the search results. |

See [Overview of statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

## first(<value>)

### Description

Returns the first seen value in a field. The first seen value of the field is the most recent instance of this field, based on the order in which the events are seen by the `stats` command.
The order in which the events are seen is not necessarily chronological order.

### Usage

You can use this function with the `chart`, `stats`, and `timechart` commands.

* To locate the first value based on time order, use the `earliest` function instead.
* This function works best when the search includes the `sort` command immediately before the statistics or charting command.
* This function processes field values as strings.

### Basic example

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

You run the following search to locate invalid user login attempts against a specific sshd (Secure Shell Daemon). You use the `table` command to see the values in the `_time`, `source`, and `_raw` fields.

sourcetype=secure invalid user "sshd[5258]" | table \_time source \_raw

The results look something like this:

| \_time | source | \_raw |
| --- | --- | --- |
| 2020-04-28 00:15:05 | tutorialdata.zip:./mailsv/secure.log | Mon Apr 28 2020 00:15:05 mailsv1 sshd[5258]: Failed password for invalid user tomcat from 67.170.226.218 port 1490 ssh2 |
| 2020-05-01 00:15:04 | tutorialdata.zip:./www2/secure.log | Thu May 01 2020 00:15:04 www2 sshd[5258]: Failed password for invalid user brian from 130.253.37.97 port 4284 ssh2 |
| 2020-04-30 00:15:02 | tutorialdata.zip:./www3/secure.log | Wed Apr 30 2020 00:15:02 www3 sshd[5258]: Failed password for invalid user operator from 222.169.224.226 port 1711 ssh2 |
| 2020-04-28 00:15:01 | tutorialdata.zip:./www1/secure.log | Mon Apr 28 2020 00:15:01 www1 sshd[5258]: Failed password for invalid user rightscale from 87.194.216.51 port 3361 ssh2 |
| 2020-05-01 00:15:05 | tutorialdata.zip:./mailsv/secure.log | Thu May 01 2020 00:15:05 mailsv1 sshd[5258]: Failed password for invalid user testuser from 194.8.74.23 port 3626 ssh2 |
| 2020-04-27 00:15:01 | tutorialdata.zip:./www1/secure.log | Sun Apr 27 2020 00:15:01 www1 sshd[5258]: Failed password for invalid user redmine from 91.208.184.24 port 3587 ssh2 |

You extend the search using the `first` function.

sourcetype=secure invalid user "sshd[5258]" | table \_time source \_raw | stats first(\_raw)

The search returns the value for `_raw` field with the timestamp `2020-04-28 00:15:05`, which is the first event in the original list of values returned.

| first(\_raw) |
| --- |
| Mon Apr 28 2020 00:15:05 mailsv1 sshd[5258]: Failed password for invalid user tomcat from 67.170.226.218 port 1490 ssh2 |

### Extended example

The Basic example uses the `_raw` field to show how the `first` function works.
That's useful because the `_raw` field contains a timestamp. However, you can use the `first` function on any field.

Let's start by creating some results. You can use the `makeresults` command to create a series of results to test your search syntax. Include the `streamstats` command to count your results:

| makeresults count=5
| streamstats count

The results look like this:

| \_time | count |
| --- | --- |
| 2020-05-09 14:35:58 | 1 |
| 2020-05-09 14:35:58 | 2 |
| 2020-05-09 14:35:58 | 3 |
| 2020-05-09 14:35:58 | 4 |
| 2020-05-09 14:35:58 | 5 |

With the `count` field, you can create different dates in the `_time` field, using the `eval` command.

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*3600)

Use 3600, the number of seconds in an hour, to create a series of hours. The calculation multiplies the value in the `count` field by the number of seconds in an hour. The result is subtracted from the original `_time` field to get new dates equivalent to 1 hours ago, 2 hours ago, and so forth.

The results look like this:

| \_time | count |
| --- | --- |
| 2020-05-09 13:45:24 | 1 |
| 2020-05-09 12:45:24 | 2 |
| 2020-05-09 11:45:24 | 3 |
| 2020-05-09 10:45:24 | 4 |
| 2020-05-09 09:45:24 | 5 |

The hours in the results begin with the 1 hour earlier than the original date, 2020-05-09 at 14:24. The minutes and seconds are slightly different because the date is refreshed each time you run the search.

Use the `eval` command to add a field to your search with values in descending order:

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*3600)
| eval field1=20-count

The results look like this:

| \_time | count | field1 |
| --- | --- | --- |
| 2020-05-09 14:45:24 | 1 | 19 |
| 2020-05-09 13:45:24 | 2 | 18 |
| 2020-05-09 12:45:24 | 3 | 17 |
| 2020-05-09 11:45:24 | 4 | 16 |
| 2020-05-09 10:45:24 | 5 | 15 |

As you can see from the results, the first result contains the highest number in `field1`. This shows the order in which the results were processed. The first result was processed first (20-1=19) followed by the remaining results in order.

When you add the `first` function to the search, the only value returned is the value in the field you specify:

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*3600)
| eval field1=20-count
| stats first(field1)

The results look like this:

| first(field1) |
| --- |
| 19 |

## last(<value>)

### Description

Returns the last seen value in a field. The last seen value of the field is the oldest instance of this field, based on the order in which the events are seen by the `stats` command.
The order in which the events are seen is not necessarily chronological order.

### Usage

You can use this function with the `chart`, `stats`, and `timechart` commands.

* To locate the last value based on time order, use the `latest` function instead.
* This function works best when the search includes the `sort` command immediately before the statistics or charting command.
* This function processes field values as strings.

### Basic example

The following example returns the first "log\_level" value for each distinct "sourcetype".

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

You run the following search to locate invalid user login attempts against a specific sshd (Secure Shell Daemon). You use the table command to see the values in the `_time`, `source`, and `_raw` fields.

sourcetype=secure invalid user "sshd[5258]" | table \_time source \_raw

The results appear on the Statistics tab and look something like this:

| \_time | source | \_raw |
| --- | --- | --- |
| 2020-04-28 00:15:05 | tutorialdata.zip:./mailsv/secure.log | Mon Apr 28 2020 00:15:05 mailsv1 sshd[5258]: Failed password for invalid user tomcat from 67.170.226.218 port 1490 ssh2 |
| 2020-05-01 00:15:04 | tutorialdata.zip:./www2/secure.log | Thu May 01 2020 00:15:04 www2 sshd[5258]: Failed password for invalid user brian from 130.253.37.97 port 4284 ssh2 |
| 2020-04-30 00:15:02 | tutorialdata.zip:./www3/secure.log | Wed Apr 30 2020 00:15:02 www3 sshd[5258]: Failed password for invalid user operator from 222.169.224.226 port 1711 ssh2 |
| 2020-04-28 00:15:01 | tutorialdata.zip:./www1/secure.log | Mon Apr 28 2020 00:15:01 www1 sshd[5258]: Failed password for invalid user rightscale from 87.194.216.51 port 3361 ssh2 |
| 2020-05-01 00:15:05 | tutorialdata.zip:./mailsv/secure.log | Thu May 01 2020 00:15:05 mailsv1 sshd[5258]: Failed password for invalid user testuser from 194.8.74.23 port 3626 ssh2 |
| 2020-04-27 00:15:01 | tutorialdata.zip:./www1/secure.log | Sun Apr 27 2020 00:15:01 www1 sshd[5258]: Failed password for invalid user redmine from 91.208.184.24 port 3587 ssh2 |

You extend the search using the `last` function.

sourcetype=secure invalid user "sshd[5258]" | table \_time source \_raw | stats last(\_raw)

The search returns the event with the `_time` value `2020-04-27 00:15:01`, which is the last event in the list of events. However it is not the last chronological event.

| \_time | source | \_raw |
| --- | --- | --- |
| 2020-04-27 00:15:01 | tutorialdata.zip:./www1/secure.log | Sun Apr 27 2020 00:15:01 www1 sshd[5258]: Failed password for invalid user redmine from 91.208.184.24 port 3587 ssh2 |

### Extended example

The Basic example uses the `_raw` field to show how the `last` function works.
That's useful because the `_raw` field contains a timestamp. However, you can use the `last` function on any field.

Let's start by creating some results. You can use the `makeresults` command to create a series of results to test your search syntax. Include the `streamstats` command to count your results:

| makeresults count=5
| streamstats count

The results look like this:

| \_time | count |
| --- | --- |
| 2020-05-09 14:35:58 | 1 |
| 2020-05-09 14:35:58 | 2 |
| 2020-05-09 14:35:58 | 3 |
| 2020-05-09 14:35:58 | 4 |
| 2020-05-09 14:35:58 | 5 |

With the `count` field, you can create different dates in the `_time` field, using the `eval` command.

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*86400)

Use 86400, the number of seconds in a day, to create a series of days. The calculation multiplies the value in the `count` field by the number of seconds in an day. The result is subtracted from the original `_time` field to get new dates equivalent to 1 day ago, 2 days ago, and so forth.

The results look like this:

| \_time | count |
| --- | --- |
| 2020-05-08 14:45:24 | 1 |
| 2020-05-07 14:45:24 | 2 |
| 2020-05-06 14:45:24 | 3 |
| 2020-05-05 14:45:24 | 4 |
| 2020-05-04 14:45:24 | 5 |

The dates in the results begin with the 1 day earlier than the original date, 2020-05-09 at 14:45:24. The minutes and seconds are slightly different because the date is refreshed each time you run the search.

Use the `eval` command to add a field to your search with values in descending order:

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*86400)
| eval field1=20-count

The results look like this:

| \_time | count | field1 |
| --- | --- | --- |
| 2020-05-08 14:45:24 | 1 | 19 |
| 2020-05-07 14:45:24 | 2 | 18 |
| 2020-05-06 14:45:24 | 3 | 17 |
| 2020-05-05 14:45:24 | 4 | 16 |
| 2020-05-04 14:45:24 | 5 | 15 |

As you can see from the results, the last result contains the lowest number in `field1`. This shows the order in which the results were processed. The fifth result was processed last (20-5=15) after all of the other results.

When you add the `last` function to the search, the only value returned is the value in the field you specify:

| makeresults count=5
| streamstats count
| eval \_time=\_time-(count\*86400)
| eval field1=20-count
| stats last(field1)

The results look like this:

| lastfield1) |
| --- |
| 15 |

## See also

Commands

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval)

[makeresults](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makeresults#ddcd3bee_0938_4097_8a43_4f6bf0ea9aa2__makeresults)
