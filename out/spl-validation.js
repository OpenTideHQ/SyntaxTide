"use strict";
/**
 * SPL Query Validation Module
 * Provides comprehensive validation for SPL commands and functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFunctionCall = validateFunctionCall;
exports.extractFunctionCalls = extractFunctionCalls;
exports.validateCommandArguments = validateCommandArguments;
exports.validateSPLLine = validateSPLLine;
const node_1 = require("vscode-languageserver/node");
const spl_commands_enhanced_1 = require("./spl-commands-enhanced");
const spl_commands_database_1 = require("./spl-commands-database");
const spl_functions_database_1 = require("./spl-functions-database");
/**
 * Parse function signature to extract parameter information
 * Handles SPL syntax conventions:
 *   <param> = required parameter
 *   [<param>] = optional parameter
 *   <param>... = variadic parameter (1+ occurrences)
 *   (<param>, <param>)... = grouped variadic pairs
 *
 * Examples:
 *   "if(<predicate>, <true_value>, <false_value>)" -> min: 3, max: 3
 *   "trim(<str>, [<trim_chars>])" -> min: 1, max: 2
 *   "in(<field>, <value1>, <value2>, ...)" -> min: 2, max: Infinity (variadic)
 *   "case(<condition>, <value>)..." -> min: 2, max: Infinity (grouped variadic)
 */
function parseFunctionSignature(signature) {
    const match = signature.match(/\(([^)]*)\)/);
    if (!match) {
        return { minParams: 0, maxParams: 0, isVariadic: false, paramNames: [] };
    }
    const paramsStr = match[1];
    if (!paramsStr.trim()) {
        return { minParams: 0, maxParams: 0, isVariadic: false, paramNames: [] };
    }
    // Check for grouped variadic pattern: ENTIRE signature ends with )...
    // Examples: validate(<condition>, <value>)... or case(<condition>, <value>)...
    // The signature format is: functionName(<params>)...
    if (signature.endsWith(')...')) {
        // This is a grouped variadic function
        // Count the number of parameters in the group
        const params = paramsStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
        const minParams = params.length; // At least one complete group required
        return {
            minParams,
            maxParams: Infinity,
            isVariadic: true,
            paramNames: params
        };
    }
    // Split by commas, but handle nested brackets and angle brackets
    const params = [];
    let depth = 0;
    let currentParam = '';
    for (let i = 0; i < paramsStr.length; i++) {
        const char = paramsStr[i];
        if (char === '(' || char === '<' || char === '[')
            depth++;
        else if (char === ')' || char === '>' || char === ']')
            depth--;
        else if (char === ',' && depth === 0) {
            params.push(currentParam.trim());
            currentParam = '';
            continue;
        }
        currentParam += char;
    }
    if (currentParam.trim()) {
        params.push(currentParam.trim());
    }
    // Fix for standalone "..." - merge with previous parameter
    // in(<field>, <value1>, <value2>, ...) should be 3 params, not 4
    if (params.length > 1 && params[params.length - 1] === '...') {
        const variadicMarker = params.pop();
        params[params.length - 1] = params[params.length - 1] + variadicMarker;
    }
    let minParams = 0;
    let maxParams = 0;
    let isVariadic = false;
    const paramNames = [];
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        paramNames.push(param);
        // Check for simple variadic: <param>...
        if (param.includes('...')) {
            isVariadic = true;
            maxParams = Infinity;
            // Count required params before the variadic marker
            const beforeVariadic = params.slice(0, i);
            minParams = beforeVariadic.filter(p => !p.startsWith('[') && !p.endsWith(']')).length;
            // If the variadic param itself isn't optional, add 1
            if (!param.startsWith('[')) {
                minParams += 1;
            }
            break; // No more params after variadic
        }
        // Check for optional: [<param>]
        if (param.startsWith('[') && param.endsWith(']')) {
            // Optional param increases maxParams but not minParams
            maxParams++;
        }
        else {
            // Required param increases both
            minParams++;
            maxParams++;
        }
    }
    return {
        minParams,
        maxParams,
        isVariadic,
        paramNames
    };
}
/**
 * Validate function call parameters
 */
