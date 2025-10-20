# iconify

## Description

Causes [Splunk Web](https://docs.splunk.com/Splexicon:Splunkweb) to display an icon for each different value in the list of fields that you specify.

The `iconify` command adds a field named `_icon` to each event. This field is the hash value for the event. Within Splunk Web, a different icon for each unique value in the field is displayed in the events list. If multiple fields are listed, the UI displays a different icon for each unique combination of the field values.

## Syntax

iconify <field-list>

### Required arguments

field-list

Syntax: <field>...

Description: Comma or space-delimited list of fields. You cannot specify a wildcard character in the field list.

## Usage

The `iconify` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### 1. Display a different icon for each eventtype

... | iconify eventtype

### 2. Display a different icon for unique pairs of field values

Display a different icon for unique pair of `clientip` and `method` values.

... | iconify clientip method

Here is how Splunk Web displays the results in your Events List:

![Iconify example.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/5fe2bd5a-041f-403b-8b5b-9ab1c7b1843f?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI1ZmUyYmQ1YS0wNDFmLTQwM2ItOGI1Yi05YWIxYzdiMTg0M2YiLCJleHAiOjE3NjEwNjAxMjYsImp0aSI6IjRlMGFlODkzZWZlOTQzYzM5Mzk4NWZmM2JjZTJjZGIzIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.UGw4-jMkGWdpkJGg3icSzzQLdDo5JWNSTwxWq6cy31o)

## See also

[highlight](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/highlight#b05e9cef_8a91_4a8b_999d_f8246f1bd066__highlight)
