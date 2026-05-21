/**
 * Enhanced SPL Commands Database with Detailed Argument Validation
 * Source: Splunk SPL 10.0 Reference (COMMANDS_ANALYSIS.json)
 * Includes: required/optional argument metadata for validation
 */

export interface SPLArgument {
	name: string;
	syntax: string;
	description: string;
	default?: string;
	required?: boolean;
	type?: string; // e.g., 'int', 'string', 'bool', 'field'
}

export interface SPLCommandEnhanced {
	name: string;
	type: string;
	category: string;
	description: string;
	syntax: string;
	requiredArgs: SPLArgument[];
	optionalArgs: SPLArgument[];
	examples?: string[];
	relatedCommands?: string[];
}

/**
 * Parse argument type from syntax string
 * Examples: "<int>" -> "int", "<field>" -> "field", "<bool>" -> "bool"
 */
function parseArgumentType(syntax: string): string {
	const match = syntax.match(/<([^>]+)>/);
	if (match) {
		const type = match[1].toLowerCase();
		// Normalize common types
		if (type.includes('int') || type.includes('num')) return 'number';
		if (type.includes('bool')) return 'boolean';
		if (type.includes('field')) return 'field';
		if (type.includes('string') || type.includes('str')) return 'string';
		return type;
	}
	return 'any';
}

// Load commands from COMMANDS_ANALYSIS.json
import commandsDataRaw from '../query-languages/splunk/COMMANDS_ANALYSIS.json';

// Type for the JSON structure
interface CommandDataJSON {
	description?: string;
	type?: string;
	category?: string;
	syntax?: string;
	required_args?: Array<{
		name: string;
		syntax: string;
		description?: string;
	}>;
	optional_args?: Array<{
		name: string;
		syntax: string;
		description?: string;
		default?: string;
	}>;
	examples?: string[];
	related_commands?: string[];
}

const commandsData = commandsDataRaw as Record<string, CommandDataJSON>;

export const SPL_COMMANDS_ENHANCED: Map<string, SPLCommandEnhanced> = new Map();

// Process each command from the JSON file
for (const [cmdName, cmdData] of Object.entries(commandsData)) {
	if (!cmdData) continue;
	
	const enhanced: SPLCommandEnhanced = {
		name: cmdName,
		type: cmdData.type || 'Unknown',
		category: cmdData.category || 'General',
		description: cmdData.description || '',
		syntax: cmdData.syntax || '',
		requiredArgs: (cmdData.required_args || []).map((arg) => ({
			name: arg.name,
			syntax: arg.syntax,
			description: arg.description || '',
			required: true,
			type: parseArgumentType(arg.syntax)
		})),
		optionalArgs: (cmdData.optional_args || []).map((arg) => ({
			name: arg.name,
			syntax: arg.syntax,
			description: arg.description || '',
			default: arg.default,
			required: false,
			type: parseArgumentType(arg.syntax)
		})),
		examples: cmdData.examples || [],
		relatedCommands: cmdData.related_commands || []
	};
	
	SPL_COMMANDS_ENHANCED.set(cmdName, enhanced);
}

/**
 * Get enhanced command information by name (case-insensitive)
 */
export function getSPLCommandEnhanced(name: string): SPLCommandEnhanced | undefined {
	const lowerName = name.toLowerCase();
	for (const [key, value] of SPL_COMMANDS_ENHANCED.entries()) {
		if (key.toLowerCase() === lowerName) {
			return value;
		}
	}
	return undefined;
}

/**
 * Get all enhanced command names
 */
export function getAllCommandNames(): string[] {
	return Array.from(SPL_COMMANDS_ENHANCED.keys());
}
