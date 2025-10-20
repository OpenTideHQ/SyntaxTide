# selfjoin

## Description

Join search result rows with other search result rows in the same result set, based on one or more fields that you specify.

## Syntax

selfjoin [<selfjoin-options>...] <field-list>

### Required arguments

<field-list>

Syntax: <field>...

Description: The field or list of fields to join on.

### Optional arguments

<selfjoin-options>

Syntax: overwrite=<bool> | max=<int> | keepsingle=<bool>

Description: Options that control the search result set that is returned. You can specify one or more of these options.

### Selfjoin options

keepsingle

Syntax: keepsingle=<bool>

Description: Controls whether or not to retain results that have a unique value in the join fields and no matching values to join with. When `keepsingle=true`, search results that have no other results to join with are kept in the output. For example, if you're joining results matching employees to their managers, and one of the employees is the CEO who doesn't have a manager, the field for that employee is included in the results when `keepsingle=true`.

Default: false

max

Syntax: max=<int>

Description: Indicates the maximum number of 'other' results to join with each main result. If `max=0`, there is no limit. This argument sets the maximum for the 'other' results. The maximum number of main results is 100,000.

Default: 1

overwrite

Sytnax: overwrite=<bool>

Description: When `overwrite=true`, causes fields from the 'other' results to overwrite fields of the main results. The main results are used as the basis for the join.

Default: true

## Usage

Self joins are more commonly used with relational database tables. They are used less commonly with event data.

An example of an events usecase is with events that contain information about processes, where each process has a parent process ID. You can use the `selfjoin` command to correlate information about a process with information about the parent process.

See the [Extended example](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/selfjoin#fa8ead6b_f34c_4c80_9bb1_4ef930e48b69__Extended_example).

## Basic example

### 1: Use a single field to join results

Join the results with itself on the 'id' field.

... | selfjoin id

## Extended example

The following example shows how the `selfjoin` command works against a simple set of results.
You can follow along with this example on your own Splunk instance.

Note: This example builds a search incrementally. With each addition to the search, the search is rerun and the impact of the additions are shown in a results table. The values in the `_time` field change each time you rerun the search. However, in this example the values in the results table are not changed so that we can focus on how the changes to the search impact the results.

1. Start by creating a simple set of 5 results by using the `makeresults` command.

| makeresults count=5

There are 5 results created, each with the same timestamp.

| \_time |
| --- |
| 2018-01-18 14:38:59 |
| 2018-01-18 14:38:59 |
| 2018-01-18 14:38:59 |
| 2018-01-18 14:38:59 |
| 2018-01-18 14:38:59 |

2. To keep better track of each result use the `streamstats` command to add a field that numbers each result.

| makeresults count=5 | streamstats count as a

The `a` field is added to the results.

| \_time | a |
| --- | --- |
| 2018-01-18 14:38:59 | 1 |
| 2018-01-18 14:38:59 | 2 |
| 2018-01-18 14:38:59 | 3 |
| 2018-01-18 14:38:59 | 4 |
| 2018-01-18 14:38:59 | 5 |

3. Additionally, use the `eval` command to change the timestamps to be 60 seconds apart. Different timestamps make this example more realistic.

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a)

The minute portion of the timestamp is updated.

| \_time | a |
| --- | --- |
| 2018-01-18 14:38:59 | 1 |
| 2018-01-18 14:39:59 | 2 |
| 2018-01-18 14:40:59 | 3 |
| 2018-01-18 14:41:59 | 4 |
| 2018-01-18 14:42:59 | 5 |

4. Next use the `eval` command to create a field to use as the field to join the results on.

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a) | eval joiner="x"

The new field is added.

| \_time | a | joiner |
| --- | --- | --- |
| 2018-01-18 14:38:59 | 1 | x |
| 2018-01-18 14:39:59 | 2 | x |
| 2018-01-18 14:40:59 | 3 | x |
| 2018-01-18 14:41:59 | 4 | x |
| 2018-01-18 14:42:59 | 5 | x |

5. Use the `eval` command to create some fields with data.

An `if` function is used with a modulo (modulus) operation to add different data to each of the new fields. A modulo operation finds the remainder after the division of one number by another number:

