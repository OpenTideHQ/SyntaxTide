/**
 * SPL Command Parameter Parser and Validator
 * Parses SPL command syntax to extract and validate parameters
 */

import { ParameterDefinition, ParameterType } from './spl-parameter-types';

/**
 * Represents a parsed parameter from an SPL command
 */
export interface ParsedParameter {
	/** The parameter name (for named params) or value (for positional) */
	name: string;
	/** The value assigned to the parameter (for named params like key=value) */
	value?: string;
	/** The type of parameter */
	type: 'named' | 'positional' | 'field' | 'clause';
	/** Start position in the command string */
	startPos: number;
	/** End position in the command string */
	endPos: number;
	/** Whether this parameter matches a known definition */
	matched: boolean;
	/** The matching parameter definition, if found */
	definition?: ParameterDefinition;
}

/**
 * Result of parsing a command's parameters
 */
export interface CommandParseResult {
	/** The command name */
	commandName: string;
	/** List of parsed parameters */
	parameters: ParsedParameter[];
	/** List of missing required parameters */
	missingRequired: ParameterDefinition[];
	/** List of unknown/unmatched parameters */
	unknown: ParsedParameter[];
	/** Whether the command is valid */
	isValid: boolean;
}

/**
 * Tokenizes a command line into meaningful parts
 * Handles quoted strings, parentheses, brackets, and special SPL syntax
 */
function tokenizeCommand(commandLine: string): string[] {
	const tokens: string[] = [];
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
			if (char === '(') inParens++;
			if (char === ')') inParens--;
			if (char === '[') inBrackets++;
			if (char === ']') inBrackets--;
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
function isNamedParameter(token: string): boolean {
	// Must contain = but not be a comparison
	if (!token.includes('=')) return false;
	
	// Don't match comparison operators
	if (token.includes('==') || token.includes('!=') || token.includes('<=') || token.includes('>=')) {
		return false;
	}

	// Must have content before and after =
	const parts = token.split('=');
	if (parts.length !== 2) return false;
	if (parts[0].trim().length === 0) return false;

	return true;
}

/**
 * Checks if a token is a clause keyword (AS, BY, OVER, WHERE, etc.)
 */
function isClauseKeyword(token: string): boolean {
	const clauses = ['AS', 'BY', 'OVER', 'WHERE', 'INTO', 'FROM', 'WITH'];
	return clauses.includes(token.toUpperCase());
}

/**
 * Parse command line to extract parameters
 */
export function parseCommandParameters(commandLine: string, parameterDefs: ParameterDefinition[]): ParsedParameter[] {
	const tokens = tokenizeCommand(commandLine);
	const parsedParams: ParsedParameter[] = [];
	
	// Skip the command name itself (first token)
	if (tokens.length === 0) return parsedParams;
	
	let position = commandLine.indexOf(tokens[0]) + tokens[0].length;

	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];
		position = commandLine.indexOf(token, position);

		// Named parameter (key=value)
		if (isNamedParameter(token)) {
			const [key, value] = token.split('=', 2);
			const matchingDef = parameterDefs.find(
				p => p.name === key && p.type === ParameterType.NAMED
			);

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
			const matchingDef = parameterDefs.find(
				p => p.syntax.toUpperCase().includes(token.toUpperCase()) && 
				     p.type === ParameterType.CLAUSE
			);

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
			const matchingDef = parameterDefs.find(
				p => (p.type === ParameterType.FIELD || p.type === ParameterType.POSITIONAL) &&
				     !parsedParams.find(pp => pp.definition?.name === p.name)
			);

			parsedParams.push({
				name: token,
				type: matchingDef?.type === ParameterType.FIELD ? 'field' : 'positional',
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
export function validateCommandParameters(
	commandName: string,
	commandLine: string,
	parameterDefs: ParameterDefinition[]
): CommandParseResult {
	const parsedParams = parseCommandParameters(commandLine, parameterDefs);
	
	// Find missing required parameters
	const missingRequired = parameterDefs.filter(def => {
		if (!def.required) return false;
		
		// Check if this required parameter was provided
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
export function getParameterAtPosition(
	commandLine: string,
	position: number,
	parameterDefs: ParameterDefinition[]
): ParsedParameter | undefined {
	const parsedParams = parseCommandParameters(commandLine, parameterDefs);
	
	return parsedParams.find(p => position >= p.startPos && position <= p.endPos);
}

/**
 * Get suggestions for parameters that haven't been provided yet
 * Used for autocomplete
 */
export function getSuggestedParameters(
	commandLine: string,
	cursorPosition: number,
	parameterDefs: ParameterDefinition[]
): ParameterDefinition[] {
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
		// Don't suggest already-provided parameters (for named params)
		if (def.type === ParameterType.NAMED && providedParams.has(def.name)) {
			return false;
		}
		return true;
	}).sort((a, b) => {
		// Required parameters first
		if (a.required && !b.required) return -1;
		if (!a.required && b.required) return 1;
		return 0;
	});
}
