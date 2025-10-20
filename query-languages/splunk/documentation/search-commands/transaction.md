# transaction

## Description

The transaction command finds transactions based on events that meet various constraints. Transactions are made up of the raw text (the `_raw` field) of each member, the time and date fields of the earliest member, as well as the union of all other fields of each member.

Additionally, the `transaction` command adds two fields to the raw events, `duration` and `eventcount`. The values in the `duration` field show the difference between the timestamps for the first and last events in the transaction. The values in the `eventcount` field show the number of events in the transaction.

See [About transactions](/en/?resourceId=Splunk_Search_Abouttransactions) in the *Search Manual*.

## Syntax

The required syntax is in bold.

transaction

[<field-list>]

[name=<transaction-name>]

[<txn\_definition-options>...]

[<memcontrol-options>...]

[<rendering-options>...]

### Required arguments

None.

### Optional arguments

field-list

Syntax: <field> ...

Description: One or more field names. The events are grouped into transactions, based on the unique values in the fields. For example, suppose two fields are specified: `client_ip` and `host`. For each `client_ip` value, a separate transaction is returned for each unique `host` value for that `client_ip`.

memcontrol-options

Syntax: <maxopentxn> | <maxopenevents> | <keepevicted>

Description: These options control the memory usage for your transactions. They are not required, but you can use 0 or more of the options to define your transaction. See [Memory control options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/transaction#id_7d4a9cd5_66eb_428c_a49e_0fef685636b9__Memory_control_options).

name

Syntax: name=<transaction-name>

Description: Specify the stanza name of a transaction that is configured in the `transactiontypes.conf` file. This runs the search using the settings defined in this stanza of the configuration file. If you provide other transaction definition options (such as maxpause) in this search, they overrule the settings in the configuration file.

rendering-options

Syntax: <delim> | <mvlist> | <mvraw> | <nullstr>

Description: These options control the multivalue rendering for your transactions. They are not required, but you can use 0 or more of the options to define your transaction. See [Multivalue rendering options](/en/?resourceId=Splunk_SearchReference_Transaction).

txn\_definition-options

Syntax: <maxspan> | <maxpause> | <maxevents> | <startswith> | <endswith> | <connected> | <unifyends> | <keeporphans>

Description: Specify the transaction definition options to define your transactions. You can use multiple options to define your transaction.

### Txn definition options

connected

Syntax: connected=<bool>

Description: Only relevant if a field or fields list is specified. If an event contains fields required by the transaction, but none of these fields have been instantiated in the transaction (added with a previous event), this opens a new transaction (connected=true) or adds the event to the transaction (connected=false).

If the default value for this argument is changed, the default for the `unifyends` argument will also change to the same value. For example, if `connected=false`, then `unifyends=false`.

Default: true

endswith

Syntax: endswith=<filter-string>

Description: A search or eval expression which, if satisfied by an event, marks the end of a transaction.

keeporphans

Syntax: keeporphans=true | false

Description: Specify whether the transaction command should output the results that are not part of any transactions. The results that are passed through as "orphans" are distinguished from transaction events with a `_txn_orphan` field, which has a value of 1 for orphan results.

Default: false

maxspan

Syntax: maxspan=<int>[s | m | h | d]

Description: Specifies the maximum length of time in seconds, minutes, hours, or days that the events can span, which is the maximum total time between the earliest and latest events in a transaction. The events in the transaction must span less than the integer specified for `maxspan`. Events that exceed the `maxspan` limit are treated as part of a separate transaction. If the value is negative, the `maxspan` constraint is deactivated and there is no limit.

Events must be sorted in descending chronological order before the `maxspan` argument is used. See the related example later in this topic.

Default: -1 (no limit)

maxpause

Syntax: maxpause=<int>[s | m | h | d]

Description: Specifies the maximum length of time in seconds, minutes, hours, or days for the pause between consecutive events in a transaction, which is the maximum total time between events. If the value is negative, the `maxpause` constraint is deactivated and there is no limit.

Events must be sorted in descending chronological order before the `maxpause` argument is used. See the related example later in this topic.

Default: -1 (no limit)

maxevents

Syntax: maxevents=<int>

Description: The maximum number of events in a transaction. This constraint is deactivated if the value is negative.

Default: 1000

startswith

Syntax: startswith=<filter-string>

Description: A search or eval filtering expression which if satisfied by an event marks the beginning of a new transaction.

unifyends

Syntax: unifyends= true | false

Description: Whether to force events that match startswith/endswith constraint(s) to also match at least one of the fields used to unify events into a transaction.

The default value for this argument is the same as the `connected` argument. For example, if `connected=false`, then `unifyends=false`.

Default: true, set to the same default value as the `connected` argument

### Filter string options

These options are used with the `startswith` and `endswith` arguments.

<filter-string>

Syntax: <search-expression> | (<quoted-search-expression>) | eval(<eval-expression>)

Description: A search or eval filtering expression which if satisfied by an event marks the end of a transaction.

<search-expression>

Description: A valid search expression that does not contain quotes.

<quoted-search-expression>

Description: A valid search expression that contains quotes.

<eval-expression>

Description: A valid eval expression that evaluates to a Boolean.

### Memory control options

If you have Splunk Cloud, Splunk Support administers the settings in the `limits.conf` file on your behalf.

keepevicted

Syntax: keepevicted=<bool>

Description: Whether to output evicted transactions. Evicted transactions can be distinguished from non-evicted transactions by checking the value of the 'closed\_txn' field. The 'closed\_txn' field is set to '0', or false, for evicted transactions and '1', or true for non-evicted, or closed, transactions. The 'closed\_txn' field is set to '1' if one of the following conditions is met: maxevents, maxspan, maxpause, startswith. For `startswith`, because the `transaction` command sees events in reverse chronological order, it closes a transaction when it satisfies the start condition. If none of these conditions is specified, all transactions are output even though all transactions will have 'closed\_txn' set to '0'. A transaction can also be evicted when the memory limitations are reached.

Default: false or 0

maxopenevents

Syntax: maxopenevents=<int>

Description: Specifies the maximum number of events (which are) part of open transactions before transaction eviction starts happening, using LRU policy.

Default: The default value for this argument is read from the transactions stanza in the `limits.conf` file.

maxopentxn

Syntax: maxopentxn=<int>

Description: Specifies the maximum number of not yet closed transactions to keep in the open pool before starting to evict transactions, using LRU policy.

Default: The default value for this argument is read from the transactions stanza in the `limits.conf` file.

### Multivalue rendering options

delim

Syntax: delim=<string>

Description: Specify a character to separate multiple values. When used in conjunction with the `mvraw=t` argument, represents a string used to delimit the values in the `_raw` field.

Default: " " (whitespace)

mvlist

Syntax: mvlist= true | false | <field-list>

Description: Flag that controls how multivalued fields are processed. When set to `mvlist=true`, the multivalued fields in the transaction are a list of the original events ordered in arrival order. When set to `mvlist=false`, the multivalued fields in the transaction are a set of unique field values ordered alphabetically. If a comma or space delimited list of fields is provided, only those fields are rendered as lists.

Default: false

mvraw

Syntax: mvraw=<bool>

Description: Used to specify whether the `_raw` field of the transaction search result should be a multivalued field.

Default: false

nullstr

Syntax: nullstr=<string>

Description: A string value to use when rendering missing field values as part of multivalued fields in a transaction. This option applies only to fields that are rendered as lists.

Default:
`NULL`

## Usage

The `transaction` command is a centralized streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

In the output, the events in a transaction are grouped together as multiple values in the `Events` field. Each event in a transaction starts on a new line by default.

If there are more than 5 events in a transaction, the remaining events in the transaction are collapsed. A message appears at the end of the transaction which gives you the option to show all of the events in the transaction.

### Specifying multiple fields

The Splunk software does not necessarily interpret the transaction defined by multiple fields as a conjunction (`field1 AND field2 AND field3`) or a disjunction (`field1 OR field2 OR field3`) of those fields. If there is a transitive relationship between the fields in the fields list and if the related events appear in the correct sequence, each with a different timestamp, `transaction` command will try to use it. For example, if you searched for

... | transaction host cookie

You might see the following events grouped into a transaction:

event=1 host=a
event=2 host=a cookie=b
event=3 cookie=b

### Descending chronological order required

The `transaction` command requires that the incoming events be in descending chronological order. Some commands, such as `eval`, might change the order or time labeling of events. If one of these commands precedes the `transaction` command, your search returns an error unless you include a `sort` command in your search. The `sort` command must occur immediately before the `transaction` command to reorder the search results in descending chronological order.

## Basic Examples

### 1. Transactions with the same host, time range, and pause

Group search results that that have the same host and cookie value, occur within 30 seconds, and do not have a pause of more than 5 seconds between the events.

... | transaction host cookie maxspan=5s maxpause=30s

### 2. Transactions with the same "from" value, time range, and pause

Group search results that have the same value of "from", with a maximum span of 30 seconds, and a pause between events no greater than 5 seconds into a transaction.

... | transaction from maxspan=5s maxpause=30s

### 3. Transactions with the same field values

You have events that include an alert\_level. You want to create transactions where the level is equal.
Using the `streamstats` command, you can remember the value of the alert level for the current and previous event. Using the `transaction` command, you can create a new transaction if the alert level is different. Output specific fields to table.

... | streamstats window=2 current=t latest(alert\_level) AS last earliest(alert\_level) AS first | transaction endswith=eval(first!=last) | table \_time duration first last alert\_level eventcount

## Extended Examples

### 1. Transactions of Web access events based on IP address

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Define a transaction based on Web access events that share the same IP address. The first and last events in the transaction should be no more than thirty seconds apart and each event should not be longer than five seconds apart.

sourcetype=access\_\* | transaction clientip maxspan-30s maxpause=5s

This produces the following events list. The clientip for each event in the transaction is highlighted.

![This image shows two transactions. The first transaction has 2 clientip values. The second transaction has 11 clientip values. Some of the values for the second transaction are hidden. There is a link that says "Show all 11 lines", which you can click to show all 11 values.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/462aef8c-a2b5-4ab4-a45f-fb6157e3d07d?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0NjJhZWY4Yy1hMmI1LTRhYjQtYTQ1Zi1mYjYxNTdlM2QwN2QiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6ImQ3ODMwMzk2Mzg3YTRmZmQ4NzVmNGJmODk1YmRhYzlmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.46Zp4CEUaPDa1B1TWvqGRFY9SxLih03IlB2WSG-5db4)

This search groups events together based on the IP addresses accessing the server and the time constraints.
The search results might have multiple values for some fields, such as `host` and `source`. For example, requests from a single IP could come from multiple hosts if multiple people are shopping from the same office. For more information, read the topic [About transactions](/en/?resourceId=Splunk_Knowledge_Abouttransactions) in the *Knowledge Manager Manual*.

### 2. Transaction of Web access events based on host and client IP

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Define a transaction based on Web access events that have a unique combination of `host` and `clientip` values. The first and last events in the transaction should be no more than thirty seconds apart and each event should not be longer than five seconds apart.

sourcetype=access\_\* | transaction clientip host maxspan=5s maxpause=30s

This search produces the following events list.

![This image shows the results of the search. The same clientip address appears in the first 2 transactions. However the host values are different.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/33d37b64-c33d-4a83-8194-e50ccfdf1a7b?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIzM2QzN2I2NC1jMzNkLTRhODMtODE5NC1lNTBjY2ZkZjFhN2IiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6IjNkNjJjMmNkZDA4ZDRlZWY5ZTZkN2IzODM5MmU3ZDBiIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.0PczTLpD2KNLuz3HbG8cuTAdQmYsuyEU-qTqJXsSV58)

Each of these events have a distinct combination of the IP address (`clientip`) values and `host` values within the limits of the time constraints specified in the search.

### 3. Purchase transactions based on IP address and time range

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

This search defines a purchase transaction as 3 events from one IP address which occur in a 10 minute span of time.

sourcetype=access\_\* action=purchase | transaction clientip maxpause=10m maxevents=3

This search defines a purchase event based on Web access events that have the `action=purchase` value. These results are then piped into the `transaction` command. This search identifies purchase transactions by events that share the same `clientip`, where each session lasts no longer than 10 minutes, and includes no more than 3 events.

This search produces the following events list:

![This image shows two transactions. The first transaction has 2 events. The second transaction has 3 events.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ed7ad120-0f03-4b48-ba4c-58f3d6fc70db?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlZDdhZDEyMC0wZjAzLTRiNDgtYmE0Yy01OGYzZDZmYzcwZGIiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6ImIwODg2M2IwODZhYjQ5YjI5M2RmYjlhZWMxNzhiNjg5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.VslMzA7btZ6_DIqFwNW6njrgRzgyPGMhqpFn-heYw1w)

### 4. Email transactions based on maxevents and endswith

|  |
| --- |
| This example uses sample email data. You should be able to run this search on any email data by replacing the `sourcetype=cisco:esa` with the `sourcetype` value and the `mailfrom` field with email address field name in your data. For example, the email might be `To`, `From`, or `Cc`). |

