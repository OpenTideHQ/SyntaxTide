# kvform

## Description

Extracts key-value pairs from events based on a form template that describes how to extract the values.

Note: For Splunk Cloud Platform, you must create a private app to extract key-value pairs from events. If you are a Splunk Cloud administrator with experience creating private apps, see [Manage private apps in your Splunk Cloud Platform deployment](/en/?resourceId=SplunkCloud_Admin_PrivateApps) in the *Splunk Cloud Admin Manual*. If you have not created private apps, contact your Splunk account representative for help with this customization.

## Syntax

kvform [form=<string>] [field=<field>]

### Optional arguments

form

Syntax: form=<string>

Description: Specify a .form file located in a `$SPLUNK_HOME/etc/apps/*/forms/` directory.

field

Syntax: field=<field\_name>

Description: Uses the field name to look for `.form` files that correspond to the field values for that field name. For example, your Splunk deployment uses the `splunkd` and `mongod` sourcetypes. If you specify `field=sourcetype`, the `kvform` command looks for the `splunkd.form` and `mongod.form` in the `$SPLUNK_HOME/etc/apps/*/forms/` directory.

Default: sourcetype

## Usage

Before you can use the `kvform` command, you must:

* Create the `forms` directory in the appropriate application path. For example `$SPLUNK_HOME/etc/apps/<app_name>/forms`.
* Create the `.form` files and add the files to the `forms` directory.

### Format for the .form files

A `.form` file is essentially a text file of all static parts of a form. It might be interspersed with named references to regular expressions of the type found in the [transforms.conf](/en/?resourceId=Splunk_Admin_Transformsconf) file.

An example `.form` file might look like this:

Students Name: [[string:student\_name]]
Age: [[int:age]] Zip: [[int:zip]]

### Specifying a form

If the `form` argument is specified, the `kvform` command uses the `<form_name>.form` file found in the Splunk configuration `forms` directory. For example, if `form=sales_order`, the `kvform` command looks for a `sales_order.form` file in the `$SPLUNK_HOME/etc/apps/<app_name>/forms` directory for all apps. All the events processed are matched against the form, trying to extract values.

### Specifying a field

If you specify the `field` argument, the the `kvform` command looks for forms in the `forms` directory that correspond to the values for that field. For example, if you specify `field=error_code`, and an event has the field value `error_code=404`, the command looks for a form called `404.form` in the `$SPLUNK_HOME/etc/apps/<app_name>/forms` directory.

### Default value

If no `form` or `field` argument is specified, the `kvform` command uses the default value for the `field` argument, which is `sourcetype`. The `kvform` command looks for `<sourcetype_value>.form` files to extract values.

## Examples

### 1. Extract values using a specific form

Use a specific form to extract values from.

... | kvform form=sales\_order

### 2. Extract values using a field name

Specify `field=sourcetype` to extract values from forms such as `splunkd.form` and `mongod.form`. If there is a form for a source type, values are extracted from that form. If one of the source types is `access_combined` but there is no `access_combined.form` file, that source type is ignored.

... | kvform field=sourcetype

### 3. Extract values using the eventtype field

... | kvform field=eventtype

## See also

Commands

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract)

[multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv)

[rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex)

[xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv)
