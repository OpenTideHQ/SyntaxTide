# SyntaxTide - VS Code Extension for OpenTide Detection Rules

## Project Overview

SyntaxTide is a **VS Code extension** that provides:
1. **TextMate grammar-based syntax highlighting** for multiple query languages (KQL, SPL, CBC) embedded in OpenTide YAML detection rule files
2. **Language Server Protocol (LSP) implementation** for SPL queries with autocomplete, hover info, validation, and signature help

## Procedures

- When adding a significant new feature or query language, update this document with relevant instructions and architecture details.
- Also document in CHANGELOG.md and syntaxes/README.md as appropriate.
- When modifying LSP features, update src/README.md and tests/TESTING_GUIDE.md.

## Architecture: Grammar Injection Pattern

**Core Concept**: Inject query language grammars into YAML files based on configuration paths.

### Two-Grammar System (per language)

1. **Base Grammar** (`syntaxes/{lang}.tmLanguage.json`): Complete standalone grammar for the query language
2. **Injection Grammar** (`syntaxes/{lang}-injection.json`): YAML pattern matching + grammar injection

Example flow for KQL:
```yaml
configurations:
  sentinel:           # ← Injection detects this path
    query: |          # ← Injection detects block scalar
      SecurityEvent   # ← Base KQL grammar highlights this
      | where ...     # ← and this
```

### Injection Pattern Structure

All injection grammars follow this pattern:
```json
{
  "scopeName": "text.opentide.yaml.{lang}.injection",
  "injectionSelector": "L:source.yaml",
  "patterns": [
    { "include": "#system-configuration-block" }  // Detect configs.{system}:
  ],
  "repository": {
    "system-configuration-block": {
      "begin": "^(\\s*)(system_name)(\\s*)(:)\\s*$",  // Match system key
      "end": "^(?!\\1\\s+|\\s*$|\\s*#)",               // End when dedented
      "patterns": [
        { "include": "#query-block" }                  // Look for query: |
      ]
    },
    "query-block": {
      "begin": "^(\\s*)(query)(\\s*)(:)(\\s*)(\\|)\\s*$",  // Match query: |
      "end": "^(?!\\1\\s+|\\s*$)",
      "patterns": [
        { "include": "#query-content" }
      ]
    },
    "query-content": {
      "name": "meta.embedded.block.{lang}",  // ← Critical: embeddedLanguages key
      "patterns": [
        { "include": "source.{lang}" }        // ← Inject base grammar
      ]
    }
  }
}
```

## Development Workflow

### Workspace Extension Setup

**Critical**: Extension lives at root but loads via junction/symlink:
```
SyntaxTide/                         # ← All files here (package.json, syntaxes/, etc.)
├── .vscode/extensions/
│   └── syntaxtide/                 # ← Junction (Windows) or Symlink (Unix) pointing to root
```

**First time setup**:
```bash
# Windows (RECOMMENDED - uses junction which works better)
./setup-dev.bat

# Linux/Mac (uses symlink)
bash setup-dev.sh
```

**Important Notes:**
- **Windows users**: Use `setup-dev.bat` (creates junction with `mklink /J`)
- **Linux/Mac users**: Use `setup-dev.sh` (creates symlink)
- Git Bash on Windows has symlink issues - always use the .bat file on Windows
- You may need to run `setup-dev.bat` as Administrator on Windows

**After any change**: `Ctrl+Shift+P` → "Developer: Reload Window"

### Testing Changes

1. Edit grammar files in `syntaxes/`
2. Reload VS Code window
3. Open `tests/query-highlighting.yaml` to verify highlighting
4. Check VS Code Developer Tools (`Help` → `Toggle Developer Tools`) for scope inspection

## Adding a New Query Language

**Template** (use existing as reference):

1. **Base Grammar** (`syntaxes/newlang.tmLanguage.json`):
   - Start from official TextMate grammar if available
   - Or build from scratch using patterns for keywords, functions, operators, strings, comments
   - See `kql.tmLanguage.json` for comprehensive example

2. **Injection Grammar** (`syntaxes/newlang-injection.json`):
   - Copy `kql-injection.json` structure
   - Update system name in configuration-block pattern (e.g., `splunk`, `carbon_black_cloud`)
   - Change `meta.embedded.block.{newlang}` scope name
   - Include `source.{newlang}` for base grammar

3. **Register in `package.json`**:
   ```json
   "languages": [
     {
       "id": "newlang",
       "aliases": ["Display Name", "ABBR"],
       "extensions": [".ext"],
       "configuration": "./language-configuration.json"
     }
   ],
   "grammars": [
     {
       "language": "newlang",
       "scopeName": "source.newlang",
       "path": "./syntaxes/newlang.tmLanguage.json"
     },
     {
       "scopeName": "text.opentide.yaml.newlang.injection",
       "path": "./syntaxes/newlang-injection.json",
       "injectTo": ["source.yaml"],
       "embeddedLanguages": {
         "meta.embedded.block.newlang": "newlang"
       }
     }
   ]
   ```

4. **Test**: Add examples to `tests/query-highlighting.yaml`

## Key Conventions

- **Language IDs**: Lowercase, no spaces (kql, spl, cbc)
- **Scope Names**: `source.{lang}` for base, `text.opentide.yaml.{lang}.injection` for injection
- **Embedded Language Keys**: Must match injection grammar's `meta.embedded.block.{lang}` scope
- **System Names**: Match OpenTide YAML paths exactly (e.g., `sentinel`, `defender_for_endpoint`, `splunk`)
- **Block Scalars Only**: Injections only work with YAML `|` block scalars, not inline strings

