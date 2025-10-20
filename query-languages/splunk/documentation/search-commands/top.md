# top

## Description

Finds the most common values for the fields in the field list. Calculates a count and a percentage of the frequency the values occur in the events. If the <by-clause> is included, the results are grouped by the field you specify in the <by-clause>.

## Syntax

top [<N>] [<top-options>...] <field-list> [<by-clause>]

### Required arguments

<field-list>

Syntax: <field>, <field>, ...

Description: Comma-delimited list of field names.

### Optional arguments

<N>

Syntax: <int>

Description: The number of results to return.

Default: 10

<top-options>

Syntax: countfield=<string> | limit=<int> | otherstr=<string> | percentfield=<string> | showcount=<bool> | showperc=<bool> | useother=<bool>

Description: Options for the `top` command. See Top options.

<by-clause>

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

### Top options

countfield

Syntax: countfield=<string>

Description: For each value returned by the `top` command, the results also return a count of the events that have that value. This argument specifies the name of the field that contains the count. The count is returned by default. If you do not want to return the count of events, specify `showcount=false`.

Default: count

limit

Syntax: limit=<int>

Description: Specifies how many results to return. To return all values, specify zero ( 0 ). Specifying `top limit=<int>` is the same as specifying `top N`.

Default: 10

otherstr

Syntax: otherstr=<string>

Description: If `useother=true`, a row representing all other values is added to the results. Use `otherstr=<string>` to specify the name of the label for the row.

Default: OTHER

percentfield

Syntax: percentfield=<string>

Description: For each value returned by the `top` command, the results also return a percentage of the events that have that value. This argument specifies the name of the field that contains the percentage. The percentage is returned by default. If you do not want to return the percentage of events, specify `showperc=false`.

Default: percent

showcount

Syntax: showcount=<bool>

Description: Specify whether to create a field called "count" (see "countfield" option) with the count of that tuple.

Default: true

showperc

Syntax: showperc=<bool>

Description: Specify whether to create a field called "percent" (see "percentfield" option) with the relative prevalence of that tuple.

Default: true

useother

Syntax: useother=<bool>

Description: Specify whether or not to add a row that represents all values not included due to the limit cutoff.

Default: false

## Usage

The `top` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Default fields

When you use the `top` command, two fields are added to the results: `count` and `percent`.

| Field | Description |
| --- | --- |
| `count` | The number of events in your search results that contain the field values that are returned by the top command. See the `countfield` and `showcount` arguments. |
| `percent` | The percentage of events in your search results that contain the field values that are returned by the top command. See the `percentfield` and `showperc` arguments. |

### Default maximum number of results

By default the `top` command returns a maximum of 50,000 results.
This maximum is controlled by the `maxresultrows` setting in the `[top]` stanza in the [limits.conf](/en/?resourceId=Splunk_Admin_Limitsconf) file. Increasing this limit can result in more memory usage.

Note: Only users with file system access, such as system administrators, can edit the configuration files.
Never change or copy the configuration files in the `default` directory. The files in the `default` directory must remain intact and in their original location. Make the changes in the `local` directory.

See [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile).

If you have Splunk Cloud Platform, you need to file a Support ticket to change this limit.

### Lexicographic order of results

In searches that use the `limit` option with multiple sets of field lists, only the last lexicographical value of the `<field-list>` is returned in the search results. For example, in the following search, `Orlando` is the only `location` field that is returned because it's the last value when sorted lexicographically.

| makeresults
| eval location="Orlando Dallas Atlanta"
| makemv location
| mvexpand location
| eval user="Alex Kai Morgan"
| makemv user
| mvexpand user
| top limit=1 location by user

The search results look something like this.

| user | location | count | percent |
| --- | --- | --- | --- |
| Alex | Orlando | 1 | 33.333333 |
| Kai | Orlando | 1 | 33.333333 |
| Morgan | Orlando | 1 | 33.333333 |

## Examples

### Example 1: Return the 20 most common values for a field

This search returns the 20 most common values of the "referer" field. The results show the number of events (count) that have that a count of referer, and the percent that each referer is of the total number of events.

sourcetype=access\_\* | top limit=20 referer

![This screen image shows the results of the search. There are three columns in the results: referer, count, and percent.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/7c6d3338-81a8-4c67-b430-8157c2cc789e?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3YzZkMzMzOC04MWE4LTRjNjctYjQzMC04MTU3YzJjYzc4OWUiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6ImJmYjIwMDIyODhjZjRkZDlhZDIxZGZmNTM0MjNkZjI1IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.YhXq23KeuBQ6lWySeXZBZ6gPe3LbLYDzGOFVq-K2bQM)

### Example 2: Return top values for one field organized by another field

This search returns the top "action" values for each "referer\_domain".

sourcetype=access\_\* | top action by referer\_domain

Because a limit is not specified, this returns all the combinations of values for "action" and "referer\_domain" as well as the counts and percentages:

![This screen image shows the results of the search. The results display four columns: referer_domain, action, count, and percent.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/84f33b07-0a68-4848-b546-9b4f5dc6033a?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4NGYzM2IwNy0wYTY4LTQ4NDgtYjU0Ni05YjRmNWRjNjAzM2EiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6IjAzM2Y2MzRkYzc3NzQ3ZjJhNTdjNzVkZTk0MGFkYmU1IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.u_FFFXQHW32UchQF7WCxeHpBO8c_T5ZAN8hih7rU5ao)

### Example 3: Returns the top product purchased for each category

|  |
| --- |
| This example uses the sample dataset from [the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial) and a field lookup to add more information to the event data.  * Download the data set from [Add data tutorial](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions to load the tutorial data. * Download the CSV file from [Use field lookups tutorial](/en/?resourceId=Splunk_SearchTutorial_Usefieldlookups) and follow the instructions to set up the lookup definition to add price and productName to the events.   After you configure the field lookup, you can run this search using the time range, All time. |

This search returns the top product purchased for each category. Do not show the percent field. Rename the count field to "total".

sourcetype=access\_\* status=200 action=purchase | top 1 productName by categoryId showperc=f countfield=total

![This screen image shows the results of the search. The results shows three columns: categoryId, productName, and total.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/56bdf547-12b7-4276-a68d-dee23b80b202?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1NmJkZjU0Ny0xMmI3LTQyNzYtYTY4ZC1kZWUyM2I4MGIyMDIiLCJleHAiOjE3NjEwNjAyMjksImp0aSI6IjY0M2ZkZmQzMDE2NDQyZGJiNWNkMzVmODcwZmFkZWEyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.PWoiV0PXgqMQ769jrtT1Y7zF-bEdjCgORwIqHrYVemk)

## See also

[rare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rare#id_34e62677_1b02_434d_b298_c0c1e25c3eb3__rare), [sitop](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sitop#id_8943f4d7_c4fc_4d2c_8533_c1876249b69c__sitop), [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)
