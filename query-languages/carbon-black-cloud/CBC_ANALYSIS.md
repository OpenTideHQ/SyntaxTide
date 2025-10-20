# Carbon Black Cloud Query Language - Syntax Analysis

## 📚 Analysis from Real Queries

### Query Structure Patterns Observed:

```
1. Simple field:value
   process_name:wscript.exe

2. Negation with NOT or !
   NOT process_name:explorer.exe
   !process_name:sethc.exe

3. Boolean operators
   AND, OR, NOT (case insensitive typically)

4. Grouping with parentheses
   (process_name:cmd.exe AND netconn_count:[1 TO *])

5. Range queries
   netconn_count:[1 TO *]

6. Wildcard in field values
   process_cmdline:*password*

7. Escaped characters
   process_cmdline:\\\\net1.cec.eu.int\\commonservices\\
   process_cmdline:C\:\\Program\ Files\\

8. Special field syntax
   -enriched:true (negation with dash prefix)
```

## 🔍 Key Components to Highlight

### 1. Field Names (Need Complete List from PDF)
From examples seen:
- `process_name`
- `process_cmdline`
- `process_original_filename`
- `process_effective_reputation`
- `childproc_name`
- `childproc_cmdline`
- `netconn_count`
- `enriched`
- `device_os`
- `parent_name`

### 2. Operators
- `:` (field assignment - most critical)
- `AND`, `OR`, `NOT` (boolean, case insensitive?)
- `!` (negation prefix)
- `-` (negation prefix for fields like `-enriched:true`)
- `(`, `)` (grouping)
- `[`, `]` (range brackets)
- `TO` (range separator)

### 3. Special Values
- `NOT_LISTED` (reputation value)
- `true`, `false` (booleans)
- `WINDOWS` (OS enum)
- `*` (wildcard - any characters)
- `?` (wildcard - single character)

### 4. Escape Sequences
- `\\` (backslash escape)
- `\:` (escaped colon)
- `\ ` (escaped space)

### 5. Range Syntax
- `[min TO max]` - inclusive range
- `[1 TO *]` - open-ended range (1 or more)
- `{min TO max}` - exclusive range (if supported)

## 📖 Questions for PDF Documentation

### Critical:
1. **Complete field list** - What are all valid CBC fields?
2. **Field types** - Which fields accept ranges? Which are strings? Enums?
3. **Operator precedence** - How do AND/OR bind? (left-to-right? precedence?)
4. **Case sensitivity** - Are field names case-sensitive? Values? Operators?
5. **Quote requirements** - When are quotes required vs optional?
6. **Wildcard rules** - Where can * and ? be used? Anywhere in values?
7. **Negation syntax** - Is `!field:value` same as `NOT field:value`? What about `-field:value`?

### Important:
8. **Regular expressions** - Are regex patterns supported? What syntax?
9. **Exists operator** - How to query "field exists" vs "field doesn't exist"?
10. **NULL/empty handling** - How to search for empty fields?
11. **Multi-value fields** - How to query fields with multiple values?
12. **Reserved characters** - Full list of characters requiring escape?

### Nice-to-Have:
13. **Comment syntax** - Are comments supported in queries?
14. **Macros/functions** - Any built-in functions like SPL or KQL?
15. **Subsearches** - Can queries be nested?
16. **Field aliases** - Do fields have multiple names?

## 🎯 TextMate Grammar Strategy

### Patterns to Implement:

1. **Comments** (if supported)
   - Check PDF for syntax

2. **Strings** (quoted values)
   ```
   process_name:"cmd.exe"
   process_cmdline:"C:\Windows\System32\cmd.exe"
   ```

3. **Field Names** (before colon)
   ```
   Match: [a-zA-Z_][a-zA-Z0-9_]* followed by :
   Scope: variable.other.field.cbc
   ```

4. **Operators**
   - Boolean: AND, OR, NOT (case insensitive)
   - Negation: !, -
   - Assignment: :
   - Grouping: (, )
   - Range: [, ], TO

5. **Special Values**
   - Reputation enums: NOT_LISTED, TRUSTED, etc.
   - OS enums: WINDOWS, MAC, LINUX
   - Booleans: true, false

6. **Wildcards**
   - * and ? in field values

7. **Escape Sequences**
   - Backslash escapes

8. **Ranges**
   - `[number TO number]`
   - `[number TO *]`

9. **Numbers**
   - Integers in ranges and field values

## 📋 Implementation Plan

### Phase 1: Read PDF and Extract
- [ ] Read PDF documentation
- [ ] Extract complete field list
- [ ] Identify all operators and syntax rules
- [ ] Note special value types and enums
- [ ] Document escape rules and edge cases

### Phase 2: Build Grammar Repository
- [ ] Field name patterns
- [ ] Operator patterns (boolean, assignment, grouping)
- [ ] Value patterns (strings, numbers, wildcards, special values)
- [ ] Escape sequence handling
- [ ] Range query syntax

### Phase 3: Test Against Real Queries
- [ ] Test with examples from Models Library
- [ ] Verify negation syntax (!  vs NOT vs -)
- [ ] Check wildcard and escape handling
- [ ] Validate range queries

### Phase 4: Documentation
- [ ] Update README with CBC support
- [ ] Add CBC examples to test file
- [ ] Document known limitations

## 🚀 Expected Output

```json
{
  "scopeName": "source.cbc",
  "name": "Carbon Black Cloud Query",
  "patterns": [
    { "include": "#boolean-operators" },
    { "include": "#field-queries" },
    { "include": "#ranges" },
    { "include": "#strings" },
    { "include": "#special-values" },
    { "include": "#numbers" },
    { "include": "#wildcards" }
  ],
  "repository": {
    "boolean-operators": { ... },
    "field-queries": { ... },
    // etc.
  }
}
```

Ready to read the PDF and build comprehensive CBC grammar! 📖
