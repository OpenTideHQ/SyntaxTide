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

import { SPL_COMMANDS, getSPLCommand } from './spl-commands-database';
import { SPL_FUNCTIONS } from './spl-functions-database';
import { getSPLCommandEnhanced } from './spl-commands-enhanced';
import { validateSPLLine } from './spl-validation';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Document-specific variable tracking
const documentVariables: Map<string, Set<string>> = new Map();

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
 */
function extractSPLQuery(yamlContent: any): { query: string; offset: number } | null {
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
					return { query: config.query, offset: 0 };
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
 * Extract user-defined variables from SPL query
 * Tracks variables from: eval, rename, rex (field extraction), stats (aggregations), spath
 */
function extractVariablesFromQuery(query: string): Set<string> {
	const variables = new Set<string>();
	const lines = query.split('\n');
	
	connection.console.log(`[Variable Extraction] Processing query with ${lines.length} lines`);
	
	for (const line of lines) {
		const trimmedLine = line.trim();
		
		// Skip comments and empty lines
		if (!trimmedLine || trimmedLine.startsWith('#')) {
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
					variables.add(fieldMatch[1]);
					connection.console.log(`[Variable] Found eval variable: ${fieldMatch[1]}`);
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
					variables.add(asMatch[1]);
					connection.console.log(`[Variable] Found rename variable: ${asMatch[1]}`);
				}
			}
		}
		
		// Extract from rex field extraction: rex field=_raw "(?<fieldname>pattern)"
		// Need to search the entire line for all named capture groups
		const rexNamedGroups = trimmedLine.matchAll(/\(\?<([a-zA-Z_][a-zA-Z0-9_]*)>/g);
		if (trimmedLine.includes('rex')) {
			for (const match of rexNamedGroups) {
				variables.add(match[1]);
				connection.console.log(`[Variable] Found rex variable: ${match[1]}`);
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
					variables.add(asMatch[1]);
					connection.console.log(`[Variable] Found stats variable: ${asMatch[1]}`);
				}
			}
		}
		
		// Extract from spath: spath output=newfield path=json.path
		const spathMatch = trimmedLine.match(/\|\s*spath\s+.*?output=([a-zA-Z_][a-zA-Z0-9_]*)/i);
		if (spathMatch) {
			variables.add(spathMatch[1]);
			connection.console.log(`[Variable] Found spath variable: ${spathMatch[1]}`);
		}
		
		// Extract from streamstats, eventstats (similar to stats)
		const streamstatsMatch = trimmedLine.match(/\|\s*(?:streamstats|eventstats)\s+(.+?)(?:\s+by\s+|$)/i);
		if (streamstatsMatch) {
			const statsContent = streamstatsMatch[1];
			const aggregations = statsContent.split(',');
			for (const agg of aggregations) {
				const asMatch = agg.match(/\s+(?:AS|as)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
				if (asMatch) {
					variables.add(asMatch[1]);
					connection.console.log(`[Variable] Found streamstats/eventstats variable: ${asMatch[1]}`);
				}
			}
		}
	}
	
	connection.console.log(`[Variable Extraction] Found ${variables.size} total variables: ${Array.from(variables).join(', ')}`);
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
		
		const extracted = extractSPLQuery(yamlDocs);
		
		if (!extracted) {
			// Not a relevant document, skip validation
			connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: [] });
			documentVariables.delete(textDocument.uri);
			return;
		}

		const query = extracted.query;
		
		// Extract and cache variables for this document
		const variables = extractVariablesFromQuery(query);
		documentVariables.set(textDocument.uri, variables);
		
		const lines = query.split('\n');

		// Use enhanced validation for each line
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const lineDiagnostics = validateSPLLine(line, i, textDocument.uri);
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

		// Get variables defined in current document
		const variables = documentVariables.get(document.uri) || new Set<string>();
		connection.console.log(`[Autocomplete] Document has ${variables.size} variables: ${Array.from(variables).join(', ')}`);

		// Suggest SPL commands after pipe operator
		if (beforeCursor.trim().endsWith('|') || beforeCursor.includes('|')) {
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

		// Always suggest user-defined variables (fields created by eval, rename, rex, stats, etc.)
		// These are valuable in any context: eval, where, stats BY, fields, etc.
		if (variables.size > 0) {
			connection.console.log(`[Autocomplete] Adding ${variables.size} variables to completion list`);
			variables.forEach((varName) => {
				completionItems.push({
					label: varName,
					kind: CompletionItemKind.Variable,
					data: -1, // Special marker for variables
					detail: 'User-defined field',
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
		// It's a command
		const cmd = SPL_COMMANDS[item.data];
		if (cmd) {
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

		// Check if it's a command
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
