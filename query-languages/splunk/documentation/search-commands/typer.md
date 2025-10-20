# typer

## Description

Creates an `eventtype` field for search results that match known event types. You must create event types to use this command. See [About event types](/en/?resourceId=Splunk_Knowledge_Abouteventtypes) in the *Knowledge Manager Manual*.

## Syntax

The required syntax is in bold.

typer

[eventtypes=<string>]

[maxlen=<unsigned\_integer>]

### Required arguments

None.

### Optional arguments

eventtypes

Syntax: eventtypes=<string>

Description: Provide a comma-separated list of event types to filter the set of event types that `typer` can return in the `eventtype` field. The `eventtypes` argument filters out all event types except the valid event types in its list. If all of the event types listed for `eventtypes` are invalid, or if no event types are listed, `typer` is turned off and will not return any event types. The `eventtypes` argument accepts wildcards.

Default: No default (by default `typer` returns all available event types)

maxlen

Syntax: maxlen=<unsigned\_integer>

Description: By default, the `typer` command looks at the first 10000 characters of an event to determine its event type. Use `maxlen` to override this default. For example, `maxlen=300` restricts `typer` to determining event types from the first 300 characters of events.

## Usage

The `typer` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Changing the default for maxlen

Users with file system access, such as system administrators, can change the default setting for `maxlen`.

Splunk Cloud Platform

To change the `maxlen` default setting, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the `maxlen` default setting, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can change the `maxlen` default setting using configuration files.
* Review the steps in [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local limits.conf file for the Search app at `$SPLUNK_HOME/etc/apps/search/local`.
2. Under the [typer] stanza, specify the default for the `maxlen` setting.

## Examples

### Example 1:

Returns a field called `eventtype` which lists the names of the event types associated with the search results.

... | typer

## See also

Commands

[findtypes](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/findtypes#id_98697cac_b9cf_4a11_b253_0d607af25064__findtypes)

Related information

[About event types](/en/?resourceId=Splunk_Knowledge_Abouteventtypes) in the *Knowledge Manager Manual*