This example defines an email transaction as a group of up to 10 events. Each event contains the same value for the `mid` (message ID), `icid` (incoming connection ID), and `dcid` (delivery connection ID). The last event in the transaction contains a Message done string.

sourcetype="cisco:esa" | transaction mid dcid icid maxevents=10 endswith="Message done"

This search produces the following list of events:

![This image shows the results of the search. The string "Message done" is highlighted in the last event in the second and third transactions.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/44ae4253-a850-4720-846d-8e573c5dc8f3?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0NGFlNDI1My1hODUwLTQ3MjAtODQ2ZC04ZTU3M2M1ZGM4ZjMiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6IjAyNDA5NTQzYWVmNzQ3ZDJiY2M2ZjQ5ODQ5Mjg0N2QyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.y-SxeEmDUZKdzMmt2WJ4QN3JMBIqKSWXr_cgcqy6sLE)

By default, only the first 5 events in a transaction are shown. The first transaction contains 7 events and the last event is hidden. The second and third transactions show the Message done string in the last event in the transaction.

### 5. Email transactions based on maxevents, maxpause, and mvlist

|  |
| --- |
| This example uses sample email data. You should be able to run this search on any email data by replacing the `sourcetype=cisco:esa` with the `sourcetype` value and the `mailfrom` field with email address field name in your data. For example, the email might be `To`, `From`, or `Cc`). |

