# Informational functions

The following list contains the functions that you can use to return information about a value.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

## isarray(<value>)

### Description

This function takes one argument and evaluates whether the value is an array data type. The function returns `TRUE` if the value is an array.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following search returns `True` because `[1, 2, 3]` is an array.

| makeresults
| eval result = if(isarray("[1, 2, 3]"), "True", "False")

The result of the following search is `False` because `1` is not an array.

| makeresults
| eval result = if(isarray(1), "True", "False")

## isbool(<value>)

### Description

This function takes one argument and evaluates whether the value is a Boolean data type. The function returns `TRUE` if the value is Boolean.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

Use this function with other functions that return Boolean data types, such as `cidrmatch` and `mvfind`.

This function cannot be used to determine if field values are "true" or "false" because field values are either string or number data types. Instead, use syntax such as `<fieldname>=true OR <fieldname>=false` to determine field values.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following search returns `True` because `1==2` is Boolean.

| makeresults
| eval result = if(isbool(1==2), "True", "False")

The following search returns `False` because the value `a` is not Boolean.

| makeresults
| eval result = if(isbool(a), "True", "False")

## isdouble(<value>)

### Description

This function takes one argument and evaluates whether the value is a double data type. The function returns `TRUE` if the value is a double value.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following search returns `True` because the value `3.546` is a double.

| makeresults
| eval result = if(isdouble(3.546), "True", "False")

The following example returns `False` because `1000000` is not a double.

... | eval result = if(isdouble(1000000), "True", "False")

## isint(<value>)

### Description

This function takes one argument and returns `TRUE` if the value is an integer.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example uses the `isint` function with the `if` function. A field, "n", is added to each result with a value of "int" or "not int", depending on the result of the `isint` function. If the value of "field" is a number, the `isint` function returns TRUE and the value adds the value "int" to the "n" field.

... | eval n=if(isint(field),"int", "not int")

The following example shows how to use the `isint` function with the `where` command.

... | where isint(field)

## ismv(<value>)

### Description

This function takes one argument and evaluates whether the field is a multivalue data type. The function returns `TRUE` if the field is a multivalue.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example returns `True` because the value in the `number_list` field is a multivalue.

... | eval number\_list=split("1, 2, 3", ",")
| eval result=if(ismv(number\_list), "True", "False")

The result looks like this:

| \_time | number\_list | result |
| --- | --- | --- |
| 2024-12-11 00:49:31 | 1 2   3 | True |

## isnotnull(<value>)

### Description

This function takes one argument and returns `TRUE` if the value is not NULL.

### Usage

This function is useful for checking for whether or not a field contains a value.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example uses the `isnotnull` function with the `if` function. A field, "n", is added to each result with a value of "yes" or "no", depending on the result of the `isnotnull` function. If the value of "field" is a number, the `isnotnull` function returns TRUE and the value adds the value "yes" to the "n" field.

... | eval n=if(isnotnull(field),"yes","no")

The following example shows how to use the `isnotnull` function with the `where` command.

... | where isnotnull(field)

## isnull(<value>)

### Description

This function takes one argument and returns TRUE if the value is NULL..

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example uses the `isnull` function with the `if` function. A field, "n", is added to each result with a value of "yes" or "no", depending on the result of the `isnull` function. If there is no value for "field" in a result, the `isnull` function returns TRUE and adds the value "yes" to the "n" field.

... | eval n=if(isnull(field),"yes","no")

The following example shows how to use the `isnull` function with the `where` command.

... | where isnull(field)

## isnum(<value>)

### Description

This function takes one argument and returns TRUE if the value is a number.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Using isnum in searches with NaN

In eval functions, fields can be either a string or a number. Working with `NaN` (Not a Number) values in the Splunk platform can be challenging because Splunk fields contain values that can be processed as either strings or numeric values based on their context. This can create confusion between a numeric `NaN` value, and the string representation of that value, "NaN". For example, depending on the kind of value that is needed to satisfy the current calculation, a `NaN` can be a numeric `NaN`, or a string `"NaN"` that can be interpreted as a numeric value or treated as a string. If your data contains `"NaN"`, you should proceed with caution when using searches that require `NaN` handling in SPL because `NaN` values can behave in unexpected ways.

If you're using `"NaN"` in your searches with the `isnum` command, it's important to distinguish between a literal string `"NaN"` and a field containing the value `"NaN"`. When a field contains a `"NaN"` string, the `"NaN"` behaves as both a string and a number. However, when a `"NaN"` value is present as a literal string in an evaluator expression, it is considered a string, not a number.

For example, because `"NaN"` is just a collection of characters, it is considered a string and returns `false` in a search like `isnum("NaN")`. However, if the same value is stored as `"NaN"` in a field, it is parsed as a numeric type. For example, say you run the following search.

| makeresults
| eval strval="NaN", numval=strval % 1
| fields - \_time
| eval literalIsNumeric=if(isnum("anystring"), "true", "false")
| eval literalNanIsNumeric=if(isnum("NaN"), "true", "false")
| eval numvalIsNumeric=if(isnum(numval), "true", "false")
| eval strvalIsNumeric=if(isnum(strval), "true", "false")
| transpose

Your results look like this. Notice that `literalNanIsNumeric` is `false` because the `isnum` command interprets `"NaN"` as a string, not a number.

