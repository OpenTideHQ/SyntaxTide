# transpose

## Description

Returns the specified number of rows (search results) as columns (list of field values), such that each search row becomes a column.

## Syntax

The required syntax is in bold.

transpose

[int]

[column\_name=<string>]

[header\_field=<field>]

[include\_empty=<bool>]

### Required arguments

None.

### Optional arguments

column\_name

Syntax: column\_name=<string>

Description: The name of the first column that you want to use for the transposed rows. This column contains the names of the fields.

Default: column

header\_field

Syntax: header\_field=<field>

Description: The field in your results to use for the names of the columns (other than the first column) in the transposed data.

Default: row 1, row 2, row 3, and so on.

include\_empty

Syntax: include\_empty=<bool>

Description: Specify whether to include (true) or not include (false) fields that contain empty values.

Default: true

int

Syntax: <int>

Description: Limit the number of rows to transpose. To transpose all rows, specify `| transpose 0`, which indicates that the number of rows to transpose is unlimited.

Default: 5

## Usage

When you use the `transpose` command the field names used in the output are based on the arguments that you use with the command. By default the field names are: `column`, `row 1`, `row 2`, and so forth.

## Examples

### 1. Transpose the results of a chart command

Use the default settings for the transpose command to transpose the results of a chart command.

Suppose you run a search like this:

sourcetype=access\_\* status=200 | chart count BY host

The search produces the following search results:

| host | count |
| --- | --- |
| www1 | 11835 |
| www2 | 11186 |
| www3 | 11261 |

When you add the `transpose` command to the end of the search, the results look something like this:

| column | row 1 | row 2 | row 3 |
| --- | --- | --- | --- |
| host | www1 | www2 | www3 |
| count | 11835 | 11186 | 11261 |

### 2. Specifying a header field

In the previous example, the default settings for the `transpose` command are used in the search:

sourcetype=access\_\* status=200 | chart count BY host | transpose

The results look like this:

| column | row 1 | row 2 | row 3 |
| --- | --- | --- | --- |
| host | www1 | www2 | www3 |
| count | 11835 | 11186 | 11261 |

Instead of using the default field names like row 1, row 2, and so forth, you can use the values in a field for the field names by specifying the `header_field` argument.

sourcetype=access\_\* status=200 | chart count BY host | transpose header\_field=host

The results look like this:

| column | www1 | www2 | www3 |
| --- | --- | --- | --- |
| count | 11835 | 11186 | 11261 |

### 3. Count the number of events by sourcetype and transpose the results to display the 3 highest counts

Count the number of events by sourcetype and display the sourcetypes with the highest count first.

index=\_internal | stats count by sourcetype | sort -count

![An image that shows 2 columns. The first column lists the source types. The second column is a count of the number of events for each source type.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/92f20ddd-8f5a-4d2b-9687-118c39a43ae2?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI5MmYyMGRkZC04ZjVhLTRkMmItOTY4Ny0xMThjMzlhNDNhZTIiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6IjM4MGM4ODM2MGE2ZjQwMmQ5YWI4M2ZmNDg4MzllZjk3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.UCJRRVbqOEkWBNTNRdZmJahLOtLcFhGoIdiN1RxyVMs)

Use the transpose command to convert the rows to columns and show the source types with the 3 highest counts.

index=\_internal | stats count by sourcetype | sort -count | transpose 3

![An image that shows 4 columns. The first column are labels that for the information in the rows. The labels are sourcetype and count. The other 3 columns list the top 3 source types and the count, the number of events, for each source type.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/321f3cf6-59d2-41de-8e25-f971b0e1d958?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIzMjFmM2NmNi01OWQyLTQxZGUtOGUyNS1mOTcxYjBlMWQ5NTgiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6ImEyNDRhOTMzYzRlYjQ3ZDFhOThlMzExMGE4MzQ3ZDE5IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.BTgsyso_zBK1bLgt6S933H-Oi7tpsM0oaIACMrQOc80)

### 4. Transpose a set of data into a series to produce a chart

