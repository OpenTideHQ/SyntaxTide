# iplocation

## Description

The `iplocation` command extracts location information from IP addresses by using 3rd-party databases. This command supports IPv4 and IPv6 addresses and subnets that use CIDR notation.

The IP address that you specify in the `ip-address-fieldname` argument, is looked up in a database. Fields from that database that contain location information are added to each event. The setting of the `allfields` argument determines which fields are added to the events.

Because all the information might not be available for each IP address, an event can have empty field values.

For IP addresses which do not have a location, such as internal addresses, no fields are added.

## Syntax

The required syntax is in bold.

iplocation

[prefix=<string>]

[allfields=<bool>]

[lang=<string>]

<ip-address-fieldname>

### Required arguments

ip-address-fieldname

Syntax: <field>

Description: Specify an IP address field, such as `clientip`.

### Optional arguments

allfields

Syntax: allfields=<bool>

Description: Specifies whether to add all of the fields from the database to the search results. If set to `true`, this argument adds the fields `City`, `Continent`, `Country`, `MetroCode`, `Region`, `Timezone`, `_time`, `lat` (latitude), and `lon` (longitude).

Default: false. Only the `City`, `Country`, `Region`, `_time`, `lat`, and `lon` fields are added to the search results.

lang

Syntax: lang=<string>

Description: Renders the resulting strings in different languages. For example, use `lang=es` for Spanish. The set of languages depends on the geoip database that is used. To specify more than one language, separate them with a comma. This also indicates the priority in descending order. Specify `lang=code` to return the fields as two letter ISO abbreviations.

prefix

Syntax: prefix=<string>

Description: Specify a string to prefix the field name. With this argument you can add a prefix to the added field names to avoid name collisions with existing fields. For example, if you specify `prefix=iploc_` the field names that are added to the events become `iploc_City`, `iploc_County`, `iploc_lat`, and so forth.

Default: NULL/empty string

## Usage

The `iplocation` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The Splunk software ships with a copy of the dbip-city-lite.mmdb IP geolocation database file. This file is located in the $SPLUNK\_HOME/share/ directory.

### Updating the IP geolocation database file

Through Splunk Web, you can update the .mmdb file that ships with the Splunk software. The file you update it with can be a copy of one of the following two files. Only those two files are supported. To use these two files, you must have a license for the GeoIP2 City database.

| File name | Description |
| --- | --- |
| GeoLite2-City.mmdb | This is a free IP geolocation database that is updated on its download page on a weekly basis. |
| GeoIP2-City.mmdb | This is a paid version of the GeoLite2-City IP geolocation database that is more accurate than the free version. |

Note: Replacing your mmdb file with one of these two files reintroduces the Timezone field that is absent in the default .mmdb file, but does not reintroduce the MetroCode field.

### Prerequisites

