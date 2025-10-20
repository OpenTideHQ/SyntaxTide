# xmlkv

## Description

The `xmlkv` command automatically extracts key-value pairs from XML-formatted data.

For JSON-formatted data, use the `spath` command.

## Syntax

The required syntax is in bold.

xmlkv

[<field>]

maxinputs=<int>

### Required arguments

None.

### Optional arguments

field

Syntax: <field>

Description: The field from which to extract the key and value pairs.

Default: The `_raw` field.

maxinputs

Syntax: maxinputs=<int>

Description: Sets the maximum number of events or search results that can be passed as inputs into the `xmlkv` command per invocation of the command. The `xmlkv` command is invoked repeatedly in increments according to the `maxinputs` argument until the search is complete and all of the results have been displayed. Do not change the value of `maxinputs` unless you know what you are doing.

Default: 50000

## Usage

The `xmlkv` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Keys and values in XML elements

From the following XML, `name` is the key and `Settlers of Catan` is the value in the first element.

<game>
<name>Settlers of Catan</name>
<category>competitive</category>
</game>
<game>
<name>Ticket to Ride</name>
<category>competitive</category>
</game>

## Examples

### 1. Automatically extract key-value pairs

Extract key-value pairs from XML tags in the `_raw` field. Processes a maximum of 50000 events.

... | xmlkv

### 2. Extract key-value pairs in a specific number of increments

Extract the key-value pairs from events or search results in increments of 10,000 per invocation of the `xmlkv` command until the search has finished and all of the results are displayed.

... | xmlkv maxinputs=10000

## See also

Commands

[extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract)

[kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform)

[multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv)

[rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex)

[spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath)

[xpath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xpath#id_4288b926_a1d3_4530_94ce_39d508745f49__xpath)
