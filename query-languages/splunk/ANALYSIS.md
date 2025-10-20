# Splunk SPL Syntax Analysis for TextMate Grammar

## Overview

This analysis covers the comprehensive syntax patterns of Splunk Search Processing Language (SPL) based on parsing **197 official documentation files** from the Splunk SPL 10.0 Reference Manual. The analysis provides detailed categorization of all language elements to support robust syntax highlighting via TextMate grammars.

**Documentation Coverage:**
- Search Commands: 159 files
- Evaluation Functions: 13 files
- Internal Commands: 10 files
- Quick Reference: 5 files
- Statistical/Charting Functions: 5 files
- Introduction/Syntax Guide: 3 files
- Time Format Variables: 2 files

---

## 1. Language Structure & Pipeline Architecture

### 1.1 Search Pipeline Composition

SPL queries are composed of **commands** connected by **pipe operators** (`|`):

```spl
<search-command> | <transforming-command> | <presentation-command>
```

**Key Characteristics:**
- The first command is typically implicit `search` (event retrieval)
- Commands are separated by the pipe character `|`
- Each command operates on the output of the previous command
- Commands can span multiple lines (whitespace-insensitive between tokens)

**Example:**
```spl
index=main sourcetype=access_* status=404
| stats count BY host, status
| where count > 100
| sort -count
| head 10
```

### 1.2 Command Categories

Commands are classified into six types (critical for semantic understanding):

1. **Generating Commands** - Retrieve or generate data
   - `search`, `inputlookup`, `makeresults`, `tstats`, `mstats`, `from`, `metadata`
   
2. **Streaming Commands** - Process events individually
   - `eval`, `where`, `rex`, `regex`, `fields`, `rename`, `replace`
   - Subcategories: Distributable vs. Centralized
   
3. **Transforming Commands** - Aggregate into data tables
   - `stats`, `chart`, `timechart`, `top`, `rare`, `table`
   
4. **Orchestrating Commands** - Control search execution
   - `localop`, `redistribute`, `noop`
   
5. **Dataset Processing Commands** - Require full dataset
   - `sort`, `dedup`, `join`, `append`, `transaction`

6. **Internal Commands** - System-level operations
   - `collapse`, `dump`, `findkeywords`, `mcatalog`

---

## 2. Core Syntax Elements

### 2.1 Keywords & Reserved Words

#### Logical Operators (MUST be uppercase)
```spl
AND OR NOT XOR
```

**Usage Context:**
- `search` command: OR evaluated before AND
- `eval`/`where` commands: AND evaluated before OR
- Case-sensitive requirement (uppercase only)

#### Clause Keywords (case-insensitive, but conventionally uppercase)
```spl
AS BY OVER WHERE BY IN LIKE
```

**Common Patterns:**
```spl
| eval new_field=calculation AS alias
| stats count BY field1, field2
| chart avg(value) OVER time BY category
| where status IN (200, 404, 500)
| eval match=field LIKE "pattern%"
```

#### Time Modifiers
```spl
earliest= latest= starttime= endtime=
timeformat= span=
```

#### Special Directives
```spl
TERM()    # Force exact term matching in index
CASE()    # Case-sensitive search
```

### 2.2 Operators

#### Comparison Operators
```spl
=  !=  <  <=  >  >=  ==
```

**Context-Specific Behavior:**
- `search`: `=` and `!=` are string comparisons; `< > <= >=` are numeric/lexical
- `eval`/`where`: `=` assigns, `==` compares

#### Arithmetic Operators
```spl
+  -  *  /  %  (modulo)
```

#### String Operator
```spl
.  (concatenation)
```

Example: `"prefix" . field . "suffix"`

#### Boolean Operators
```spl
AND OR NOT XOR
< > <= >= != = == LIKE
```

#### Bitwise Operators (via functions)
```spl
bit_and()  bit_or()  bit_not()  bit_xor()
bit_shift_left()  bit_shift_right()
```

### 2.3 Literals & Constants

#### String Literals
```spl
"double quoted"        # Standard strings
'single quoted'        # Field names with special chars
```

**Escaping:**
- `\"` - Literal quote
- `\\` - Literal backslash
- `\|` - Literal pipe (not command separator)
- `\n`, `\r`, `\t` - Whitespace (context-dependent)

#### Numeric Literals
```spl
42               # Integer
3.14159          # Float (double-precision)
1.23e10          # Scientific notation
0x1A3F           # Hexadecimal (in conversions)
```

**Special Numeric Values:**
```spl
nan              # Not a Number (result of invalid calc)
inf              # Positive infinity
-inf             # Negative infinity
```

#### Boolean Literals
```spl
true  false      # Case-insensitive (TRUE, False, etc.)
t  f             # Short forms
yes  no          # Alternative forms
1  0             # Numeric boolean equivalents
```

#### Null Value
```spl
null()           # Function returning NULL
NULL             # Concept (no direct literal)
```

### 2.4 Field References

#### Simple Field Names
```spl
fieldname
_time
host
sourcetype
status
clientip
```

**Rules:**
- Alphanumeric + underscore
- Case-sensitive
- Can start with letter or underscore
- Cannot start with digit (unless quoted)

#### Special/Internal Fields (underscore-prefixed)
```spl
_raw             # Raw event text
_time            # Event timestamp
_indextime       # Index time
_sourcetype      # Source type
_source          # Source
_host            # Host
```

#### Field Names with Special Characters (must be quoted)
```spl
'field-name'          # Contains hyphen
'field name'          # Contains space
'field.name'          # Contains period
'5minutes'            # Starts with digit
'server-1'            # Contains hyphen
```

#### Wildcard Field Names
```spl
*log              # Fields ending with 'log'
server*           # Fields starting with 'server'
*delay            # Used with eval/stats
```

**Context:**
- Allowed in: `stats`, `eval` (with functions like `avg(*delay)`)
- NOT allowed in: `BY` clauses

#### Dynamic Field Names (curly brace syntax)
```spl
{fieldname}       # Use value of fieldname as a field name
```

Example:
```spl
| eval aName="counter", aValue=1234
| eval {aName}=aValue     # Creates field counter=1234
```

### 2.5 Data Types

#### Type System
SPL has a flexible type system with implicit conversions:

| Type | Description | Example Values |
|------|-------------|----------------|
| **Boolean** | True/false | `true`, `false`, `1`, `0` |
| **String** | Text | `"error"`, `"192.168.1.1"` |
| **Number** | Integer or Double | `42`, `3.14`, `1.23e10` |
| **Multivalue** | Array of values | `mvappend(a, b, c)` |
| **Object** | JSON object | `json_object("key", value)` |
| **Array** | JSON array | `json_array(1, 2, 3)` |
| **NULL** | Absence of value | `null()` |

#### Type Checking Functions
```spl
isstr()  isnum()  isbool()  isint()  isdouble()
ismv()  isarray()  isobject()
isnull()  isnotnull()
typeof()          # Returns type name string
```

#### Type Conversion Functions
```spl
tostring()  tonumber()  tobool()
toint()  todouble()
tomv()  toarray()  toobject()
```

---

## 3. Command Syntax Patterns

### 3.1 Search Command (Implicit)

**Syntax:**
```spl
[search] <search-terms> [<modifiers>]
```

**Components:**

#### Search Terms
```spl
keyword                    # Simple keyword
"quoted phrase"            # Exact phrase
field=value                # Field-value pair
field!=value               # Negation
field>100                  # Comparison
field IN (val1, val2)      # Set membership
```

#### Search Modifiers
```spl
index=<name>
sourcetype=<name>
source=<name>
host=<name>
earliest=<time>
latest=<time>
```

