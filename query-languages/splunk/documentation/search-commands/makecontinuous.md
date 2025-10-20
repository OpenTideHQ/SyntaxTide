# makecontinuous

## Description

Makes a field on the x-axis numerically continuous by adding empty buckets for periods where there is no data and quantifying the periods where there is data. This x-axis field can then be invoked by the `chart` and `timechart` commands.

## Syntax

The required syntax is in bold.

makecontinuous

<field>

[<bin-options>...]

### Required arguments

<bins-options>

Datatype: bins | span | start-end

Description: Discretization options. See "Bins options" for details.

### Optional arguments

<field>

Datatype: <field>

Description: Specify a field name.

### Bins options

bins

Syntax: bins=<int>

Description: Sets the maximum number of bins to discretize into.

span

Syntax: <log-span> | <span-length>

Description: Sets the size of each bin, using a span length based on time or log-based span.

<start-end>

Syntax: end=<num> | start=<num>

Description: Sets the minimum and maximum extents for numerical bins. Data outside of the [start, end] range is discarded.

### Span options

<log-span>

Syntax: [<num>]log[<num>]

Description: Sets to log-based span. The first number is a coefficient. The second number is the base. If the first number is supplied, it must be a real number >= 1.0 and < base. Base, if supplied, must be real number > 1.0, meaning it must be strictly greater than 1.

span-length

Syntax: <span>[<timescale>]

Description: A span length based on time.

<span>

Syntax: <int>

Description: The span of each bin. If using a timescale, this is used as a time range. If not, this is an absolute bin "length."

<timescale>

Syntax: <sec> | <min> | <hr> | <day> | <month> | <subseconds>

Description: Time scale units.

| Time scale | Syntax | Description |
| --- | --- | --- |
| <sec> | s | sec | secs | second | seconds | Time scale in seconds. |
| <min> | m | min | mins | minute | minutes | Time scale in minutes. |
| <hr> | h | hr | hrs | hour | hours | Time scale in hours. |
| <day> | d | day | days | Time scale in days. |
| <month> | mon | month | months | Time scale in months. |
| <subseconds> | us | ms | cs | ds | Time scale in microseconds (us), milliseconds (ms), centiseconds (cs), or deciseconds (ds) |

## Usage

The `makecontinuous` command is a [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

## Examples

### Example 1:

Make the `_time` field continuous with a span of 10 minutes.

... | makecontinuous \_time span=10m

## See also

[chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart), [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart)
