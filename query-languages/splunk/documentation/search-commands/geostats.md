# geostats

## Description

Use the `geostats` command to generate statistics to display geographic data and summarize the data on maps.

The command generates statistics which are clustered into geographical bins to be rendered on a world map.
The events are clustered based on latitude and longitude fields in the events. Statistics are then evaluated on the generated clusters. The statistics can be grouped or split by fields using a `BY` clause.

For map rendering and zooming efficiency, the `geostats` command generates clustered statistics at a variety of zoom levels in one search, the visualization selecting among them. The quantity of zoom levels is controlled by the `binspanlat`, `binspanlong`, and `maxzoomlevel` options. The initial granularity is selected by the `binspanlat` and the `binspanlong`. At each level of zoom, the number of bins is doubled in both dimensions for a total of 4 times as many bins for each zoom in.

## Syntax

The required syntax is in bold.

geostats

[ translatetoxy=<bool> ]

[ latfield=<string> ]

[ longfield=<string> ]

[ globallimit=<int> ]

[ locallimit=<int> ]

[ outputlatfield=<string> ]

[ outputlongfield=<string> ]

[ binspanlat=<float> binspanlong=<float> ]

[ maxzoomlevel=<int> ]

<stats-agg-term>...

[ <by-clause> ]

### Required arguments

stats-agg-term

Syntax: <stats-func> ( <evaled-field> | <wc-field> ) [AS <wc-field>]

