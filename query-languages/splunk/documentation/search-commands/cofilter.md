# cofilter

## Description

Use this command to determine how many times a value in <field1> and a value in <field2> occur together.
For example, if you have a field that contains user IDs and another field that contains items names, this command finds how common each pair of user and item occur.

This command implements one step in a collaborative filtering analysis for making recommendations.

## Syntax

cofilter <field1> <field2>

### Required arguments

field1

Syntax: <field>

Description: The name of field.

field2

Syntax: <field>

Description: The name of a field.

## Usage

The `cofilter` command is a transforming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1

Find the cofilter for `user` and `item`. The `user` field must be specified first and followed by the `item` field. The output is an event for each pair of items with: the first item and its popularity, the second item and its popularity, and the popularity of that pair of items.

Let's start with a simple search to create a few results:

| makeresults
| eval user="a b c a b c a b c"
| makemv user
| mvexpand user
| streamstats count

The results appear on the Statistics tab and look something like this:

| \_time | count | user |
| --- | --- | --- |
| 2020-02-19 21:17:54 | 1 | a |
| 2020-02-19 21:17:54 | 2 | b |
| 2020-02-19 21:17:54 | 3 | c |
| 2020-02-19 21:17:54 | 4 | a |
| 2020-02-19 21:17:54 | 5 | b |
| 2020-02-19 21:17:54 | 6 | c |
| 2020-02-19 21:17:54 | 7 | a |
| 2020-02-19 21:17:54 | 8 | b |
| 2020-02-19 21:17:54 | 9 | c |

The `eval` command with the modulus ( % ) operator is used to create the `item` field:

| makeresults
| eval user="a b c a b c a b c"
| makemv user
| mvexpand user
| streamstats count
| eval item = count % 5

The results look like this:

| \_time | count | item | user |
| --- | --- | --- | --- |
| 2020-02-19 21:17:54 | 1 | 1 | a |
| 2020-02-19 21:17:54 | 2 | 2 | b |
| 2020-02-19 21:17:54 | 3 | 3 | c |
| 2020-02-19 21:17:54 | 4 | 4 | a |
| 2020-02-19 21:17:54 | 5 | 0 | b |
| 2020-02-19 21:17:54 | 6 | 1 | c |
| 2020-02-19 21:17:54 | 7 | 2 | a |
| 2020-02-19 21:17:54 | 8 | 3 | b |
| 2020-02-19 21:17:54 | 9 | 4 | c |

Add the `cofilter` command to the search to determine how many `user` values occurred with each `item` value,

| makeresults
| eval user="a b c a b c a b c"
| makemv user
| mvexpand user
| streamstats count
| eval item = count % 5
| cofilter user item

The results look something like this:

| Item 1 | Item 1 user count | Item 2 | Item 2 user count | Pair count |
| --- | --- | --- | --- | --- |
| 1 | 2 | 2 | 2 | 1 |
| 1 | 2 | 3 | 2 | 1 |
| 1 | 2 | 4 | 2 | 2 |
| 2 | 2 | 3 | 2 | 1 |
| 2 | 2 | 4 | 2 | 1 |
| 2 | 2 | 0 | 1 | 1 |
| 3 | 2 | 4 | 2 | 1 |
| 3 | 2 | 0 | 1 | 1 |

## See also

[associate](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/associate#id_3184e4a3_432e_47f4_a2bd_78f7033fa49d__associate), [correlate](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/correlate#id_02457def_aa0e_4966_9e46_fac87bd031c8__correlate)
