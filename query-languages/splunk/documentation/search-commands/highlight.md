# highlight

## Description

Highlights specified terms in the events list. Matches a string or list of strings and highlights them in the display in [Splunk Web](https://docs.splunk.com/Splexicon:Splunkweb). The matching is not case sensitive.

## Syntax

highlight <string>...

### Required arguments

<string>

Syntax: <string> ...

Description: A space-separated list of strings to highlight in the results. The list you specify is not case-sensitive. Any combination of uppercase and lowercase letters that match the string are highlighted.

## Usage

The `highlight` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The string that you specify must be a field value. The string cannot be a field name.

You must use the `highlight` command in a search that keeps the raw events and displays output on the Events tab. You cannot use the highlight command with commands, such as `stats` which produce calculated or generated results.

## Examples

### Example 1:

Highlight the terms "login" and "logout".

... | highlight login,logout

### Example 2:

Highlight the phrase "Access Denied".

... | highlight "access denied"

## See also

[rangemap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rangemap#f4d5a1b2_51c4_4614_b3fa_a1e37da8fb2a__rangemap)
