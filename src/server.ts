/**
 * Comprehensive SPL Language Server for OpenTide Detection Rules
 * Provides intelligent autocomplete, hover info, validation, and signature help
 * Based on extensive SPL 10.0 documentation analysis
 */

import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Hover,
	SignatureHelp
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import * as yaml from 'yaml';

import { SPL_COMMANDS, getSPLCommand, ParameterDefinition, ParameterType } from './spl-commands-database';
import { SPL_FUNCTIONS } from './spl-functions-database';
import { getSPLCommandEnhanced } from './spl-commands-enhanced';
import { validateSPLLine, normalizeSPLQuery } from './spl-validation';
import { getSuggestedParameters, getParameterAtPosition } from './spl-parameter-parser';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Document-specific variable tracking
// Store user-defined variables per document for autocomplete
// Map of document URI -> Map of variable name -> declaration line number
const documentVariables: Map<string, Map<string, number>> = new Map();

// Create a simple text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;
	
	// Check client capabilities
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ['|', ' ', '(', ',']
			},
			hoverProvider: true,
			signatureHelpProvider: {
				triggerCharacters: ['(', ',']
			}
		}
	};
	
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

interface ExampleSettings {
	maxNumberOfProblems: number;
}

const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}
	documents.all().forEach(validateTextDocument);
});

documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
	documentVariables.delete(e.document.uri);
});

documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

/**
 * Extract SPL query from YAML configuration block
 * Handles both single and multi-document YAML files
 * Returns the query text and the line offset where it starts in the file
 */
function extractSPLQuery(yamlContent: any, fullText: string): { query: string; offset: number; indentChars: number } | null {
	try {
		// Handle array of documents (from parseAllDocuments)
		const documents = Array.isArray(yamlContent) ? yamlContent : [yamlContent];
		
		for (const doc of documents) {
			if (!doc || !doc.configurations) {
				continue;
			}
			
			// Check each platform configuration for SPL queries
			const platforms = ['splunk', 'splunk_enterprise_security'];
			
			for (const platform of platforms) {
				const config = doc.configurations[platform];
				if (config && config.query) {
					// Calculate the line offset by finding where "query: |" appears
					const queryPattern = new RegExp(`${platform}:\\s*\\n\\s*query:\\s*\\|`, 'i');
					const match = fullText.match(queryPattern);
					
					if (match) {
						// Count newlines up to the end of "query: |" to get the offset
						const matchEnd = (match.index || 0) + match[0].length;
						const offset = fullText.substring(0, matchEnd).split('\n').length;
						
						// Find the first non-empty query line to detect indentation
						const firstQueryLine = fullText.substring(matchEnd).split('\n')[1] || '';
						const indentChars = firstQueryLine.length - firstQueryLine.trimStart().length;
						
						connection.console.log(`[Offset] Found query block at line ${offset} for platform ${platform}, indent: ${indentChars} chars`);
						return { query: config.query, offset, indentChars };
					}
					
					// Fallback: count lines up to query content
					return { query: config.query, offset: 0, indentChars: 0 };
				}
			}
		}
	} catch (error) {
		// Silently ignore parsing errors
		connection.console.log(`Error extracting SPL query: ${error}`);
	}
	return null;
}

/**
 * Variable information with declaration line
 */
interface VariableInfo {
	name: string;
	line: number; // Line number where variable is declared (0-based)
}

/**
 * Extract user-defined variables from SPL query with line tracking
 * Tracks variables from: eval, rename, rex (field extraction), stats (aggregations), spath
 * Returns Map of variable name to declaration line
 */
