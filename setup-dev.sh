#!/bin/bash
# Setup script to create symlink for workspace extension
#
# NOTE FOR WINDOWS USERS:
# ========================
# If you're on Windows, use setup-dev.bat instead!
# Windows junctions work better than symlinks for this use case.
#
# Git Bash on Windows has issues with symlinks that point to parent
# directories containing the symlink itself (circular reference issue).
#
# The .bat file uses 'mklink /J' which creates a proper junction without
# the circular reference problem.

# Get the absolute path to the repository root
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  SyntaxTide Development Setup (Linux/Mac)"
echo "============================================"
echo ""
echo "NOTE: If you're on Windows, please use setup-dev.bat instead!"
echo ""
read -p "Continue with Unix symlink setup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled. Use setup-dev.bat on Windows."
    exit 0
fi

# Create .vscode/extensions directory if it doesn't exist
mkdir -p "$REPO_ROOT/.vscode/extensions"

# Remove old symlink/directory if it exists
if [ -L "$REPO_ROOT/.vscode/extensions/syntaxtide" ] || [ -d "$REPO_ROOT/.vscode/extensions/syntaxtide" ]; then
    echo "Removing existing .vscode/extensions/syntaxtide..."
    rm -rf "$REPO_ROOT/.vscode/extensions/syntaxtide"
fi

# Create symlink using absolute path
echo "Creating symlink..."
echo "  Source: $REPO_ROOT"
echo "  Target: $REPO_ROOT/.vscode/extensions/syntaxtide"
ln -s "$REPO_ROOT" "$REPO_ROOT/.vscode/extensions/syntaxtide"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Symlink created successfully!"
    echo ""
    echo "The extension will now load automatically in VS Code!"
    echo "To reload VS Code and activate the extension, press Ctrl+Shift+P and run 'Developer: Reload Window'"
else
    echo ""
    echo "✗ Failed to create symlink"
    echo ""
    echo "Alternative: You can manually copy the files to .vscode/extensions/syntaxtide/"
fi
