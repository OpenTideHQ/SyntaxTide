# mvcombine

## Description

Takes a group of events that are identical except for the specified field, which contains a single value, and combines those events into a single event. The specified field becomes a multivalue field that contains all of the single values from the combined events.

Note: The `mvcombine` command does not apply to internal fields.

See [Use default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields) in the *Knowledge Manager Manual*.

## Syntax

mvcombine [delim=<string>] <field>

### Required arguments

field

Syntax: <field>

Description: The name of a field to merge on, generating a multivalue field.

### Optional arguments

delim

Syntax: delim=<string>

Description: Defines the string to use as the delimiter for the values that get combined into the multivalue field. For example, if the values of your field are "1", "2", and "3", and `delim` is a semi-colon ( ; ), then the combined multivalue field is `"1";"2";"3"`.

Default: a single space, (" ")

Note: To see the output of the `delim` argument, you must use the `nomv` command immediately after the `mvcombine` command. See [Usage](/en/?resourceId=Splunk_SearchReference_Mvcombine)

## Usage

The `mvcombine` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

You can use [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) and [statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions) on multivalue fields or to return multivalue fields.

The `mvcombine` command accepts a set of input results and finds groups of results where all field values are identical, except the specified field. All of these results are merged into a single result, where the specified field is now a multivalue field.

Because raw events have many fields that vary, this command is most useful after you reduce the set of available fields by using the `fields` command. The command is also useful for manipulating the results of certain transforming commands, like `stats` or `timechart`.

### Specifying delimiters

The `mvcombine` command creates a multivalue version of the field you specify, as well as a single value version of the field. The multivalue version is displayed by default.

The single value version of the field is a flat string that is separated by a space or by the delimiter that you specify with the `delim` argument.

By default the multivalue version of the field is displayed in the results. To display the single value version with the delimiters, add the `| nomv` command to the end of your search. For example `...| mvcombine delim= "," host | nomv host`.

Some modes of search result investigation prefer this single value representation, such as exporting to CSV in the UI, or running a command line search with `splunk search "..." -output csv`. Some commands that are not `multivalue` aware might use this single value as well.

Most ways of accessing the search results prefer the multivalue representation, such as viewing the results in the UI, or exporting to JSON, requesting JSON from the command line search with `splunk search "..." -output json` or requesting JSON or XML from the REST API. For these forms of, the selected delim has no effect.

### Other ways of turning multivalue fields into single-value fields

If your primary goal is to convert a multivalue field into a single-value field, `mvcombine` is probably not your best option. `mvcombine` is mainly meant for the creation of new multivalue fields. Instead, try either the `nomv` command or the `mvjoin` `eval` function.

| Conversion option | Description | For more information |
| --- | --- | --- |
| `nomv` command | Use for simple multivalue field to single-value field conversions. Provide the name of a multivalue field in your search results and `nomv` will convert each instance of the field into a single-value field. | [nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv) |
| `mvjoin``eval` function | Use when you want to perform multivalue field to single-value field conversion where the former multivalues are separated by a delimiter that you supply. For example, you start with a multivalue field that contains the values `1`, `2`, `3`,`4`, `5`. You can use `mvjoin` to transform your multivalue field into a single-valued field with `OR` as the delimiter. The new single value of the field is `1 OR 2 OR 3 OR 4 OR 5`. | [Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions) |

## Examples

### 1. Creating a multivalue field

|  |
| --- |
| This example uses the sample dataset from [the Search Tutorial](/en/?resourceId=Splunk_SearchTutorial_WelcometotheSearchTutorial). To try this example yourself, download the data set from [Get the tutorial data into Splunk](/en/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk) and follow the instructions in the Search Tutorial to upload the data. |

To understand how mvcombine works, let's explore the data.

1. Set the time range to All time.
2. Run the following search.

   index=\* | stats max(bytes) AS max, min(bytes) AS min BY host

   The results show that the max and min fields have duplicate entries for the hosts that start with `www`. The other hosts show no results for the max and min fields.

   ![7.0.0 Searchref mvcombine ex1-compressor.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8853b8b1-3923-4bf8-9384-1dcc9ab3110a?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4ODUzYjhiMS0zOTIzLTRiZjgtOTM4NC0xZGNjOWFiMzExMGEiLCJleHAiOjE3NjEwNjAxNjYsImp0aSI6IjYwM2I3NmQ0YmJmZjQ5OTM4NzQ4OTNmMGY0MjhkM2NjIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.gDaBlFPX7o7YCScKmEzG1cPOh85E7Jl8EZG12_8l7Bs)
3. To remove the other hosts from your results, modify the search to add `host=www*` to the search criteria.

   index=\* host=www\* | stats max(bytes) AS max, min(bytes) AS min BY host

   Because the values in the `max` and `min` columns contain the exact same values, you can use the `mvcombine` to combine the host values into a multivalue result.
4. Add `| mvcombine host` to your search and run the search again.

   index=\* host=www\* | stats max(bytes) AS max, min(bytes) AS min BY host | mvcombine host

   Instead of three rows, one row is returned. The host field is now a multvalue field.

   ![7.0.0 Searchref mvcombine ex1-2-compressor.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/167a3b6f-979d-48c8-962b-ad24d46695ac?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiIxNjdhM2I2Zi05NzlkLTQ4YzgtOTYyYi1hZDI0ZDQ2Njk1YWMiLCJleHAiOjE3NjEwNjAxNjYsImp0aSI6IjlmMzEzNTQ2NzFjMjRmZGI5YTE4NWFiZjVmYzc1YWZmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.mTGOr7kkuX_OO69nZbJ3RGQmlDdcgYukCue0FwXgxns)

### 2. Returning the delimited values

As mentioned in the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_63e32f51_26e5_4829_9e2c_70f7ce721a80__Usage) section, by default the delimited version of the results are not returned in the output. To return the results with the delimiters, you must return the single value string version of the field.

Add the `nomv` command to your search. For example:

index=\* host=www\* | stats max(bytes) AS max, min(bytes) AS min BY host | mvcombine delim="," host | nomv host

The search results that are returned are shown in the following table.

| host | max | min |
| --- | --- | --- |
| www1,www2,www3 | 4000 | 200 |

To return the results with a space after each comma, specify `delim=", "`.

### Example 3:

In multivalue events:

sourcetype="WMI:WinEventLog:Security" | fields EventCode, Category,RecordNumber | mvcombine delim="," RecordNumber | nomv RecordNumber

### Example 4:

Combine the values of "foo" with a colon delimiter.

... | mvcombine delim=":" foo

## See also

Commands:

[makemv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makemv#fe8c2a8f_f15f_4663_b420_fd9634997d7d__makemv)[mvexpand](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvexpand#abbcfd3b_7a2a_40a1_a15f_29efd5660135__mvexpand)[nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv)

Functions:

[Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)[Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions)[split](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)
