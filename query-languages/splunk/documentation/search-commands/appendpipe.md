# appendpipe

## Description

Appends the result of the subpipeline to the search results. Unlike a subsearch, the subpipeline is not run first. The subpipeline is run when the search reaches the `appendpipe` command. The `appendpipe` command is used to append the output of [transforming commands](https://docs.splunk.com/Splexicon:Transformingcommand), such as `chart`, `timechart`, `stats`, and `top`.

## Syntax

appendpipe [run\_in\_preview=<bool>] [<subpipeline>]

### Optional Arguments

run\_in\_preview

Syntax: run\_in\_preview=<bool>

Description: Specifies whether or not display the impact of the `appendpipe` command in the preview. When set to FALSE, the search runs and the preview shows the results as if the `appendpipe` command is not part of the search. However, when the search finishes, the results include the impact of the `appendpipe` command.

Default: True

subpipeline

Syntax: <subpipeline>

Description: A list of commands that are applied to the search results from the commands that occur in the search before the `appendpipe` command.

## Usage

The `appendpipe` command can be useful because it provides a summary, total, or otherwise descriptive row of the entire dataset when you are constructing a table or chart. This command is also useful when you need the original results for additional calculations.

## Examples

### Example 1:

Append subtotals for each action across all users.

index=\_audit | stats count by action user | appendpipe [stats sum(count) as count by action | eval user = "TOTAL - ALL USERS"] | sort action

The results appear on the Statistics tab and look something like this:

| action | user | count |
| --- | --- | --- |
| accelerate\_search | admin | 209 |
| accelerate\_search | buttercup | 345 |
| accelerate\_search | can-delete | 6 |
| accelerate\_search | TOTAL - ALL USERS | 560 |
| add | n/a | 1 |
| add | TOTAL - ALL USERS | 1 |
| change\_authentication | admin | 50 |
| change\_authentication | buttercup | 9 |
| change\_authentication | can-delete | 24 |
| change\_authentication | TOTAL - ALL USERS | 83 |

## See also

[append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append), [appendcols](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendcols#id_40e2fdd2_c8c8_4059_b826_db6a95005a6a__appendcols), [join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join), [set](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/set#id_653646ef_cdac_43a6_a15e_06f61dcfbdd9__set)
