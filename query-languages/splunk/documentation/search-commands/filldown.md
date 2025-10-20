# filldown

## Description

Replaces null values with the last non-null value for a field or set of fields. If no list of fields is given, the `filldown` command will be applied to all fields. If there are not any previous values for a field, it is left blank (NULL).

## Syntax

filldown <wc-field-list>

### Required arguments

<wc-field-list>

Syntax: <field> ...

Description: A space-delimited list of field names. You can use the asterisk ( \* ) as a wildcard to specify a list of fields with similar names. For example, if you want to specify all fields that start with "value", you can use a wildcard such as `value*`.

## Examples

### Example 1:

Filldown null values for all fields.

... | filldown

### Example 2:

Filldown null values for the count field only.

... | filldown count

### Example 3:

Filldown null values for the count field and any field that starts with 'score'.

... | filldown count score\*

## See also

[fillnull](/?resourceId=Splunk_SearchReference_Fillnull)