| column | row |
| --- | --- |
| literalIsNumeric | false |
| literalNanIsNumeric | false |
| numval | NaN |
| numvalIsNumeric | true |
| strval | NaN |
| strvalIsNumeric | true |

It can be difficult to determine whether a value stored in a numeric field is a `NaN` or a literal value. A reliable test for `NaN` in the Splunk platform to confirm that a value is a real numeric `NaN` is to include the following search string in your search:

| eval isnan=if(isnum(numval), match(numval,"NaN"), false)

For example, if the value you're testing is `"NaN"`, the search returns `isnan` is `True`, like the following search:

| makeresults
| eval strval="NaN", numval=strval % 1
| eval isnan=if(isnum(numval), match(numval,"NaN"), false)
| transpose

See [Numeric calculations](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#id_13ff3aa2_5902_4937_989f_2e46ff409422__Numeric_calculations).

### Basic examples

The following example uses the `isnum` function with the `if` function. A field, "n", is added to each result with a value of "yes" or "no", depending on the result of the `isnum` function. If the value of "field" is a number, the `isnum` function returns TRUE and the value adds the value "yes" to the "n" field.

... | eval n=if(isnum(field),"yes","no")

The following example shows how to use the `isnum` function with the `where` command.

... | where isnum(field)

## isobject(<value>)

### Description

This function takes one argument and evaluates whether the value is an object. The function returns `TRUE` if a string is a valid JSON object.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example returns `False` because the value in the `games` field isn't a valid JSON object.

... | eval games = "Ticket to Ride, Settlers of Catan"
| eval result = if(isobject("games"), "True", "False")

The following example returns `True` because the value in the `games` field is a valid JSON object.

... | eval games = "{\"type\": \"competitive\", \"name\": \"Ticket to Ride\"}"
| eval result = if(isobject(games), "True", "False")

Say you run the following search.

| makeresults
|eval is\_an\_object = if(isobject("{cities: \"3\"}"), "is object", "is not object")

Your results look like this.

| \_time | is\_an\_object |
| --- | --- |
| 2024-12-19 21:49:04 | is not object |

## isstr(<value>)

### Description

This function takes one argument and returns TRUE if the value is a string.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Using isstr in searches with NaN

In eval functions, fields can be either a string or a number. Working with `NaN` (Not a Number) values in the Splunk platform can be challenging because Splunk fields contain values that can be processed as either strings or numeric values based on their context. This can create confusion between a numeric `NaN` value, and the string representation of that value, "NaN". For example, depending on the kind of value that is needed to satisfy the current calculation, a `NaN` can be a numeric `NaN`, or a string `"NaN"` that can be interpreted as a numeric value or treated as a string. If your data contains `"NaN"`, you should proceed with caution when using searches that require `NaN` handling in SPL because `NaN` values can behave in unexpected ways.

If you're using `"NaN"` in your searches with the `isstr` command, the distinction between a literal string `"NaN"` and a field containing the value `"NaN"` is not as important as it is with the `isnum` command. When a `"NaN"` string is contained in a field, the `"NaN"` behaves as both a string and a number. But, when a `"NaN"` value is present as a literal string in an evaluator expression, it is considered a string, not a number. In both cases, the `isstr` command parses the `"NaN"` value as a string.

For example, say you run the following search.

| makeresults
| eval strval="NaN", numval=strval % 1
| fields - \_time
| eval literalIsStr=if(isstr("anystring"), "true", "false")
| eval literalNanIsStr=if(isstr("NaN"), "true", "false")
| eval numvalIsStr=if(isstr(numval), "true", "false")
| eval strvalIsStr=if(isstr(strval), "true", "false")
| transpose

Your results look like this. Notice that, as expected, each `isstr` test identifies `"NaN"` as a string, regardless of whether the `"NaN"` is a string or numeric value.

| column | row |
| --- | --- |
| literalIsStr | true |
| literalNanIsStr | true |
| numval | NaN |
| numvalIsStr | true |
| strval | NaN |
| strvalIsStr | true |

See [Numeric calculations](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#id_13ff3aa2_5902_4937_989f_2e46ff409422__Numeric_calculations).

### Basic examples

The following example uses the `isstr` function with the `if` function. A field, "n", is added to each result with a value of "yes" or "no", depending on the result of the `isstr` function. If the value of "field" is a string, the `isstr` function returns TRUE and the value adds the value "yes" to the "n" field.

... | eval n=if(isstr(field),"yes","no")

The following example shows how to use the `isstr` function with the `where` command.

... | where isstr(field)

## typeof(<value>)

### Description

This function takes one argument and returns the data type of the argument.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example takes one argument and returns a string representation of its type. This example returns "NumberStringBoolInvalid"

... | eval n=typeof(12) + typeof("string") + typeof(1==2) + typeof(badfield)

The following example creates a single result using the `makeresults` command.

| makeresults

For example:

| \_time |
| --- |
| 2018-08-14 14:00:15 |

To determine the data type of the `_time` field, use the `eval` command with the `typeof` function. For example:

| makeresults | eval t=typeof(\_time)

The results are:

| \_time | t |
| --- | --- |
| 2018-08-14 14:00:15 | Number |
