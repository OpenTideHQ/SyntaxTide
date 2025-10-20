# extract

## Description

Extracts field-value pairs from the search results. The `extract` command works only on the `_raw` field. If you want to extract from another field, you must perform some field renaming before you run the `extract` command.

## Syntax

The required syntax is in bold.

extract

[<extract-options>... ]

[<extractor-name>...]

### Required arguments

None.

### Optional arguments

<extract-options>

Syntax: auto=f | clean\_keys=<bool> | kvdelim=<string> | limit=<int> | maxchars=<int> | mv\_add=<bool> | pairdelim=<string> | reload=<bool> | segment=<bool>

Description: Options for defining the extraction. See the [Extract\_options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_52f4ee4c_b755_4dad_b09c_accba849136f__Extract_options) section in this topic.

<extractor-name>

Syntax: <string>

Description: A stanza in the `transforms.conf` file. This is used when the `props.conf` file does not explicitly cause an extraction for this source, sourcetype, or host.

### Extract options

auto

Syntax: auto=f

Description: Specifies whether automatic key-value field extraction is turned off. When you include `auto=f` in a search with the `extract` command, you are explicitly telling Splunk software not to perform automatic key-value field extraction by default on the \_raw field for that specific search. Using this option gives you more granular control over how fields are extracted.

Default: None.

clean\_keys

Syntax: clean\_keys=<bool>

Description: Specifies whether to clean keys. Overrides CLEAN\_KEYS in the `transforms.conf` file.

Default: The value specified in the CLEAN\_KEYS in the `transforms.conf` file.

kvdelim

Syntax: kvdelim=<string>

Description: A list of character delimiters that separate the key from the value. If the delimiter appears in the value, that value is not extracted. For example, if the delimiter is a colon ( : ) and a key-value pair is `Referer: https://buttercupgames.com`, the key-value pair is not extracted.

limit

Syntax: limit=<int>

Description: Specifies how many automatic key-value pairs to extract.

Default: 50

maxchars

Syntax: maxchars=<int>

Description: Specifies how many characters to look into the event.

Default: 10240

mv\_add

Syntax: mv\_add=<bool>

Description: Specifies whether to create multivalued fields. Overrides the value for the MV\_ADD parameter in the `transforms.conf` file.

Default: false

pairdelim

Syntax: pairdelim=<string>

Description: A list of character delimiters that separate the key-value pairs from each other.

reload

Syntax: reload=<bool>

Description: Specifies whether to force reloading of the `props.conf` and `transforms.conf` files.

Default: false

segment

Syntax: segment=<bool>

Description: Specifies whether to note the locations of the key-value pairs with the results.

Default: false

## Usage

The `extract` command is a [distributable streaming command](https://docs.splunk.com/Splexicon:Streamingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Alias

The alias for the `extract` command is `kv`.

## Examples

### 1. Specify the delimiters to use for the field and value extractions

Extract field-value pairs that are delimited by the pipe ( | ) or semicolon ( ; ) characters. Extract values of the fields that are delimited by the equal ( = ) or colon ( : ) characters. The delimiters are individual characters. In this example the "=" or ":" character is used to delimit the key value. Similarly, a "|" or ";" is used to delimit the field-value pair itself.

... | extract pairdelim="|;", kvdelim="=:"

### 2. Extract field-value pairs and reload the field extraction settings

Extract field-value pairs and reload field extraction settings from disk.

... | extract reload=true

### 3. Rename a field to \_raw to extract from that field

Rename the `_raw` field to a temporary name. Rename the field you want to extract from, to `_raw`. In this example the field name is `uri_query`.

... | rename \_raw AS temp uri\_query AS \_raw | extract pairdelim="?&" kvdelim="=" | rename \_raw AS uri\_query temp AS \_raw

### 4. Extract field-value pairs from a stanza in the transforms.conf file

Extract field-value pairs that are defined in the `my-access-extractions` stanza in the `transforms.conf` file.

... | extract my-access-extractions

The transforms.conf stanza for this example looks something like this.

[my-access-extractions]
REGEX=\[(?!(?:headerName|headerValue))([^\s\=]+)\=([^\]]+)\]
FORMAT=$1::$2

## See also

[kvform](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/kvform#e1e4ffba_a385_49e0_a14f_f5b739a1b883__kvform), [multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv), [rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex), [spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath), [xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv), [xpath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xpath#id_4288b926_a1d3_4530_94ce_39d508745f49__xpath)
