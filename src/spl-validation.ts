/**
 * SPL Query Validation Module
 * Provides comprehensive validation for SPL commands and functions
 */

import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';
import { getSPLCommandEnhanced, SPLCommandEnhanced, SPLArgument } from './spl-commands-enhanced';
import { getSPLCommand } from './spl-commands-database';
import { SPL_FUNCTIONS, SPLFunction } from './spl-functions-database';

export interface ValidationContext {
	line: string;
	lineNumber: number;
	documentUri: string;
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

	// Check for grouped variadic pattern FIRST: entire signature like "(<p1>, <p2>)..."
	// This matches: validate(<condition>, <value>)... or case(<condition>, <value>)...
	const groupedVariadicMatch = paramsStr.match(/^\((.+)\)\.\.\.$/);
	if (groupedVariadicMatch) {
		// Count parameters in the group
		const groupContent = groupedVariadicMatch[1];
		const groupParams = groupContent.split(',').map(p => p.trim());
		const minParams = groupParams.length; // At least one complete group required
		
		return {
			minParams,
			maxParams: Infinity,
			isVariadic: true,
			paramNames: groupParams
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
	context: ValidationContext
): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	
	const func = SPL_FUNCTIONS.find(f => f.name.toLowerCase() === functionName.toLowerCase());
	if (!func) {
		return diagnostics; // Unknown function, handled elsewhere
	}

	const sigInfo = parseFunctionSignature(func.signature);
	const argCount = args.length;

	// Check parameter count
	if (argCount < sigInfo.minParams) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: context.lineNumber, character: 0 },
				end: { line: context.lineNumber, character: context.line.length }
			},
			message: `Function '${func.name}()' requires at least ${sigInfo.minParams} parameter${sigInfo.minParams !== 1 ? 's' : ''}, but got ${argCount}.`,
			source: 'spl-validation'
		});
	} else if (argCount > sigInfo.maxParams && !sigInfo.isVariadic) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: context.lineNumber, character: 0 },
				end: { line: context.lineNumber, character: context.line.length }
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
	context: ValidationContext
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
	
	// Check if required arguments are provided
	if (cmd.requiredArgs.length > 0 && !trimmedArgs) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: context.lineNumber, character: 0 },
				end: { line: context.lineNumber, character: context.line.length }
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
				severity: DiagnosticSeverity.Error,
				range: {
					start: { line: context.lineNumber, character: 0 },
					end: { line: context.lineNumber, character: context.line.length }
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
			// Unknown argument
			diagnostics.push({
				severity: DiagnosticSeverity.Warning,
				range: {
					start: { line: context.lineNumber, character: 0 },
					end: { line: context.lineNumber, character: context.line.length }
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
export function validateSPLLine(line: string, lineNumber: number, documentUri: string): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	const context: ValidationContext = { line, lineNumber, documentUri };
	
	// Skip empty lines and comments
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('```')) {
		return diagnostics;
	}
	
	// Extract and validate commands (after pipe operators)
	if (trimmed.includes('|')) {
		const pipes = trimmed.split('|');
		for (let i = 1; i < pipes.length; i++) {
			const commandPart = pipes[i].trim();
			if (!commandPart) continue;
			
			const parts = commandPart.split(/\s+/);
			const commandName = parts[0];
			const argumentsStr = commandPart.substring(commandName.length).trim();
			
			// First check if command exists at all (in basic database)
			const basicCmd = getSPLCommand(commandName);
			if (!basicCmd) {
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
					range: {
						start: { line: lineNumber, character: 0 },
						end: { line: lineNumber, character: line.length }
					},
					message: `Unknown SPL command: '${commandName}'. Check command spelling or refer to SPL documentation.`,
					source: 'spl-validation'
				});
				continue;
			}
			
			// If command exists in enhanced database, do detailed argument validation
			const enhancedCmd = getSPLCommandEnhanced(commandName);
			if (enhancedCmd) {
				// Validate command arguments with enhanced metadata
				const argDiags = validateCommandArguments(commandName, argumentsStr, context);
				diagnostics.push(...argDiags);
			}
			// If not in enhanced database, command is valid but we skip detailed validation
		}
	}
	
	// Extract and validate function calls
	const functionCalls = extractFunctionCalls(trimmed);
	for (const funcCall of functionCalls) {
		const funcDiags = validateFunctionCall(funcCall.name, funcCall.args, context);
		diagnostics.push(...funcDiags);
	}
	
	return diagnostics;
}