|  |
| --- |
| This example uses the sample dataset from [the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial).  * Download the data set from [Add data tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to get the tutorial data into your Splunk deployment. |

Search all successful events and count the number of views, the number of times items were added to the cart, and the number of purchases.

sourcetype=access\_\* status=200 | stats count AS views count(eval(action="addtocart")) AS addtocart count(eval(action="purchase")) AS purchases

This search produces a single row of data.
![This screen image shows one row of data with three columns. The first column is "views" with a count of 34282. The second column is "add to cart" with a count of 5292. The third column is "purchases" with a count of 5224.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/2f2dab3f-5208-49af-a54d-5a1feb197df2?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyZjJkYWIzZi01MjA4LTQ5YWYtYTU0ZC01YTFmZWIxOTdkZjIiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6ImViYWNjZDc5OGI2MzRiNzZiZmQ4MmZlNDVhNDZhMWRhIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.1gLmKoyneBucP_72U2SYIdW52SkPTb6HxWGr6a4ZHAY)

Note: The value for `count AS views` is the total number of the events that match the criteria `sourcetype=access_* status=200`, or the total count for all actions. The values for `addtocart` and `purchases` show the number of events for those specific actions.

When you switch to the Visualization tab, the data displays a chart with the "34282 views" as the X axis label and two columns, one for "addtocart "and one for "purchases". Because the information about the views is placed on the X axis, this chart is confusing.

![This screen image shows a column chart. There are two columns "add to cart" and "purchases". The X axis label is "34282 views". with a count of 34282. The second column is "add to cart" with a count of 5292. The third column is "purchases" with a count of 5224.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ebc3e874-eb18-4012-89db-55d873dc9269?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlYmMzZTg3NC1lYjE4LTQwMTItODlkYi01NWQ4NzNkYzkyNjkiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6IjNlYjI2MWUwZWNmMzQ0NTVhZWViYjRmN2NmMThjMjBhIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.ssai1Um-FAh-i-oRwxZpnbE64c_qwjEm_f_htr_gMB8)

If you change to a pie chart, you see only the "views".

![This screen image shows a pie chart with only the "views" information included in the chart.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/7c67cf64-8812-4402-82e8-08e689e363a7?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3YzY3Y2Y2NC04ODEyLTQ0MDItODJlOC0wOGU2ODllMzYzYTciLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6IjQxZDhkNzE2NjU3ZjQ1NzQ5ZmI4MGI4N2FlMTBhMDhiIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.fOaZd_rDuedwKkF7ODn48PUV0_Q952DKrxp7iM8xbvg)

Use the `transpose` command to convert the columns of the single row into multiple rows.

sourcetype=access\_\* status=200 | stats count AS views count(eval(action="addtocart")) AS addtocart count(eval(action="purchase")) AS purchases | transpose

![This screen image shows three rows, one for "views", one for "add to cart" and one for "purchases". Each row displays the corresponding count.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/c9c19f39-dcc3-4615-80cf-2dd322e6b035?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJjOWMxOWYzOS1kY2MzLTQ2MTUtODBjZi0yZGQzMjJlNmIwMzUiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6IjU1ZWI5YzMwY2NiNzRiNDM4NWIyMDM0NzExZDVlMjczIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.PxiX5r9KnevZuS7MUKO2H9dhLsjVyAp9mjDE0_1Am50)

Now these rows can be displayed in a column or pie chart where you can compare the values.

![This screen image shows a pie chart with a slice for each of the rows of data. There is one for "views", one for "add to cart" and one for "purchases". Views has the biggest slice.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/f59a1f49-b951-440e-bdcc-634ca44119b1?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJmNTlhMWY0OS1iOTUxLTQ0MGUtYmRjYy02MzRjYTQ0MTE5YjEiLCJleHAiOjE3NjEwNjAyMzMsImp0aSI6ImVkOGE4ODNhYTRmYTRhMGFiYTVhZTFmYjE3MzZhMWJmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.BR2RfV59qLTzjZ7Fxv3ei34q1xzRnTp3GWCHfOPeeXg)

Note: In this particular example, using a pie chart is misleading. The `views` is a total count of all the actions, not just the `addtocart` and `purchases` actions. Using a pie chart implies that `views` is an action like `addtocart` and `purchases`. The pie chart implies that the value for `views` is 1 part of the total, when in fact `views` is the total.

There are a few ways to fix this issue:

* Use a column chart
* You can remove the `count AS views` criteria from your search
* You can add the `table` command before the `transpose` command in the search, for example:

sourcetype=access\_\* status=200 | stats count AS views count(eval(action="addtocart")) AS addtocart count(eval(action="purchase")) AS purchases | table addtocart purchases | transpose

## See also

Commands

[fields](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fields#id_77c2addd_d37f_413f_8409_4849a2364f3d__fields)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[untable](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#id_4aa7ac19_50dc_4bdd_88b4_c57a4a3a5a53__untable)

[xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries)