function extractVariablesFromQuery(query: string): Map<string, number> {
	const variables = new Map<string, number>();
	const lines = query.split('\n');
	
	connection.console.log(`[Variable Extraction] Processing query with ${lines.length} lines`);
	
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex];
		const trimmedLine = line.trim();
		
		// Skip comments and empty lines (both YAML # and SPL ``` comments)
		if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('```')) {
			continue;
		}
		
		// Extract from eval: eval newfield = expression, field2 = expr2
		const evalMatch = trimmedLine.match(/\|\s*eval\s+(.+)/i);
		if (evalMatch) {
			const evalContent = evalMatch[1];
			// Match field assignments: fieldname = expression
			const assignments = evalContent.split(/,(?![^()]*\))/); // Split by comma not inside parentheses
			for (const assignment of assignments) {
				const fieldMatch = assignment.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
				if (fieldMatch) {
					variables.set(fieldMatch[1], lineIndex);
					connection.console.log(`[Variable] Found eval variable: ${fieldMatch[1]} at line ${lineIndex}`);
				}
			}
		}
		
		// Extract from rename: rename oldname AS newname, old2 AS new2
		const renameMatch = trimmedLine.match(/\|\s*rename\s+(.+)/i);
		if (renameMatch) {
			const renameContent = renameMatch[1];
			// Match: oldfield AS newfield patterns
			const renames = renameContent.split(',');
			for (const rename of renames) {
				const asMatch = rename.match(/\s+(?:AS|as)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
				if (asMatch) {
					variables.set(asMatch[1], lineIndex);
					connection.console.log(`[Variable] Found rename variable: ${asMatch[1]} at line ${lineIndex}`);
				}
			}
		}
		
		// Extract from rex field extraction: rex field=_raw "(?<fieldname>pattern)"
		// Need to search the entire line for all named capture groups
		const rexNamedGroups = trimmedLine.matchAll(/\(\?<([a-zA-Z_][a-zA-Z0-9_]*)>/g);
		if (trimmedLine.includes('rex')) {
			for (const match of rexNamedGroups) {
				variables.set(match[1], lineIndex);
				connection.console.log(`[Variable] Found rex variable: ${match[1]} at line ${lineIndex}`);
			}
		}
		
		// Extract from stats aggregations: stats count AS event_count, avg(bytes) AS avg_bytes
		const statsMatch = trimmedLine.match(/\|\s*stats\s+(.+?)(?:\s+by\s+|$)/i);
		if (statsMatch) {
			const statsContent = statsMatch[1];
			const aggregations = statsContent.split(',');
			for (const agg of aggregations) {
				const asMatch = agg.match(/\s+(?:AS|as)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
				if (asMatch) {
					variables.set(asMatch[1], lineIndex);
					connection.console.log(`[Variable] Found stats variable: ${asMatch[1]} at line ${lineIndex}`);
				}
			}
		}
		
		// Extract from spath: spath output=newfield path=json.path
		const spathMatch = trimmedLine.match(/\|\s*spath\s+.*?output=([a-zA-Z_][a-zA-Z0-9_]*)/i);
		if (spathMatch) {
			variables.set(spathMatch[1], lineIndex);
			connection.console.log(`[Variable] Found spath variable: ${spathMatch[1]} at line ${lineIndex}`);
		}
		
		// Extract from streamstats, eventstats (similar to stats)
		const streamstatsMatch = trimmedLine.match(/\|\s*(?:streamstats|eventstats)\s+(.+?)(?:\s+by\s+|$)/i);
		if (streamstatsMatch) {
			const statsContent = streamstatsMatch[1];
			const aggregations = statsContent.split(',');
			for (const agg of aggregations) {
				const asMatch = agg.match(/\s+(?:AS|as)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
				if (asMatch) {
					variables.set(asMatch[1], lineIndex);
					connection.console.log(`[Variable] Found streamstats/eventstats variable: ${asMatch[1]} at line ${lineIndex}`);
				}
			}
		}
	}
	
	connection.console.log(`[Variable Extraction] Found ${variables.size} total variables: ${Array.from(variables.keys()).join(', ')}`);
	return variables;
}

/**
 * Comprehensive validation for SPL queries
 */
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const text = textDocument.getText();
	const diagnostics: Diagnostic[] = [];

	try {
		// Handle multi-document YAML files (using --- separators)
		let yamlDocs;
		try {
			// Try parsing as multi-document first
			yamlDocs = yaml.parseAllDocuments(text).map(doc => doc.toJSON());
		} catch {
			// Fall back to single document parsing
			yamlDocs = [yaml.parse(text)];
		}
		
		const extracted = extractSPLQuery(yamlDocs, text);
		
		if (!extracted) {
			// Not a relevant document, skip validation
			connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: [] });
			documentVariables.delete(textDocument.uri);
			return;
		}

		const query = extracted.query;
		const lineOffset = extracted.offset;
		const charOffset = extracted.indentChars;
		connection.console.log(`[Validation] Query starts at line ${lineOffset}, character offset: ${charOffset}`);
		
		// Extract and cache variables for this document
		const variables = extractVariablesFromQuery(query);
		documentVariables.set(textDocument.uri, variables);
		
		const lines = query.split('\n');

		// Normalize multiline SPL query - merge continuation lines
		const normalizedCommands = normalizeSPLQuery(lines);
		connection.console.log(`[Validation] Normalized ${lines.length} lines into ${normalizedCommands.length} commands`);

		// Use enhanced validation for each normalized command
		for (const cmd of normalizedCommands) {
			const line = cmd.normalizedLine;
			const lineNum = cmd.originalLineNumber;
			
			// Build set of variables available at this line (declared before this line)
			const availableVariables = new Set<string>();
			for (const [varName, declLine] of variables.entries()) {
				if (declLine < lineNum) {
					availableVariables.add(varName);
				}
			}
			
			const adjustedLineNum = lineNum + lineOffset;
			connection.console.log(`[Line Calc] Query lineNum: ${lineNum}, lineOffset: ${lineOffset}, adjusted: ${adjustedLineNum}, charOffset: ${charOffset}`);
		
		// Pass the adjusted line number (query line + offset), character offset, and available variables
		const lineDiagnostics = validateSPLLine(
			line, 
			adjustedLineNum, 
			textDocument.uri, 
			charOffset, 
			availableVariables,
			(msg) => connection.console.log(msg) // Pass logger function
		);
		diagnostics.push(...lineDiagnostics);
		}
	} catch (error) {
		// YAML parsing errors are handled by the YAML extension
		connection.console.log(`Error validating document: ${error}`);
	}

	// Send the computed diagnostics to VS Code
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

