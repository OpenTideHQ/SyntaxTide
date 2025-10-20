# head

## Description

Returns the first N number of specified results in search order. This means the most recent N events for a historical search, or the first N captured events for a real-time search. The search results are limited to the first results in search order.

There are two types of limits that can be applied: an absolute number of results, or an expression where all results are returned until the expression becomes false.

## Syntax

The required syntax is in bold.

head

[<N> | (<eval-expression>)]

[limit=<int>]

[null=<bool>]

[keeplast=<bool>]

### Required arguments

None.

If no options or limits are specified, the `head` command returns the first 10 results.

### Optional arguments

<N>

Syntax: <int>

Description: The number of results to return.

Default: 10

limit

Syntax: limit=<int>

Description: Another way to specify the number of results to return.

Default: 10

eval-expression

Syntax: <eval-compare-exp> | <eval-bool-exp>

Description: A valid `<eval-expression>` that evaluates to a Boolean. The search returns results until this expression evaluates to false. For more information, see the [evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) in the *Search Reference*.

keeplast

Syntax: keeplast=<bool>

Description: You must specify a `eval-expression` to use the `keeplast` argument. Controls whether the last result in the result set is retained. The last result returned is the result that caused the `eval-expression` to evaluate to `false` or `NULL`. Set `keeplast` to `true` to retain the last result in the result set. Set `keeplast` to `false` to discard the last result.

Default: false

null

Syntax: null=<bool>

Description: You must specify an <eval-expression> for the `null` argument to have any effect. Controls how an <eval-expression> that evaluates to NULL is handled. For example, if the <eval-expression> is `(x > 10)` and a value in field x does not exist, the <eval-expression> evaluates to NULL instead of true or false.

* If `null=true`, the results of the `head` command include events for which <eval-expression> evaluates to NULL in the output. The `head` command continues to process the remaining events.
* If `null=false`, the `head` command treats the <eval-expression> that evaluates to NULL as if the <eval-expression> evaluated to `false`. The `head` command stops processing events. If `keeplast=true`, the event for which the <eval-expression> evaluated to NULL is also included in the output.

Default: false

## Usage

The `head` command is a [centralized streaming command](https://docs.splunk.com/Splexicon:Streamingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Setting limits

If a numeric limit such as a numeric literal or the argument `limit=<int>` is used, the `head` command returns the first N results where N is the selected number. Using both the numeric limit and `limit=<int>` results in an error.

### Using an <eval-expression>

If an <eval-expression> is used, all initial results are returned until the first result where the expression evaluates to false. The result where the <eval-expression> evaluates to false is kept or dropped based on the `keeplast` argument.

If both a numeric limit and an <eval-expression> are used, the smaller of the two constraints applies. For example, the following search returns up to the first 10 results, because the <eval-expression> is always true.

... |head limit=10 (1==1)

However, this search returns no results because the <eval-expression> is always false.

... |head limit=10 (0==1)

## Basic examples

### 1. Return a specific number of results

Return the first 20 results.

... | head 20

### 2. Return results based on a specified limit

Return events until the time span of the data is >= 100 seconds

... | streamstats range(\_time) as timerange | head (timerange<100)

## Extended example

### 1. Using the keeplast and null arguments

The following example shows the search results when an <eval-expression> evaluates to NULL, and the impact of the `keeplast` and `null` arguments on those results.

Let's start with creating a set of events. The `eval` command replaces the value 3 with NULL in the count field.

| makeresults count=7
| streamstats count
| eval count=if(count=3,null(), count)

The results look something like this:

| \_time | count |
| --- | --- |
| 2020-05-18 12:46:51 | 1 |
| 2020-05-18 12:46:51 | 2 |
| 2020-05-18 12:46:51 |  |
| 2020-05-18 12:46:51 | 4 |
| 2020-05-18 12:46:51 | 5 |
| 2020-05-18 12:46:51 | 6 |
| 2020-05-18 12:46:51 | 7 |

When `null` is set to `true`, the `head` command continues to process the results. In this example the command processes the results, ignoring NULL values, as long as the count is less than 5. Because `keeplast=true` the event that stopped the processing, count 5, is also included in the output.

| makeresults count=7
| streamstats count
| eval count=if(count=3,null(), count)
| head count<5 keeplast=true null=true

The results look something like this:

| \_time | count |
| --- | --- |
| 2020-05-18 12:46:51 | 1 |
| 2020-05-18 12:46:51 | 2 |
| 2020-05-18 12:46:51 |  |
| 2020-05-18 12:46:51 | 4 |
| 2020-05-18 12:46:51 | 5 |

When `null` is set to `false`, the `head` command stops processing the results when it encounters a NULL value. The events with count 1 and 2 are returned. Because `keeplast=true` the event with the NULL value that stopped the processing, the third event, is also included in the output.

| makeresults count=7
| streamstats count
| eval count=if(count=3,null(), count)
| head count<5 keeplast=true null=false

The results look something like this:

| \_time | count |
| --- | --- |
| 2020-05-18 12:46:51 | 1 |
| 2020-05-18 12:46:51 | 2 |
| 2020-05-18 12:46:51 |  |

## See also

Commands

[reverse](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/reverse#id_7c85ccb6_6bc2_4463_9b61_c1ca705f8d70__reverse)

[tail](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tail#id_19606654_05b8_40f6_925a_f848b331f05b__tail)
