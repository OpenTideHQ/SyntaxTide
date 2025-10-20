# localop

## Description

Prevents subsequent commands from being executed on remote peers. Tells the search to run subsequent commands locally, instead.

The `localop` command forces subsequent commands to be part of the reduce step of the mapreduce process.

## Syntax

localop

## Examples

### Example 1:

The `iplocation` command in this case will never be run on remote peers. All events from remote peers that originate from the initial search, which was for the terms FOO and BAR, are forwarded to the search head. The search head is where the `iplocation` command is run.

FOO BAR | localop | iplocation clientip
