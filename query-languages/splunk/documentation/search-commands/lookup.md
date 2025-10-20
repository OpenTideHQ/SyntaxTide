# lookup

## Description

Use the `lookup` command to invoke field value lookups.

For information about the types of lookups you can define, see [About lookups](/en/?resourceId=Splunk_Knowledge_Aboutlookupsandfieldactions) in the *Knowledge Manager Manual*.

The `lookup` command supports IPv4 and IPv6 addresses and subnets that use CIDR notation.

## Syntax

The required syntax is in bold.

lookup

[local=<bool>]

[update=<bool>]

<lookup-table-name>

( <lookup-field> [AS <event-field>] )...

[ OUTPUT | OUTPUTNEW (<lookup-destfield> [AS <event-destfield>] )... ]

Note: The lookup command can accept multiple lookup and event `fields` and `destfields`. For example:

...| lookup <lookup-table-name> <lookup-field1> AS <event-field1>, <lookup-field2> AS <event-field2> OUTPUTNEW <lookup-destfield1> AS <event-destfield1>, <lookup-destfield2> AS <event-destfield2>

### Required arguments

<lookup-table-name>

Syntax: <string>

Description: Can be either the name of a CSV file that you want to use as the lookup, or the name of a stanza in the `transforms.conf` file that specifies the location of the lookup table file.

### Optional arguments

local

Syntax: local=<bool>

Description: If `local=true`, forces the lookup to run on the search head and not on any remote peers.

Default: false

update

Syntax: update=<bool>

Description: If the lookup table is modified on disk while the search is running, real-time searches do not automatically reflect the update. To do this, specify `update=true`. This does not apply to searches that are not real-time searches. This implies that local=true.

Default: false

<lookup-field>

Syntax: <string>

Description: Refers to a field in the lookup table to match against the events. You can specify multiple <lookup-field> values.

<event-field>

Syntax: <string>

Description: Refers to a field in the events from which to acquire the value to match in the lookup table. You can specify multiple <event-field> values.

Default: The value of the <lookup-field>.

<lookup-destfield>

Syntax: <string>

Description: Refers to a field in the lookup table to be copied into the events. You can specify multiple <lookup-destfield> values.

<event-destfield>

Syntax: <string>

Description: A field in the events. You can specify multiple <event-destfield> values.

Default: The value of the <lookup-destfield> argument.

## Usage

The `lookup` command is a distributable streaming command when `local=false`, which is the default setting.
See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

When using the `lookup` command, if an OUTPUT or OUTPUTNEW clause is not specified, all of the fields in the lookup table that are not the match fields are used as output fields. If the OUTPUT clause is specified, the output lookup fields overwrite existing fields. If the OUTPUTNEW clause is specified, the lookup is not performed for events in which the output fields already exist.

### Avoid lookup reference cycles

When you set up the OUTPUT or OUTPUTNEW clause for your lookup, avoid accidentally creating lookup reference cycles, where you intentionally or accidentally reuse the same field names among the match fields and the output fields of a `lookup` search.

For example, if you run a `lookup` search where `type` is both the match field and the output field, you are creating a lookup reference cycle. You can accidentally create a lookup reference cycle when you fail to specify an OUTPUT or OUTPUTNEW clause for `lookup`.

For more information about lookup reference cycles see [Define an automatic lookup in Splunk Web](/en/?resourceId=Splunk_Knowledge_DefineanautomaticlookupinSplunkWeb) in the *Knowledge Manager Manual*.

### Optimizing your lookup search

If you are using the `lookup` command in the same pipeline as a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand), and it is possible to retain the field you will lookup on after the transforming command, do the lookup after the transforming command. For example, run:

sourcetype=access\_\* | stats count by status | lookup status\_desc status OUTPUT description

and not:

sourcetype=access\_\* | lookup status\_desc status OUTPUT description | stats count by description

The lookup in the first search is faster because it only needs to match the results of the stats command and not all the Web access events.

## Run lookup in federated searches

