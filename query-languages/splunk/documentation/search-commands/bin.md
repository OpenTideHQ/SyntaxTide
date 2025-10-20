# bin

## Description

Puts continuous numerical values into discrete sets, or bins, by adjusting the value of <field> so that all of the items in a particular set have the same value.

Note: The `bin` command is automatically called by the `chart` and the `timechart` commands. Use the `bin` command for only statistical operations that the `chart` and the `timechart` commands cannot process. Do not use the `bin` command if you plan to export all events to CSV or JSON file formats.

## Syntax

The required syntax is in bold.

bin

[<bin-options>...]

<field>  [AS <newfield>]

### Required arguments

field

Syntax: <*field*>

Description: Specify a field name.

### Optional arguments

bin-options

Syntax: bins | minspan | span | <start-end> | aligntime

Description: Discretization options. See the [Bins options](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin#e2089f64_d93c_4ca8_a05f_c1c9eb1c0179__bin) section in this topic for the syntax and description for each of these options.

newfield

Syntax: <string>

Description: A new name for the field.

### Bin options

bins

Syntax: bins=<int>

Description: Sets the maximum number of bins to discretize into. The default is set in the [discretize] stanza in the limits.conf file.

Default: 100

minspan

Syntax: minspan=<span-length>

Description: Specifies the smallest span granularity to use automatically inferring span from the data time range.

span

Syntax: span = <log-span> | <span-length>

Description: Sets the size of each bin, using a span length based on a logarithm-based span or based on time.

Note: When a <span-length> of a day or more is used, the span is aligned to midnight in the timezone of the user.

<start-end>

Syntax: start=<num> | end=<num>

Description: Sets the minimum and maximum extents for numerical bins. The data in the field is analyzed and the beginning and ending values are determined. The start and end arguments are used when a span value is not specified.

You can use the start or end arguments only to *expand* the range, not to shorten the range. For example, if the field represents seconds the values are from 0-59. If you specify a span of 10, then the bins are calculated in increments of 10. The bins are 0-9, 10-19, 20-29, and so forth. If you do not specify a span, but specify end=1000, the bins are calculated based on the actual beginning value and 1000 as the end value.

If you set end=10 and the values are >10, the end argument has no effect.

aligntime

Syntax: aligntime=(earliest | latest | <time-specifier>)

Description: Align the bin times to something other than base UTC time (epoch 0). The `aligntime` option is valid only when doing a time-based discretization. Ignored if `span` is in days, months, or years.

### Span options

log-span

Syntax: [<num>]log[<num>]

Description: Sets to log-based span. The first number is a coefficient. The second number is the base. If the first number is supplied, it must be a real number >= 1.0 and < base. Base, if supplied, must be real number > 1.0 (strictly greater than 1).

Example: span=2log10

span-length

Syntax: <int>[<timescale>]

Description: A span of each bin. If discretizing based on the `_time` field or used with a timescale, this is treated as a time range. If not, this is an absolute bin length.

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <month> | <subseconds>

Description: Time scale units. If discretizing based on the `_time` field.

Default: sec

| Time scale | Syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <month> | mon | month | months | Time scale in months. |
| <subseconds> | us | ms | cs | ds | Time scale in microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |

## Usage

The `bucket` command is an alias for the `bin` command.

The `bin` command is usually a dataset processing command. If the `span` argument is specified with the command, the `bin` command is a streaming command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

### Subsecond bin time spans

Subsecond `span` timescales, which are time spans that are made up of deciseconds (ds), centiseconds (cs), milliseconds (ms), or microseconds (us), should be numbers that divide evenly into a second. For example, 1s = 1000ms. This means that valid millisecond `span` values are 1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, or 500ms. In addition, `span = 1000ms` is not allowed. Use `span = 1s` instead.

## Examples

### 1. Specify a time span

Return the average "thruput" of each "host" for each 5 minute time span.

... | bin \_time span=5m | stats avg(thruput) by \_time host

### 2. Specify the number of bins

Bin search results into 10 bins, and return the count of raw events for each bin.

... | bin size bins=10 | stats count(\_raw) by size

### 3. Specify an end value

Create bins with an end value larger than you need to ensure that all possible values are included.

... | bin amount end=1000

### 4. Specify a relative time to align the bins to

Align the time bins to 3am (local time). Set the span to 12h. The bins will represent 3am - 3pm, then 3pm - 3am (the next day), and so on.

...| bin \_time span=12h aligntime=@d+3h

### 5. Specify a UTC time to align the bins to

Align the bins to the specific UTC time of 1500567890.

...| bin \_time aligntime=1500567890

## See also

[chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart)
