# rare

## Description

Displays the least common values in a field.

Finds the least frequent tuple of values of all fields in the field list. If the <by-clause> is specified, this command returns rare tuples of values for each distinct tuple of values of the group-by fields.

This command operates identically to the `top` command, except that the `rare` command finds the least frequent values instead of the most frequent values.

## Syntax

rare [<rare-options>...] <field-list> [<by-clause>]

### Required arguments

<field-list>

Syntax: <string>,...

Description: Comma-delimited list of field names.

### Optional arguments

<rare-options>

Syntax: countfield=<string> | limit=<int> | percentfield=<string> | showcount=<bool> | showperc=<bool>

Description: Options that specify the type and number of values to display. These are the same as the <top-options> used by the `top` command.

<by-clause>

Syntax: BY <field-list>

Description: The name of one or more fields to group by.

### Rare options

countfield

Syntax: countfield=<string>

Description: The name of a new field to write the value of count into.

Default: "count"

limit

Syntax: limit=<int>

Description: Specifies how many tuples to return. If you specify `limit=0`, all values up to the `maxresultrows` are returned. Specifying a value larger than the `maxresultrows` produces an error. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rare#id_52d3cea0_4149_4327_a2ab_6e80df72c64b__Usage).

Default: 10

percentfield

Syntax: percentfield=<string>

Description: Name of a new field to write the value of percentage.

Default: "percent"

showcount

Syntax: showcount=<bool>

Description: Specifies whether to add a field to your results with the count of the tuple. The name of the field is controlled by the `countield` argument.

Default: true

showperc

Syntax: showperc=<bool>

Description: Specifies whether to add a field to your results with the relative prevalence of that tuple. The name of the field is controlled by the `percentfield` argument.

Default: true

## Usage

The `rare` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Limit maximum

The number of results returned by the `rare` command is controlled by the `limit` argument. The default value for the `limit` argument is 10. The default maximum is 50,000, which effectively keeps a ceiling on the memory that the `rare` command uses.

You can change this limit up to the maximum value specified in the `maxresultrows` setting in the `[rare]` stanza in the [limits.conf](/en/?resourceId=Splunk_Admin_Limitsconf) file.

Splunk Cloud Platform

To change the `maxresultrows` setting, request help from Splunk Support. If you have a support contract, file a new case using the Splunk Support Portal at [Support and Services](https://www.splunk.com/en_us/support-and-services.html). Otherwise, contact [Splunk Customer Support](https://www.splunk.com/en_us/about-splunk/contact-us.html#tabs/tab_parsys_tabs_CustomerSupport_4).

Splunk Enterprise

To change the the `maxresultrows` setting in the limits.conf file, follow these steps.

Prerequisites

* Only users with file system access, such as system administrators, can edit configuration files.
* Review the steps in [How to edit a configuration file](http://docs.splunk.com/Documentation/Splunk/Admin/Howtoeditaconfigurationfile) in the Splunk Enterprise *Admin Manual*.

CAUTION: Never change or copy the configuration files in the default directory. The files in the default directory must remain intact and in their original location. Make changes to the files in the local directory.

Steps

1. Open or create a local `limits.conf` file in the desired path. For example, use the `$SPLUNK_HOME/etc/apps/search/local` path to apply this change only to the Search app.
2. Under the [rare] stanza, change the value for the `maxresultrows` setting.

## Examples

### 1. Return the least common values in a field

Return the least common values in the `url` field. Limits the number of values returned to 5.

... | rare url limit=5

### 2. Return the least common values organized by host

Find the least common values in the `user` field for each `host` value. By default, a maximum of 10 results are returned.

... | rare user by host

## See also

Related commands

[top](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/top#id_5d59fd51_ff0d_415f_adb1_cd3c78a8fcb1__top)

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)

[sirare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sirare#id_6cc6977a_9d5f_4ff7_928e_62a742ce0197__sirare)
