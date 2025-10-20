# addtotals

## Description

The `addtotals` command computes the arithmetic sum of all numeric fields for each search result. The results appear in the Statistics tab.

You can specify a list of fields that you want the sum for, instead of calculating every numeric field. The sum is placed in a new field.

If `col=true`, the `addtotals` command computes the column totals, which adds a new result at the end that represents the sum of each field. `labelfield`, if specified, is a field that will be added to this summary event with the value set by the 'label' option. Alternately, instead of using the  `addtotals col=true` command, you can use the [addcoltotals](/en/?resourceId=Splunk_SearchReference_Addcoltotals) command to calculate a summary event.

## Syntax

addtotals [row=<bool>] [col=<bool>] [labelfield=<field>] [label=<string>] [fieldname=<field>] [<field-list>]

### Required arguments

None.

### Optional arguments

field-list

Syntax: <field> ...

Description: One or more numeric fields, delimited with a space. Only the fields specified in the <field-list> are summed. If a <field-list> is not specified, all numeric fields are included in the sum.

Usage: You can use wildcards in the field names. For example, if the field names are `count1`, `count2`, and `count3` you can specify `count*` to indicate all fields that begin with 'count'.

Default: All numeric fields are included in the sum.

row

Syntax: row=<bool>

Description: Specifies whether to calculate the sum of the <field-list> for each event. This is similar to calculating a total for each row in a table. The sum is placed in a new field. The default name of the field is `Total`. If you want to specify a different name for the field, use the `fieldname` argument.

Usage: Because the default is `row=true`, specify the `row` argument only when you do not want the event totals to appear `row=false`.

Default: true

col

Syntax: col=<bool>

Description: Specifies whether to add a new event, referred to as a summary event, at the bottom of the list of events. The summary event displays the sum of each field in the events, similar to calculating column totals in a table.

Default: false

fieldname

Syntax: fieldname=<field>

Description: Used to specify the name of the field that contains the calculated sum of the *field-list* for each event. The `fieldname` argument is valid only when `row=true`.

Default: Total

labelfield

Syntax: labelfield=<field>

Description: Used to specify a field for the summary event label. The `labelfield` argument is valid only when `col=true`.

To use an existing field in your result set, specify the field name for the `labelfield` argument. For example if the field name is `IP`, specify `labelfield=IP`.

If there is no field in your result set that matches the `labelfield`, a new field is added using the `labelfield` value.

Default: none

label

Syntax: label=<string>

Description: Used to specify a row label for the summary event.

If the `labelfield` argument is an existing field in your result set, the `label` value appears in that row in the display.

If the `labelfield` argument creates a new field, the `label` appears in the new field in the summary event row.

Default: Total

## Usage

The `addtotals` command is a distributable streaming command, except when is used to calculate column totals. When used to calculate column totals, the `addtotals` command is a transforming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### 1: Calculate the sum of the numeric fields of each event

This example uses events that list the numeric sales for each product and quarter, for example:

| products | quarter | sales | quota |
| --- | --- | --- | --- |
| ProductA | QTR1 | 1200 | 1000 |
| ProductB | QTR1 | 1400 | 1550 |
| ProductC | QTR1 | 1650 | 1275 |
| ProductA | QTR2 | 1425 | 1300 |
| ProductB | QTR2 | 1175 | 1425 |
| ProductC | QTR2 | 1550 | 1450 |
| ProductA | QTR3 | 1300 | 1400 |
| ProductB | QTR3 | 1250 | 1125 |
| ProductC | QTR3 | 1375 | 1475 |
| ProductA | QTR4 | 1550 | 1300 |
| ProductB | QTR4 | 1700 | 1225 |
| ProductC | QTR4 | 1625 | 1350 |

Use the chart command to summarize data

To summarize the data by product for each quarter, run this search:

source="addtotalsData.csv" | chart sum(sales) BY products quarter

In this example, there are two fields specified in the BY clause with the `chart` command.

* The `products` field is referred to as the <row-split> field.
* The `quarter` field is referred to as the <column-split> field.

The results appear on the Statistics tab and look something like this:

| products | QTR1 | QTR2 | QTR3 | QTR4 |
| --- | --- | --- | --- | --- |
| ProductA | 1200 | 1425 | 1300 | 1550 |
| ProductB | 1400 | 1175 | 1250 | 1700 |
| ProductC | 1650 | 1550 | 1375 | 1625 |

To add a column that generates totals for each row, run this search:

source="addtotalsData.csv" | chart sum(sales) BY products quarter | addtotals

The results appear on the Statistics tab and look something like this:

| products | QTR1 | QTR2 | QTR3 | QTR4 | Total |
| --- | --- | --- | --- | --- | --- |
| ProductA | 1200 | 1425 | 1300 | 1550 | 5475 |
| ProductB | 1400 | 1175 | 1250 | 1700 | 5525 |
| ProductC | 1650 | 1550 | 1375 | 1625 | 6200 |

Use the stats command to calculate totals

If all you need are the totals for each product, a simpler solution is to use the `stats` command:

source="addtotalsData.csv" | stats sum(sales) BY products

The results appear on the Statistics tab and look something like this:

| products | sum(sales) |
| --- | --- |
| ProductA | 5475 |
| ProductB | 5525 |
| ProductC | 6200 |

### 2. Specify a name for the field that contains the sums for each event

Instead of accepting the default name added by the `addtotals` command, you can specify a name for the field.

... | addtotals fieldname=sum

### 3. Use wildcards to specify the names of the fields to sum

Calculate the sums for the fields that begin with `amount` or that contain the text `size` in the field name. Save the sums in the field called `TotalAmount`.

... | addtotals fieldname=TotalAmount amount\* \*size\*

### 4. Calculate the sum for a specific field

In this example, the row calculations are turned off and the column calculations are turned on. The total for only a single field, `sum(quota)`, is calculated.

source="addtotalsData.csv" | stats sum(quota) by quarter| addtotals row=f col=t labelfield=quarter sum(quota)

* The `labelfield` argument specifies in which field the label for the total appears. The default label is Total.

The results appear on the Statistics tab and look something like this:

| quarter | sum(quota) |
| --- | --- |
| QTR1 | 3825 |
| QTR2 | 4175 |
| QTR3 | 4000 |
| QTR4 | 3875 |
| Total | 15875 |

### 5. Calculate the field totals and add custom labels to the totals

Calculate the sum for each quarter and product, and calculate a grand total.

source="addtotalsData.csv" | chart sum(sales) by products quarter| addtotals col=t labelfield=products label="Quarterly Totals" fieldname="Product Totals"

* The `labelfield` argument specifies in which field the label for the total appears, which in this example is products.
* The `label` argument is used to specify the label Quarterly Totals for the `labelfield`, instead of using the default label Total.
* The `fieldname` argument is used to specify the label Product Totals for the row totals.

The results appear on the Statistics tab and look something like this:

| products | QTR1 | QTR2 | QTR3 | QTR4 | Product Totals |
| --- | --- | --- | --- | --- | --- |
| ProductA | 1200 | 1425 | 1300 | 1550 | 5475 |
| ProductB | 1400 | 1175 | 1250 | 1700 | 5525 |
| ProductC | 1650 | 1550 | 1375 | 1625 | 6200 |
| Quarterly Totals | 4250 | 4150 | 3925 | 4875 | 17200 |

## See also

[stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats)