Description: A statistical aggregation function. See [Stats function options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geostats#id_591c707d_4fc0_4c07_8aa9_c2a176604dd5__Stats_function_options). The function can be applied to an eval expression, or to a field or set of fields. Use the AS clause to place the result into a new field with a name that you specify. You can use wild card characters in field names. For more information on eval expressions, see [Types of eval expressions](/en/?resourceId=Splunk_Search_Usetheevalcommandandfunctions) in the *Search Manual*.

### Optional arguments

binspanlat

Syntax: binspanlat=<float>

Description: The size of the bins in latitude degrees at the lowest zoom level. If you set `binspanlat` lower than the default value, the visualizations on the map might not render.

Default: 22.5. If the default values for `binspanlat` and `binspanlong` are used, a grid size of 8x8 is generated.

binspanlong

Syntax: binspanlong=<float>

Description: The size of the bins in longitude degrees at the lowest zoom level. If you set `binspanlong` lower than 33, the visualizations on the map might not render.

Default: 45.0. If the default values for `binspanlat` and `binspanlong` are used, a grid size of 8x8 is generated.

by-clause

Syntax: BY <field>

Description: The name of the field to group by.

globallimit

Syntax: globallimit=<int>

Description: Controls the number of named categories to add to each pie chart. There is one additional category called "OTHER" under which all other split-by values are grouped. Setting globallimit=0 removes all limits and all categories are rendered. Currently the grouping into "OTHER" only works intuitively for count and additive statistics.

Default: 10

locallimit

Syntax: locallimit=<int>

Description: Specifies the limit for series filtering. When you set `locallimit=N`, the top N values are filtered based on the sum of each series. If `locallimit=0`, no filtering occurs.

Default: 10

latfield

Syntax: latfield=<field>

Description: Specify a field from the pre-search that represents the latitude coordinates to use in your analysis.

Defaults: lat

longfield

Syntax: longfield=<field>

Description: Specify a field from the pre-search that represents the longitude coordinates to use in your analysis.

Default: lon

maxzoomlevel

Syntax: maxzoomlevel=<int>

Description: The maximum number of levels to create in the quadtree.

Default: 9. Specifies that 10 zoom levels are created, 0-9.

outputlatfield

Syntax: outputlatfield=<string>

Description: Specify a name for the latitude field in your geostats output data.

Default: latitude

outputlongfield

Syntax: outputlongfield=<string>

Description: Specify a name for the longitude field in your geostats output data.

Default:  longitude

translatetoxy

Syntax: translatetoxy=<bool>

Description: If true, geostats produces one result per each locationally binned location. This mode is appropriate for rendering on a map. If false, geostats produces one result per category (or tuple of a multiply split dataset) per locationally binned location. Essentially this causes the data to be broken down by category. This mode cannot be rendered on a map.

Default: true

### Stats function options

stats-func

Syntax: The syntax depends on the function that you use. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#id_37ad4f39_7bb2_447d_b910_c2eec51cc830__Usage).

Description: Statistical and charting functions that you can use with the `geostats` command. Each time you invoke the `geostats` command, you can use one or more functions.

## Usage

To display the information on a map, you must run a reporting search with the `geostats` command.

If you are using a `lookup` command before the `geostats` command, see [Optimizing your lookup search.](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_0b4ef851_8dc3_4494_8dc4_54d6c335f028__Optimizing_your_lookup_search)

### Supported functions

You can use a wide range of functions with the `geostats` command. For general information about using functions, see [Statistical and charting functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions).

* For a list of statistical functions by category, see [Function list by category](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Function_list_by_category)
* For an alphabetical list of statistical functions, see [Alphabetical list of functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_64c88a09_b6aa_4d11_885f_33cf584a4572__Alphabetical_list_of_functions)

### Memory and geostats search performance

A pair of `limits.conf` settings strike a balance between the performance of `geostats` searches and the amount of memory they use during the search process, in RAM and on disk. If your `geostats` searches are consistently slow to complete you can adjust these settings to improve their performance, but at the cost of increased search-time memory usage, which can lead to search failures.

For more information, see [Memory and stats search performance](/en/?resourceId=Splunk_Search_Memoryandstatssearchperformance) in the *Search Manual*.

## Basic examples

### 1. Use the default settings and calculate the count

Cluster events by default latitude and longitude fields "lat" and "lon" respectively. Calculate the count of the events.

... | geostats count

### 2. Specify the latfield and longfield and calculate the average of a field

Compute the average rating for each gender after clustering/grouping the events by "eventlat" and "eventlong" values.

... | geostats latfield=eventlat longfield=eventlong avg(rating) by gender

## Extended examples

### 3. Count each product sold by a vendor and display the information on a map

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search.    In addition, this example uses several lookup files that you must download ([prices.csv.zip](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/73259324-9eda-4a51-b141-f326000adebb?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3MzI1OTMyNC05ZWRhLTRhNTEtYjE0MS1mMzI2MDAwYWRlYmIiLCJleHAiOjE3NjEwNjAxMjMsImp0aSI6ImVkOTEwNGMzM2JhNTRiN2M5NTdmODgyNmNjYjBkOGEwIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.YVt-JSxJ3zuf8nwuEs0nhm8kAdN7VQzmMUHBzczuLjg&response-content-disposition=attachment%3B+filename%3D%22Prices.csv.zip%22) and [vendors.csv.zip](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/266d8904-3f59-4b62-8393-bb585cbe0baa?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyNjZkODkwNC0zZjU5LTRiNjItODM5My1iYjU4NWNiZTBiYWEiLCJleHAiOjE3NjEwNjAxMjMsImp0aSI6IjY4YjZhZmNjMDQ4NjRkZjFiMjQyNGVjMjhkYzY1Nzc4IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.C9ynl0v8ZRR4I4oLKj4N9IJQwvPRkQ6rrAip1m-wqDg&response-content-disposition=attachment%3B+filename%3D%22Vendors.csv.zip%22)) and unzip the files. You must complete the steps in the [Enabling field lookups](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) section of the tutorial for both the `prices.csv` and the `vendors.csv` files. The steps in the tutorial are specific to the `prices.csv` file. For the `vendors.csv` file, use the name vendors\_lookup for the lookup definition. Skip the step in the tutorial that makes the lookups automatic. |

This search uses the `stats` command to narrow down the number of events that the `lookup` and `geostats` commands need to process.

Use the following search to count each product sold by a vendor and display the information on a map.

sourcetype=vendor\_sales | stats count by Code VendorID | lookup prices\_lookup Code OUTPUTNEW product\_name | table product\_name VendorID | lookup vendors\_lookup VendorID | geostats latfield=VendorLatitude longfield=VendorLongitude count by product\_name

* In this example, `sourcetype=vendor_sales` is associated with a log file that is included in the Search Tutorial sample data. This log file contains vendor information that looks like this:

[10/Apr/2018:18:24:02] VendorID=5036 Code=B AcctID=6024298300471575

* The `vendors_lookup` is used to output all the fields in `vendors.csv` file that match to the VentorID in the vendor\_sales.log file. The fields in the `vendors.csv` file are : Vendor, VendorCity, VendorID, VendorLatitude, VendorLongitude, VendorStateProvince, and VendorCountry.
* The `prices_lookup` is used to match the Code field in each event to a product\_name in the table.

This search produces a table displayed on the Statistics tab:

![This image shows the results of the search in the Statistics tab. The first column contains the geobin values. The last two columns contain the latitude and longitude values. The columns in between list product names and corresponding counts.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ddf5b981-fd3e-4971-a9a2-364087a97a25?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJkZGY1Yjk4MS1mZDNlLTQ5NzEtYTlhMi0zNjQwODdhOTdhMjUiLCJleHAiOjE3NjEwNjAxMjMsImp0aSI6IjZmYmEzZWZiZDliMTRiMTU4NDZiZDgzM2NjZGYzOGU0IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.ru82I8lXBXj_kkUzV-yY0CbKmg5cazn6Qp_WyvKGMkM)

Click the Visualization tab. The results are plotted on a world map. There is a pie chart for each vendor in the results. The larger the pie chart, the larger the count value.

![This image shows the results of the search displayed on the Visualization tab. For each set of coordinates in the statistics table, a pie chart displays on a map. There are controls on the upper left side of the map to zoom in and out.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/d617c1a3-71eb-4b15-ae12-9b087b9eb94a?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJkNjE3YzFhMy03MWViLTRiMTUtYWUxMi05YjA4N2I5ZWI5NGEiLCJleHAiOjE3NjEwNjAxMjMsImp0aSI6IjhjNDZhYTBlZTM3NTQxNmNhN2IxNmU0ZjE2OTY1YjliIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.oGcSPyit775GMnqSj9Yz8ABP8mI2kBO_qtay7xZXLro)

In this screen shot, the mouse pointer is over the pie chart for a region in the northeastern part of the United States. An popup information box displays the latitude and longitude for the vendor, as well as a count of each product that the vendor sold.

You can zoom in to see more details on the map.

## See also

Commands

[iplocation](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iplocation#id_4c1ae8b1_28de_453b_8d46_fbc07b9ea651__iplocation)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries)

Reference information

[Mapping data](/en/?resourceId=Splunk_Viz_Choroplethmaps) in *Dashboards and Visualizations*
