# Command vs Function Testing Guide

## Overview

This guide explains how to test and verify the command/function distinction in SyntaxTide's SPL implementation.

## Core Concept: Commands vs Functions

### Commands (BLUE)
- Appear **after the pipe** `|` operator
- Start a new processing step in the SPL pipeline
- Examples: `stats`, `eval`, `where`, `sort`, `dedup`, `rename`

### Functions (PURPLE)
- Appear **inside expressions** (within `eval`, `where`, and aggregate commands)
- Perform operations on values and return results
- Examples: `len()`, `trim()`, `md5()`, `if()`, `case()`

## Visual Testing

### Color Scheme
| Element | Color | Scope Example |
|---------|-------|---------------|
| Commands | **BLUE** | `entity.name.function.command.streaming.spl` |
| Functions | **PURPLE** | `support.function.string.spl` |
| Keywords | **ORANGE** | `keyword.operator.logical.spl` |
| Arguments | **GREEN** | `variable.other.spl` |
| Comments | **GRAY** | `comment.line.spl` |

### How to Test Colors

1. Open `tests/lsp-test-comprehensive.yaml` in VS Code
2. Scroll to the SPL query section  
3. Verify visual distinction:

**Commands should be BLUE:**
```spl
| stats count by host          # stats = BLUE
| eval value=1                  # eval = BLUE
| where status==200             # where = BLUE
| sort -count                   # sort = BLUE
```

**Functions should be PURPLE:**
```spl
| eval length=len(message)          # len = PURPLE
| eval trimmed=trim(field)           # trim = PURPLE
| eval result=if(x>10, "yes", "no")  # if = PURPLE
| where in(status, "404", "500")     # in = PURPLE
```

**Keywords should be ORANGE:**
```spl
| eval result=field1 AND field2     # AND = ORANGE
| stats count AS total BY host      # AS, BY = ORANGE
```

## Functional Testing

### Test 1: Command Autocomplete
1. Open `tests/lsp-test-comprehensive.yaml`
2. Type `| st` after an existing command
3. Press `Ctrl+Space`
4. **Expected**: See autocomplete with `stats`, `streamstats`, `sistats`
5. **Verify**: Autocomplete shows commands, not functions

### Test 2: Function Autocomplete  
1. Type `| eval test=le`
2. Press `Ctrl+Space`
3. **Expected**: See autocomplete with `len()`, `like()`, `lower()`
4. **Verify**: Autocomplete shows functions (with parentheses), not commands

### Test 3: Optional Parameters
These functions should accept 1 OR 2 parameters:

```spl
| eval trimmed=trim(field)           # 1 param - VALID
| eval trimmed2=trim(field, " ")     # 2 params - VALID
| eval rounded=round(value)          # 1 param - VALID
| eval rounded2=round(value, 2)      # 2 params - VALID
```

**Verify**: No errors in Problems panel (`Ctrl+Shift+M`)

### Test 4: Variadic Parameters
These functions accept 2+ parameters:

```spl
| eval check=in(status, "404")                          # 2 params - VALID
| eval check2=in(status, "404", "500", "503")           # 4 params - VALID
| eval first=coalesce(field1, field2, field3, "default") # 4 params - VALID
| eval combined=mvappend(f1, f2, f3, f4, f5)            # 5 params - VALID
```

**Verify**: No errors in Problems panel

### Test 5: Error Detection
Uncomment these lines to test error detection:

```spl
# | eval bad1=in(status)              # ERROR: requires at least 2 params
# | eval bad2=trim()                   # ERROR: requires at least 1 param
# | eval bad3=if(x>10)                 # ERROR: requires exactly 3 params
# | eval bad4=round(value, 2, 3)       # ERROR: accepts at most 2 params
# | eval bad5=now(123)                 # ERROR: accepts 0 params
```

**Expected**: Each uncommented line shows a red squiggle with error message in Problems panel

### Test 6: Hover Information

**Hover over commands:**
1. Hover over `stats` → See full command documentation
2. Hover over `eval` → See command details with syntax
3. Hover over `where` → See command usage information

**Hover over functions:**
1. Hover over `trim` → See `trim(<str>, [<trim_chars>])` with description
2. Hover over `in` → See `in(<field>, <value1>, <value2>, ...)` with description
3. Hover over `round` → See `round(<num>, [<precision>])` with description

### Test 7: Signature Help
1. Type `| eval result=if(`
2. **Expected**: Popup shows `if(<condition>, <true_value>, <false_value>)`
3. As you type parameters, the current parameter highlights
4. **Verify**: Signature help works for nested functions too

### Test 8: Context Detection
The LSP should understand context:

**After pipe = Command context:**
```spl
| st<Ctrl+Space>     # Shows: stats, streamstats (COMMANDS)
```

**Inside eval = Function context:**
```spl
| eval x=le<Ctrl+Space>   # Shows: len(), like(), lower() (FUNCTIONS)
```