/**
 * Comprehensive autocomplete with context awareness
 */
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) {
			return [];
		}

		const text = document.getText();
		const position = _textDocumentPosition.position;
		const line = text.split('\n')[position.line];
		const beforeCursor = line.substring(0, position.character);

		const completionItems: CompletionItem[] = [];

		// Get variables defined in current document before this line
		const allVariables = documentVariables.get(document.uri) || new Map<string, number>();
		const availableVariables = new Map<string, number>();
		
		// Extract SPL query to get the line offset
		let yamlDocs: any[];
		try {
			try {
				yamlDocs = yaml.parseAllDocuments(text).map(doc => doc.toJSON());
			} catch {
				yamlDocs = [yaml.parse(text)];
			}
			
			const extracted = extractSPLQuery(yamlDocs, text);
			
			if (extracted) {
				const lineOffset = extracted.offset;
				// Current line in the query (0-based, relative to query start)
				const currentQueryLine = position.line - lineOffset;
				
				connection.console.log(`[Autocomplete] Position line: ${position.line}, Query offset: ${lineOffset}, Current query line: ${currentQueryLine}`);
				
				// Only include variables declared before the current line in the query
				for (const [varName, declLine] of allVariables.entries()) {
					if (declLine < currentQueryLine) {
						availableVariables.set(varName, declLine);
						connection.console.log(`[Autocomplete] Including variable '${varName}' declared at query line ${declLine}`);
					} else {
						connection.console.log(`[Autocomplete] Excluding variable '${varName}' declared at query line ${declLine} (after current line ${currentQueryLine})`);
					}
				}
			} else {
				// Not in a query context, show all variables
				connection.console.log(`[Autocomplete] Not in SPL query context, showing all variables`);
				allVariables.forEach((declLine, varName) => {
					availableVariables.set(varName, declLine);
				});
			}
		} catch (error) {
			connection.console.log(`[Autocomplete] Error extracting query context: ${error}`);
			// Fallback: show all variables
			allVariables.forEach((declLine, varName) => {
				availableVariables.set(varName, declLine);
			});
		}
		
		connection.console.log(`[Autocomplete] Document has ${allVariables.size} total variables, ${availableVariables.size} available at position line ${position.line}`);

		// Check if we're after a pipe operator to suggest commands
		const afterPipe = beforeCursor.trim().endsWith('|') || 
		                  /\|\s*$/.test(beforeCursor) ||
		                  /\|\s+[a-z]*$/.test(beforeCursor); // Typing command name
		
		// Check if we're inside a command (after command name) to suggest parameters
		const pipeMatch = beforeCursor.match(/\|\s*([a-z]+)\s+/);
		
		if (pipeMatch) {
			// We're inside a command - suggest parameters
			const commandName = pipeMatch[1];
			const cmd = getSPLCommand(commandName);
			if (cmd && cmd.parameters && cmd.parameters.length > 0) {
				connection.console.log(`[Autocomplete] Suggesting parameters for command '${commandName}'`);
				
				// Get suggested parameters using the parameter parser
				const suggestedParams = getSuggestedParameters(beforeCursor, position.character, cmd.parameters);
				
				// Add parameter suggestions
				suggestedParams.forEach((param: ParameterDefinition) => {
					const isNamed = param.type === ParameterType.NAMED;
					const insertText = isNamed ? `${param.name}=` : param.name;
					
					completionItems.push({
						label: param.name,
						kind: isNamed ? CompletionItemKind.Property : CompletionItemKind.Field,
						insertText: insertText,
						detail: `${param.required ? 'Required' : 'Optional'} ${param.type}`,
						documentation: `${param.description}\n\nSyntax: ${param.syntax}${param.defaultValue ? `\nDefault: ${param.defaultValue}` : ''}`,
						sortText: param.required ? `0_${param.name}` : `1_${param.name}` // Required params first
					});
				});
			}
		}
		
		// Suggest SPL commands after pipe operator
		if (afterPipe) {
			SPL_COMMANDS.forEach((cmd, index) => {
				completionItems.push({
					label: cmd.name,
					kind: CompletionItemKind.Function,
					data: index,
					detail: `${cmd.type} - ${cmd.category}`,
					documentation: cmd.description
				});
			});
		}

		// Suggest functions in eval/where context
		if (beforeCursor.includes('eval') || beforeCursor.includes('where')) {
			SPL_FUNCTIONS.forEach((func, index) => {
				completionItems.push({
					label: func.name,
					kind: CompletionItemKind.Method,
					data: 1000 + index,
					detail: `${func.category} function`,
					documentation: `${func.description}\n\nSignature: ${func.signature}`
				});
			});
		}

		// Suggest user-defined variables that were declared before current line
		// These are valuable in any context: eval, where, stats BY, fields, etc.
		if (availableVariables.size > 0) {
			connection.console.log(`[Autocomplete] Adding ${availableVariables.size} variables to completion list`);
			availableVariables.forEach((declLine, varName) => {
				completionItems.push({
					label: varName,
					kind: CompletionItemKind.Variable,
					data: -1, // Special marker for variables
					detail: `User-defined field (query line ${declLine + 1})`,
					documentation: `Field defined in this query via eval, rename, rex, stats, or spath`,
					sortText: `0_${varName}` // Sort variables to top of suggestions
				});
			});
		}

		connection.console.log(`[Autocomplete] Returning ${completionItems.length} total completion items`);
		return completionItems;
	}
);

