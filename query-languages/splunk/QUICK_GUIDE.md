# Quick Implementation Guide

**Goal**: Fix SPL function validation by understanding commands vs. functions and proper parameter syntax.

---

## The 3-Minute Summary

### Problem
```spl
| where in(status, "404", "500", "503")
```
**Current**: ❌ Error "accepts at most 2 parameters, but got 4"  
**Correct**: ✅ No error - `in()` is variadic (2+ params allowed)

### Root Cause
1. Function signatures are wrong: `'in(<field>, <list>)'` should be `'in(<field>, <value1>, <value2>, ...)'`
2. Parser doesn't understand: `[optional]` and `...variadic` syntax
3. No distinction between commands (after `|`) and functions (in expressions)

### Solution
1. Update 170+ function signatures in `spl-functions-database.ts`
2. Rewrite `parseFunctionSignature()` in `spl-validation.ts`
3. Add context detection in `server.ts`
4. Update grammar in `spl.tmLanguage.json`

---

## Implementation Checklist

### Step 1: Fix Function Database (2-3 hours)
**File**: `src/spl-functions-database.ts`

- [ ] Update Comparison & Conditional (13 functions)
- [ ] Update Mathematical (12 functions)
- [ ] Update Statistical (4 functions)
- [ ] Update Text (10 functions)
- [ ] Update Multivalue (12 functions)
- [ ] Update JSON (15 functions)
- [ ] Update Date & Time (5 functions)
- [ ] Update Cryptographic (4 functions)
- [ ] Update Conversion (10 functions)
- [ ] Update Informational (11 functions)
- [ ] Update Bitwise (6 functions)
- [ ] Update Trigonometric (15 functions)

**Data Source**: `ANALYSIS.md` sections 4.4-4.15

**Example Change**:
```typescript
// BEFORE:
{ name: 'in', signature: 'in(<field>, <list>)' }

// AFTER:
{ 
    name: 'in', 
    signature: 'in(<field>, <value1>, <value2>, ...)',
    category: 'Comparison & Conditional',
    description: 'Returns TRUE if field matches any value',
    returnType: 'boolean',
    examples: ['in(status, "404")', 'in(status, "404", "500")']
}
```

### Step 2: Rewrite Parser (1 hour)
**File**: `src/spl-validation.ts`

- [ ] Replace `parseFunctionSignature()` with new implementation
- [ ] Add unit tests for parser
- [ ] Test with: `trim()`, `in()`, `case()`, `now()`

**Code**: See `ANALYSIS.md` section 5.2

### Step 3: Context Detection (2 hours)
**File**: `src/server.ts`

- [ ] Add `detectContext()` function
- [ ] Update `validateDocument()` to use context
- [ ] Update completion provider to filter by context
- [ ] Test with `lsp-test.yaml`

**Code**: See `ANALYSIS.md` section 5.3

### Step 4: Update Grammar (30 minutes)
**File**: `syntaxes/spl.tmLanguage.json`

- [ ] Add command scope pattern
- [ ] Add function scope pattern
- [ ] Test with `query-highlighting.yaml`

**Code**: See `ANALYSIS.md` section 5.5

### Step 5: Testing (1 hour)

- [ ] Create `tests/validation-test.yaml`
- [ ] Test all variadic functions
- [ ] Test all optional parameter functions
- [ ] Test nested functions
- [ ] Test error cases
- [ ] Update `tests/TESTING_GUIDE.md`

---

## Key Syntax Rules

### SPL Parameter Conventions

| Format | Meaning | Example | Min | Max |
|--------|---------|---------|-----|-----|
| `<param>` | Required | `md5(<str>)` | 1 | 1 |
| `[<param>]` | Optional | `trim(<str>, [<chars>])` | 1 | 2 |
| `<param>...` | Variadic | `in(<f>, <v>...)` | 2 | ∞ |
| `(<p>, <p>)...` | Grouped | `case(<c>, <v>)...` | 2 | ∞ |

### Context Detection

