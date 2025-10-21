/**
 * Quick test of validation functionality
 */

const { validateSPLLine } = require('../out/spl-validation.js');
const { getSPLCommandEnhanced, getAllCommandNames } = require('../out/spl-commands-enhanced.js');

console.log('=================================');
console.log('SPL Validation Module Test');
console.log('=================================\n');

// Test 1: Check enhanced database
console.log('Test 1: Enhanced Database');
const cmdNames = getAllCommandNames();
console.log(`✓ Enhanced database loaded: ${cmdNames.length} commands`);
console.log(`  Commands: ${cmdNames.slice(0, 10).join(', ')}...`);

const accum = getSPLCommandEnhanced('accum');
if (accum) {
    console.log(`✓ Command 'accum' found:`);
    console.log(`  - Required args: ${accum.requiredArgs.length}`);
    console.log(`  - Optional args: ${accum.optionalArgs.length}`);
    if (accum.requiredArgs.length > 0) {
        console.log(`  - First required arg: ${accum.requiredArgs[0].name} (${accum.requiredArgs[0].type})`);
    }
}
console.log('');

// Test 2: Validate a line with missing argument
console.log('Test 2: Validate missing required argument');
const line1 = '| accum';
const diags1 = validateSPLLine(line1, 0, 'test://doc1');
console.log(`  Line: "${line1}"`);
console.log(`  Diagnostics: ${diags1.length}`);
if (diags1.length > 0) {
    console.log(`  ✓ Error detected: ${diags1[0].message}`);
} else {
    console.log(`  ✗ No errors detected (expected error)`);
}
console.log('');

// Test 3: Validate correct usage
console.log('Test 3: Validate correct usage');
const line2 = '| accum count AS total_count';
const diags2 = validateSPLLine(line2, 0, 'test://doc2');
console.log(`  Line: "${line2}"`);
console.log(`  Diagnostics: ${diags2.length}`);
if (diags2.length === 0) {
    console.log(`  ✓ No errors (correct)`);
} else {
    console.log(`  ✗ Unexpected errors: ${diags2.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 4: Validate function parameter count
console.log('Test 4: Validate function parameter count');
const line3 = '| eval result=if(x)';
const diags3 = validateSPLLine(line3, 0, 'test://doc3');
console.log(`  Line: "${line3}"`);
console.log(`  Diagnostics: ${diags3.length}`);
if (diags3.length > 0) {
    console.log(`  ✓ Error detected: ${diags3[0].message}`);
} else {
    console.log(`  ✗ No errors detected (expected error)`);
}
console.log('');

// Test 5: Validate correct function usage
console.log('Test 5: Validate correct function usage');
const line4 = '| eval result=if(x==1, "yes", "no")';
const diags4 = validateSPLLine(line4, 0, 'test://doc4');
console.log(`  Line: "${line4}"`);
console.log(`  Diagnostics: ${diags4.length}`);
if (diags4.length === 0) {
    console.log(`  ✓ No errors (correct)`);
} else {
    console.log(`  ✗ Unexpected errors: ${diags4.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 6: Unknown command
console.log('Test 6: Unknown command validation');
const line5 = '| unknowncommand field';
const diags5 = validateSPLLine(line5, 0, 'test://doc5');
console.log(`  Line: "${line5}"`);
console.log(`  Diagnostics: ${diags5.length}`);
if (diags5.length > 0) {
    console.log(`  ✓ Error detected: ${diags5[0].message}`);
} else {
    console.log(`  ✗ No errors detected (expected error)`);
}
console.log('');

console.log('=================================');
console.log('Test Complete!');
console.log('=================================');
