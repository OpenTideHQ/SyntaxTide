# strcat

## Description

Concatenates string values from 2 or more fields. Combines together string values and literals into a new field. A destination field name is specified at the end of the `strcat` command.

## Syntax

strcat [allrequired=<bool>] <source-fields> <dest-field>

### Required arguments

<dest-field>

Syntax: <string>

Description: A destination field to save the concatenated string values in, as defined by the <source-fields> argument. The destination field is always at the end of the series of source fields.

<source-fields>

Syntax: (<field> | <quoted-str>)...

Description: Specify the field names and literal string values that you want to concatenate. Literal values must be enclosed in quotation marks.

quoted-str

Syntax: "<string>"

Description: Quoted string literals.

Examples: "/" or ":"

### Optional arguments

allrequired

Syntax: allrequired=<bool>

Description: Specifies whether or not all source fields need to exist in each event before values are written to the destination field. If `allrequired=f`, the destination field is always written and source fields that do not exist are treated as empty strings. If `allrequired=t`, the values are written to destination field only if all source fields exist.

Default: false

## Usage

The `strcat` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

Add a field called comboIP, which combines the source and destination IP addresses. Separate the addresses with a forward slash character.

... | strcat sourceIP "/" destIP comboIP

### Example 2:

Add a field called comboIP, which combines the source and destination IP addresses. Separate the addresses with a forward slash character. Create a chart of the number of occurrences of the field values.

host="mailserver" | strcat sourceIP "/" destIP comboIP | chart count by comboIP

### Example 3:

Add a field called address, which combines the host and port values into the format <host>::<port>.

... | strcat host "::" port address

## See also

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval)
