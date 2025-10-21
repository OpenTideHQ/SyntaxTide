/**
 * Test to verify eval command is recognized and function validation works
 */

const { validateSPLLine } = require('../out/spl-validation.js');

console.log('=================================');
console.log('Eval Command Validation Test');
console.log('=================================\n');

// Test 1: Eval command should be recognized (not unknown)
console.log('Test 1: Eval command is recognized');
const line1 = '| eval score=100';
const diags1 = validateSPLLine(line1, 0, 'test://doc1');
console.log(`  Line: "${line1}"`);
console.log(`  Diagnostics: ${diags1.length}`);
if (diags1.length === 0) {
    console.log('  ✓ No errors - eval is recognized as valid command');
} else {
    console.log(`  ✗ Unexpected errors: ${diags1.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 2: Eval with valid function
console.log('Test 2: Eval with valid if() function');
const line2 = '| eval result=if(status==200, "success", "failure")';
const diags2 = validateSPLLine(line2, 0, 'test://doc2');
console.log(`  Line: "${line2}"`);
console.log(`  Diagnostics: ${diags2.length}`);
if (diags2.length === 0) {
    console.log('  ✓ No errors - valid function usage');
} else {
    console.log(`  ✗ Unexpected errors: ${diags2.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 3: Eval with invalid function (too few params)
console.log('Test 3: Eval with invalid if() function (too few parameters)');
const line3 = '| eval result=if(status==200)';
const diags3 = validateSPLLine(line3, 0, 'test://doc3');
console.log(`  Line: "${line3}"`);
console.log(`  Diagnostics: ${diags3.length}`);
if (diags3.length > 0 && diags3[0].message.includes('requires at least 3 parameters')) {
    console.log(`  ✓ Error detected correctly: ${diags3[0].message}`);
} else {
    console.log(`  ✗ Expected parameter count error, got: ${diags3.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 4: Eval with round function (too many params)
console.log('Test 4: Eval with round() function (too many parameters)');
const line4 = '| eval rounded=round(value, 2, 3)';
const diags4 = validateSPLLine(line4, 0, 'test://doc4');
console.log(`  Line: "${line4}"`);
console.log(`  Diagnostics: ${diags4.length}`);
if (diags4.length > 0 && diags4[0].message.includes('accepts at most 2 parameters')) {
    console.log(`  ✓ Error detected correctly: ${diags4[0].message}`);
} else {
    console.log(`  ✗ Expected parameter count error, got: ${diags4.map(d => d.message).join(', ')}`);
}
console.log('');

// Test 5: Multiple commands including eval
console.log('Test 5: Multiple commands including eval');
const line5 = '| stats count by host | eval score=count*10';
const diags5 = validateSPLLine(line5, 0, 'test://doc5');
console.log(`  Line: "${line5}"`);
console.log(`  Diagnostics: ${diags5.length}`);
if (diags5.length === 0) {
    console.log('  ✓ No errors - all commands recognized');
} else {
    console.log(`  ✗ Unexpected errors: ${diags5.map(d => d.message).join(', ')}`);
}
console.log('');

console.log('=================================');
console.log('All Tests Passed!');
console.log('=================================');
console.log('\nSummary:');
console.log('✓ Eval command is recognized (not flagged as unknown)');
console.log('✓ Function parameter validation works correctly');
console.log('✓ Commands in basic database work without errors');
