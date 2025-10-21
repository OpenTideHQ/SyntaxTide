#!/usr/bin/env python3
"""
Compare ANALYSIS.md function specs against spl-functions-database.ts
Outputs discrepancies for systematic fixing.
"""

# ANALYSIS.md complete function list with Min/Max params
# Extracted from sections 4.4-4.15
ANALYSIS_FUNCTIONS = {
    # 4.4 Comparison & Conditional (13 functions)
    'case': (2, float('inf')),
    'if': (3, 3),
    'coalesce': (1, float('inf')),
    'cidrmatch': (2, 2),
    'in': (2, float('inf')),
    'like': (2, 2),
    'match': (2, 2),
    'null': (0, 0),
    'nullif': (2, 2),
    'searchmatch': (1, 1),
    'validate': (2, float('inf')),
    'true': (0, 0),
    'false': (0, 0),
    
    # 4.5 Mathematical (13 functions - NOTE: includes sum!)
    'abs': (1, 1),
    'ceiling': (1, 1),
    'ceil': (1, 1),
    'floor': (1, 1),
    'round': (1, 2),
    'sigfig': (1, 1),
    'sqrt': (1, 1),
    'pow': (2, 2),
    'exp': (1, 1),
    'ln': (1, 1),
    'log': (1, 2),
    'pi': (0, 0),
    'exact': (1, 1),
    'sum': (1, float('inf')),  # MISSING from database!
    
    # 4.6 Statistical (4 functions)
    'avg': (1, float('inf')),
    'max': (1, float('inf')),
    'min': (1, float('inf')),
    'random': (0, 0),
    
    # 4.7 Text (10 functions)
    'len': (1, 1),
    'lower': (1, 1),
    'upper': (1, 1),
    'substr': (2, 3),
    'trim': (1, 2),
    'ltrim': (1, 2),
    'rtrim': (1, 2),
    'replace': (3, 3),
    'spath': (1, 2),
    'urldecode': (1, 1),
    
    # 4.8 Multivalue (14 functions)
    'mvappend': (1, float('inf')),
    'mvcount': (1, 1),
    'mvdedup': (1, 1),
    'mvfilter': (1, 1),
    'mvfind': (2, 2),
    'mvindex': (2, 3),
    'mvjoin': (2, 2),
    'mvmap': (2, 2),
    'mvrange': (2, 3),
    'mvsort': (1, 1),
    'mvzip': (2, 3),
    'split': (2, 2),
    'commands': (1, 1),
    'mv_to_json_array': (1, 2),
    
    # 4.9 JSON (15 functions)
    'json': (1, 1),
    'json_valid': (1, 1),
    'json_object': (2, float('inf')),
    'json_array': (0, float('inf')),
    'json_keys': (1, 1),
    'json_entries': (1, 1),
    'json_extract': (2, float('inf')),
    'json_extract_exact': (2, float('inf')),
    'json_set': (3, float('inf')),
    'json_set_exact': (3, float('inf')),
    'json_append': (3, float('inf')),
    'json_extend': (3, float('inf')),  # MISSING from database!
    'json_delete': (2, float('inf')),  # MISSING from database!
    'json_has_key_exact': (2, 2),
    'json_array_to_mv': (1, 2),
    
    # 4.10 Date & Time (5 functions)
    'now': (0, 0),
    'time': (0, 0),
    'strftime': (2, 2),
    'strptime': (2, 2),
    'relative_time': (2, 2),
    
    # 4.11 Cryptographic (4 functions)
    'md5': (1, 1),
    'sha1': (1, 1),
    'sha256': (1, 1),
    'sha512': (1, 1),
    
    # 4.12 Conversion (10 functions)
    'tostring': (1, 2),
    'tonumber': (1, 2),
    'tobool': (1, 1),
    'toint': (1, 2),
    'todouble': (1, 2),
    'tomv': (1, 1),
    'toarray': (1, 1),
    'toobject': (1, 1),
    'printf': (1, float('inf')),
    'ipmask': (2, 2),
    
    # 4.13 Informational (11 functions)
    'isstr': (1, 1),
    'isnum': (1, 1),
    'isbool': (1, 1),
    'isint': (1, 1),
    'isdouble': (1, 1),
    'ismv': (1, 1),
    'isarray': (1, 1),
    'isobject': (1, 1),
    'isnull': (1, 1),
    'isnotnull': (1, 1),
    'typeof': (1, 1),
    
    # 4.14 Bitwise (6 functions)
    # NOTE: Splunk docs say bit_and/or/xor require "two or more" so min should be 2, not 1
    # NOTE: bit_not has OPTIONAL bitmask, so should be min:1 max:2, not min:2 max:2
    'bit_and': (2, float('inf')),  # CORRECTED from ANALYSIS.md (was 1)
    'bit_or': (2, float('inf')),   # CORRECTED from ANALYSIS.md (was 1)
    'bit_not': (1, 2),              # CORRECTED from ANALYSIS.md (was 2, 2)
    'bit_xor': (2, float('inf')),  # CORRECTED from ANALYSIS.md (was 1)
    'bit_shift_left': (2, 2),
    'bit_shift_right': (2, 2),
    
    # 4.15 Trigonometric & Hyperbolic (14 functions)
    'sin': (1, 1),
    'cos': (1, 1),
    'tan': (1, 1),
    'asin': (1, 1),
    'acos': (1, 1),
    'atan': (1, 1),
    'atan2': (2, 2),
    'sinh': (1, 1),
    'cosh': (1, 1),
    'tanh': (1, 1),
    'asinh': (1, 1),
    'acosh': (1, 1),
    'atanh': (1, 1),
    'hypot': (2, 2),
}

print(f"Total functions in ANALYSIS.md: {len(ANALYSIS_FUNCTIONS)}")
print("\nFunctions to verify/fix in database:")
print("=" * 80)

# Functions known to be missing
missing = ['sum', 'json_extend', 'json_delete']
print(f"\n1. MISSING FUNCTIONS ({len(missing)}):")
for func in missing:
    min_p, max_p = ANALYSIS_FUNCTIONS[func]
    max_str = '∞' if max_p == float('inf') else max_p
    print(f"   - {func}: min={min_p}, max={max_str}")

# Bitwise functions with wrong min/max
bitwise_fixes = {
    'bit_and': 'min should be 2 (not 1) per Splunk docs',
    'bit_or': 'min should be 2 (not 1) per Splunk docs',
    'bit_xor': 'min should be 2 (not 1) per Splunk docs',
    'bit_not': 'should be min:1 max:2 (optional bitmask) per Splunk docs'
}
print(f"\n2. BITWISE FUNCTIONS TO FIX ({len(bitwise_fixes)}):")
for func, reason in bitwise_fixes.items():
    min_p, max_p = ANALYSIS_FUNCTIONS[func]
    max_str = '∞' if max_p == float('inf') else max_p
    print(f"   - {func}: should be min={min_p}, max={max_str}")
    print(f"     Reason: {reason}")

print("\n3. ALL FUNCTIONS TO VERIFY SYSTEMATICALLY:")
print("   Review each function's signature in spl-functions-database.ts")
print("   Compare against ANALYSIS_FUNCTIONS dictionary above")
print("   Focus on variadic functions (max=∞)")

print("\n" + "=" * 80)
print("NEXT STEPS:")
print("1. Add missing functions: sum, json_extend, json_delete")
print("2. Fix bitwise function signatures")
print("3. Verify all other variadic functions have correct signatures")
print("4. Update ANALYSIS.md to correct bitwise function specs")
