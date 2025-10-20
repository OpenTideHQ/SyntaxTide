# outputlookup

## Description

Writes search results to a static lookup table, or KV store collection, that you specify.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold.

| outputlookup

[append=<bool>]

[create\_empty=<bool>]

[override\_if\_empty=<bool>]

[max=<int>]

[key\_field=<field>]

[allow\_updates=<bool>]

[createinapp=<bool>]

[create\_context=<string>]

[output\_format=<string>]

<filename> | <tablename>

### Required arguments

You must specify one of the following required arguments, either `filename` or `tablename`.

filename

Syntax: <string>

Description: The name of the lookup file. The file must end with `.csv` or `.csv.gz`.

tablename

Syntax: <string>

Description: The name of the lookup table as specified by a stanza name in `transforms.conf`, which corresponds to the lookup definition. The lookup table can be configured for any lookup type (CSV, external, or KV store).

If your lookup file and the lookup definition that it is associated with have the same name, you can provide a `tablename` that is the same value as the corresponding `filename` without the .csv extension. For example, say you have a lookup file named staff.csv. If you associate that file with a lookup called `staff`, you can use either staff.csv or `staff` as the `tablename` with the `outputlookup` command. See [Create a CSV lookup definition](/en/?resourceId=Splunk_Knowledge_Usefieldlookupstoaddinformationtoyourevents) in the Splunk Enterprise *Knowledge Manager Manual*.

### Optional arguments

allow\_updates

Syntax: allow\_updates=<bool>

Description: The `allow_updates` argument is set to `true` by default if either the `append` argument is set to `true` or if the `key_field` argument is set to a valid field name. If `allow_updates` is set to `true`, the `outputlookup` command updates existing records and inserts new records. If `allow_updates` is set to `false`, the `outputlookup` only inserts records.

append

Syntax: append=<bool>

Description: The default setting, `append=false`, writes the search results to the `.csv` file or KV store collection. Fields that are not in the current search results are removed from the file. If `append=true`, the `outputlookup` command attempts to append search results to an existing `.csv` file or KV store collection. Otherwise, it creates a file. If there is an existing .csv file, the `outputlookup` command writes only the fields that are present in the previously existing `.csv` file. An `outputlookup` search that is run with `append=true` might result in a situation where the lookup table or collection is only partially updated. This means that a subsequent `lookup` or `inputlookup` search on that lookup table or collection might return stale data along with new data. The `outputlookup` command cannot append to `.gz` files.

Default: false

create\_context

Syntax: create\_context= app | user | system

Description: Specifies where the lookup table file is created. Ignored in favor of the `createinapp` argument if both arguments are used in the search. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputlookup#id_8dfbccc7_556e_457b_8b53_6e5928787e53__Usage) for details.

Default: app

create\_empty

Syntax: create\_empty=<bool>

Description: If set to `true` and there are no results, a zero-length file is created. When set to `false` and there are no results, no file is created. If the file previously existed, the file is deleted.

For example, suppose there is a system-level lookup called "test" with the lookup defined in "test.csv". There is also an app-level lookup with the same name. If an app overrides that "test.csv" in it's own app directory with an empty file `create_empty=true`, the app-level lookup behaves as if the lookup is empty. However, if there's no file at all `create_empty=false` at the app level, then the lookup file in the system-level is used.

Default: false

createinapp

Syntax: createinapp=<bool>

Description: Specifies whether the lookup table file is created in the system directory or the lookups directory for the current app context. Overrides the `create_context` argument if both arguments are used in the search. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputlookup#id_8dfbccc7_556e_457b_8b53_6e5928787e53__Usage) for details.

Default: true

key\_field

Syntax: key\_field=<field>

Description: For KV store-based lookups, uses the specified field name as the key to a value and replaces that value. An `outputlookup` search using the `key_field` argument might result in a situation where the lookup table or collection is only partially updated. A subsequent `lookup` or `inputlookup` search on that collection might return stale data along with new data. A partial update only occurs with concurrent searches, one with the `outputlookup` command and a search with the `inputlookup` command. It is possible that the `inputlookup` occurs when the `outputlookup` is still updating some of the records.

When `key_field` is used in an `outputlookup` search, by default, `append` is set to `true`, which appends search results to an existing KV store collection. You can override this default behavior by directly setting `key_field` with `append` set to `false`.

max

Syntax: max=<int>

