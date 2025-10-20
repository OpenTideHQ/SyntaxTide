# bucketdir

## Description

Replaces a field value with higher-level grouping, such as replacing filenames with directories.

Returns the `maxcount` events, by taking the incoming events and rolling up multiple sources into directories, by preferring directories that have many files but few events. The field with the path is PATHFIELD (e.g., source), and strings are broken up by a separator character. The default pathfield=source; sizefield=totalCount; maxcount=20; countfield=totalCount; sep="/" or "\\", depending on the operation system.

## Syntax

bucketdir pathfield=<field> sizefield=<field> [maxcount=<int>] [countfield=<field>] [sep=<char>]

### Required arguments

pathfield

Syntax: pathfield=<field>

Description: Specify a field name that has a path value.

sizefield

Syntax: sizefield=<field>

Description: Specify a numeric field that defines the size of bucket.

### Optional arguments

countfield

Syntax: countfield=<field>

Description: Specify a numeric field that describes the count of events.

maxcount

Syntax: maxcount=<int>

Description: Specify the total number of events to bucket.

sep

Syntax: <char>

Description: The separating character. Specify either a forward slash "/" or double back slashes "\\", depending on the operating system.

## Usage

The `bucketdir` command is a streaming command. It is distributable streaming by default, but centralized streaming if the `local` setting specified for the command in the commands.conf file is set to true. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

Return 10 best sources and directories.

... | top source | bucketdir pathfield=source sizefield=count maxcount=10

## See also

[cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster), [dedup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dedup#cc343630_62b6_453c_a08d_39c99aa852df__dedup)