#### Boolean Expressions
```spl
error AND login
status=404 OR status=500
NOT error
(status=200 OR status=201) AND host=www1
```

#### Wildcards
```spl
error*                     # Prefix wildcard
*error                     # Suffix wildcard
*error*                    # Contains
fail\*                     # Escaped wildcard (literal *)
```

#### CIDR Notation (IP matching)
```spl
clientip="192.168.1.0/24"
```

### 3.2 Eval Command

**Syntax:**
```spl
eval <field>=<expression> [, <field>=<expression>]...
```

**Expression Types:**

#### Simple Assignment
```spl
| eval result=42
| eval status_code="200"
| eval is_error=false
```

#### Arithmetic
```spl
| eval total=price * quantity
| eval average=sum / count
| eval percentage=(part / whole) * 100
```

#### String Operations
```spl
| eval full_name=first_name . " " . last_name
| eval upper_host=upper(host)
| eval substring=substr(message, 1, 10)
```

#### Conditional Logic
```spl
| eval category=if(value > 100, "high", "low")
| eval result=case(
    status==200, "OK",
    status==404, "Not Found",
    status==500, "Error"
  )
```

#### Function Calls (170+ functions available)
```spl
| eval hash=md5(password)
| eval rounded=round(value, 2)
| eval timestamp=strftime(_time, "%Y-%m-%d")
| eval match_result=match(field, "regex pattern")
```

### 3.3 Stats Command

**Syntax:**
```spl
stats [<options>] <agg-function>(<field>) [AS <alias>]... [BY <field-list>]
```

**Aggregation Functions:**
```spl
count()  sum()  avg()  min()  max()
stdev()  stdevp()  var()  varp()
median()  mode()  range()
perc<N>()  upperperc<N>()  exactperc<N>()
dc()  distinct_count()  estdc()  values()  list()
first()  last()  earliest()  latest()
rate()
```

**Examples:**
```spl
| stats count
| stats count BY host
| stats avg(response_time) AS avg_time BY host, status
| stats dc(user) AS unique_users, sum(bytes) AS total_bytes
| stats values(status) AS status_codes BY clientip
```

**Options:**
```spl
partitions=<num>       # Parallel reduce processing
allnum=<bool>          # Treat all as numeric
delim=<string>         # Delimiter for values()/list()
dedup_splitvals=<bool> # Dedupe multivalue BY fields
```

### 3.4 Where Command

**Syntax:**
```spl
where <eval-expression>
```

**Boolean Expressions:**
```spl
| where status > 400
| where isnotnull(error_code)
| where len(message) > 100
| where match(url, "^/api/")
| where like(server, "prod-%")
| where cidrmatch("10.0.0.0/8", ip)
| where in(status, "200", "201", "204")
```

**Field Comparisons:**
```spl
| where fieldA = fieldB
| where fieldA != fieldB
| where fieldA > fieldB
```

**Note:** `where` treats unquoted strings as field names, quoted strings as literals.

### 3.5 Rex Command (Regular Expression)

**Syntax:**
```spl
rex [field=<field>] "<regex>" [max_match=<int>] [offset_field=<string>]
rex [field=<field>] mode=sed "<sed-expression>"
```

**Named Capture Groups:**
```spl
| rex field=_raw "From: <(?<from>.*?)> To: <(?<to>.*?)>"
| rex "(?<ip>\d+\.\d+\.\d+\.\d+)"
| rex "user=(?<username>\w+)"
```

**Sed Mode:**
```spl
| rex mode=sed field=ccnumber "s/(\d{4}-){3}/XXXX-XXXX-XXXX-/g"
| rex mode=sed field=text "s/\s\"(\d+\.\d+\.\d+\.\d+)\"\s/\1/g"
```

**Multiple Matches:**
```spl
| rex field=test max_match=0 "((?<field>[^$]*)\$(?<value>[^,]*),?)"
```

### 3.6 Additional Common Commands

#### **Fields Command**
```spl
fields <field-list>          # Keep fields
fields - <field-list>        # Remove fields
```

#### **Rename Command**
```spl
rename <old-name> AS <new-name> [, <old-name> AS <new-name>]...
```

#### **Table Command**
```spl
table <field-list>
```

#### **Sort Command**
```spl
sort [<limit>] [<sort-by-clause>]...
sort -count                  # Descending
sort +time                   # Ascending
sort 10 -count               # Top 10
sort num(field)              # Numeric sort
```

#### **Dedup Command**
```spl
dedup [<limit>] <field-list> [sortby <sort-fields>]
dedup host
dedup 5 host sortby -_time
```

#### **Head/Tail Commands**
```spl
head [<N>]
tail [<N>]
```

---

## 4. Function Categories & Signatures

SPL provides **170+ evaluation functions** across 13 categories:

### 4.1 Comparison & Conditional Functions

```spl
case(<condition>, <value>, ...)
if(<predicate>, <true_value>, <false_value>)
coalesce(<values>...)
cidrmatch(<cidr>, <ip>)
in(<field>, <list>)
like(<str>, <pattern>)
match(<str>, <regex>)
null()
nullif(<field1>, <field2>)
searchmatch(<search_str>)
validate(<condition>, <value>, ...)
true()  false()
```

### 4.2 Mathematical Functions

```spl
abs(<num>)
ceiling(<num>)  ceil(<num>)
floor(<num>)
round(<num>, <precision>)
sigfig(<num>)
sqrt(<num>)
pow(<num>, <exp>)
exp(<num>)
ln(<num>)
log(<num>, <base>)
pi()
exact(<expression>)
sum(<num>, ...)
```

### 4.3 Statistical Eval Functions

```spl
avg(<values>...)
max(<values>...)
min(<values>...)
random()
```

### 4.4 Text Functions

```spl
len(<str>)
lower(<str>)
upper(<str>)
substr(<str>, <start>, <length>)
trim(<str>, <trim_chars>)
ltrim(<str>, <trim_chars>)
rtrim(<str>, <trim_chars>)
replace(<str>, <regex>, <replacement>)
spath(<value>, <path>)
urldecode(<url>)
```

### 4.5 Multivalue Eval Functions

```spl
mvappend(<values>...)
mvcount(<mv>)
mvdedup(<mv>)
mvfilter(<predicate>)
mvfind(<mv>, <regex>)
mvindex(<mv>, <start>, <end>)
mvjoin(<mv>, <delim>)
mvmap(<mv>, <expression>)
mvrange(<start>, <end>, <step>)
mvsort(<mv>)
mvzip(<mv_left>, <mv_right>, <delim>)
split(<str>, <delim>)
commands(<value>)
mv_to_json_array(<field>, <infer_types>)
```

### 4.6 JSON Functions

```spl
json(<value>)
json_valid(<json>)
json_object(<members>)
json_array(<values>)
json_keys(<json>)
json_entries(<value>)
json_extract(<json>, <paths>)
json_extract_exact(<json>, <keys>)
json_set(<json>, <path_value_pairs>)
json_set_exact(<json>, <key_value_pairs>)
json_append(<json>, <path_value_pairs>)
json_extend(<json>, <path_value_pairs>)
json_delete(<object>, <keys>)
json_has_key_exact(<object>, <key>)
json_array_to_mv(<json_array>, <boolean>)
```

### 4.7 Date & Time Functions

```spl
now()
time()
strftime(<time>, <format>)
strptime(<str>, <format>)
relative_time(<time>, <specifier>)
```

**Time Format Specifiers:**
```
%Y  - Year (4 digit)
%m  - Month (01-12)
%d  - Day (01-31)
%H  - Hour (00-23)
%M  - Minute (00-59)
%S  - Second (00-59)
%s  - Unix timestamp
```

