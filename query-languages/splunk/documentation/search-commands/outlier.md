# outlier

## Description

This command is used to remove outliers, not detect them. It removes or truncates outlying numeric values in selected fields. If no fields are specified, then the `outlier` command attempts to process all fields.

To identify outliers and create alerts for outliers, see [finding and removing outliers](/en/?resourceId=Splunk_Search_Findingandremovingoutliers) in the *Search Manual*.

Note: Use current Splunk machine learning (ML) tools to take advantage of the latest algorithms and get the most powerful results. See [About the Splunk Machine Learning Toolkit](/en/?resourceId=MLApp_User_AboutMLTK)
in the *Splunk Machine Learning Toolkit*.

## Syntax

outlier <outlier-options>... [<field-list>]

### Optional arguments

<outlier-options>

Syntax: <action> | <mark> | <param> | <uselower>

Description: Outlier options.

<field-list>

Syntax: <field> ...

Description: A space-delimited list of field names.

### Outlier options

<action>

Syntax: action=remove | transform

Description: Specifies what to do with the outliers. The `remove` option removes events that containing the outlying numerical values. The `transform` option truncates the outlying values to the threshold for outliers. If `action=transform` and `mark=true`, prefixes the values with "000".

Abbreviations: The `remove` action can be shorted to `rm`. The `transform` action can be shorted to `tf`.

Default: transform

<mark>

Syntax: mark=<bool>

Description: If `action=transform` and `mark=true`, prefixes the outlying values with "000". If `action=remove`, the `mark` argument has no effect.

Default: false

<param>

Syntax: param=<num>

Description: Parameter controlling the threshold of outlier detection. An outlier is defined as a numerical value that is outside of `param` multiplied by the inter-quartile range (IQR).

Default: 2.5

<uselower>

Syntax: uselower=<bool>

Description: Controls whether to look for outliers for values below the median in addition to above.

Default: false

## Usage

The `outlier` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Filtering is based on the inter-quartile range (IQR), which is computed from the difference between the 25th percentile and 75th percentile values of the numeric fields. If the value of a field in an event is less than `(25th percentile) - param*IQR` or greater than `(75th percentile) + param*IQR` , that field is transformed or that event is removed based on the `action` parameter.

## Examples

Example 1: For a timechart of webserver events, transform the outlying average CPU values.

404 host="webserver" | timechart avg(cpu\_seconds) by host | outlier action=tf

Example 2: Remove all outlying numerical values.

... | outlier

## See also

[anomalies](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalies#de225778_642c_4dcc_9fba_c4b8041e2af1__anomalies), [anomalousvalue](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalousvalue#adf8d264_6647_4cfc_a5eb_3363bb55a0a7__anomalousvalue), [cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster), [kmeans](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kmeans#d0a3cb28_4602_427c_8c30_fa3e06f4fa95__kmeans)

[Finding and removing outliers](/en/?resourceId=Splunk_Search_Findingandremovingoutliers)
