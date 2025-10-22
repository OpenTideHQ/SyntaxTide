/**
 * SPL Query Validation Module
 * Provides comprehensive validation for SPL commands and functions
 */

import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';
import { getSPLCommandEnhanced, SPLCommandEnhanced, SPLArgument } from './spl-commands-enhanced';
import { getSPLCommand, SPLCommand, ParameterDefinition } from './spl-commands-database';
import { SPL_FUNCTIONS, SPLFunction } from './spl-functions-database';
import { validateCommandParameters, ParsedParameter } from './spl-parameter-parser';

export interface ValidationContext {
	line: string;
	lineNumber: number;
	documentUri: string;
	charOffset?: number; // YAML indentation offset for character positions
	availableVariables?: Set<string>; // Variables declared before this line
}

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
function parseFunctionSignature(signature: string): {
	minParams: number;
	maxParams: number;
	isVariadic: boolean;
	paramNames: string[];
} {
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
	const params: string[] = [];
	let depth = 0;
	let currentParam = '';
	
	for (let i = 0; i < paramsStr.length; i++) {
		const char = paramsStr[i];
		if (char === '(' || char === '<' || char === '[') depth++;
		else if (char === ')' || char === '>' || char === ']') depth--;
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
	const paramNames: string[] = [];

	for (let i = 0; i < params.length; i++) {
		const param = params[i];
		paramNames.push(param);

		// Check for simple variadic: <param>...
		if (param.includes('...')) {
			isVariadic = true;
			maxParams = Infinity;
			
			// Count required params before the variadic marker
			const beforeVariadic = params.slice(0, i);
			minParams = beforeVariadic.filter(p => 
				!p.startsWith('[') && !p.endsWith(']')
			).length;
			
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
		} else {
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
export function validateFunctionCall(
	functionName: string,
	args: string[],
	context: ValidationContext,
	startPos?: number
): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	
	const func = SPL_FUNCTIONS.find(f => f.name.toLowerCase() === functionName.toLowerCase());
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
	} else {
		// Fallback: get the leading whitespace if startPos not provided
		const leadingWhitespace = context.line.match(/^\s*/)?.[0].length || 0;
		startChar = leadingWhitespace + (context.charOffset || 0);
	}

	// Check parameter count
	if (argCount < sigInfo.minParams) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: context.lineNumber, character: startChar },
				end: { line: context.lineNumber, character: endChar }
			},
			message: `Function '${func.name}()' requires at least ${sigInfo.minParams} parameter${sigInfo.minParams !== 1 ? 's' : ''}, but got ${argCount}.`,
			source: 'spl-validation'
		});
	} else if (argCount > sigInfo.maxParams && !sigInfo.isVariadic) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
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
export function extractFunctionCalls(line: string): Array<{
	name: string;
	args: string[];
	startPos: number;
}> {
	const functionCalls: Array<{ name: string; args: string[]; startPos: number }> = [];
	
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
			if (line[i] === '(') depth++;
			else if (line[i] === ')') depth--;
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
function splitFunctionArgs(argsStr: string): string[] {
	if (!argsStr.trim()) return [];
	
	const args: string[] = [];
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
			} else if (char === quoteChar) {
				inQuotes = false;
			}
		}
		
		// Track parenthesis depth
		if (!inQuotes) {
			if (char === '(') depth++;
			else if (char === ')') depth--;
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
export function validateCommandArguments(
	commandName: string,
	argumentsStr: string,
	context: ValidationContext,
	commandStartPos?: number
): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	
	const cmd = getSPLCommandEnhanced(commandName);
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
	
	// SPL allows multiline commands - arguments can be on following lines
	// Detect if this line might continue (command without args but line suggests continuation):
	// - Command at end of line (nothing after command name)
	// - Open bracket/parenthesis suggesting continuation
	// - Command that commonly spans multiple lines
	const mightContinueNextLine = 
		!trimmedArgs || // No args on same line
		context.line.trim().endsWith('[') || // Starts subsearch
		context.line.trim().endsWith('('); // Starts grouped expression
	
	// Commands that commonly/legitimately span multiple lines
	const multilineCommands = new Set([
		'chart', 'stats', 'timechart', 'eval', 'where', 'streamstats', 
		'eventstats', 'tstats', 'mstats', 'sistats', 'geostats', 'table',
		'join', 'append', 'appendcols', 'case', 'if', 'validate'
	]);
	
	// If command might continue on next line AND it's a command known for multiline usage,
	// skip required argument validation (too many false positives)
	if (mightContinueNextLine && multilineCommands.has(cmd.name.toLowerCase())) {
		return diagnostics; // Don't validate - likely multiline
	}
	
	// Check if required arguments are provided
	if (cmd.requiredArgs.length > 0 && !trimmedArgs) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
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
	if (cmd.requiredArgs.length > 0 && !multilineCommands.has(cmd.name.toLowerCase())) {
		// Check for basic presence of arguments
		const hasEquals = trimmedArgs.includes('=');
		const hasContent = trimmedArgs.length > 0;
		
		// For commands that require field names or specific syntax
		if (!hasContent) {
			const requiredArgNames = cmd.requiredArgs.map(a => a.name).join(', ');
			diagnostics.push({
				severity: DiagnosticSeverity.Error,
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
		const argDef = [...cmd.requiredArgs, ...cmd.optionalArgs].find(
			a => a.name.toLowerCase() === argName.toLowerCase()
		);
		
		if (!argDef) {
			// Unknown argument - highlight the argument name itself
			const argPos = context.line.indexOf(argName);
			const argStart = argPos >= 0 ? argPos : startChar;
			const argEnd = argStart + argName.length;
			
			diagnostics.push({
				severity: DiagnosticSeverity.Warning,
				range: {
					start: { line: context.lineNumber, character: argStart },
					end: { line: context.lineNumber, character: argEnd }
				},
				message: `Unknown argument '${argName}' for command '${cmd.name}'. Valid arguments: ${[...cmd.requiredArgs, ...cmd.optionalArgs].map(a => a.name).join(', ')}.`,
				source: 'spl-validation'
			});
		} else {
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
function validateArgumentType(
	value: string,
	argDef: SPLArgument,
	context: ValidationContext
): Diagnostic | null {
	const type = argDef.type;
	
	// Basic type validation
	if (type === 'number' || type === 'int') {
		if (!/^-?\d+$/.test(value) && !/^-?\d+\.\d+$/.test(value)) {
			return {
				severity: DiagnosticSeverity.Error,
				range: {
					start: { line: context.lineNumber, character: 0 },
					end: { line: context.lineNumber, character: context.line.length }
				},
				message: `Argument '${argDef.name}' expects a number, but got '${value}'.`,
				source: 'spl-validation'
			};
		}
	} else if (type === 'boolean' || type === 'bool') {
		const lowerValue = value.toLowerCase();
		if (!['true', 'false', 't', 'f', '1', '0', 'yes', 'no'].includes(lowerValue)) {
			return {
				severity: DiagnosticSeverity.Error,
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
function validateVariableUsage(line: string, context: ValidationContext): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	
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
	// Note: For inputlookup/outputlookup, we only want to skip validation of the table name,
	// not the entire line (to preserve parameter validation and WHERE clause fields)
	const isLookupCommand = line.match(/\|\s*lookup\b/i);
	const isInputOutputLookup = line.match(/\|\s*(input|output)lookup\b/i);
	
	if (isLookupCommand && !isInputOutputLookup) {
		return diagnostics; // Lookup command - too complex to parse table names vs fields
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
	
	// Extract field references from the line, excluding those inside strings
	// Build a map of string ranges to exclude
	const stringRanges: Array<{start: number, end: number}> = [];
	let inSingleQuote = false;
	let inDoubleQuote = false;
	let escapeNext = false;
	let stringStart = -1;
	
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		
		if (escapeNext) {
			escapeNext = false;
			continue;
		}
		
		if (char === '\\') {
			escapeNext = true;
			continue;
		}
		
		if (char === '"' && !inSingleQuote) {
			if (!inDoubleQuote) {
				stringStart = i;
				inDoubleQuote = true;
			} else {
				stringRanges.push({ start: stringStart, end: i });
				inDoubleQuote = false;
			}
			continue;
		}
		
		if (char === "'" && !inDoubleQuote) {
			if (!inSingleQuote) {
				stringStart = i;
				inSingleQuote = true;
			} else {
				stringRanges.push({ start: stringStart, end: i });
				inSingleQuote = false;
			}
			continue;
		}
	}
	
	// Helper to check if a position is inside a string
	const isInsideString = (pos: number): boolean => {
		return stringRanges.some(range => pos >= range.start && pos <= range.end);
	};
	
	// Extract potential field references (simplified - excludes keywords and function names)
	const fieldPattern = /\b([a-z_][a-z0-9_]*)\b/gi;
	const matches = [...line.matchAll(fieldPattern)];
	
	// For inputlookup/outputlookup, identify the lookup table name to skip
	let lookupTableName: string | null = null;
	if (isInputOutputLookup) {
		// Extract the filename - it can be before or after WHERE
		// Syntax: inputlookup [options] [WHERE <search>] <filename>
		// So filename is: first non-parameter token before WHERE, OR first non-parameter token after WHERE
		const afterCommand = line.replace(/\|\s*(?:input|output)lookup\s+/i, '');
		const tokens = afterCommand.split(/\s+/);
		
		let whereFound = false;
		for (const token of tokens) {
			// Track WHERE keyword
			if (token.toUpperCase() === 'WHERE') {
				whereFound = true;
				continue;
			}
			
			// Skip named parameters
			if (token.includes('=')) continue;
			
			// If we haven't found WHERE yet, this could be the filename
			// If we just passed WHERE, the next non-parameter is the filename
			if (!whereFound || (whereFound && !lookupTableName)) {
				lookupTableName = token.replace(/\.csv$/i, ''); // Strip .csv if present
				break; // Found the filename
			}
		}
	}
	
	// SPL keywords and built-in fields to exclude
	const keywords = new Set([
		'eval', 'where', 'stats', 'by', 'as', 'and', 'or', 'not', 'in',
		'true', 'false', 'null', 'if', 'case', 'span', 'count', 'sum', 'avg',
		'max', 'min', 'values', 'list', 'dc', 'earliest', 'latest',
		'_time', '_raw', 'index', 'sourcetype', 'host', 'source'
	]);
	
	const checkedFields = new Set<string>();
	
	for (const match of matches) {
		const fieldName = match[1];
		const position = match.index || 0;
		
		// Skip if inside a string literal
		if (isInsideString(position)) {
			continue;
		}
		
		// Skip if this is the lookup table name in inputlookup/outputlookup
		if (lookupTableName && fieldName.toLowerCase() === lookupTableName.toLowerCase()) {
			continue;
		}
		
		// Skip if already checked, is a keyword, or is a known function
		if (checkedFields.has(fieldName) || keywords.has(fieldName.toLowerCase())) {
			continue;
		}
		
		// Check if it's a function name (has opening paren right after)
		const afterMatch = line.substring(position + fieldName.length);
		if (afterMatch.trimStart().startsWith('(')) {
			continue; // It's a function call, not a field reference
		}
		
		// Check if field is available (declared before this line)
		if (!context.availableVariables.has(fieldName)) {
			// Field is not in our tracked variables
			// Only warn about fields that look like user-defined (contain underscores)
			if (fieldName.includes('_')) {
				diagnostics.push({
					severity: DiagnosticSeverity.Warning,
					range: {
						start: { line: context.lineNumber, character: position + (context.charOffset || 0) },
						end: { line: context.lineNumber, character: position + fieldName.length + (context.charOffset || 0) }
					},
					message: `Field '${fieldName}' may not be defined yet. Ensure it is created before this line using eval, rename, rex, stats, or spath.`,
					source: 'spl-validation'
				});
			}
		}
		
		checkedFields.add(fieldName);
	}
	
	return diagnostics;
}

/**
 * Split SPL line by pipe operators, but ignore pipes inside quoted strings
 * Handles both single and double quotes
 */
function splitByPipes(line: string): string[] {
	const parts: string[] = [];
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

/**
 * Normalize multiline SPL queries by merging continuation lines
 * 
 * SPL allows line breaks between tokens. This function identifies command boundaries
 * (lines starting with |) and merges continuation lines into their parent command.
 * 
 * Example:
 *   | chart 
 *       sum(bytes) as total,
 *       avg(duration) as avg_dur
 *     over user
 * 
 * Becomes:
 *   | chart sum(bytes) as total, avg(duration) as avg_dur over user
 * 
 * @param lines Array of query lines
 * @returns Array of {normalizedLine, originalLineNumber, originalLines} objects
 */
export function normalizeSPLQuery(lines: string[]): Array<{
	normalizedLine: string;
	originalLineNumber: number;
	originalLines: number[];
}> {
	const normalized: Array<{
		normalizedLine: string;
		originalLineNumber: number;
		originalLines: number[];
	}> = [];
	
	let currentCommand = '';
	let currentStartLine = 0;
	let currentLineNumbers: number[] = [];
	let inSingleQuote = false;
	let inDoubleQuote = false;
	let escapeNext = false;
	let bracketDepth = 0; // Track subsearch brackets [ ]
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();
		
		// Skip empty lines and comments
		if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('```')) {
			if (currentCommand) {
				// Empty line might signal end of command
				normalized.push({
					normalizedLine: currentCommand.trim(),
					originalLineNumber: currentStartLine,
					originalLines: [...currentLineNumbers]
				});
				currentCommand = '';
				currentLineNumbers = [];
			}
			continue;
		}
		
		// Track quote and bracket state for this line
		for (let j = 0; j < line.length; j++) {
			const char = line[j];
			
			if (escapeNext) {
				escapeNext = false;
				continue;
			}
			
			if (char === '\\') {
				escapeNext = true;
				continue;
			}
			
			// Track quotes
			if (char === '"' && !inSingleQuote) {
				inDoubleQuote = !inDoubleQuote;
			} else if (char === "'" && !inDoubleQuote) {
				inSingleQuote = !inSingleQuote;
			}
			
			// Track subsearch brackets (only outside strings)
			if (!inSingleQuote && !inDoubleQuote) {
				if (char === '[') bracketDepth++;
				else if (char === ']') bracketDepth--;
			}
		}
		
		// Check if this line starts a new command (begins with | outside strings/brackets)
		const startsWithPipe = trimmed.startsWith('|') && !inSingleQuote && !inDoubleQuote && bracketDepth === 0;
		
		if (startsWithPipe) {
			// New command - save previous if exists
			if (currentCommand) {
				normalized.push({
					normalizedLine: currentCommand.trim(),
					originalLineNumber: currentStartLine,
					originalLines: [...currentLineNumbers]
				});
			}
			
			// Start new command
			currentCommand = trimmed;
			currentStartLine = i;
			currentLineNumbers = [i];
		} else {
			// Continuation line - merge with current command
			if (currentCommand) {
				// Add space if needed (unless line starts with punctuation like comma)
				const needsSpace = !currentCommand.endsWith(' ') && 
				                   !trimmed.startsWith(',') && 
				                   !trimmed.startsWith(')') &&
				                   !currentCommand.endsWith('(');
				currentCommand += (needsSpace ? ' ' : '') + trimmed;
				currentLineNumbers.push(i);
			} else {
				// First line doesn't start with | (e.g., search command)
				currentCommand = trimmed;
				currentStartLine = i;
				currentLineNumbers = [i];
			}
		}
	}
	
	// Don't forget the last command
	if (currentCommand) {
		normalized.push({
			normalizedLine: currentCommand.trim(),
			originalLineNumber: currentStartLine,
			originalLines: [...currentLineNumbers]
		});
	}
	
	return normalized;
}

/**
 * Validate command parameters using parameter parser (NEW approach)
 */
function validateCommandParametersNew(
	commandName: string,
	commandLine: string,
	context: ValidationContext,
	commandStartPos: number,
	logger?: (message: string) => void
): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	
	if (logger) {
		logger(`validateCommandParametersNew called for: ${commandName}`);
		logger(`  commandLine: "${commandLine}"`);
		logger(`  context.line: "${context.line}"`);
		logger(`  context.line.length: ${context.line.length}`);
		logger(`  First 50 chars of context.line: "${context.line.substring(0, 50)}"`);
		logger(`  context.lineNumber: ${context.lineNumber}`);
		logger(`  context.charOffset: ${context.charOffset}`);
		logger(`  commandStartPos: ${commandStartPos}`);
	}
	
	const cmd = getSPLCommand(commandName);
	
	if (logger) {
		logger(`  cmd found: ${!!cmd}`);
		logger(`  cmd.parameters exists: ${!!(cmd && cmd.parameters)}`);
		logger(`  cmd.parameters.length: ${cmd?.parameters?.length || 0}`);
	}
	
	if (!cmd || !cmd.parameters || cmd.parameters.length === 0) {
		if (logger) logger(`  No parameters defined, exiting`);
		return diagnostics; // No parameters to validate
	}
	
	// Use parameter parser to validate
	const result = validateCommandParameters(commandName, commandLine, cmd.parameters);
	
	if (logger) {
		logger(`  Parse result - missing: ${result.missingRequired.length}, unknown: ${result.unknown.length}`);
	}
	
	const charOffset = context.charOffset || 0;
	
	// Find where commandLine appears in the original line to get the proper offset
	// Important: context.line is the SPL query line (after YAML parsing)
	// commandLine is the full command string (e.g., "abstract unknownparam=123")
	// We need to find its position in context.line
	let baseOffset = 0;
	const commandLineStart = context.line.indexOf(commandLine);
	
	if (logger) {
		logger(`  commandLineStart (indexOf): ${commandLineStart}`);
	}
	
	if (commandLineStart >= 0) {
		// Found the command in the line
		baseOffset = commandLineStart;
		if (logger) logger(`  Using direct indexOf, baseOffset: ${baseOffset}`);
	} else {
		// Fallback: try to find by searching for the command name
		// This handles cases where commandLine might have extra whitespace
		const cmdPos = context.line.indexOf(commandName);
		if (cmdPos >= 0) {
			// Find the position right after the pipe
			const pipePos = context.line.lastIndexOf('|', cmdPos);
			if (pipePos >= 0) {
				// Position is after the pipe and any whitespace
				const afterPipe = context.line.substring(pipePos + 1);
				const trimStart = afterPipe.length - afterPipe.trimStart().length;
				baseOffset = pipePos + 1 + trimStart;
				if (logger) logger(`  Using pipe calculation, baseOffset: ${baseOffset}`);
			} else {
				baseOffset = cmdPos;
				if (logger) logger(`  Using cmdPos, baseOffset: ${baseOffset}`);
			}
		}
	}
	
	// Report missing required parameters
	for (const missingParam of result.missingRequired) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: context.lineNumber, character: baseOffset + charOffset },
				end: { line: context.lineNumber, character: baseOffset + commandName.length + charOffset }
			},
			message: `Missing required parameter '${missingParam.name}': ${missingParam.description}`,
			source: 'spl-validation'
		});
	}
	
	// Report unknown parameters (with less severity - might be field names)
	for (const unknownParam of result.unknown) {
		// Only report as warning if it's a named parameter (key=value)
		// Don't warn about positional/field parameters (could be user fields)
		if (unknownParam.type === 'named') {
			// Calculate position: baseOffset is where commandLine starts in context.line
			// unknownParam.startPos is relative to commandLine
			// charOffset is YAML indentation to add back
			const startChar = baseOffset + unknownParam.startPos + charOffset;
			const endChar = baseOffset + unknownParam.endPos + charOffset;
			
			if (logger) {
				logger(`  Unknown param '${unknownParam.name}' (${unknownParam.type})`);
				logger(`    context.line: "${context.line}"`);
				logger(`    commandLine passed to parser: "${commandLine}"`);
				logger(`    Raw positions - unknownParam.startPos: ${unknownParam.startPos}, endPos: ${unknownParam.endPos}`);
				logger(`    baseOffset: ${baseOffset}, charOffset: ${charOffset}`);
				logger(`    Calculation: ${baseOffset} + ${unknownParam.startPos} + ${charOffset} = ${startChar}`);
				logger(`    Final range: ${startChar}-${endChar}`);
				logger(`    Line number for diagnostic: ${context.lineNumber}`);
			}
			
			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: { line: context.lineNumber, character: startChar },
					end: { line: context.lineNumber, character: endChar }
				},
				message: `Unknown parameter '${unknownParam.name}' for command '${commandName}'. Check command documentation.`,
				source: 'spl-validation'
			};
			
			if (logger) {
				logger(`    Created diagnostic object: line=${diagnostic.range.start.line}, start=${diagnostic.range.start.character}, end=${diagnostic.range.end.character}`);
			}
			
			diagnostics.push(diagnostic);
		}
	}
	
	if (logger && diagnostics.length > 0) {
		logger(`  Returning ${diagnostics.length} diagnostic(s) for parameter validation`);
		for (const diag of diagnostics) {
			logger(`    - Line ${diag.range.start.line}, chars ${diag.range.start.character}-${diag.range.end.character}: ${diag.message}`);
		}
	}
	
	return diagnostics;
}