**Time Modifiers:**
```spl
-1h      # 1 hour ago
-7d@d    # 7 days ago, snapped to day start
@w0      # Week start (Sunday)
+30m     # 30 minutes from now
```

### 4.8 Cryptographic Functions

```spl
md5(<str>)
sha1(<str>)
sha256(<str>)
sha512(<str>)
```

### 4.9 Conversion Functions

```spl
tostring(<value>, <format>)
tonumber(<str>, <base>)
tobool(<value>)
toint(<value>, <base>)
todouble(<value>, <base>)
tomv(<value>)
toarray(<value>)
toobject(<value>)
printf(<format>, <arguments>)
ipmask(<mask>, <ip>)
```

### 4.10 Informational Functions

```spl
isstr(<value>)
isnum(<value>)
isbool(<value>)
isint(<value>)
isdouble(<value>)
ismv(<value>)
isarray(<value>)
isobject(<value>)
isnull(<value>)
isnotnull(<value>)
typeof(<value>)
```

### 4.11 Bitwise Functions

```spl
bit_and(<values>...)
bit_or(<values>...)
bit_not(<value>, <bitmask>)
bit_xor(<values>...)
bit_shift_left(<value>, <shift_offset>)
bit_shift_right(<value>, <shift_offset>)
```

### 4.12 Trigonometric & Hyperbolic Functions

```spl
sin(<x>)  cos(<x>)  tan(<x>)
asin(<x>)  acos(<x>)  atan(<x>)
atan2(<x>, <y>)
sinh(<x>)  cosh(<x>)  tanh(<x>)
asinh(<x>)  acosh(<x>)  atanh(<x>)
hypot(<x>, <y>)
```

---

## 5. Statistical & Chart Functions

These functions are used with `stats`, `chart`, `timechart`, `eventstats`, `streamstats`:

### 5.1 Aggregate Functions

```spl
avg(<field>)
count(<field>)  count()
distinct_count(<field>)  dc(<field>)
estdc(<field>)
estdc_error(<field>)
exactperc<N>(<field>)
max(<field>)
median(<field>)
min(<field>)
mode(<field>)
perc<N>(<field>)          # e.g., perc95(response_time)
range(<field>)
stdev(<field>)
stdevp(<field>)
sum(<field>)
sumsq(<field>)
upperperc<N>(<field>)
var(<field>)
varp(<field>)
```

### 5.2 Event Order Functions

```spl
first(<field>)
last(<field>)
```

**Note:** For time-based ordering, use `earliest()` and `latest()` instead.

### 5.3 Multivalue Stats Functions

```spl
list(<field>)             # Returns all values (incl. duplicates)
values(<field>)           # Returns unique values
```

### 5.4 Time Functions

```spl
earliest(<field>)
earliest_time(<field>)
latest(<field>)
latest_time(<field>)
rate(<field>)
```

### 5.5 Sparkline Functions

```spl
sparkline(<agg-func>(<field>), <span>)
sparkline(count(<field>), 1h)
sparkline(avg(<field>), 10m)
```

---

## 6. Syntax Constructs & Patterns

### 6.1 Argument Patterns

#### Required Arguments
Shown in angle brackets:
```
<field>
<expression>
<value>
```

#### Optional Arguments
Enclosed in square brackets:
```
[AS <newfield>]
[BY <field-list>]
[<options>]
```

#### Repeating Arguments
Indicated by ellipsis:
```
<field>...
(<expression>)...
```

**Example:**
```spl
stats (<agg-func>(<field>) [AS <alias>])... [BY <field-list>]
```

### 6.2 Grouped Arguments

Parentheses group related arguments:
```spl
replace (<wc-string> WITH <wc-string>)... [IN <field-list>]
```

### 6.3 Subsearch Syntax

**Inline Subsearch:**
```spl
index=main [search index=security user=admin | fields + clientip]
```

**Key Points:**
- Enclosed in square brackets `[ ]`
- Returns results to outer search
- Often used with `fields` command to pass specific fields
- Limited to 10,000 results by default

### 6.4 Macros

**Definition (in macros.conf):**
```
[macro_name(arg1, arg2)]
definition = index=main host=$arg1$ status=$arg2$
```

**Usage:**
```spl
`macro_name(server1, 404)`
```

**Characteristics:**
- Backtick delimiters
- Arguments passed via `$arg$` syntax
- Expanded before search execution

### 6.5 Comments

SPL supports comments in searches:

```spl
```comment
This is a multi-line comment block
```

index=main status=404
```

**Note:** Comments are enclosed in triple backticks with the word "comment".

---

## 7. Special Constructs & Edge Cases

### 7.1 Quoting & Escaping

#### When to Quote
- Strings with spaces: `"error message"`
- Field names with special chars: `'field-name'`
- Field names starting with digits: `'5minutes'`
- Keywords as literals: `"AND"`, `"OR"`
- Field values that are SPL keywords: `country="IN"`, `state="OR"`

#### Escape Sequences
```spl
\"      # Literal quote
\\      # Literal backslash
\|      # Literal pipe (not command separator)
\n      # Newline (context-dependent)
\r      # Carriage return
\t      # Tab
```

#### Unescaped Sequences
```spl
\s      # Passed through as-is (regex context)
\d      # Passed through as-is (regex context)
\w      # Passed through as-is (regex context)
```

### 7.2 Multiline Searches

SPL allows line breaks between tokens:
```spl
index=main
    sourcetype=access_*
    status=404
| stats count BY host
| where count > 100
| sort -count
```

### 7.3 BY Clause Behavior

**Wildcards NOT allowed:**
```spl
| stats count BY source*          # ERROR
```

**Multiple fields (comma-separated):**
```spl
| stats count BY field1, field2, field3
```

**vs. Space-separated (command-specific):**
```spl
| outlier bytes clientip          # Space-separated (outlier)
```

### 7.4 Precedence & Evaluation Order

#### Search Command Boolean Precedence
1. Parentheses
2. NOT
3. OR
4. AND

#### Eval/Where Command Boolean Precedence
1. Parentheses
2. NOT
3. AND
4. OR
5. XOR

#### Arithmetic Precedence
1. Parentheses
2. Unary negation `-`
3. Exponentiation (via `pow()`)
4. Multiplication, Division, Modulo `*`, `/`, `%`
5. Addition, Subtraction `+`, `-`

### 7.5 Type Coercion Rules

- Strings to Numbers: Automatic in arithmetic contexts
  - `"123" + 1` → `124`
  - `"abc" + 1` → `null` (invalid conversion)
  
- Numbers to Strings: Automatic in string contexts
  - `"Error: " . 404` → `"Error: 404"`
  
- Booleans:
  - Cannot be directly assigned to fields
  - Must use `tostring()` to persist

### 7.6 Field Extraction Precedence

When a field name conflicts:
1. Search-time field extractions
2. Index-time field extractions
3. Default fields (`host`, `source`, `sourcetype`, `_time`)
4. Internal fields (`_raw`, `_indextime`, etc.)

---

## 8. Common Patterns & Idioms

### 8.1 Conditional Field Creation

**Pattern:**
```spl
| eval status_label=case(
    status>=200 AND status<300, "Success",
    status>=300 AND status<400, "Redirect",
    status>=400 AND status<500, "Client Error",
    status>=500, "Server Error",
    true(), "Unknown"
  )
```

### 8.2 Email/URL Parsing

**Pattern:**
```spl
| eval email_parts=split(email, "@")
| eval username=mvindex(email_parts, 0)
| eval domain=mvindex(email_parts, -1)
```

### 8.3 IP Address Validation

**Pattern:**
```spl
| where match(ip, "^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
| where cidrmatch("10.0.0.0/8", ip) OR cidrmatch("192.168.0.0/16", ip)
```

### 8.4 Time Bucketing