```spl
| stats count BY host          # "stats" = COMMAND (after |)
| eval result=trim(field)      # "trim" = FUNCTION (in eval)
| where in(status, "404")      # "in" = FUNCTION (in where)
```

---

## Common Functions to Update

### Variadic Functions (unlimited params after minimum)

```typescript
// in() - min 2, max ∞
signature: 'in(<field>, <value1>, <value2>, ...)'

// case() - min 2, max ∞ (paired)
signature: 'case(<condition>, <value>)...'

// mvappend() - min 1, max ∞
signature: 'mvappend(<values>...)'

// coalesce() - min 1, max ∞
signature: 'coalesce(<values>...)'

// json_object() - min 2, max ∞ (paired)
signature: 'json_object(<key>, <value>...)'
```

### Optional Parameter Functions

```typescript
// trim() - min 1, max 2
signature: 'trim(<str>, [<trim_chars>])'

// round() - min 1, max 2
signature: 'round(<num>, [<precision>])'

// substr() - min 2, max 3
signature: 'substr(<str>, <start>, [<length>])'

// log() - min 1, max 2
signature: 'log(<num>, [<base>])'
```

### Fixed Parameter Functions

```typescript
// if() - exactly 3 params
signature: 'if(<predicate>, <true_value>, <false_value>)'

// match() - exactly 2 params
signature: 'match(<str>, <regex>)'

// md5() - exactly 1 param
signature: 'md5(<str>)'

// now() - exactly 0 params
signature: 'now()'
```

---

## Testing Examples

### Should Pass (No Errors)

```spl
# Variadic
| eval t1=in(status, "404")
| eval t2=in(status, "404", "500", "503")
| eval t3=case(x>1, "hi")
| eval t4=case(x>1, "hi", x<1, "lo", true(), "mid")

# Optional
| eval t5=trim(field)
| eval t6=trim(field, " ")
| eval t7=round(value)
| eval t8=round(value, 2)

# Fixed
| eval t9=if(x>1, "yes", "no")
| eval t10=match(field, "^ERROR")
| eval t11=now()

# Nested
| eval t12=if(in(status, "404", "500"), "error", "ok")
| where match(upper(field), "^ERROR")
```

### Should Fail (Errors Expected)

```spl
# Too few params
| eval bad1=in(status)                 # Error: requires 2+
| eval bad2=trim()                     # Error: requires 1+
| eval bad3=if(x>1)                    # Error: requires 3
| eval bad4=match(field)               # Error: requires 2

# Too many params
| eval bad5=now(123)                   # Error: accepts 0
| eval bad6=md5(field, "extra")        # Error: accepts 1
| eval bad7=round(value, 2, 3)         # Error: accepts 1-2
```

---

## Files Quick Reference

### Read First
- `ANALYSIS.md` - Complete documentation
- `ARCHITECTURE_PROPOSAL.md` - Implementation plan
- `IMPLEMENTATION_SUMMARY.md` - Detailed guide

### Modify These
- `src/spl-functions-database.ts` - Update 170+ signatures
- `src/spl-validation.ts` - Rewrite parser
- `src/server.ts` - Add context detection
- `syntaxes/spl.tmLanguage.json` - Update grammar

### Test With These
- `tests/lsp-test.yaml` - Existing tests
- `tests/query-highlighting.yaml` - Grammar tests
- Create: `tests/validation-test.yaml` - New validation tests

---

## Expected Timeline

| Step | Task | Time |
|------|------|------|
| 1 | Fix function database | 2-3h |
| 2 | Rewrite parser | 1h |
| 3 | Context detection | 2h |
| 4 | Update grammar | 30m |
| 5 | Testing | 1h |
| **Total** | | **6.5-7.5h** |

---

## Success Check

After implementation, these should work:

```spl
| where in(status, "404", "500", "503")    # ✅ No error
| eval cleaned=trim(field)                 # ✅ No error
| eval bad=in(status)                      # ❌ Error (correct)
| eval bad=now(123)                        # ❌ Error (correct)
```

**Ready to start? Begin with Step 1!**