* The `eval b` command processes each result and performs a modulo operation. If the remainder of `a/2` is 0, put "something" into the field "b", otherwise put "nada" into field "b".
* The `eval c`  command processes each result and performs a modulo operation. If the remainder `a/2` is 1, put "something else" into the field "c", otherwise put nothing (NULL) into field "c".

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a) | eval joiner="x" | eval b = if(a%2==0,"something","nada"), c = if(a%2==1,"somethingelse",null())

The new fields are added and the fields are arranged in alphabetical order by field name, except for the `_time` field.

| \_time | a | b | c | joiner |
| --- | --- | --- | --- | --- |
| 2018-01-18 14:38:59 | 1 | nada | somethingelse | x |
| 2018-01-18 14:39:59 | 2 | something |  | x |
| 2018-01-18 14:40:59 | 3 | nada | somethingelse | x |
| 2018-01-18 14:41:59 | 4 | something |  | x |
| 2018-01-18 14:42:59 | 5 | nada | somethingelse | x |

6. Use the `selfjoin` command to join the results on the `joiner` field.

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a) | eval joiner="x" | eval b = if(a%2==0,"something","nada"), c = if(a%2==1,"somethingelse",null()) | selfjoin joiner

The results are joined.

| \_time | a | b | c | joiner |
| --- | --- | --- | --- | --- |
| 2018-01-18 14:39:59 | 2 | something | somethingelse | x |
| 2018-01-18 14:40:59 | 3 | nada | somethingelse | x |
| 2018-01-18 14:41:59 | 4 | something | somethingelse | x |
| 2018-01-18 14:42:59 | 5 | nada | somethingelse | x |

7. To understand how the `selfjoin` command joins the results together, remove the `| selfjoin joiner` portion of the search. Then modify the search to append the values from the `a` field to the values in the `b` and `c` fields.

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a) | eval joiner="x" | eval b = if(a%2==0,"something"+a,"nada"+a), c = if(a%2==1,"somethingelse"+a,null())

The results now have the row number appended to the values in the `b` and `c` fields.

| \_time | a | b | c | joiner |
| --- | --- | --- | --- | --- |
| 2018-01-18 14:38:59 | 1 | nada1 | somethingelse1 | x |
| 2018-01-18 14:39:59 | 2 | something2 |  | x |
| 2018-01-18 14:40:59 | 3 | nada3 | somethingelse3 | x |
| 2018-01-18 14:41:59 | 4 | something4 |  | x |
| 2018-01-18 14:42:59 | 5 | nada5 | somethingelse5 | x |

8. Now add the `selfjoin` command back into the search.

| makeresults count=5 | streamstats count as a | eval \_time = \_time + (60\*a) | eval joiner="x" | eval b = if(a%2==0,"something"+a,"nada"+a), c = if(a%2==1,"somethingelse"+a,null()) | selfjoin joiner

The results of the self join.

| \_time | a | b | c | joiner |
| --- | --- | --- | --- | --- |
| 2018-01-18 14:39:59 | 2 | something2 | somethingelse1 | x |
| 2018-01-18 14:40:59 | 3 | nada3 | somethingelse3 | x |
| 2018-01-18 14:41:59 | 4 | something4 | somethingelse3 | x |
| 2018-01-18 14:42:59 | 5 | nada5 | somethingelse5 | x |

If there are values for a field in both rows, the last result row, based on the `_time` value, takes precedence. The joins performed are shown in the following table.

| Result row | Output | Description |
| --- | --- | --- |
| 1 | Row 1 is joined with row 2 and returned as row 2. | In field `b`, the value `nada1` is discarded because the value `something2` in row 2 takes precedence. In field `c`, there is no value in row 2. The value `somethingelse1` from row 1 is returned. |
| 2 | Row 2 is joined with row 3 and returned as row 3. | Since row 3 contains values for both field `b` and field `c`, the values in row 3 take precedence and the values in row 2 are discarded. |
| 3 | Row 3 is joined with row 4 and returned as row 4. | In field `b`, the value `nada3` is discarded because the value `something4` in row 4 takes precedence. In field `c`, there is no value in row 4. The value `somethingelse3` from row 3 is returned. |
| 4 | Row 4 is joined with row 5 and returned as row 5. | Since row 5 contains values for both field `b` and field `c`, the values in row 5 take precedence and the values in row 4 are discarded. |
| 5 | Row 5 has no other row to join with. | No additional results are returned. |

(Thanks to Splunk user [Alacercogitatus](https://answers.splunk.com/users/3659/alacercogitatus) for helping with this example.)

## See also

[join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join)