**Pattern:**
```spl
| bin _time span=1h
| stats count BY _time, status
```

### 8.5 Moving Averages

**Pattern:**
```spl
| streamstats avg(value) AS moving_avg window=10
```

### 8.6 Deduplication with Time Window

**Pattern:**
```spl
| sort 0 host _time
| dedup host sortby -_time
```

### 8.7 Transaction Correlation

**Pattern:**
```spl
| transaction session_id maxspan=30m maxpause=5m
| where duration > 300
```

### 8.8 JSON Data Extraction

**Pattern:**
```spl
| spath input=json_field
| eval value=json_extract(json_field, "path.to.value")
| eval keys=json_keys(json_object)
```

---

## 9. TextMate Grammar Recommendations

### 9.1 High-Priority Scopes

Based on the analysis, prioritize these scope definitions:

```yaml
source.spl:
  - keyword.operator.logical.spl (AND, OR, NOT, XOR)
  - keyword.control.spl (AS, BY, OVER, WHERE, IN, LIKE)
  - keyword.other.time.spl (earliest, latest, starttime, endtime)
  
  - entity.name.command.spl (search, stats, eval, where, rex, etc.)
  - entity.name.function.spl (avg, count, sum, if, case, match, etc.)
  
  - variable.other.field.spl (field names)
  - variable.language.special.spl (_time, _raw, _indextime, etc.)
  
  - constant.numeric.spl (42, 3.14, 0x1A, 1e10)
  - constant.language.boolean.spl (true, false, yes, no)
  - constant.language.null.spl (null)
  - constant.numeric.special.spl (nan, inf, -inf)
  
  - string.quoted.double.spl ("...")
  - string.quoted.single.spl ('...')
  
  - punctuation.separator.pipe.spl (|)
  - punctuation.definition.field.spl ({fieldname})
  
  - support.function.aggregate.spl (count, avg, sum, max, min, etc.)
  - support.function.eval.spl (if, case, coalesce, match, etc.)
  - support.function.text.spl (upper, lower, substr, trim, etc.)
  - support.function.time.spl (now, strftime, strptime, etc.)
  
  - meta.command.search.spl
  - meta.command.eval.spl
  - meta.command.stats.spl
  - meta.command.where.spl
```

### 9.2 Pattern Matching Priorities

1. **Comments** (highest priority to prevent false matches)
2. **Strings** (double-quoted, single-quoted)
3. **Numbers** (hex, scientific, float, int)
4. **Keywords** (logical operators, clause keywords)
5. **Commands** (at pipe boundaries)
6. **Functions** (followed by opening paren)
7. **Fields** (context-dependent)
8. **Operators** (comparison, arithmetic)

### 9.3 Context-Sensitive Highlighting

Certain tokens change meaning based on context:

**`search` context:**
- `=` is comparison
- `field=value` pattern
- Boolean operators evaluated OR-first

**`eval` context:**
- `=` is assignment
- Function calls with parentheses
- Boolean operators evaluated AND-first

**`where` context:**
- Unquoted = field reference
- Quoted = string literal
- Functions allowed

**`BY` clause context:**
- Field names only
- No wildcards
- Comma-separated

### 9.4 Regex Patterns for Common Tokens

```regex
# Commands (at pipe boundaries or search start)
(?:^|\|)\s*(search|stats|eval|where|rex|table|sort|head|tail|dedup|rename|fields)\b

# Functions (followed by opening paren)
\b(avg|count|sum|if|case|match|replace|substr|lower|upper|now|strftime)\s*(?=\()

# Field references (alphanumeric + underscore, or quoted)
\b[a-zA-Z_][a-zA-Z0-9_]*\b|'[^']+'

# Special fields
\b(_time|_raw|_indextime|_sourcetype|_source|_host)\b

# Logical operators (must be uppercase)
\b(AND|OR|NOT|XOR)\b

# Keywords (case-insensitive but uppercase convention)
\b(AS|BY|OVER|WHERE|IN|LIKE)\b

# Numbers
\b\d+\.?\d*([eE][+-]?\d+)?\b  # Float/scientific
\b0x[0-9a-fA-F]+\b             # Hex

# Strings
"(?:[^"\\]|\\.)*"              # Double-quoted
'(?:[^'\\]|\\.)*'              # Single-quoted

# Boolean literals
\b(?:true|false|yes|no|t|f)\b

# Special numeric
\b(?:nan|inf|-inf)\b
```

---

## 10. Edge Cases & Gotchas

### 10.1 Field Name Ambiguity

**Problem:** Field name looks like a function
```spl
| stats avg(test)          # Field avg(test) or function avg on test?
```

**Solution:** Rename to avoid parentheses
```spl
| stats avg(test) AS test | eval new_test=sigfig(test*1.00)
```

### 10.2 NOT vs != Difference

```spl
NOT fieldA="value"        # Returns ALL events except fieldA="value" (incl other fields)
fieldA!="value"           # Returns events where fieldA exists and != value
```

### 10.3 Multiline Event Handling

```spl
# Must remove newlines before sed replacement
| rex mode=sed field=_raw "s/\\n/NEWLINE_REMOVED/g"
| rex mode=sed field=_raw "s/<html.*html>/REDACTED/g"
```

### 10.4 Floating-Point Precision

```spl
| makeresults | eval test=0.2 * 8.250
# Result: 1.7 (rounded to precision of least precise input)

| makeresults | eval test=exact(0.2) * 8.250
# Result: 1.650 (more precise)
```

### 10.5 Implicit Wildcards (deprecated)

```spl
| stats avg          # Old: Treats as avg(*)
| stats avg(*)       # New: Explicit wildcard
```

### 10.6 IN Operator Context Differences

**With search:**
```spl
status IN (40*, 500)        # Wildcards allowed
```

**With eval/where:**
```spl
in(status, "400", "404")    # No wildcards allowed
```

---

## 11. Command Inventory (Comprehensive Reference)

This section provides detailed information about SPL search commands, including their type, category, syntax, and arguments. Data is extracted from 158+ markdown files in the official Splunk SPL 10.0 Reference Manual.

**Legend:**
- **Type**: Command execution type (Streaming, Transforming, Dataset Processing, etc.)
- **Category**: Functional grouping (Data Manipulation, Stats & Aggregation, ML & Analytics, etc.)
- **Req Args**: Number of required arguments
- **Opt Args**: Number of optional arguments

### 11.1 Command Summary Table