## Reference Material Location

- Query language specs: `query-languages/{platform}/` (official docs, examples)
- Implementation notes: `syntaxes/README.md` (comprehensive architecture guide)
- Test cases: `tests/query-highlighting.yaml`

## Build & Package

```bash
npm run package    # Creates .vsix in root (requires @vscode/vsce)
npm run publish    # Publishes to marketplace (requires login)
```

**Files excluded from .vsix**: See `.vscodeignore` - dev docs, tests, query reference materials

## Language Server Protocol (LSP) Implementation

### Architecture

```
Extension (src/extension.ts)
    ↓ Starts LSP client
Language Client (vscode-languageclient)
    ↓ IPC Communication
Language Server (src/server.ts)
    ├─ YAML Parser (yaml package)
    ├─ SPL Validator
    ├─ Hover Provider
    ├─ Completion Provider
    └─ Signature Help Provider
    ↓ Uses
SPL Databases
    ├─ src/spl-commands-database.ts (64 commands)
    └─ src/spl-functions-database.ts (95+ functions)
```

### Database Structure

**SPL Commands Database** (`src/spl-commands-database.ts`):
- **64 commands** with full metadata (41 fully documented)
- Each command has: name, type, category, description, syntax, requiredArgs, optionalArgs, examples[], relatedCommands[]
- Helper function: `getSPLCommand(name: string)` for lookups
- Types: Generating, Transforming, Streaming

**SPL Functions Database** (`src/spl-functions-database.ts`):
- **95+ functions** across 13 categories
- Categories: Comparison & Conditional (13), Mathematical (12), Statistical (4), Text (10), Multivalue (12), Cryptographic (4), Date & Time (5), Conversion (6), Informational (9), etc.
- Each function has: name, category, description, signature, returnType, examples[], relatedFunctions[]

### LSP Features Implemented

1. **Autocomplete**: Context-aware suggestions (after `|`, in `eval`, in `where`)
2. **Hover Information**: Rich documentation for commands and functions
3. **Signature Help**: Parameter hints for functions
4. **Error Detection**: Real-time validation of SPL queries
5. **Completion Resolution**: Detailed documentation on selection

### Development Workflow for LSP

1. **Edit** database files or server.ts
2. **Compile**: `npm run compile` (or `npm run watch` for auto-compile)
3. **Reload**: `Ctrl+Shift+P` → "Developer: Reload Window"
4. **Test**: Open `tests/lsp-test.yaml` or `tests/query-highlighting.yaml`
5. **Verify**: Check autocomplete, hover, errors, signature help

### Adding SPL Commands

Edit `src/spl-commands-database.ts`:
```typescript
{
    name: 'commandname',
    type: 'Streaming',  // or 'Transforming', 'Generating'
    category: 'Data Processing',
    description: 'Full description from Splunk docs',
    syntax: 'commandname <arg1> [<optional-arg>]',
    requiredArgs: 1,
    optionalArgs: 1,
    examples: [
        '... | commandname field',
        '... | commandname field BY groupfield'
    ],
    relatedCommands: ['similar1', 'similar2']
}
```

### Adding SPL Functions

Edit `src/spl-functions-database.ts`:
```typescript
{
    name: 'funcname',
    category: 'Text',  // or appropriate category
    description: 'What the function does',
    signature: 'funcname(<param1>, <param2>)',
    returnType: 'string',  // or 'number', 'boolean', 'any'
    examples: ['funcname(field, "value")'],
    relatedFunctions: ['similar1', 'similar2']
}
```

### Testing LSP Changes

Use `tests/lsp-test.yaml` which has 11 comprehensive test scenarios:
1. Command autocomplete
2. Hover information
3. Function autocomplete
4. Function signature help
5. Multiple functions
6. Text functions
7. Multivalue functions
8. Statistical functions
9. Command pipelines
10. Complex pipelines
11. Error detection

See `tests/TESTING_GUIDE.md` for complete testing instructions.

### LSP Debugging

1. **Output Panel**: `View` → `Output` → "SyntaxTide Language Server"
2. **Console**: `Help` → `Toggle Developer Tools` → Console
3. **Add Logging**: Use `connection.console.log('message')` in server.ts
4. **Problems Panel**: `Ctrl+Shift+M` to see all diagnostics

### LSP Documentation

- **Developer Guide**: `src/README.md` - Architecture, features, development workflow
- **Testing Guide**: `tests/TESTING_GUIDE.md` - Comprehensive testing instructions
- **Database Source**: `query-languages/splunk/` - Official SPL documentation and analysis

## Common Pitfalls

### Grammar-Related
1. **Forgetting embeddedLanguages**: Injection won't work without the `embeddedLanguages` mapping in package.json
2. **Incorrect indentation regex**: `end` patterns must use `^(?!\\1\\s+|\\s*$)` to properly detect dedent
3. **Missing junction**: Extension won't load if `.vscode/extensions/syntaxtide` doesn't exist or isn't pointing to root
4. **Not reloading**: Grammar changes require window reload, not just file save
5. **Scope name typos**: `meta.embedded.block.{lang}` must match exactly between injection grammar and package.json

### LSP-Related
1. **Forgetting to compile**: LSP changes require `npm run compile` before testing
2. **Not reloading after compile**: Must reload VS Code window after compilation
3. **Type safety errors**: Use optional chaining `(cmd.examples || [])` and explicit types `(ex: string)`
4. **Missing exports**: Helper functions must be exported (e.g., `getSPLCommand`)
5. **Context detection**: LSP only works in `configurations.splunk.query: |` blocks, not inline strings
