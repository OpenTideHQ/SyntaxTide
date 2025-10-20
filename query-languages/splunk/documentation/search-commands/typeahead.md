# typeahead

## Description

Returns autosuggest information for a specified prefix that is used to autocomplete word candidates in searches. The maximum number of results returned is based on the value you specify for the  `count` argument.

## Syntax

The required syntax is in bold.

| typeahead

prefix=<string>

count=<int>

[collapse=<bool>]

[endtimeu=<int>]

[index=<string>]

[max\_servers=<int>]

[max\_time=<int>]

[starttimeu=<int>]

[use\_cache=<bool>]

### Required arguments

prefix

Syntax: prefix=<string>

Description: The full search string to return `typeahead` information.

count

Syntax: count=<int>

Description: The maximum number of results to return.

### Optional arguments

banned\_segments

Syntax: banned\_segments=<semicolon-separated-list>

Description: Specifies a semicolon-separated list of segments. The `typeahead` search processor filters events with these segments out of the results it returns. A best practice is to bracket each listed segment with wildcard asterisks ('\*'). For example, if you set `banned_segments = *password*;*SSN*`, Splunk software filters any event that contains the string `password` or `SSN` from the search results.

Default: no default

collapse

Syntax: collapse=<bool>

Description: Specify whether to collapse a term that is a prefix of another term when the event count is the same.

Default: true

endtimeu

Syntax: endtimeu=<int>

Description: Set the end time to N seconds, measured in UNIX time.

Default: now

index-specifier

Syntax: index=<string>

Description: Search the specified index instead of the default index.

max\_servers

Syntax: max\_servers=<int>

Description: Specify the maximum number of indexers or remote search peers to be used in addition to the search head for `typeahead` searches. If the `max_servers` argument is not specified, the default value is `2`, which means Splunk software uses two search peers in addition to any search heads.

Default: 2

max\_time

Syntax: max\_time=<int>

Description: The maximum time in seconds that the `typeahead` can run. If `max_time=0`, there is no limit.

Default: 1 second

startimeu

Syntax: starttimeu=<int>

Description: Set the start time to N seconds, measured in UNIX time.

Default: 0

use\_cache

Syntax: use\_cache = <boolean>

Description: Specifies whether the `typeahead` cache will be used if `use_cache` is not specified in the command line or endpoint. When `use_cache` is turned on, Splunk software uses cached search results when running `typeahead` searches, which may have outdated results for a few minutes after you make changes to .conf files. For more information, see [Typeahead and .conf file updates](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/typeahead#id_25836985_1387_4496_a051_8e7b9440ad0d__Typeahead_and_.conf_file_updates).

Default: true or 1

## Usage

The `typeahead` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) and should be the first command in the search. Generating commands use a leading pipe character.

The `typeahead` command can be targeted to an index and restricted by time.

When you run the `typeahead` command, Splunk software runs internal `typeahead` searches and extracts data from indexes, configurations, and search histories. This information is used to autocomplete word candidates when users type commands in the Search bar in Splunk Web. The `typeahead` command extracts data from these sources:

