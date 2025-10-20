# Comparison and Conditional functions

The following list contains the functions that you can use to compare values or specify conditional statements.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

For information about Boolean operators, such as AND and OR, see [Boolean operators](/splunk-enterprise/search/spl-search-reference/10.0/introduction/understanding-spl-syntax#id_22487c18_26b3_45f4_97eb_4bde0f51545d__Understanding_SPL_syntax).

## case(<condition>,<value>,...)

### Description

Accepts alternating conditions and values. Returns the first value for which the condition evaluates to TRUE.

The `<condition>` arguments are Boolean expressions that are evaluated from first to last. When the first `<condition>` expression is encountered that evaluates to TRUE, the corresponding `<value>` argument is returned. The function defaults to NULL if none of the `<condition>` arguments are true.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

|  |
| --- |
| This example uses the sample data from the Search Tutorial, but should work with any format of Apache Web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the Yesterday time range when you run the search. |

The following example returns descriptions for the corresponding http status code.

sourcetype=access\_\* | eval description=case(status==200, "OK", status==404, "Not found", status==500, "Internal Server Error") | table status description

The results appear on the Statistics tab and look like this:

| status | description |
| --- | --- |
| 200 | OK |
| 200 | OK |
| 408 |  |
| 200 | OK |
| 404 | Not found |
| 200 | OK |
| 406 |  |
| 500 | Internal Server Error |
| 200 | OK |

For an example of how to display a default value when that status does not match one of the values specified, see the [True function](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/comparison-and-conditional-functions#d2244121_2330_4b87_b376_fb2c8cf98650__true.28.29).

### Extended example

This example shows you how to use the `case` function in two different ways, to create categories and to create a custom sort order.

|  |
| --- |
| This example uses recent earthquake data downloaded from the [USGS Earthquakes website](http://earthquake.usgs.gov/earthquakes/). The data is a comma separated ASCII text file that contains magnitude (mag), coordinates (latitude, longitude), region (place), and so forth, for each earthquake recorded. You can download a current CSV file from the [USGS Earthquake Feeds](http://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) and upload the file to your Splunk instance if you want follow along with this example. |

You want classify earthquakes based on depth. Shallow-focus earthquakes occur at depths less than 70 km. Mid-focus earthquakes occur at depths between 70 and 300 km. Deep-focus earthquakes occur at depths greater than 300 km. We'll use Low, Mid, and Deep for the category names.

source=all\_month.csv
| eval Description=case(depth<=70, "Low", depth>70 AND depth<=300, "Mid",
depth>300, "Deep")
| stats count min(mag) max(mag) by Description

The `eval` command is used to create a field called `Description`, which takes the value of "Low", "Mid", or "Deep" based on the `Depth` of the earthquake. The `case()` function is used to specify which ranges of the depth fits each description. For example, if the depth is less than 70 km, the earthquake is characterized as a shallow-focus quake; and the resulting `Description` is `Low`.

The search also pipes the results of the `eval` command into the `stats` command to count the number of earthquakes and display the minimum and maximum magnitudes for each Description.

The results appear on the Statistics tab and look like this:

| Description | count | min(Mag) | max(Mag) |
| --- | --- | --- | --- |
| Deep | 35 | 4.1 | 6.7 |
| Low | 6236 | -0.60 | 7.70 |
| Mid | 635 | 0.8 | 6.3 |

You can sort the results in the Description column by clicking the sort icon in Splunk Web. However in this example the order would be alphabetical returning results in Deep, Low, Mid or Mid, Low, Deep order.

You can also use the `case` function to sort the results in a custom order, such as Low, Mid, Deep. You create the custom sort order by giving the values a numerical ranking and then sorting based on that ranking.

source=all\_month.csv
| eval Description=case(depth<=70, "Low", depth>70 AND depth<=300, "Mid",
depth>300, "Deep")
| stats count min(mag) max(mag) by Description
| eval sort\_field=case(Description="Low", 1, Description="Mid", 2, Description="Deep",3)
| sort sort\_field

The results appear on the Statistics tab and look something like this:

| Description | count | min(Mag) | max(Mag) |
| --- | --- | --- | --- |
| Low | 6236 | -0.60 | 7.70 |
| Mid | 635 | 0.8 | 6.3 |
| Deep | 35 | 4.1 | 6.7 |

## cidrmatch(<cidr>,<ip>)

### Description

This function returns TRUE when an IP address, `<ip>`, belongs to a particular CIDR subnet, `<cidr>`.

Both `<cidr>` and `<ip>` are string arguments. If you specify a literal string value, instead of a field name, that value must be enclosed in double quotation marks.

The `cidrmatch` function supports IPv4 and IPv6 addresses and subnets that use CIDR notation.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example uses the `cidrmatch` and `if` functions to set a field, `isLocal`, to "local" if the field `ip` matches the subnet. If the `ip` field does not match the subnet, the `isLocal` field is set to "not local".

... | eval isLocal=if(cidrmatch("123.132.32.0/25",ip), "local", "not local")

The following example uses the `cidrmatch` function as a filter to remove events that do not match the `ip` address:

... | where cidrmatch("123.132.32.0/25", ip)

### Extended examples for IPv4 addresses

You can use the `cidrmatch` function to identify CIDR IP addresses by subnet. The following example uses `cidrmatch` with the `eval` command to compare an IPv4 address with a subnet that uses CIDR notation to determine whether the IP address is a member of the subnet. If there is a match, the search returns true in a new field called `result`.

| makeresults
| eval subnet="192.0.2.0/24", ip="192.0.3.0"
| eval result=if(cidrmatch(subnet, ip), "true", "false")

The IP address is not in the subnet, so search displays `false` in the `result` field. The search results look something like this.

| time | ip | result | subnet |
| --- | --- | --- | --- |
| 2020-11-19 16:43:31 | 192.0.3.0 | false | 192.0.2.0/24 |

In the following example, `cidrmatch` evaluates the IPv4 address 192.0.2.56 to find out if it is in the subnet. This time, instead of using the `eval` command with the `cidrmatch` function, we're using the `where` command, which eliminates any IP addresses that aren't within the subnet. This search compares the CIDR IP address with the subnet and filters the search results by returning the IP address only if it is true.

| makeresults
| eval ip="192.0.2.56"
| where cidrmatch("192.0.2.0/24", ip)

The IP address is located within the subnet, so it is displayed in the search results, which look like this.

| time | ip |
| --- | --- |
| 2020-11-19 16:43:31 | 192.0.2.56 |

Note that you can get the same results when using the [search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search) command, as shown in this example.

| makeresults
| eval ip="192.0.2.56"
| search ip="192.0.2.0/24"

The results of the search look like this.

| time | ip |
| --- | --- |
| 2020-11-19 16:43:31 | 192.0.2.56 |

### Extended examples for IPv6 addresses

The following example uses `cidrmatch` with the `eval` command to compare an IPv6 address with a subnet that uses CIDR notation to determine whether the IP address is a member of the subnet. If there is a match, search returns true in a new field called `result`.

| makeresults
| eval subnet="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff00/120", ip="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99"
| eval result = if(cidrmatch(subnet, ip), "true", "false")

The IP address is located within the subnet, so search displays `true`in the `result` field. The search results look something like this.

| time | ip | result | subnet |
| --- | --- | --- | --- |
| 2020-11-19 16:43:31 | 2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99 | true | 2001:0db8:ffff:ffff:ffff:ffff:ffff:ff00/120 |

The following example is another way to use `cidrmatch` to identify which IP addresses are in a subnet. This time, instead of using the `eval` command with the `cidrmatch` function, we're using the `where` command. This search compares the CIDR IPv6 addresses with the specified subnet and filters the search results by returning only the IP addresses that are in the subnet.

| makeresults
| eval ip="2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99"
| where cidrmatch("2001:0db8:ffff:ffff:ffff:ffff:ffff:ff00/120", ip)

The search results look something like this.

| time | ip |
| --- | --- |
| 2020-11-19 16:43:31 | 2001:0db8:ffff:ffff:ffff:ffff:ffff:ff99 |

### See also

Commands

[iplocation](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iplocation#id_4c1ae8b1_28de_453b_8d46_fbc07b9ea651__iplocation)

[lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup)

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)

## coalesce(<values>)

### Description

This function takes one or more values and returns the first value that is not NULL.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

You have a set of events where the IP address is extracted to either `clientip` or `ipaddress`. This example defines a new field called `ip`, that takes the value of either the `clientip` field or `ipaddress` field, depending on which field is not NULL (does not exist in that event). If both the `clientip` and `ipaddress` field exist in the event, this function returns the first argument, the `clientip` field.

... | eval ip=coalesce(clientip,ipaddress)

## false()

### Description

Use this function to return FALSE.

This function enables you to specify a conditional that is obviously false, for example 1==0. You do not specify a field with this function.

### Usage

This function is often used as an argument with other functions.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

## if(<predicate>,<true\_value>,<false\_value>)

### Description

If the `<predicate>` expression evaluates to TRUE, returns the `<true_value>`, otherwise the function returns the `<false_value>`.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `if` function is frequently used in combination with other functions.

### Basic examples

The following example looks at the values of the field `error`. If `error=200`, the function returns `err=OK`. Otherwise the function returns `err=Error`.

... | eval err=if(error == 200, "OK", "Error")

The following example uses the `cidrmatch` and `if` functions to set a field, `isLocal`, to "local" if the field `ip` matches the subnet. If the `ip` field does not match the subnet, the `isLocal` field is set to "not local".

... | eval isLocal=if(cidrmatch("123.132.32.0/25",ip), "local", "not local")

## in(<field>,<list>)

### Description

The function returns TRUE if one of the values in the list matches a value that you specify.

This function takes a list of comma-separated values.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions with other commands.

The following syntax is supported:

`...| where in(field,"value1","value2", ...)`

`...| where field in("value1","value2", ...)`

`...| eval new_field=if(in(field,"value1","value2", ...), "value-if_true","value-if-false")`

Note: The `eval` command cannot accept a Boolean value. You must specify the `in` function inside a function that can accept a Boolean value as input. Those functions are: `case`, `if`, and `validate`.

The string values must be enclosed in quotation marks. You cannot specify wildcard characters with the values to specify a group of similar values, such as HTTP error codes or CIDR IP address ranges. Use the IN operator instead.

The IN operator is similar to the `in` function. You can use the IN operator with the `search` and `tstats` commands. You can use wildcard characters in the VALUE-LIST with these commands.

### Basic examples

The following example uses the `where` command to return `in=TRUE` if one of the values in the `status` field matches one of the values in the list.

... | where status in("400", "401", "403", "404")

The following example uses the `in` function as the first parameter for the `if` function. The evaluation expression returns TRUE if the value in the `status` field matches one of the values in the list.

... | eval error=if(in(status, "error", "failure", "severe"),"true","false")

The following example uses the `where` command to return `in=TRUE` if the value `203.0.113.255` appears in either the `ipaddress` or `clientip` fields.

... | where "203.0.113.255" in(ipaddress, clientip)

### Extended example

The following example combines the `in` function with the `if` function to evaluate the `status` field. The value of `true` is placed in the new field `error` if the `status` field contains one of the values 404, 500, or 503. Then a count is performed of the values in the `error` field.

... | eval error=if(in(status, "404","500","503"),"true","false") | stats count by error

### See also

Blogs

[Smooth operator | Searching for multiple field values](https://www.splunk.com/content/splunk-blogs/en/2019/05/08/smooth-operator-searching-for-multiple-field-values.html)

## like(<str>,<pattern>)

### Description

This function returns TRUE only if `<str>` matches `<pattern>`. The match can be an exact match or a match using a wildcard:

* Use the percent ( % ) symbol as a wildcard for matching multiple characters
* Use the underscore ( \_ ) character as a wildcard to match a single character

The `<str>` can be a field name or a string value. The `<pattern>` must be a string expression enclosed in double quotation marks.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The following syntax is supported:

`...|eval new_field=if(like(<str>, <pattern>)`

`...| where like(<str>, <pattern>)`

`...| where <str> LIKE <pattern>`

Note: The `eval` command cannot accept a Boolean value. You must specify the `like` function inside a function that can accept a Boolean value as input. Those functions are: `case`, `if`, and `validate`.

### Basic examples

The following example returns `like=TRUE` if the field value starts with foo:

... | eval is\_a\_foo=if(like(field, "foo%"), "yes a foo", "not a foo")

The following example uses the `where` command to return `like=TRUE` if the `ipaddress` field starts with the value `198.`. The percent ( % ) symbol is a wildcard with the `like` function:

... | where like(ipaddress, "198.%")

## lookup(<lookup\_table>,<json\_object>,<json\_array>)

### Description

This function performs a CSV lookup. It returns the output field or fields in the form of a JSON object.

Note: The `lookup()` function is available only to Splunk Enterprise users.

### Syntax

lookup("<lookup\_table>", json\_object("<input\_field>", <match\_field>,...), json\_array("<output\_field>",...))

### Usage

You can use the `lookup()` function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `lookup()` function takes an `<input_field>` from a CSV `<lookup_table>`, finds events in the search result that have the `<match_field>`, and then identifies other field-value pairs from from the CSV table that correspond to the `input_field` and adds them to the matched events in the form of a JSON object.

The `lookup()` requires a `<lookup_table>`. You can provide this either a CSV lookup file or CSV lookup definition, enclosed within quotation marks. To provide a file, give the full filename of a CSV lookup file that is stored in the global lookups directory (`$SPLUNK_HOME/etc/system/lookups/`) or in a lookup directory that matches your current app context, such as `$SPLUNK_HOME/etc/users/<user>/<app>/lookups/`.

If the first quoted string does not end in ".csv", the `eval` processor assumes it is the name of a CSV lookup definition. Specified CSV lookup definitions must be shared globally. CSV lookup definitions cannot be private or shared to a specific app.

Note: Specify a lookup definition if you want the various settings associated with the definition to apply, such as limits on matches, case-sensitive match options, and so on.

A `lookup()` function can use multiple `<input_field>`/`<match_field>` pairs to identify events, and multiple `<output_field>` values can be applied to those events. Here is an example of valid `lookup()` syntax with multiple inputs, matches, and outputs.

... | eval <string>=lookup("<lookup\_table>", json\_object("<input\_field1>", <match\_field1>, "<input\_field2>", <match\_field2>), json\_array("<output\_field1>", "<output\_field2>", "<output\_field3>")

For more information about uploading CSV lookup files and creating CSV lookup definitions, see [Define a CSV lookup in Splunk Web](/?resourceId=Splunk_Knowledge_Usefieldlookupstoaddinformationtoyourevents) in the *Knowledge Manager Manual*.

The `lookup()` function uses two JSON functions for `eval`: `json_object` and `json_array`. JSON functions allow the eval processor to efficiently group things together. For more information, see [JSON functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/json-functions#e208618e_0a58_428d_8be9_194c0b1c17b6__JSON_functions) in the *Search Reference*.

### Examples

These examples show different ways to use the `lookup()` function.

### 1. Simple example that returns a JSON object with an array

This simple `makeresults` example returns an array that illustrates what `status_description` values are paired in the `http_status.csv` lookup table with a `status_type` of `Successful`.

This search returns: `output={"status_description":["OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content"]}`

| makeresults
| eval type = "Successful"
| eval output=lookup("http\_status.csv", json\_object("status\_type", type), json\_array("status\_description"))

### 2. Example of a search with multiple input and match field pairs

This search uses multiple input and match field pairs to show that an event with `type="Successful"` and `status="200"` matches a `status_description` of `OK` in the `http_status.csv` lookup table.

This search returns: `output={"status_description":"OK"}`

| makeresults
| eval type = "Successful", status="200"
| eval output=lookup("http\_status.csv", json\_object("status\_type", type, "status", status), json\_array("status\_description"))

### 3. Get counts of HTTP status description and type pairs

This example matches values of a `status` field in a `http_status.csv` lookup file with values of `status` fields in the returned events. It then generates JSON objects as values of a `status_details` field, with the corresponding `status_description` and `status_type` field-value pairs, and adds them to the events. Finally, it provides counts of the JSON objects, broken out by object.

Here is an example of a JSON object returned by this search: `status_details=JSON:{"status_description":"Created","status_type":"Successful"}`

index=\_internal
| eval output=lookup("http\_status.csv", json\_object("status", status), json\_array("status\_description", "status\_type")), status\_details="JSON:".output
| stats count by status\_details

### 4. Get counts of the HTTP status description values that have been applied to your events by a HTTP status eval lookup

This example shows how you can nest a `lookup` function inside another `eval` function. In this case it is the `json_extract` JSON function. This extracts `status_description` field-value pairs from the `json_array` objects and applies them to corresponding events. The search then returns a count of events with `status_description` fields, broken out by `status_description` value.

Here is an example of an extracted `status_description` value returned by this search. Compare it to the result returned by the third example: `status_details=Created`

index=\_internal
| eval status\_details=json\_extract(lookup("http\_status.csv", json\_object("status", status), json\_array("status\_description")), "status\_description")
| stats count by status\_details

## match(<str>, <regex>)

### Description

This function returns TRUE if the regular expression `<regex>` finds a match against any substring of the string value `<str>`. Otherwise returns FALSE.

### Usage

The `match` function is regular expression based. For example use the backslash ( \ ) character to escape a special character, such as a quotation mark. Use the pipe ( | ) character to specify an OR condition.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example returns TRUE if, and only if, `field` matches the basic pattern of an IP address. This examples uses the caret ( ^ ) character and the dollar ( $ ) symbol to perform a full match.

... | eval n=if(match(field, "^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"), 1, 0)

The following example uses the `match` function in an <eval-expression>. The `<str>` is a calculated field called `test`. The `<regex>` is the string `yes`.

... | eval matches = if(match(test,"yes"), 1, 0)

If the value is stored with quotation marks, you must use the backslash ( \ ) character to escape the embedded quotation marks. For example:

| makeresults | eval test="\"yes\"" | eval matches = if(match(test, "\"yes\""), 1, 0)

## null()

### Description

This function takes no arguments and returns NULL. The evaluation engine uses NULL to represent "no value". Setting a field value to NULL clears the field value.

### Usage

NULL values are field values that are missing in a some results but present in another results.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

Suppose you want to calculate the average of the values in a field, but several of the values are zero. If the zeros are placeholders for no value, the zeros will interfere with creating an accurate average. You can use the `null` function to remove the zeros.

### See also

* You can use the `fillnull` command to replace NULL values with a specified value.
* You can use the `nullif(X,Y)` function to compare two fields and return NULL if X = Y.

## nullif(<field1>, <field2>)

### Description

This function compares the values in two fields and returns NULL if the value in `<field1>` is equal to the value in `<field2>`. Otherwise the function returns the value in `<field1>`.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

Using the `makeresults` command, the following search creates a field called `names`. Another field called `ponies` is created based on the `names` field. The `if` function is used to change the name `buttercup` to `mistmane` in the `ponies` field.

| makeresults
| eval names="buttercup rarity tenderhoof dash"
| makemv delim=" " names
| mvexpand names
| eval ponies = if(names="buttercup", "mistmane", names)

The results look like this:

| \_time | names | ponies |
| --- | --- | --- |
| 2022-10-17 14:57:12 | buttercup | mistmane |
| 2022-10-17 14:57:12 | rarity | rarity |
| 2022-10-17 14:57:12 | tenderhoof | tenderhoof |
| 2022-10-17 14:57:12 | dash | dash |

Using the `nullif` function, you can compare the values in the `names` and `ponies` fields. If the values are different, the value from the first field specified are displayed in the `compare` field. If the values are the same, no value is returned.

... eval compare = nullif(names, ponies)

The results look like this:

| \_time | compare | names | ponies |
| --- | --- | --- | --- |
| 2022-10-17 14:57:12 | buttercup | buttercup | mistmane |
| 2022-10-17 14:57:12 |  | rarity | rarity |
| 2022-10-17 14:57:12 |  | tenderhoof | tenderhoof |
| 2022-10-17 14:57:12 |  | dash | dash |

## searchmatch(<search\_str>)

### Description

This function returns TRUE if the event matches the search string.

### Usage

To use the `searchmatch` function with the `eval` command, you must use the `searchmatch` function inside the `if` function.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example uses the `makeresults` command to create some simple results. The `searchmatch` function is used to determine if any of the results match the search string `"x=hi y=*"`.

| makeresults 1
| eval \_raw = "x=hi y=bye"
| eval x="hi"
| eval y="bye"
| eval test=if(searchmatch("x=hi y=\*"), "yes", "no")
| table \_raw test x y

The result of the `if` function is `yes`; the results match the search string specified with the `searchmatch` function.

## true()

### Description

Use this function to return TRUE.

This function enables you to specify a condition that is obviously true, for example 1==1. You do not specify a field with this function.

### Usage

This function is often used as an argument with other functions.

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

|  |
| --- |
| This example uses the sample data from the Search Tutorial, but should work with any format of Apache Web access log. To try this example on your own Splunk instance, you must download the sample data and follow the instructions to [get the tutorial data into Splunk](/?resourceId=Splunk_SearchTutorial_GetthetutorialdataintoSplunk). Use the Yesterday time range when you run the search. |

The following example shows how to use the `true()` function to provide a default value to the `case` function. If the values in the status field are not 200, or 404, the value used is Other.

sourcetype=access\_\* | eval description=case(status==200,"OK", status==404, "Not found", true(), "Other") | table status description

The results appear on the Statistics tab and look like this:

| status | description |
| --- | --- |
| 200 | OK |
| 200 | OK |
| 408 | Other |
| 200 | OK |
| 404 | Not found |
| 200 | OK |
| 200 | OK |
| 406 | Other |
| 200 | OK |

## validate(<condition>, <value>,...)

### Description

This function takes a list of conditions and values and returns the value that corresponds to the condition that evaluates to FALSE. This function defaults to NULL if all conditions evaluate to TRUE.

This function is the opposite of the `case` function.

### Usage

The `<condition>` arguments must be expressions.

The `<value>` arguments must be strings.
You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

The following example runs a simple check for valid ports.

... | eval n=validate(isint(port), "ERROR: Port is not an integer", port >= 1 AND port <= 65535, "ERROR: Port is out of range")
