# foreach

## Description

Use this command to run a subsearch that includes a template to iterate over the following elements:

* Each field in a wildcard field list
* Each value in a single [multivalue field](https://docs.splunk.com/Splexicon:Multivaluefield)
* A single field representing a JSON array

## Syntax

The required syntax is in bold.

foreach

mode=(auto\_collections | multivalue | json\_array | multifield)

<wildcard-field-list> | <field>

[<mode-options>]

<subsearch>

[<subsearch-options>]

### Required arguments

wildcard-field-list

Syntax: <string> ...

Description: A space-delimited wildcard field name or list of wildcard field names that is used to iterate over one or more fields in a search. You can use the asterisk ( \* ) as a wildcard to specify a list of fields with similar names. For example, if you want to specify all fields that start with "value", you can use a wildcard field such as `value*`. You can also specify a list of wildcard fields, such as `hostA* hostB* hostC*`.

You can use this argument only with the `multifield` mode.

field

Syntax: <string>

Description: A field name that is used when iterating over elements in a multivalue field or JSON array, using the `multivalue` mode or `json_array` mode in a search.

subsearch

Syntax: [ subsearch ]

Description: A subsearch that includes a template for replacing the values of the specified fields, which depends on which mode you are using: `auto_collections`, `multivalue`, `json_array` or `multifield`.

For each field that is matched, the templated subsearch replaces values as follows:

| Option | Default template value | Replacement | Mode |
| --- | --- | --- | --- |
| fieldstr | <<FIELD>> | The whole field name. | multifield |
| matchstr | <<MATCHSTR>> | The part of the field name that matches the wildcard values in the wildcard field. | multifield |
| matchseg1 | <<MATCHSEG1>> | The part of the field name that matches the first wildcard. | multifield |
| matchseg2 | <<MATCHSEG2>> | The part of the field name that matches the second wildcard. | multifield |
| matchseg3 | <<MATCHSEG3>> | The part of the field name that matches the third wildcard. | multifield |
| itemstr | <<ITEM>> | Matches each element in a multivalue field or JSON array. | auto\_collections, multivalue, json\_array |
| iterstr | <<ITER>> | Matches each number in a multivalue field or JSON array. Use as a placeholder for a zero-based iterator in the multivalue field or JSON array. | auto\_collections, multivalue, json\_array |

### Optional arguments

mode

Syntax: mode=<mode-name>

Description: Tells the `foreach` command to iterate over multiple fields, a multivalue field, or a JSON array. If a mode is not specified, the `foreach` command defaults to the mode for multiple fields, which is the `multifield` mode.

You can specify one of the following modes for the `foreach` command:

| Argument | Syntax | Description |
| --- | --- | --- |
| auto\_collections | mode=auto\_collections | Dynamically iterates over a JSON array or multivalue field depending on which element is present in the search. When you use this mode, you don't need to know whether your functions return JSON arrays or multivalue fields.     The `auto_collections` mode can only be used with the `eval` command. |
| multivalue | mode=multivalue | Iterates over a single supplied multivalue field. Use this mode if your search returns multivalue fields. Add `<<ITEM>>` to your subsearch as a reference to the iterable object, or add `<<ITER>>` as a reference to the iterator.     The `multivalue` mode can only be used with the `eval` command. |
| json\_array | mode=json\_array | Iterates over a single supplied JSON array. Use this mode with [JSON functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/json-functions#e208618e_0a58_428d_8be9_194c0b1c17b6__JSON_functions). Add `<<ITEM>>` to your subsearch as a reference to the iterable object, or add `<<ITER>>` as a reference to the iterator.     The `json_array` mode can only be used with the `eval` command. |
| multifield | mode=multifield | Iterates over a single supplied field name or a list of multiple field names, which can include wildcard characters.     This is the default if the `mode` is not specified.      The `multifield` mode can be used with any streaming command. |

mode options

The mode options depend on the mode you use.

Use the following options to iterate over a field or list of fields using the `multifield` mode. These options are available only with the `multifield` mode.

| Option | Syntax | Description |
| --- | --- | --- |
| fieldstr | fieldstr=<string> | A customizable string that replaces the `<<FIELD>>` template value with the name that you specify. The value of the `fieldstr` option must match the `<<FIELD>>` template value. For example, if you change the default `<<FIELD>>` template value to `MYFIELD`, then you must also change the value of `fieldstr` option to `MYFIELD`. |
| matchstr | matchstr=<string> | A customizable string that replaces the `<<MATCHSTR>>` template value with the segment of the field name that matches the wildcard(s) in each field in the list. The value of the `matchstr` option must match the `<<MATCHSTR>>` template value. For example, if you change the default `<<MATCHSTR>>` template value to `ID`, then you must also change the value of `matchstr` to `ID`.    To avoid unpredictable results in searches, do not use the `matchstr` option with any `matchseg*` options. |
| matchseg1 | matchseg1=<string> | A customizable string that replaces the `<<MATCHSEG1>>` template value with the segment of the field name that matches the first wildcard in each field in the list. The value of the `matchseg1` option must match the `<<MATCHSEG1>>` template value. For example, if you change the default `<<MATCHSEG1>>` template value to `PHONE`, then you must also change the value of `matchseg1` to `PHONE`.    To avoid unpredictable results in searches, do not use the `matchseg1` option with the `matchstr` option. |
| matchseg2 | matchseg2=<string> | A customizable string that replaces the `<<MATCHSEG2>>` template value with the segment of the field name that matches the second wildcard in each field in the list. The value of the `matchseg2` option must match the `<<MATCHSEG2>>` template value. For example, if you change the default `<<MATCHSEG2>>` template value to `PRICE`, then you must also change the value of `matchseg2` to `PRICE`.    To avoid unpredictable results in searches, do not use the `matchseg2` option together with the `matchstr` option. |
| matchseg3 | matchseg3=<string> | A customizable string that replaces the `<<MATCHSEG3>>` template value with the segment of the field name that matches the third wildcard in each field in the list. The value of the `matchseg3` option must match the `<<MATCHSEG3>>` template value. For example, if you change the default `<<MATCHSEG3>>` template value to `ADDRESS`, then you must also change the value of `matchseg3` to `ADDRESS`.    To avoid unpredictable results in searches, do not use the `matchseg3` option together with the `matchstr` option. |

Use the following options to iterate over multivalue fields or JSON arrays using the `multivalue` mode, the `json_array` mode, or the `auto_collections` mode.

| Option | Syntax | Description |
| --- | --- | --- |
| itemstr | itemstr=<string> | Replaces the `<<ITEM>>` template value with each element in a multivalue field or JSON array. The `itemstr` option lets you redefine the placeholder for the item.    The value of the `itemstr` option must match the `<<ITEM>>` template value. For example, if you change the default `<<ITEM>>` template value to `NUMBER`, then you must also change the value of `itemstr` to `NUMBER`, like this:   | foreach mode=multivalue itemstr=<<NUMBER>> numbers [ eval result = result + <<NUMBER>>] |
| iterstr | iterstr=<string> | Replaces the `<<<ITER>>` template value with the index value in a multivalue field or JSON array. The `iterstr` option lets you redefine the placeholder for the iterator, which is the count or index.    The value of the `iterstr` option must match the `<<ITER>>` template value. For example, if you change the default `<<ITER>>` template value to `NUMBER`, then you must also change the value of `iterstr` to `NUMBER`.     For example, consider the following search:  | foreach mode=multivalue numbers [ eval result = result + <<ITER>>]  That search is equivalent to this search:  | foreach mode=multivalue iterstr=<<NUMBER>> numbers [ eval result = result + <<NUMBER>>] |

subsearch options

Syntax: <option-name>

Description:

The subsearch options depend on the mode you use.

You can use the following optional template values in a subsearch when iterating over one or more fields. These template values are available only with the `multifield` mode.

| Template value | Description |
| --- | --- |
| <<FIELD>> | A customizable string replacement for each field name in the field list. Each time you run a subsearch, this value is used to replace the whole field name in the `fieldstr` option for each field you specify. For example, if you change the value of `<<FIELD>>` to `MYFIELD`, then the value of the `fieldstr` option is also `MYFIELD`. Your search might look like this: `...|foreach test* fieldstr=MYFIELD [eval total=total + MYFIELD]`. |
| <<MATCHSTR>> | A customizable string replacement that represents wildcards in each matching field name in the list. For example, if the wildcard field that is being matched is `test*` and the field name is `test8`, then the value of `<<MATCHSTR>>` is 8.    To avoid unpredictable results in searches, do not use the `<<MATCHSTR>>` template value together with any `<<MATCHSEG*>>` template values. |
| <<MATCHSEG1>> | A customizable string replacement for the [segment](https://docs.splunk.com/Splexicon:Segment) of the field name that matches the first segment before the first wildcard in each matching field name in the list.    To avoid unpredictable results in searches, do not use the `<<MATCHSEG1>>` template value with the `<<MATCHSTR>>` template value. |
| <<MATCHSEG2>> | A customizable string replacement for the segment of the field name that matches the second segment before the second wildcard in each matching field name in the list.    To avoid unpredictable results in searches, do not use the `<<MATCHSEG2>>` template value with the <`<<MATCHSTR>>` template value. |
| <<MATCHSEG3>> | A customizable string replacement for the segment of the field name that matches the third segment before the third wildcard in each matching field name in the list.    To avoid unpredictable results in searches, do not use the `<<MATCHSEG3>>` template value with the `<<MATCHSTR>>` template value. |

You can use the following optional template values in a subsearch to iterate over elements or numbers in a multivalue field or JSON array. These template values are available with all modes except the `multifield` mode.

| Template value | Description |
| --- | --- |
| <<ITEM>> | A customizable string that replaces the <<ITEM>> template value with some other string that is substituted with the contents of the multivalue field or JSON array being iterated over. Only a single `eval` statement is permitted in the search pipeline when using this template value with the `multivalue` mode or `json_array` mode. |
| <<ITER>> | A customizable string that replaces the <<ITER>> template value with some other string that is substituted with the contents of the multivalue field or JSON array being iterated over. Only a single `eval` statement is permitted in the search pipeline when using this template value with the `multivalue` mode or `json_array` mode. |

## Usage

The `foreach` command is a [streaming command](https://docs.splunk.com/Splexicon:Streamingcommand).

You can use the `foreach` command in the following ways:

* To obtain results across multiple fields in each result row. This is useful, for example, when you need to calculate the average or sum of a value across multiple columns in each row. If you want to iterate over one or more matching fields, use the `multifield` mode.

* To iterate over multiple values within a single row's field in multivalue fields or JSON arrays. This is useful, for example, when you need to concatenate strings or calculate the average or sum of a set of numbers in a single field across multiple columns in each row in a multivalue field or JSON array. If you want to iterate over a multivalue field, use the `multivalue` mode. If you want to iterate over a JSON array node, use the `json_array` mode.

The default `<<ITEM>>` template value should be used only when the mode is `multivalue` or `json_array`.

### Supported commands

The `foreach` command with `mode=multifield` supports searches with any streaming command.

The `foreach` command with all other modes (`mode=auto_collections`, `mode=multivalue`, or `mode=json_array`) only supports searches with the `eval` command.

### Iterating over multiple matching fields containing nonalphanumeric characters

If the field names contain characters other than alphanumeric characters, such as dashes, underscores, or periods, enclose the `<<FIELD>>` template value in single quotation marks in the right side of the `eval` command portion of the search to avoid unpredictable results. For example, the following search uses the default `foreach` multifield mode and adds the values from all of the fields that match `myfield_*`.

| makeresults
| eval myfield\_1 = 5, myfield\_2 = 10
| foreach myfield\_\*
[eval <<FIELD>> = '<<FIELD>>' + <<MATCHSTR>>]

The search results look something like this:

| \_time | myfield\_1 | myfield\_2 |
| --- | --- | --- |
| 2023-3-14 15:55:50 | 6 | 12 |

The `<<FIELD>>` template value in the `foreach` subsearch is just a string replacement of the field named `myfield_*`. The eval expression does not recognize field names with nonalphanumeric characters unless the field names are surrounded by single quotation marks. For the eval expression to work, the `<<FIELD>>` template value must be surrounded by single quotation marks.

### Support for multiple eval statements

If you need to include multiple `eval` statements with the `foreach` command, use the default multifield mode. Multiple `eval` statements are not supported in `foreach` searches that use multivalue mode or JSON array mode. As a result, your searches on multivalue fields or JSON arrays must contain only a single `eval` statement in the pipeline. However, your `eval` statement can include as many assignments as you want.

For example, the following multivalue search with multiple `eval` assignments completes successfully because there is only one `eval` statement, which means there aren't any piped commands following the `eval` command.

| makeresults
| eval mv=mvappend("5", "15"), total = 0, count = 0
| foreach mode=multivalue mv
[eval total = total + <<ITEM>>, count = count + 1]

The search results look something like this.

| \_time | count | mv | total |
| --- | --- | --- | --- |
| 2022-03-29 19:52:38 | 2 | 5   15 | 20 |

### Wildcards are not supported in multivalue fields or JSON arrays

Unlike multifield mode, the modes for multivalue fields and JSON arrays don't support wildcards in search expressions. Instead, these modes treat a wildcard as part of the field name. For example, the following search includes a field called `mv*`, which looks like a wildcarded field.

| makeresults
| eval mv1=mvappend("1", "2"), mv2=mvappend("3", "4"), mv\*=mvappend("100", "300"), total = 0
| foreach mode=multivalue mv\*
[eval total = total + <<ITEM>>]

However, multivalue and JSON array modes don't recognize the wildcard and add up all of the fields containing `mv`. As a result, the search results for multivalue mode look something like this:

| \_time | mv\* | mv1 | mv2 | total |
| --- | --- | --- | --- | --- |
| 2022-4-20 15:55:50 | 100 300 | 1 2 | 3 4 | 400 |

### Elements of the same type in multivalue fields or JSON arrays

Elements in a subsearch and the `eval` expression must be of the same type as either strings or numbers. For example, the following search correctly adds up the three numbers in the JSON array because all of the elements are numbers.

| foreach json\_array(1, 2, 3)
[eval total = total + <<ITEM>>]

However, the following search results in an error because adding a number to a string isn't allowed.

| foreach json\_array(1, 2, "hello")
[eval total = total + <<ITEM>>]

## Examples

### 1. Generate a total for each row in search results

Suppose you have events that contain the following data:

| categoryId | www1 | www2 |
| --- | --- | --- |
| ACCESSORIES | 1000 | 500 |
| SIMULATION | 3000 | 750 |
| ARCADE | 800 |  |
| STRATEGY | 400 | 200 |

Use the `foreach` command with the default `multifield` mode to iterate over each field that starts with `www` and generate a total for each row in the search results.

...| eval total=0
| foreach www\*
[eval total=total + <<FIELD>>]

The results look like this:

| categoryId | www1 | www2 | total |
| --- | --- | --- | --- |
| ACCESSORIES | 1000 | 500 | 1500 |
| SIMULATION | 3000 | 750 | 3750 |
| ARCADE | 800 |  | 800 |
| STRATEGY | 400 | 200 | 600 |

### 2. Add the values from all fields that start with similar names

The following search adds the values from all of the fields that start with similar names and match the wildcard field `test*`. It uses the `foreach` command with the default `multifield` mode

| makeresults
| eval total=0, test1=1, test2=2, test3=3
| foreach test\*
[eval total=total + <<FIELD>>]

The results of the search look something like this.

| \_time | test1 | test2 | test3 | total |
| --- | --- | --- | --- | --- |
| 2022-4-20 15:55:50 | 1 | 2 | 3 | 6 |

* This search creates one result using the `makeresults` command.
* The search then uses the `eval` command to create the fields `total`, `test1`, `test2`, and `test3` with corresponding values.
* The `foreach` command is used to perform the subsearch for every field that starts with "test". Each time the subsearch is run, the previous total is added to the value of the `test` field to calculate the new total. The final total after all of the `test` fields are processed is 6.

The following table shows how the subsearch iterates over each `test` field. The table shows the beginning value of the `total` field each time the subsearch is run and the calculated total based on the value for the `test` field.

| Subsearch iteration | test field | total field start value | test field value | calculation of total field |
| --- | --- | --- | --- | --- |
| 1 | test1 | 0 | 1 | 0+1=1 |
| 2 | test2 | 1 | 2 | 1+2=3 |
| 3 | test3 | 3 | 3 | 3+3=6 |

### 3. Iterate over fields using the eval and foreach commands

The `eval` command and `foreach` command can be used in similar ways. For example, this search uses the `eval` command:

| makeresults
| eval name="name" | eval price="price" | eval category="category"

It is equivalent to this search that uses the `foreach` command with the default `multifield` mode:

| makeresults
| foreach name price category
[eval <<FIELD>> = "<<FIELD>>"]

The results of both searches look something like this:

| \_time | category | name | price |
| --- | --- | --- | --- |
| 2022-4-20 15:55:50 | category | name | price |

### 4. Monitor license usage

Use the `foreach` command to monitor license usage.

First run the following search on the license manager to return the daily license usage per source type in bytes:

index=\_internal source=\*license\_usage.log type!="\*Summary" earliest=-30d
| timechart span=1d sum(b) AS daily\_bytes by st

The search results for one user across several days looks something like this:

| \_time | csv | universal\_data\_json |
| --- | --- | --- |
| 2022-04-03 | 8308923 | 36069628 |
| 2022-04-04 | 7290647 | 48851560 |
| 2022-04-05 | 7676935 | 12542231 |
| 2022-04-06 | 3016517 | 17521059 |

You can also use the `foreach` command with the default `multifield` mode to calculate the daily license usage in gigabytes for each field:

index=\_internal source=\*license\_usage.log type!="\*Summary" earliest=-30d
| timechart span=1d sum(b) AS daily\_bytes by st
| foreach \* [eval <<FIELD>>='<<FIELD>>'/1024/1024/1024]

This time the search results look something like this:

| \_time | csv | universal\_data\_json |
| --- | --- | --- |
| 2022-04-03 | 0.2335968237849277853 | 0.6309081468478106 |
| 2022-04-04 | 0.9703636813411461080 | 0.4818287762321547 |
| 2022-04-05 | 0.3825212419915378210 | 0.9126501722671725 |
| 2022-04-06 | 0.0028093503788113594 | 0.0163177577778697 |

### 5. Use the MATCHSTR template value

In this example, the `<<FIELD>>` template value is a placeholder for `test`, and the `<<MATCHSTR>>`template value represents the wildcarded value that follows `test` in each field name in the `eval` expression. This example uses the default `multifield` mode.

| makeresults
| eval test1 = 5, test2 = 10
| foreach test\* [eval <<FIELD>> = <<FIELD>> + <<MATCHSTR>>]

The results look something like this:

| \_time | test1 | test2 |
| --- | --- | --- |
| 2022-03-28 15:43:39 | 6 | 12 |

The value of each field is added to the value that replaces the wildcard in the field name. For example, for the `test1` field, 5 + 1 = 6.

### 6. Use the MATCHSEG1 and MATCHSEG2 template values

This example uses the default `multifield` mode. The `matchseg1` and `matchseg2` options are used to add each field value to the two values represented by the wildcard in the corresponding `<<MATCHSEG1>>` and `<<MATCHSEG2>>` template values.

| makeresults
| eval test1ab2=5, test2ab3=10
| foreach test\*ab\* fieldstr=MYFIELD matchseg1=SEG1 matchseg2=SEG2
[eval MYFIELD = MYFIELD + SEG1 + SEG2]

Let's take a closer look at the syntax for the `test1ab2=5` eval expression:

* The wildcard field is `test*ab*`.
* The `<<FIELD>>` template value called `MYFIELD`is `test1ab2=5`.
* The field value is 5.
* The `<<MATCHSEG1>>` template value called `SEG1` is 1.
* The `<<MATCHSEG2>>`template value called `SEG2` is 2.

The results of the search look something like this:

| \_time | test1ab2 | test2ab3 |
| --- | --- | --- |
| 2022-03-28 17:10:56 | 8 | 15 |

The value of the `test1ab2` field in the search results is 8 because 5 + 1 + 2 = 8.

### 7. Add values in a multivalue field using the auto\_collections mode

In this example using the `auto_collections` mode, `<<ITEM>>` is a placeholder for each number in the multivalue field, which is added to the total.

| makeresults
| eval mvfield=mvappend("1", "2", "3"), total=0
| foreach mode=auto\_collections
[eval total = total + <<ITEM>>]
| table mvfield, total

The results of the search look something like this.

| \_time | mvfield | total |
| --- | --- | --- |
| 2024-4-20 15:55:50 | 1   2   3 | 6 |

The previous search produces similar results as the following `eval` search, which also displays the total, but without listing each of the values that make up the total.

| makeresults
| eval total = 0
| eval total = total + 1
| eval total = total + 2
| eval total = total + 3

The search results look like this:

| \_time | total |
| --- | --- |
| 2024-4-20 15:55:50 | 6 |

### 8. Calculate grade averages using multivalue fields

To find the average of a set of student grades using the `multivalue` mode, you could run this search:

| makeresults
| eval teacher="James", student\_grades=mvappend("50", "100", "30"), sum = 0, count = 0
| foreach mode=multivalue student\_grades
[eval sum = sum + <<ITEM>>, count = count + 1]
| eval average = sum / count

The search results look something like this:

| \_time | average | count | student\_grades | sum | teacher |
| --- | --- | --- | --- | --- | --- |
| 2022-03-21 16:02:30 | 60 | 3 | 50   100   30 | 180 | James |

### 9. Add values in a JSON array

If you want to do something simple like add up each element in a JSON array, you could run a search like this:

| makeresults
| eval jsonfield=json\_array(1, 2, 3), total=0
| foreach mode=json\_array jsonfield
[eval total = total + <<ITEM>>]
| table jsonfield, total

The search results look like this:

| jsonfield | total |
| --- | --- |
| [1, 2, 3] | 6 |

### 10. Categorize employees by manager using multivalue fields

You can create lists of employee names and organize them by manager using the `eval` command or the `foreach` command. This is an example of a search on employees and their manager using the `eval` command:

| makeresults
| eval manager="Rutherford", employees=mvappend("Alex", "Claudia", "David")
| fields - \_time

The results of the `eval` search look something like this.

| employees | manager |
| --- | --- |
| Alex   Claudia   David | Rutherford |

To create multivalue fields of employee names and organize them by manager, you can run a similar search using multivalue fields with the `foreach` command:

| makeresults
| eval manager="Rutherford", employees=mvappend("Alex", "Claudia", "David"), employees\_array=json\_array()
| foreach mode=multivalue employees
[eval employees\_array=json\_append(employees\_array, "", <<ITEM>>)]
| fields - \_time

The search results this time look like this:

| employees | employees\_array | manager |
| --- | --- | --- |
| Alex   Claudia   David | ["Alex", "Claudia", "David"] | Rutherford |

### 11. Add values to a JSON array

Now let's take the names of the employees in a multivalue field and append them to a JSON array. In this search, the `employees_array` is empty.

| makeresults
| eval manager="Rutherford", employees=mvappend("Alex", "Claudia", "David"), employees\_array=json\_array()
| fields - \_time

The search results look like this:

| employees | employees\_array | manager |
| --- | --- | --- |
| Alex   Claudia   David | [ ] | Rutherford |

To copy all the values from the multivalue field into `json_array()`, use `foreach` to iterate over the `employees` values and append each of the employee names to the array, like this search:

| makeresults
| eval manager="Rutherford", employees=mvappend("Alex", "Claudia", "David"), employees\_array=json\_array()
| foreach mode=multivalue employees
[eval employees\_array=json\_append(employees\_array, "", <<ITEM>>)]
| fields - \_time

Now the search results look like this:

| employees | employees\_array | manager |
| --- | --- | --- |
| Alex   Claudia   David | ["Alex", "Claudia", "David"] | Rutherford |

The `foreach` command just copied over each of the employees' names to the JSON array.

### 12. Extracting values from a JSON array

What if you want to extract values for given key names from a JSON array and do something with them? For example, the following search extracts a list of employee IDs from a JSON array of employees and puts them in a new field called `ID_array` that you can use for other operations.

| makeresults
| eval manager="Rutherford", employees=mvappend("Alex", "Claudia", "David"), ID\_array=json\_array(), IDs=json\_object("Alex", 4125, "Claudia", 2538, "David", 3957)
| foreach mode=multivalue employees
[eval ID\_array=json\_append(ID\_array, "", json\_extract(IDs, <<ITEM>>))]
| fields - \_time

The results of this search look something like this:

| ID\_array | IDs | employees | manager |
| --- | --- | --- | --- |
| [4125,2538,3957] | {"Alex":4125,"Claudia":2538,"David":3957} | Alex   Claudia   David | Rutherford |

### 13. Multiplying elements in a JSON array

You can use the `foreach` command to multiply numbers and append to a JSON array in searches like this:

| makeresults
| eval price=json\_array(1,2,3,4), double\_price=json\_array()
| foreach mode=json\_array price
[eval double\_price = json\_append(double\_price, "", <<ITEM>> \* 2)]

The results look something like this:

| \_time | double\_price | price |
| --- | --- | --- |
| 2022-03-21 16:24:49 | [2,4,6,8] | [1,2,3,4] |

This search doubles each value in the array in `price` and then adds the values to a new array called `double_price`.

### 14. Calculating weights

To find the weights of values in a JSON array called `grades`, you could run a search like this:

| makeresults
| eval grades=json\_array(1,2,3,4), weight=json\_array()
| eval sum = 0
| foreach mode=json\_array grades
[eval sum = sum + <<ITEM>>]
| foreach mode=json\_array grades
[eval weight = json\_append(weight, "", <<ITEM>> / sum)]

The search results look something like this:

| \_time | grades | sum | weight |
| --- | --- | --- | --- |
| 2022-03-31 12:58:16 | [1,2,3,4] | 10 | [0.1,0.2,0.3,0.4] |

### 15. Iterate over multivalue fields and concatenate the values

The following example iterates over multivalue fields and concatenates the values, so that each letter is added to the index value in the search results.

|makeresults
|fields - \_time
|eval word=split("ABCDE",""), nums=split("01234","")
|foreach word mode=multivalue [eval word\_and\_num=mvappend(word\_and\_num, <<ITEM>>.mvindex(nums, <<ITER>>))]

The search results look like this:

| nums | word | word\_and\_num |
| --- | --- | --- |
| 0 | A | A0 |
| 1 | B | B1 |
| 2 | C | C2 |
| 3 | D | D3 |
| 4 | E | E4 |

## See also

Commands

[eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval), [map](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/map#id_05347ef5_9f31_49fa_a0c2_01558b2effb8__map)

Related information

[Evaluate and manipulate fields with multiple values](/en/?resourceId=Splunk_Search_Parsemultivaluefields)

[JSON functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/json-functions#e208618e_0a58_428d_8be9_194c0b1c17b6__JSON_functions)
