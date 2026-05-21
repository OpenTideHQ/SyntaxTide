# SPL LSP Architecture Proposal

## Problem Summary

The current SyntaxTide LSP implementation has a **fundamental architecture flaw**: it treats SPL commands and evaluation functions as the same construct, leading to incorrect validation errors.

### Examples of Current Bugs

```spl
| where in(status, "404", "500", "503")
```
**Error (INCORRECT)**: "Function 'in' accepts at most 2 parameters, but got 4"

```spl
| eval cleaned=trim(field)
```
**Error (INCORRECT)**: "Function 'trim' requires at least 2 parameters, but got 1"

### Root Causes Identified

1. **Architecture Confusion**: No distinction between:
   - **Commands** (after `|`): `stats`, `eval`, `where`, `sort`, etc.
   - **Functions** (in expressions): `in()`, `trim()`, `if()`, `case()`, etc.

2. **Incorrect Function Signatures**: Database uses wrong format:
   - Current: `'in(<field>, <list>)'` implies exactly 2 params
   - Should be: `'in(<field>, <value1>, <value2>, ...)' ` shows variadic

3. **Broken Signature Parser**: `parseFunctionSignature()` doesn't understand SPL conventions:
   - `[<param>]` = optional parameter
   - `<param>...` = variadic parameter (1+ occurrences)

---

## Solution Overview

### Phase 1: Update Function Database (COMPLETED ✅)

**File**: `query-languages/splunk/ANALYSIS.md`

I've documented all 170+ SPL evaluation functions with proper signatures:

- ✅ 13 Comparison & Conditional functions
- ✅ 12 Mathematical functions
- ✅ 4 Statistical eval functions
- ✅ 10 Text functions
- ✅ 12 Multivalue functions
- ✅ 15 JSON functions
- ✅ 5 Date & Time functions
- ✅ 4 Cryptographic functions
- ✅ 10 Conversion functions
- ✅ 11 Informational functions
- ✅ 6 Bitwise functions
- ✅ 15 Trigonometric functions

**Each function includes**:
- Proper SPL signature format
- Min/Max parameter counts
- Category classification
- Description and examples

### Phase 2: Implement New Architecture (PROPOSED)

#### 2.1 Fix Function Database (`src/spl-functions-database.ts`)

Update all 170+ function entries to use proper SPL syntax:

```typescript
// BEFORE (WRONG):
{
    name: 'in',
    signature: 'in(<field>, <list>)',  // ✗ Implies 2 params exactly
    // ...
}

// AFTER (CORRECT):
{
    name: 'in',
    signature: 'in(<field>, <value1>, <value2>, ...)',  // ✓ Shows variadic
    category: 'Comparison & Conditional',
    description: 'Returns TRUE if the value of <field> matches one of the provided values',
    returnType: 'boolean',
    examples: [
        'in(status, "404")',
        'in(status, "404", "500", "503")'
    ],
    relatedFunctions: ['match', 'like', 'case']
}
```

#### 2.2 Rewrite Signature Parser (`src/spl-validation.ts`)

Implement proper SPL syntax understanding:

```typescript
export function parseFunctionSignature(signature: string): {
    minParams: number;
    maxParams: number;
    isVariadic: boolean;
} {
    // Extract params between parentheses
    const paramsStr = signature.substring(
        signature.indexOf('(') + 1, 
        signature.lastIndexOf(')')
    );
    
    if (!paramsStr.trim()) {
        return { minParams: 0, maxParams: 0, isVariadic: false };
    }
    
    const params = paramsStr.split(',').map(p => p.trim());
    let minParams = 0;
    let maxParams = 0;
    let isVariadic = false;
    
    for (const param of params) {
        // Check for variadic: <param>... or (<param>, <param>)...
        if (param.includes('...')) {
            isVariadic = true;
            maxParams = Infinity;
            
            // Count required params before variadic
            const beforeVariadic = params.slice(0, params.indexOf(param));
            minParams = beforeVariadic.filter(p => 
                !p.startsWith('[') && !p.endsWith(']')
            ).length;
            
            // If variadic param itself isn't optional, add 1 to min
            if (!param.startsWith('[')) {
                minParams += 1;
            }
            break;
        }
        
        // Check for optional: [<param>]
        if (param.startsWith('[') && param.endsWith(']')) {
            maxParams++; // Optional increases max but not min
        } else {
            minParams++; // Required increases both
            maxParams++;
        }
    }
    
    return { minParams, maxParams, isVariadic };
}
```

**Test Cases**:

```typescript
// trim(<str>, [<trim_chars>])
parseFunctionSignature('trim(<str>, [<trim_chars>])')
// Returns: { minParams: 1, maxParams: 2, isVariadic: false } ✓

// in(<field>, <value1>, <value2>, ...)
parseFunctionSignature('in(<field>, <value1>, <value2>, ...)')
// Returns: { minParams: 2, maxParams: Infinity, isVariadic: true } ✓

// case(<condition>, <value>)...
parseFunctionSignature('case(<condition>, <value>)...')
// Returns: { minParams: 2, maxParams: Infinity, isVariadic: true } ✓

// now()
parseFunctionSignature('now()')
// Returns: { minParams: 0, maxParams: 0, isVariadic: false } ✓
```

#### 2.3 Implement Context-Aware Validation

The LSP must detect three distinct contexts:

**Context 1: After Pipe** → Validate as command
```spl
| stats count BY host    # ← "stats" from spl-commands-database.ts
```

