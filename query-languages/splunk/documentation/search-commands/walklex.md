# walklex

## Description

Generates a list of terms or indexed fields from each bucket of event indexes.

![Webinar Icon.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/8bb7bcf2-01ab-4049-8fdb-9eb0b783a5ac?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI4YmI3YmNmMi0wMWFiLTQwNDktOGZkYi05ZWIwYjc4M2E1YWMiLCJleHAiOjE3NjEwNjAyNDMsImp0aSI6Ijg4N2QyYzYxYzAxZDQwZDc4YmVlY2ZkYmE3NTYzYzhjIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.SwCLQ3awfwG15ckuwf4U9N4M2ALTwYlyc5R5EII3_zo) Watch this Splunk How-To video, [Using the Walklex Command](https://www.youtube.com/watch?v=ZifLQmXgZVQ), to see a demonstration about how to use this command.

Note: Due to the variable nature of `merged_lexicon.lex` and `.tsidx` files, the `walklex` command does not always return consistent results.The `walklex` command doesn't work on hot buckets. This command only works on warm or cold buckets, after the buckets have a merged lexicon file or single time-series index (tsidx) file. If neither of these files exist, a message is returned, as expected. This message doesn't indicate that there is a problem with the health of your environment.

## Syntax

The required syntax is in bold.

| walklex

[ type=<walklex-type> ]

[ prefix=<string> | pattern=<wc-string> ]

<index-list>

[ splunk\_server=<wc-string> ]

[ splunk\_server\_group=<wc-string> ]...

### Required arguments

<index-list>

Syntax: index=<index-name> index=<index-name> ...

Description: Limits the search to one or more indexes. For example, `index=_internal`.

### Optional arguments

prefix | pattern

Syntax: prefix=<string> | pattern=<wc-string>

Description: Limits results to terms that match a specific pattern or prefix. Either prefix or pattern can be specified but not both. Includes only buckets with a merged\_lexicon file or a single tsidx file. This means that hot buckets are generally not included.

Default: pattern=\*

splunk\_server

Syntax: splunk\_server=<wc-string>

Description: Specifies the distributed search peers from which to return results.

* If you are using Splunk Cloud Platform, omit this parameter.
* If you are using Splunk Enterprise, you can specify only one `splunk_server` argument. However, you can use a wildcard when you specify the server name to indicate multiple servers. For example, you can specify `splunk_server=peer01` or `splunk_server=peer*`. Use `local` to refer to the search head.

Default: All configured search peers return information

splunk\_server\_group

Syntax: splunk\_server\_group=<wc-string>

Description: Limits the results to one or more server groups. You can specify a wildcard character in the string to indicate multiple server groups with similar names.

* If you are using Splunk Cloud Platform, omit this parameter.

Default: None

type

Syntax: type = ( all | field | fieldvalue | term )

Description: Specifies which type of terms to return in the [lexicon](https://docs.splunk.com/Splexicon:Lexicon). See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/walklex#id_514c3431_0af3_45aa_a1ac_e52a0542f286__Usage) for more information about using the `type` argument options.

* Use `field` to return only the unique field names in each index bucket.
* Use `fieldvalue` to include only indexed field terms.
* Use `term` to exclude all indexed field terms of the form `<field>::<value>`.

Default: all

## Usage

The `walklex` command is a [generating command](https://docs.splunk.com/Splexicon:Generatingcommand), which use a leading pipe character. The `walklex` command must be the first command in a search. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

When the Splunk software indexes event data, it segments each event into raw tokens using rules specified in `segmenters.conf` file. You might end up with raw tokens that are actually key-value pairs separated by an arbitrary delimiter such as an equal ( = ) symbol.

The following search uses the `walklex` and `where` commands to find the raw tokens in your index. It uses the `stats` command to count the raw tokens.

| walklex index=<target-index> | where NOT like(term, "%::%") | stats sum(count) by term

### Return only indexed field names

Specify the `type=field` argument to have `walklex` return only the field names from indexed fields.

The indexed fields returned by `walklex` can include default fields such as `host`, `source`, `sourcetype`, the `date_*` fields, `punct`, and so on. It can also include additional indexed fields configured as such in `props.conf` and `transforms.conf` and created with the `INDEXED_EXTRACTIONS` setting or other `WRITE_META` methods. The discovery of this last set of additional indexed fields is likely to help you with accelerating your searches.

### Return the set of terms that are indexed fields with indexed values

Specify `type=fieldvalue` argument to have `walklex` return the set of terms from the index that are indexed fields with indexed values.

The `type=fieldvalue` argument returns the list terms from the index that are indexed fields with indexed values. Unlike the `type=field` argument, where the values returned are only the field names themselves, the `type=fieldvalue` argument returns indexed field names that have any field value.

For example, if the indexed field term is `runtime::0.04`, the value returned by the `type=fieldvalue` argument is `runtime::0.04`. The value returned by the `type=field` argument is `runtime`.

### Return all TSIDX keywords that are not part of an indexed field structure

Specify `type=term` to have `walklex` return the keywords from the TSIDX files that are not part of any indexed field structure. In other words, it excludes all indexed field terms of the form `<field>::<value>`.

### Return terms of all three types

When you do not specify a type, or when you specify `type=all`, `walklex` uses the default `type=all` argument. This causes `walklex` to return the terms in the index of all three types: `field`, `fieldvalue`, and `term`.

Note: When you use `type=all`, the indexed fields are not called out as explicitly as the fields are with the `type=field` argument. You need to split the term field on `::` to obtain the field values from the indexed term.

### Support for hot buckets

Because the `walklex` command doesn't work on hot buckets, recently loaded data displays in search results only after buckets have rolled over from hot to warm. You can either wait for buckets of an index to roll over from hot to warm on their own, or you can restart Splunk platform or manually roll the buckets over to warm. See [Rolling buckets manually from hot to warm](/?resourceId=Splunk_Indexer_Backupindexeddata).

### Restrictions

The `walklex` command applies only to event indexes. It cannot be used with metrics indexes.

People who have [search filters](https://docs.splunk.com/Splexicon:Searchfilter) applied to one or more of their [roles](https://docs.splunk.com/Splexicon:Role) cannot use `walklex` unless they also have a role with either the run\_walklex capability or the admin\_all\_objects capability. For more information about role-based search filters, see [Create and manage roles with Splunk Web](/?resourceId=Splunk_Security_Addandeditroles) in *Securing the Splunk Platform*. For more information about role-based capabilities, see [Define roles on the Splunk platform with capabilities](/?resourceId=Splunk_Security_Rolesandcapabilities), in *Securing the Splunk Platform*.

## Basic examples

### 1. Return the total count for each term in a specific bucket

The following example returns all of the terms in each bucket of the `_internal` index and finds the total count for each term.

| walklex index=\_internal | stats sum(count) BY term

### 2. Specifying multiple indexes

The following example returns all of the terms that start with `foo` in each bucket of the `_internal` and `_audit` indexes.

| walklex prefix=foo index=\_internal index=\_audit

### 3. Use a pattern to locate indexed field terms

The following example returns all of the indexed field terms for each bucket that end with `bar` in the `_internal` index.

| walklex pattern=\*bar type=fieldvalue index=\_internal

### 4. Return all field names of indexed fields

The following example returns all of the field names of indexed fields in each bucket of the `_audit` index.

| walklex type=field index=\_audit

## See also

Commands

[metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata)

[tstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#e6057acd_1ed5_49ec_9881_ecdd6240a953__tstats)