/**
 * Enhanced completion item resolve with full details
 */
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === -1) {
		// It's a user-defined variable - already has full info
		return item;
	} else if (item.data < 1000) {
		// It's a command - use enhanced database if available
		const cmd = SPL_COMMANDS[item.data];
		if (cmd) {
			const cmdEnhanced = getSPLCommandEnhanced(cmd.name);
			
			if (cmdEnhanced) {
				const reqArgs = cmdEnhanced.requiredArgs.length > 0 
					? ['', '**Required Arguments:**', ...cmdEnhanced.requiredArgs.map(arg => 
						`- \`${arg.name}\` (${arg.type}): ${arg.description}`
					  )]
					: [];
				
				const optArgs = cmdEnhanced.optionalArgs.length > 0
					? ['', '**Optional Arguments:**', ...cmdEnhanced.optionalArgs.map(arg =>
						`- \`${arg.name}\` (${arg.type}): ${arg.description}${arg.default ? ` [default: ${arg.default}]` : ''}`
					  )]
					: [];
				
				item.detail = `${cmdEnhanced.type} - ${cmdEnhanced.category}`;
				item.documentation = {
					kind: 'markdown',
					value: [
						`**${cmdEnhanced.name}**`,
						'',
						cmdEnhanced.description,
						'',
						'**Syntax:**',
						'```spl',
						cmdEnhanced.syntax,
						'```',
						...reqArgs,
						...optArgs,
						'',
						...(cmdEnhanced.examples && cmdEnhanced.examples.length > 0
							? ['**Examples:**', ...cmdEnhanced.examples.map((ex: string) => `\`\`\`spl\n${ex}\n\`\`\``)]
							: []),
						'',
						...(cmdEnhanced.relatedCommands && cmdEnhanced.relatedCommands.length > 0
							? [`**Related Commands:** ${cmdEnhanced.relatedCommands.join(', ')}`]
							: [])
					].join('\n')
				};
			} else {
				// Fallback to basic command database
				item.detail = `${cmd.type} - ${cmd.category}`;
				item.documentation = {
					kind: 'markdown',
					value: [
						`**${cmd.name}**`,
						'',
						cmd.description,
						'',
						'**Syntax:**',
						'```spl',
						cmd.syntax,
						'```',
						'',
						'**Examples:**',
						...(cmd.examples || []).map((ex: string) => `\`\`\`spl\n${ex}\n\`\`\``),
						'',
						`**Related Commands:** ${(cmd.relatedCommands || []).join(', ')}`
					].join('\n')
				};
			}
		}
	} else {
		// It's a function
		const func = SPL_FUNCTIONS[item.data - 1000];
		if (func) {
			item.detail = `${func.category} function - Returns ${func.returnType}`;
			item.documentation = {
				kind: 'markdown',
				value: [
					`**${func.name}** - ${func.description}`,
					'',
					'**Signature:**',
					'```spl',
					func.signature,
					'```',
					'',
					`**Returns:** ${func.returnType}`,
					'',
					...(func.examples ? ['**Examples:**', ...func.examples.map(ex => `\`\`\`spl\n${ex}\n\`\`\``)] : []),
					'',
					...(func.relatedFunctions && func.relatedFunctions.length > 0 
						? [`**Related Functions:** ${func.relatedFunctions.join(', ')}`] 
						: [])
				].join('\n')
			};
		}
	}
	return item;
});

