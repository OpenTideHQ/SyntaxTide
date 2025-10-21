"use strict";
/**
 * Comprehensive SPL Language Server for OpenTide Detection Rules
 * Provides intelligent autocomplete, hover info, validation, and signature help
 * Based on extensive SPL 10.0 documentation analysis
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const yaml = __importStar(require("yaml"));
const spl_commands_database_1 = require("./spl-commands-database");
const spl_functions_database_1 = require("./spl-functions-database");
const spl_commands_enhanced_1 = require("./spl-commands-enhanced");
const spl_validation_1 = require("./spl-validation");
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Document-specific variable tracking
const documentVariables = new Map();
// Create a simple text document manager
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Check client capabilities
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
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
function extractSPLQuery(yamlContent) {
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
    }
    catch (error) {
        // Silently ignore parsing errors
        connection.console.log(`Error extracting SPL query: ${error}`);
    }
    return null;
}
/**
 * Extract user-defined variables from SPL query
 * Tracks variables from: eval, rename, rex (field extraction), stats (aggregations), spath
 */
function extractVariablesFromQuery(query) {
    const variables = new Set();
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
async function validateTextDocument(textDocument) {
    const text = textDocument.getText();
    const diagnostics = [];
    try {
        // Handle multi-document YAML files (using --- separators)
        let yamlDocs;
        try {
            // Try parsing as multi-document first
            yamlDocs = yaml.parseAllDocuments(text).map(doc => doc.toJSON());
        }
        catch {
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
            const lineDiagnostics = (0, spl_validation_1.validateSPLLine)(line, i, textDocument.uri);
            diagnostics.push(...lineDiagnostics);
        }
    }
    catch (error) {
        // YAML parsing errors are handled by the YAML extension
        connection.console.log(`Error validating document: ${error}`);
    }
    // Send the computed diagnostics to VS Code
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
/**
 * Comprehensive autocomplete with context awareness
 */
connection.onCompletion((_textDocumentPosition) => {
    const document = documents.get(_textDocumentPosition.textDocument.uri);
    if (!document) {
        return [];
    }
    const text = document.getText();
    const position = _textDocumentPosition.position;
    const line = text.split('\n')[position.line];
    const beforeCursor = line.substring(0, position.character);
    const completionItems = [];
    // Get variables defined in current document
    const variables = documentVariables.get(document.uri) || new Set();
    connection.console.log(`[Autocomplete] Document has ${variables.size} variables: ${Array.from(variables).join(', ')}`);
    // Suggest SPL commands after pipe operator
    if (beforeCursor.trim().endsWith('|') || beforeCursor.includes('|')) {
        spl_commands_database_1.SPL_COMMANDS.forEach((cmd, index) => {
            completionItems.push({
                label: cmd.name,
                kind: node_1.CompletionItemKind.Function,
                data: index,
                detail: `${cmd.type} - ${cmd.category}`,
                documentation: cmd.description
            });
        });
    }
    // Suggest functions in eval/where context
    if (beforeCursor.includes('eval') || beforeCursor.includes('where')) {
        spl_functions_database_1.SPL_FUNCTIONS.forEach((func, index) => {
            completionItems.push({
                label: func.name,
                kind: node_1.CompletionItemKind.Method,
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
                kind: node_1.CompletionItemKind.Variable,
                data: -1, // Special marker for variables
                detail: 'User-defined field',
                documentation: `Field defined in this query via eval, rename, rex, stats, or spath`,
                sortText: `0_${varName}` // Sort variables to top of suggestions
            });
        });
    }
    connection.console.log(`[Autocomplete] Returning ${completionItems.length} total completion items`);
    return completionItems;
});
/**
 * Enhanced completion item resolve with full details
 */
connection.onCompletionResolve((item) => {
    if (item.data === -1) {
        // It's a user-defined variable - already has full info
        return item;
    }
    else if (item.data < 1000) {
        // It's a command - use enhanced database if available
        const cmd = spl_commands_database_1.SPL_COMMANDS[item.data];
        if (cmd) {
            const cmdEnhanced = (0, spl_commands_enhanced_1.getSPLCommandEnhanced)(cmd.name);
            if (cmdEnhanced) {
                const reqArgs = cmdEnhanced.requiredArgs.length > 0
                    ? ['', '**Required Arguments:**', ...cmdEnhanced.requiredArgs.map(arg => `- \`${arg.name}\` (${arg.type}): ${arg.description}`)]
                    : [];
                const optArgs = cmdEnhanced.optionalArgs.length > 0
                    ? ['', '**Optional Arguments:**', ...cmdEnhanced.optionalArgs.map(arg => `- \`${arg.name}\` (${arg.type}): ${arg.description}${arg.default ? ` [default: ${arg.default}]` : ''}`)]
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
                            ? ['**Examples:**', ...cmdEnhanced.examples.map((ex) => `\`\`\`spl\n${ex}\n\`\`\``)]
                            : []),
                        '',
                        ...(cmdEnhanced.relatedCommands && cmdEnhanced.relatedCommands.length > 0
                            ? [`**Related Commands:** ${cmdEnhanced.relatedCommands.join(', ')}`]
                            : [])
                    ].join('\n')
                };
            }
            else {
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
                        ...(cmd.examples || []).map((ex) => `\`\`\`spl\n${ex}\n\`\`\``),
                        '',
                        `**Related Commands:** ${(cmd.relatedCommands || []).join(', ')}`
                    ].join('\n')
                };
            }
        }
    }
    else {
        // It's a function
        const func = spl_functions_database_1.SPL_FUNCTIONS[item.data - 1000];
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
connection.onHover((_textDocumentPosition) => {
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
    const variables = documentVariables.get(document.uri) || new Set();
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
    const cmdEnhanced = (0, spl_commands_enhanced_1.getSPLCommandEnhanced)(word);
    if (cmdEnhanced) {
        const reqArgs = cmdEnhanced.requiredArgs.length > 0
            ? ['', '**Required Arguments:**', ...cmdEnhanced.requiredArgs.map(arg => `- \`${arg.name}\` (${arg.type}): ${arg.description}`)]
            : [];
        const optArgs = cmdEnhanced.optionalArgs.length > 0
            ? ['', '**Optional Arguments:**', ...cmdEnhanced.optionalArgs.map(arg => `- \`${arg.name}\` (${arg.type}): ${arg.description}${arg.default ? ` [default: ${arg.default}]` : ''}`)]
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
                        ? ['**Examples:**', ...cmdEnhanced.examples.map((ex) => `\`\`\`spl\n${ex}\n\`\`\``)]
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
    const cmd = (0, spl_commands_database_1.getSPLCommand)(word);
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
                    ...(cmd.examples || []).map((ex) => `\`\`\`spl\n${ex}\n\`\`\``),
                    '',
                    ...(cmd.relatedCommands && cmd.relatedCommands.length > 0
                        ? [`**Related Commands:** ${cmd.relatedCommands.join(', ')}`]
                        : [])
                ].join('\n')
            }
        };
    }
    // Check if it's a function
    const func = spl_functions_database_1.SPL_FUNCTIONS.find(f => f.name.toLowerCase() === word.toLowerCase());
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
});
/**
 * Signature help for functions
 */
connection.onSignatureHelp((_textDocumentPosition) => {
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
    const func = spl_functions_database_1.SPL_FUNCTIONS.find(f => f.name.toLowerCase() === functionName.toLowerCase());
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
});
/**
 * Get word range at position for hover detection
 */
function getWordRangeAtPosition(line, character) {
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
//# sourceMappingURL=server.js.map