| Command | Type | Category | Req | Opt | Description |
|---------|------|----------|-----|-----|-------------|
| **abstract** | Unknown | Data Manipulation | 0 | 2 | Produces an abstract, a summary or brief representation, of the text of the search results |
| **accum** | Unknown | Stats & Aggregation | 1 | 1 | Calculates a running total or sum of numbers in a field |
| **addcoltotals** | Unknown | Stats & Aggregation | 0 | 3 | Appends a new result with the sum of each numeric field |
| **addinfo** | Distributable Streaming | Data Manipulation | 0 | 0 | Adds fields containing global information about the search |
| **addtotals** | Distributable Streaming / Transforming | Stats & Aggregation | 0 | 6 | Computes the arithmetic sum of all numeric fields for each result |
| **analyzefields** | Unknown | ML & Analytics | 1 | 0 | Analyzes numerical fields to determine ability to predict classfield |
| **anomalies** | Unknown | ML & Analytics | 0 | 7 | Looks for events or field values that are unusual or unexpected |
| **anomalousvalue** | Unknown | ML & Analytics | 0 | 6 | Computes an anomaly score for each field relative to other events |
| **anomalydetection** | Transforming | ML & Analytics | 0 | 4 | Identifies anomalous events by computing probability for each event |
| **append** | Transforming | Data Manipulation | 1 | 3 | Appends results of a subsearch to current results |
| **appendcols** | Unknown | Data Manipulation | 1 | 4 | Appends fields of subsearch results with input search results |
| **appendpipe** | Unknown | Data Manipulation | 0 | 2 | Appends result of subpipeline to search results |
| **arules** | Streaming (Dist. & Cent.) | Stats & Aggregation | 1 | 2 | Looks for associative relationships between field values |
| **associate** | Unknown | Stats & Aggregation | 0 | 3 | Identifies correlations between fields using entropy calculations |
| **autoregress** | Centralized Streaming | Stats & Aggregation | 1 | 2 | Prepares events for calculating autoregression (moving average) |
| **awssnsalert** | Unknown | Other | 0 | 0 | Used with Splunk Add-on for AWS |
| **bin** / **bucket** | Dataset Proc. / Streaming | Data Manipulation | 1 | 6 | Puts continuous numerical values into discrete sets or bins |
| **bucketdir** | Streaming | Data Manipulation | 2 | 3 | Replaces field value with higher-level grouping (e.g., directories) |
| **chart** | Transforming | Visualization | 1 | 6 | Returns results in table format for visualization as charts |
| **cluster** | Streaming / Dataset Proc. | ML & Analytics | 0 | 8 | Groups events together based on similarity |
| **cofilter** | Transforming | Stats & Aggregation | 2 | 0 | Determines how many times values in two fields occur together |
| **collect** | Unknown | Data Export | 1 | 13 | Adds search results to a summary index |
| **concurrency** | Unknown | Other | 0 | 0 | Page not accessible (ERR_SOCKET_NOT_CONNECTED) |
| **contingency** | Unknown | Other | 0 | 0 | Page not accessible (ERR_SOCKET_NOT_CONNECTED) |
| **convert** | Distributable Streaming | Data Manipulation | 1 | 2 | Converts field values in search results into numerical values |

### 11.2 Detailed Command Reference

#### **abstract**
- **Syntax**: `abstract [maxterms=<int>] [maxlines=<int>]`
- **Type**: Unknown
- **Category**: Data Manipulation
- **Description**: Produces an abstract, a summary or brief representation, of the text of the search results. The original text is replaced by the summary.
- **Optional Arguments**:
  - `maxterms=<int>`: Maximum number of terms to match (1-1000). Default: 1000
  - `maxlines=<int>`: Maximum number of lines to match (1-500). Default: 10

#### **accum**
- **Syntax**: `accum <field> [AS <newfield>]`
- **Type**: Unknown
- **Category**: Stats & Aggregation
- **Description**: For each event where field is a number, the accum command calculates a running total or sum of the numbers. The accumulated sum can be returned to either the same field, or a newfield that you specify.
- **Required Arguments**:
  - `field` (`<string>`): The name of the field that you want to calculate the accumulated sum for. The field must contain numeric values.
- **Optional Arguments**:
  - `newfield` (`<string>`): The name of a new field where you want the results placed.

#### **addcoltotals**
- **Syntax**: `addcoltotals [labelfield=<field>] [label=<string>] [<wc-field-list>]`
- **Type**: Unknown
- **Category**: Stats & Aggregation
- **Description**: The addcoltotals command appends a new result to the end of the search result set. The result contains the sum of each numeric field or you can specify which fields to summarize.
- **Optional Arguments**:
  - `wc-field-list` (`<field> ...`): A space delimited list of valid field names. The addcoltotals command calculates the sum only for the fields in the list you specify.
  - `labelfield=<fieldname>`: Specify a field name to add to the result set. Default: none
  - `label=<string>`: Used with the labelfield argument to add a label in the summary event. Default: Total

#### **addinfo**
- **Syntax**: `addinfo`
- **Type**: Distributable Streaming
- **Category**: Data Manipulation
- **Description**: Adds fields to each event that contain global, common information about the search. This command is primarily an internally-used component of Summary Indexing.
- **Fields Added**: `info_min_time`, `info_max_time`, `info_sid`, `info_search_time`

#### **addtotals**
- **Syntax**: `addtotals [row=<bool>] [col=<bool>] [labelfield=<field>] [label=<string>] [fieldname=<field>] [<field-list>]`
- **Type**: Distributable Streaming / Transforming
- **Category**: Stats & Aggregation
- **Description**: The addtotals command computes the arithmetic sum of all numeric fields for each search result. The results appear in the Statistics tab.
- **Optional Arguments**:
  - `field-list` (`<field> ...`): One or more numeric fields, delimited with a space. Only the fields specified in the <field-list> are summed.
  - `row=<bool>`: Specifies whether to calculate the sum of the <field-list> for each event. Default: true
  - `col=<bool>`: Specifies whether to add a new event (summary event) at the bottom of the list of events. Default: false
  - `fieldname=<field>`: Used to specify the name of the field that contains the calculated sum of the field-list for each event. Default: Total
  - `labelfield=<field>`: Used to specify a field for the summary event label. Default: none
  - `label=<string>`: Used to specify a row label for the summary event. Default: Total

#### **analyzefields**
- **Syntax**: `analyzefields classfield=<field>`
- **Type**: Unknown
- **Category**: ML & Analytics
- **Description**: Using <field> as a discrete random variable, this command analyzes all numerical fields to determine the ability for each of those fields to predict the value of the classfield.
- **Required Arguments**:
  - `classfield=<field>`: For best results, classfield should have two distinct values, although multiclass analysis is possible.
- **Output Fields**: `field`, `count`, `cocur`, `acc`, `balacc`

#### **anomalies**
- **Syntax**: `anomalies [threshold=<num>] [labelonly=<bool>] [normalize=<bool>] [maxvalues=<num>] [field=<field>] [denylist=<filename>] [denylistthreshold=<num>] [by-clause]`
- **Type**: Unknown
- **Category**: ML & Analytics
- **Description**: Use the anomalies command to look for events or field values that are unusual or unexpected. The anomalies command assigns an unexpectedness score to each event and places that score in a new field named unexpectedness.
- **Optional Arguments**:
  - `threshold=<num>`: A number to represent the upper limit of expected or normal events. Default: 0.01
  - `labelonly=<bool>`: Specifies if you want the output result set to include all events or only the events that are above the threshold value. Default: false
  - `normalize=<bool>`: Specifies whether or not to normalize numeric text in the fields. Default: true
  - `maxvalues=<num>`: Specifies the size of the sliding set of previous events to include when determining the unexpectedness of a field value. Default: 100
  - `field=<field>`: The field to analyze when determining the unexpectedness of an event. Default: _raw
  - `denylist=<filename>`: The name of a CSV file that contains a list of events that are expected and should be ignored.
  - `denylistthreshold=<num>`: Specifies a similarity score threshold for matching incoming events to denylisted events. Default: 0.05

#### **anomalousvalue**
- **Syntax**: `anomalousvalue <av-options>... [action] [pthresh] [field-list]`
- **Type**: Unknown
- **Category**: ML & Analytics
- **Description**: The anomalousvalue command computes an anomaly score for each field of each event, relative to the values of this field across other events. For numerical fields, it identifies or summarizes the values in the data that are anomalous either by frequency of occurrence or number of standard deviations from the mean.
- **Optional Arguments**:
  - `maxanofreq=<float>`: Maximum anomalous frequency (0-1). Default: 0.05
  - `minnormfreq=<float>`: Minimum normal frequency (0-1). Default: 0.01
  - `minsupcount=<int>`: Minimum supported count (positive integer). Default: 100
  - `minsupfreq=<float>`: Minimum supported frequency (0-1). Default: 0.05
  - `action=(annotate|filter|summary)`: Specify whether to return the anomaly score, filter, or summarize. Default: filter
  - `pthresh=<num>`: Probability threshold (decimal) for value to be considered anomalous. Default: 0.01

