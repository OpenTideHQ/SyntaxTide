# xyseries

This topic walks through how to use the xyseries command.

## Description

Converts results into a tabular format that is suitable for graphing. This command is the inverse of the [untable](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#id_4aa7ac19_50dc_4bdd_88b4_c57a4a3a5a53__untable) command.

## Syntax

xyseries [grouped=<bool>] <x-field> <y-name-field> <y-data-field>... [sep=<string>] [format=<string>]

### Required arguments

<x-field>

Syntax: <field>

Description: The name of the field to use for the x-axis label. The values of this field appear as labels for the data series plotted on the x-axis.

<y-name-field>

Syntax: <field>

Description: The field that contains the values to use as labels for the data series.

<y-data-field>

Syntax: <field> [,<field>] ...

Description: One or more fields that contain the data to chart. When specifying multiple fields, separate the field names with commas.

### Optional arguments

format

Syntax: format=<string>

Description: Used to construct output field names when multiple data series are used in conjunction with a split-by-field and separate the <y-name-field> and the <y-data-field>. `format` takes precedence over `sep` and lets you specify a parameterized expression with the stats aggregator and function ($AGG$) and the value of the split-by-field ($VAL$).

grouped

Syntax: grouped= true | false

Description: If true, indicates that the input is sorted by the value of the <x-field> and multifile input is allowed.

Default:
`false`

sep

Syntax: sep=<string>

Description: Used to construct output field names when multiple data series are used in conjunctions with a split-by field. This is equivalent to setting `format` to `$AGG$<sep>$VAL$`.

## Usage

The `xyseries` command is a [distributable streaming command](https://docs.splunk.com/Splexicon:Streamingcommand), unless `grouped=true` is specified and then
the `xyseries` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Alias

The alias for the `xyseries` command is `maketable`.

### Results with duplicate field values

When you use the `xyseries` command to converts results into a tabular format, results that contain duplicate values are removed.

You can use the `streamstats` command create unique record numbers and use those numbers to retain all results. For an example, see the Extended example for the [untable command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#e9b983f3_da0a_436b_9c67_7444d21a3778__Extended_example).

## Example

Let's walk through an example to learn how to reformat search results with the xyseries command.

### Write a search

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Run this search in the search and reporting app:

sourcetype=access\_\* status=200 action=purchase | top categoryId

The `top` command automatically adds the count and percent fields to the results. For each categoryId, there are two values, the count and the percent.

The search results look like this:

| categoryId | count | percent |
| --- | --- | --- |
| STRATEGY | 806 | 30.495649 |
| ARCADE | 493 | 18.653046 |
| TEE | 367 | 13.885736 |
| ACCESSORIES | 348 | 13.166856 |
| SIMULATION | 246 | 9.307605 |
| SHOOTER | 245 | 9.269769 |
| SPORTS | 138 | 5.221339 |

### Identify your fields in the xyseries command syntax

In this example:

* <x-field> = categoryId
* <y-name-field> = count
* <y-data-field> = percent

### Reformat search results with xyseries

When you apply the `xyseries` command, the `categoryId` serves as the <x-field> in your search results. The results of the calculation `count` become the columns, <y-name-field>, in your search results. The <y-data-field>, `percent`, corresponds to the values in your search results.

Run this search in the search and reporting app:

sourcetype=access\_\* status=200 action=purchase | top categoryId | xyseries categoryId count percent

The search results look like this:

| categoryId | 138 | 245 | 246 | 348 | 367 | 493 | 806 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SPORTS | 5.221339 |  |  |  |  |  |  |
| ACCESSORIES |  |  |  | 13.166856 |  |  |  |
| ARCADE |  |  |  |  |  | 18.653046 |  |
| SHOOTER |  | 9.269769 |  |  |  |  |  |
| SIMULATION |  |  | 9.307605 |  |  |  |  |
| STRATEGY |  |  |  |  |  |  | 30.495649 |
| TEE |  |  |  |  |  | 13.885736 |  |

## Extended example

Let's walk through an example to learn how to add optional arguments to the xyseries command.

### Write a search

To add the optional arguments of the xyseries command, you need to write a search that includes a split-by-field command for multiple aggregates. Use the `sep` and `format` arguments to modify the output field names in your search results.

Run this search in the search and reporting app:

sourcetype=access\_combined\_wcookie | stats count(host) count(productId) by clientip, referer\_domain

This search sorts referrer domain, count(host) and count(productId) by clientIp.
![This screenshot shows the search results displayed in a table. The first column is clientip, the second column is referrer_domain, the third column is count(host) and the fourth column is count(productId).](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/7a31fc9c-daab-40a3-bb2c-4d1effac571f?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3YTMxZmM5Yy1kYWFiLTQwYTMtYmIyYy00ZDFlZmZhYzU3MWYiLCJleHAiOjE3NjEwNjAyNTIsImp0aSI6IjllZGEyZWZhNjE4YzQ0NmI4MmExZTU3M2NhOTllYTRkIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.wfQAmJd1kMxGXZiMQXOQoAarXg2SkP9QvV0YG3rbtgU)

Run this search in the search and reporting app:

sourcetype=access\_combined\_wcookie | stats count(host) count(productId) by clientip, referer\_domain | xyseries clientip referer\_domain count(host), count(productId)

In this example:

* <x-field> = clientip
* <y-name-field> = referrer domain
* <y-data-field> = host, productId

The xyseries command needs two aggregates, in this example they are: count(host) count(productId). The first few search results look like this:
![This screenshot shows the search results displayed in a table. The referrer domains are sorted by clientip.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/29da4184-bf3f-4f1c-a1e6-f03995552078?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyOWRhNDE4NC1iZjNmLTRmMWMtYTFlNi1mMDM5OTU1NTIwNzgiLCJleHAiOjE3NjEwNjAyNTIsImp0aSI6IjMzNGRiMmYzMzdiNTQ2MzJiOTRmZjNmMThiMGQ0NDMxIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.SRP-CtigEvlo5i3-SssYR94biRElUkj_LXH4oeArxSg)

### Add optional argument: sep

Add a string to the sep argument to change the default character that separates the <y-name-field> host,and the <y-data-field> productId. The format argument adds the <y-name-field> and separates the field name and field value by the default ":"

Run this search in the search and reporting app:

sourcetype=access\_combined\_wcookie | stats count(host) count(productId) by clientip, referer\_domain | xyseries clientip referer\_domain count(host), count(productId) sep="-"

The first few search results look like this:
![This screenshot shows the search results displayed in a table. The referrer domains are sorted by clientip.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/4bf4ec24-d63e-48e9-92c5-419882955218?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0YmY0ZWMyNC1kNjNlLTQ4ZTktOTJjNS00MTk4ODI5NTUyMTgiLCJleHAiOjE3NjEwNjAyNTIsImp0aSI6IjA1MDQ3YTgwNGI4NTQyNjI5MDA1MWE3ODhlMTExYTJlIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.4sDdbKYoNd22DxvVdRITbd49jltO4D0FS69ZRnoMKzo)

### Add optional argument: format

The format argument adds the <y-name-field> and separates the field name and field value by the default ":" For example, the default for this example looks like count(host):referrer\_domain

When you specify a string to separate the <y-name-field> and <y-data-field> with the format argument, it overrides any assignment from the sep argument. In the following example, the sep argument assigns the "-" character to separate the <y-name-field> and <y-data-field> fields. The format argument assigns a "+" and this assignment takes precedence over sep. In this case $VAL$ and $AGG$ represent both the <y-name-field> and <y-data-field>. As seen in the search results, the <y-name-field>, host, and <y-data-field>, productId can correspond to either $VAL$ or $AGG$.

Run this search in the search and reporting app:

sourcetype=access\_combined\_wcookie | stats count(host) count(productId) by clientip, referer\_domain | xyseries clientip referer\_domain count(host), count(productId) sep="-" format="$AGG$ + $VAL$ TEST"

The first few search results look like this:
![This screenshot shows the search results displayed in a table. The referrer domains are sorted by clientip.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/0e74ca03-d997-4460-abdb-3a50cf3bb1d1?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIwZTc0Y2EwMy1kOTk3LTQ0NjAtYWJkYi0zYTUwY2YzYmIxZDEiLCJleHAiOjE3NjEwNjAyNTIsImp0aSI6IjU0NWJmZDQ4MmFlZTQ1MTJiMWMxYWU0ODFjNjYxNjU3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.R6mgiBNud-Q3m4cjKyJI2zSyKU6CkcfanD5OGyKpLx8)

### Add optional argument: grouped

The grouped argument determines whether the `xyseries` command runs as a [distributable streaming command](https://docs.splunk.com/Splexicon:Streamingcommand), or a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). The default state grouped=FALSE for the `xyseries` command runs as a streaming command.

## See also

Commands

[untable](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#id_4aa7ac19_50dc_4bdd_88b4_c57a4a3a5a53__untable)