function validateFunctionCall(functionName, args, context, startPos) {
    const diagnostics = [];
    const func = spl_functions_database_1.SPL_FUNCTIONS.find(f => f.name.toLowerCase() === functionName.toLowerCase());
    if (!func) {
        return diagnostics; // Unknown function, handled elsewhere
    }
    const sigInfo = parseFunctionSignature(func.signature);
    const argCount = args.length;
    // Calculate proper character range for highlighting
    // startPos is already the correct position in the line (includes YAML indentation)
    let startChar = 0;
    let endChar = context.line.length;
    if (startPos !== undefined) {
        // Use the startPos directly - it's already correct from extractFunctionCalls
        startChar = startPos + (context.charOffset || 0); // Add YAML indentation offset
        // Highlight function name + opening paren (visual cue)
        endChar = startPos + functionName.length + 1 + (context.charOffset || 0);
    }
    else {
        // Fallback: get the leading whitespace if startPos not provided
        const leadingWhitespace = context.line.match(/^\s*/)?.[0].length || 0;
        startChar = leadingWhitespace + (context.charOffset || 0);
    }
    // Check parameter count
    if (argCount < sigInfo.minParams) {
        diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
            range: {
                start: { line: context.lineNumber, character: startChar },
                end: { line: context.lineNumber, character: endChar }
            },
            message: `Function '${func.name}()' requires at least ${sigInfo.minParams} parameter${sigInfo.minParams !== 1 ? 's' : ''}, but got ${argCount}.`,
            source: 'spl-validation'
        });
    }
    else if (argCount > sigInfo.maxParams && !sigInfo.isVariadic) {
        diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
            range: {
                start: { line: context.lineNumber, character: startChar },
                end: { line: context.lineNumber, character: endChar }
            },
            message: `Function '${func.name}()' accepts at most ${sigInfo.maxParams} parameter${sigInfo.maxParams !== 1 ? 's' : ''}, but got ${argCount}.`,
            source: 'spl-validation'
        });
    }
    return diagnostics;
}
/**
 * Extract function calls from a line of SPL
 * Returns array of {name, args, startPos}
 */
function extractFunctionCalls(line) {
    const functionCalls = [];
    // Match function_name(args) pattern
    const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    let match;
    while ((match = functionRegex.exec(line)) !== null) {
        const funcName = match[1];
        const startPos = match.index;
        const argsStart = match.index + match[0].length;
        // Find matching closing parenthesis
        let depth = 1;
        let argsEnd = argsStart;
        for (let i = argsStart; i < line.length && depth > 0; i++) {
            if (line[i] === '(')
                depth++;
            else if (line[i] === ')')
                depth--;
            argsEnd = i;
        }
        if (depth === 0) {
            const argsStr = line.substring(argsStart, argsEnd);
            // Split arguments by comma, respecting nested parens
            const args = splitFunctionArgs(argsStr);
            functionCalls.push({ name: funcName, args, startPos });
        }
    }
    return functionCalls;
}
/**
 * Split function arguments by comma, respecting nested parentheses and quotes
 */
function splitFunctionArgs(argsStr) {
    if (!argsStr.trim())
        return [];
    const args = [];
    let currentArg = '';
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';
    for (let i = 0; i < argsStr.length; i++) {
        const char = argsStr[i];
        const prevChar = i > 0 ? argsStr[i - 1] : '';
        // Handle quotes
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inQuotes) {
                inQuotes = true;
                quoteChar = char;
            }
            else if (char === quoteChar) {
                inQuotes = false;
            }
        }
        // Track parenthesis depth
        if (!inQuotes) {
            if (char === '(')
                depth++;
            else if (char === ')')
                depth--;
            else if (char === ',' && depth === 0) {
                args.push(currentArg.trim());
                currentArg = '';
                continue;
            }
        }
        currentArg += char;
    }
    if (currentArg.trim()) {
        args.push(currentArg.trim());
    }
    return args;
}
/**
 * Validate command arguments
 */