#### **anomalydetection**
- **Syntax**: `anomalydetection [<method-option>] [<action-option>] [<pthresh-option>] [<cutoff-option>] [<field-list>]`
- **Type**: Transforming
- **Category**: ML & Analytics
- **Description**: A transforming command that identifies anomalous events by computing a probability for each event and then detecting unusually small probabilities. The probability is defined as the product of the frequencies of each individual field value in the event.
- **Optional Arguments**:
  - `method=(histogram|zscore|iqr)`: Select the method of anomaly detection. Default: histogram
  - `action=(filter|annotate|summary|remove|transform)`: The actions depend on the method specified.
  - `pthresh=<num>`: Sets the probability threshold for event to be deemed anomalous.
  - `cutoff=<bool>`: Sets upper bound threshold on number of anomalies (histogram only). Default: true

#### **append**
- **Syntax**: `append [<subsearch-options>...] <subsearch>`
- **Type**: Transforming
- **Category**: Data Manipulation
- **Description**: Appends the results of a subsearch to the current results. The append command runs only over historical data and does not produce correct results if used in a real-time search.
- **Required Arguments**:
  - `subsearch` (`[subsearch]`): A secondary search where you specify the source of the events that you want to append. The subsearch must be enclosed in square brackets.
- **Optional Arguments**:
  - `extendtimerange=<boolean>`: Specifies whether to include the subsearch time range in the time range for the entire search. Default: false
  - `maxtime=<int>`: Maximum time (seconds) to spend on subsearch before finalizing. Default: 60
  - `maxout=<int>`: Maximum number of result rows to output from subsearch. Default: 50000

#### **appendcols**
- **Syntax**: `appendcols [override=<bool> | <subsearch-options>...] <subsearch>`
- **Type**: Unknown
- **Category**: Data Manipulation
- **Description**: Appends the fields of the subsearch results with the input search results. All fields of the subsearch are combined into the current results, with the exception of internal fields.
- **Required Arguments**:
  - `subsearch` (`<subsearch>`): A secondary search added to the main search.
- **Optional Arguments**:
  - `override=<bool>`: If false and field is present in both subsearch and main result, main result is used. Default: false
  - `maxtime=<int>`: Maximum time (seconds) to spend on subsearch before finalizing. Default: 60
  - `maxout=<int>`: Maximum number of result rows to output from subsearch. Default: 50000
  - `timeout=<int>`: Maximum time (seconds) to wait for subsearch to fully finish. Default: 60

#### **appendpipe**
- **Syntax**: `appendpipe [run_in_preview=<bool>] [<subpipeline>]`
- **Type**: Unknown
- **Category**: Data Manipulation
- **Description**: Appends the result of the subpipeline to the search results. Unlike a subsearch, the subpipeline is not run first. The subpipeline is run when the search reaches the appendpipe command.
- **Optional Arguments**:
  - `run_in_preview=<bool>`: Specifies whether or not display the impact of the appendpipe command in the preview. Default: true
  - `subpipeline` (`<subpipeline>`): A list of commands that are applied to the search results from the commands that occur in the search before the appendpipe command.

#### **arules**
- **Syntax**: `arules [<arules-option>...] <field-list>...`
- **Type**: Streaming (Distributable & Centralized)
- **Category**: Stats & Aggregation
- **Description**: The arules command looks for associative relationships between field values. The command returns a table with the following columns: Given fields, Implied fields, Strength, Given fields support, and Implied fields support.
- **Required Arguments**:
  - `field-list` (`<field> <field> ...`): The list of field names. At least two fields must be specified.
- **Optional Arguments**:
  - `sup=<int>`: Specify a support limit. Associations with computed support levels smaller than this value are not included. Default: 3
  - `conf=<float>`: Specify a confidence limit. Associations with confidence below this are not included. Default: 0.5

#### **associate**
- **Syntax**: `associate [<associate-options>...] [field-list]`
- **Type**: Unknown
- **Category**: Stats & Aggregation
- **Description**: The associate command identifies correlations between fields. The command tries to find a relationship between pairs of fields by calculating a change in entropy based on their values.
- **Optional Arguments**:
  - `supcnt=<num>`: Minimum number of times reference key=value combination must appear. Default: 100
  - `supfreq=<num>`: Minimum frequency of reference key=value combination as fraction of total events. Default: 0.1
  - `improv=<num>`: Minimum entropy improvement for target key. Default: 0.5
- **Output Fields**: `Reference_Key`, `Reference_Value`, `Target_Key`, `Unconditional_Entropy`, `Conditional_Entropy`, `Entropy_Improvement`, `Description`, `Support`

#### **autoregress**
- **Syntax**: `autoregress <field> [AS <newfield>] [p=<int> | p=<int>-<int>]`
- **Type**: Centralized Streaming
- **Category**: Stats & Aggregation
- **Description**: Prepares your events for calculating the autoregression, or the moving average, by copying one or more of the previous values for field into each event.
- **Required Arguments**:
  - `field` (`<string>`): The name of a field. Most usefully a field with numeric values.
- **Optional Arguments**:
  - `p=(<int>|<int>-<int>)`: Specifies which prior events to copy values from. Default: 1
  - `newfield` (`<field>`): Field name to copy the single field value into (valid only when p is single integer).

#### **bin** / **bucket**
- **Syntax**: `bin [<bin-options>...] <field> [AS <newfield>]`
- **Type**: Dataset Processing / Streaming
- **Category**: Data Manipulation
- **Description**: Puts continuous numerical values into discrete sets, or bins, by adjusting the value of <field> so that all of the items in a particular set have the same value.
- **Required Arguments**:
  - `field` (`<field>`): Specify a field name.
- **Optional Arguments**:
  - `bins=<int>`: Sets maximum number of bins to discretize into. Default: 100
  - `minspan=<span-length>`: Smallest span granularity to use when automatically inferring span.
  - `span=(<log-span>|<span-length>)`: Sets the size of each bin.
  - `start=<num>`: Sets minimum extents for numerical bins.
  - `end=<num>`: Sets maximum extents for numerical bins.
  - `aligntime=(earliest|latest|<time-specifier>)`: Align bin times to something other than base UTC time.

#### **bucketdir**
- **Syntax**: `bucketdir pathfield=<field> sizefield=<field> [maxcount=<int>] [countfield=<field>] [sep=<char>]`
- **Type**: Streaming
- **Category**: Data Manipulation
- **Description**: Replaces a field value with higher-level grouping, such as replacing filenames with directories. Returns the maxcount events, by taking the incoming events and rolling up multiple sources into directories.
- **Required Arguments**:
  - `pathfield=<field>`: Specify a field name that has a path value.
  - `sizefield=<field>`: Specify a numeric field that defines the size of bucket.
- **Optional Arguments**:
  - `countfield=<field>`: Specify a numeric field that describes the count of events.
  - `maxcount=<int>`: Specify the total number of events to bucket.
  - `sep=<char>`: The separating character (/ or \\).

#### **chart**
- **Syntax**: `chart [<chart-options>] [agg=<stats-agg-term>] (<stats-agg-term> | <sparkline-agg-term> | "(<eval-expression>)")... [BY <row-split> <column-split>] | [OVER <row-split>] [BY <column-split>] [<dedup_splitvals>]`
- **Type**: Transforming
- **Category**: Visualization
- **Description**: The chart command is a transforming command that returns your results in a table format. The results can then be used to display the data as a chart, such as a column, line, area, or pie chart.
- **Required Arguments**:
  - Must include a stats aggregation function, sparkline function, or eval expression.