export function validateSPLLine(
	line: string, 
	lineNumber: number, 
	documentUri: string, 
	charOffset: number = 0, 
	availableVariables?: Set<string>,
	logger?: (message: string) => void
): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	const context: ValidationContext = { line, lineNumber, documentUri, charOffset, availableVariables };
	
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
			if (!commandPart) continue;
			
			// Check if this is a macro call (starts with backtick)
			if (commandPart.startsWith('`')) {
				// Validate macro syntax
				const macroMatch = commandPart.match(/^`([a-zA-Z_][a-zA-Z0-9_]*)(\([^)]*\))?`$/);
				if (!macroMatch) {
					// Invalid macro syntax
					const macroStart = line.indexOf('`', 0);
					diagnostics.push({
						severity: DiagnosticSeverity.Error,
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
			const basicCmd = getSPLCommand(commandName);
			if (!basicCmd) {
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
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
			const enhancedCmd = getSPLCommandEnhanced(commandName);
			if (enhancedCmd) {
				// Validate command arguments with enhanced metadata, passing command position
				const argDiags = validateCommandArguments(commandName, argumentsStr, context, commandStart);
				diagnostics.push(...argDiags);
			}
			
			// NEW: Also validate with parameter parser if parameters are defined
			const cmd = getSPLCommand(commandName);
			if (cmd && cmd.parameters && cmd.parameters.length > 0) {
				const paramDiags = validateCommandParametersNew(commandName, commandPart, context, commandStart, logger);
				diagnostics.push(...paramDiags);
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