function validateCommandArguments(commandName, argumentsStr, context, commandStartPos) {
    const diagnostics = [];
    const cmd = (0, spl_commands_enhanced_1.getSPLCommandEnhanced)(commandName);
    if (!cmd) {
        return diagnostics; // Unknown command, handled elsewhere
    }
    // Skip validation for commands with no arguments
    if (cmd.requiredArgs.length === 0 && cmd.optionalArgs.length === 0) {
        return diagnostics;
    }
    const trimmedArgs = argumentsStr.trim();
    // Calculate proper character range for highlighting
    const leadingWhitespace = context.line.match(/^\s*/)?.[0].length || 0;
    const charOffset = context.charOffset || 0;
    let startChar = commandStartPos !== undefined ? commandStartPos + charOffset : leadingWhitespace;
    let endChar = commandStartPos !== undefined ? commandStartPos + commandName.length + charOffset : context.line.length;
    // Check if required arguments are provided
    if (cmd.requiredArgs.length > 0 && !trimmedArgs) {
        diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
            range: {
                start: { line: context.lineNumber, character: startChar },
                end: { line: context.lineNumber, character: endChar }
            },
            message: `Command '${cmd.name}' requires ${cmd.requiredArgs.length} argument${cmd.requiredArgs.length !== 1 ? 's' : ''}: ${cmd.requiredArgs.map(a => a.name).join(', ')}.`,
            source: 'spl-validation'
        });
        return diagnostics;
    }
    // Validate specific argument patterns based on command type
    if (cmd.requiredArgs.length > 0) {
        // Check for basic presence of arguments
        const hasEquals = trimmedArgs.includes('=');
        const hasContent = trimmedArgs.length > 0;
        // For commands that require field names or specific syntax
        if (!hasContent) {
            const requiredArgNames = cmd.requiredArgs.map(a => a.name).join(', ');
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: context.lineNumber, character: startChar },
                    end: { line: context.lineNumber, character: endChar }
                },
                message: `Command '${cmd.name}' requires arguments: ${requiredArgNames}.`,
                source: 'spl-validation'
            });
        }
    }
    // Validate argument types for named arguments (key=value syntax)
    const argMatches = argumentsStr.matchAll(/(\w+)=([^\s,]+)/g);
    for (const match of argMatches) {
        const argName = match[1];
        const argValue = match[2];
        // Find argument in command definition
        const argDef = [...cmd.requiredArgs, ...cmd.optionalArgs].find(a => a.name.toLowerCase() === argName.toLowerCase());
        if (!argDef) {
            // Unknown argument - highlight the argument name itself
            const argPos = context.line.indexOf(argName);
            const argStart = argPos >= 0 ? argPos : startChar;
            const argEnd = argStart + argName.length;
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Warning,
                range: {
                    start: { line: context.lineNumber, character: argStart },
                    end: { line: context.lineNumber, character: argEnd }
                },
                message: `Unknown argument '${argName}' for command '${cmd.name}'. Valid arguments: ${[...cmd.requiredArgs, ...cmd.optionalArgs].map(a => a.name).join(', ')}.`,
                source: 'spl-validation'
            });
        }
        else {
            // Validate argument type
            const typeDiag = validateArgumentType(argValue, argDef, context);
            if (typeDiag) {
                diagnostics.push(typeDiag);
            }
        }
    }
    return diagnostics;
}
/**
 * Validate argument type
 */
function validateArgumentType(value, argDef, context) {
    const type = argDef.type;
    // Basic type validation
    if (type === 'number' || type === 'int') {
        if (!/^-?\d+$/.test(value) && !/^-?\d+\.\d+$/.test(value)) {
            return {
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: context.lineNumber, character: 0 },
                    end: { line: context.lineNumber, character: context.line.length }
                },
                message: `Argument '${argDef.name}' expects a number, but got '${value}'.`,
                source: 'spl-validation'
            };
        }
    }
    else if (type === 'boolean' || type === 'bool') {
        const lowerValue = value.toLowerCase();
        if (!['true', 'false', 't', 'f', '1', '0', 'yes', 'no'].includes(lowerValue)) {
            return {
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: context.lineNumber, character: 0 },
                    end: { line: context.lineNumber, character: context.line.length }
                },
                message: `Argument '${argDef.name}' expects a boolean (true/false), but got '${value}'.`,
                source: 'spl-validation'
            };
        }
    }
    return null;
}
/**
 * Validate a single line of SPL
 */
/**
 * Validate that field/variable references are defined before use
 * Extracts field references from the line and checks against availableVariables
 * IMPORTANT: Be lenient - don't flag external references (indexes, sourcetypes, lookups, macros)
 */
function validateVariableUsage(line, context) {
    const diagnostics = [];
    if (!context.availableVariables) {
        return diagnostics;
    }
    // Skip validation for lines with external references that we can't verify:
    // - Macros (inside backticks)
    if (line.includes('`')) {
        return diagnostics; // Contains macros - too complex to validate
    }
    // - Search command with index/sourcetype (these are external references)
    if (line.match(/\b(?:index|sourcetype|host|source)\s*=/i)) {
        return diagnostics; // External data source references
    }
    // - Lookup commands (lookup table names are external)
    if (line.match(/\|\s*lookup\b/i)) {
        return diagnostics; // Lookup tables are external references
    }
    // - Replace command (has string literals that look like fields)
    if (line.match(/\|\s*replace\b/i)) {
        return diagnostics; // Replace has complex string literal syntax
    }
    // - Regex command (has patterns with field-like content)
    if (line.match(/\|\s*regex\b/i)) {
        return diagnostics; // Regex patterns may contain field-like tokens
    }
    // Skip if line is a variable declaration (eval assignment, rename, stats AS, etc.)
    if (line.match(/\|\s*eval\s+\w+\s*=/i) ||
        line.match(/\|\s*rename\s+/i) ||
        line.match(/\s+(?:AS|as)\s+\w+/)) {
        return diagnostics; // This line declares variables, don't validate references
    }
    // For now, disable broad field validation entirely
    // The false positive rate is too high with:
    // - String literals containing underscores
    // - External references (indexes, sourcetypes, lookups, macros)
    // - Fields from search results that we can't track
    // 
    // Future enhancement: Parse and track fields from search, tstats, datamodel commands
    return diagnostics;
}
/**
 * Split SPL line by pipe operators, but ignore pipes inside quoted strings
 * Handles both single and double quotes
 */
