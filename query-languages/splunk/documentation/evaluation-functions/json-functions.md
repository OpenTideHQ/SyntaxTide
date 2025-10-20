# JSON functions

The following table describes the functions that are available for you to use to create or manipulate JSON objects:

| Description | JSON function |
| --- | --- |
| Creates a new JSON object from key-value pairs. | [json\_object](#id_6a12a2ac_7d61_424a_ad9d_a9f7c6438160__json_object.28.26lt.3Bmembers.26gt.3B.29) |
| Evaluates whether a value can be parsed as JSON. If the value is JSON, the function returns the value. Otherwise, the function returns null. | [json](#cdda4959_8fc6_4edb_a374_82308777cb4d__json.28.26lt.3Bvalue.26gt.3B.29) |
| Appends elements to the contents of a valid JSON object. | [json\_append](#e088ab24_8a73_4549_afaa_649b643a88c2__json_append.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bpath_value_pairs.26gt.3B.29) |
| Creates a JSON array using a list of values. | [json\_array](#id_48fc8828_6579_4b85_8360_fab5453a1eb7__json_array.28.26lt.3Bvalues.26gt.3B.29) |
| Maps the elements of a JSON array to a multivalued field. | [json\_array\_to\_mv](#id_328e7783_4b6a_4a11_bdd2_acc7a24e7c13) |
| Removes one or more keys and their corresponding values from the specified JSON object. | [json\_delete](#e1d0bff6_e301_4880_8e8d_daf710234e07__json_delete.28.26lt.3Bobject.26gt.3B.2C.26lt.3Bkeys.26gt.3B.29) |
| Converts a value to an array of JSON objects with key and value fields. | [json\_entries](#dd813aae_9396_485b_ba7f_bd6dea10ca04__json_entries.28.26lt.3Bvalue.26gt.3B.29) |
| Extends the contents of a valid JSON object with the values of an array. | [json\_extend](#id_8a7ea9a6_f6c8_4b9b_baa8_1898458ceb43__json_extend.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bpath_value_pairs.26gt.3B.29) |
| Returns either a JSON array or a Splunk software native type value from a field and zero or more paths. | [json\_extract](#id_716ba25f_315e_4095_8639_24c8539e8aa2__json_extract.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bpaths.26gt.3B.29) |
| Returns Splunk software native type values from a piece of JSON by matching literal strings in the event and extracting them as keys. | [json\_extract\_exact](#id_97a72a59_d0a3_4ebb_b0f1_e4a4dbc0a4da__json_extract_exact.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bkeys.26gt.3B.29) |
| Returns TRUE if the field value is a JSON key in the provided JSON object. | [json\_has\_key\_exact](#cba30966_dc57_4e5e_af7c_b7da9a4944c7__json_has_key_exact.28.26lt.3Bobject.26gt.3B.2C_.26lt.3Bkey.26gt.3B.29) |
| Returns the keys from the key-value pairs in a JSON object. The keys are returned as a JSON array. | [json\_keys](#a9be9c2f_1b53_445c_abec_5720614cdaa9__json_keys.28.26lt.3Bjson.26gt.3B.29) |
| Inserts or overwrites values for a JSON node with the values provided and return an updated JSON object. | [json\_set](#id_4dda6c77_4316_4297_8561_fe49e8a9fe35__json_set.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bpath_value_pairs.26gt.3B.29) |
| Generates or overwrites a JSON object using the key-value pairs specified. | [json\_set\_exact](#id_2207f3c6_ed02_4a42_b4b0_05229ba759ad__json_set_exact.28.26lt.3Bjson.26gt.3B.2C_.26lt.3Bkey_value_pairs.26gt.3B.29) |
| Evaluates whether a JSON object uses valid JSON syntax and returns either TRUE or FALSE. | [json\_valid](#id_9a335a37_c74b_47cb_b80f_d4c5abea4670__json_valid.28.26lt.3Bjson.26gt.3B.29) |

## json\_object(<members>)

Creates a new JSON object from members of key-value pairs.

### Usage

If you specify a string for a `<key>` or `<value>`, you must enclose the string in double quotation marks. A `<key>` must be a string. A `<value>` can be a string, number, Boolean, null, multivalue field, array, or another JSON object.

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Examples

These examples show different ways to use the `json_object` function to create JSON objects in your events.

### 1. Create a basic JSON object

The following example creates a basic JSON object `{ "name": "maria" }`.

... | eval name = json\_object("name", "maria")

### 2. Create a JSON object using a multivalue field

The following example creates a multivalue field called `firstnames` that uses the key `name` and contains the values "maria" and "arun". The JSON object created is `{ "name": ["maria", "arun"] }` .

... | eval firstnames = json\_object("name", json\_array("maria", "arun"))

### 3. Create a JSON object using a JSON array

The following example creates a JSON object that uses a JSON array for the values.

... | eval locations = json\_object("cities", json\_array("London", "Sydney", "Berlin", "Santiago"))

The result is the JSON object `{ "cities": ["London", "Sydney", "Berlin", "Santiago"] }`.

### 4. Create a nested JSON object

The following example creates a nested JSON object that uses other JSON objects and a multivalue or JSON array field called `gamelist`.

...| eval gamelist = json\_array("Pandemic", "Forbidden Island", "Castle Panic"), games = json\_object("category", json\_object("boardgames", json\_object("cooperative", gamelist)))

The result is this JSON object:

{
"games": {
"category": {
"boardgames": {
"cooperative": [ "Pandemic", "Forbidden Island", "Castle Panic" ]
}
}
}
}

## json(<value>)

Evaluates whether a value can be parsed as JSON. If the value is in a valid JSON format, the function returns the value. Otherwise, the function returns null.

### Usage

A `<value>` can be any kind of value such as string, number, Boolean, null, or JSON array or object.

### Examples

### 1. Identify a JSON value

This example shows how you can use the `json` function to confirm that a value is JSON. The following search verifies that `{"animal" : "pony"}` is a JSON value by returning its value, `{"animal":"pony"}`.

... | eval animals = json\_object("animal", "pony"), result = json(animals)

The search results look something like this:

| \_time | animals | result |
| --- | --- | --- |
| 2023-02-22 14:39:50 | {"animal": "pony"} | {"animal": "pony"} |

### 2. Compare multiple results to identify JSON values

The following example shows how to use the `json` function to determine if the values in a field are JSON arrays or objects.

Consider the following search results:

| \_time | bridges | city |
| --- | --- | --- |
| 2023-04-26 21:10:45 | ["bridges",{"name":"Tower Bridge"},{"length":"801"},{"name":"Millennium Bridge"},{"length":"1066"}] | London |
| 2023-04-26 21:10:45 | ["bridges",{"name":"Rialto Bridge"},{"length":"157"},{"name":"Bridge of Sighs"},{"length":"36"},{"name":"Ponte della Paglia"}] | Venice |
| 2023-04-26 21:10:45 | Golden Gate Bridge | San Francisco |

When you add the `json` evaluation function to the following search, the results in the `bridgesAsJson` field identifies which values in the `bridges` field are JSON values:

... | eval bridgesAsJson = json(bridges)

When the value is JSON, the value is returned in the `bridgesAsJson` field. When the value is not JSON, the function returns null. The results look like something like this:

| \_time | bridges | bridgesAsJson | city |
| --- | --- | --- | --- |
| 2023-04-26 21:10:45 | ["bridges",{"name":"Tower Bridge"},{"length":"801"},{"name":"Millennium Bridge"},{"length":"1066"}] | [{"name":"Tower Bridge","length":801}, {"name":"Millennium Bridge","length":1066}] | London |
| 2023-04-26 21:10:45 | [{"name":"Rialto Bridge","length":157}, {"name":"Bridge of Sighs","length":36}, {"name":"Ponte della Paglia"}] | [{"name":"Rialto Bridge","length":157}, {"name":"Bridge of Sighs","length":36}, {"name":"Ponte della Paglia"}] | Venice |
| 2023-04-26 21:10:45 | Golden Gate Bridge |  | San Francisco |

## json\_append(<json>, <path\_value\_pairs>)

This function appends values to the ends of indicated arrays within a JSON document. This function provides a JSON `eval` function equivalent to the multivalue `mvappend` function.

### Usage

The `json_append` function always has at least three function inputs: `<json>` (the name of a valid JSON document such as a JSON object), and at least one `<path>` and `<value>` pair.

If `<json>` does not reference a valid JSON document, such as a JSON object, the function outputs nothing.

The `json_append` function evaluates `<path_value_pairs>` from left to right. When a path-value pair is evaluated, the function updates the `<json>` document. The function then evaluates the next path-value pair against the updated document.

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Use <path> to designate a JSON document value

Each `<path>` designates an array or value within the `<json>` document. The `json_append` function adds the corresponding `<value>` to the end of the value designated by the `<path>`. The following table explains what `json_append` does depending on what the `<path>` specifies.

| If `<path>` specifies... | ...This is what `json_append` does with the corresponding `<value>` |
| --- | --- |
| An array with one or more values. | `json_append` adds the corresponding `<value>` to the end of that array. |
| An empty array | `json_append` adds the corresponding `<value>` to that array, creating an array with a single value. |
| A scalar or object value | `json_append` autowraps the scalar or object value within an array and adds the corresponding `<value>` to the end of that array. |

The `json_append` function ignores path-value pairs for which the `<path>` does not identify any valid value in the JSON document.

### Append arrays as single elements

When the new `<value>` is an array, `json_append` appends the array as a single element. For example, if a `json_array` `<path>` leads to the array `["a", "b", "c"]` and its `<value>` is the array `["d", "e", "f"]`, the result is `["a", "b", "c", ["d", "e", "f"]]`.

Appending arrays as single elements separates `json_append` from `json_extend`, a similar function that flattens arrays and objects into separate elements as it appends them. When `json_extend` takes the example in the preceding paragraph, it returns `["a", "b", "c", "d", "e", "f"]`.

### Examples

The following examples show how you can use `json_append` to append values to arrays within a JSON document.

### 1. Add a string to an array

Say you have an object named `ponies` that contains an array named `ponylist`: `["Minty", "Rarity", "Buttercup"]`. This is the search you would run to append `"Fluttershy"` to `ponylist`.

... | eval ponies = json\_object("ponylist", json\_array("Minty", "Rarity", "Buttercup")),
updatePonies = json\_append(ponies, "ponylist", "Fluttershy")

The output of that `eval` statement is `{"ponylist": ["Minty", "Rarity", "Buttercup", "Fluttershy"]}`.

### 2. Append a string to a nested object

This example has a `<path>` with the value `Fluttershy.ponySkills`. `Fluttershy.ponySkills` references an array of an object that is nested within `ponyDetails`, the source object. The query uses `json_append` to add a string to the nested object array.

... | eval ponyDetails = json\_object("Fluttershy", json\_object("ponySkills", json\_array("running", "jumping"))), ponyDetailsUpdated = json\_append(ponyDetails, "Fluttershy.ponySkills", "codebreaking")

The output of this `eval` statement is `ponyDetailsUpdated = {"Fluttershy":{"ponySkills":["running","jumping","codebreaking"]}}`

## json\_array(<values>)

Creates a JSON array using a list of values.

### Usage

A `<value>` can be any kind of value such as string, number, or Boolean. You can also use the `json_object` function to specify values.

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Examples

These examples show different ways to use the `json_array` function to create JSON arrays in your events.

### 1. Create a basic JSON array

The following example creates a simple array `["buttercup", "fluttershy", "rarity"]` .

... | eval ponies = json\_array("buttercup", "fluttershy", "rarity")

### 2. Create an JSON array from a string and a JSON object

The following example uses a string `dubois` and the `json_object` function for the array values.

... | eval surname = json\_array("dubois", json\_object("name", "patel"))

The result is the JSON array  `[ "dubois", {"name": "patel}" ]`.

## json\_array\_to\_mv(<json\_array>, <boolean>)

This function maps the elements of a proper JSON array into a multivalue field.

### Usage

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

If the `<json array>` input to the function is not a valid JSON array, the function outputs nothing.

Use the `<boolean>` input to specify that the `json_array_to_mv` function should preserve bracketing quotes on JSON-formatted strings. The `<boolean>` input defaults to `false()`.

| Syntax | Description |
| --- | --- |
| `json_array_to_mv(<json_array>, false())` or  `json_array_to_mv(<json_array>)` | By default (or when you explicitly set it to `false()`), the `json_array_to_mv` function removes bracketing quotes from JSON string data types when it converts an array into a multivalue field. |
| `json_array_to_mv(<json_array>, true())` | When set to `true()`, the `json_array_to_mv` function preserves bracketing quotes on JSON string data types when it converts an array into a multivalue field. |

### Example

This example demonstrates usage of the `json_array_to_mv` function to create simple multivalue fields out of JSON data.

The following example creates a simple array: `["Buttercup", "Fluttershy", "Rarity"]`. Then it maps that array into a multivalue field named `my_little_ponies` with the values `Buttercup`, `Fluttershy`, and `Rarity`. The function removes the quote characters when it converts the array elements into field values.

... | eval ponies = json\_array("Buttercup", "Fluttershy", "Rarity"), my\_sweet\_ponies = json\_array\_to\_mv(ponies)

If you change this search so it has `my_sweet_ponies = json_array_to_mv(ponies,true())`, you get an array with the values `"Buttercup"`, `"Fluttershy"`, and `"Rarity"`. Setting the function to `true` causes the function to preserve the quote characters when it converts the array elements into field values.

## json\_delete(<object>,<keys>)

Use `json_delete` to remove one or more keys and their corresponding values from the specified JSON object.

The original JSON object is not modified. Instead, a new object is returned.

### Usage

The `json_delete` function uses two arguments:

* The `<object>` argument identifies the JSON object from which you want to delete key-value pairs.
* The `<keys>` argument identifies one or more keys that you want delete. The corresponding values are also deleted.

Array indexing is not supported.

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands. See the [eval](/en/?resourceId=Splunk_SearchReference_Eval) and [where](/en/?resourceId=Splunk_SearchReference_Where) commands.

### Specifying keys

You can specify the <keys> in 2 ways, as shown in the following table:

| Method | Example |
| --- | --- |
| A comma-separated list | `json_delete(object, "SSN", "accounts")` |
| An array | `json_delete(object, ["SSN", "accounts"]` |

### Nested keys

You can delete key-value pairs from nested keys. However, deleting key names that contain the dot character ( . ) is not supported. For example, suppose you have the key `student.name`, which has the value `Claudia`. Using `json_delete(obj, "student.name")` looks for the nested object `name` under the key `student`, which doesn't exist.

### Examples

### 1. Delete key-value pairs in an object

The following search deletes several key-value pairs from a JSON object. A new JSON object is returned in a field called `sales_account`.

* This search uses the `eval` command to create a JSON object literal in a field called `object`.
* Another `eval` command is used with the `json_delete` function to remove several key-value pairs from the JSON object literal, including the values in an array.

...| eval object = {"name":"Wei Zhang", "SSN":"123-45-6789", "city":"Seattle", "accounts":["Hagal Quartz", "Caladan Water", "Arrakis Spices"]}
| eval sales\_account = json\_delete(object, "SSN", "accounts")

The results look like this:

| object | sales\_account |
| --- | --- |
| {"name":"Wei Zhang", "SSN":"123-45-6789", "city":"Seattle", "accounts":["Hagal Quartz", "Caladan Water", "Arrakis Spices"]} | {"name":"Wei Zhang", "city":"Seattle"} |

Note: You don't have to use 2 separate `eval` commands for this search example. You can specify multiple eval command operations separated by commas. For example:...| eval object = {"name":"Wei Zhang", "SSN":"123-45-6789", "city":"Seattle", "accounts":["Hagal Quartz", "Caladan Water", "Arrakis Spices"]}, sales\_account = json\_delete(object, "SSN", "accounts")

### 2. Delete a key-value pair in a nested object

The following search removes a key-value pair from the `addresses` nested object. A new JSON object is returned in a field called `result`.

* This search uses the `eval` command to create a JSON object literal in a field called `employee`.
* The search then uses another `eval` command with the `json_delete` function to remove the `email` key-value pair from the `addresses` nested object.

...| eval employee = {"name":"Celestino Paulo", "company":"Isthmus Pastimes", "addresses": {"email":"celestino@sample.com", "office":"edificio 890 Avenida Demetrio Panama City Panama"}}
| eval result = json\_delete(employee, "addresses.email")

The results look like this:

| employee | results |
| --- | --- |
| {"name":"Celestino Paulo", "company":"Isthmus Pastimes", "addresses": {"email":"celestino@sample.com", "office":"edificio 890 Avenida Demetrio Panama City Panama"}} | {"name":"Celestino Paulo", "company":"Isthmus Pastimes", "addresses": {"office":"edificio 890 Avenida Demetrio Panama City Panama"}} |

### 3. Delete a key-value pair in a nested object in a pipeline

Consider the following JSON object, which contains Buttercup Games supplier information including a nested object with address information.

{"name":"Celestino Paulo", "company":"Isthmus Pastimes",
"addresses": {
"email":"celestino@sample.com",
"office":"edificio 890 Avenida Demetrio
Panama City Panama"}
"name":"David Mayer", "company":"Euro Games",
"addresses": {
"email":"david@sample.com",
"office":"567 Pariser Platz 2 10117
Berlin Germany "}
"name":"Wei Zhang", "company":"Tiger Fun",
"addresses": {
"email":"wei@sample.com",
"office":"678 Chome-10-5 Akasaka
Minato City Tokyo 107-8420 Japan"}
"name":"Rutherford Sullivan", "company":"Blarney Games",
"addresses": {
"email":"rutherford@sample.com",
"office":"789 Market St Sleveen
Kinsale Co. Cork P17 E068 Ireland"}
}

The following pipeline uses the `eval` command with the `json_delete` function to remove the `email` key-value pair from the `addresses` nested object. A new JSON object is returned in a field called `cleaned`.

$pipeline = from $source | eval cleaned = json\_delete(employee, ["addresses.email"]) | into $destination

## json\_entries(<value>)

### Description

|Returns the key-value entries from the top-level key-value pairs in a JSON object. The entries are returned as a JSON array of JSON objects with fields `key` and `value`.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `<value>` argument can be a valid JSON object or the name of a field that contains a valid JSON object.

Use this function in type tests to confirm that the format of an object is what is required and expected.

### Basic example

The following example returns a field named `entries` containing the array `[{"key":"a","value":1},{"key":"b","value":2}]`.

| makeresults
| eval entries=json\_entries("{\"a\": 1, \"b\": 2}")

### Extended example

The `employee_record` field in these events contains JSON objects.

| \_time | employee\_record |
| --- | --- |
| 2024-12-17 21:22:43 | {"name":"maria","age":25,"status":"full-time"} |
| 2024-12-17 21:22:43 | {"name":"charlie","age":21,"status":"part-time"} |

The following `eval` command returns the top-level members of the objects from the `employee_record` field and stores them in a field named `array_format`:

... | eval array\_format = json\_entries(employee\_record)

The results look like this:

| \_time | array\_format | employee\_record |
| --- | --- | --- |
| 2024-12-17 21:22:43 | [{"key":"name","value":"maria"},{"key":"age","value":25},{"key":"status","value":"full-time"}] | {"name":"maria","age":25,"status":"full-time"} |
| 2024-12-17 21:22:43 | [{"key":"name","value":"charlie"},{"key":"age","value":21},{"key":"status","value":"part-time"}] | {"name":"charlie","age":21,"status":"part-time"} |

## json\_extend(<json>, <path\_value\_pairs>)

Use `json_extend` when you want to append multiple values at once to an array. `json_extend` flattens arrays into their component values and appends those values to the ends of indicated arrays within a valid JSON document.

### Usage

The `json_extend` function always has at least three function inputs: `<json>` (the name of a valid JSON document such as a JSON object), and at least one `<path>` and `<value>` pair. The `<value>` must be an array. When given valid inputs, `json_extend` always outputs an array.

If `<json>` does not reference a valid JSON document, such as a JSON object, the function outputs nothing.

`json_extend` evaluates `<path_value_pairs>` from left to right. When `json_extend` evaluates a path-value pair, it updates the `<json>` document. `json_extend` then evaluates the next path-value pair against the updated document.

You can use `json_extend` with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Use <path> to designate a JSON document value

Each `<path>` designates an array or value within the `<json>` document. The `json_extend` function adds the values of the corresponding `<array>` after the last value of the array designated by the `<path>`. The following table explains what `json_extend` does depending on what the `<path>` specifies.

| If `<path>` specifies... | ...This is what `json_extend` does with the corresponding array values |
| --- | --- |
| An array with one or more values. | `json_extend` adds the corresponding array values to the end of that array. |
| An empty array | `json_extend` adds the corresponding array values to that array. |
| A scalar or object value | `json_extend` autowraps the scalar or object value within an array and adds the corresponding array values to the end of that array. |

`json_extend` ignores path-value pairs for which the `<path>` does not identify any valid value in the JSON document.

### How json\_extend flattens arrays before it appends them

The `json_extend` function flattens arrays as it appends them to the specified value. "Flattening" refers to the act of breaking the array down into its component values. For example, if a `json_extend` `<path>` leads to the array `["a", "b", "c"]` and its `<value>` is the array `["d", "e", "f"]`, the result is `["a", "b", "c", "d", "e", "f"]`.

Appending arrays as individual values separates `json_extend` from `json_append`, a similar function that appends the `<value>` as a single element. When `json_append` takes the example in the preceding paragraph, it returns `["a", "b", "c", ["d", "e", "f"]]`.

### Examples

The following examples show how you can use `json_extend` to append multiple values at once to arrays within a JSON document.

### 1. Extend an array with a set of string values

You start with an object named `fakeBandsInMovies` that contains an array named `fakeMovieBandList`: `["The Blues Brothers", "Spinal Tap", "Wyld Stallyns"]`. This is the search you would run to extend that list with three more names of fake bands from movies.

... | eval fakeBandsInMovies = json\_object("fakeMovieBandList", json\_array("The Blues Brothers", "Spinal Tap", "Wyld Stallyns")), updateBandList = json\_extend(fakeBandsInMovies, "fakeMovieBandList", json\_array("The Soggy Bottom Boys", "The Weird Sisters", "The Barden Bellas"))

The output of this `eval` statement is `{"fakeMovieBandList": ["The Blues Brothers", "Spinal Tap", "Wyld Stallyns", "The Soggy Bottom Boys", "The Weird Sisters", "The Barden Bellas"]}`

### 2. Extend an array with an object

This example has an object named `dndChars` that contains an array named `characterClasses`. You want to update this array with an object from a secondary array. Here is a search you could run to achieve that goal.

... | eval dndChars = json\_object("characterClasses", json\_array("wizard", "rogue", "barbarian")), array2 = json\_array(json\_object("artifact", "deck of many things")), updatedParty = json\_extend(dndChars, "characterClasses", array2)

The output of this `eval` statement is `{updatedParty = ["wizard", "rogue", "barbarian", {"artifact":"deck of many things"}]}`. Note that when `json_extend` flattens `array2`, it removes the object from the array. Otherwise the output would be `{updatedParty = ["wizard", "rogue", "barbarian", [{"artifact":"deck of many things"}]]}`.

## json\_extract(<json>, <paths>)

This function returns a value from a piece of JSON and zero or more paths. The value is returned in either a JSON array, or a Splunk software native type value.

Note: If a JSON object contains a value with a special character, such as a period, `json_extract` can't access it. Use the `json_extract_exact` function for those situations.

See `json_extract_exact`.

### Usage

What is converted or extracted depends on whether you specify a piece of JSON, or JSON and one or more paths.

| Syntax | Description |
| --- | --- |
| `json_extract(<json>)` | Converts a JSON field to the Splunk software native type. For example:  * Converts a JSON string to a string * Converts a JSON Boolean to a Boolean * Converts a JSON null to a null |
| `json_extract(<json>, <path>)` | Extracts the value specified by `<path>` from `<json>`, and converts the value to the native type. This can be a JSON array if the path leads to an array. |
| `json_extract(<json>, <path>, <path>, ...)` | Extracts all of the paths from `<json>` and returns it as a JSON array. |

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Examples

These examples use this JSON object, which is in a field called `cities` in an event:

{
"cities": [
{
"name": "London",
"Bridges": [
{ "name": "Tower Bridge", "length": 801 },
{ "name": "Millennium Bridge", "length": 1066 }
]
},
{
"name": "Venice",
"Bridges": [
{ "name": "Rialto Bridge", "length": 157 },
{ "name": "Bridge of Sighs", "length": 36 },
{ "name": "Ponte della Paglia" }
]
},
{
"name": "San Francisco",
"Bridges": [
{ "name": "Golden Gate Bridge", "length": 8981 },
{ "name": "Bay Bridge", "length": 23556 }
]
}
]
}

### 1. Extract the entire JSON object in a field

The following example returns the entire JSON object from the `cities` field. The `cities` field contains only one object. The key is the entire object. This extraction can return any type of value.

... |eval extracted\_cities = json\_extract(cities,"{}")

Here are the results of the search:

| Field | Results |
| --- | --- |
| extract\_cities | {"cities":[{"name":"London","Bridges":[{"name":"Tower Bridge","length":801},{"name":"Millennium Bridge","length":1066}]},{"name":"Venice","Bridges":[{"name":"Rialto Bridge","length":157},{"name":"Bridge of Sighs","length":36},{"name":"Ponte della Paglia"}]},{"name":"San Francisco","Bridges":[{"name":"Golden Gate Bridge","length":8981},{"name":"Bay Bridge","length":23556}]}]} |

### 2. Extract the first nested JSON object in a field

The following example extracts the information about the city of London from the JSON object. This extraction can return any type of value.

The `{<num>}` indexing demonstrated in this example search only works when the `<path>` maps to a JSON array. In this case the `{0}` maps to the "0" item in the array, which is London. If the example used `{1}` it would select Venice from the array.

... | eval London=json\_extract(cities,"{0}")

Here are the results of the search:

| Field | Results |
| --- | --- |
| London | {"name":"London","Bridges":[{"name":"Tower Bridge","length":801},{"name":"Millennium Bridge","length":1066}]} |

### 3. Extract the third nested JSON object in a field

The following example extracts the information about the city of San Francisco from the JSON object. This extraction can return any type of value.

... | eval San\_Francisco=json\_extract(cities,"{2}")

Here are the results of the search:

| Field | Results |
| --- | --- |
| San\_Francisco | {"name":"San Francisco","Bridges":[{"name":"Golden Gate Bridge","length":8981},{"name":"Bay Bridge","length":23556}]} |

### 4. Extract a specific key from each nested JSON object in a field

The following example extracts the names of the cities from the JSON object. This extraction can return any type of value.

... | eval my\_cities=json\_extract(cities,"{}.name")

Here are the results of the search:

| Field | Results |
| --- | --- |
| my\_cities | ["London","Venice","San Francisco"] |

### 5. Extract a specific set of key-value pairs from each nested JSON object in a field

The following example extracts the information about each bridge from every city from the JSON object. This extraction can return any type of value.

... | eval Bridges=json\_extract(cities,"{}.Bridges{}")

Here are the results of the search:

| Field | Results |
| --- | --- |
| Bridges | [{"name":"Tower Bridge","length":801},{"name":"Millennium Bridge","length":1066},{"name":"Rialto Bridge","length":157},{"name":"Bridge of Sighs","length":36},{"name":"Ponte della Paglia"},{"name":"Golden Gate Bridge","length":8981},{"name":"Bay Bridge","length":23556}] |

### 6. Extract a specific value from each nested JSON object in a field

The following example extracts the names of the bridges from all of the cities from the JSON object. This extraction can return any type of value.

... | eval Bridge\_names=json\_extract(cities,"{}.Bridges{}.name")

Here are the results of the search:

| Field | Results |
| --- | --- |
| Bridge\_names | ["Tower Bridge","Millennium Bridge","Rialto Bridge","Bridge of Sighs","Ponte della Paglia","Golden Gate Bridge","Bay Bridge"] |

### 7. Extract a specific key-value pair from a specific nested JSON object in a field

The following example extracts the name and length of the first bridge from the third city from the JSON object. This extraction can return any type of value.

... | eval GG\_Bridge=json\_extract(cities,"{2}.Bridges{0}")

Here are the results of the search:

| Field | Results |
| --- | --- |
| GG\_Bridge | {"name":"Golden Gate Bridge","length":8981} |

### 8. Extract a specific value from a specific nested JSON object in a field

The following example extracts the length of the first bridge from the third city from the JSON object. This extraction can return any type of value.

... | eval GG\_Bridge\_length=json\_extract(cities,"{2}.Bridges{0}.length")

Here are the results of the search:

| Field | Results |
| --- | --- |
| GG\_Bridge\_length | 8981 |

## json\_extract\_exact(<json>, <keys>)

Like the `json_extract` function, this function returns a Splunk software native type value from a piece of JSON. The main difference between these functions is that the `json_extract_exact` function does not use paths to locate and extract values, but instead matches literal strings in the event and extracts those strings as keys.

See `json_extract`.

### Usage

The `json_extract_exact` function treats strings for key extraction literally. This means that the function does not support explicitly nested paths. You can set paths with nested `json_array`/`json_object` function calls.

| Syntax | Description |
| --- | --- |
| `json_extract_exact(<json>)` | Converts a JSON field to the Splunk software native type. For example:  * Converts a JSON string to a string * Converts a JSON Boolean to a Boolean * Converts a JSON null to a null |
| `json_extract_exact(<json>, <string>)` | Extracts the key specified by `<string>` from `<json>`, and converts the key to the Splunk software native type. This can be a JSON array if the path leads to an array. |
| `json_extract_exact(<json>, <string>, <string>, ...)` | Extracts all of the strings from `<json>` and returns them as a JSON array of keys. |

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Example

Suppose you have a JSON event that looks like this: `{"system.splunk.path":"/opt/splunk/"}`

If you want to extract `system.splunk.path` from that event, you can't use the `json_extract` function because of the period characters. Instead, you would use `json_extract_exact`, as shown in the following search:

... | eval extracted\_path=json\_extract\_exact(splunk\_path, "system.splunk.path")

## json\_has\_key\_exact(<object>, <key>)

### Description

This function evaluates whether a JSON object contains the specified key and returns either TRUE or FALSE.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

The `<object>` argument identifies the JSON object that you want to check for a specific key. This argument can be a valid JSON object or the name of a field that contains a valid JSON object.

The `<key>` argument identifies the key that you want to check for in the JSON object. This argument can be a string or the name of a field that contains a string.

You can use this function directly with the `where` command in searches, but the `eval` command can't directly accept a Boolean value. You must specify the function inside another function, such as the `if` function, which can accept a Boolean value as an input.

### Basic examples

The following example returns `has key`, indicating that the `name` key exists in the provided JSON object.

... | eval test=if(json\_has\_key\_exact(json\_object("name", "charlie"), "name"), "has key", "doesn't have key")

The following example returns `has key`, indicating that the `"charlie.garcia"` key exists in the provided JSON object. The function treats the dot character ( . ) in `"charlie.garcia"` as a string literal, not as a nested object in JSON format.

| makeresults
| eval test=if(json\_has\_key\_exact("{\"charlie.garcia\":10}", "charlie.garcia"), "has key", "doesn't have key")

### Extended example

The `employee_record` field in these events contains JSON objects.

| \_time | employee\_record |
| --- | --- |
| 2024-12-17 21:22:43 | {"name":"maria","age":25,"status":"full-time"} |
| 2024-12-17 21:22:43 | {"name":"charlie","age":21,"region":"US"} |

The following `eval` command checks whether the objects in the `employee_record` field contain the `status` key, and stores the results in a field named `test_results`.

... | eval test\_results=if(json\_has\_key\_exact(employee\_record, "status"), "has key", "doesn't have key")

The results look like this:

| \_time | employee\_record | test\_results |
| --- | --- | --- |
| 2024-12-17 21:22:43 | {"name":"maria","age":25,"status":"full-time"} | has key |
| 2024-12-17 21:22:43 | {"name":"charlie","age":21,"region":"US"} | doesn't have key |

## json\_keys(<json>)

Returns the keys from the key-value pairs in a JSON object. The keys are returned as a JSON array.

### Usage

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

The `json_keys` function cannot be used on JSON arrays.

### Examples

### 1. Return a list of keys from a JSON object

Consider the following JSON object, which is in the `bridges` field:

| bridges |
| --- |
| {"name": "Clifton Suspension Bridge", "length": 1352, "city": "Bristol", "country": "England"} |

This example extracts the keys from the JSON object in the `bridges` field:

... | eval bridge\_keys = json\_keys(bridges)

Here are the results of the search:

| bridge\_keys |
| --- |
| ["name", "length", "city", "country"] |

### 2. Return a list of keys from multiple JSON objects

Consider the following JSON objects, which are in separate rows in the `bridges` field:

| bridges |
| --- |
| {"name": "Clifton Suspension Bridge", "length": 1352, "city": "Bristol", "country": "England"} |
| {"name":"Rialto Bridge","length":157, "city": "Venice", "region": "Veneto", "country": "Italy"} |
| {"name": "Helix Bridge", "length": 918, "city": "Singapore", "country": "Singapore"} |
| {"name": "Tilikum Crossing", "length": 1700, "city": "Portland", "state": "Oregon", "country": "United States"} |

This example extracts the keys from the JSON objects in the `bridges` field:

... | eval bridge\_keys = json\_keys(bridges)

Here are the results of the search:

| bridge\_keys |
| --- |
| ["name", "length", "city", "country"] |
| ["name", "length", "city", "region", "country"] |
| ["name", "length", "city", "country"] |
| ["name", "length", "city", "state", "country"] |

## json\_set(<json>, <path\_value\_pairs>)

Inserts or overwrites values for a JSON node with the values provided and returns an updated JSON object.

Similar to the `json_set_exact` function. See `json_set_exact`

### Usage

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

* If the path contains a list of keys, all of the keys in the chain are created if the keys don't exist.
* If there's a mismatch between the JSON object and the path, the update is skipped and doesn't generate an error. For example, for object {"a": "b"}, json\_set(.., "a.c", "d") produces no results since "a" has a string value and "a.c" implies a nested object.
* If the value already exists and is of a matching non-value type, the `json_set` function overwrites the value by default. A value type match isn't enforced. For example, you can overwrite a number with a string, Boolean, null, and so on.

### Examples

These examples use this JSON object, which is in a field called `games` in an event:

{
"category": {
"boardgames": {
"cooperative": [
{
"name": "Pandemic"
},
{
"name": "Forbidden Island"
},
{
"name": "Castle Panic"
}
]
}
}
}

### 1. Overwrite a value in an existing JSON array

The following example overwrites the value `"Castle Panic"` in the path `[category.boardgames.cooperative]` in the JSON object. The value is replaced with `"name":"Sherlock Holmes: Consulting Detective"`. The results are placed into a new field called `my_games`.

The position count starts with 0. The third position is 2, which is why the example specifies `{2}` in the path.

... | eval my\_games = json\_set(games,"category.boardgames.cooperative{2}", "name":"Sherlock Holmes: Consulting Detective")

Here are the results of the search:

| Field | Results |
| --- | --- |
| my\_games | {"category":{"boardgames":{"cooperative":["name":"Pandemic", "name":"Forbidden Island", "name":"Sherlock Holmes: Consulting Detective"]}}} |

### 2. Insert a list of values in an existing JSON object

The following example inserts a list of popular games `["name":"Settlers of Catan", "name":"Terraforming Mars", "name":"Ticket to Ride"]` into the path `[category.boardgames.competitive]` in the JSON object.

Because the key `competitive` doesn't exist in the path, the key is created. The `json_array` function is used to append the value list to the `boardgames` JSON object.

...| eval my\_games = json\_set(games,"category.boardgames.competitive", json\_array(json\_object("name", "Settlers of Catan"), json\_object("name", "Terraforming Mars"), json\_object("name", "Ticket to Ride")))

Here are the results of the search:

| Field | Results |
| --- | --- |
| my\_games | {"category":{"boardgames":{"cooperative":["name":"Pandemic", "name":"Forbidden Island", "name":"Sherlock Holmes: Consulting Detective"],"competitive": ["name":"Settlers of Catan", "name":"Terraforming Mars", "name":"Ticket to Ride"]}}} |

The JSON object now looks like this:

{
"category": {
"boardgames": {
"cooperative": [
{
"name": "Pandemic"
},
{
"name": "Forbidden Island"
},
{
"name": "Castle Panic"
}
]
},
"competitive": [
{
"name": "Settlers of Catan"
},
{
"name": "Terraforming Mars"
},
{
"name": "Ticket to Ride"
}
]
}
}

### 3. Insert a set of key-value pairs in an existing JSON object

The following example inserts a set of key-value pairs that specify if the game is available using a Boolean value. These pairs are inserted into the path `[category.boardgames.competitive]` in the JSON object. The `json_array` function is used to append the key-value pairs list to the `boardgames` JSON object.

...| eval my\_games = json\_set(games,"category.boardgames.competitive{}.available", true())

Here are the results of the search:

| Field | Results |
| --- | --- |
| my\_games | {"category":{"boardgames":{"cooperative":["name":"Pandemic", "name":"Forbidden Island", "name":"Sherlock Holmes: Consulting Detective"],"competitive": ["name":"Settlers of Catan", "available":true, "name":"Terraforming Mars", "available":true, "name":"Ticket to Ride", "available":true]}}} |

The JSON object now looks like this:

{
"category": {
"boardgames": {
"cooperative": [
{
"name": "Pandemic"
},
{
"name": "Forbidden Island"
},
{
"name": "Castle Panic"
}
]
},
"competitive": [
{
"name": "Settlers of Catan",
"available": true
},
{
"name": "Terraforming Mars",
"available": true
},
{
"name": "Ticket to Ride",
"available": true
}
]
}
}

If the `Settlers of Catan` game is out of stock, you can overwrite the value for the `available` key with the value `false()`.

For example:

... | eval my\_games = json\_set(games,"category.boardgames.competitive{0}.available", false())

Here are the results of the search:

| Field | Results |
| --- | --- |
| my\_games | {"category":{"boardgames":{"cooperative":["name":"Pandemic", "name":"Forbidden Island", "name":"Sherlock Holmes: Consulting Detective"],"competitive": ["name":"Settlers of Catan", "available":false, "name":"Terraforming Mars", "available":true, "name":"Ticket to Ride", "available":true]}}} |

The JSON object now looks like this:

{
"category": {
"boardgames": {
"cooperative": [
{
"name": "Pandemic"
},
{
"name": "Forbidden Island"
},
{
"name": "Castle Panic"
}
]
},
"competitive": [
{
"name": "Settlers of Catan",
"available": false
},
{
"name": "Terraforming Mars",
"available": true
},
{
"name": "Ticket to Ride",
"available": true
}
]
}
}

## json\_set\_exact(<json>, <key\_value\_pairs>)

Generates or overwrites a JSON object using the key-value pairs that you specify.

Similar to the `json_set` function. See `json_set`

### Usage

You can use the `json_set_exact` function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

* The `json_set_exact` function interprets the keys as literal strings, including special characters. This function does not interpret strings separated by period characters as keys for nested objects.
* If you supply multiple key-value pairs to `json_set_exact`, the function outputs an array.
* The `json_set_exact` function does not support or expect paths. You can set paths with nested `json_array` or `json_object` function calls.

### Example

Suppose you want to have a JSON object that looks like this:

{"system.splunk.path":"/opt/splunk"}

To generate this object, you can use the `makeresults` command and the `json_set_exact` function as shown in the following search:

| makeresults | eval my\_object=json\_object(), splunk\_path=json\_set\_exact(my\_object, "system.splunk.path", "/opt/splunk")

You use `json_set_exact` for this instead of `json_set` because the `json_set` function interprets the period characters in `{"system.splunk.path"}` as nested objects. If you use `json_set` in the preceding search you get this JSON object:

{"system":{"splunk":{"path":"/opt/splunk"}}}

Instead of this object:

{"system.splunk.path":"/opt/splunk"}

## json\_valid(<json>)

Evaluates whether a piece of JSON uses valid JSON syntax and returns either TRUE or FALSE.

### Usage

You can use this function with the `eval` and `where` commands, and as part of evaluation expressions with other commands.

### Example

The following example validates a JSON object `{ "names": ["maria", "arun"] }` in the `firstnames` field.

Because fields cannot hold Boolean values, the `if` function is used with the `json_valid` function to place the string value equivalents of the Boolean values into the `isValid` field.

... | eval IsValid = if(json\_valid(firstnames), "true", "false")

## See also

Function information

[Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions) quick reference

Related functions

[mv\_to\_json\_array function](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/multivalue-eval-functions#id_3eacc26c_4c89_47a9_9601_2f12e8905cf6__mv_to_json_array.28.26lt.3Bfield.26gt.3B.2C_.26lt.3Binfer_types.26gt.3B.29)

Related commands

[tojson](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tojson#id_295911ba_5f0c_4fa2_a695_a1e8d8041dc4__tojson)

[fromjson](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fromjson#id_6f8c901e_3432_43db_8b55_a3f480214fd0__fromjson)
