# Multivalue eval functions

The following list contains the functions that you can use on multivalue fields or to return multivalue fields.

You can also use the statistical eval functions, `max` and `min`, on multivalue fields. See [Statistical eval functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/statistical-eval-functions#edb88796_760e_43fc_87b0_67db51ae36ee__Statistical_eval_functions).

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

## commands(<value>)

### Description

This function takes a search string, or field that contains a search string, and returns a multivalued field containing a list of the commands used in <value>.

### Usage

This function is generally not recommended for use except for analysis of `audit.log` events.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

The following example returns a multivalued field called x, that contains the commands `search`, `stats`, and `sort` which are the commands used in the search string specified.

... | eval x=commands("search foo | stats count | sort count")

## mvappend(<values>)

### Description

This function takes one or more values and returns a single multivalue result that contains all of the values. The values can be strings, multivalue fields, or single value fields.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

This example shows how to append two values, `localhost` is a literal string value and `srcip` is a field name.

... | eval fullName=mvappend("localhost", srcip)

The following example shows how to use nested `mvappend` functions.

* The inner `mvappend` function contains two values: `localhost` is a literal string value and `srcip` is a field name.
* The outer `mvappend` function contains three values: the inner `mvappend` function, `destip` is a field name, and `192.168.1.1` which is a literal IP address.

The results are placed in a new field called `ipaddresses`, which contains the array  `["localhost", <values_in_scrip>, <values_in_destip>, "192.168.1.1"]`.

... | eval ipaddresses=mvappend(mvappend("localhost", srcip), destip, "192.168.1.1")

Note that the previous example generates the same results as the following example, which does not use a nested `mvappend` function:

| makeresults | eval ipaddresses=mvappend("localhost", srcip, destip, "192.168.1.1")

If the first value in the `srcip` field is 203.0.113.0 and the first value in the `destip` field is 203.0.113.255, the results look something like this:

| time | ipaddresses |
| --- | --- |
| 2024-11-19 16:43:31 | localhost  203.0.113.0  203.0.113.255  192.168.1.1 |

## mvcount(<mv>)

### Description

This function takes a field and returns a count of the values in that field for each result. If the field is a multivalue field, this function returns the number of values in that field. If the field contains a single value, this function returns 1 . If the field has no values, this function returns NULL.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

... | eval n=mvcount(multifield)

### Extended example

In the following example, the `mvcount()` function returns the number of email addresses in the `To`, `From`, and `Cc` fields and saves the addresses in the specified "\_count" fields.

eventtype="sendmail"
| eval To\_count=mvcount(split(To,"@"))-1
| eval From\_count=mvcount(From)
| eval Cc\_count= mvcount(split(Cc,"@"))-1

This search takes the values in the `To` field and uses the split function to separate the email address on the @ symbol. The split function is also used on the `Cc` field for the same purpose.

If only a single email address exists in the `From` field, as you would expect, mvcount(From) returns 1. If there is no `Cc` address, the `Cc` field might not exist for the event. In that situation mvcount(cc) returns NULL.

## mvdedup(<mv>)

### Description

This function takes a multivalue field and returns a multivalue field with its duplicate values removed.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

... | eval s=mvdedup(mvfield)

## mvfilter(<predicate>)

### Description

This function filters a multivalue field based on an arbitrary Boolean expression. The Boolean expression can reference ONLY ONE field at a time.

### Usage

This function will return NULL values of the field as well. If you do not want the NULL values, use one of the following expressions:

* `mvfilter(!isnull(<value>))`
* `mvfilter(isnotnull(<value>))`

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

The following example returns all of the values in field `email`  that end in `.net` or `.org`.

... | eval n=mvfilter(match(email, "\.net$") OR match(email, "\.org$"))

## mvfind(<mv>,<regex>)

### Description

This function tries to find a value in the multivalue field that matches the regular expression. If a match exists, the index of the first matching value is returned (beginning with zero). If no values match, NULL is returned.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

... | eval n=mvfind(mymvfield, "err\d+")

## mvindex(<mv>,<start>,<end>)

### Description

This function returns a subset of the multivalue field using the start and end index values.

### Usage

The `<mv>` argument must be a multivalue field. The `<start>` and `<end>` indexes must be numbers.

The `<mv>` and `<start>` arguments are required. The `<end>` argument is optional.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Specifying the start and end indexes

* Indexes start at zero. If you have 5 values in the multivalue field, the first value has an index of 0. The second value has an index of 1, and so on.
* If only the `<start>` argument is specified, only that value is included in the results.
* When the `<end>` argument is specified, the range of values from `<start>` to `<end>` are included in the results.
* Both the `<start>` and `<end>` arguments can be negative. An index of `-1` is used to specify the last value in the list.
* If the indexes are out of range or invalid, the result is NULL.

### Examples

Consider the following values in a multivalue field called `names`:

| Name | alex | celestino | claudia | david | ikraam | nyah | rutherford | wei |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index number | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

Because indexes start at zero, the following example returns the value `claudia`:

... | eval my\_names=mvindex(names,2)

To return a range of values, specify both a `<start>` and `<end>` value. For example, the following search returns the first 4 values in the field. The start value is `0` and the end value is `3`.

... | eval my\_names=mvindex(names,0,3)

The results look like this:

| my\_names |
| --- |
| alex,celestino,claudia,david |

### Extended examples

Consider the following values in a multivalue field:

| ponies |
| --- |
| buttercup, dash, flutter, honey, ivory, minty, pinky, rarity |

To return a value from the end of the list of values, the index numbers start with `-1`. The negative symbol indicates that the indexing starts from the last value. For example:

| Pony name | buttercup | dash | flutter | honey | ivory | minty | pinky | rarity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index number | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 |

To return the last value in the list, you specify `-1`, which indicates to start at the end of the list and return only one value. For example:

... | eval my\_ponies=mvindex(ponies,-1)

The results look like this:

| my\_ponies |
| --- |
| rarity |

To return the 3rd value from the end, you would specify the index number `-3`. For example:

... | eval my\_ponies=mvindex(ponies,-3)

The results look like this:

| my\_ponies |
| --- |
| minty |

To return a range of values, specify both a `<start>` and `<end>` value. For example, the following search returns the last 3 values in the field. The start value is `-3` and the end value is `-1`.

... | eval my\_ponies=mvindex(ponies, -3, -1)

The results look like this:

| my\_ponies |
| --- |
| minty,pinky,rarity |

## mvjoin(<mv>,<delim>)

### Description

This function takes two arguments, a multivalue field and a string delimiter. The function concatenates the individual values within <mv> using the value of <delim> as a separator.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

You have a multivalue field called "base" that contains the values "1" "2" "3" "4" "5". The values are separated by a space. You want to create a single value field instead, with OR as the delimiter. For example "1 OR 2 OR 3 OR 4 OR 5".

The following search creates the `base` field with the values. The search then creates the `joined` field by using the result of the `mvjoin` function.

... | eval base=mvrange(1,6), joined=mvjoin('base'," OR ")
The following example joins together the individual values of "myfield" using a semicolon as the delimiter:
... | eval n=mvjoin(myfield, ";")

## mvmap(<mv>,<expression>)

### Description

This function iterates over the values of a multivalue field, performs an operation using the <expression> on each value, and returns a multivalue field with the list of results.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example multiplies each value in the `results` field by 10.

... | eval n=mvmap(results, results\*10)

The following example multiplies each value in the `results` field by `threshold`, where `threshold` is a single-valued field.

... | eval n=mvmap(results, results\*threshold)

The following example multiplies the 2nd and 3rd values in the `results` field by `threshold`, where `threshold` is a single-valued field. This example uses the `mvindex` function to identify specific values in the `results` field.

... | eval n=mvmap(mvindex(results, 1,2), results\*threshold)

## mvrange(<start>,<end>,<step>)

### Description

This function creates a multivalue field for a range of numbers. This function can contain up to three arguments: a starting number, an ending number (which is excluded from the field), and an optional step increment. If the increment is a timespan such as `7d`, the starting and ending numbers are treated as UNIX time.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The step increment is optional. If the <step> increment is a timespan such as 7d, the starting and ending numbers are treated as UNIX time.

The <end> number is not included from the multivalue field that is created.

### Basic examples

The following example returns a multivalue field with the values 1, 3, 5, 7, 9.

... | eval mv=mvrange(1,11,2)

The following example takes the UNIX timestamp for 1/1/2018 as the start date and the UNIX timestamp for 4/19/2018 as an end date and uses the increment of 7 days.

| makeresults | eval mv=mvrange(1514834731,1524134919,"7d")

This example returns a multivalue field with the UNIX timestamps. The results appear on the Statistics tab and look something like this:

| \_time | mv |
| --- | --- |
| 2018-04-10 12:31:03 | 1514834731   1515439531  1516044331  1516649131  1517253931  1517858731  1518463531  1519068331  1519673131  1520277931  1520879131  1521483931  1522088731  1522693531  1523298331  1523903131 |

## mvreverse(<value>)

### Description

The `mvreverse` command reverses the order of the values in a multivalue field.

### Usage

You must first construct a multivalue field in order to use the `mvreverse` function on that field. The following two examples show how to build a valid multivalue field using the `split` and `mvappend` eval functions.

| makeresults | eval a=mvreverse(split("1,2,3", ","))
| makeresults | eval b = mvappend("1","2","3"), a=mvreverse(b)

### Examples

The following example reverses the order of the values in the multivalue field `myfield`.

| makeresults
| eval myfield = "one,two,three"
| makemv tokenizer = "([^,]+),?" myfield
| eval new\_myfield = mvreverse(myfield)

The following example reverses the order of the values in the multivalue field `myfield` by changing `"1", "2", "3"` to `"3", "2", "1"`.

| makeresults
| eval myfield = mvreverse(mvappend("1", "2", "3"))

The following example reverses the order of the values in multivalue field `myfield` from `"1","2","3"` to `"3", "2", "1"` in multivalue field `new_myfield`.

| makeresults
| eval myfield = mvappend("1","2","3"), new\_myfield=mvreverse(myfield)

## mvsort(<mv>)

### Description

This function uses a multivalue field and returns a multivalue field with the values sorted lexicographically.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

Lexicographical order sorts items based on the values used to encode the items in computer memory. In Splunk software, this is almost always UTF-8 encoding, which is a superset of ASCII.

* Numbers are sorted before letters. Numbers are sorted based on the first digit. For example, the numbers 10, 9, 70, 100 are sorted lexicographically as 10, 100, 70, 9.
* Uppercase letters are sorted before lowercase letters.
* Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.

### Basic example

... | eval s=mvsort(mvfield)

## mvzip(<mv\_left>,<mv\_right>,<delim>)

### Description

This function combines the values in two multivalue fields. The delimiter is used to specify a delimiting character to join the two values.

### Usage

This is similar to the Python `zip` command.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The values are stitched together combining the first value of <mv\_left> with the first value of field <mv\_right>, then the second with the second, and so on.

The delimiter is optional, but when specified must be enclosed in quotation marks. The default delimiter is a comma ( , ).

### Basic example

... | eval nserver=mvzip(hosts,ports)

### Extended example

You can nest several `mvzip` functions together to create a single multivalued field `three_fields` from three separate fields. The pipe ( | ) character is used as the separator between the field values.

...| eval three\_fields=mvzip(mvzip(field1,field2,"|"),field3,"|")

(Thanks to Splunk user [cmerriman](https://answers.splunk.com/users/195284/cmerriman.html) for this example.)

## mv\_to\_json\_array(<field>, <infer\_types>)

This function maps the elements of a multivalue field to a JSON array.

### Usage

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

Because the elements of JSON arrays can have many data types (such as string, numeric, Boolean, and null), the `mv_to_json_array` function lets you specify how it should map the contents of multivalue fields into JSON arrays. You can have the field values simply written to arrays as string data types, or you can have the function infer different JSON data types.

Use the `<infer_types>` input to specify that the `mv_to_json_array` function should attempt to infer JSON data types when it converts field values into array elements. The `<infer_types>` input defaults to `false`.

| Syntax | Description |
| --- | --- |
| `mv_to_json_array(<field>, false())` or  `mv_to_json_array(<field>)` | By default, or when you explicitly set it to `false()`, the `mv_to_json_array` function maps all values in the multivalued field to the JSON array as string data types, whether they are numeric, strings, Boolean values, or any other JSON data type. The `mv_to_json_array` function effectively splits the multivalue field on the comma and writes each quote-enclosed value to the array as an element with the string data type. |
| `mv_to_json_array(<field>, true())` | When you set the `mv_to_json_array` function to `true()`, the function removes one set of bracketing quote characters from each value it transfers into the JSON array. If the function does not recognize the resulting array element as a proper JSON data type (such as string, numeric, Boolean, or null), the function turns the element into a null data type. |

### Example

This example shows you how the `mv_to_json_array` function can validate JSON as it generates JSON arrays.

This search creates a multivalue field named `ponies`.

... | eval ponies = mvappend("\"Buttercup\"", "\"Fluttershy\"", "\"Rarity\"", "true", "null"),

The array that is created from these values depends on the `<infer_types>` input.

### Without inferring data types

When `<infer_types>` is set to `false` or omitted, the `mv_to_json_array` function converts the field values into array elements without changing the values.

... | eval my\_sweet\_ponies = mv\_to\_json\_array(ponies, false())

The resulting array looks like this:

`["\"Buttercup\"","\"Fluttershy\"","\"Rarity\"","true","null"]`

### With inferring data types

When you run this search with `infer_values` set to `true()`, the `mv_to_json_array` function removes the extra quote and backslash escape characters from the field values when the values are converted into array elements.

... | eval my\_sweet\_ponies = mv\_to\_json\_array(ponies, true())

The resulting array looks like this:

`["Buttercup","Fluttershy","Rarity",true,null]`

## split(<str>,<delim>)

### Description

This function splits the string values on the delimiter and returns the string values as a multivalue field.

Note: The `split` function doesn't have a maximum character limit for input strings or delimiter, provided enough memory is available for searches.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

Use an empty string `("")` to split the original string into one value per character. For example, the following search splits the string into `a`, `b`, `c`, and `d`.

|makeresults
|eval test="abcd"
|eval results=split(test,"")

### Basic example

To illustrate how the `split` function works, the following search creates an event with a `test` field that contains a list of string values separated by semicolon characters ( ; ).

| makeresults
| eval test="buttercup;rarity;tenderhoof;dash;mcintosh;fleetfoot;mistmane"

The results look like this:

| \_time | test |
| --- | --- |
| 2022-09-20 17:39:56 | buttercup;rarity;tenderhoof;dash;mcintosh;fleetfoot;mistmane |

To split up each of the names in the event into a multivalue field using the semicolon delimiter, you could run a search like this:

| makeresults
| eval test="buttercup;rarity;tenderhoof;dash;mcintosh;fleetfoot;mistmane"
| eval ponies=split(test,";")

Now each of the pony names in the `test` event is a field in a multivalue field. The results look something like this:

| \_time | ponies | test |
| --- | --- | --- |
| 2022-09-20 18:22:03 | buttercup   rarity   tenderhoof  dash  mcintosh  fleetfoot  mistmane | buttercup;rarity;tenderhoof;dash;mcintosh;fleetfoot;mistmane |

You can also use a string of contiguous characters in your search like this, which splits the string on "def".

|makeresults
|eval test="1a2b3c4def567890"
|eval results=split(test,"def")

The results look something like this.

| \_time | results | test |
| --- | --- | --- |
| 2023-01-23 12:18:11 | 1a2b3c4   567890 | 1a2b3c4def567890 |

### Extended example

The following search is useful for building equivalents to string functions like Oracle INSTR.

| makeresults
|eval test="name::value"|eval results=split(test,"::")

The results look something like this. The length of the first entry (mvindex=0) is the position of the "::" string, plus or minus one.

| \_time | results | test |
| --- | --- | --- |
| 2023-01-23 12:18:11 | name   value | name::value |

## See also

See the following multivalue commands:

* [makemv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makemv#fe8c2a8f_f15f_4663_b420_fd9634997d7d__makemv)
* [mvcombine](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_8805ef66_c6da_4ab1_bfaa_d1e6a903a04e__mvcombine)
* [mvexpand](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvexpand#abbcfd3b_7a2a_40a1_a15f_29efd5660135__mvexpand)
* [nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv)
