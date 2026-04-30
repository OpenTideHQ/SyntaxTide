> [!WARNING]
> This is currently a very early stage project, and we provide NO SUPPORT for now. 
> The repo is planned for reimplementation and official announcement in coming months.
> You may explore the work done and experiment, but no PR will be accepted.

<table align="center"><tr><td align="center" width="9999">
<img src="https://raw.githubusercontent.com/OpenTideHQ/SyntaxTide/refs/heads/main/syntaxtide-icon.png" align="center" width="150" alt="Project icon">

# SyntaxTide

_OpenTide Rules Query syntax and LSP extension for VSCode_

</td></tr></table>

## About

This extension adds query language syntax highlighting to OpenTide YAML files, supporting multiple SIEM and security platforms.

## Installation

Install the extension from the VS Code Marketplace or from a `.vsix` file. The extension automatically activates when you open YAML files containing query blocks.

## Features

- **Multi-Language Support**: Extensible framework for multiple query languages
- **Query Languages**: Built-in grammars for KQL, SPL, and CBC with complete syntax highlighting
- **Language Server Protocol (LSP)**: Advanced SPL support with IntelliSense, autocomplete, hover documentation, and signature help
- **Complete Grammar**: Full syntax highlighting with built-in language definitions
- **Automatic Detection**: Context-aware highlighting in OpenTide model files
- **Non-Intrusive**: Works alongside existing JSON Schema validation without conflicts
- **YAML Block Scalar Support**: Properly highlights multi-line queries using YAML block scalars (`|`)
- **No External Dependencies**: Self-contained with complete grammar definitions

### SPL Language Server Features
- **Autocomplete**: 160+ SPL commands and 130+ functions with context-aware suggestions
- **Variable Tracking**: Automatically tracks and suggests user-defined fields from eval, rename, rex, stats, spath, and more
- **Hover Information**: Detailed documentation for commands, functions, and variables
- **Signature Help**: Parameter hints for 130+ functions across 15 categories
- **Error Detection**: Real-time validation of SPL queries
- **Comprehensive Coverage**: All major SPL command types (Generating, Transforming, Streaming, ML & Analytics, Data Export, Visualization)

## Supported Query Languages

### Microsoft Sentinel (KQL)
Full support for KQL queries in `configurations.sentinel.query` fields:

```yaml
configurations:
  sentinel:
    query: |
      SecurityEvent
      | where TimeGenerated > ago(1h)
      | where EventID == 4625
      | summarize count() by Account, Computer
```

### Splunk (SPL)
Full support for SPL queries in `configurations.splunk.query` fields:

```yaml
configurations:
  splunk:
    query: |
      index=main sourcetype=WinEventLog:Security EventCode=4625
      | stats count by user, src_ip
      | where count > 5
      | lookup asset_lookup host as src_ip
```

### Carbon Black Cloud (CBC)
Full support for Carbon Black Cloud queries in `configurations.carbon_black_cloud.query` fields:

```yaml
configurations:
  carbon_black_cloud:
    query: |
      (process_name:powershell.exe OR process_name:pwsh.exe)
      AND process_cmdline:-encodedcommand
      AND process_effective_reputation:NOT_LISTED
      AND netconn_count:[1 TO *]
      AND NOT parent_name:explorer.exe
```


## Usage

The extension automatically activates when you open YAML files containing query blocks. Simply write your queries using the YAML block scalar syntax:

```yaml
configurations:
  <system>:
    query: |
      <your query here>
```

The appropriate syntax highlighting will be applied based on the system configuration path.

## Requirements

**No additional requirements!** This extension includes complete grammar definitions for all supported languages.

## Supported Query Features (KQL)

### Keywords
- **Query operators**: `where`, `project`, `extend`, `summarize`, `join`, `union`, `lookup`, `sort`, `order`, `top`, `limit`, `take`, `distinct`, `mv-expand`, `mv-apply`
- **Logical operators**: `and`, `or`, `not`
- **Join types**: `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`
- **Control flow**: `case`, `iff`, `iif`, `let`, `print`

