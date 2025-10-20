# autoregress

## Description

Prepares your events for calculating the autoregression, or the *moving average*, by copying one or more of the previous values for *field* into each event.

The first few events will lack the augmentation of prior values, since the prior values do not exist.

## Syntax

autoregress <field> [AS <newfield>] [ p=<int> | p=<int>-<int> ]

### Required arguments

field

Syntax: <string>

Description: The name of a field. Most usefully a field with numeric values.

### Optional arguments

p

Syntax: p=<int> | p=<int>-<int>

Description: Specifies which prior events to copy values from. You can specify a single integer or a numeric range. For a single value, such as 3, the `autoregress` command copies field values from the third prior event into a new field. For a range, the `autoregress` command copies field values from the range of prior events. For example, if you specify a range such as `p=2-4`, then the field values from the second, third, and fourth prior events are copied into new fields.

Default: 1

newfield

Syntax: <field>

Description: If `p` is set to a single integer, the `newfield` argument specifies a field name to copy the single field value into. Invalid if `p` is set to a range.

If the `newfield` argument is not specified, the single or multiple values are copied into fields with the names *<field>\_p<num>*. For example, if `p=2-4` and `field=count`, the field names are count\_p2, count\_p3, count\_p4.

## Usage

The `autoregress` command is a centralized streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

For each event, copy the 3rd previous value of the 'ip' field into the field 'old\_ip'.

... | autoregress ip AS old\_ip p=3

### Example 2:

For each event, copy the 2nd, 3rd, 4th, and 5th previous values of the 'count' field.

... | autoregress count p=2-5

Since the `new field` argument is not specified, the values are copied into the fields 'count\_p2', 'count\_p3', 'count\_p4', and 'count\_p5'.

### Example 3:

Calculate a moving average of event size over the current event and the four prior events. This search omits the moving\_average for the initial events, where the field would be wrong, because summing null fields is considered null.

... | eval rawlen=len(\_raw) | autoregress rawlen p=1-4 | eval moving\_average=(rawlen + rawlen\_p1 + rawlen\_p2 + rawlen\_p3 +rawlen\_p4 ) /5

## See also

[accum](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/accum#id_4a21595d_149b_464e_9ba0_b35d9336654c__accum), [delta](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/delta#aea489ea_dd56_4a9e_a42e_a6f865ed8c88__delta), [streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats), [trendline](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/trendline#id_1985bcca_9e84_45c1_877c_68cb1b56e716__trendline)
