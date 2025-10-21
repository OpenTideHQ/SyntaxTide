# SPL Macro Support Implementation

## Overview
Implemented comprehensive support for Splunk macro syntax in SyntaxTide extension, including syntax highlighting, validation, and error detection.

## Implementation Date
January 2025

## Features Implemented

### 1. TextMate Grammar Enhancement (`syntaxes/spl.tmLanguage.json`)

**Enhanced Macro Pattern:**
- **Scope**: `meta.macro-call.spl` for entire macro call
- **Begin/End Captures**: `punctuation.definition.macro.begin/end.spl` for backticks
- **Macro Name**: `entity.name.function.macro.spl` for identifier
- **Arguments**: `meta.macro-arguments.spl` for parenthesized argument list
- **Punctuation**: Separate scopes for `(`, `)`, and `,` separators

**Pattern Structure:**
```json
{
  "name": "meta.macro-call.spl",
  "begin": "(`)",
  "beginCaptures": {
    "1": {"name": "punctuation.definition.macro.begin.spl"}
  },
  "end": "(`)",
  "endCaptures": {
    "1": {"name": "punctuation.definition.macro.end.spl"}
  },
  "patterns": [
    {
      "match": "([a-zA-Z_][a-zA-Z0-9_]*)",
      "name": "entity.name.function.macro.spl"
    },
    {
      "name": "meta.macro-arguments.spl",
      "begin": "(\\()",
      "end": "(\\))",
      "patterns": [/* argument content */]
    }
  ]
}
```

### 2. Validation Logic (`src/spl-validation.ts`)

**Macro Detection:**
- Check if command starts with backtick: `commandPart.startsWith('`')`
- Validate syntax with regex: `/^`([a-zA-Z_][a-zA-Z0-9_]*)(\([^)]*\))?`$/`
- Skip command validation for valid macros (user-defined, not in command database)

**Error Detection:**
- Invalid macro syntax (missing closing backtick)
- Invalid characters in macro name
- Malformed argument list

**Implementation:**
```typescript
if (commandPart.startsWith('`')) {
  const macroMatch = commandPart.match(/^`([a-zA-Z_][a-zA-Z0-9_]*)(\([^)]*\))?`$/);
  if (!macroMatch) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: Range.create(
        lineNum, 
        commandStart + charOffset, 
        lineNum, 
        commandStart + commandPart.length + charOffset
      ),
      message: `Invalid macro syntax. Expected: \`macro_name\` or \`macro_name(args)\``,
      source: 'spl-validator'
    });
  }
  continue; // Skip command validation for valid macros
}
```

### 3. Documentation (`query-languages/splunk/ANALYSIS.md`)

**Section 6.4 Enhanced:**
- Complete macro syntax specification
- Usage patterns (standalone, with arguments, inline, after pipes)
- Validation rules (syntax pattern, no existence checking)
- Common examples from real Splunk queries

## Macro Syntax Rules

**Valid Patterns:**
- `` `macro_name` `` - Simple macro without arguments
- `` `macro_name(arg1, arg2, ...)` `` - Macro with arguments

**Identifier Rules:**
- Start with letter or underscore: `[a-zA-Z_]`
- Followed by letters, digits, or underscores: `[a-zA-Z0-9_]*`

**Argument Rules:**
- Comma-separated list within parentheses
- Can be any SPL expression (strings, numbers, field references)
- No validation of argument count (macro definition in Splunk config)

## Test Coverage

**Test File:** `tests/lsp-test-comprehensive.yaml`

**Macro Examples (lines 187-191):**
1. `` `security_content_summariesonly` `` - Simple macro, inline with tstats
2. `` `drop_dm_object_name(Filesystem)` `` - Macro with single argument, after pipe
3. `` `security_content_ctime(firstTime)` `` - Macro with field reference argument
4. `` `security_content_ctime(lastTime)` `` - Second ctime macro call
5. `` `executables_or_script_creation_in_suspicious_path_filter` `` - Long macro name, no args

**Expected Behavior:**
- ✅ All valid macros should highlight correctly (backticks, name, arguments)
- ✅ No "unknown command" errors for valid macros
- ✅ Invalid macro syntax should show error diagnostic
- ✅ Macros should work in any position (after pipes, inline with commands)

## Design Decisions

### 1. No Macro Existence Checking
- **Rationale**: Macros are user-defined in Splunk's `macros.conf`
- **Approach**: Only validate syntax, not existence
- **Benefit**: Users can use any macro name without false errors

### 2. No Macro Expansion
- **Rationale**: Macros expanded at Splunk server preprocessing phase
- **Approach**: Skip command/function validation for macro content
- **Benefit**: Simple implementation, no need to track macro definitions

### 3. Regex-Based Syntax Validation
- **Pattern**: `/^`([a-zA-Z_][a-zA-Z0-9_]*)(\([^)]*\))?`$/`
- **Captures**: Group 1 = macro name, Group 2 = argument list (optional)
- **Limitations**: Doesn't validate individual arguments (deferred to Splunk)

### 4. Separate Grammar Scope
- **Meta Scope**: `meta.macro-call.spl` for entire macro
- **Detail Scopes**: Separate punctuation, name, and argument scopes
- **Benefit**: Theme authors can customize macro coloring independently

## Integration Points

### Server.ts
- No changes needed - macro validation happens in `spl-validation.ts`
- Macros skip command validation automatically

### SPL Commands Database
- No macro entries (macros are user-defined)
- Validation continues normally for non-macro commands

### SPL Functions Database
- No macro function entries
- Macros can expand to function calls (handled at Splunk server)

## Future Enhancements

### Potential Improvements:
1. **Macro Definition Tracking**: Parse `macros.conf` files to track definitions
2. **Argument Count Validation**: Validate argument count against definitions
3. **Macro Autocomplete**: Suggest known macros from workspace
4. **Go to Definition**: Jump to macro definition in `macros.conf`
5. **Hover Information**: Show macro definition on hover

### Current Limitations:
- No autocomplete for macros (would require parsing Splunk config files)
- No validation of argument count or types
- No expansion preview in hover info
- No go-to-definition support

## Verification Steps

1. **Compile**: `npm run compile` - Should complete without errors ✅
2. **Reload**: `Ctrl+Shift+P` → "Developer: Reload Window"
3. **Open Test File**: `tests/lsp-test-comprehensive.yaml`
4. **Navigate to Lines 187-191**: Check macro examples
5. **Verify Highlighting**: Backticks, names, arguments should be colored distinctly
6. **Check Diagnostics**: No errors for valid macros
7. **Test Invalid Syntax**: Try `` `invalid-name` `` or `` `unclosed `` - should show errors

## Related Documentation

- **TextMate Grammar Reference**: `syntaxes/README.md`
- **SPL Analysis**: `query-languages/splunk/ANALYSIS.md` section 6.4
- **Testing Guide**: `tests/TESTING_GUIDE.md`
- **Splunk Documentation**: [Splunk Search Reference - About macros](https://docs.splunk.com/Documentation/Splunk/latest/Search/Usesearchmacros)

## Status

**Implementation**: ✅ Complete  
**Compilation**: ✅ Successful  
**Testing**: 🔄 Ready for manual verification  
**Documentation**: ✅ Complete

---

*Last Updated: January 2025*
