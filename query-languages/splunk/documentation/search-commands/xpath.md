# xpath

## Description

Extracts the xpath value from `field` and sets the `outfield` attribute.

Note: Due to limitations with XML extraction, the `xpath` command returns empty results when input XML strings have prologue headers, such as xml version or DOCTYPE. As a result, use the `spath` command instead of the `xpath` command when extracting XML content.

### Syntax

xpath [outfield=<field>] <xpath-string> [field=<field>] [default=<string>]

### Required arguments

xpath-string

Syntax: <string>

Description: Specifies the XPath reference.

### Optional arguments

field

Syntax: field=<field>

Description: The field to find and extract the referenced `xpath` value from.

Default: `_raw`

outfield

Syntax: outfield=<field>

Description: The field to write, or output, the `xpath` value to.

Default: `xpath`

default

Syntax: default=<string>

Description: If the attribute referenced in `xpath` doesn't exist, this specifies what to write to the `outfield`. If this isn't defined, there is no default value.

## Usage

The `xpath` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

The `xpath` command supports the syntax described in the [Python Standard Library 19.7.2.2. Supported XPath syntax](https://docs.python.org/2/library/xml.etree.elementtree.html#supported-xpath-syntax).

## Examples

### 1. Extract values from a single element in `_raw` XML events

You want to extract values from a single element in `_raw` XML events and write those values to a specific field.

The `_raw` XML events look like this:

 <foo>
<bar nickname="spock">
</bar>
</foo>
<foo>
<bar nickname="scotty">
</bar>
</foo>
<foo>
<bar nickname="bones">
</bar>
</foo>

Extract the `nickname` values from `_raw` XML events. Output those values to the `name` field.

sourcetype="xml" | xpath outfield=name "//bar/@nickname"

### 2. Extract multiple values from `_raw` XML events

Extract multiple values from `_raw` XML events

The `_raw` XML events look like this:

 <DataSet xmlns="">
<identity\_id>3017669</identity\_id>
<instrument\_id>912383KM1</instrument\_id>
<transaction\_code>SEL</transaction\_code>
<sname>BARC</sname>
<currency\_code>USA</currency\_code>
</DataSet>
<DataSet xmlns="">
<identity\_id>1037669</identity\_id>
<instrument\_id>219383KM1</instrument\_id>
<transaction\_code>SEL</transaction\_code>
<sname>TARC</sname>
<currency\_code>USA</currency\_code>
</DataSet>

Extract the values from the `identity_id` element from the `_raw` XML events:

... | xpath outfield=identity\_id "//DataSet/identity\_id"

This search returns two results: `identity_id=3017669` and `identity_id=1037669`.

To extract a combination of two elements, `sname` with a specific value and `instrument_id`, use this search:

... | xpath outfield=instrument\_id "//DataSet[sname='BARC']/instrument\_id"

Because you specify `sname='BARC'`, this search returns one result: `instrument_id=912383KM1`.

### 3. Testing extractions from `XML` events

You can use the `makeresults` command to test `xpath` extractions.

You must add `field=xml` to the end of your search. For example:

| makeresults
| eval xml="<DataSet xmlns=\"\">
<identity\_id>1037669</identity\_id>
<instrument\_id>219383KM1</instrument\_id>
<transaction\_code>SEL</transaction\_code>
<sname>TARC</sname>
<currency\_code>USA</currency\_code>
</DataSet>"
| xpath outfield=identity\_id "//DataSet/identity\_id" field=xml

## See also

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract), [kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform), [multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv), [rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex),
[spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath), [xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv)
