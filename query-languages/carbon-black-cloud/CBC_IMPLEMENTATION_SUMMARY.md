# Carbon Black Cloud Query Syntax - Implementation Summary

## Overview

This document summarizes the implementation of Carbon Black Cloud (CBC) query syntax highlighting for the OpenTide Query Syntax Highlighting extension.

## Implementation Date
2025-10-20 (Version 0.3.0)

## Source Documentation
- **Primary Source**: `carbon_black_cloud_query_syntax.md` (1,818 lines)
- **Real-World Examples**: 20+ CBC queries from Models Library MDR files
- **Query Syntax Type**: Lucene-based field:value syntax with boolean operators

## Grammar Coverage

### 1. Field Categories (80+ fields across 9 categories)

#### Process Fields
- `process_name`, `process_cmdline`, `process_pid`, `process_username`
- `process_hash`, `process_publisher`, `process_reputation`, `process_effective_reputation`
- `parent_name`, `parent_pid`, `parent_hash`, `parent_cmdline`

#### Network Fields
- `netconn_count`, `netconn_ipv4`, `netconn_ipv6`, `netconn_domain`, `netconn_port`
- `ipaddr`, `ipport`, `domain`, `dns_name`

#### File Fields
- `filemod`, `filemod_name`, `filemod_hash`, `filemod_count`
- `modload`, `modload_name`, `modload_hash`, `modload_publisher`

#### Host Fields
- `device_name`, `device_os`, `device_os_version`, `device_policy`
- `device_group`, `device_timestamp`, `sensor_action`

#### Signature Fields
- `digsig_result`, `digsig_publisher`, `digsig_issuer`, `digsig_sign_time`

#### Cross-Process Fields
- `crossproc_type`, `crossproc_name`, `crossproc_action`, `crossproc_target`

#### Metadata Fields
- `alert_id`, `threat_id`, `watchlist_id`, `report_id`
- `event_type`, `backend_timestamp`, `enriched`

#### Time Fields
- `start`, `end`, `last_update`, `device_timestamp`

#### Binary Fields
- `observed_filename`, `original_filename`, `file_version`, `company_name`
- `product_name`, `signed`, `md5`, `sha256`

### 2. Operators

#### Boolean Operators
- `AND`, `OR`, `NOT`
- Negation: `-` (minus prefix), `!` (exclamation prefix)

#### Grouping
- Parentheses `()` for complex boolean logic with nested groups

#### Range Queries
- `[X TO Y]` - Inclusive range (square brackets)
- `{X TO Y}` - Exclusive range (curly braces)
- `[X TO *]` - Open-ended range (1 or more)
- `{* TO Y}` - Open-ended range (less than Y)

### 3. Special Values

#### Reputation Enumerations
- `NOT_LISTED`, `PUP`, `TRUSTED_WHITE_LIST`, `ADAPTIVE_WHITE_LIST`
- `COMMON_WHITE_LIST`, `KNOWN_MALWARE`, `SUSPECT_MALWARE`, `COMPANY_BLACK_LIST`

#### Operating System Types
- `WINDOWS`, `MAC`, `LINUX`, `OTHER`

#### Host Types
- `workload`, `endpoint`, `domain controller`, `server`

#### Signature Results
- `Signed`, `Unsigned`, `Expired`, `Bad Signature`, `Invalid Signature`, `Invalid Chain`

#### Cross-Process Types
- `remotethread`, `processopen`, `open_process_handle`, `open_thread_handle`

#### Boolean Values
- `true`, `false`

### 4. Wildcards
- `*` - Multi-character wildcard (matches zero or more characters)
- `?` - Single-character wildcard (matches exactly one character)

### 5. Data Types

#### Network Patterns
- **IPv4**: `192.168.1.1`, `10.0.0.0/8` (with CIDR notation)
- **IPv6**: `2001:0db8:85a3::8a2e:0370:7334`
- **Port Numbers**: `80`, `443`, `8080`

#### Hash Values
- **MD5**: 32-character hexadecimal strings
- **SHA256**: 64-character hexadecimal strings
- **Generic Hex**: Prefixed with `0x`

#### Strings
- **Quoted**: `"value with spaces"`
- **Unquoted**: `simple_value`
- **Escaped**: `path\\to\\file`, `domain\ controller`

#### Numbers
- **Integers**: `1`, `100`, `1000`
- **Negative**: `-1`, `-100`

#### Time Values
- **Relative**: `-24h`, `-7d`, `+1h`
- **ISO Format**: `2025-10-20T12:00:00Z`

### 6. Comments
- Line comments with `#` prefix

## Grammar Structure

### Main Patterns
1. **Comments** - `#` line comments
2. **Field Queries** - `field:value` with categorized field names
3. **Boolean Operators** - `AND`, `OR`, `NOT`, `-`, `!`
4. **Grouping** - Parentheses for nested logic
5. **Range Queries** - `[X TO Y]` bracket syntax
6. **Strings** - Quoted values with escape sequences
7. **Special Values** - Enumeration matching (reputation, OS, etc.)
8. **Numbers** - Hex, hashes, integers, IP addresses
9. **Wildcards** - `*` and `?` for pattern matching

