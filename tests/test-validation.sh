#!/bin/bash
# Simple validation test script
# Run this after compiling and reloading VS Code to verify validation is working

echo "==================================="
echo "SPL Validation Feature Test"
echo "==================================="
echo ""

# Check if compiled files exist
echo "✓ Checking compiled files..."
if [ ! -f "out/spl-validation.js" ]; then
    echo "✗ ERROR: out/spl-validation.js not found. Run 'npm run compile' first."
    exit 1
fi

if [ ! -f "out/spl-commands-enhanced.js" ]; then
    echo "✗ ERROR: out/spl-commands-enhanced.js not found. Run 'npm run compile' first."
    exit 1
fi

echo "✓ Compiled files found"
echo ""

# Check if test file exists
echo "✓ Checking test file..."
if [ ! -f "tests/lsp-test-validation.yaml" ]; then
    echo "✗ ERROR: tests/lsp-test-validation.yaml not found"
    exit 1
fi

echo "✓ Test file found"
echo ""

# Show file sizes
echo "✓ Validation module sizes:"
echo "  - spl-validation.js: $(wc -c < out/spl-validation.js) bytes"
echo "  - spl-commands-enhanced.js: $(wc -c < out/spl-commands-enhanced.js) bytes"
echo ""

# Count commands in enhanced database
COMMANDS=$(node -e "const db = require('./out/spl-commands-enhanced.js'); console.log(db.SPL_COMMANDS_ENHANCED.size);" 2>/dev/null || echo "0")
echo "✓ Enhanced database contains: $COMMANDS commands with detailed argument info"
echo "  (Basic database has 64 commands, enhanced adds argument details for $COMMANDS)"
echo ""

echo "==================================="
echo "Manual Testing Steps:"
echo "==================================="
echo ""
echo "1. Reload VS Code window:"
echo "   - Press Ctrl+Shift+P"
echo "   - Type: 'Developer: Reload Window'"
echo ""
echo "2. Open: tests/lsp-test-validation.yaml"
echo ""
echo "3. Test validation features:"
echo "   a. Uncomment line 23: '# | accum'"
echo "      → Should show error about missing required argument"
echo ""
echo "   b. Uncomment line 29: '# | eval result=if(status==200)'"
echo "      → Should show error about too few parameters"
echo ""
echo "   c. Uncomment line 49: '# | abstract maxlines=\"not_a_number\"'"
echo "      → Should show error about invalid argument type"
echo ""
echo "4. Check Problems panel (Ctrl+Shift+M)"
echo "   → Should show all validation errors"
echo ""
echo "5. Hover over 'abstract' command"
echo "   → Should show argument details with types and defaults"
echo ""
echo "==================================="
echo "All pre-flight checks passed!"
echo "==================================="
