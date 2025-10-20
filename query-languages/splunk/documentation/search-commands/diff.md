# diff

## Description

The `diff` command mimics \*nix diff output and compares two search results at a time by returning the line-by-line difference, or comparison, of the two. The two search results compared are specified by the two position values `position1` and `position2`. These values default to 1 and 2 to compare the first two results.

By default, the text (`_raw` field) of the two search results is compared. Other fields can be compared by selecting another field using `attribute`.

## Syntax

diff [position1=*int*] [position2=*int*] [attribute=*string*] [diffheader=*bool*] [context=*bool*] [maxlen=*int*]

### Optional arguments

position1

Datatype: <int>

Description: Of the table of input search results, selects a specific search result to compare to position2.

Default:`position1=1` and refers to the first search result.

position2

Datatype: <int>

Description: Of the table of input search results, selects a specific search result to compare to position1. This value must be greater than *position1*.

Default:`position2=2` and refers to the second search result.

attribute

Datatype: <field>

Description: The field name to be compared between the two search results.

Default:`attribute=_raw`, which refers to the text of the event or result.

diffheader

Datatype: <bool>

Description: If true, show the traditional diff header, naming the "files" compared. The diff header makes the output a valid diff as would be expected by the programmer command-line `patch` command.

Default:`diffheader=false`.

context

Datatype: <bool>

Description: If true, selects [context-mode diff output](http://en.wikipedia.org/wiki/Diff_utility#Context_format) as opposed to the default [unified diff output](http://en.wikipedia.org/wiki/Diff_utility#Unified_format).

Default:`context=false`, or unified.

maxlen

Datatype: <int>

Description: Controls the maximum content in bytes diffed from the two events. If `maxlen=0`, there is no limit.

Default:`maxlen=100000`, which is 100KB.

## Examples

### Example 1:

Compare the "ip" values of the first and third search results.

... | diff pos1=1 pos2=3 attribute=ip

### Example 2:

Compare the 9th search results to the 10th.

... | diff position1=9 position2=10

## See also

[set](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/set#id_653646ef_cdac_43a6_a15e_06f61dcfbdd9__set)