Description: Specifies whether there is a limit to the number of rows to output to a CSV file or a KV store collection. For example, to write 50,000 rows to a CSV file or KV store collection, set `max=50000` in your `outputlookup` search.

Default: no limit

output\_format

Syntax: output\_format=splunk\_sv\_csv | splunk\_mv\_csv

Description: Controls the output data format of the lookup. Use `output_format=splunk_mv_csv` when you want to output multivalued fields to a lookup table file, and then read the fields back into Splunk using the `inputlookup` command. The default, `splunk_sv_csv` outputs a CSV file which excludes the `_mv_<fieldname>` fields.

Default: splunk\_sv\_csv

override\_if\_empty

Syntax: override\_if\_empty=<bool>

Description: If `override_if_empty=true` and no results are passed to the output file, the existing output file is deleted, If `override_if_empty=false` and no results are passed to the output file, the command does not delete the existing output file.

Default: true

## Usage

The lookup table must be a CSV or GZ file, or a table name specified with a lookup table configuration in `transforms.conf`. The lookup table can refer to a KV store collection or a CSV lookup. The `outputlookup` command cannot be used with external lookups.

If you specify a lookup table file name with the `.gz` extension, the file that's created is compressed.

### Determine where the lookup table file is created

For CSV lookups, `outputlookup` creates a lookup table file for the results of the search. There are three locations where `outputlookup` can put the file it creates:

* The system lookups directory: `$SPLUNK_HOME/etc/system/local/lookups`
* The lookups directory for the current app context: `$SPLUNK_HOME/etc/apps/<app>/lookups`
* The app-based lookups directory for the user running the search: `etc/users/<user>/<app>/lookups`

You can use the `createinapp` or `create_context` arguments to determine where `outputlookup` creates the lookup table for a given search. If you try to use both of these arguments in the same search, `createinapp` argument overrides the `create_context` argument.

If you do not use either argument in your search, the `create_context` setting in `limits.conf` determines where `outputlookup` creates the lookup table file. This setting defaults to `app` if there is an app context when you run the search, or to `system`, if there is not an app context when you run the search.

To have `outputlookup` create the lookup table file in the system lookups directory, set `createinapp=false` or set `create_context=system`. Alternatively, if you do not have an app context when you run the search, leave both arguments out of the search and rely on the `limits.conf` version of `create_context` to put the lookup table file in the system directory. This last approach only works if the `create_context` setting in `limits.conf` has not been set to `user`.

To have `outputlookup` create the lookup table file in the lookups directory for the current app context, set `createinapp=true` or set `create_context=app`. Alternatively, if you do have an app context when you run the search, leave both arguments out of the search and rely on the `limits.conf` version of `create_context` to put the lookup table file in the app directory. This last approach only works if the `create_context` setting in `limits.conf` has not been set to `user`.

To have `outputlookup` create the lookup table file in the lookups directory for the user running the search, set `create_context=user`. Alternatively, if you want all `outputlookup` searches to create lookup table files in user lookup directories by default, you can set `create_context=user` in `limits.conf`. The `createinapp` and `create_context` arguments can override this setting if they are used in the search.

Note: If the lookup table file already exists in the location to which it is written, the existing version of the file is overwritten with the results of the `outputlookup` search.

### Restrict write access to lookup table files with check\_permission

For permissions in CSV lookups, use the `check_permission` field in `transforms.conf` and `outputlookup_check_permission` in `limits.conf` to restrict write access to users with the appropriate permissions when using the `outputlookup` command. Both `check_permission` and `outputlookup_check_permission` default to false. Set to true for Splunk software to verify permission settings for lookups for users. You can change lookup table file permissions in the `.meta` file for each lookup file, or Settings > Lookups > Lookup table files. By default, only users who have the admin or power role can write to a shared CSV lookup file.

For more information about creating lookups, see [About lookups](/en/?resourceId=Splunk_Knowledge_Aboutlookupsandfieldactions) in the *Knowledge Manager Manual*.

For more information about App Key Value Store collections, see [About KV store](/en/?resourceId=Splunk_Admin_AboutKVstore) in the *Admin Manual*.

### Append results

Suppose you have an existing CSV file that contains fields A, D, and J. The results of your search are fields A, C, and J. If you run a search with `outputlookup append=false`, then fields A, C, and J are written to the CSV file. Field D is not retained.

If you run a search with `outputlookup append=true`, then only the fields that are currently in the file are preserved. In this example, fields A and J are written to the CSV file. Field C is lost because it does not already exist in the CSV file. Field D is retained.