function splitByPipes(line) {
    const parts = [];
    let currentPart = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let escapeNext = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (escapeNext) {
            currentPart += char;
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            currentPart += char;
            escapeNext = true;
            continue;
        }
        if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            currentPart += char;
            continue;
        }
        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
            currentPart += char;
            continue;
        }
        if (char === '|' && !inSingleQuote && !inDoubleQuote) {
            parts.push(currentPart);
            currentPart = '';
            continue;
        }
        currentPart += char;
    }
    // Add the last part
    parts.push(currentPart);
    return parts;
}
function validateSPLLine(line, lineNumber, documentUri, charOffset = 0, availableVariables) {
    const diagnostics = [];
    const context = { line, lineNumber, documentUri, charOffset, availableVariables };
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('```')) {
        return diagnostics;
    }
    // Extract and validate commands (after pipe operators)
    if (trimmed.includes('|')) {
        const pipes = splitByPipes(trimmed);
        for (let i = 1; i < pipes.length; i++) {
            const commandPart = pipes[i].trim();
            if (!commandPart)
                continue;
            // Check if this is a macro call (starts with backtick)
            if (commandPart.startsWith('`')) {
                // Validate macro syntax
                const macroMatch = commandPart.match(/^`([a-zA-Z_][a-zA-Z0-9_]*)(\([^)]*\))?`$/);
                if (!macroMatch) {
                    // Invalid macro syntax
                    const macroStart = line.indexOf('`', 0);
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Error,
                        range: {
                            start: { line: lineNumber, character: macroStart + (context.charOffset || 0) },
                            end: { line: lineNumber, character: macroStart + commandPart.length + (context.charOffset || 0) }
                        },
                        message: `Invalid macro syntax. Macros must be: \`macro_name\` or \`macro_name(arg1, arg2)\``,
                        source: 'spl-validation'
                    });
                }
                // Valid macro - skip further validation (macros are user-defined)
                continue;
            }
            const parts = commandPart.split(/\s+/);
            const commandName = parts[0];
            const argumentsStr = commandPart.substring(commandName.length).trim();
            // Find the command position in the original line for accurate highlighting
            const leadingWhitespace = line.match(/^\s*/)?.[0].length || 0;
            const commandPos = line.indexOf(commandName, leadingWhitespace);
            const commandStart = commandPos >= 0 ? commandPos : leadingWhitespace;
            const commandEnd = commandStart + commandName.length;
            // First check if command exists at all (in basic database)
            const basicCmd = (0, spl_commands_database_1.getSPLCommand)(commandName);
            if (!basicCmd) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNumber, character: commandStart + (context.charOffset || 0) },
                        end: { line: lineNumber, character: commandEnd + (context.charOffset || 0) }
                    },
                    message: `Unknown SPL command: '${commandName}'. Check command spelling or refer to SPL documentation.`,
                    source: 'spl-validation'
                });
                continue;
            }
            // If command exists in enhanced database, do detailed argument validation
            const enhancedCmd = (0, spl_commands_enhanced_1.getSPLCommandEnhanced)(commandName);
            if (enhancedCmd) {
                // Validate command arguments with enhanced metadata, passing command position
                const argDiags = validateCommandArguments(commandName, argumentsStr, context, commandStart);
                diagnostics.push(...argDiags);
            }
            // If not in enhanced database, command is valid but we skip detailed validation
        }
    }
    // Extract and validate function calls (use original line for accurate positions)
    const functionCalls = extractFunctionCalls(line);
    for (const funcCall of functionCalls) {
        // Pass the startPos to get accurate highlighting
        const funcDiags = validateFunctionCall(funcCall.name, funcCall.args, context, funcCall.startPos);
        diagnostics.push(...funcDiags);
    }
    // Validate variable usage (check if variables are used before declaration)
    if (context.availableVariables) {
        const varDiags = validateVariableUsage(line, context);
        diagnostics.push(...varDiags);
    }
    return diagnostics;
}
//# sourceMappingURL=spl-validation.js.map