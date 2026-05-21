#!/usr/bin/env python3
"""Script to add parameters field to commands in spl-commands-database.ts"""

commands_to_fix = [
    'appendpipe', 'arules', 'associate', 'autoregress', 'bin', 
    'bucket', 'bucketdir', 'chart', 'cluster', 'cofilter', 'collect', 'convert'
]

with open('src/spl-commands-database.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for cmd in commands_to_fix:
    param_name = cmd.upper() + '_PARAMS'
    
    # Find the command definition
    search_str = f"name: '{cmd}',"
    if search_str not in content:
        print(f"Warning: Could not find command '{cmd}'")
        continue
    
    # Find where to insert - after optionalArgs line
    idx = content.find(search_str)
    # Find the optionalArgs line after this command
    optional_args_start = content.find('optionalArgs:', idx)
    if optional_args_start == -1:
        optional_args_start = content.find('requiredArgs:', idx)
    
    if optional_args_start == -1:
        print(f"Warning: Could not find args for command '{cmd}'")
        continue
    
    # Find the end of the optionalArgs line
    line_end = content.find(',\n', optional_args_start)
    if line_end == -1:
        print(f"Warning: Could not find line end for '{cmd}'")
        continue
    
    # Check if parameters already exists
    next_line_start = line_end + 2
    next_line_end = content.find('\n', next_line_start)
    next_line = content[next_line_start:next_line_end]
    
    if 'parameters:' in next_line:
        print(f"Skipping '{cmd}' - already has parameters")
        continue
    
    # Insert the parameters line
    insertion_point = line_end + 2
    indent = '\t\t'
    new_line = f"{indent}parameters: PARAMS.{param_name},\n"
    
    content = content[:insertion_point] + new_line + content[insertion_point:]
    print(f"Added parameters to '{cmd}'")

# Write back
with open('src/spl-commands-database.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone! Run 'npm run compile' to check for errors.")
