# Text functions

The following list contains the functions that you can use with string values.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

## len(<str>)

### Description

This function returns a count of the UTF-8 code points in a string. While the character length and number of code points are identical for some strings in English, the count is not the same for all strings, including strings in other languages.

Note: If your strings contain non-ASCII characters that aren't in UTF-8 format, you must perform a code conversion before using the `len` function in searches.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

This function is not supported on multivalue fields.

### Basic example

Suppose you have a set of results that looks something like this:

| \_time | names |
| --- | --- |
| 2020-01-09 16:35:14 | buttercup |
| 2020-01-09 16:35:14 | rarity |
| 2020-01-09 16:35:14 | tenderhoof |
| 2020-01-09 16:35:14 | dash |
| 2020-01-09 16:35:14 | mistmane |

You can determine the length of the values in the `names` field using the `len` function:

... | eval length=len(names)

The results show a count of the character length of the values in the `names` field:

| \_time | length | names |
| --- | --- | --- |
| 2020-01-09 16:35:14 | 9 | buttercup |
| 2020-01-09 16:35:14 | 6 | rarity |
| 2020-01-09 16:35:14 | 10 | tenderhoof |
| 2020-01-09 16:35:14 | 4 | dash |
| 2020-01-09 16:35:14 | 8 | mistmane |

## lower(<str>)

### Description

This function takes one string argument and returns the string in lowercase.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function on multivalue fields.

### Basic example

The following example returns the value provided by the field `username` in lowercase.

... | eval username=lower(username)

## ltrim(<str>,<trim\_chars>)

### Description

This function removes characters from the left side of a string.

### Usage

The `<str>` argument can be the name of a string field or a string literal.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `<trim_chars>` argument is optional. If not specified, spaces and tabs are removed from the left side of the string.

This function is not supported on multivalue fields.

### Basic example

The following example trims the leading spaces and all of the occurrences of the letter Z from the left side of the string. The value that is returned is x="abcZZ ".

... | eval x=ltrim(" ZZZZabcZZ ", " Z")

The following example removes the dollar sign ( $ ) from the results for the NET\_COST field.

... | eval cost=ltrim(NET\_COST, "$")

## replace(<str>,<regex>,<replacement>)

### Description

This function substitutes the replacement string for every occurrence of the regular expression in the string.

### Usage

The `<str>` argument can be the name of a string field or a string literal.

The `<replacement>` argument can also reference groups that are matched in the `<regex>` using perl-compatible regular expressions (PCRE) syntax.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

This function is not supported on multivalue fields.

To replace a backslash ( \ ) character, you must escape the backslash twice. This is because the `replace` function occurs inside an eval expression. The eval expression performs one level of escaping before passing the regular expression to PCRE. Then PCRE performs its own escaping. See [SPL and regular expressions](/?resourceId=Splunk_Search_SPLandregularexpressions).

### Basic example

The following example returns the values in the `date` field, with the month and day numbers switched. If the input is 1/14/2023 the return value would be 14/1/2023.

... | eval n=replace(date, "^(\d{1,2})/(\d{1,2})/", "\2/\1/")

## rtrim(<str>,<trim\_chars>)

### Description

This function removes the trim characters from the right side of the string.

### Usage

The `<str>` argument can be the name of a string field or a string literal.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `<trim_chars>` argument is optional. If not specified, spaces and tabs are removed from the right side of the string.

This function is not supported on multivalue fields.

### Basic example

The following example trims the leading spaces and all of the occurrences of the letter Z from the right side of the string. The value returned is  `ZZZZabc`.

... | eval n=rtrim(" ZZZZabcZZ ", " Z")

## spath(<value>,<path>)

### Description

Use this function to extract information from the structured data formats XML and JSON.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `<value>` is an input source field.

The `<path>` is an spath expression for the location path to the value that you want to extract from.

* If `<path>` is a literal string, you need to enclose the string in double quotation marks.
* If `<path>` is a field name, with values that are the location paths, the field name doesn't need quotation marks. Using a field name for `<path>` might result in a multivalue field.

This function is not supported on multivalue fields.

### Basic example

The following example returns the values of locDesc elements.

... | eval locDesc=spath(\_raw, "vendorProductSet.product.desc.locDesc")The following example returns the hashtags from a twitter event.

`index=twitter | eval output=spath(_raw, "entities.hashtags")`

## substr(<str>,<start>,<length>)

### Description

This function returns a substring of a string, beginning at the start index. The length of the substring specifies the number of character to return.

### Usage

The <str> argument can be the name of a string field or a string literal.

The indexes follow SQLite semantics; they start at 1. Negative indexes can be used to indicate a start from the end of the string.

The <length> is optional, and if not specified returns the rest of the string.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

This function is not supported on multivalue fields.

### Basic example

The following example concatenates "str" and "ing" together, returning "string":

... | eval n=substr("string", 1, 3) + substr("string", -3)

## trim(<str>,<trim\_chars>)

### Description

This function removes the trim characters from both sides of the string.

### Usage

The `<str>` argument can be the name of a string field or a string literal.

The `<trim_chars>` argument is optional. If not specified, spaces and tabs are removed from both sides of the string.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

This function is not supported on multivalue fields.

### Basic example

The following example trims the leading spaces and all of the occurrences of the letter Z from the left and right sides of the string. The value returned is `abc`.

... | eval n=trim(" ZZZZabcZZ ", " Z")

## upper(<str>)

### Description

This function returns a string in uppercase.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

You can use this function on multivalue fields.

### Basic example

The following example returns the value provided by the field `username` in uppercase.

... | eval n=upper(username)

## urldecode(<url>)

### Description

This function takes one URL string argument X and returns the unescaped or decoded URL string.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

This function is not supported on multivalue fields.

### Basic example

The following example returns "http://www.splunk.com/download?r=header".

... | eval n=urldecode("http%3A%2F%2Fwww.splunk.com%2Fdownload%3Fr%3Dheader")

## See also

Related functions

[tostring](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/conversion-functions#id_821f8876_7ce3_4038_b079_189e07a7a4ab__tostring.28.26lt.3Bvalue.26gt.3B.2C.26lt.3Bformat.26gt.3B.29)