You can work around this issue by using the `eval` command to add a field to your CSV file before you run the search. For example, if your CSV file is named users, you would do something like this:

| inputlookup users | eval c=null | outputlookup users append=false ....

Then run your search and pipe the results to the `fields` command for the fields in the file that you want to preserve.

... | fields A C J | outputlookup append=true users

### Multivalued fields

When you output to a static lookup table, the `outputlookup` command merges values in a multivalued field into single space-delimited value. This does not apply to a KV store collection.

## Examples

### 1. Write to a lookup table using settings in the transforms.conf file

Write to `usertogroup` lookup table as specified in the `transforms.conf` file.

| outputlookup usertogroup

### 2. Write to a lookup file in a specific system or app directory

Write to `users.csv` lookup file under `$SPLUNK_HOME/etc/system/lookups` or `$SPLUNK_HOME/etc/apps/*/lookups`.

| outputlookup users.csv

### 3. Specify not to override the lookup file if no results are returned

Write to `users.csv` lookup file, if results are returned, under `$SPLUNK_HOME/etc/system/lookups` or `$SPLUNK_HOME/etc/apps/*/lookups`. Do not delete the `users.csv` file if no results are returned.

| outputlookup users.csv override\_if\_empty=false

### 4. Write to a KV store collection

Write food inspection events for Shalimar Restaurant to a KV store collection called `kvstorecoll`. This collection is referenced in a lookup table called `kvstorecoll_lookup`.

index=sf\_food\_health sourcetype=sf\_food\_inspections name="SHALIMAR RESTAURANT" | outputlookup kvstorecoll\_lookup

### 5. Overwrite KV store collections

By default, `append` is set to `true` when the `key_field` is used with the `outputlookup` command. If you don't want to append search results to an existing KV store collection, you can override the default behavior by directly setting `key_field` with `append=false`.

For example, in the following `outputlookup` search, the KV store called `accounts` is appended. This is because `key_field` sets `append=true` by default.

| makeresults
| eval key=1
| outputlookup key\_field=key accounts

However, in the following `outputlookup` search, the KV store called `accounts` is overwritten because `append=false`. In this case, the `append` subsearch runs before the main search, which empties the entire KV store before the fields are written to `accounts`.

| makeresults
| eval key=1
| outputlookup append=false key\_field=key accounts

Alternatively, if you want your entire lookup to reflect your search results and you don't mind using the default system-generated keys, eliminate `key_field=key` from your `outputlookup` search, like this.

| makeresults
| eval key=1
| outputlookup accounts

### 6. Write from a CSV file to a KV store collection

Write the contents of a CSV file to the KV store collection `kvstorecoll` using the lookup table `kvstorecoll_lookup`. This requires usage of both `inputlookup` and `outputlookup` commands.

| inputlookup customers.csv | outputlookup kvstorecoll\_lookup

### 7. Update field values for a single KV store collection record

Update field values for a single KV store collection record. This requires you to use the `inputlookup`, `outputlookup`, and `eval` commands. The record is indicated by the value of its internal key ID (the `_key` field) and is updated with a new customer name and customer city. The record belongs to the KV store collection `kvstorecoll`, which is accessed through the lookup table `kvstorecoll_lookup`.

| inputlookup kvstorecoll\_lookup | search \_key=544948df3ec32d7a4c1d9755 | eval CustName="Vanya Patel" | eval CustCity="Springfield" | outputlookup kvstorecoll\_lookup append=True key\_field=\_key

To learn how to obtain the internal key ID values of the records in a KV store collection, see Example 5 for the `inputlookup` command.

## See also

Commands

[collect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/collect#id_6d5f670f_867e_4ddd_a25f_51b6a07d19dc__collect)

[inputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputlookup#d34e0d7d_f9ab_409b_9722_45400f8f891a__inputlookup)

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

[inputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_452fa3a9_a932_4597_a452_aec4c5be1d3e__inputcsv)

[mcollect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mcollect#d4305f7c_99a4_4080_b240_b325a2f369f0__mcollect)

[meventcollect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/meventcollect#id_821ce9c1_7842_4262_9eb6_2be5145ed1f7__meventcollect)

[outputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputcsv#id_257cd05f_fbb8_4239_bd87_75b0664f42fc__outputcsv)

[outputtext](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outputtext#f4c027ba_aa20_4c91_a3d0_95c3ee3d1f08__outputtext)
