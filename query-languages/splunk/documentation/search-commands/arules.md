# arules

## Description

The arules command looks for associative relationships between field values. The command returns a table with the following columns: Given fields, Implied fields, Strength, Given fields support, and Implied fields support. The given and implied field values are the values of the fields you supply. The Strength value indicates the relationship between (among) the given and implied field values.

Implements the arules algorithm as discussed in *Michael Hahsler, Bettina Gruen and Kurt Hornik (2012). arules: Mining Association Rules and Frequent Itemsets. R package version 1.0-12*. This algorithm is similar to the algorithms used for online shopping websites which suggest related items based on what items other customers have viewed or purchased.

## Syntax

arules [<arules-option>... ] <field-list>...

### Required arguments

field-list

Syntax: <field> <field> ...

Description: The list of field names. At least two fields must be specified.

### Optional arguments

<arules-option>

Syntax: <support> | <confidence>

Description: Options for arules command.

### arules options

support

Syntax: sup=<int>

Description: Specify a support limit. Associations with computed support levels smaller than this value are not included in the output results. The support option must be a positive integer.

Default: 3

confidence

Syntax: conf=<float>

Description: Specify a confidence limit. Associations with a confidence (expressed as `Strength` field) are not included in the output results. Must be between 0 and 1.

Default: .5

## Usage

The `arules` command is a streaming command that is both distributable streaming and centralized streaming. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

Example 1: Search for the likelihood that the fields are related.

... | arules field1 field2 field3

Example 2:

... | arules sup=3 conf=.6 field1 field2 field3

## See also

[associate](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/associate#id_3184e4a3_432e_47f4_a2bd_78f7033fa49d__associate), [correlate](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/correlate#id_02457def_aa0e_4966_9e46_fac87bd031c8__correlate)