You must have a [role](https://docs.splunk.com/Splexicon:Role) with the upload\_mmdb\_files [capability](https://docs.splunk.com/Splexicon:Capability).

### Steps

1. Go online and find a download page for the binary .tar.gz versions of the GeoLite2-City or the GeoIP2-City database files.
2. Download the binary .tar.gz version of the file (GeoLite2-City or GeoIP2-City) that is most appropriate for your needs.
3. Expand the binary .tar.gz version of the file.The .tar.gz file expands into a folder which contains the GeoLite2-City.mmdb file, or the GeoIP2-City.mmdb file, depending on the download you selected.
4. In Splunk Web, go to Settings > Lookups > GeoIP lookups file.
5. On the GeoIP lookups file page, click Choose file. Select the .mmdb file.
6. Click Save.

The page displays a success message when the upload completes.

An .mmdb file that you upload through this method is treated as a lookup table by the Splunk software. This means it is picked up by knowledge bundle replication in distributed search environments, but that also means it can increase the size of knowledge bundles. See [Knowledge bundle replication overview](/en/?resourceId=Splunk_DistSearch_Knowledgebundlereplication) in the *Distributed Search* manual.

Note: If you upload your own .mmdb file in Splunk Web and later decide you want to revert back to the .mmdb file that was shipped with the Splunk software, go to Settings > Lookups > GeoIP lookups file and delete your uploaded file.

### Impact of upgrading Splunk software

When you upgrade your Splunk platform, the .mmdb file in the $SPLUNK\_HOME/share/ directory is replaced by the version of the file that ships with the Splunk software. You can avoid this by storing the .mmdb file in a different file path.

### Storing the .mmdb file in a different file path

To store the GeoLite2-City.mmdb or GeoIP2-City.mmdb file in a different file path you must update the path directly in the `limits.conf` file. This is not possible in Splunk Cloud Platform, only Splunk Enterprise.

Note: The Splunk Web .mmdb file upload feature takes precedence over manual updates to the .mmdb file path in limits.conf.

### Prerequisites

* Only users with file system access, such as system administrators, can specify a different file path to the .mmdb file in the `limits.conf` file.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the *Admin Manual*.
* You can have configuration files with the same name in your default, local, and app directories. Read [Where you can place (or find) your modified configuration files](/en/?resourceId=Splunk_Admin_Configurationfiledirectories) in the *Admin Manual*.

Note: Never change or copy the configuration files in the `default` directory. The files in the `default` directory must remain intact and in their original location. Make the changes in the `local` directory.

### Steps

1. Open the local limits.conf file for the Search app. For example, $SPLUNK\_HOME/etc/apps/search/local.
2. Add the `[iplocation]` stanza.
3. Add the `db_path` setting and specify the absolute path to the .mmdb file. The `db_path` setting does not support standard Splunk environment variables such as `$SPLUNK_HOME`.For example: `db_path = /Applications/Splunk/mmdb/GeoLite2-City.mmdb` specifies a new directory called mmdb.
4. Ensure a copy of the .mmdb file is stored in the ../Applications/Splunk/mmdb/ directory.
5. Because you are editing the path to the .mmdb file, you should restart the Splunk server.

### Storing the .mmdb file with a different name

Alternatively, you can add the updated .mmdb to the $SPLUNK\_HOME/share/ directory using a different name and then specify that name in the `db_path` setting. For example: db\_path = /Applications/Splunk/share/GeoLite2-City\_paid.mmdb.

### The .mmdb file and distributed deployments

The `iplocation` command is a distributable [streaming command](https://docs.splunk.com/Splexicon:Streamingcommand), which means that it can be processed on the indexers. The $SPLUNK\_HOME/share/ directory is not part of the [knowledge bundle](https://docs.splunk.com/Splexicon:Knowledgebundle). If you update the .mmdb file in the $SPLUNK\_HOME/share/ directory, the updated file is not automatically sent to the indexers in a distributed deployment. To add the .mmdb file to the indexers, use the tools that you typically use to push files to the indexers.

## Examples

### 1. Add location information to web access events

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Add location information to web access events. By default, the `iplocation` command adds the `City`, `Country`, `lat`, `lon`, and `Region` fields to the results.

sourcetype=access\_\* | iplocation clientip

### 2. Search for client errors and return the first 20 results

|  |
| --- |
| This example uses the sample data from the Search Tutorial but should work with any format of Apache web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Search for client errors in web access events, returning only the first 20 results. Add location information and return a table with the IP address, City, and Country for each client error.

sourcetype=access\_\* status>=400 | head 20 | iplocation clientip | table clientip, status, City, Country

The results appear on the Statistics tab and look something like this:

| clientip | status | City | Country |
| --- | --- | --- | --- |
| 182.236.164.11 | 408 | Zhengzhou | China |
| 198.35.1.75 | 500 | Princeton | United States |
| 198.35.1.75 | 404 | Princeton | United States |
| 198.35.1.75 | 406 | Princeton | United States |
| 198.35.1.75 | 500 | Princeton | United States |
| 221.204.246.72 | 503 | Taiyuan | China |
| 1.192.86.205 | 503 | Amesbury | United States |
| 91.205.189.15 | 406 |  |  |
| 216.221.226.11 | 505 | Redwood City | United States |
| 216.221.226.11 | 404 | Redwood City | United States |
| 195.2.240.99 | 400 |  | Russia |

### 3. Add a prefix to the fields added by the iplocation command

Prefix the fields added by the `iplocation` command with iploc\_. Add all of the fields in the .mmdb database file to the results.

sourcetype = access\_\* | iplocation prefix=iploc\_ allfields=true clientip | fields iploc\_\*

### 4. Generate a choropleth map using IP addresses

Generate a choropleth map of your data like the one below using the iplocation command. See [Use IP addresses to generate a choropleth map](/en/?resourceId=Splunk_Viz_IplocationChoropleth) in *Dashboards and Visualizations*.

![Screenshot of finished choropleth map of tutorial data client IP addresses](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/ba8af48c-8392-44fc-aa55-6afdc4d899c0?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiYThhZjQ4Yy04MzkyLTQ0ZmMtYWE1NS02YWZkYzRkODk5YzAiLCJleHAiOjE3NjEwNjAxMzgsImp0aSI6ImI2M2U0Zjc5MGY0MzRhZjRiNDU5OGQzY2MzZTY0ZjMwIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.uzOGmK_EMlhIAYi_WhCQ5PgOpyZVO-pQuoMBuBS5UCY)

### 5. Identify IPv6 address locations

The `iplocation` command supports IPv6 lookup through IP geolocation functionality. In the following example, `iplocation` looks up the specified IP address in the default geolocation database file to determine where it is located.

| makeresults
| eval myip="2001:4860:4860::8888"
| iplocation myip

Search finds the location of the IP address and displays the following results.

| City | Country | Region | \_time | lat | lon | myip |
| --- | --- | --- | --- | --- | --- | --- |
|  | United States |  | 2021-11-22 13:37:07 | 37.75100 | -97.82200 | 2001:4860:4860::8888 |

## See also

Commands

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)

Functions

[cidrmatch](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#id_21aa2cbd_914b_40ef_8293_2688f48ccaf8__Comparison_and_Conditional_functions)
