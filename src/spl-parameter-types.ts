/**
 * SPL Command Parameter Type Definitions
 * Shared types used by both spl-commands-database and spl-command-parameters
 * This file exists to avoid circular dependencies
 */

/**
 * Parameter type classification for SPL command arguments
 */
export enum ParameterType {
	/** Named parameter with key=value syntax (e.g., maxlines=10) */
	NAMED = 'named',
	/** Positional parameter that must appear in specific order (e.g., <field>) */
	POSITIONAL = 'positional',
	/** Field reference that doesn't use key=value syntax */
	FIELD = 'field',
	/** Clause keyword (e.g., AS, BY, OVER, WHERE) */
	CLAUSE = 'clause',
	/** Multiple values allowed (e.g., field list) */
	MULTI_VALUE = 'multi_value'
}

/**
 * Detailed parameter definition for SPL command arguments
 */
export interface ParameterDefinition {
	/** Parameter name (without angle brackets or syntax markers) */
	name: string;
	/** Type of parameter (named, positional, field, clause, etc.) */
	type: ParameterType;
	/** Whether this parameter is required */
	required: boolean;
	/** Full syntax representation (e.g., "maxlines=<int>", "<field>", "AS <newfield>") */
	syntax: string;
	/** Human-readable description of what this parameter does */
	description: string;
	/** Default value if not specified */
	defaultValue?: string;
	/** Valid values or pattern (e.g., "<int>", "<bool>", "<field>", "top | bottom") */
	valueType?: string;
	/** Example values for this parameter */
	examples?: string[];
}