### Repository Sections
- `comments` - Line comments
- `field-query` - All 80+ fields with entity.name.tag scope
- `boolean-operators` - AND, OR, NOT with keyword.operator scope
- `grouping` - Parentheses with punctuation.section.group scope
- `range-query` - Bracket/brace ranges with keyword.operator.range scope
- `strings` - Double-quoted strings with string.quoted.double scope
- `special-values` - Enumerations with constant.language scope
- `numbers` - Various numeric patterns with constant.numeric scope
- `wildcards` - `*` and `?` with keyword.operator.wildcard scope

## Injection Pattern

### Two-Level Detection
1. **Configuration Block**: Match `carbon_black_cloud:` key at any indentation
2. **Query Block**: Within the configuration block, match `query: |` block scalar
3. **Content Injection**: Apply `source.cbc` grammar to the content of the block scalar

### Injection Scope
- `text.opentide.yaml.cbc.injection`
- Embedded language: `source.cbc`
- Pattern prevents cross-system bleeding (only applies to `carbon_black_cloud:` blocks)

## Testing Strategy

### Test File
- `test-kql-highlighting.yaml` includes comprehensive CBC query example
- Tests multiple features: process fields, network ranges, boolean logic, negation, special values

### Real-World Validation
- 20+ MDR files in Models Library contain CBC queries
- Examples include: childproc monitoring, registry modifications, network connections
- Common patterns: reputation filtering, range queries, complex boolean logic

## Key Differences from KQL/SPL

1. **No Pipe Operators**: CBC is Lucene-based, not pipeline-based
2. **Field-Centric**: All queries are field:value pairs
3. **Boolean Logic**: Explicit AND/OR/NOT instead of implied operators
4. **Range Syntax**: Square/curly bracket ranges instead of operators
5. **Wildcards**: Built into the syntax, not function calls
6. **Case Sensitivity**: Field names are case-sensitive

## Known Edge Cases

### Handled
- ✅ Nested parentheses (unlimited depth)
- ✅ Negation with both `-` and `!` prefixes
- ✅ Escape sequences in field values (`\\`, `\ `)
- ✅ IPv4 and IPv6 addresses with CIDR notation
- ✅ Open-ended ranges (`[1 TO *]`, `{* TO 100}`)
- ✅ Mixed quoted and unquoted values

### Potential Gaps
- ⚠️ Unicode escapes in strings (not documented in CBC syntax)
- ⚠️ Complex regex patterns in field values (if supported)
- ⚠️ Custom field names (grammar covers documented fields only)

## Documentation Sources

### Analyzed
- `carbon_black_cloud_query_syntax.md` (1,818 lines)
  - Lines 1-200: Query syntax, terms, phrases, operators
  - Lines 200-400: Field restrictions, whitespace, negation
  - Lines 400-600: Complete field list with descriptions
  - Lines 793-1000: Field types (domain, ipaddr, text, count, datetime, keyword, md5, sha256, ja3)

### Real-World Examples
- `Alternate data stream with wscript.exe.yaml`
- `AppCert DLLs.yaml`
- 18+ additional MDR files with CBC queries

## Confidence Assessment

### High Confidence (90%+)
- Field names and categories
- Boolean operators (AND, OR, NOT)
- Range query syntax
- Special value enumerations (reputation, OS, etc.)
- Wildcard syntax

### Medium Confidence (70-90%)
- Complete field list coverage (may have undocumented fields)
- Escape sequence handling (documented but edge cases possible)
- Comment syntax (observed in examples, not explicitly documented)

### Low Confidence (50-70%)
- Advanced field types (ja3, ja3s - observed but minimal documentation)
- Custom field support (if available)
- Query optimization hints (if any)

## Future Enhancements

### Potential Additions
1. **Field Value Validation**: Syntax-aware validation for specific field types
2. **Autocomplete**: Field name and special value suggestions
3. **Hover Documentation**: Show field descriptions on hover
4. **Query Linting**: Detect invalid field names or syntax errors
5. **Custom Fields**: Support for organization-specific fields

### Grammar Refinements
1. More specific number patterns for specific fields (ports, counts, etc.)
2. Date/time format validation
3. Path validation for file/registry fields
4. Domain name pattern validation

## Version History

### v0.3.0 (2025-10-20)
- Initial CBC grammar implementation
- 80+ fields across 9 categories
- Complete Lucene syntax support
- Integration with OpenTide extension

## Related Files

- `syntaxes/cbc.tmLanguage.json` - CBC grammar definition (330+ lines)
- `syntaxes/cbc-injection.json` - Injection pattern for YAML block scalars
- `test-kql-highlighting.yaml` - Test file with CBC examples
- `CBC_ANALYSIS.md` - Initial syntax analysis and requirements
- `carbon_black_cloud_query_syntax.md` - Source documentation (1,818 lines)

## References

- Carbon Black Cloud Query Syntax Guide (official documentation)
- OpenTide Models Library (real-world query examples)
- TextMate Language Grammars specification
- VS Code Language Extensions documentation