/**
 * Comprehensive hover information
 */
connection.onHover(
	(_textDocumentPosition: TextDocumentPositionParams): Hover | null => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) {
			return null;
		}

		const text = document.getText();
		const position = _textDocumentPosition.position;
		const lines = text.split('\n');
		const line = lines[position.line];

		const wordRange = getWordRangeAtPosition(line, position.character);
		if (!wordRange) {
			return null;
		}

		const word = line.substring(wordRange.start, wordRange.end);
		
		// Check if we're hovering over a parameter in a command
		const pipeMatch = line.match(/\|\s*([a-z]+)\s+/);
		if (pipeMatch) {
			const commandName = pipeMatch[1];
			const cmd = getSPLCommand(commandName);
			if (cmd && cmd.parameters && cmd.parameters.length > 0) {
				// Find the parameter at this position
				const commandStart = line.indexOf(commandName);
				const afterCommand = line.substring(commandStart + commandName.length);
				const param = getParameterAtPosition(afterCommand, position.character - (commandStart + commandName.length), cmd.parameters);
				
				if (param && param.definition) {
					const def = param.definition;
					return {
						contents: {
							kind: 'markdown',
							value: [
								`**${def.name}** - ${def.required ? 'Required' : 'Optional'} ${def.type} parameter`,
								'',
								def.description,
								'',
								'**Syntax:**',
								'```spl',
								def.syntax,
								'```',
								...(def.defaultValue ? ['', `**Default:** \`${def.defaultValue}\``] : []),
								...(def.valueType ? ['', `**Type:** \`${def.valueType}\``] : []),
								...(def.examples && def.examples.length > 0 ? [
									'',
									'**Examples:**',
									...def.examples.map(ex => `- \`${ex}\``)
								] : [])
							].join('\n')
						}
					};
				}
			}
		}

		// Check if it's a user-defined variable
		const variables = documentVariables.get(document.uri) || new Set<string>();
		if (variables.has(word)) {
			return {
				contents: {
					kind: 'markdown',
					value: [
						`**${word}** - User-defined field`,
						'',
						'This field was created in this query using one of:',
						'- `eval` command',
						'- `rename` command',
						'- `rex` field extraction',
						'- `stats` aggregation',
						'- `spath` JSON extraction',
						'- `streamstats` or `eventstats` aggregation'
					].join('\n')
				}
			};
		}

		// Check if it's a command - use enhanced database for better info
		const cmdEnhanced = getSPLCommandEnhanced(word);
		if (cmdEnhanced) {
			const reqArgs = cmdEnhanced.requiredArgs.length > 0 
				? ['', '**Required Arguments:**', ...cmdEnhanced.requiredArgs.map(arg => 
					`- \`${arg.name}\` (${arg.type}): ${arg.description}`
				  )]
				: [];
			
			const optArgs = cmdEnhanced.optionalArgs.length > 0
				? ['', '**Optional Arguments:**', ...cmdEnhanced.optionalArgs.map(arg =>
					`- \`${arg.name}\` (${arg.type}): ${arg.description}${arg.default ? ` [default: ${arg.default}]` : ''}`
				  )]
				: [];
			
			return {
				contents: {
					kind: 'markdown',
					value: [
						`**${cmdEnhanced.name}** (${cmdEnhanced.type})`,
						'',
						cmdEnhanced.description,
						'',
						'**Syntax:**',
						'```spl',
						cmdEnhanced.syntax,
						'```',
						...reqArgs,
						...optArgs,
						'',
						'**Category:** ' + cmdEnhanced.category,
						'',
						...(cmdEnhanced.examples && cmdEnhanced.examples.length > 0
							? ['**Examples:**', ...cmdEnhanced.examples.map((ex: string) => `\`\`\`spl\n${ex}\n\`\`\``)]
							: []),
						'',
						...(cmdEnhanced.relatedCommands && cmdEnhanced.relatedCommands.length > 0
							? [`**Related Commands:** ${cmdEnhanced.relatedCommands.join(', ')}`]
							: [])
					].join('\n')
				}
			};
		}
		
		// Fallback to basic command database
		const cmd = getSPLCommand(word);
		if (cmd) {
			return {
				contents: {
					kind: 'markdown',
					value: [
						`**${cmd.name}** (${cmd.type})`,
						'',
						cmd.description,
						'',
						'**Syntax:**',
						'```spl',
						cmd.syntax,
						'```',
						'',
						'**Category:** ' + cmd.category,
						'',
						'**Examples:**',
						...(cmd.examples || []).map((ex: string) => `\`\`\`spl\n${ex}\n\`\`\``),
						'',
						...(cmd.relatedCommands && cmd.relatedCommands.length > 0
							? [`**Related Commands:** ${cmd.relatedCommands.join(', ')}`]
							: [])
					].join('\n')
				}
			};
		}

		// Check if it's a function
		const func = SPL_FUNCTIONS.find(f => f.name.toLowerCase() === word.toLowerCase());
		if (func) {
			return {
				contents: {
					kind: 'markdown',
					value: [
						`**${func.name}()** - ${func.category}`,
						'',
						func.description,
						'',
						'**Signature:**',
						'```spl',
						func.signature,
						'```',
						'',
						`**Returns:** ${func.returnType}`,
						'',
						...(func.examples ? ['**Examples:**', ...func.examples.map(ex => `\`\`\`spl\n${ex}\n\`\`\``)] : []),
						'',
						...(func.relatedFunctions && func.relatedFunctions.length > 0
							? [`**See also:** ${func.relatedFunctions.join(', ')}`]
							: [])
					].join('\n')
				}
			};
		}

		return null;
	}
);

