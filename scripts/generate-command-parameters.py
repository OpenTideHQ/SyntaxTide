#!/usr/bin/env python3
"""
Generate enhanced SPL command parameter definitions from COMMANDS_ANALYSIS.json
This script parses command syntax and argument metadata to create detailed ParameterDefinition objects
"""

import json
import re
from typing import Dict, List, Any

def classify_parameter_type(syntax: str, name: str) -> str:
    """Determine the parameter type based on syntax patterns"""
    # Named parameters with = syntax
    if '=' in syntax and not syntax.startswith('<'):
        return 'NAMED'
    
    # Clause keywords (uppercase, no angle brackets)
    if syntax.isupper() and '<' not in syntax:
        return 'CLAUSE'
    
    # Field lists or multiple values
    if 'field-list' in name.lower() or 'wc-field' in syntax.lower() or '...' in syntax:
        return 'MULTI_VALUE'
    
    # Pure field reference
    if syntax == '<field>' or syntax == '<string>' or '<field>' in syntax:
        return 'FIELD'
    
    # Positional with specific types
    if syntax.startswith('<') and syntax.endswith('>'):
        return 'POSITIONAL'
    
    # Default to positional for complex expressions
    return 'POSITIONAL'

def extract_value_type(syntax: str) -> str:
    """Extract the value type from syntax (e.g., <int>, <bool>, <field>)"""
    # Match content inside angle brackets
    match = re.search(r'<([^>]+)>', syntax)
    if match:
        return match.group(1)
    
    # Match pipe-separated options (e.g., top | bottom)
    if '|' in syntax and '=' not in syntax:
        options = [opt.strip() for opt in syntax.split('|')]
        return ' | '.join(options)
    
    return 'string'

def parse_parameter(arg: Dict[str, Any], required: bool) -> Dict[str, Any]:
    """Parse a single parameter from required_args or optional_args"""
    name = arg.get('name', '')
    syntax = arg.get('syntax', '')
    description = arg.get('description', '')
    default = arg.get('default')
    
    param_type = classify_parameter_type(syntax, name)
    value_type = extract_value_type(syntax)
    
    param_def = {
        'name': name,
        'type': f'ParameterType.{param_type}',
        'required': required,
        'syntax': syntax,
        'description': description,
        'valueType': value_type
    }
    
    if default:
        param_def['defaultValue'] = default
    
    return param_def

def generate_command_parameters(commands_data: Dict[str, Any]) -> str:
    """Generate TypeScript parameter definitions for all commands"""
    
    output_lines = []
    
    for cmd_name, cmd_data in sorted(commands_data.items()):
        params = []
        
        # Process required arguments
        for arg in cmd_data.get('required_args', []):
            params.append(parse_parameter(arg, required=True))
        
        # Process optional arguments
        for arg in cmd_data.get('optional_args', []):
            params.append(parse_parameter(arg, required=False))
        
        if params:
            output_lines.append(f"// {cmd_name} command parameters")
            output_lines.append(f"export const {cmd_name.upper()}_PARAMS: ParameterDefinition[] = [")
            
            for param in params:
                output_lines.append("\t{")
                output_lines.append(f"\t\tname: '{param['name']}',")
                output_lines.append(f"\t\ttype: {param['type']},")
                output_lines.append(f"\t\trequired: {str(param['required']).lower()},")
                output_lines.append(f"\t\tsyntax: '{param['syntax']}',")
                output_lines.append(f"\t\tdescription: `{param['description']}`,")
                
                # Add valueType with comma if there's a default value, otherwise without
                if 'defaultValue' in param:
                    output_lines.append(f"\t\tvalueType: '{param['valueType']}',")
                    output_lines.append(f"\t\tdefaultValue: '{param['defaultValue']}'")
                else:
                    output_lines.append(f"\t\tvalueType: '{param['valueType']}'")
                
                output_lines.append("\t},")
            
            output_lines.append("];")
            output_lines.append("")
    
    return '\n'.join(output_lines)

def main():
    # Load the commands analysis
    with open('../query-languages/splunk/COMMANDS_ANALYSIS.json', 'r', encoding='utf-8') as f:
        commands_data = json.load(f)
    
    print(f"Loaded {len(commands_data)} commands from COMMANDS_ANALYSIS.json")
    
    # Generate parameter definitions
    param_defs = generate_command_parameters(commands_data)
    
    # Write to output file
    output_path = 'command-parameters-generated.ts'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("/**\n")
        f.write(" * Auto-generated SPL Command Parameter Definitions\n")
        f.write(" * Generated from COMMANDS_ANALYSIS.json\n")
        f.write(" * DO NOT EDIT MANUALLY - Run generate-command-parameters.py to regenerate\n")
        f.write(" */\n\n")
        f.write("import { ParameterDefinition, ParameterType } from './spl-parameter-types';\n\n")
        f.write(param_defs)
    
    print(f"Generated parameter definitions written to {output_path}")
    print(f"Total commands processed: {len(commands_data)}")

if __name__ == '__main__':
    main()