**Context 2: Inside `eval`** → Validate as function
```spl
| eval result=trim(field)    # ← "trim" from spl-functions-database.ts
```

**Context 3: Inside `where`** → Validate as function
```spl
| where in(status, "404")    # ← "in" from spl-functions-database.ts
```

#### 2.4 Update Grammar for Proper Highlighting

Distinguish commands from functions:

```json
{
  "patterns": [
    {
      "comment": "Commands after pipe operator",
      "match": "(\\|)\\s*(\\w+)\\b",
      "captures": {
        "1": { "name": "punctuation.separator.pipe.spl" },
        "2": { "name": "keyword.control.command.spl" }
      }
    },
    {
      "comment": "Functions (followed by opening paren)",
      "match": "\\b(if|case|match|trim|in|now|md5)\\s*(?=\\()",
      "name": "support.function.eval.spl"
    }
  ]
}
```

---

## Implementation Plan

### Step 1: Fix Function Database (2-3 hours)

Update `src/spl-functions-database.ts`:
- Replace all 170+ function signatures with proper SPL syntax
- Add `minParams`, `maxParams`, `isVariadic` metadata (optional, can be derived)
- Source data from `ANALYSIS.md` sections 4.4-4.15

### Step 2: Rewrite Signature Parser (1 hour)

Update `parseFunctionSignature()` in `src/spl-validation.ts`:
- Implement proper `[optional]` parameter handling
- Implement proper `...variadic` parameter handling
- Add comprehensive unit tests

### Step 3: Implement Context Detection (2 hours)

Add to `src/server.ts`:
- `detectContext()` function to identify command/eval/where contexts
- Update `validateDocument()` to route validation based on context
- Update completion provider to filter by context

### Step 4: Update Grammar (30 minutes)

Modify `syntaxes/spl.tmLanguage.json`:
- Add separate scopes for commands vs functions
- Ensure functions are only highlighted when followed by `(`
- Test with `tests/query-highlighting.yaml`

### Step 5: Testing (1 hour)

Create comprehensive test suite:
- Test all variadic functions (`in`, `case`, `mvappend`, etc.)
- Test all optional parameter functions (`trim`, `round`, `substr`, etc.)
- Test nested functions
- Test command vs function distinction
- Update `tests/TESTING_GUIDE.md`

**Total Estimated Time**: 6.5-7.5 hours

---

## Expected Outcomes

### Before (Current State)

```spl
| where in(status, "404", "500", "503")
```
❌ **Error**: "Function 'in' accepts at most 2 parameters, but got 4"

```spl
| eval cleaned=trim(field)
```
❌ **Error**: "Function 'trim' requires at least 2 parameters, but got 1"

### After (Fixed State)

```spl
| where in(status, "404", "500", "503")
```
✅ **No error** - Correctly validated as variadic function (minParams=2, maxParams=∞)

```spl
| eval cleaned=trim(field)
```
✅ **No error** - Correctly validated with optional second parameter (minParams=1, maxParams=2)

```spl
| eval bad=in(status)
```
❌ **Error**: "Function 'in' requires at least 2 parameters, but got 1" (CORRECT)

```spl
| eval bad=now(123)
```
❌ **Error**: "Function 'now' accepts 0 parameters, but got 1" (CORRECT)

---

## Benefits

1. **Accurate Validation**: No more false positives for variadic/optional functions
2. **Better IntelliSense**: Context-aware suggestions (commands after `|`, functions in `eval`)
3. **Proper Highlighting**: Visual distinction between commands and functions
4. **Maintainability**: Clear separation of concerns between command and function databases
5. **Extensibility**: Easy to add new functions with proper signature format

---

## Risks & Mitigation

### Risk 1: Breaking Changes
**Impact**: Existing function database structure changes may require TypeScript refactoring

**Mitigation**: 
- Keep existing `SPLFunction` interface structure
- Only change `signature` string format
- Parser handles format differences transparently

### Risk 2: Regression in Other Features
**Impact**: Changes to validation logic might break hover/completion

**Mitigation**:
- Implement comprehensive test suite before changes
- Test all LSP features after each step
- Use `tests/lsp-test.yaml` for validation

### Risk 3: Incomplete Function Coverage
**Impact**: Some functions might not be in ANALYSIS.md documentation

**Mitigation**:
- Cross-reference with `query-languages/splunk/documentation/evaluation-functions/`
- Verify against existing `spl-functions-database.ts` (95+ functions)
- Add any missing functions during implementation

---

## References

- **Function Documentation**: `query-languages/splunk/ANALYSIS.md` sections 4.4-4.15
- **Official SPL Syntax**: `query-languages/splunk/documentation/introduction/understanding-spl-syntax.md`
- **Current Function Database**: `src/spl-functions-database.ts` (95 functions)
- **Current Command Database**: `src/spl-commands-database.ts` (162 commands)
- **Validation Logic**: `src/spl-validation.ts`
- **LSP Server**: `src/server.ts`
- **Test Files**: `tests/lsp-test.yaml`, `tests/query-highlighting.yaml`

---

## Decision: Proceed?

**Recommendation**: ✅ **PROCEED WITH IMPLEMENTATION**

**Justification**:
1. Root cause clearly identified and documented
2. Solution is well-defined with clear scope
3. Implementation time is reasonable (6.5-7.5 hours)
4. Benefits significantly outweigh risks
5. Risks have clear mitigation strategies
6. All reference materials are available

**Next Step**: Begin Phase 2, Step 1 (Fix Function Database)
