# Development Guide

Complete guide for developing, packaging, and publishing the SyntaxTide extension.

## Project Structure

This repository uses a junction (symlink) to enable workspace extension development while keeping all files at the root level.

```
SyntaxTide/                      # Root - all extension files live here
├── package.json                 # Extension manifest
├── syntaxes/                    # Grammar files
├── language-configuration.json
├── .vscode/
│   └── extensions/
│       └── syntaxtide/          # Junction → points to root
└── ...
```

### Why This Approach?

✅ **Clean structure** - All extension files at root level  
✅ **Easy packaging** - Just run `npm run package` from root  
✅ **Auto-loads** - Extension loads automatically in workspace  
✅ **No nesting** - Avoid deep directory structures  
✅ **Git-friendly** - Junction is in `.gitignore`, won't be committed

---

## Initial Setup

### 1. Create the Junction (First Time Only)

Run the setup script to create the junction:

**Windows (Command Prompt/PowerShell):**
```cmd
setup-dev.bat
```

**Git Bash/Linux/Mac:**
```bash
bash setup-dev.sh
```

This creates a junction from `.vscode/extensions/syntaxtide` → root, allowing VS Code to load the extension automatically.

### 2. Reload VS Code

After setup:
1. `Ctrl+Shift+P` → "Developer: Reload Window"
2. Your extension will be active in this workspace
3. Edit files in the root, changes take effect after reload

### 3. Install vsce (For Packaging/Publishing)

```bash
npm install -g @vscode/vsce
```

---

## Development Workflow

### Option 1: Workspace Extension (Recommended)
- Extension automatically loads when you open the workspace
- Changes require reloading VS Code (`Ctrl+R` in Extension Development Host or `Ctrl+Shift+P` → "Reload Window")
- **Best for active development**

### Option 2: Debug with F5
- Press F5 to launch Extension Development Host
- Creates a new VS Code window with the extension loaded
- **Best for rapid testing and debugging**

### Making Changes

1. Edit grammar files in `syntaxes/` or update `package.json`
2. Reload VS Code to see changes
3. Test with files in the workspace (e.g., `test-highlighting.yaml`)

---

## Packaging for Distribution

From the root directory:

```bash
# Create a .vsix package
npm run package

# Or use vsce directly
vsce package
```

This creates: `opentide-query-syntax-0.1.0.vsix` in the root directory

### Local Installation from VSIX

**Via Command Line:**
```bash
code --install-extension opentide-query-syntax-0.1.0.vsix
```

**Via VS Code UI:**
1. Open Extensions view (`Ctrl+Shift+X`)
2. Click `...` menu → "Install from VSIX..."
3. Select the `.vsix` file

---

## Publishing to Marketplace

### One-Time Setup

1. **Create a Publisher** (if you don't have one):
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with Microsoft/GitHub
   - Create a publisher (must match the "publisher" field in package.json)
   - Create a Personal Access Token (PAT) from Azure DevOps
   - Run: `vsce login <publisher-name>`

### Publishing Commands

```bash
# Make sure you're logged in
vsce login opentide

# Publish current version
npm run publish

# Or publish with automatic version bump
vsce publish patch  # 0.1.0 -> 0.1.1
vsce publish minor  # 0.1.0 -> 0.2.0
vsce publish major  # 0.1.0 -> 1.0.0
```

### Pre-Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Test the packaged VSIX locally
- [ ] Ensure `README.md` has screenshots/examples
- [ ] Verify icon displays correctly
- [ ] Check that `.vscodeignore` excludes dev files
- [ ] Ensure repository URL is correct
- [ ] Test on a clean VS Code installation

---

## What Gets Included/Excluded

### ✅ Included in VSIX:
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `syntaxes/*.json`
- `language-configuration.json`
- `syntaxtide-icon.png`

### ❌ Excluded (via .vscodeignore):
- Test files (`test-highlighting.yaml`)
- Documentation files (except README/CHANGELOG)
- Development notes (DEVELOPMENT.md, PACKAGING.md, etc.)
- PDF files
- Internal analysis docs
- `.vscode/` directory (including the junction)

---

## Tips & Notes

### Development
- The junction is excluded from Git (see `.gitignore`)
- Run the setup script again if you delete `.vscode/extensions/`
- To remove the junction: just delete `.vscode/extensions/syntaxtide`
- Changes to grammar files require a reload to see effects

### Testing
- The workspace extension and marketplace extension can coexist
- VS Code prioritizes the workspace extension during development
- Remove workspace extension when testing the installed VSIX
- Use F5 debug mode for breakpoint debugging (if you add extension code)

### Publishing
- Always test the packaged VSIX before publishing
- Version numbers cannot be reused - publish increments are permanent
- Use `vsce package` first to inspect what will be published
- Keep CHANGELOG.md updated for users to track changes
