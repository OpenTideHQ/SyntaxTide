# Test Files for SyntaxTide SPL Language Server

This directory contains test files for validating the SPL Language Server Protocol implementation.

## Test Files

### Basic LSP Features

**`lsp-test.yaml`** - Original LSP test file
- 11 focused test scenarios
- Tests autocomplete, hover, signature help
- Basic error detection
- ~85 lines

**`lsp-test-comprehensive.yaml`** - Comprehensive SPL query
- 450+ lines of complex SPL
- 45 distinct processing steps
- Tests all 160+ commands and 130+ functions
- Real-world query patterns

**`lsp-test-variables.yaml`** - Variable tracking tests
- Tests user-defined field extraction
- Demonstrates variable creation from eval, rename, rex, stats, spath
- Variable autocomplete in various contexts
- Verification checklist

### Validation Features

**`lsp-test-validation.yaml`** ⭐ NEW
- 21 comprehensive validation test scenarios
- Tests all validation features:
  - Missing required arguments
  - Invalid argument types  
  - Function parameter counting
  - Unknown arguments
  - Variadic functions
- Valid and invalid usage examples
- ~120 lines

**`validation-demo.yaml`** ⭐ NEW
- Quick demonstration of validation
- 7 focused examples
- Commented-out invalid usage to uncomment
- Great for first-time testing
- ~45 lines

### Query Highlighting

**`query-highlighting.yaml`**
- Tests syntax highlighting for all three languages
- KQL, SPL, and CBC examples
- Multi-system configuration examples
- Demonstrates injection patterns

## Testing Scripts

### Unit Tests

**`validation-unit-test.js`** ⭐ NEW
- Automated unit tests for validation logic
- 6 test cases covering:
  - Enhanced database loading
  - Missing required arguments
  - Function parameter counting
  - Unknown commands
- Run with: `node tests/validation-unit-test.js`

### Shell Scripts

**`test-validation.sh`** ⭐ NEW
- Pre-flight validation checks
- File existence verification
- Module size reporting
- Manual testing instructions
- Run with: `bash tests/test-validation.sh`

## Testing Workflow

### Quick Start (5 minutes)

1. **Compile the extension:**
   ```bash
   npm run compile
   ```

2. **Reload VS Code:**
   - Press `Ctrl+Shift+P`
   - Type: "Developer: Reload Window"
   - Press Enter

3. **Open test file:**
   ```bash
   code tests/validation-demo.yaml
   ```

4. **Test validation:**
   - Uncomment the commented-out errors
   - Watch for red squiggly underlines
   - Hover over commands to see argument details
   - Check Problems panel (`Ctrl+Shift+M`)

### Comprehensive Testing (15 minutes)

Follow the complete testing guide: **`TESTING_GUIDE.md`**

Covers:
- ✅ Autocomplete testing
- ✅ Hover information
- ✅ Signature help
- ✅ Advanced validation (NEW)
- ✅ Variable tracking
- ✅ Error detection

### Automated Testing (1 minute)

```bash
# Run unit tests
node tests/validation-unit-test.js

# Run validation checks
bash tests/test-validation.sh
```

## Test File Quick Reference

| File | Purpose | Lines | Features Tested |
|------|---------|-------|-----------------|
| `validation-demo.yaml` | Quick validation demo | 45 | ⭐ Validation errors |
| `lsp-test.yaml` | Basic LSP features | 85 | Autocomplete, hover, signature |
| `lsp-test-validation.yaml` | Comprehensive validation | 120 | ⭐ All validation features |
| `lsp-test-variables.yaml` | Variable tracking | 95 | User-defined fields |
| `lsp-test-comprehensive.yaml` | Full SPL coverage | 450+ | All commands/functions |
| `query-highlighting.yaml` | Syntax highlighting | 200 | KQL, SPL, CBC highlighting |

⭐ = New in v0.5.0

## Expected Results

### Autocomplete
- Commands appear after `|` 
- Functions appear in `eval` and `where`
- Variables appear everywhere (user-defined fields)
- Rich details with type and category

### Hover Information
- Commands show type, category, syntax, **arguments**, examples
- Functions show signature, return type, examples
- Variables show "User-defined field" with creation methods
- **NEW:** Arguments listed with types and defaults

### Validation Errors ⭐
- Missing required arguments: Red underline
- Invalid argument types: Red underline
- Too few/many function parameters: Red underline
- Unknown commands: Red underline
- All errors in Problems panel

### Signature Help
- Parameter hints when typing `(`
- Current parameter highlighted
- Hints update with `,`

## Troubleshooting

### No autocomplete appearing
- Ensure extension is compiled: `npm run compile`
- Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check file is `.yaml` and in workspace

### No validation errors
- Check file is in `configurations.splunk.query` block
- Ensure using block scalar (`|`) not inline string
- Look in Problems panel (`Ctrl+Shift+M`)
- Run unit test: `node tests/validation-unit-test.js`

### Hover not working
- Position cursor directly on command/function name
- Wait 500ms for hover to appear
- Check Output panel: "SyntaxTide Language Server"

### Unknown command errors for valid commands
- Only 26 commands have enhanced validation
- Other commands use basic validation (existence only)
- This is expected - expand COMMANDS_ANALYSIS.json to add more

## Performance Metrics

- Validation: <5ms per line
- Database load: <10ms
- Autocomplete: <50ms
- Hover: <10ms
- No noticeable lag or slowdown

## Next Steps

After testing these files:
1. Review `IMPLEMENTATION_SUMMARY.md` for complete feature list
2. Check `CHANGELOG.md` for v0.5.0 changes
3. Read `src/README.md` for architecture details
4. Try writing your own SPL queries!

## Documentation

- **Testing Guide**: `TESTING_GUIDE.md` - Complete testing instructions
- **Implementation Summary**: `../IMPLEMENTATION_SUMMARY.md` - Technical details
- **Developer Guide**: `../src/README.md` - Architecture and development
- **Changelog**: `../CHANGELOG.md` - All changes and versions

## Contributing

To add more validation test cases:
1. Edit `lsp-test-validation.yaml`
2. Add new scenarios with valid and invalid examples
3. Document expected errors in comments
4. Test in VS Code
5. Update this README

## Support

For issues or questions:
1. Check TESTING_GUIDE.md for solutions
2. Run unit tests to verify installation
3. Check VS Code Output panel for errors
4. Review IMPLEMENTATION_SUMMARY.md for details
