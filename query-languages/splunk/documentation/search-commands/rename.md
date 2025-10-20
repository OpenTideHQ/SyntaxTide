# rename

## Description

Use the `rename` command to rename one or more fields. This command is useful for giving fields more meaningful names, such as "Product ID" instead of "pid". If you want to rename fields with similar names, you can use a wildcard character.
See the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rename#dc1f1548_eb80_4bd0_8b29_57f7db6d0144__Usage) section.

## Syntax

rename <wc-field> AS <wc-field>...

### Required arguments

wc-field

Syntax: <string>

Description: The name of a field and the name to replace it. Field names with spaces must be enclosed in quotation marks. You can use the asterisk ( \* ) as a wildcard to specify a list of fields with similar names. For example, if you want to specify all fields that start with "value", you can use a wildcard such as `value*`.

## Usage

The `rename` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Rename with a phrase

Use quotation marks when you rename a field with a phrase.

... | rename SESSIONID AS "The session ID"

### Rename multiple, similarly named fields

Use wildcards to rename multiple fields with similar names. For example, suppose you have the following field names:

* EU\_UK
* EU\_DE
* EU\_PL

You can rename the fields to replace EU with EMEA:

... | rename EU\* AS EMEA\*

The results show these field names:

* EMEA\_UK
* EMEA\_DE
* EMEA\_PL

Both the original and renamed fields must include the same number of wildcards, otherwise a wildcard mismatch error is returned. See [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rename#dbf6ff78_bc53_45ea_a2d7_fb76d673d1d8__Examples).

### You can't rename one field with multiple names

You can't rename one field with multiple names. For example if you have field A, you can't specify `| rename A as B, A as C`. This rule also applies to other commands where you can rename fields, such as the `stats` command.

The following example is not valid:

... | stats first(host) AS site, first(host) AS report

### You can't merge multiple fields into one field

You can't use the `rename` command to merge multiple fields into one field because null, or non-present, fields are brought along with the values.

For example, if you have events with either `product_id` or `pid` fields, `... | rename pid AS product_id` would not merge the `pid` values into the `product_id` field. It overwrites `product_id` with Null values where `pid` does not exist for the event. See [the eval command](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval) and [coalesce() function](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

### You can't match wildcard characters while renaming fields

You can use the asterisk ( \* ) in your searches as a wildcard character, but you can't use a backslash ( \ ) to escape an asterisk in search strings. A backslash `\` and an asterisk `*` match the characters `\*` in searches, not an escaped wildcard character. Because the Splunk platform doesn't support escaping wildcards, asterisk ( \* ) characters in field names in rename searches can't be matched and replaced.

### Renaming a field that does not exist

Renaming a field can cause loss of data.

Suppose you rename fieldA to fieldB, but fieldA does not exist.

* If fieldB does not exist, nothing happens.
* If fieldB does exist, the result of the rename is that the data in fieldB is removed. The data in fieldB will contain null values.

### The original and new field names must have the same number of wildcards

The number of asterisks ( \* ) in the original name must match the number of asterisks in the new name. For example, the following search fails because there is one wildcard character in the original name, but none in the name that replaces it:

... | rename price-a\*price-b AS price-a\price-b

The following search completes successfully because the number of wildcard characters in both names is the same.

... | rename price-a\*price-b AS price-a\*Newprice-b

### Support for backslash characters ( \ ) in the rename command

To match a backslash character ( \ ) in a field name when using the `rename` command, use 2 backslashes for each backslash in the original field name. For example, to rename the field name `http\\:8000` to `localhost:8000`, use the following command in your search:

... | rename http\\\\:\* AS localhost:\*

See [Backslashes](/en/?resourceId=Splunk_Search_Backslashes) in the *Search Manual*.

## Examples

### 1. Rename a single field

Rename the "\_ip" field to "IPAddress".

... | rename \_ip AS IPAddress

### 2. Rename fields with similar names using a wildcard

Rename fields that begin with "usr" to begin with "user".

... | rename usr\* AS user\*

### 3. Specifying a field name that contains spaces

Rename the "count" field. Names with spaces must be enclosed in quotation marks.

... | rename count AS "Count of Events"

## See also

Commands

[fields](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fields#id_77c2addd_d37f_413f_8409_4849a2364f3d__fields)

[replace](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/replace#id_4c55899c_d73d_446c_95ef_55aa4475910f__replace)

[table](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/table#a4df0a30_3b45_471a_ab81_c60b7477dfad__table)
