"use strict";
/**
 * Enhanced SPL Commands Database with Detailed Argument Validation
 * Source: Splunk SPL 10.0 Reference (COMMANDS_ANALYSIS.json)
 * Includes: required/optional argument metadata for validation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPL_COMMANDS_ENHANCED = void 0;
exports.getSPLCommandEnhanced = getSPLCommandEnhanced;
exports.getAllCommandNames = getAllCommandNames;
/**
 * Parse argument type from syntax string
 * Examples: "<int>" -> "int", "<field>" -> "field", "<bool>" -> "bool"
 */
function parseArgumentType(syntax) {
    const match = syntax.match(/<([^>]+)>/);
    if (match) {
        const type = match[1].toLowerCase();
        // Normalize common types
        if (type.includes('int') || type.includes('num'))
            return 'number';
        if (type.includes('bool'))
            return 'boolean';
        if (type.includes('field'))
            return 'field';
        if (type.includes('string') || type.includes('str'))
            return 'string';
        return type;
    }
    return 'any';
}
// Load commands from COMMANDS_ANALYSIS.json
const COMMANDS_ANALYSIS_json_1 = __importDefault(require("../query-languages/splunk/COMMANDS_ANALYSIS.json"));
const commandsData = COMMANDS_ANALYSIS_json_1.default;
exports.SPL_COMMANDS_ENHANCED = new Map();
// Process each command from the JSON file
for (const [cmdName, cmdData] of Object.entries(commandsData)) {
    if (!cmdData)
        continue;
    const enhanced = {
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
    exports.SPL_COMMANDS_ENHANCED.set(cmdName, enhanced);
}
/**
 * Get enhanced command information by name (case-insensitive)
 */
function getSPLCommandEnhanced(name) {
    const lowerName = name.toLowerCase();
    for (const [key, value] of exports.SPL_COMMANDS_ENHANCED.entries()) {
        if (key.toLowerCase() === lowerName) {
            return value;
        }
    }
    return undefined;
}
/**
 * Get all enhanced command names
 */
function getAllCommandNames() {
    return Array.from(exports.SPL_COMMANDS_ENHANCED.keys());
}
//# sourceMappingURL=spl-commands-enhanced.js.map