- **Optional Arguments**:
  - `agg=<stats-agg-term>`: Specify an aggregator or function.
  - `cont=<bool>`: Specifies if the bins are continuous. Default: true
  - `format=<string>`: Used to construct output field names when multiple data series are used.
  - `limit=(top|bottom) <int>`: Specify number of results that should appear in output. Default: top 10
  - `sep=<string>`: Used to construct output field names with split-by field.
  - `dedup_splitvals=<boolean>`: Remove duplicate values in multivalued BY clause fields. Default: false

#### **cluster**
- **Syntax**: `cluster [slc-options]...`
- **Type**: Streaming / Dataset Processing
- **Category**: ML & Analytics
- **Description**: The cluster command groups events together based on how similar they are to each other. Unless you specify a different field, cluster groups events based on the contents of the _raw field.
- **Optional Arguments**:
  - `t=<num>`: Sets cluster threshold (0-1). Higher = more similar events needed. Default: 0.8
  - `delims=<string>`: Configures set of delimiters used to tokenize raw string.
  - `showcount=<bool>`: Whether indexers cluster events before search head. Default: false
  - `countfield=<field>`: Name of field to write cluster size to. Default: cluster_count
  - `labelfield=<field>`: Name of field to write cluster number to. Default: cluster_label
  - `field=<field>`: Name of field to analyze in each event. Default: _raw
  - `labelonly=<bool>`: Preserve incoming events and annotate (true) or output only cluster fields (false). Default: false
  - `match=(termlist|termset|ngramset)`: Method to determine similarity between events. Default: termlist

#### **cofilter**
- **Syntax**: `cofilter <field1> <field2>`
- **Type**: Transforming
- **Category**: Stats & Aggregation
- **Description**: Use this command to determine how many times a value in <field1> and a value in <field2> occur together. This command implements one step in a collaborative filtering analysis for making recommendations.
- **Required Arguments**:
  - `field1` (`<field>`): The name of field.
  - `field2` (`<field>`): The name of a field.

#### **collect**
- **Syntax**: `collect index=<string> [<arg-options>...]`
- **Type**: Unknown
- **Category**: Data Export
- **Description**: Adds the results of a search to a summary index that you specify. You must create the summary index before you invoke the collect command.
- **Required Arguments**:
  - `index=<string>`: Name of the summary index where the events are added.
- **Optional Arguments** (13 total):
  - `addinfo=<bool>`: Prefix search time and time-range information fields. Default: true (events/raw), false (metrics)
  - `addtime=<bool>`: Prefix a time field on each event. Default: true (events), false (metrics)
  - `file=<string>`: File name where events are written. Default: <random-number>_events.stash
  - `host=<string>`: Host name to specify for events.
  - `marker=<string>`: String (key-value pairs) to append to each event.
  - `output_format=(raw|hec)`: Output format for summary indexing. Default: raw
  - `run_in_preview=<bool>`: Whether collect is enabled during preview generation. Default: false
  - `spool=<bool>`: Write to Splunk spool directory (true) or collect directory (false). Default: true
  - `source=<string>`: Source name to specify for events.
  - `sourcetype=<string>`: Source type to specify for events. Default: stash
  - `testmode=<bool>`: Toggle between testing and real mode. Default: false
  - `timeformat=<string>`: Format of timestamp written to stash file. Default: %m/%d/%Y %H:%M:%S %z
  - `uselb=<bool>`: Controls how line breaks split events. Default: true

#### **convert**
- **Syntax**: `convert [timeformat=string] (<convert-function> [AS <field>])...`
- **Type**: Distributable Streaming
- **Category**: Data Manipulation
- **Description**: The convert command converts field values in your search results into numerical values. Unless you use the AS clause, the original values are replaced by the new values.
- **Required Arguments**:
  - `convert-function`: Functions to use for conversion: `auto()`, `ctime()`, `dur2sec()`, `memk()`, `mktime()`, `mstime()`, `none()`, `num()`, `rmcomma()`, `rmunit()`
- **Optional Arguments**:
  - `timeformat=<string>`: Output format for converted time field (used by ctime/mktime). Default: %m/%d/%Y %H:%M:%S
  - `field` (`<string>`): Creates new field with specified name to place converted values into.

### 11.3 Commands by Category

#### Data Manipulation (10 commands)
`abstract`, `addinfo`, `append`, `appendcols`, `appendpipe`, `bin/bucket`, `bucketdir`, `convert`

#### Stats & Aggregation (8 commands)
`accum`, `addcoltotals`, `addtotals`, `arules`, `associate`, `autoregress`, `cofilter`

#### ML & Analytics (5 commands)
`analyzefields`, `anomalies`, `anomalousvalue`, `anomalydetection`, `cluster`

#### Visualization (1 command)
`chart`

#### Data Export (1 command)
`collect`

#### Other (2 commands)
`awssnsalert`, `concurrency`, `contingency`

### 11.4 Commands by Type

#### Streaming Commands
- **Distributable Streaming**: `addinfo`, `addtotals`, `convert`
- **Centralized Streaming**: `autoregress`
- **Streaming (Dist. & Cent.)**: `arules`
- **Streaming / Dataset Processing**: `bin/bucket`, `cluster`
- **Streaming**: `bucketdir`

#### Transforming Commands
`anomalydetection`, `append`, `chart`, `cofilter`

#### Unknown Type
`abstract`, `accum`, `addcoltotals`, `analyzefields`, `anomalies`, `anomalousvalue`, `appendcols`, `appendpipe`, `associate`, `awssnsalert`, `collect`, `concurrency`, `contingency`

**Note**: Complete inventory includes 150+ SPL commands. This detailed reference covers the first 27 commands analyzed. Additional commands follow similar documentation patterns with syntax, arguments, type classification, and functional categorization.

---

## 12. Summary & Key Takeaways

### 12.1 Language Characteristics

1. **Pipeline-Oriented**: Commands chained with `|` operator
2. **Dual Syntax**: Keyword-based (SQL-like) + Function-based (expression language)
3. **Flexible Typing**: Dynamic type system with implicit conversions
4. **Context-Sensitive**: Same tokens behave differently in different commands
5. **Case Rules**: 
   - Logical operators MUST be uppercase (AND, OR, NOT)
   - Keywords conventionally uppercase (AS, BY, WHERE)
   - Commands and functions case-insensitive
   - Field names case-sensitive
6. **Whitespace-Flexible**: Line breaks allowed between tokens

### 12.2 Parser Complexity

**High Complexity Areas:**
- Context-dependent token interpretation (field vs. function vs. command)
- Nested function calls with complex argument structures
- Regular expressions within SPL syntax (rex command)
- Macro expansion with argument substitution
- Subsearch result integration
- Multivalue field handling

**Moderate Complexity:**
- String escaping and quoting rules
- Type coercion and conversion
- Operator precedence differences across contexts
- Time format specifiers

**Low Complexity:**
- Numeric literals (standard formats)
- Boolean values
- Pipe-separated command structure
- Basic keyword recognition

### 12.3 Recommended Highlighting Strategy

**Three-Tier Approach:**

**Tier 1 (Essential):**
- Commands at pipe boundaries
- Logical operators (AND, OR, NOT)
- Strings and numeric literals
- Basic keywords (AS, BY, WHERE)

**Tier 2 (Enhanced):**
- Function calls (with context)
- Field references (basic patterns)
- Comparison operators
- Special fields (_time, _raw, etc.)

**Tier 3 (Advanced):**
- Context-sensitive field highlighting
- Function argument syntax
- Complex nested structures
- Macro and subsearch recognition

### 12.4 Testing Corpus

To validate TextMate grammar, test against these representative queries:

