# Change Log

All notable changes to the "OpenTide Query Syntax Highlighting" extension will be documented in this file.

## [0.3.0] - 2025-10-20

### Added
- ✅ **Carbon Black Cloud (CBC) Support**: Complete syntax highlighting for `configurations.carbon_black_cloud.query` blocks
- New CBC grammar (`cbc.tmLanguage.json`) with comprehensive Lucene-based query support:
  - **80+ fields** across 9 categories: process, network, file, host, signature, crossproc, metadata, time, binary
  - **Boolean operators**: `AND`, `OR`, `NOT`, negation with `-` and `!`
  - **Range queries**: `[X TO Y]` and `{X TO Y}` syntax for numeric and date ranges
  - **Special values**: Reputation enums (NOT_LISTED, TRUSTED, KNOWN_MALWARE, etc.), OS types (WINDOWS, MAC, LINUX), signature results
  - **Field-value syntax**: Complete support for `field:value` and `field:"quoted value"` patterns
  - **Wildcards**: Multi-character (`*`) and single-character (`?`) wildcards
  - **Escape sequences**: Proper handling of `\\` escapes in field values
  - **Grouping**: Nested parentheses for complex boolean logic
  - **Network patterns**: IP addresses (IPv4 and IPv6), CIDR notation, port numbers
  - **Hash values**: MD5, SHA256, and hex string highlighting
  - **Comments**: `#` line comments
- New CBC injection pattern matching `carbon_black_cloud:` configuration blocks
- Updated test file with comprehensive realistic CBC query examples
- Language registration for standalone `.cbc` files
- Documentation based on official Carbon Black Cloud Query Syntax guide (1818 lines analyzed)

### Changed
- Documentation updated to reflect triple language support (KQL + SPL + CBC)
- Keywords updated to include "Carbon Black" and "CBC"
- Test file now demonstrates KQL, SPL, and CBC highlighting side-by-side

### Technical Details
- CBC grammar uses `source.cbc` scope
- Injection scope: `text.opentide.yaml.cbc.injection`
- System-specific scoping: `carbon_black_cloud:` block detection → `query: |` field injection
- All three grammars (KQL, SPL, CBC) coexist without conflicts
- Lucene-based syntax fundamentally different from pipe-based KQL/SPL

## [0.2.0] - 2025-10-20

### Added
- ✅ **Splunk SPL Support**: Complete syntax highlighting for `configurations.splunk.query` blocks
- New SPL grammar (`spl.tmLanguage.json`) with comprehensive coverage:
  - Commands: `search`, `stats`, `eval`, `where`, `rex`, `lookup`, `join`, `timechart`, etc.
  - Eval functions: String, math, date, conversion, crypto, informational
  - Stats functions: `count`, `avg`, `sum`, `dc`, `values`, `earliest`, `latest`, etc.
  - Operators: Comparison, logical, arithmetic
  - Special syntax: Macros (backticks), subsearches (brackets), field references
- New SPL injection pattern matching `splunk:` configuration blocks
- Updated test file with realistic SPL examples
- Language registration for standalone `.spl` files

### Changed
- Documentation updated to reflect dual language support (KQL + SPL)
- Keywords updated to include "SPL" and "Splunk"
- Test file now demonstrates both KQL and SPL highlighting side-by-side

### Technical Details
- SPL grammar uses `source.spl` scope
- Injection scope: `text.opentide.yaml.spl.injection`
- System-specific scoping: `splunk:` block detection → `query: |` field injection
- Both KQL and SPL grammars coexist without conflicts

## [0.1.0] - 2025-10-20

### Changed
- **Rebranded** from "TIDE YAML KQL" to "OpenTide Query Syntax Highlighting"
- **Generalized** architecture to support multiple query languages (not just KQL)
- **Improved scoping** - injection now correctly targets only `configurations.sentinel.query` blocks
- **Renamed** language ID from `kql` to `otquery` for multi-language framework
- **Renamed** grammar scope from `source.kql` to `source.otquery`
- **Renamed** injection scope to `text.opentide.yaml.otquery.injection`
- **Renamed** grammar files:
  - `kql.tmLanguage.json` → `otquery.tmLanguage.json`
  - `kql-injection.json` → `otquery-injection.json`
- Updated all documentation to reflect multi-language support
- Extension now positioned as a platform for all OpenTide query languages

### Added
- Multi-language extensibility framework
- **System-specific scoping**: Two-level pattern matching (configuration block → query field)
- Roadmap for additional query language support (SPL, Sigma, Carbon Black, etc.)
- Enhanced test file with Splunk and Carbon Black query examples (currently plain text)
- Enhanced documentation covering future language additions and scoping behavior

