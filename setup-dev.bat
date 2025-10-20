@echo off
REM Setup script to create junction for workspace extension (Windows)

REM Get the current directory (repository root)
set REPO_ROOT=%~dp0
REM Remove trailing backslash
set REPO_ROOT=%REPO_ROOT:~0,-1%

REM Create .vscode\extensions directory if it doesn't exist
if not exist "%REPO_ROOT%\.vscode\extensions" (
    mkdir "%REPO_ROOT%\.vscode\extensions"
)

REM Remove old junction/directory if it exists
if exist "%REPO_ROOT%\.vscode\extensions\syntaxtide" (
    echo Removing existing .vscode\extensions\syntaxtide...
    rmdir "%REPO_ROOT%\.vscode\extensions\syntaxtide" 2>nul
    rd /s /q "%REPO_ROOT%\.vscode\extensions\syntaxtide" 2>nul
)

REM Create junction (Windows directory junction - doesn't cause circular reference issues)
echo Creating junction...
echo   Source: %REPO_ROOT%
echo   Target: %REPO_ROOT%\.vscode\extensions\syntaxtide
mklink /J "%REPO_ROOT%\.vscode\extensions\syntaxtide" "%REPO_ROOT%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Junction created successfully!
    echo.
    echo The extension will now load automatically in VS Code!
    echo To reload VS Code and activate the extension, press Ctrl+Shift+P and run 'Developer: Reload Window'
) else (
    echo.
    echo [ERROR] Failed to create junction
    echo.
    echo You may need to run this script as Administrator
    echo Right-click on this file and select "Run as administrator"
)

pause
