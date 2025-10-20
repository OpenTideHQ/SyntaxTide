#!/usr/bin/env python3
"""
Step 1: Read all command markdown files and store full content in COMMANDS.json
"""
import json
import os
from pathlib import Path

def main():
    docs_dir = Path("documentation/search-commands")
    commands = {}
    
    print("Reading all command markdown files...")
    print(f"{'Command':<30} {'Size (KB)':<10} {'Status'}")
    print("-" * 60)
    
    for md_file in sorted(docs_dir.glob("*.md")):
        command_name = md_file.stem
        
        # Skip the non-command file
        if command_name == '3rd-party-custom-commands':
            continue
        
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            commands[command_name] = content
            size_kb = len(content) / 1024
            print(f"{command_name:<30} {size_kb:>8.2f}  ✓")
            
        except Exception as e:
            print(f"{command_name:<30} {'ERROR':<10} ✗ {e}")
    
    # Save to COMMANDS.json
    output = {
        "schema_version": "1.0",
        "description": "Raw markdown content of all SPL search commands",
        "total_commands": len(commands),
        "commands": commands
    }
    
    output_file = "COMMANDS.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    total_size = sum(len(c) for c in commands.values()) / (1024 * 1024)
    print("=" * 60)
    print(f"✓ Processed {len(commands)} commands")
    print(f"✓ Total content size: {total_size:.2f} MB")
    print(f"✓ Saved to {output_file}")

if __name__ == "__main__":
    main()