This example defines an email transaction as a group of up to 10 events. Each event contains the same value for the `mid` (message ID), `icid` (incoming connection ID), and `dcid` (delivery connection ID). The first and last events in the transaction should be no more than thirty seconds apart.

sourcetype="cisco:esa" | transaction mid dcid icid maxevents=10 maxpause=30s mvlist=true

By default, the values of multivalue fields are suppressed in search results with the default setting for `mvlist`, which is false. Specifying `mvlist=true` in this search displays all of the values of the selected fields. This produces the following events list:

![This image shows several transactions. The all but the last transaction is a single event with a duration of zero. The last transaction has three events with a duration of 26.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/e09c43d3-57e6-460d-8444-f4f6a07baaf5?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlMDljNDNkMy01N2U2LTQ2MGQtODQ0NC1mNGY2YTA3YmFhZjUiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6IjA4Nzc1NWUyZmMzMzQxODhiYmIwZGFlOTc4NjM4NDgxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.BTfkkw1wqHaS3P7MieZN6W5ZUBJiwd2gL6iXw8tWQ4E)

Here you can see that each transaction has a duration that is less than thirty seconds. Also, if there is more than one value for a field, each of the values is listed.

### 6. Transactions with the same session ID and IP address

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Define a transaction as a group of events that have the same session ID, `JSESSIONID`, and come from the same IP address, `clientip`, and where the first event contains the string, "view", and the last event contains the string, "purchase".

