# erex

## Description

Use the `erex` command to extract data from a field when you do not know the regular expression to use. The command automatically extracts field values that are similar to the example values you specify.

The values extracted from the `fromfield` argument are saved to the `field`. The search also returns a regular expression that you can then use with the [rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex) command to extract the field.

## Syntax

The required syntax is in bold.

erex

[<field>]

examples=<string>

[counterexamples=<string>]

[fromfield=<field>]

[maxtrainers=<integer>]

### Required arguments

examples

Syntax: examples=<string>,<string>...

Description: A comma-separated list of example values for the information to extract and save into a new field. Use quotation marks around the list if the list contains spaces. For example: `"port 3351, port 3768"`.

field

Syntax: <string>

Description: A name for a new field that will take the values extracted from the `fromfield` argument. The resulting regular expression is generated and placed as a message under the Jobs menu in Splunk Web. That regular expression can then be used with the `rex` command for more efficient extraction.

### Optional arguments

counterexamples

Syntax: counterexamples=<string>,<string>,...

Description: A comma-separated list of example values that represent information not to be extracted.

fromfield

Syntax: fromfield=<field>

Description: The name of the existing field to extract the information from and save into a new field.

Default:
`_raw`

maxtrainers

Syntax: maxtrainers=<int>

Description: The maximum number values to learn from. Must be between 1 and 1000.

Default: 100

## Usage

The values specified in the `examples` and `counterexample` arguments must exist in the events that are piped into the `erex` command. If the values do not exist, the command fails.

To make sure that the `erex` command works against your events, first run the search that returns the events you want without the `erex` command. Then copy the field values that you want to extract and use those for the `example` values with the Click the Job menu to see the generated regular expression based on your examples.

After you run a search or open a report in Splunk Web, the `erex` command returns informational log messages that are displayed in the search jobs manager window. However, these messages aren't displayed if the `infocsv_log_level` setting is set to `WARN` or `ERROR`. If you do not see the informational log messages when you click Jobs from the Activity menu, make sure that `infocsv_log_level` is set to the default, which is `INFO`.

Splunk Cloud Platform

To change the `infocsv_log_level` setting, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the the `infocsv_log_level` setting in the limits.conf file, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file at $SPLUNK\_HOME/etc/system/local.
2. Under the [search\_info] stanza, change the value for the `infocsv_log_level` setting.

### View the regular expression

You can see the regular expression that is generated based on the `erex` command by clicking the `Job` menu in Splunk Web. See [Example 3](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/erex#a8ff9dae_9709_479c_b833_8b614b096dd0__erex).

The output of the `erex` command is captured in the `search.log` file. You can see the output by searching for "Successfully learned regex". The `search.log` file is located in the `$SPLUNK_HOME/var/run/splunk/dispatch/` directory. The search logs are not indexed by default. See [Dispatch directory and search artifacts](/en/?resourceId=Splunk_Search_Dispatchdirectoryandsearchartifacts) in the *Search Manual*.

## Examples

### 1. Extract values based on an example

The following search extracts out month and day values like `7/01` and puts the values into the `monthday` attribute.

... | erex monthday examples="7/01"

### 2. Extract values based on examples and counter examples

The following search extracts out month and day values like `7/01` and `7/02`, but not patterns like `99/2`. The extracted values are put into the `monthday` attribute.

... | erex monthday examples="7/01, 07/02" counterexamples="99/2"

### 3. Extract values based on examples and return the most common values

|  |
| --- |
| This example uses the sample data from the Search Tutorial. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the time range All time when you run the search. |

Determine which are the most common ports used by potential attackers.

1. Run a search to find examples of the port values, where there was a failed login attempt.

   sourcetype=secure\* port "failed password"

   ![This screen image shows the results of the search. The terms "Failed password and "port" are highlighted in the results.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/bd8d374b-deca-46d0-a429-6f856d2e9aa0?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiZDhkMzc0Yi1kZWNhLTQ2ZDAtYTQyOS02Zjg1NmQyZTlhYTAiLCJleHAiOjE3NjEwNjAxMDAsImp0aSI6IjQyYTdkYjYyNjhhYzRmMzQ4MWFkZTE5MWNhMDJlM2VlIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.A1WmT_tWCxe75kqUU5EFKJuvm4IauOPW-KPSYTKsm-c)
2. Then use the `erex` command to extract the port field. You must specify several examples with the `erex` command. Use the `top` command to return the most common port values. By default the `top` command returns the top 10 values.

   sourcetype=secure\* port "failed password" | erex port examples="port 3351, port 3768" | top port

   This search returns a table with the count of top ports that match the search.The results appear on the Statistics tab and look something like this:

   | port | count | percent |
   | --- | --- | --- |
   | port 2444 | 20 | 0.060145 |
   | port 3281 | 19 | 0.057138 |
   | port 2842 | 19 | 0.057138 |
   | port 2760 | 19 | 0.057138 |
   | port 1174 | 19 | 0.057138 |
   | port 4955 | 18 | 0.054130 |
   | port 1613 | 18 | 0.054130 |
   | port 1059 | 18 | 0.054130 |
   | port 4542 | 17 | 0.051123 |
   | port 4519 | 17 | 0.051123 |
3. Click the Job menu to see the generated regular expression based on your examples. You can use the `rex` command with the regular expression instead of using the `erex` command. The regular expression for this search example is `| rex (?i)^(?:[^\.]*\.){3}\d+\s+(?P<port>\w+\s+\d+)` for this search example.![rex" followed by the regular expression.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8d697f86-3b4b-48d2-8295-22dcd20c5e35?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4ZDY5N2Y4Ni0zYjRiLTQ4ZDItODI5NS0yMmRjZDIwYzVlMzUiLCJleHAiOjE3NjEwNjAxMDAsImp0aSI6IjIxNzk3OTNkMTJjZTRlMzE5YWU2MTMyYTdiNmZlZGQ0IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.uZq8683Uauvkjm4kP_izEauj51ioiEOYxWVQppElROc)You can replace the `erex` command with the `rex` command and generated regular expression in your search. For example:

   sourcetype=secure\* port "failed password" | rex (?i)^(?:[^\.]\*\.){3}\d+\s+(?P<port>\w+\s+\d+) | top port

   Using the `rex` command with a regular expression is more cost effective than using the `erex` command.

## See also

Commands

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract)

[kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform)

[multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv)

[regex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/regex#id_1e8bb767_f5bf_4585_aa2d_da477342a282__regex)

[rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex)

[xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv)