**Inside where = Function context:**
```spl
| where in(<Ctrl+Space>   # Shows function parameters, not commands
```

## Test Files

### Main Test Files
1. **lsp-test-comprehensive.yaml**: Complete 29-section test covering all features
2. **lsp-test-validation.yaml**: 21 validation scenarios with error cases
3. **lsp-test.yaml**: Basic LSP features (autocomplete, hover, signatures)
4. **query-highlighting.yaml**: Syntax highlighting tests for all query languages

### Test File Locations
```
tests/
├── COMMAND_VS_FUNCTION_GUIDE.md     ← This file
├── TESTING_GUIDE.md                  ← Comprehensive LSP testing guide
├── lsp-test-comprehensive.yaml       ← 29-section comprehensive test
├── lsp-test-validation.yaml          ← 21 validation scenarios
├── lsp-test.yaml                     ← Basic LSP features
└── query-highlighting.yaml           ← Syntax highlighting tests
```

## Debugging

### Check Output Panel
1. Open Output panel: `View` → `Output`
2. Select "SyntaxTide Language Server" from dropdown
3. Look for LSP logs showing:
   - Document opened
   - Validation triggered
   - Completion requested
   - Hover information sent

### Check Developer Tools
1. Open Developer Tools: `Help` → `Toggle Developer Tools`
2. Go to Console tab
3. Look for any JavaScript errors or warnings

### Check Problems Panel
1. Open Problems panel: `Ctrl+Shift+M`
2. Should show validation errors for incorrect SPL
3. Errors should have clear messages like:
   - "Function 'in' requires at least 2 parameters, but got 1"
   - "Function 'round' accepts at most 2 parameters, but got 3"

### Common Issues

**Issue: Functions showing as misspelled (staying GREEN)**
- **Cause**: Function not in database or typo in function name
- **Fix**: Check `src/spl-functions-database.ts` for function definition

**Issue: Commands not highlighted (staying GREEN)**  
- **Cause**: Command not in grammar or not after pipe
- **Fix**: Check `syntaxes/spl.tmLanguage.json` for command pattern

**Issue: No autocomplete appearing**
- **Cause**: LSP server not running or context detection failed
- **Fix**: Reload window (`Ctrl+Shift+P` → "Developer: Reload Window")

**Issue: Validation errors incorrect**
- **Cause**: Function signature doesn't match SPL conventions
- **Fix**: Check function signature in database (should use `[optional]` and `...variadic`)

**Issue: Colors don't look distinct**
- **Cause**: Theme doesn't provide distinct colors for all scope types
- **Fix**: Customize theme settings (see README.md for examples)

## Expected Results Summary

✅ **Commands** (after `|`) appear in **BLUE**  
✅ **Functions** (in expressions) appear in **PURPLE**  
✅ **Keywords** (AND, OR, AS, BY) appear in **ORANGE**  
✅ **Arguments/Fields** appear in **GREEN**  
✅ **Misspelled items** stay **GREEN** (not colored)  
✅ **Optional parameters** work (e.g., `trim(field)` or `trim(field, " ")`)  
✅ **Variadic parameters** work (e.g., `in(status, "404", "500", "503")`)  
✅ **Error detection** shows red squiggles with clear messages  
✅ **Autocomplete** shows appropriate suggestions based on context  
✅ **Hover** shows rich documentation with signatures  
✅ **Signature help** appears when typing function calls  

## Further Reading

- **Architecture**: See `.github/copilot-instructions.md` - Complete architecture documentation
- **LSP Features**: See `src/README.md` - Developer guide for LSP implementation
- **Testing**: See `tests/TESTING_GUIDE.md` - Comprehensive testing instructions
- **Grammar**: See `syntaxes/README.md` - Syntax highlighting architecture and color scheme
- **Analysis**: See `query-languages/splunk/ANALYSIS.md` - Complete SPL function/command analysis

## Quick Test Checklist

- [ ] Open `tests/lsp-test-comprehensive.yaml`
- [ ] Verify commands are BLUE (stats, eval, where, sort)
- [ ] Verify functions are PURPLE (len, trim, md5, if, case)
- [ ] Verify keywords are ORANGE (AND, OR, AS, BY)
- [ ] Test autocomplete after `|` (shows commands)
- [ ] Test autocomplete in `eval` (shows functions)
- [ ] Test optional params: `trim(field)` - no error
- [ ] Test variadic params: `in(status, "404", "500")` - no error
- [ ] Test error detection: `| eval bad=in(status)` - shows error
- [ ] Test hover on commands (shows documentation)
- [ ] Test hover on functions (shows signatures)
- [ ] Test signature help: `| eval x=if(` (shows params)
- [ ] Check Problems panel (Ctrl+Shift+M) for validation errors
- [ ] Check Output panel for LSP logs

✅ All checkmarks = Implementation working correctly!
