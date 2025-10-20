#!/bin/bash
# Setup script to create symlink for workspace extension

# Create .vscode/extensions directory if it doesn't exist
mkdir -p .vscode/extensions

# Remove old symlink/directory if it exists
if [ -L ".vscode/extensions/syntaxtide" ] || [ -d ".vscode/extensions/syntaxtide" ]; then
    echo "Removing existing .vscode/extensions/syntaxtide..."
    rm -rf .vscode/extensions/syntaxtide
fi

# Create symlink (Unix-style for Git Bash on Windows)
echo "Creating symlink..."
ln -s ../../ .vscode/extensions/syntaxtide

echo "✓ Symlink created: .vscode/extensions/syntaxtide -> root"
echo ""
echo "The extension will now load automatically in VS Code!"
echo "To reload VS Code and activate the extension, press Ctrl+Shift+P and run 'Developer: Reload Window'"
