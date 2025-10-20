/**
 * Comprehensive SPL Functions Database
 * Source: Splunk SPL 10.0 Reference - 170+ evaluation functions analyzed
 * Categories: Comparison, Mathematical, Statistical, Text, Multivalue, JSON, Date/Time, Cryptographic, etc.
 */

export interface SPLFunction {
	name: string;
	category: string;
	description: string;
	signature: string;
	returnType: string;
	examples?: string[];
	relatedFunctions?: string[];
}

export const SPL_FUNCTIONS: SPLFunction[] = [
	// Comparison & Conditional Functions
	{
		name: 'case',
		category: 'Comparison & Conditional',
		description: 'Returns the first value for which the condition evaluates to true. Similar to switch/case statements in other languages.',
		signature: 'case(<condition>, <value>, ...)',
		returnType: 'any',
		examples: [
			'case(status==200, "OK", status==404, "Not Found", status==500, "Error", true(), "Unknown")',
			'case(value > 100, "high", value > 50, "medium", 1=1, "low")'
		],
		relatedFunctions: ['if', 'validate']
	},
	{
		name: 'cidrmatch',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE if an IP address matches the CIDR notation subnet.',
		signature: 'cidrmatch(<cidr>, <ip>)',
		returnType: 'boolean',
		examples: [
			'cidrmatch("192.168.0.0/16", ip)',
			'cidrmatch("10.0.0.0/8", src_ip)'
		],
		relatedFunctions: ['match', 'like']
	},
	{
		name: 'coalesce',
		category: 'Comparison & Conditional',
		description: 'Returns the first value that is not null.',
		signature: 'coalesce(<values>...)',
		returnType: 'any',
		examples: [
			'coalesce(field1, field2, "default")',
			'coalesce(username, email, "unknown")'
		],
		relatedFunctions: ['if', 'nullif']
	},
	{
		name: 'if',
		category: 'Comparison & Conditional',
		description: 'Returns the second argument if the first argument is true, otherwise returns the third argument.',
		signature: 'if(<predicate>, <true_value>, <false_value>)',
		returnType: 'any',
		examples: [
			'if(status==200, "success", "failure")',
			'if(count > 10, "high", "low")'
		],
		relatedFunctions: ['case', 'validate']
	},
	{
		name: 'in',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE if the value is in the list.',
		signature: 'in(<field>, <list>)',
		returnType: 'boolean',
		examples: [
			'in(status, "200", "201", "204")',
			'in(error_code, "404", "500", "503")'
		],
		relatedFunctions: ['match', 'like']
	},
	{
		name: 'like',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE if the string matches the pattern. Uses SQL LIKE wildcards (% and _).',
		signature: 'like(<str>, <pattern>)',
		returnType: 'boolean',
		examples: [
			'like(server, "prod-%")',
			'like(filename, "%.log")'
		],
		relatedFunctions: ['match', 'in']
	},
	{
		name: 'match',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE if the string matches the regex pattern.',
		signature: 'match(<str>, <regex>)',
		returnType: 'boolean',
		examples: [
			'match(field, "^[A-Z]{3}-\\d{4}$")',
			'match(url, "^/api/")'
		],
		relatedFunctions: ['rex', 'replace', 'like']
	},
	{
		name: 'null',
		category: 'Comparison & Conditional',
		description: 'Returns NULL.',
		signature: 'null()',
		returnType: 'null',
		examples: ['null()'],
		relatedFunctions: ['isnull', 'isnotnull']
	},
	{
		name: 'nullif',
		category: 'Comparison & Conditional',
		description: 'Returns NULL if the two arguments are equal, otherwise returns the first argument.',
		signature: 'nullif(<field1>, <field2>)',
		returnType: 'any',
		examples: ['nullif(field1, field2)'],
		relatedFunctions: ['coalesce', 'null']
	},
	{
		name: 'searchmatch',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE if the search string matches the event.',
		signature: 'searchmatch(<search_str>)',
		returnType: 'boolean',
		examples: ['searchmatch("error AND login")'],
		relatedFunctions: ['match']
	},
	{
		name: 'validate',
		category: 'Comparison & Conditional',
		description: 'Similar to case(), but returns the condition value instead of a specified value.',
		signature: 'validate(<condition>, <value>, ...)',
		returnType: 'any',
		examples: ['validate(isnotnull(field), field, isnotnull(field2), field2)'],
		relatedFunctions: ['case', 'if']
	},
	{
		name: 'true',
		category: 'Comparison & Conditional',
		description: 'Returns TRUE.',
		signature: 'true()',
		returnType: 'boolean',
		examples: ['true()'],
		relatedFunctions: ['false']
	},
	{
		name: 'false',
		category: 'Comparison & Conditional',
		description: 'Returns FALSE.',
		signature: 'false()',
		returnType: 'boolean',
		examples: ['false()'],
		relatedFunctions: ['true']
	},

	// Mathematical Functions
	{
		name: 'abs',
		category: 'Mathematical',
		description: 'Returns the absolute value of a number.',
		signature: 'abs(<num>)',
		returnType: 'number',
		examples: ['abs(-5)', 'abs(value)'],
		relatedFunctions: ['ceil', 'floor']
	},
	{
		name: 'ceiling',
		category: 'Mathematical',
		description: 'Rounds a number up to the next highest integer.',
		signature: 'ceiling(<num>) or ceil(<num>)',
		returnType: 'number',
		examples: ['ceiling(3.2)', 'ceil(value)'],
		relatedFunctions: ['floor', 'round']
	},
	{
		name: 'floor',
		category: 'Mathematical',
		description: 'Rounds a number down to the nearest integer.',
		signature: 'floor(<num>)',
		returnType: 'number',
		examples: ['floor(3.8)', 'floor(value)'],
		relatedFunctions: ['ceiling', 'round']
	},
	{
		name: 'round',
		category: 'Mathematical',
		description: 'Rounds a number to the specified number of decimal places.',
		signature: 'round(<num>, <precision>)',
		returnType: 'number',
		examples: ['round(3.14159, 2)', 'round(value, 0)'],
		relatedFunctions: ['ceiling', 'floor', 'sigfig']
	},
	{
		name: 'sigfig',
		category: 'Mathematical',
		description: 'Rounds a number to the specified number of significant figures.',
		signature: 'sigfig(<num>)',
		returnType: 'number',
		examples: ['sigfig(12345)'],
		relatedFunctions: ['round']
	},
	{
		name: 'sqrt',
		category: 'Mathematical',
		description: 'Returns the square root of a number.',
		signature: 'sqrt(<num>)',
		returnType: 'number',
		examples: ['sqrt(16)', 'sqrt(value)'],
		relatedFunctions: ['pow', 'exp']
	},
	{
		name: 'pow',
		category: 'Mathematical',
		description: 'Returns a number raised to a power.',
		signature: 'pow(<num>, <exp>)',
		returnType: 'number',
		examples: ['pow(2, 3)', 'pow(value, 2)'],
		relatedFunctions: ['sqrt', 'exp']
	},
	{
		name: 'exp',
		category: 'Mathematical',
		description: 'Returns e raised to the power of a number.',
		signature: 'exp(<num>)',
		returnType: 'number',
		examples: ['exp(1)', 'exp(value)'],
		relatedFunctions: ['pow', 'ln']
	},
	{
		name: 'ln',
		category: 'Mathematical',
		description: 'Returns the natural logarithm of a number.',
		signature: 'ln(<num>)',
		returnType: 'number',
		examples: ['ln(2.718)', 'ln(value)'],
		relatedFunctions: ['log', 'exp']
	},
	{
		name: 'log',
		category: 'Mathematical',
		description: 'Returns the logarithm of a number with the specified base.',
		signature: 'log(<num>, <base>)',
		returnType: 'number',
		examples: ['log(100, 10)', 'log(value, 2)'],
		relatedFunctions: ['ln', 'exp']
	},
	{
		name: 'pi',
		category: 'Mathematical',
		description: 'Returns the value of pi.',
		signature: 'pi()',
		returnType: 'number',
		examples: ['pi()'],
		relatedFunctions: ['exp']
	},
	{
		name: 'exact',
		category: 'Mathematical',
		description: 'Returns the result of a calculation with arbitrary precision.',
		signature: 'exact(<expression>)',
		returnType: 'number',
		examples: ['exact(0.2) * 8.250'],
		relatedFunctions: ['round']
	},

	// Statistical Eval Functions
	{
		name: 'avg',
		category: 'Statistical',
		description: 'Returns the average of the values (eval context).',
		signature: 'avg(<values>...)',
		returnType: 'number',
		examples: ['avg(value1, value2, value3)'],
		relatedFunctions: ['sum', 'max', 'min']
	},
	{
		name: 'max',
		category: 'Statistical',
		description: 'Returns the maximum value (eval context).',
		signature: 'max(<values>...)',
		returnType: 'number',
		examples: ['max(value1, value2, value3)'],
		relatedFunctions: ['min', 'avg']
	},
	{
		name: 'min',
		category: 'Statistical',
		description: 'Returns the minimum value (eval context).',
		signature: 'min(<values>...)',
		returnType: 'number',
		examples: ['min(value1, value2, value3)'],
		relatedFunctions: ['max', 'avg']
	},
	{
		name: 'random',
		category: 'Statistical',
		description: 'Returns a random number between 0 and 2^31-1.',
		signature: 'random()',
		returnType: 'number',
		examples: ['random()'],
		relatedFunctions: []
	},

	// Text Functions
	{
		name: 'len',
		category: 'Text',
		description: 'Returns the length of a string.',
		signature: 'len(<str>)',
		returnType: 'number',
		examples: ['len(message)', 'len("hello")'],
		relatedFunctions: ['substr', 'trim']
	},
	{
		name: 'lower',
		category: 'Text',
		description: 'Converts a string to lowercase.',
		signature: 'lower(<str>)',
		returnType: 'string',
		examples: ['lower(username)', 'lower("HELLO")'],
		relatedFunctions: ['upper']
	},
	{
		name: 'upper',
		category: 'Text',
		description: 'Converts a string to uppercase.',
		signature: 'upper(<str>)',
		returnType: 'string',
		examples: ['upper(username)', 'upper("hello")'],
		relatedFunctions: ['lower']
	},
	{
		name: 'substr',
		category: 'Text',
		description: 'Returns a substring of a string.',
		signature: 'substr(<str>, <start>, <length>)',
		returnType: 'string',
		examples: ['substr(message, 1, 10)', 'substr(field, 5)'],
		relatedFunctions: ['len', 'trim']
	},
	{
		name: 'trim',
		category: 'Text',
		description: 'Removes leading and trailing characters from a string.',
		signature: 'trim(<str>, <trim_chars>)',
		returnType: 'string',
		examples: ['trim(field)', 'trim(field, " \\t")'],
		relatedFunctions: ['ltrim', 'rtrim']
	},
	{
		name: 'ltrim',
		category: 'Text',
		description: 'Removes leading characters from a string.',
		signature: 'ltrim(<str>, <trim_chars>)',
		returnType: 'string',
		examples: ['ltrim(field)', 'ltrim(field, " ")'],
		relatedFunctions: ['trim', 'rtrim']
	},
	{
		name: 'rtrim',
		category: 'Text',
		description: 'Removes trailing characters from a string.',
		signature: 'rtrim(<str>, <trim_chars>)',
		returnType: 'string',
		examples: ['rtrim(field)', 'rtrim(field, " ")'],
		relatedFunctions: ['trim', 'ltrim']
	},
	{
		name: 'replace',
		category: 'Text',
		description: 'Replaces all occurrences of a regex pattern in a string.',
		signature: 'replace(<str>, <regex>, <replacement>)',
		returnType: 'string',
		examples: ['replace(field, "\\s+", "_")', 'replace(text, "[0-9]", "X")'],
		relatedFunctions: ['rex', 'match']
	},
	{
		name: 'spath',
		category: 'Text',
		description: 'Extracts values from XML or JSON formatted text.',
		signature: 'spath(<value>, <path>)',
		returnType: 'string',
		examples: ['spath(json_field, "path.to.value")'],
		relatedFunctions: ['json_extract']
	},
	{
		name: 'urldecode',
		category: 'Text',
		description: 'URL-decodes a string.',
		signature: 'urldecode(<url>)',
		returnType: 'string',
		examples: ['urldecode(url)'],
		relatedFunctions: []
	},

	// Multivalue Functions
	{
		name: 'mvappend',
		category: 'Multivalue',
		description: 'Combines the values of multiple fields into a multivalue field.',
		signature: 'mvappend(<values>...)',
		returnType: 'multivalue',
		examples: ['mvappend(field1, field2, field3)'],
		relatedFunctions: ['mvjoin', 'split']
	},
	{
		name: 'mvcount',
		category: 'Multivalue',
		description: 'Returns the number of values in a multivalue field.',
		signature: 'mvcount(<mv>)',
		returnType: 'number',
		examples: ['mvcount(emails)'],
		relatedFunctions: ['mvindex', 'mvfind']
	},
	{
		name: 'mvdedup',
		category: 'Multivalue',
		description: 'Removes duplicate values from a multivalue field.',
		signature: 'mvdedup(<mv>)',
		returnType: 'multivalue',
		examples: ['mvdedup(field)'],
		relatedFunctions: ['mvsort']
	},
	{
		name: 'mvfilter',
		category: 'Multivalue',
		description: 'Filters a multivalue field based on a predicate.',
		signature: 'mvfilter(<predicate>)',
		returnType: 'multivalue',
		examples: ['mvfilter(match(email_list, ".+@company.com"))'],
		relatedFunctions: ['mvfind', 'mvmap']
	},
	{
		name: 'mvfind',
		category: 'Multivalue',
		description: 'Finds the index of the first value that matches a regex.',
		signature: 'mvfind(<mv>, <regex>)',
		returnType: 'number',
		examples: ['mvfind(emails, "@company.com")'],
		relatedFunctions: ['mvfilter', 'mvindex']
	},
	{
		name: 'mvindex',
		category: 'Multivalue',
		description: 'Returns values from a multivalue field at the specified indices.',
		signature: 'mvindex(<mv>, <start>, <end>)',
		returnType: 'multivalue',
		examples: ['mvindex(emails, 0)', 'mvindex(list, 2, 4)'],
		relatedFunctions: ['mvcount', 'mvfind']
	},
	{
		name: 'mvjoin',
		category: 'Multivalue',
		description: 'Joins the values of a multivalue field with a delimiter.',
		signature: 'mvjoin(<mv>, <delim>)',
		returnType: 'string',
		examples: ['mvjoin(emails, ",")', 'mvjoin(list, " | ")'],
		relatedFunctions: ['split', 'mvappend']
	},
	{
		name: 'mvmap',
		category: 'Multivalue',
		description: 'Applies an expression to each value in a multivalue field.',
		signature: 'mvmap(<mv>, <expression>)',
		returnType: 'multivalue',
		examples: ['mvmap(emails, upper(emails))'],
		relatedFunctions: ['mvfilter']
	},
	{
		name: 'mvrange',
		category: 'Multivalue',
		description: 'Creates a multivalue field with a range of numbers.',
		signature: 'mvrange(<start>, <end>, <step>)',
		returnType: 'multivalue',
		examples: ['mvrange(0, 10, 2)', 'mvrange(1, 100)'],
		relatedFunctions: []
	},
	{
		name: 'mvsort',
		category: 'Multivalue',
		description: 'Sorts the values in a multivalue field.',
		signature: 'mvsort(<mv>)',
		returnType: 'multivalue',
		examples: ['mvsort(field)'],
		relatedFunctions: ['mvdedup']
	},
	{
		name: 'mvzip',
		category: 'Multivalue',
		description: 'Combines values from two multivalue fields.',
		signature: 'mvzip(<mv_left>, <mv_right>, <delim>)',
		returnType: 'multivalue',
		examples: ['mvzip(names, emails, ":")'],
		relatedFunctions: ['mvappend', 'mvjoin']
	},
	{
		name: 'split',
		category: 'Multivalue',
		description: 'Splits a string into a multivalue field.',
		signature: 'split(<str>, <delim>)',
		returnType: 'multivalue',
		examples: ['split(email, "@")', 'split(path, "/")'],
		relatedFunctions: ['mvjoin', 'mvappend']
	},

	// Cryptographic Functions
	{
		name: 'md5',
		category: 'Cryptographic',
		description: 'Returns the MD5 hash of a string.',
		signature: 'md5(<str>)',
		returnType: 'string',
		examples: ['md5(password)', 'md5("hello")'],
		relatedFunctions: ['sha1', 'sha256', 'sha512']
	},
	{
		name: 'sha1',
		category: 'Cryptographic',
		description: 'Returns the SHA1 hash of a string.',
		signature: 'sha1(<str>)',
		returnType: 'string',
		examples: ['sha1(password)'],
		relatedFunctions: ['md5', 'sha256', 'sha512']
	},
	{
		name: 'sha256',
		category: 'Cryptographic',
		description: 'Returns the SHA256 hash of a string.',
		signature: 'sha256(<str>)',
		returnType: 'string',
		examples: ['sha256(password)'],
		relatedFunctions: ['md5', 'sha1', 'sha512']
	},
	{
		name: 'sha512',
		category: 'Cryptographic',
		description: 'Returns the SHA512 hash of a string.',
		signature: 'sha512(<str>)',
		returnType: 'string',
		examples: ['sha512(password)'],
		relatedFunctions: ['md5', 'sha1', 'sha256']
	},

	// Date & Time Functions
	{
		name: 'now',
		category: 'Date & Time',
		description: 'Returns the current epoch time.',
		signature: 'now()',
		returnType: 'number',
		examples: ['now()'],
		relatedFunctions: ['time', 'strftime']
	},
	{
		name: 'time',
		category: 'Date & Time',
		description: 'Returns the current epoch time (alias for now).',
		signature: 'time()',
		returnType: 'number',
		examples: ['time()'],
		relatedFunctions: ['now']
	},
	{
		name: 'strftime',
		category: 'Date & Time',
		description: 'Formats a time value as a string.',
		signature: 'strftime(<time>, <format>)',
		returnType: 'string',
		examples: ['strftime(_time, "%Y-%m-%d %H:%M:%S")', 'strftime(now(), "%Y-%m-%d")'],
		relatedFunctions: ['strptime', 'now']
	},
	{
		name: 'strptime',
		category: 'Date & Time',
		description: 'Parses a time string into an epoch time.',
		signature: 'strptime(<str>, <format>)',
		returnType: 'number',
		examples: ['strptime(timestr, "%Y-%m-%d")'],
		relatedFunctions: ['strftime']
	},
	{
		name: 'relative_time',
		category: 'Date & Time',
		description: 'Returns a time relative to a specified time.',
		signature: 'relative_time(<time>, <specifier>)',
		returnType: 'number',
		examples: ['relative_time(now(), "-1h")', 'relative_time(_time, "+7d")'],
		relatedFunctions: ['now', 'strftime']
	},

	// Conversion Functions
	{
		name: 'tostring',
		category: 'Conversion',
		description: 'Converts a value to a string.',
		signature: 'tostring(<value>, <format>)',
		returnType: 'string',
		examples: ['tostring(count)', 'tostring(value, "commas")'],
		relatedFunctions: ['tonumber', 'tobool']
	},
	{
		name: 'tonumber',
		category: 'Conversion',
		description: 'Converts a value to a number.',
		signature: 'tonumber(<str>, <base>)',
		returnType: 'number',
		examples: ['tonumber("123")', 'tonumber("FF", 16)'],
		relatedFunctions: ['tostring', 'toint']
	},
	{
		name: 'tobool',
		category: 'Conversion',
		description: 'Converts a value to a boolean.',
		signature: 'tobool(<value>)',
		returnType: 'boolean',
		examples: ['tobool("true")', 'tobool(1)'],
		relatedFunctions: ['tostring', 'tonumber']
	},
	{
		name: 'toint',
		category: 'Conversion',
		description: 'Converts a value to an integer.',
		signature: 'toint(<value>, <base>)',
		returnType: 'number',
		examples: ['toint("123")', 'toint("FF", 16)'],
		relatedFunctions: ['tonumber', 'todouble']
	},
	{
		name: 'todouble',
		category: 'Conversion',
		description: 'Converts a value to a double.',
		signature: 'todouble(<value>, <base>)',
		returnType: 'number',
		examples: ['todouble("3.14")'],
		relatedFunctions: ['toint', 'tonumber']
	},
	{
		name: 'printf',
		category: 'Conversion',
		description: 'Formats values using printf-style formatting.',
		signature: 'printf(<format>, <arguments>)',
		returnType: 'string',
		examples: ['printf("%d items", count)', 'printf("%.2f", value)'],
		relatedFunctions: ['tostring']
	},

	// Informational Functions
	{
		name: 'isstr',
		category: 'Informational',
		description: 'Returns TRUE if the value is a string.',
		signature: 'isstr(<value>)',
		returnType: 'boolean',
		examples: ['isstr(field)'],
		relatedFunctions: ['isnum', 'isbool', 'typeof']
	},
	{
		name: 'isnum',
		category: 'Informational',
		description: 'Returns TRUE if the value is a number.',
		signature: 'isnum(<value>)',
		returnType: 'boolean',
		examples: ['isnum(field)'],
		relatedFunctions: ['isstr', 'typeof']
	},
	{
		name: 'isbool',
		category: 'Informational',
		description: 'Returns TRUE if the value is a boolean.',
		signature: 'isbool(<value>)',
		returnType: 'boolean',
		examples: ['isbool(field)'],
		relatedFunctions: ['isstr', 'isnum', 'typeof']
	},
	{
		name: 'isint',
		category: 'Informational',
		description: 'Returns TRUE if the value is an integer.',
		signature: 'isint(<value>)',
		returnType: 'boolean',
		examples: ['isint(field)'],
		relatedFunctions: ['isnum', 'isdouble']
	},
	{
		name: 'isdouble',
		category: 'Informational',
		description: 'Returns TRUE if the value is a double.',
		signature: 'isdouble(<value>)',
		returnType: 'boolean',
		examples: ['isdouble(field)'],
		relatedFunctions: ['isint', 'isnum']
	},
	{
		name: 'ismv',
		category: 'Informational',
		description: 'Returns TRUE if the value is a multivalue field.',
		signature: 'ismv(<value>)',
		returnType: 'boolean',
		examples: ['ismv(field)'],
		relatedFunctions: ['mvcount']
	},
	{
		name: 'isnull',
		category: 'Informational',
		description: 'Returns TRUE if the value is null.',
		signature: 'isnull(<value>)',
		returnType: 'boolean',
		examples: ['isnull(field)'],
		relatedFunctions: ['isnotnull', 'null']
	},
	{
		name: 'isnotnull',
		category: 'Informational',
		description: 'Returns TRUE if the value is not null.',
		signature: 'isnotnull(<value>)',
		returnType: 'boolean',
		examples: ['isnotnull(field)'],
		relatedFunctions: ['isnull']
	},
	{
		name: 'typeof',
		category: 'Informational',
		description: 'Returns the type of the value as a string.',
		signature: 'typeof(<value>)',
		returnType: 'string',
		examples: ['typeof(field)'],
		relatedFunctions: ['isstr', 'isnum', 'isbool']
	},

	// Bitwise Functions
	{
		name: 'bit_and',
		category: 'Bitwise',
		description: 'Performs bitwise AND operation on two integers.',
		signature: 'bit_and(<X>, <Y>)',
		returnType: 'number',
		examples: ['bit_and(15, 7)', 'eval result=bit_and(flags, mask)'],
		relatedFunctions: ['bit_or', 'bit_xor', 'bit_not']
	},
	{
		name: 'bit_or',
		category: 'Bitwise',
		description: 'Performs bitwise OR operation on two integers.',
		signature: 'bit_or(<X>, <Y>)',
		returnType: 'number',
		examples: ['bit_or(8, 4)', 'eval flags=bit_or(flag1, flag2)'],
		relatedFunctions: ['bit_and', 'bit_xor', 'bit_not']
	},
	{
		name: 'bit_xor',
		category: 'Bitwise',
		description: 'Performs bitwise XOR operation on two integers.',
		signature: 'bit_xor(<X>, <Y>)',
		returnType: 'number',
		examples: ['bit_xor(12, 10)', 'eval toggle=bit_xor(state, flag)'],
		relatedFunctions: ['bit_and', 'bit_or', 'bit_not']
	},
	{
		name: 'bit_not',
		category: 'Bitwise',
		description: 'Performs bitwise NOT operation on an integer.',
		signature: 'bit_not(<X>)',
		returnType: 'number',
		examples: ['bit_not(15)', 'eval inverted=bit_not(mask)'],
		relatedFunctions: ['bit_and', 'bit_or', 'bit_xor']
	},
	{
		name: 'bit_shift_left',
		category: 'Bitwise',
		description: 'Shifts bits to the left by the specified number of positions.',
		signature: 'bit_shift_left(<X>, <Y>)',
		returnType: 'number',
		examples: ['bit_shift_left(1, 4)', 'eval shifted=bit_shift_left(value, 2)'],
		relatedFunctions: ['bit_shift_right']
	},
	{
		name: 'bit_shift_right',
		category: 'Bitwise',
		description: 'Shifts bits to the right by the specified number of positions.',
		signature: 'bit_shift_right(<X>, <Y>)',
		returnType: 'number',
		examples: ['bit_shift_right(16, 2)', 'eval shifted=bit_shift_right(value, 3)'],
		relatedFunctions: ['bit_shift_left']
	},

	// Trigonometric Functions
	{
		name: 'sin',
		category: 'Trigonometric',
		description: 'Returns the sine of an angle in radians.',
		signature: 'sin(<X>)',
		returnType: 'number',
		examples: ['sin(pi()/2)', 'eval y=sin(angle)'],
		relatedFunctions: ['cos', 'tan', 'asin']
	},
	{
		name: 'cos',
		category: 'Trigonometric',
		description: 'Returns the cosine of an angle in radians.',
		signature: 'cos(<X>)',
		returnType: 'number',
		examples: ['cos(0)', 'eval x=cos(angle)'],
		relatedFunctions: ['sin', 'tan', 'acos']
	},
	{
		name: 'tan',
		category: 'Trigonometric',
		description: 'Returns the tangent of an angle in radians.',
		signature: 'tan(<X>)',
		returnType: 'number',
		examples: ['tan(pi()/4)', 'eval slope=tan(angle)'],
		relatedFunctions: ['sin', 'cos', 'atan']
	},
	{
		name: 'asin',
		category: 'Trigonometric',
		description: 'Returns the arcsine (inverse sine) of a value in radians.',
		signature: 'asin(<X>)',
		returnType: 'number',
		examples: ['asin(0.5)', 'eval angle=asin(ratio)'],
		relatedFunctions: ['sin', 'acos', 'atan']
	},
	{
		name: 'acos',
		category: 'Trigonometric',
		description: 'Returns the arccosine (inverse cosine) of a value in radians.',
		signature: 'acos(<X>)',
		returnType: 'number',
		examples: ['acos(0.5)', 'eval angle=acos(ratio)'],
		relatedFunctions: ['cos', 'asin', 'atan']
	},
	{
		name: 'atan',
		category: 'Trigonometric',
		description: 'Returns the arctangent (inverse tangent) of a value in radians.',
		signature: 'atan(<X>)',
		returnType: 'number',
		examples: ['atan(1)', 'eval angle=atan(slope)'],
		relatedFunctions: ['tan', 'asin', 'acos', 'atan2']
	},
	{
		name: 'atan2',
		category: 'Trigonometric',
		description: 'Returns the arctangent of Y/X in radians.',
		signature: 'atan2(<Y>, <X>)',
		returnType: 'number',
		examples: ['atan2(1, 1)', 'eval angle=atan2(y, x)'],
		relatedFunctions: ['atan', 'tan']
	},
	{
		name: 'sinh',
		category: 'Trigonometric',
		description: 'Returns the hyperbolic sine of a value.',
		signature: 'sinh(<X>)',
		returnType: 'number',
		examples: ['sinh(0)', 'eval result=sinh(value)'],
		relatedFunctions: ['cosh', 'tanh', 'sin']
	},
	{
		name: 'cosh',
		category: 'Trigonometric',
		description: 'Returns the hyperbolic cosine of a value.',
		signature: 'cosh(<X>)',
		returnType: 'number',
		examples: ['cosh(0)', 'eval result=cosh(value)'],
		relatedFunctions: ['sinh', 'tanh', 'cos']
	},
	{
		name: 'tanh',
		category: 'Trigonometric',
		description: 'Returns the hyperbolic tangent of a value.',
		signature: 'tanh(<X>)',
		returnType: 'number',
		examples: ['tanh(0)', 'eval result=tanh(value)'],
		relatedFunctions: ['sinh', 'cosh', 'tan']
	},
	{
		name: 'hypot',
		category: 'Trigonometric',
		description: 'Returns the hypotenuse of a right triangle (sqrt(X^2 + Y^2)).',
		signature: 'hypot(<X>, <Y>)',
		returnType: 'number',
		examples: ['hypot(3, 4)', 'eval distance=hypot(dx, dy)'],
		relatedFunctions: ['sqrt', 'pow']
	},

	// JSON Functions
	{
		name: 'json_object',
		category: 'JSON',
		description: 'Creates a JSON object from key-value pairs.',
		signature: 'json_object(<key1>, <value1>, <key2>, <value2>, ...)',
		returnType: 'string',
		examples: ['json_object("name", user, "id", userid)', 'eval json=json_object("status", "active", "count", cnt)'],
		relatedFunctions: ['json_array', 'spath']
	},
	{
		name: 'json_array',
		category: 'JSON',
		description: 'Creates a JSON array from values.',
		signature: 'json_array(<value1>, <value2>, ...)',
		returnType: 'string',
		examples: ['json_array(val1, val2, val3)', 'eval array=json_array("red", "green", "blue")'],
		relatedFunctions: ['json_object', 'spath']
	},
	{
		name: 'json_extract',
		category: 'JSON',
		description: 'Extracts a value from a JSON string using a path.',
		signature: 'json_extract(<json>, <path>)',
		returnType: 'any',
		examples: ['json_extract(response, "$.data.id")', 'eval status=json_extract(json_field, "$.status")'],
		relatedFunctions: ['spath', 'json_extract_exact']
	},
	{
		name: 'json_extract_exact',
		category: 'JSON',
		description: 'Extracts an exact value from JSON without type conversion.',
		signature: 'json_extract_exact(<json>, <path>)',
		returnType: 'string',
		examples: ['json_extract_exact(data, "$.value")', 'eval raw=json_extract_exact(response, "$.raw")'],
		relatedFunctions: ['json_extract', 'spath']
	},
	{
		name: 'json_set',
		category: 'JSON',
		description: 'Sets a value in a JSON object at the specified path.',
		signature: 'json_set(<json>, <path>, <value>)',
		returnType: 'string',
		examples: ['json_set(data, "$.status", "active")', 'eval updated=json_set(json_field, "$.count", 10)'],
		relatedFunctions: ['json_extract', 'json_object']
	},
	{
		name: 'json_append',
		category: 'JSON',
		description: 'Appends a value to a JSON array at the specified path.',
		signature: 'json_append(<json>, <path>, <value>)',
		returnType: 'string',
		examples: ['json_append(data, "$.items", "new_item")', 'eval updated=json_append(json_field, "$.tags", tag)'],
		relatedFunctions: ['json_array', 'json_set']
	},

	// Additional Common Functions
	{
		name: 'commands',
		category: 'Informational',
		description: 'Returns search command usage information.',
		signature: 'commands(<search>)',
		returnType: 'string',
		examples: ['commands(*)'],
		relatedFunctions: ['typeof']
	},
	{
		name: 'mvfilter',
		category: 'Multivalue',
		description: 'Filters multivalue field by a boolean expression.',
		signature: 'mvfilter(<predicate>)',
		returnType: 'multivalue',
		examples: ['mvfilter(match(email, ".*@example.com"))', 'eval filtered=mvfilter(status=="active")'],
		relatedFunctions: ['mvappend', 'mvdedup', 'mvfind']
	},
	{
		name: 'mvmap',
		category: 'Multivalue',
		description: 'Maps an eval expression to each value of a multivalue field.',
		signature: 'mvmap(<mv-field>, <expression>)',
		returnType: 'multivalue',
		examples: ['mvmap(tags, upper(tags))', 'eval uppercased=mvmap(names, upper(names))'],
		relatedFunctions: ['mvfilter', 'mvappend']
	},
	{
		name: 'true',
		category: 'Comparison & Conditional',
		description: 'Returns the boolean value TRUE.',
		signature: 'true()',
		returnType: 'boolean',
		examples: ['true()'],
		relatedFunctions: ['false', 'if']
	},
	{
		name: 'false',
		category: 'Comparison & Conditional',
		description: 'Returns the boolean value FALSE.',
		signature: 'false()',
		returnType: 'boolean',
		examples: ['false()'],
		relatedFunctions: ['true', 'if']
	},
	{
		name: 'mvrange',
		category: 'Multivalue',
		description: 'Creates a multivalue field containing a range of numbers.',
		signature: 'mvrange(<start>, <end>, <step>)',
		returnType: 'multivalue',
		examples: ['mvrange(0, 10, 1)', 'eval numbers=mvrange(1, 100, 10)'],
		relatedFunctions: ['mvappend']
	}
];
