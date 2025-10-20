# append

## Description

Appends the results of a [subsearch](https://docs.splunk.com/Splexicon:Subsearch) to the current results.
The `append` command runs only over historical data and does not produce correct results if used in a real-time search.

By default, subsearches return a maximum of 10,000 results and have a maximum runtime of 60 seconds. If a subsearch runs for more than 60 seconds, its search results are automatically finalized.

For more information about when to use the append command, see the flowchart in the topic [About event grouping and correlation](/en/?resourceId=Splunk_Search_Abouteventcorrelation) in the *Search Manual*.

If you are familiar with SQL but new to SPL, see [Splunk SPL for SQL users](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/splunk-spl-for-sql-users#e4bc11a8_84ab_4f96_8374_ddd2b86db298__Splunk_SPL_for_SQL_users).

## Syntax

append [<subsearch-options>...] <subsearch>

### Required arguments

subsearch

Syntax: [subsearch]

Description: A secondary search where you specify the source of the events that you want to append. The subsearch must be enclosed in square brackets. See [About subsearches](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the *Search Manual*.

### Optional arguments

subsearch-options

Syntax: extendtimerange=<boolean> | maxtime=<int> | maxout=<int>

Description: Controls how the subsearch is processed.

### Subsearch options

extendtimerange

Syntax: extendtimerange=<boolean>

Description: Specifies whether to include the subsearch time range in the time range for the entire search. Use the `extendtimerange` argument when the time range in the subsearch extends beyond the time range for the main search. Use this argument when a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand), such as [chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart), or [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats), follows the `append` command in the search and the search uses time based bins.

Default: false

maxtime

Syntax: maxtime=<int>

Description: The maximum time, in seconds, to spend on the subsearch before automatically finalizing.

Default: 60

maxout

Syntax: maxout=<int>

Description: The maximum number of result rows to output from the subsearch.

Default: 50000

## Usage

The `append` command is a transforming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### 1: Use the append command to add column totals.

|  |
| --- |
| This search uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), etc., for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and upload the file to your Splunk instance. This example uses the All Earthquakes data from the past 30 days. |

Count the number of earthquakes that occurred in and around California yesterday and then calculate the total number of earthquakes.

source=usgs place=\*California\* | stats count by magType | append [search index=usgs\_\* source=usgs place=\*California\* | stats count]

This example uses a subsearch to count all the earthquakes in the California regions (`place="*California"`), then uses the main search to count the number of earthquakes based on the magnitude type of the search.

You cannot use the `stats` command to simultaneously count the total number of events and the number of events for a specified field. The subsearch is used to count the total number of earthquakes that occurred. This count is added to the results of the previous search with the `append` command.

Because both searches share the `count` field, the results of the subsearch are listed as the last row in the count column.

The results appear on the Statistics tab and look something like this:

| magType | count |
| --- | --- |
| H | 123 |
| MbLg | 1 |
| Md | 1565 |
| Me | 2 |
| Ml | 1202 |
| Mw | 6 |
| ml | 10 |
|  | 2909 |

This search demonstrates how to use the `append` command in a way that is similar to using the `addcoltotals` command to add the column totals.

### 2. Count the number of different customers who purchased items. Append the top purchaser for each type of product.

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Count the number of different customers who purchased something from the Buttercup Games online store yesterday, and break this count down by the type of product (accessories, t-shirts, and type of games) they purchased. Also, list the top purchaser for each type of product and how much that person bought of that product.

sourcetype=access\_\* action=purchase | stats dc(clientip) BY categoryId | append [search sourcetype=access\_\* action=purchase | top 1 clientip BY categoryId] | table categoryId, dc(clientip), clientip, count

This example first searches for purchase events (`action=purchase`). These results are piped into the `stats` command and the `dc()`, or `distinct_count()` function is used to count the number of different users who make purchases. The `BY` clause is used to break up this number based on the different category of products (`categoryId`).

This example contains a subsearch as an argument for the `append` command.

...[search sourcetype=access\_\* action=purchase | top 1 clientip BY categoryId]

The subsearch is used to search for purchase events and count the top purchaser (based on `clientip`) for each category of products. These results are added to the results of the previous search using the `append` command.

Here, the `table` command is used to display only the category of products (`categoryId`), the distinct count of users who bought each type of product (`dc(clientip)`), the actual user who bought the most of a product type (`clientip`), and the number of each product that user bought (`count`).

![This image shows the results of the search on the Statistics tab. The results of the first search show the category IDs and the distinct count of the client IPs. The results of the subsearch are appended as additional result rows and repeat the category IDs and display the client IPs and a count.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ea620369-e82e-47b4-a4ad-3cc857127836?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlYTYyMDM2OS1lODJlLTQ3YjQtYTRhZC0zY2M4NTcxMjc4MzYiLCJleHAiOjE3NjEwNjAwNTYsImp0aSI6IjVkOGMyYjk3MjJlZDQxMWZiYTRhNDEyMjg1NjU5ZDY0IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.f3H2PKRlfIVVwS6hZ8Z3XkcVS12-PjShVPv4ggUA9sQ)

You can see that the `append` command just tacks on the results of the subsearch to the end of the previous search, even though the results share the same field values. It does not let you manipulate or reformat the output.

### 3. Use the append command to determine the number of unique IP addresses that accessed the Web server.

Use the `append` command, along with the `stats`, `count`, and `top` commands to determine the number of unique IP addresses that accessed the Web server. Find the user who accessed the Web server the most for each type of page request.

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range Yesterday when you run the search. |

Count the number of different IP addresses that accessed the Web server and also find the user who accessed the Web server the most for each type of page request (`method`).

sourcetype=access\_\* | stats dc(clientip), count by method | append [search sourcetype=access\_\* | top 1 clientip by method]

The Web access events are piped into the `stats` command and the `dc() or distinct_count()` function is used to count the number of different users who accessed the site. The `count()` function is used to count the total number of times the site was accessed. These numbers are separated by the page request (`method`).

The subsearch is used to find the top user for each type of page request (`method`). The `append` command is used to add the result of the subsearch to the bottom of the table.

The results appear on the Statistics tab and look something like this:

| method | dc(clientip) | count | clientip | percent |
| --- | --- | --- | --- | --- |
| GET | 173 | 2666 |  |  |
| POST | 168 | 1727 |  |  |
| GET |  | 83 | 87.194.216.51 | 3.113278 |
| POST |  | 64 | 87.194.216.51 | 3.705848 |

The first two rows are the results of the first search. The last two rows are the results of the subsearch. Both result sets share the `method` and `count` fields.

### 4. Specify the maximum time for the subsearch to run and the maximum number of result rows from the subsearch

Use the `append` command, to determine the number of unique IP addresses that accessed the Web server. Find the user who accessed the Web server the most for each type of page request.

|  |
| --- |
| This example uses the sample dataset from [the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial) but should work with any format of Apache web access log. Download the data set from [this topic in the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to upload it to your Splunk deployment. Use the time range Yesterday when you run this search. |

Count the number of different IP addresses that accessed the Web server and also find the user who accessed the Web server the most for each type of page request (`method`). Limit the subsearch to 30 seconds and the maximum number of subsearch results to 1000.

sourcetype=access\_\* | stats dc(clientip), count by method | append maxtime=30 maxout=1000 [search sourcetype=access\_\* | top 1 clientip by method]

### 5. Use the extendtimerange argument

Use the `extendtimerange` argument to ensure that the time range used for the search includes both the time range of the main search and the time range of the subsearch.

index=\_internal earliest=11/20/2017:00:00:00 latest=11/30/2017:00:00:00
|append extendtimerange=true
[search index=\_audit earliest=11/1/2017:00:00:00 latest=11/25/2017:00:00:00]
|timechart span=1d count

The time range used for the search is from 11/1/2017:00:00:00, the earliest time in the subsearch, to 11/30/2017:00:00:00, the latest time in the main search.

## See also

[appendcols](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendcols#id_40e2fdd2_c8c8_4059_b826_db6a95005a6a__appendcols), [appendpipe](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendpipe#id_27cc9b5b_605f_40f2_af8e_d66a193a79a5__appendpipe), [join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join), [set](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/set#id_653646ef_cdac_43a6_a15e_06f61dcfbdd9__set)