If you are running [federated searches](https://docs.splunk.com/Splexicon:Federatedsearch) over standard mode Splunk platform [federated providers](https://docs.splunk.com/Splexicon:Federatedprovider), and you want to use the `lookup` command to enrich the results of a federated search, see [Run federated searches over lookups](/en/?resourceId=Splunk_FederatedSearch_fss2sRunSearches) in *Federated Search*.

For an overview of federated search for Splunk, see [About Federated Search for Splunk](/en/?resourceId=Splunk_FederatedSearch_fss2sAbout) in *Federated Search*.

### Configure a lookup to run on the local federated search head

In a standard mode federated search, you can force a `lookup` command to be processed locally on the federated search head by applying `local=true` to it. If you do not set `local=true`, Splunk software will optimize processing of the lookup command on the federated search head and the remote search head depending on the specific conditions of the search.

If the lookup definition and lookup tables expected by the lookup are not present on the search heads on which it is processed, Splunk Web displays an error message when the search runs. See [Manage knowledge objects for standard mode federated providers](/en/?resourceId=Splunk_FederatedSearch_fss2sKnowledgeObject) in *Federated Search*.

## Basic example

### 1. Lookup users and return the corresponding group the user belongs to

Suppose you have a lookup table specified in a stanza named `usertogroup` in the `transforms.conf` file. This lookup table contains (at least) two fields, `user` and `group`. Your events contain a field called `local_user`. For each event, the following search checks to see if the value in the field `local_user` has a corresponding value in the `user` field in the lookup table. For any entries that match, the value of the `group` field in the lookup table is written to the field `user_group` in the event.

... | lookup usertogroup user as local\_user OUTPUT group as user\_group

## Extended example

### 1. Lookup price and vendor information and return the count for each product sold by a vendor

|  |
| --- |
| This example uses the tutorialdata.zip file from the Search Tutorial. You can download this file and add it to your Splunk deployment. See [upload the tutorial data](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Additionally, this example uses the [prices.csv](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/73259324-9eda-4a51-b141-f326000adebb?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3MzI1OTMyNC05ZWRhLTRhNTEtYjE0MS1mMzI2MDAwYWRlYmIiLCJleHAiOjE3NjEwNjAxNDEsImp0aSI6IjIxYmQ4Mzk4MDllMjQyZjQ4MDk5OTAzOWNmYTg4NTJjIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.n2uYhuJbwxVrVd3PSCxl4gdkWWPB3sdiMDwqkYNJ2EA&response-content-disposition=attachment%3B+filename%3D%22Prices.csv.zip%22) and the [vendors.csv](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/266d8904-3f59-4b62-8393-bb585cbe0baa?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyNjZkODkwNC0zZjU5LTRiNjItODM5My1iYjU4NWNiZTBiYWEiLCJleHAiOjE3NjEwNjAxNDEsImp0aSI6IjVjMDVlOWZmZTNkNjQxM2ZiMDE0YzY2NjBhYjU0NGEzIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.QsoCKwhWwUZi5e_JskshugKMyGXSi_bBoxlkutrKYLI&response-content-disposition=attachment%3B+filename%3D%22Vendors.csv.zip%22) files. To follow along with this example in your Splunk deployment, download these CSV files and complete the steps in the [Use field lookups](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) section of the Search Tutorial for both the `prices.csv` and the `vendors.csv` files. When you create the lookup definition for the `vendors.csv` file, name the lookup vendors\_lookup. You can skip the step in the tutorial that makes the lookups automatic. |

This example calculates the count of each product sold by each vendor.

The `prices.csv` file contains the product names, price, and code. For example:

| productId | product\_name | price | sale\_price | Code |
| --- | --- | --- | --- | --- |
| DB-SG-G01 | Mediocre Kingdoms | 24.99 | 19.99 | A |
| DC-SG-G02 | Dream Crusher | 39.99 | 24.99 | B |
| FS-SG-G03 | Final Sequel | 24.99 | 16.99 | C |
| WC-SH-G04 | World of Cheese | 24.99 | 19.99 | D |

The `vendors.csv` file contains vendor information, such as vendor name, city, and ID. For example:

| Vendor | VendorCity | VendorID | VendorLatitude | VendorLongitude | Vendor StateProvince | Vendor Country | Weight |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anchorage Gaming | Anchorage | 1001 | 61.17440033 | -149.9960022 | Alaska | United States | 3 |
| Games of Salt Lake | Salt Lake City | 1002 | 40.78839874 | -111.9779968 | Utah | United States | 3 |
| New Jack Games | New York | 1003 | 40.63980103 | -73.77890015 | New York | United States | 4 |
| Seals Gaming | San Francisco | 1004 | 37.61899948 | -122.375 | California | United States | 5 |

The search will query the `vendor_sales.log` file, which is part of the tutorialdata.zip file. The `vendor_sales.log` file contains the VendorID, Code, and AcctID fields. For example:

| Entries in the vendor\_sales.log file |
| --- |
| [13/Mar/2018:18:24:02] VendorID=5036 Code=B AcctID=6024298300471575 |
| [13/Mar/2018:18:23:46] VendorID=7026 Code=C AcctID=8702194102896748 |
| [13/Mar/2018:18:23:31] VendorID=1043 Code=B AcctID=2063718909897951 |
| [13/Mar/2018:18:22:59] VendorID=1243 Code=F AcctID=8768831614147676 |

The following search calculates the count of each product sold by each vendor and uses the time range `All time`.

sourcetype=vendor\_\* | stats count by Code VendorID | lookup prices\_lookup Code OUTPUTNEW product\_name

* The `stats` command calculates the `count` by Code and VendorID.
* The `lookup` command uses the `prices_lookup` to match the Code field in each event and return the product names.

The search results are displayed on displayed on the Statistics tab.

![This image shows the results of the search in the Statistics tab. There are more than 30,000 events returned. There are four columns in the output. The first column contains the Code values. The second column contains the Vendor IDs. The third column contains the count by Vendor ID. The last column contains the names of the products.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/21f705f5-4470-461c-9af6-ab5f794fcbb2?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIyMWY3MDVmNS00NDcwLTQ2MWMtOWFmNi1hYjVmNzk0ZmNiYjIiLCJleHAiOjE3NjEwNjAxNDEsImp0aSI6IjliNGM3NzAzYjU4NTRlZDg4MTEzYmNjZWY0ZmEwZmE3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.hBdpro0W11Qef48TnKFH--PH1v0c70NOvMH9s7E4Ojg)

You can extend the search to display more information about the vendor by using the vendors\_lookup.

Use the `table` command to return only the fields that you need. In this example you want the `product_name`, `VendorID`, and `count` fields. Use the `vendors_lookup` file to output all the fields in the `vendors.csv` file that match the VendorID in each event.

sourcetype=vendor\_\* | stats count by Code VendorID | lookup prices\_lookup Code OUTPUTNEW product\_name | table product\_name VendorID count | lookup vendors\_lookup VendorID

The revised search results are displayed on the Statistics tab.

![This image shows the results of the search in the Statistics tab. The search returns nine columns: product name, vendor ID, vendor, vendor city, vendor country, vendor latitude, vendor longitude, vendor state or province, and weight.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/437c2397-cbf6-4c61-8e46-81f7d1212cbf?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI0MzdjMjM5Ny1jYmY2LTRjNjEtOGU0Ni04MWY3ZDEyMTJjYmYiLCJleHAiOjE3NjEwNjAxNDEsImp0aSI6Ijk3Y2Q4ZjBjNTg3ZjQwYzk4ZGQzNGMyN2Q1NWRlNDIyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.14be3veXwmNdCKdCWtVaYtI9bpqvhiRXywKthOlmn6Y)

To expand the search to display the results on a map, see the [geostats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geostats#b15723e5_eb2a_484e_814b_4a5c3ef3c899__geostats) command.

### 2. IPv6 CIDR match in Splunk Web

In this example, CSV lookups are used to determine whether a specified IPv6 address is in a CIDR subnet. You can follow along with the example by performing these steps in Splunk Web. See [Define a CSV lookup in Splunk Web](/en/?resourceId=Splunk_Knowledge_Usefieldlookupstoaddinformationtoyourevents).

Prerequisites

* Your role must have the upload\_lookup\_files capability to upload lookup table files in Splunk Web. See [Define roles with capabilities](/en/?resourceId=Splunk_Security_Rolesandcapabilities) in Splunk Enterprise "Securing the Splunk Platform".
* A CSV lookup table file called ipv6test.csv that contains the following text.

  `ip,expected`

  `2001:0db8:ffff:ffff:ffff:ffff:ffff:ff00/120,true`

  The `ip` field in the lookup table contains the subnet value, not the IP address.

Steps

You have to define a CSV lookup before you can match an IP address to a subnet.

1. Select Settings > Lookups to go to the Lookups manager page.
2. Click Add new next to Lookup table files.
3. Select a Destination app from the drop-down list.
4. Click Choose File to look for the ipv6test.csv file to upload.
5. Enter ipv6test.csv as the destination filename. This is the name the lookup table file will have on the Splunk server.
6. Click Save.
7. In the Lookup table list, click Permissions in the Sharing column of the ipv6test lookup you want to share.
8. In the Permissions dialog box, under Object should appear in, select All apps to share globally. If you want the lookup to be specific to this app only, select This app only.
9. Click Save.
10. Select Settings > Lookups.
11. Click Add new next to Lookup definitions.
12. Select a Destination app from the drop-down list.
13. Give your lookup definition a unique Name, like ipv6test.
14. Select File-based as the lookup Type.
15. Select ipv6test.csv as the Lookup file from the drop-down list.
16. Select the Advanced options check box.
17. Enter a Match type of CIDR(ip).
18. Click Save.
19. In the Lookup definitions list, click Permissions in the Sharing column of the ipv6test lookup definition you want to share.
20. In the Permissions dialog box, under Object should appear in, select All apps to share globally. If you want the lookup to be specific to this app only, select This app only.

    Note: Permissions for lookup table files must be at the same level or higher than those of the lookup definitions that use those files.
21. Click Save.

In the Search app, run the following search to match the IP address to the subnet.

| makeresults
| eval ip="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99"
| lookup ipv6test ip OUTPUT expected

The IP address is in the subnet, so the search displays `true` in the `expected` field. The search results look something like this.

| time | expected | ip |
| --- | --- | --- |
| 2020-11-19 16:43:31 | true | 2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99 |

## See also

Commands

[appendcols](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendcols#id_40e2fdd2_c8c8_4059_b826_db6a95005a6a__appendcols)

[inputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputlookup#d34e0d7d_f9ab_409b_9722_45400f8f891a__inputlookup)

[outputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputlookup#e143e626_d3c6_4b38_a299_073dbcc87b58__outputlookup)

[iplocation](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iplocation#id_4c1ae8b1_28de_453b_8d46_fbc07b9ea651__iplocation)

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)

Functions

[cidrmatch](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions)

Related information

[About lookups](/en/?resourceId=Splunk_Knowledge_Aboutlookupsandfieldactions) in the *Knowledge Manager Manual*
