# makemv

## Description

Converts a single valued field into a multivalue field by splitting the values on a string delimiter or by using a regular expression. The delimiter can be a multicharacter delimiter.

Note: The `makemv` command does not apply to internal fields.

See [Use default fields](/en/?resourceId=Splunk_Knowledge_Usedefaultfields) in the *Knowledge Manager Manual*.

## Syntax

makemv [delim=<string> | tokenizer=<string>] [allowempty=<bool>] [setsv=<bool>] <field>

### Required arguments

field

Syntax: <field>

Description: The name of a field to generate the multivalues from.

### Optional arguments

delim

Syntax: delim=<string>

Description: A string value used as a delimiter. Splits the values in `field` on every occurrence of this delimiter.

Default: A single space (" ").

tokenizer

Syntax: tokenizer=<string>

Description: A regular expression with a capturing group that is repeat-matched against the values in the field. For each match, the first capturing group is used as a value in the newly created multivalue field.

allowempty

Syntax: allowempty=<bool>

Description: Specifies whether to permit empty string values in the multivalue field. When using `delim=true`, repeats of the delimiter string produce empty string values in the multivalue field. For example if `delim=","` and `field="a,,b"`, by default does not produce any value for the empty string. When using the `tokenizer` argument, zero length matches produce empty string values. By default they produce no values.

Default: false

setsv

Syntax: setsv=<bool>

Description: If true, the `makemv` command combines the decided values of the field into a single value, which is set on the same field. (The simultaneous existence of a multivalue and a single value for the same field is a problematic aspect of this flag.)

Default: false

## Usage

The `makemv` command is a distributable streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

You can use [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) and [statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions) on multivalue fields or to return multivalue fields.

## Examples

### 1. Use a comma to separate field values

For sendmail search results, separate the values of "senders" into multiple values. Display the top values.

eventtype="sendmail" | makemv delim="," senders | top senders

### 2. Use a colon delimiter and allow empty values

Separate the value of "product\_info" into multiple values.

... | makemv delim=":" allowempty=true product\_info

### 3. Use a regular expression to separate values

The following search creates a result and adds three values to the `my_multival` field. The `makemv` command is used to separate the values in the field by using a regular expression.

| makeresults
| eval my\_multival="one,two,three"
| makemv tokenizer="([^,]+),?" my\_multival

## See also

Commands:

[mvcombine](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_8805ef66_c6da_4ab1_bfaa_d1e6a903a04e__mvcombine)[mvexpand](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvexpand#abbcfd3b_7a2a_40a1_a15f_29efd5660135__mvexpand)[nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv)

Functions:

[Multivalue eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)[Multivalue stats and chart functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/multivalue-stats-and-chart-functions#c91ef24c_3a99_4695_a28e_54701a40d80f__Multivalue_stats_and_chart_functions)[split](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#f86dce3e_8749_4896_9e65_fdd535f12dd0__Multivalue_eval_functions)