sourcetype=access\_\* | transaction JSESSIONID clientip startswith="view" endswith="purchase" | where duration>0

The search defines the first event in the transaction as events that include the string, "view", using the `startswith="view"` argument. The `endswith="purchase"` argument does the same for the last event in the transaction.

This example then pipes the transactions into the `where` command and the `duration` field to filter out all of the transactions that took less than a second to complete. The `where` filter cannot be applied before the `transaction` command because the `duration` field is added by the `transaction` command.

![This image shows 2 transactions. The first transaction contains 2 events. The second transaction contains 5 events.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/08ee8dcd-3034-4d59-aa93-cafaae0bac84?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwOGVlOGRjZC0zMDM0LTRkNTktYWE5My1jYWZhYWUwYmFjODQiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6ImQ1ODZiNmQ3Yzg2YTQ3MTRhOTA2YmVkMmQ2M2M5M2E4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.OAqEFMRmnYhfC_QJjvzPWyHRfUYH31US7ldpMAA_9fM)

You might be curious about why the transactions took a long time, so viewing these events might help you to troubleshoot.

You won't see it in this data, but some transactions might take a long time because the user is updating and removing items from their shopping cart before they completes the purchase. Additionally, this search is run over all events. There is no filtering before the `transaction` command. Anytime you can filter the search before the first pipe, the faster the search runs.

