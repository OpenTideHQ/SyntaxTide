# Statistical eval functions

The following list contains the evaluation functions that you can use to calculate statistics.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

In addition to these functions, there is a comprehensive set of [statistical functions](/splunk-enterprise/search/spl-search-reference/10.0/statistical-and-charting-functions/statistical-and-charting-functions#id_102ea92e_a6a3_42a7_80ce_feb3069051e0__Statistical_and_charting_functions) that you can use with the `stats`, `chart`, and related commands.

## avg(<values>)

### Description

This function takes one or more values and returns the average of numerical values as an integer. Each argument must be either a field (single or multivalue) or an expression that evaluates to a number. At least one numeric argument is required. When the function is applied to a multivalue field, each numeric value of the field is included in the total. The `eval` command ignores arguments that don't exist in an event or can't be converted to a number.

To get the numerical average or mean of the values of two fields, x and y, note that `avg(x,y)` is equivalent to `sum(x,y)/(mvcount(x) + mvcount(y))`.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

Example 1: The following example creates a field called `a` with value 5.0, a field called `b` with value 9, and a field called `x` with value 7 that is the average of `a` and `b`. A field is not created for `c` and it is not included in the total because a value was not declared for that argument.

... | eval a = 5.0, b = "9", x = avg(a, b, c)Example 2: The following example calculates the average of three numbers and returns c=2.... | eval c=avg(1, 2, 3)

However, the following example returns an error because one of the arguments in the function is a string.

... | eval c=avg(1, 2, "3")

To use a quoted string as a number within the function, you must convert the number to an integer, as shown in the following example where c=2:

... | eval c=avg(1, 2, tonumber("3")Example 3: In this example, a field with a value that is a string results in a field called `a` with value 1, and a field called `c` with value 2,... | eval a="1", c=avg(a, 2, 3)Example 4: When an argument is a field, the `eval` command retrieves the value and attempts to treat it as a number, even if it is a string. The following example creates a field called `a` with value somedata, and a field called `c` with value 2.5.... | eval a="somedata", c=avg(a, 2, 3)

However, the following example returns an error because the string argument is specified directly within the function.

... | eval c=avg("somedata", 2, 3)

## max(<values>)

### Description

This function takes one or more numeric or string values, and returns the maximum.
Strings are greater than numbers.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example returns either `"foo"` or the value in the `name` field. Splunk searches use lexicographical order, where numbers are sorted before letters. If the value in the `name` field is `"baz"`, then `"foo"` is returned. If the value in the `name` field is `"zaz"`, then `"zaz"` is returned.

... | eval n=max(1, 3, 6, 7, "foo", name)The following example returns the maximum value in a multivalue field.

This search creates a field called `n` with a single value, which is a series of numbers. The `makemv` command is used to make the single value into multiple values, each of which appears on it's own row in the results. Another new field called `maxn` is created which takes the values in `n` and returns the maximum value, `6`.

| makeresults | eval n = "1 3 5 6 4 2" | makemv n
| eval maxn = max(n)

The results look like this:

| \_time | maxn | n |
| --- | --- | --- |
| 2021-01-29 10:42:37 | 6 | 1   3   5  6  4  2 |

## min(<values)

### Description

This function takes one or more numeric or string values, and returns the minimum. Strings are greater than numbers.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example returns either `3` or the value in the `size` field. Splunk searches use lexicographical order, where numbers are sorted before letters. If the value in the `size` field is `9`, then `3` is returned. If the value in the `size` field is `1`, then `1` is returned.

... | eval n=min(3, 6, 7, "maria", size)The following example returns the minimum value in a multivalue field.

This search creates a field called `n` with a single value, which is a series of numbers. The `makemv` command is used to make the single value into multiple values, each of which appears on it's own row in the results. Another new field called `minn` is created which takes the values in `n` and returns the minimum value, `2`.

| makeresults | eval n = "3 5 6 4 7 2" | makemv n
| eval minn = min(n)

The results look like this:

| \_time | minn | n |
| --- | --- | --- |
| 2021-01-29 10:42:37 | 2 | 3   5   6  4  7  2 |

## random()

### Description

This function takes no arguments and returns a pseudo-random integer ranging from zero to 231-1.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example returns a random integer, such as `0...2147483647`.

... | eval n=random()The following example returns a random number within a specified range. In this example, the random number is between 1 and 100,000.... | eval n=(random() % 100000) + 1This example takes a random number and uses the modulo mathematical operator ( % ) to divide the random number by 100000. This ensures that the random number returned is not greater than 100000. The number remaining after the division is increased by 1 to ensure that the number is at least greater than or equal to 1.
