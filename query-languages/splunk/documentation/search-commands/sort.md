# sort

## Description

The `sort` command sorts all of the results by the specified fields. Results missing a given field are treated as having the smallest or largest possible value of that field if the order is descending or ascending, respectively.

If the first argument to the `sort` command is a number, then at most that many results are returned, in order. If no number is specified, the default limit of 10000 is used. If the number 0 is specified, all of the results are returned. See the `count` argument for more information.

## Syntax

The required syntax is in bold.

sort

[<count>]

<sort-by-clause>...

[desc]

### Required arguments

<sort-by-clause>

Syntax: [ - | + ] <sort-field>, ( - | + ) <sort-field> ...

Description: List of fields to sort by and the sort order. Use a minus sign (-) for descending order and a plus sign (+) for ascending order. When specifying more than one field, separate the field names with commas. See Sort field options.

### Optional arguments

<count>

Syntax: <int> | limit=<int>

Description: Specify the number of results to return from the sorted results. If no count is specified, the default limit of 10000 is used. If `0` is specified, all results are returned. You can specify the count using an integer or precede the count with a label, for example `limit=10`.

CAUTION: Using `sort 0` might have a negative impact performance, depending on how many results are returned.

Default: 10000

desc

Syntax: d | desc

Description: Reverses the order of the results. If multiple fields are specified, reverses the order of the values in the fields in the order in which the fields are specified. For example, if there are three fields specified, the `desc` argument reverses the order of the values in the first field. For each set of duplicate values in the first field, reverses the order of the corresponding values in the second field. For each set of duplicate values in the second field, reverses the order of the corresponding values in the third field.

### Sort field options

<sort-field>

Syntax: <field> | auto(<field>) | str(<field>) | ip(<field>) | num(<field>)

Description: Options you can specify with <sort-field>.

<field>

Syntax: <string>

Description: The name of field to sort.

auto

Syntax: auto(<field>)

Description: Determine automatically how to sort the values of the field.

ip

Syntax: ip(<field>)

Description: Interpret the values of the field as IP addresses.

num

Syntax: num(<field>)

Description: Interpret the values of the field as numbers.

str

Syntax: str(<field>)

Description: Interpret the values of the field as strings and order the values alphabetically.

## Usage

The `sort` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

By default, `sort` tries to automatically determine what it is sorting. If the field contains numeric values, the collating sequence is numeric. If the field contains on IP address values, the collating sequence is for IP addresses. Otherwise, the collating sequence is in lexicographical order. Some specific examples are:

* Alphabetic strings are sorted lexicographically.
* Punctuation strings are sorted lexicographically.
* Numeric data is sorted as you would expect for numbers and the sort order is specified as ascending or descending.
* Alphanumeric strings are sorted based on the data type of the first character. If the string starts with a number, the string is sorted numerically based on that number alone. Otherwise, strings are sorted lexicographically.
* Strings that are a combination of alphanumeric and punctuation characters are sorted the same way as alphanumeric strings.

The sort order is determined between each pair of values that are compared at any one time. This means that for some pairs of values, the order might be lexicographical, while for other pairs the order might be numerical.

| Results in descending order | Description |
| --- | --- |
| 10.1   9.1 | This set of values are sorted numerically because the values are all numeric. |
| 9.1.a   10.1.a | This set of values are sorted lexicographically because the values are alphanumeric strings. |

### Lexicographical order

Lexicographical order sorts items based on the values used to encode the items in computer memory. In Splunk software, this is almost always UTF-8 encoding, which is a superset of ASCII.

* Numbers are sorted before letters. Numbers are sorted based on the first digit. For example, the numbers 10, 9, 70, 100 are sorted lexicographically as 10, 100, 70, 9.
* Uppercase letters are sorted before lowercase letters.
* Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.

### Custom sort order

You can specify a custom sort order that overrides the lexicographical order. See the blog [Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html).

## Basic examples

### 1. Use the sort field options to specify field types

Sort the results by the `ipaddress` field in ascending order and then sort by the `url` field in descending order.

... | sort ip(ipaddress), -str(url)

### 2. Specifying the number of results to sort

Sort first 100 results in descending order of the "size" field and then by the "source" value in ascending order. This example specifies the type of data in each of the fields. The "size" field contains numbers and the "source" field contains strings.

... | sort 100 -num(size), +str(source)

### 3. Specifying descending and ascending sort orders

Sort results by the "\_time" field in ascending order and then by the "host" value in descending order.

... | sort \_time, -host

### 4. Changing the time format of events for sorting

Change the format of the event's time and sort the results in descending order by the Time field that is created with the `eval` command.

... | bin \_time span=60m | eval Time=strftime(\_time, "%m/%d %H:%M %Z") | stats avg(time\_taken) AS AverageResponseTime BY Time | sort - Time

(Thanks to Splunk user [Ayn](http://splunk-base.splunk.com/users/131/ayn) for this example.)

### 5. Return the most recent event

Return the most recent event:

... | sort 1 -\_time

### 6. Use a label with the <count>

You can use a label to identify the number of results to return:
Return the first 12 results, sorted by the "host" field in descending order.

... | sort limit=12 host

## Extended example

### 1. Specify a custom sort order

Sort a table of results in a specific order, such as days of the week or months of the year, that is not lexicographical or numeric. For example, suppose you have a search that produces the following table:

| Day | Total |
| --- | --- |
| Friday | 120 |
| Monday | 93 |
| Tuesday | 124 |
| Thursday | 356 |
| Weekend | 1022 |
| Wednesday | 248 |

Sorting on the day field (Day) returns a table sorted alphabetically, which does not make much sense. Instead, you want to sort the table by the day of the week, Monday to Friday, with the Weekend at the end of the list.

To create a custom sort order, you first need to create a field called `sort_field` that defines the order. Then you can sort on that field.

... | eval wd=lower(Day) | eval sort\_field=case(wd=="monday",1, wd=="tuesday",2, wd=="wednesday",3, wd=="thursday",4, wd=="friday",5, wd=="weekend",6)
| sort sort\_field
| fields - sort\_field

This search uses the `eval` command to create the `sort_field` and the `fields` command to remove `sort_field` from the final results table.

The results look something like this:

| Day | Total |
| --- | --- |
| Monday | 93 |
| Tuesday | 124 |
| Wednesday | 248 |
| Thursday | 356 |
| Friday | 120 |
| Weekend | 1022 |

(Thanks to Splunk users [Ant1D](http://splunk-base.splunk.com/users/1146/ant1d) and [Ziegfried](http://splunk-base.splunk.com/users/42/ziegfried) for this example.)

For additional custom sort order examples, see the blog
[Order Up! Custom Sort Orders](https://www.splunk.com/blog/2019/08/29/order-up-custom-sort-orders.html) and the Extended example in the [rangemap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rangemap#f4d5a1b2_51c4_4614_b3fa_a1e37da8fb2a__rangemap) command.

## See also

[reverse](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/reverse#id_7c85ccb6_6bc2_4463_9b61_c1ca705f8d70__reverse)
