# collapse

CAUTION: The `collapse` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

The collapse command condenses multifile results into as few files as the `chunksize` option allows. This command runs automatically when you use outputlookup and outputcsv commands.

## Syntax

... | collapse [chunksize=<num>] [force=<bool>]

### Optional arguments

chunksize

*Syntax:* chunksize=<num>

Description: Limits the number of resulting files.

Default: 50000

force

Syntax: force=<bool>

Description: If force=true and the results are entirely in memory, re-divide the results into appropriated chunked files.

Default:
`false`

## Examples

Example 1: Collapse results.

... | collapse
