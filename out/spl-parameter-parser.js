"use strict";
/**
 * SPL Command Parameter Parser and Validator
 * Parses SPL command syntax to extract and validate parameters
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommandParameters = parseCommandParameters;
exports.validateCommandParameters = validateCommandParameters;
exports.getParameterAtPosition = getParameterAtPosition;
exports.getSuggestedParameters = getSuggestedParameters;
const spl_parameter_types_1 = require("./spl-parameter-types");
/**
 * Tokenizes a command line into meaningful parts
 * Handles quoted strings, parentheses, brackets, and special SPL syntax
 */
function tokenizeCommand(commandLine) {
    const tokens = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    let inParens = 0;
    let inBrackets = 0;
    let escapeNext = false;
    for (let i = 0; i < commandLine.length; i++) {
        const char = commandLine[i];
        if (escapeNext) {
            current += char;
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            current += char;
            escapeNext = true;
            continue;
        }
        // Handle quotes
        if ((char === '"' || char === "'") && !inQuotes) {
            inQuotes = true;
            quoteChar = char;
            current += char;
            continue;
        }
        if (char === quoteChar && inQuotes) {
            inQuotes = false;
            current += char;
            quoteChar = '';
            continue;
        }
        // Track parentheses and brackets
        if (!inQuotes) {
            if (char === '(')
                inParens++;
            if (char === ')')
                inParens--;
            if (char === '[')
                inBrackets++;
            if (char === ']')
                inBrackets--;
        }
        // Split on whitespace only when not inside quotes/parens/brackets
        if (char === ' ' && !inQuotes && inParens === 0 && inBrackets === 0) {
            if (current.length > 0) {
                tokens.push(current);
                current = '';
            }
            continue;
        }
        current += char;
    }
    if (current.length > 0) {
        tokens.push(current);
    }
    return tokens;
}
/**
 * Checks if a token matches a named parameter pattern (key=value)
 */
function isNamedParameter(token) {
    // Must contain = but not be a comparison
    if (!token.includes('='))
        return false;
    // Don't match comparison operators
    if (token.includes('==') || token.includes('!=') || token.includes('<=') || token.includes('>=')) {
        return false;
    }
    // Must have content before and after =
    const parts = token.split('=');
    if (parts.length !== 2)
        return false;
    if (parts[0].trim().length === 0)
        return false;
    return true;
}
/**
 * Checks if a token is a clause keyword (AS, BY, OVER, WHERE, etc.)
 */
function isClauseKeyword(token) {
    const clauses = ['AS', 'BY', 'OVER', 'WHERE', 'INTO', 'FROM', 'WITH'];
    return clauses.includes(token.toUpperCase());
}
/**
 * Parse command line to extract parameters
 */
function parseCommandParameters(commandLine, parameterDefs) {
    const tokens = tokenizeCommand(commandLine);
    const parsedParams = [];
    // Skip the command name itself (first token)
    if (tokens.length === 0)
        return parsedParams;
    let position = commandLine.indexOf(tokens[0]) + tokens[0].length;
    for (let i = 1; i < tokens.length; i++) {
        const token = tokens[i];
        position = commandLine.indexOf(token, position);
        // Named parameter (key=value)
        if (isNamedParameter(token)) {
            const [key, value] = token.split('=', 2);
            const matchingDef = parameterDefs.find(p => p.name === key && p.type === spl_parameter_types_1.ParameterType.NAMED);
            parsedParams.push({
                name: key,
                value: value,
                type: 'named',
                startPos: position,
                endPos: position + token.length,
                matched: !!matchingDef,
                definition: matchingDef
            });
        }
        // Clause keyword
        else if (isClauseKeyword(token)) {
            const matchingDef = parameterDefs.find(p => p.syntax.toUpperCase().includes(token.toUpperCase()) &&
                p.type === spl_parameter_types_1.ParameterType.CLAUSE);
            parsedParams.push({
                name: token,
                type: 'clause',
                startPos: position,
                endPos: position + token.length,
                matched: !!matchingDef,
                definition: matchingDef
            });
        }
        // Field or positional parameter
        else {
            // Try to match against field or positional definitions
            const matchingDef = parameterDefs.find(p => (p.type === spl_parameter_types_1.ParameterType.FIELD || p.type === spl_parameter_types_1.ParameterType.POSITIONAL) &&
                !parsedParams.find(pp => pp.definition?.name === p.name));
            parsedParams.push({
                name: token,
                type: matchingDef?.type === spl_parameter_types_1.ParameterType.FIELD ? 'field' : 'positional',
                startPos: position,
                endPos: position + token.length,
                matched: !!matchingDef,
                definition: matchingDef
            });
        }
        position += token.length;
    }
    return parsedParams;
}
/**
 * Validate command parameters against definitions
 */
function validateCommandParameters(commandName, commandLine, parameterDefs) {
    const parsedParams = parseCommandParameters(commandLine, parameterDefs);
    // Count positional/field parameters that could satisfy MULTI_VALUE requirements
    const positionalCount = parsedParams.filter(p => p.type === 'positional' || p.type === 'field').length;
    // Find missing required parameters
    const missingRequired = parameterDefs.filter(def => {
        if (!def.required)
            return false;
        // For MULTI_VALUE parameters, check if we have enough positional/field params
        if (def.type === spl_parameter_types_1.ParameterType.MULTI_VALUE) {
            // Typically multi-value requires at least 2 fields (e.g., arules needs 2+ fields)
            const minRequired = 2;
            return positionalCount < minRequired;
        }
        // For other parameter types, check if this required parameter was provided
        return !parsedParams.some(p => p.definition?.name === def.name);
    });
    // Find unknown parameters (parsed but not matched)
    const unknown = parsedParams.filter(p => !p.matched);
    const isValid = missingRequired.length === 0 && unknown.length === 0;
    return {
        commandName,
        parameters: parsedParams,
        missingRequired,
        unknown,
        isValid
    };
}
/**
 * Get parameter at a specific character position in the command
 * Used for hover information and autocomplete
 */
function getParameterAtPosition(commandLine, position, parameterDefs) {
    const parsedParams = parseCommandParameters(commandLine, parameterDefs);
    return parsedParams.find(p => position >= p.startPos && position <= p.endPos);
}
/**
 * Get suggestions for parameters that haven't been provided yet
 * Used for autocomplete
 */
function getSuggestedParameters(commandLine, cursorPosition, parameterDefs) {
    const parsedParams = parseCommandParameters(commandLine, parameterDefs);
    const providedParams = new Set(parsedParams.map(p => p.definition?.name).filter(Boolean));
    // Check if cursor is after an = sign (completing a value)
    const beforeCursor = commandLine.substring(0, cursorPosition);
    const lastToken = beforeCursor.split(/\s+/).pop() || '';
    if (lastToken.includes('=') && !lastToken.endsWith('=')) {
        // User is in the middle of typing a value, don't suggest parameters
        return [];
    }
    // Suggest parameters that haven't been provided yet
    return parameterDefs.filter(def => {
        // Only suggest NAMED parameters in autocomplete
        // MULTI_VALUE, POSITIONAL, FIELD, and CLAUSE are not typed with key=value syntax
        if (def.type !== spl_parameter_types_1.ParameterType.NAMED) {
            return false;
        }
        // Don't suggest already-provided parameters
        if (providedParams.has(def.name)) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        // Required parameters first
        if (a.required && !b.required)
            return -1;
        if (!a.required && b.required)
            return 1;
        return 0;
    });
}
//# sourceMappingURL=spl-parameter-parser.js.map