* Terms or tokens from the index [lexicon](https://docs.splunk.com/Splexicon:Lexicon).
* Settings in configuration files, such as props.conf and savedsearches.conf.
* The search history from previous searches in Splunk Web.

### Protect sensitive information in typeahead searches

If you have sensitive information, such as Personal Identifiable Information (PII) and Protected Health Information (PHI) data that you don't want to be visible to users when they run `typeahead` searches, you can use the `banned_segments` argument to prevent sensitive data from displaying in `typeahead` searches.

For example, to make sure that password or social security information is not visible to users, you can add a new line for the `banned_segments` setting to the `typeahead` stanza in the limits.conf file like this:

[typeahead]
banned\_segments = \*password\*;\*SSN\*;\*ssn\*

Then, when your users run `typeahead` searches, any fields containing `password`, `SSN`, or `ssn` are filtered from the search results.

### Splunk Cloud Platform

To add a `banned_segments` string that you want filtered out of `typeahead` searches, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

### Splunk Enterprise

To add a string to the `banned_segments` argument in the limits.conf file, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file at $SPLUNK\_HOME/etc/system/local.
2. In the `typeahead` stanza, set `banned_segments` to the string that you want filtered out as the prefix in `typeahead` searches.

### The impact of typeahead on search results

The `typeahead` command returns the most common terms found in indexed data with the given prefix. If you use the `typeahead` command with the default settings, the command may not return all search results or the correct search results in the following cases:

* The time to complete the search takes longer than the value specified by the `max_time` argument, which is 1 second, by default.
* Data is indexed on a server that is not randomly chosen, resulting in the exclusion of its data from the search results. This can happen when the value of `max_server` is less than the number of indexers, for example, if `max_server` is set to the default, which is `2`, but there are actually 3 indexers.

In addition, the `typeahead` command may not return all of the search results if the `count` argument is set lower than the actual number of results. For example, if the `count` argument is set to `10`, the `typeahead` command returns only the top 10 results, even though more results could actually be returned.

### Set the number of additional search peers used in a typeahead job

The `max_servers` argument is designed to minimize the workload impact of running `typeahead` search jobs in an indexer clustering environment. For load balancing, the selection of additional search peers for typeahead is random.

A setting of `0` removes all limits, causing all available search peers to be used for typeahead search jobs.

The default for the `max_servers` argument is controlled by the `max_servers` setting in `limits.conf`.

### Typeahead and .conf file updates

The `typeahead` command uses a cache to run fast searches at the expense of accurate results. As a result, sometimes what is in the cache and shows up in `typeahead` search results may not reflect recent changes to .conf files. This is because it takes 5 or 10 minutes for the cached data to clear, depending on the performance of the server. For example, if you rename a `sourcetype` in the `props.conf` file, it may take a few minutes for that change to display in `typeahead` search results. A `typeahead` search that is run while the cache is being cleared returns the cached data, which is expected behavior.

If you make a change to a .conf file, you can wait a few minutes for the cache to clear to get the most accurate and up-to-date results from your `typeahead` search. Alternatively, you can turn off the `use_cache` argument to clear the cache immediately, which fetches more accurate results, but is a little slower. After you manually clear the cache, you should see the changes to your .conf file reflected in your results when you rerun the `typeahead` search.

For more information, see [Rename source types](/en/?resourceId=Splunk_Data_Renamesourcetypes) in the Splunk Cloud Platform *Getting Data In* manual.

### Typeahead and tsidx bucket reduction

`typeahead` searches over indexes that have undergone tsidx bucket reduction will return incorrect results.

For more information see [Reduce tsidx disk usage](/en/?resourceId=Splunk_Indexer_Reducetsidxdiskusage) in *Managing indexers and clusters of indexers*.

## Examples

### Example 1: Return typeahead information for source

When you run a `typeahead` search, Splunk software extracts information about field definitions from indexes, configurations, and search histories, and displays the relevant information for the specified prefix. For example, say you run the following search for the `source` prefix against the main index:

| typeahead index=main prefix="source" count=3

The `typeahead` command searches the index and shows you what is visible to your users as autocomplete suggestions when they start to type `source` in their searches in Splunk Web. The results look something like this:

| content | count | operator |
| --- | --- | --- |
| source="access\_30DAY.log" | 131645 | false |
| source="data.csv" | 4 | false |
| source="db\_audit\_30DAY.csv" | 44096 | false |

### Example 2: Return typeahead information for saved searches

You can also run `typeahead` on [saved searches](https://docs.splunk.com/Splexicon:Savedsearch). For example, say you run this search:

|typeahead prefix="savedsearch=" count=3

The results look something like this, which tells you what your users see as autocomplete suggestions when they start to type `savedsearch` in the Search bar in Splunk Web.

| content | count | operator |
| --- | --- | --- |
| savedsearch="403\_by\_clientip" | 26 | true |
| savedsearch="Errors in the last 24 hours" | 5 | true |
| savedsearch="Errors in the last hour" | 2 | true |

### Example 3: Return typeahead information for sourcetypes in the \_internal index

When you run the following `typeahead` search, Splunk software returns typeahead information for sourcetypes in the \_internal index.

| typeahead prefix=sourcetype count=5 index=\_internal

The results look something like this.

| content | count | operator |
| --- | --- | --- |
| sourcetype | 373993 | false |
| sourcetype="mongod" | 711 | false |
| sourcetype="scheduler" | 2508 | false |
| sourcetype="splunk\_btool" | 3 | false |
| sourcetype="splunk\_intro\_disk\_objects" | 5 | false |