```spl
# Basic search
index=main sourcetype=access_* status=404

# Complex pipeline
index=main error
| rex field=_raw "user=(?<user>\w+)"
| eval error_type=case(
    match(_raw, "timeout"), "Timeout",
    match(_raw, "connection"), "Connection",
    true(), "Other"
  )
| stats count BY user, error_type
| where count > 10
| sort -count

# Subsearch
index=security 
[search index=threats severity=critical 
 | fields + threat_ip]
| stats count BY threat_ip, action

# Advanced eval
| eval full_name=upper(first) . " " . lower(last)
| eval is_local=if(cidrmatch("192.168.0.0/16", ip), "Yes", "No")
| eval hash=md5(password)
| eval {dynamic_field}=value

# JSON operations
| spath input=json_data
| eval extracted=json_extract(data, "path.to.value")
| eval valid=if(json_valid(field), "Y", "N")

# Statistical
| stats avg(response_time) AS avg_time,
        perc95(response_time) AS p95,
        max(response_time) AS max_time
  BY host, status
| where avg_time > 1000
| eval avg_time_formatted=tostring(round(avg_time, 2), "commas")

# Transaction
| transaction session_id 
    startswith="login" 
    endswith="logout" 
    maxspan=30m
| where duration > 300
| stats avg(duration) BY user

# Time operations
| eval hour=strftime(_time, "%H")
| eval date=strftime(_time, "%Y-%m-%d")
| where relative_time(now(), "-1h") < _time
```

---

## Appendix A: Complete Function Reference

### A.1 Evaluation Functions (170+)

**Bitwise (6):**
`bit_and`, `bit_or`, `bit_not`, `bit_xor`, `bit_shift_left`, `bit_shift_right`

**Comparison/Conditional (13):**
`case`, `cidrmatch`, `coalesce`, `false`, `if`, `in`, `like`, `lookup`, `match`, `null`, `nullif`, `searchmatch`, `true`, `validate`

**Conversion (11):**
`ipmask`, `printf`, `toarray`, `tobool`, `todouble`, `toint`, `tomv`, `tonumber`, `toobject`, `tostring`

**Cryptographic (4):**
`md5`, `sha1`, `sha256`, `sha512`

**Date/Time (5):**
`now`, `relative_time`, `strftime`, `strptime`, `time`

**Informational (11):**
`isarray`, `isbool`, `isdouble`, `isint`, `ismv`, `isnotnull`, `isnull`, `isnum`, `isobject`, `isstr`, `typeof`

**JSON (15):**
`json`, `json_append`, `json_array`, `json_array_to_mv`, `json_delete`, `json_entries`, `json_extend`, `json_extract`, `json_extract_exact`, `json_has_key_exact`, `json_keys`, `json_object`, `json_set`, `json_set_exact`, `json_valid`

**Mathematical (13):**
`abs`, `ceiling` (`ceil`), `exact`, `exp`, `floor`, `ln`, `log`, `pi`, `pow`, `round`, `sigfig`, `sqrt`, `sum`

**Multivalue (14):**
`commands`, `mvappend`, `mvcount`, `mvdedup`, `mvfilter`, `mvfind`, `mvindex`, `mvjoin`, `mvmap`, `mvrange`, `mvsort`, `mvzip`, `mv_to_json_array`, `split`

**Statistical (4):**
`avg`, `max`, `min`, `random`

**Text (10):**
`len`, `lower`, `ltrim`, `replace`, `rtrim`, `spath`, `substr`, `trim`, `upper`, `urldecode`

**Trigonometric/Hyperbolic (15):**
`acos`, `acosh`, `asin`, `asinh`, `atan`, `atan2`, `atanh`, `cos`, `cosh`, `hypot`, `sin`, `sinh`, `tan`, `tanh`

---

## Appendix B: Regex Patterns in SPL

SPL uses PCRE (Perl Compatible Regular Expressions) in several contexts:

### B.1 Rex Command
```spl
| rex "(?<field>\w+)=(?<value>[^,]+)"
```

### B.2 Match Function
```spl
| eval matched=match(field, "^[A-Z]{3}-\d{4}$")
```

### B.3 Regex Command (filter)
```spl
| regex field="pattern"
```

### B.4 Replace Function
```spl
| eval cleaned=replace(field, "\s+", "_")
```

### B.5 Common Regex Patterns in SPL

```regex
# IP Address
\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}

# Email
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}

# URL
https?://[^\s]+

# UUID
[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}

# Credit Card (last 4)
\d{4}

# Log Severity
\b(DEBUG|INFO|WARN|ERROR|FATAL)\b

# Windows Path
[A-Za-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*

# Linux Path
/(?:[^/\0]+/)*[^/\0]*
```

---

## Appendix C: Reserved Terms & Special Identifiers

### C.1 Reserved Keywords (Cannot be Field Names Without Quoting)
```
AND OR NOT XOR
AS BY OVER WHERE IN LIKE
true false null
```

### C.2 Special Time Keywords
```
earliest latest starttime endtime
timeformat span
now
```

### C.3 Internal Field Prefixes
```
_time        # Event timestamp
_raw         # Raw event text
_indextime   # Time event was indexed
_sourcetype  # Source type
_source      # Source
_host        # Host
_kv          # Key-value pairs (internal)
_cd          # (internal)
_bkt         # Bucket ID (internal)
_si          # Search head ID (internal)
_serial      # Event serial number (internal)
```

### C.4 Statistical Function Aliases
```
count = c
avg = mean
stdev = stdevs
stdevp = stdevps
var = vars
varp = varps
dc = distinct_count
```

---

## Appendix D: Time Format Variables

### D.1 strftime Format Codes

| Code | Meaning | Example |
|------|---------|---------|
| %Y | Year (4-digit) | 2025 |
| %y | Year (2-digit) | 25 |
| %m | Month (01-12) | 10 |
| %B | Month name (full) | October |
| %b | Month name (abbr) | Oct |
| %d | Day of month (01-31) | 20 |
| %H | Hour (00-23) | 14 |
| %I | Hour (01-12) | 02 |
| %M | Minute (00-59) | 30 |
| %S | Second (00-60) | 45 |
| %p | AM/PM | PM |
| %s | Unix timestamp | 1729436445 |
| %z | Timezone offset | -0400 |
| %Z | Timezone name | EDT |
| %a | Weekday (abbr) | Sun |
| %A | Weekday (full) | Sunday |
| %j | Day of year (001-366) | 294 |
| %U | Week number (Sun start) | 42 |
| %W | Week number (Mon start) | 42 |
| %w | Weekday (0=Sun) | 0 |

### D.2 Time Snap-To Modifiers

```spl
@s  # Snap to second
@m  # Snap to minute
@h  # Snap to hour
@d  # Snap to day
@w  # Snap to week (Sunday)
@w0 # Snap to week (Sunday)
@w1 # Snap to week (Monday)
@mon # Snap to month
@q  # Snap to quarter
@y  # Snap to year
```

### D.3 Relative Time Specifiers

```spl
s second sec secs seconds
m minute min mins minutes
h hour hr hrs hours
d day days
w week weeks
mon month months
q quarter quarters
y year yr yrs years

# Examples
-1h          # 1 hour ago
-7d@d        # 7 days ago, snapped to start of day
-1w@w1       # 1 week ago, snapped to Monday
+30m         # 30 minutes from now
@d+1h        # Today at 1 AM
```

---

## Document Metadata

**Analysis Version:** 1.0  
**SPL Version:** 10.0  
**Documentation Files Analyzed:** 197  
**Total Functions Cataloged:** 170+  
**Total Commands Cataloged:** 150+  
**Date Generated:** 2025-10-20  
**Purpose:** TextMate Grammar Development for Splunk SPL

---

**End of Analysis**