### Fixed
- **Over-scoping issue**: Previously, any `query: |` block would receive KQL highlighting regardless of system
- Now correctly applies highlighting **only** to `configurations.sentinel.query` blocks
- Other systems (Splunk, Carbon Black) remain plain text until their grammars are implemented

### Technical Details
- Injection now uses nested pattern matching: detect `sentinel:` block first, then match `query: |` within it
- All token scopes converted from `.kql` suffix to `.otquery` suffix
- Language ID changed to `otquery` throughout the codebase
- Injection patterns use indentation-aware regex to prevent cross-system bleeding

## [0.0.1] - 2025-10-20

### Added
- Initial release
- **Complete built-in KQL grammar** with no external dependencies
- KQL syntax highlighting for `configurations.sentinel.query` fields in OpenTide model files
- Grammar injection pattern matching `query: |` block scalars
- Comprehensive KQL language support including:
  - 40+ keywords (where, project, summarize, join, union, etc.)
  - 80+ functions (ago, count, strcat, parse, datetime_add, etc.)
  - All operators (comparison, logical, string, set operations)
  - Comments (single-line // and multi-line /* */)
  - Strings (double, single, backtick, verbatim, multi-line)
  - Numbers (integer, decimal, hex, scientific notation)
  - Booleans and null
  - Timespans (1d, 2h, 30m, etc.)
  - Table and column name detection
- Language configuration for bracket matching and auto-closing pairs
- Test file with example KQL queries
- Comprehensive documentation (README, INSTALL, QUICKSTART, IMPLEMENTATION)

### Features
- Automatic detection of query blocks in OpenTide YAML files
- Full KQL syntax highlighting without external dependencies
- Non-intrusive design preserving JSON Schema validation
- Zero-configuration auto-loading from workspace extensions folder
- Self-contained TextMate grammar covering all KQL features

### Documentation
- Quick start guide (1-step setup!)
- Detailed installation instructions with multiple methods
- Implementation details for developers with regex patterns explained
- Complete KQL feature coverage documentation
- Test file for verification

## [Unreleased]

### Planned for 0.2.0
- Complete SPL (Splunk) grammar
- SPL injection for `configurations.splunk.query` fields
- Support for Splunk search commands and functions

### Planned for 0.3.0
- Sigma YAML grammar
- Multi-language support for Detection Objective examples
- Context-aware language detection

### Planned for 0.4.0
- Carbon Black query grammar
- Additional SIEM platform support (CrowdStrike, Defender, etc.)

### Future Enhancements
- Language Server Protocol (LSP) for IntelliSense
- Real-time query syntax validation
- Auto-completion for platform-specific tables/columns
- Query snippets library
- Query formatting/beautification


## [0.0.1] - 2025-10-20

### Added
- Initial release
- **Complete built-in KQL grammar** with no external dependencies
- KQL syntax highlighting for `configurations.sentinel.query` fields in TIDE MDR YAML files
- Grammar injection pattern matching `query: |` block scalars
- Comprehensive KQL language support including:
  - 40+ keywords (where, project, summarize, join, union, etc.)
  - 80+ functions (ago, count, strcat, parse, datetime_add, etc.)
  - All operators (comparison, logical, string, set operations)
  - Comments (single-line // and multi-line /* */)
  - Strings (double, single, backtick, verbatim, multi-line)
  - Numbers (integer, decimal, hex, scientific notation)
  - Booleans and null
  - Timespans (1d, 2h, 30m, etc.)
  - Table and column name detection
- Language configuration for bracket matching and auto-closing pairs
- Test file with example KQL queries
- Comprehensive documentation (README, INSTALL, QUICKSTART, IMPLEMENTATION)

### Features
- Automatic detection of Sentinel query blocks in YAML
- Full KQL syntax highlighting without external dependencies
- Non-intrusive design preserving JSON Schema validation
- Zero-configuration auto-loading from workspace extensions folder
- Self-contained TextMate grammar covering all KQL features

### Documentation
- Quick start guide (1-step setup!)
- Detailed installation instructions with multiple methods
- Implementation details for developers with regex patterns explained
- Complete KQL feature coverage documentation
- Test file for verification

## [Unreleased]

### Planned
- Support for other SIEM query languages (Splunk SPL)
- IntelliSense and auto-completion (future LSP implementation)
- Real-time KQL syntax validation
- Multi-language support for Detection Objective examples
- Snippet library for common KQL patterns
- Query formatting/beautification

