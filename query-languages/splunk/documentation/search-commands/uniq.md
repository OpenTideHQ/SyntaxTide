# uniq

## Description

The `uniq` command works as a filter on the search results that you pass into it. This command removes any search result if that result is an exact duplicate of the previous result. This command does not take any arguments.

Note: We do not recommend running this command against a large dataset.

## Syntax

uniq

## Examples

### Example 1:

Keep only unique results from all web traffic in the past hour.

eventtype=webtraffic earliest=-1h@s | uniq

## See also

[dedup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dedup#cc343630_62b6_453c_a08d_39c99aa852df__dedup)