### Functions
- **Aggregation**: `count()`, `countif()`, `dcount()`, `sum()`, `avg()`, `min()`, `max()`, `percentile()`, `make_set()`, `make_list()`, `arg_max()`, `arg_min()`
- **Datetime**: `ago()`, `now()`, `datetime_add()`, `datetime_diff()`, `startofday()`, `startofweek()`, `endofmonth()`, `format_datetime()`
- **String**: `strcat()`, `split()`, `substring()`, `replace()`, `trim()`, `toupper()`, `tolower()`, `extract()`, `parse()`
- **Conversion**: `tostring()`, `toint()`, `tolong()`, `todouble()`, `tobool()`, `toguid()`
- **Array/Bag**: `array_length()`, `array_concat()`, `pack()`, `pack_array()`, `bag_keys()`
- **Geo**: `geo_distance_2points()`, `geo_point_in_circle()`, `geo_point_to_s2cell()`
- **IP**: `ipv4_is_private()`, `parse_ipv4()`, `format_ipv4()`, `ipv6_compare()`
- **Window**: `row_number()`, `rank()`, `dense_rank()`, `lag()`, `lead()`

### Operators
- **Comparison**: `==`, `!=`, `<>`, `<`, `>`, `<=`, `>=`, `=~`, `!~`
- **String**: `contains`, `!contains`, `has`, `!has`, `startswith`, `!startswith`, `endswith`, `!endswith`, `matches regex`
- **Set**: `in`, `!in`, `between`
- **Pipe**: `|` (for query chaining)

### Syntax Elements
- **Comments**: Single-line (`//`) and multi-line (`/* */`)
- **Strings**: Double quotes (`""`), single quotes (`''`), backticks (``), verbatim (`@""`), multi-line (` ``` `)
- **Numbers**: Integers, decimals, hex (`0x...`), scientific notation
- **Booleans**: `true`, `false`, `null`
- **Timespans**: `1d`, `2h`, `30m`, `45s`, `100ms`

## How It Works

The extension uses **grammar injection** to:
1. Detect YAML blocks with system-specific configuration blocks (e.g., `sentinel:`, `splunk:`)
2. Within those blocks, identify `query: |` fields
3. Inject the appropriate query language grammar:
   - KQL for `configurations.sentinel.query`
   - SPL for `configurations.splunk.query`
4. Apply comprehensive syntax highlighting

**Currently Supported**: 
- ✅ **Sentinel (KQL)**: Full highlighting for `configurations.sentinel.query` blocks
- ✅ **Splunk (SPL)**: Full highlighting for `configurations.splunk.query` blocks

**Coming Soon**: Carbon Black, Sigma, CrowdStrike, and more

Your JSON Schema validation continues to work exactly as before - this only adds visual syntax highlighting.

## Known Limitations

- Only supports block scalar style (`|`) for queries
- Requires the content to be properly indented after `query: |`
- LSP features (IntelliSense, autocomplete, validation) currently only available for SPL queries
- KQL and CBC have syntax highlighting only (no LSP yet)

## Roadmap

### Version 0.5.0 (Next)
- Expand LSP support to KQL queries
- Add LSP support to CBC queries
- Enhanced argument validation for SPL commands

### Future
- Field name suggestions based on common patterns
- Query snippets library
- Macro expansion support for SPL
- Cross-language query translation helpers

## Release Notes

### 0.1.0

Rebranded release:
- Renamed to "OpenTide Query Syntax Highlighting"
- Generalized for multi-language support
- Complete KQL grammar for Microsoft Sentinel
- Foundation for future query language additions
- Updated documentation for broader scope

### 0.0.1

Initial release:
- Complete built-in KQL grammar
- Syntax highlighting for Sentinel queries in OpenTide YAML files
- Self-contained with no external dependencies

