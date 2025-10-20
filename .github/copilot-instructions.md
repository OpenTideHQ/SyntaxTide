# SyntaxTide - VS Code Extension for OpenTide Detection Rules

## Project Overview

SyntaxTide is a **pure TextMate grammar-based VS Code extension** that provides syntax highlighting for multiple query languages (KQL, SPL, CBC) embedded in OpenTide YAML detection rule files. No TypeScript code, no LSP - just grammar injection for context-aware highlighting.

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

**Critical**: Extension lives at root but loads via junction symlink:
```
SyntaxTide/                         # ← All files here (package.json, syntaxes/, etc.)
├── .vscode/extensions/
│   └── syntaxtide/                 # ← Junction pointing to ../../../
```

**First time setup**:
```bash
./setup-dev.bat        # Windows: creates junction
bash setup-dev.sh      # Unix: creates symlink
```

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

## Common Pitfalls

1. **Forgetting embeddedLanguages**: Injection won't work without the `embeddedLanguages` mapping in package.json
2. **Incorrect indentation regex**: `end` patterns must use `^(?!\\1\\s+|\\s*$)` to properly detect dedent
3. **Missing junction**: Extension won't load if `.vscode/extensions/syntaxtide` doesn't exist or isn't pointing to root
4. **Not reloading**: Grammar changes require window reload, not just file save
5. **Scope name typos**: `meta.embedded.block.{lang}` must match exactly between injection grammar and package.json