### 7. Sort order when using maxspan and maxpause

Pay careful attention to the sort order of your events when using the `maxspan` and `maxpause` arguments with the `transaction` command because searches with events sorted in ascending chronological order return incorrect results.

For example, the following search returns expected results because the search uses `| sort -_time` to sort events in descending chronological order before the `maxspan` argument is used:

|makeresults count=10
|streamstats count
|eval \_time=now()+10\*count, user="nobody"
|sort -\_time
|transaction user maxspan=11s

The results look like this:

| \_raw | \_time | closed\_txn | count | duration | eventcount | field\_match\_sum | linecount | user |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 2024-07-16 16:10:30 | 1 | 10   9 | 10 | 2 | 2 | 2 | nobody |
|  | 2024-07-16 16:10:10 | 1 | 7   8 | 10 | 2 | 2 | 2 | nobody |
|  | 2024-07-16 16:09:50 | 1 | 5   6 | 10 | 2 | 2 | 2 | nobody |
|  | 2024-07-16 16:09:30 | 1 | 3   4 | 10 | 2 | 2 | 2 | nobody |
|  | 2024-07-16 16:09:10 | 0 | 1   2 | 10 | 2 | 2 | 2 | nobody |

In contrast, the following search doesn't generate the correct results because events are sorted in ascending chronological order by default before the `maxspan` argument is used:

|makeresults count=20
|streamstats count
|eval \_time=now()+10\*count, user="nobody"
|transaction user maxspan=11s

The results look like this:

| \_raw | \_time | closed\_txn | count | duration | eventcount | field\_match\_sum | linecount | user |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 2024-07-16 16:09:17 | 0 | 1   10   2  3  4  5  6  7  8  9 | 90 | 10 | 10 | 10 | nobody |

## See also

Reference

[About transactions](/en/?resourceId=Splunk_Search_Abouttransactions)

Commands

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[concurrency](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/concurrency#id_7e2ba335_2e05_4f28_b4f8_a5a599f53f9a__concurrency)

## Answers

Have questions? Visit [Splunk Answers](http://splunk-base.splunk.com/answers) and see what [questions and answers the Splunk community has using the transaction command](http://splunk-base.splunk.com/tags/transactions).