/**
 * Signature help for functions
 */
connection.onSignatureHelp(
	(_textDocumentPosition: TextDocumentPositionParams): SignatureHelp | null => {
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		if (!document) {
			return null;
		}

		const text = document.getText();
		const position = _textDocumentPosition.position;
		const line = text.split('\n')[position.line];
		const beforeCursor = line.substring(0, position.character);

		// Find the function call we're in
		const match = beforeCursor.match(/(\w+)\s*\([^)]*$/);
		if (!match) {
			return null;
		}

		const functionName = match[1];
		const func = SPL_FUNCTIONS.find(f => 
			f.name.toLowerCase() === functionName.toLowerCase()
		);

		if (!func) {
			return null;
		}

		// Count which parameter we're on (by commas)
		const params = beforeCursor.substring(beforeCursor.lastIndexOf('(') + 1);
		const activeParameter = (params.match(/,/g) || []).length;

		// Parse function signature for parameters
		const sigMatch = func.signature.match(/\(([^)]*)\)/);
		const parameterStrings = sigMatch 
			? sigMatch[1].split(',').map(p => p.trim()) 
			: [];

		return {
			signatures: [
				{
					label: func.signature,
					documentation: {
						kind: 'markdown',
						value: func.description
					},
					parameters: parameterStrings.map(param => ({
						label: param,
						documentation: ''
					}))
				}
			],
			activeSignature: 0,
			activeParameter: Math.min(activeParameter, parameterStrings.length - 1)
		};
	}
);

/**
 * Get word range at position for hover detection
 */
function getWordRangeAtPosition(
	line: string,
	character: number
): { start: number; end: number } | null {
	const wordPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
	let match;
	
	while ((match = wordPattern.exec(line)) !== null) {
		if (match.index <= character && character <= match.index + match[0].length) {
			return {
				start: match.index,
				end: match.index + match[0].length
			};
		}
	}
	
	return null;
}

// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
connection.listen();
