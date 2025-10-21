/**
 * Comprehensive SPL Commands Database
 * Source: Splunk SPL 10.0 Reference - 158 commands analyzed
 * Categories: Data Manipulation, Stats & Aggregation, ML & Analytics, Visualization, etc.
 */

import * as PARAMS from './spl-command-parameters';

// Import and re-export parameter types to avoid circular dependencies
export { ParameterType, ParameterDefinition } from './spl-parameter-types';
import { ParameterType, ParameterDefinition } from './spl-parameter-types';

/**
 * Enhanced SPL Command interface with detailed parameter support
 */
export interface SPLCommand {
	name: string;
	type: string;
	category: string;
	description: string;
	syntax: string;
	/** Legacy: total count of required arguments (kept for compatibility) */
	requiredArgs: number;
	/** Legacy: total count of optional arguments (kept for compatibility) */
	optionalArgs: number;
	/** Detailed parameter definitions */
	parameters?: ParameterDefinition[];
	examples?: string[];
	relatedCommands?: string[];
}

export const SPL_COMMANDS: SPLCommand[] = [
	{
		name: 'abstract',
		type: 'Unknown',
		category: 'Data Manipulation',
		description: 'Produces an abstract, a summary or brief representation, of the text of the search results. The original text is replaced by the summary.',
		syntax: 'abstract [maxterms=<int>] [maxlines=<int>]',
		requiredArgs: 0,
		optionalArgs: 2,
		parameters: PARAMS.ABSTRACT_PARAMS,
		examples: ['... | abstract maxlines=5', '... | abstract maxterms=20'],
		relatedCommands: ['highlight']
	},
	{
		name: 'accum',
		type: 'Unknown',
		category: 'Stats & Aggregation',
		description: 'For each event where field is a number, the accum command calculates a running total or sum of the numbers. The accumulated sum can be returned to either the same field, or a newfield that you specify.',
		syntax: 'accum <field> [AS <newfield>]',
		requiredArgs: 1,
		optionalArgs: 1,
		parameters: PARAMS.ACCUM_PARAMS,
		examples: ['... | accum count', '... | accum bytes AS total_bytes'],
		relatedCommands: ['autoregress', 'delta', 'streamstats', 'trendline']
	},
	{
		name: 'addcoltotals',
		type: 'Unknown',
		category: 'Stats & Aggregation',
		description: 'The addcoltotals command appends a new result to the end of the search result set. The result contains the sum of each numeric field or you can specify which fields to summarize.',
		syntax: 'addcoltotals [labelfield=<field>] [label=<string>] [<wc-field-list>]',
		requiredArgs: 0,
		optionalArgs: 3,
		parameters: PARAMS.ADDCOLTOTALS_PARAMS,
		examples: ['... | addcoltotals', '... | addcoltotals labelfield=Total label=TOTAL bytes duration'],
		relatedCommands: ['addtotals', 'stats']
	},
	{
		name: 'addinfo',
		type: 'Distributable Streaming',
		category: 'Data Manipulation',
		description: 'Adds fields to each event that contain global, common information about the search. This command is primarily an internally-used component of Summary Indexing. Adds fields: info_min_time, info_max_time, info_sid, info_search_time.',
		syntax: 'addinfo',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['... | addinfo'],
		relatedCommands: ['search']
	},
	{
		name: 'addtotals',
		type: 'Distributable Streaming / Transforming',
		category: 'Stats & Aggregation',
		description: 'The addtotals command computes the arithmetic sum of all numeric fields for each search result. The results appear in the Statistics tab.',
		syntax: 'addtotals [row=<bool>] [col=<bool>] [labelfield=<field>] [label=<string>] [fieldname=<field>] [<field-list>]',
		requiredArgs: 0,
		optionalArgs: 6,
		parameters: PARAMS.ADDTOTALS_PARAMS,
		examples: ['... | addtotals', '... | addtotals fieldname=sum', '... | addtotals col=t labelfield=products label="Quarterly Totals"'],
		relatedCommands: ['stats', 'addcoltotals']
	},
	{
		name: 'analyzefields',
		type: 'Unknown',
		category: 'ML & Analytics',
		description: 'Using <field> as a discrete random variable, this command analyzes all numerical fields to determine the ability for each of those fields to predict the value of the classfield. Returns: field, count, cocur, acc, balacc.',
		syntax: 'analyzefields classfield=<field>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | analyzefields classfield=is_activated'],
		relatedCommands: ['anomalousvalue']
	},
	{
		name: 'anomalies',
		type: 'Unknown',
		category: 'ML & Analytics',
		description: 'Use the anomalies command to look for events or field values that are unusual or unexpected. The anomalies command assigns an unexpectedness score to each event and places that score in a new field named unexpectedness.',
		syntax: 'anomalies [threshold=<num>] [labelonly=<bool>] [normalize=<bool>] [maxvalues=<num>] [field=<field>] [denylist=<filename>] [denylistthreshold=<num>] [by-clause]',
		requiredArgs: 0,
		optionalArgs: 7,
		parameters: PARAMS.ANOMALIES_PARAMS,
		examples: ['... | anomalies', '... | anomalies threshold=0.03 by source', '... | anomalies denylist=boringevents | sort -unexpectedness'],
		relatedCommands: ['anomalousvalue', 'cluster', 'kmeans', 'outlier']
	},
	{
		name: 'anomalousvalue',
		type: 'Unknown',
		category: 'ML & Analytics',
		description: 'The anomalousvalue command computes an anomaly score for each field of each event, relative to the values of this field across other events. For numerical fields, it identifies or summarizes the values in the data that are anomalous either by frequency of occurrence or number of standard deviations from the mean.',
		syntax: 'anomalousvalue <av-options>... [action] [pthresh] [field-list]',
		requiredArgs: 0,
		optionalArgs: 6,
		parameters: PARAMS.ANOMALOUSVALUE_PARAMS,
		examples: ['... | anomalousvalue', '... | anomalousvalue action=filter pthresh=0.02', '... | anomalousvalue action=summary pthresh=0.02 | search isNum=YES'],
		relatedCommands: ['analyzefields', 'anomalies', 'cluster', 'kmeans', 'outlier']
	},
	{
		name: 'anomalydetection',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'A transforming command that identifies anomalous events by computing a probability for each event and then detecting unusually small probabilities. The probability is defined as the product of the frequencies of each individual field value in the event.',
		syntax: 'anomalydetection [<method-option>] [<action-option>] [<pthresh-option>] [<cutoff-option>] [<field-list>]',
		requiredArgs: 0,
		optionalArgs: 4,
		parameters: PARAMS.ANOMALYDETECTION_PARAMS,
		examples: ['... | anomalydetection', '... | anomalydetection method=zscore action=filter pthresh=0.05', '... | anomalydetection method=iqr action=tf param=4 uselower=true mark=true'],
		relatedCommands: ['analyzefields', 'anomalies', 'anomalousvalue', 'cluster', 'kmeans', 'outlier']
	},
	{
		name: 'append',
		type: 'Transforming',
		category: 'Data Manipulation',
		description: 'Appends the results of a subsearch to the current results. The append command runs only over historical data and does not produce correct results if used in a real-time search.',
		syntax: 'append [<subsearch-options>...] <subsearch>',
		requiredArgs: 1,
		optionalArgs: 3,
		parameters: PARAMS.APPEND_PARAMS,
		examples: ['... | append [search index=other]', '... | append maxtime=30 maxout=1000 [search index=other]'],
		relatedCommands: ['appendcols', 'appendpipe', 'join', 'set']
	},
	{
		name: 'appendcols',
		type: 'Unknown',
		category: 'Data Manipulation',
		description: 'Appends the fields of the subsearch results with the input search results. All fields of the subsearch are combined into the current results, with the exception of internal fields.',
		syntax: 'appendcols [override=<bool> | <subsearch-options>...] <subsearch>',
		requiredArgs: 1,
		optionalArgs: 4,
		parameters: PARAMS.APPENDCOLS_PARAMS,
		examples: ['... | table host | appendcols [search 404]', '... | appendcols override=true [search ...]'],
		relatedCommands: ['append', 'appendpipe', 'join', 'set']
	},
	{
		name: 'appendpipe',
		type: 'Unknown',
		category: 'Data Manipulation',
		description: 'Appends the result of the subpipeline to the search results. Unlike a subsearch, the subpipeline is not run first. The subpipeline is run when the search reaches the appendpipe command.',
		syntax: 'appendpipe [run_in_preview=<bool>] [<subpipeline>]',
		requiredArgs: 0,
		optionalArgs: 2,
		parameters: PARAMS.APPENDPIPE_PARAMS,
		examples: ['... | appendpipe [stats sum(count) as count by action | eval user = "TOTAL - ALL USERS"] | sort action'],
		relatedCommands: ['append', 'appendcols', 'join', 'set']
	},
	{
		name: 'arules',
		type: 'Streaming (Distributable & Centralized)',
		category: 'Stats & Aggregation',
		description: 'The arules command looks for associative relationships between field values. The command returns a table with the following columns: Given fields, Implied fields, Strength, Given fields support, and Implied fields support.',
		syntax: 'arules [<arules-option>...] <field-list>...',
		requiredArgs: 1,
		optionalArgs: 2,
		parameters: PARAMS.ARULES_PARAMS,
		examples: ['... | arules field1 field2 field3', '... | arules sup=3 conf=.6 field1 field2 field3'],
		relatedCommands: ['associate', 'correlate']
	},
	{
		name: 'associate',
		type: 'Unknown',
		category: 'Stats & Aggregation',
		description: 'The associate command identifies correlations between fields. The command tries to find a relationship between pairs of fields by calculating a change in entropy based on their values.',
		syntax: 'associate [<associate-options>...] [field-list]',
		requiredArgs: 0,
		optionalArgs: 3,
		parameters: PARAMS.ASSOCIATE_PARAMS,
		examples: ['... | associate supcnt=3', '... | associate supcnt=50 supfreq=0.2 improv=0.5'],
		relatedCommands: ['arules', 'correlate', 'contingency']
	},
	{
		name: 'autoregress',
		type: 'Centralized Streaming',
		category: 'Stats & Aggregation',
		description: 'Prepares your events for calculating the autoregression, or the moving average, by copying one or more of the previous values for field into each event.',
		syntax: 'autoregress <field> [AS <newfield>] [p=<int> | p=<int>-<int>]',
		requiredArgs: 1,
		optionalArgs: 2,
		parameters: PARAMS.AUTOREGRESS_PARAMS,
		examples: ['... | autoregress ip AS old_ip p=3', '... | autoregress count p=2-5', '... | eval rawlen=len(_raw) | autoregress rawlen p=1-4 | eval moving_average=(rawlen + rawlen_p1 + rawlen_p2 + rawlen_p3 +rawlen_p4) /5'],
		relatedCommands: ['accum', 'delta', 'streamstats', 'trendline']
	},
	{
		name: 'awssnsalert',
		type: 'Streaming',
		category: 'Alerting',
		description: 'Sends search results to AWS Simple Notification Service (SNS) for alerting and notification.',
		syntax: 'awssnsalert <aws-sns-options>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | awssnsalert sns_topic="arn:aws:sns:us-east-1:123456789012:MySplunkAlerts"'],
		relatedCommands: ['sendalert', 'sendemail']
	},
	{
		name: 'bin',
		type: 'Dataset Processing / Streaming',
		category: 'Data Manipulation',
		description: 'Puts continuous numerical values into discrete sets, or bins, by adjusting the value of <field> so that all of the items in a particular set have the same value.',
		syntax: 'bin [<bin-options>...] <field> [AS <newfield>]',
		requiredArgs: 1,
		optionalArgs: 6,
		parameters: PARAMS.BIN_PARAMS,
		examples: ['... | bin _time span=5m | stats avg(thruput) by _time host', '... | bin size bins=10 | stats count(_raw) by size', '... | bin amount end=1000'],
		relatedCommands: ['chart', 'timechart', 'bucket']
	},
	{
		name: 'bucket',
		type: 'Dataset Processing / Streaming',
		category: 'Data Manipulation',
		description: 'The bucket command is an alias for the bin command.',
		syntax: 'bucket [<bin-options>...] <field> [AS <newfield>]',
		requiredArgs: 1,
		optionalArgs: 0,
		parameters: PARAMS.BUCKET_PARAMS,
		examples: ['... | bucket _time span=1h'],
		relatedCommands: ['bin', 'chart', 'timechart']
	},
	{
		name: 'bucketdir',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Replaces a field value with higher-level grouping, such as replacing filenames with directories. Returns the maxcount events, by taking the incoming events and rolling up multiple sources into directories.',
		syntax: 'bucketdir pathfield=<field> sizefield=<field> [maxcount=<int>] [countfield=<field>] [sep=<char>]',
		requiredArgs: 2,
		optionalArgs: 3,
		parameters: PARAMS.BUCKETDIR_PARAMS,
		examples: ['... | top source | bucketdir pathfield=source sizefield=count maxcount=10'],
		relatedCommands: ['cluster', 'dedup']
	},
	{
		name: 'chart',
		type: 'Transforming',
		category: 'Visualization',
		description: 'The chart command is a transforming command that returns your results in a table format. The results can then be used to display the data as a chart, such as a column, line, area, or pie chart.',
		syntax: 'chart [<chart-options>] [agg=<stats-agg-term>] (<stats-agg-term> | <sparkline-agg-term> | "(<eval-expression>)")... [BY <row-split> <column-split>] | [OVER <row-split>] [BY <column-split>] [<dedup_splitvals>]',
		requiredArgs: 1,
		optionalArgs: 6,
		parameters: PARAMS.CHART_PARAMS,
		examples: ['... | chart max(delay) OVER site', '... | chart max(delay) OVER site BY org', '... | chart count BY date_mday span=3 date_hour span=12'],
		relatedCommands: ['timechart', 'bin', 'sichart']
	},
	{
		name: 'cluster',
		type: 'Streaming / Dataset Processing',
		category: 'ML & Analytics',
		description: 'The cluster command groups events together based on how similar they are to each other. Unless you specify a different field, cluster groups events based on the contents of the _raw field.',
		syntax: 'cluster [slc-options]...',
		requiredArgs: 0,
		optionalArgs: 8,
		parameters: PARAMS.CLUSTER_PARAMS,
		examples: ['... | cluster showcount=t | table cluster_count _raw | sort -cluster_count', '... | cluster t=0.9 showcount=t | sort - cluster_count | head 20'],
		relatedCommands: ['anomalies', 'anomalousvalue', 'kmeans', 'outlier']
	},
	{
		name: 'cofilter',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Use this command to determine how many times a value in <field1> and a value in <field2> occur together. This command implements one step in a collaborative filtering analysis for making recommendations.',
		syntax: 'cofilter <field1> <field2>',
		requiredArgs: 2,
		optionalArgs: 0,
		parameters: PARAMS.COFILTER_PARAMS,
		examples: ['... | cofilter user item'],
		relatedCommands: ['associate', 'correlate']
	},
	{
		name: 'collect',
		type: 'Unknown',
		category: 'Data Export',
		description: 'Adds the results of a search to a summary index that you specify. You must create the summary index before you invoke the collect command.',
		syntax: 'collect index=<string> [<arg-options>...]',
		requiredArgs: 1,
		optionalArgs: 13,
		parameters: PARAMS.COLLECT_PARAMS,
		examples: ['... | collect index=summary', '... | collect index=summary source=devtest output_format=hec'],
		relatedCommands: ['overlap', 'sichart', 'sirare', 'sistats', 'sitimechart', 'sitop', 'tscollect']
	},
	{
		name: 'concurrency',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Uses a duration field to find events that occurred at the same time or had overlapping time periods.',
		syntax: 'concurrency duration=<field> [start=<field>] [output=<field>] [outputfield=<field>]',
		requiredArgs: 1,
		optionalArgs: 3,
		examples: ['... | concurrency duration=session_length', '... | concurrency duration=duration start=start_time output=concurrent_users'],
		relatedCommands: ['transaction', 'overlap']
	},
	{
		name: 'contingency',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Builds a contingency table for two fields. Shows the co-occurrence of values.',
		syntax: 'contingency <field1> <field2> [<contingency-options>]',
		requiredArgs: 2,
		optionalArgs: 3,
		examples: ['... | contingency host status', '... | contingency user action maxcols=20'],
		relatedCommands: ['associate', 'correlate', 'ctable']
	},
	{
		name: 'convert',
		type: 'Distributable Streaming',
		category: 'Data Manipulation',
		description: 'The convert command converts field values in your search results into numerical values. Unless you use the AS clause, the original values are replaced by the new values.',
		syntax: 'convert [timeformat=string] (<convert-function> [AS <field>])...',
		requiredArgs: 1,
		optionalArgs: 2,
		parameters: PARAMS.CONVERT_PARAMS,
		examples: ['... | convert auto(*)', '... | convert dur2sec(delay)', '... | convert timeformat="%H:%M:%S" ctime(_time) AS c_time'],
		relatedCommands: ['eval', 'fieldformat']
	},
	{
		name: 'correlate',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Calculates the correlation between different fields.',
		syntax: 'correlate <field-list>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | correlate duration bytes', '... | correlate field1 field2 field3'],
		relatedCommands: ['associate', 'contingency']
	},
	{
		name: 'crawl',
		type: 'Generating',
		category: 'Data Input',
		description: 'Crawls the filesystem for new data files.',
		syntax: 'crawl <path> [<crawl-options>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['| crawl /var/log'],
		relatedCommands: ['inputlookup']
	},
	{
		name: 'ctable',
		type: 'Transforming',
		category: 'Presentation',
		description: 'Creates a contingency table (crosstab) from the search results. Alternative to stats and chart commands.',
		syntax: 'ctable <row-field> <column-field> <value-field>',
		requiredArgs: 3,
		optionalArgs: 0,
		examples: ['... | ctable host status count', '... | ctable product region sales'],
		relatedCommands: ['chart', 'contingency', 'xyseries']
	},
	{
		name: 'datamodel',
		type: 'Generating',
		category: 'Data Model',
		description: 'Examines data model or data model dataset and returns information about the data model objects or datasets.',
		syntax: 'datamodel [<datamodel-name>] [<dataset-name>] [search] [<search-options>]',
		requiredArgs: 0,
		optionalArgs: 5,
		examples: ['| datamodel', '| datamodel Web search', '| datamodel Authentication Failed_Authentication search'],
		relatedCommands: ['pivot', 'tstats', 'from']
	},
	{
		name: 'datamodelsimple',
		type: 'Generating',
		category: 'Data Model',
		description: 'Similar to datamodel command but with simpler output format.',
		syntax: 'datamodelsimple [<datamodel-name>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['| datamodelsimple', '| datamodelsimple Web'],
		relatedCommands: ['datamodel', 'pivot']
	},
	{
		name: 'dbinspect',
		type: 'Generating',
		category: 'Index Management',
		description: 'Returns information about the specified index.',
		syntax: 'dbinspect [index=<index>] [<time-options>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['| dbinspect index=main', '| dbinspect index=_*'],
		relatedCommands: ['metadata', 'eventcount']
	},
	{
		name: 'dbxquery',
		type: 'Generating',
		category: 'Database',
		description: 'Runs SQL queries against external databases using Splunk DB Connect.',
		syntax: 'dbxquery connection=<string> query=<string> [<dbxquery-options>]',
		requiredArgs: 2,
		optionalArgs: 5,
		examples: ['| dbxquery connection="mydb" query="SELECT * FROM users WHERE status=\'active\'"'],
		relatedCommands: ['dbinspect', 'inputlookup']
	},
	{
		name: 'dedup',
		type: 'Streaming',
		category: 'Filtering & Manipulation',
		description: 'Removes duplicate events based on specified field values.',
		syntax: 'dedup [<int>] <field-list> [keepevents=<bool>] [keepempty=<bool>] [consecutive=<bool>] [sortby <sort-by-clause>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | dedup user', '... | dedup 3 source host', '... | dedup user keepevents=true'],
		relatedCommands: ['uniq', 'sort']
	},
	{
		name: 'delete',
		type: 'Distributable streaming',
		category: 'Index Management',
		description: 'Deletes the specified event(s) from the index.',
		syntax: 'delete',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['index=main error | delete'],
		relatedCommands: []
	},
	{
		name: 'delta',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Computes the difference between successive values of a field.',
		syntax: 'delta <field> [AS <newfield>] [p=<int>]',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | delta count as count_delta', '... | delta bytes p=2'],
		relatedCommands: ['autoregress', 'streamstats']
	},
	{
		name: 'diff',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Returns the difference between two search results.',
		syntax: 'diff [position1=<int>] [position2=<int>] [attribute=<string>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | diff position1=1 position2=2', '... | diff attribute=_raw'],
		relatedCommands: ['delta', 'set']
	},
	{
		name: 'erex',
		type: 'Generating',
		category: 'Field Extraction',
		description: 'Automatically extracts fields using example values.',
		syntax: 'erex <field> examples=<string> [counterexamples=<string>] [fromfield=<field>]',
		requiredArgs: 2,
		optionalArgs: 2,
		examples: ['... | erex email examples="user@example.com"', '... | erex ipaddr examples="192.168.1.1" counterexamples="10.0.0"'],
		relatedCommands: ['rex', 'extract', 'kvform']
	},
	{
		name: 'entitymerge',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Merges entity information from multiple sources into a single entity representation.',
		syntax: 'entitymerge [<entitymerge-options>]',
		requiredArgs: 0,
		optionalArgs: 5,
		examples: ['... | entitymerge prefix=user'],
		relatedCommands: ['join', 'lookup']
	},
	{
		name: 'eval',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Calculates an expression and puts the resulting value into a search results field.',
		syntax: 'eval <field>=<expression> ["," <field>=<expression>] ...',
		requiredArgs: 1,
		optionalArgs: -1,
		examples: ['... | eval bandwidth=bytes/duration', '... | eval hour=strftime(_time, "%H")', '... | eval status=if(error>0, "fail", "success")'],
		relatedCommands: ['where', 'fieldformat', 'calculate']
	},
	{
		name: 'eventcount',
		type: 'Generating',
		category: 'Stats & Aggregation',
		description: 'Returns the number of events in an index or across indexes.',
		syntax: 'eventcount [summarize=<bool>] [index=<index>] [report_size=<bool>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['| eventcount summarize=false index=main', '| eventcount summarize=true', '| eventcount report_size=true index=*'],
		relatedCommands: ['dbinspect', 'metadata']
	},
	{
		name: 'eventstats',
		type: 'Streaming',
		category: 'Stats & Aggregation',
		description: 'Generates summary statistics from fields and adds them to the events. Unlike stats, eventstats does not group results.',
		syntax: 'eventstats [allnum=<bool>] <stats-agg-term>... [BY <field-list>]',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | eventstats avg(bytes) as avg_bytes', '... | eventstats count by host', '... | eventstats dc(user) as unique_users'],
		relatedCommands: ['stats', 'streamstats']
	},
	{
		name: 'extract',
		type: 'Streaming',
		category: 'Field Extraction',
		description: 'Extracts field-value pairs from search results using regular expressions.',
		syntax: 'extract [pairdelim=<string>] [kvdelim=<string>] [auto=<bool>] [reload=<bool>]',
		requiredArgs: 0,
		optionalArgs: 4,
		examples: ['... | extract', '... | extract pairdelim="," kvdelim="="', '... | extract auto=false'],
		relatedCommands: ['rex', 'erex', 'kvform', 'kv']
	},
	{
		name: 'fieldformat',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Applies formatting to numeric fields without changing the underlying value.',
		syntax: 'fieldformat <field>=<eval-expression>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | fieldformat bytes=tostring(bytes, "commas")', '... | fieldformat percent=tostring(percent, "percent")'],
		relatedCommands: ['eval', 'convert']
	},
	{
		name: 'fields',
		type: 'Streaming',
		category: 'Filtering & Manipulation',
		description: 'Removes or keeps only the specified fields.',
		syntax: 'fields [+|-] <field-list>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | fields host source user', '... | fields - _raw _time', '... | fields + status count'],
		relatedCommands: ['table', 'rename']
	},
	{
		name: 'fieldsummary',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Generates summary statistics for all or some of the fields.',
		syntax: 'fieldsummary [maxvals=<int>] [wc-field-list]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | fieldsummary', '... | fieldsummary maxvals=10 host status'],
		relatedCommands: ['analyzefields', 'stats']
	},
	{
		name: 'filldown',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Fills down values from earlier events into later events.',
		syntax: 'filldown <field-list>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | filldown user', '... | filldown host session_id'],
		relatedCommands: ['fillnull', 'autoregress']
	},
	{
		name: 'fillnull',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Replaces null values with a specified value.',
		syntax: 'fillnull [value=<string>] [<field-list>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | fillnull value=0', '... | fillnull value="N/A" user host', '... | fillnull'],
		relatedCommands: ['filldown', 'eval']
	},
	{
		name: 'findtypes',
		type: 'Generating',
		category: 'Data Discovery',
		description: 'Generates a list of suggested event types.',
		syntax: 'findtypes [maxcount=<int>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['... | findtypes', '... | findtypes maxcount=20'],
		relatedCommands: ['typer', 'typelearner']
	},
	{
		name: 'folderize',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Creates a higher level grouping for the specified fields.',
		syntax: 'folderize <field>...',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | folderize host user'],
		relatedCommands: ['transaction']
	},
	{
		name: 'foreach',
		type: 'Streaming',
		category: 'Data Processing',
		description: 'Iterates over a set of fields and executes a subsearch for each field.',
		syntax: 'foreach <field-list> [fieldstr=<<FIELD>>] <subsearch>',
		requiredArgs: 2,
		optionalArgs: 1,
		examples: ['... | foreach cpu* [eval <<FIELD>>=<<FIELD>>*100]', '... | foreach user* [eval total=total+<<FIELD>>]'],
		relatedCommands: ['eval', 'fieldformat']
	},
	{
		name: 'format',
		type: 'Transforming',
		category: 'Subsearches',
		description: 'Formats search results into a string.',
		syntax: 'format [<mvdelim>] [<maxresults>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | format', '... | format "OR" 100'],
		relatedCommands: ['return', 'search']
	},
	{
		name: 'from',
		type: 'Generating',
		category: 'Data Input',
		description: 'Retrieves events from a dataset.',
		syntax: 'from <dataset-name>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['| from datamodel:Web.Web', '| from lookup:users'],
		relatedCommands: ['datamodel', 'inputlookup']
	},
	{
		name: 'fromjson',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Parses a JSON string and extracts fields from it.',
		syntax: 'fromjson [<field>] [output=<field>] [maxinputs=<int>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | fromjson', '... | fromjson json_data output=parsed', '... | fromjson response maxinputs=1000'],
		relatedCommands: ['tojson', 'spath', 'eval']
	},
	{
		name: 'gauge',
		type: 'Streaming',
		category: 'Visualization',
		description: 'Creates range visualizations.',
		syntax: 'gauge <field> <range1> <range2> ... <rangeN>',
		requiredArgs: 2,
		optionalArgs: -1,
		examples: ['... | gauge cpu 0 30 70 100', '... | gauge response_time 0 500 1000 2000'],
		relatedCommands: ['rangemap']
	},
	{
		name: 'gentimes',
		type: 'Generating',
		category: 'Data Generation',
		description: 'Generates timestamp results starting with the exact time specified as start time.',
		syntax: 'gentimes [start=<time>] [end=<time>] [increment=<time>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['| gentimes start=-24h increment=1h', '| gentimes start=01/01/2024:00:00:00 end=01/31/2024:23:59:59 increment=1d'],
		relatedCommands: ['makeresults']
	},
	{
		name: 'geom',
		type: 'Streaming',
		category: 'Geospatial',
		description: 'Adds geometry to events for use in choropleth visualizations.',
		syntax: 'geom <featureIdField> [featureCollection=<string>] [allFeatures=<bool>]',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | geom geo_countries featureCollection=geo_countries', '... | geom state_code allFeatures=true'],
		relatedCommands: ['geostats', 'iplocation']
	},
	{
		name: 'geomfilter',
		type: 'Streaming',
		category: 'Geospatial',
		description: 'Filters events based on geographic boundaries.',
		syntax: 'geomfilter <latfield> <lonfield> [<geom-spec>]',
		requiredArgs: 2,
		optionalArgs: 1,
		examples: ['... | geomfilter latitude longitude', '... | geomfilter lat lon min_x=0 max_x=10 min_y=0 max_y=10'],
		relatedCommands: ['geostats', 'iplocation']
	},
	{
		name: 'geostats',
		type: 'Transforming',
		category: 'Geospatial',
		description: 'Generates statistics for map visualizations.',
		syntax: 'geostats [<latfield>] [<longfield>] [<stats-agg-term>...]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | geostats count', '... | geostats latfield=lat longfield=lon avg(response_time)'],
		relatedCommands: ['geom', 'iplocation']
	},
	{
		name: 'head',
		type: 'Streaming',
		category: 'Filtering & Manipulation',
		description: 'Returns the first N results.',
		syntax: 'head [<N>] [null=<bool>] [keeplast=<bool>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | head 10', '... | head 100 null=false', '... | head'],
		relatedCommands: ['tail', 'limit']
	},
	{
		name: 'highlight',
		type: 'Streaming',
		category: 'Visualization',
		description: 'Highlights search terms in results.',
		syntax: 'highlight <field-list> [<highlight-options>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | highlight error warning', '... | highlight user="admin"'],
		relatedCommands: ['table']
	},
	{
		name: 'history',
		type: 'Generating',
		category: 'Utility',
		description: 'Returns a list of recent search history.',
		syntax: 'history [events=<bool>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['| history', '| history events=false'],
		relatedCommands: []
	},
	{
		name: 'iconify',
		type: 'Streaming',
		category: 'Visualization',
		description: 'Displays events with icons based on field values.',
		syntax: 'iconify <field>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | iconify severity'],
		relatedCommands: ['highlight']
	},
	{
		name: 'inputcsv',
		type: 'Generating',
		category: 'Data Input',
		description: 'Loads search results from a CSV file.',
		syntax: 'inputcsv [append=<bool>] [start=<int>] [max=<int>] <filename>',
		requiredArgs: 1,
		optionalArgs: 3,
		examples: ['| inputcsv users.csv', '| inputcsv append=true max=1000 data.csv'],
		relatedCommands: ['inputlookup', 'outputcsv']
	},
	{
		name: 'inputlookup',
		type: 'Generating',
		category: 'Data Input',
		description: 'Loads search results from a lookup table file.',
		syntax: 'inputlookup [append=<bool>] [start=<int>] [max=<int>] [where <search>] <filename>',
		requiredArgs: 1,
		optionalArgs: 4,
		examples: ['| inputlookup users_lookup', '| inputlookup append=true where user="admin" users_lookup'],
		relatedCommands: ['lookup', 'outputlookup', 'inputcsv']
	},
	{
		name: 'inputintelligence',
		type: 'Generating',
		category: 'Data Input',
		description: 'Retrieves threat intelligence data for security analysis.',
		syntax: 'inputintelligence [<intelligence-options>]',
		requiredArgs: 0,
		optionalArgs: 5,
		examples: ['| inputintelligence'],
		relatedCommands: ['inputlookup', 'lookup']
	},
	{
		name: 'iplocation',
		type: 'Streaming',
		category: 'Data Enrichment',
		description: 'Extracts location information from IP addresses. Adds fields like City, Country, Region, lat, lon.',
		syntax: 'iplocation [allfields=<bool>] [prefix=<string>] <field>',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | iplocation clientip', '... | iplocation allfields=true prefix=client_ src_ip'],
		relatedCommands: ['lookup']
	},
	{
		name: 'join',
		type: 'Dataset Processing',
		category: 'Data Manipulation',
		description: 'SQL-style join of results from two datasets based on matching field values.',
		syntax: 'join [type=inner|outer|left] [usetime=<bool>] [earlier=<bool>] [overwrite=<bool>] [max=<int>] <field-list> [subsearch]',
		requiredArgs: 1,
		optionalArgs: 6,
		examples: ['... | join user_id [search index=users]', '... | join type=left max=1 host [| inputlookup hosts.csv]'],
		relatedCommands: ['lookup', 'append', 'appendcols', 'transaction']
	},
	{
		name: 'kmeans',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'Performs k-means clustering on the incoming search results.',
		syntax: 'kmeans <kmeans-options> <field-list>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | kmeans k=3 bytes duration', '... | kmeans k=5 reps=10 * | cluster showcount=true'],
		relatedCommands: ['cluster', 'anomalies', 'anomalydetection']
	},
	{
		name: 'kvform',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Extracts values from search results as key-value pairs.',
		syntax: 'kvform [field=<field>] [limit=<int>] [prefix_field=<string>] [suffix_field=<string>]',
		requiredArgs: 0,
		optionalArgs: 4,
		examples: ['... | kvform', '... | kvform field=_raw limit=100'],
		relatedCommands: ['extract', 'rex', 'spath', 'xmlkv']
	},
	{
		name: 'limit',
		type: 'Dataset Processing',
		category: 'Data Manipulation',
		description: 'Returns the first N results. Alias for head command.',
		syntax: 'limit <int>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | limit 100', '... | limit 10'],
		relatedCommands: ['head', 'tail']
	},
	{
		name: 'loadjob',
		type: 'Generating',
		category: 'Data Input',
		description: 'Loads events or results from a previously completed search job.',
		syntax: 'loadjob <sid> [events=<bool>] [preview=<bool>]',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['| loadjob 1234567890.12345', '| loadjob scheduler__admin__search__RMD5abcd1234 events=true'],
		relatedCommands: ['savedsearch', 'search']
	},
	{
		name: 'localize',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Returns a localized version of a field value.',
		syntax: 'localize <field> [AS <newfield>]',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | localize _time', '... | localize _time AS local_time'],
		relatedCommands: ['convert']
	},
	{
		name: 'lookup',
		type: 'Streaming',
		category: 'Data Enrichment',
		description: 'Explicitly invokes field value lookups by referencing a lookup table.',
		syntax: 'lookup [local=<bool>] [update=<bool>] <lookup-table-name> (<lookup-field> [AS <event-field>])... [OUTPUT | OUTPUTNEW (<lookup-destfield> [AS <event-destfield>])...]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | lookup users_lookup user_id OUTPUT username email', '... | lookup dnslookup clientip AS ip OUTPUT hostname'],
		relatedCommands: ['inputlookup', 'outputlookup', 'join', 'iplocation']
	},
	{
		name: 'localop',
		type: 'Streaming',
		category: 'Advanced',
		description: 'Forces subsequent commands to run locally on the search head instead of being distributed.',
		syntax: 'localop',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['... | localop | stats count'],
		relatedCommands: ['redistribute']
	},
	{
		name: 'makecontinuous',
		type: 'Transforming',
		category: 'Data Manipulation',
		description: 'Makes a field that is supposed to be the x-axis continuous (no gaps).',
		syntax: 'makecontinuous [<field>] [<makecontinuous-options>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | makecontinuous _time', '... | makecontinuous _time span=1h'],
		relatedCommands: ['timechart', 'chart']
	},
	{
		name: 'makemv',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Converts a single-valued field into a multivalue field by splitting on a delimiter.',
		syntax: 'makemv [delim=<string>] [allowempty=<bool>] [setsv=<bool>] [tokenizer=<string>] <field>',
		requiredArgs: 1,
		optionalArgs: 4,
		examples: ['... | makemv delim="," tags', '... | makemv tokenizer="\\\\s+" keywords'],
		relatedCommands: ['mvexpand', 'split', 'rex']
	},
	{
		name: 'makeresults',
		type: 'Generating',
		category: 'Data Input',
		description: 'Creates a specified number of empty search results.',
		syntax: 'makeresults [count=<int>] [annotate=<bool>] [server=<host>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['| makeresults', '| makeresults count=10', '| makeresults count=100 | eval field=random()'],
		relatedCommands: ['gentimes']
	},
	{
		name: 'map',
		type: 'Transforming',
		category: 'Advanced',
		description: 'Loops over search results and runs a templated search for each result.',
		syntax: 'map [maxsearches=<int>] <search>',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | map search="search index=$index$ sourcetype=$sourcetype$"', '... | map maxsearches=10 search="search host=$host$ | stats count"'],
		relatedCommands: ['foreach', 'append']
	},
	{
		name: 'metadata',
		type: 'Generating',
		category: 'Data Input',
		description: 'Returns a list of source, sourcetype, or host from a specified index or distributed search peer.',
		syntax: 'metadata type=<metadata-type> [<index-specifier>] [splunk_server=<wc-string>] [splunk_server_group=<wc-string>]',
		requiredArgs: 1,
		optionalArgs: 3,
		examples: ['| metadata type=hosts index=main', '| metadata type=sources index=* | where totalCount>1000'],
		relatedCommands: ['dbinspect']
	},
	{
		name: 'metasearch',
		type: 'Generating',
		category: 'Data Input',
		description: 'Retrieves event metadata from indexes instead of the events themselves.',
		syntax: 'metasearch [index=<index>] [<search-terms>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['| metasearch index=main', '| metasearch sourcetype=access_*'],
		relatedCommands: ['metadata', 'tstats']
	},
	{
		name: 'meventcollect',
		type: 'Streaming',
		category: 'Data Export',
		description: 'Writes events to a metrics index.',
		syntax: 'meventcollect index=<string> [split=<bool>] [spool=<bool>] [<other-options>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | meventcollect index=metrics_summary'],
		relatedCommands: ['collect', 'mcollect']
	},
	{
		name: 'mcollect',
		type: 'Streaming',
		category: 'Metrics',
		description: 'Converts events to metric data and writes them to a metrics index.',
		syntax: 'mcollect index=<string> [split=<bool>] [spool=<bool>] [prefix_field=<field>]',
		requiredArgs: 1,
		optionalArgs: 4,
		examples: ['... | mcollect index=metrics_app', '... | mcollect index=metrics split=true prefix_field=metric_name'],
		relatedCommands: ['meventcollect', 'collect', 'mstats']
	},
	{
		name: 'mpreview',
		type: 'Generating',
		category: 'Metrics',
		description: 'Previews metric data and shows how it would be collected.',
		syntax: 'mpreview [<mpreview-options>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['| mpreview'],
		relatedCommands: ['mcollect', 'mstats']
	},
	{
		name: 'msearch',
		type: 'Generating',
		category: 'Search',
		description: 'Runs multiple independent searches simultaneously.',
		syntax: 'msearch [<search1>] [<search2>] ...',
		requiredArgs: 1,
		optionalArgs: -1,
		examples: ['| msearch [search index=web] [search index=app]'],
		relatedCommands: ['multisearch', 'append', 'join']
	},
	{
		name: 'mstats',
		type: 'Generating',
		category: 'Metrics',
		description: 'Performs stats-like aggregations on metric time-series data.',
		syntax: 'mstats [prestats=<bool>] [append=<bool>] [<stats-func>(<metric_name>)]... WHERE <index-clause> [<search-clause>] [<span-clause>] [BY <field-list>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['| mstats avg(cpu.usage) WHERE index=metrics by host', '| mstats latest(_value) WHERE index=metrics metric_name=* span=1m'],
		relatedCommands: ['tstats', 'stats', 'mcatalog']
	},
	{
		name: 'multikv',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Extracts field-value pairs from table-formatted events.',
		syntax: 'multikv [conf=<string>] [forceheader=<int>] [fields <field-list>] [filter <field>=<regex>] [<multikv-option>...]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | multikv', '... | multikv forceheader=1 fields name, value, status'],
		relatedCommands: ['extract', 'rex', 'kvform']
	},
	{
		name: 'multisearch',
		type: 'Generating',
		category: 'Data Input',
		description: 'Runs multiple streaming searches at the same time and concatenates the results.',
		syntax: 'multisearch [<search>] [<search>]...',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['| multisearch [search index=main] [search index=security]', '| multisearch [search sourcetype=access_*] [search sourcetype=error_*]'],
		relatedCommands: ['append', 'union']
	},
	{
		name: 'mvcombine',
		type: 'Transforming',
		category: 'Data Manipulation',
		description: 'Combines events that share field values into a single event with a multivalue field.',
		syntax: 'mvcombine [delim=<string>] <field>',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | mvcombine tags', '... | mvcombine delim=";" email_addresses'],
		relatedCommands: ['mvexpand', 'makemv']
	},
	{
		name: 'mvexpand',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Expands the values of a multivalue field into separate events, one event for each value.',
		syntax: 'mvexpand [limit=<int>] <field>',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | mvexpand tags', '... | mvexpand limit=100 email_list'],
		relatedCommands: ['mvcombine', 'makemv']
	},
	{
		name: 'nomv',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Changes multivalue fields into single value fields.',
		syntax: 'nomv <field>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | nomv tags'],
		relatedCommands: ['mvexpand', 'mvcombine']
	},
	{
		name: 'outlier',
		type: 'Streaming',
		category: 'ML & Analytics',
		description: 'Identifies outlier events based on the values of numeric fields.',
		syntax: 'outlier [<field-list>] [action=<action>] [threshold=<num>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | outlier bytes', '... | outlier action=remove duration response_time'],
		relatedCommands: ['anomalies', 'anomalydetection', 'cluster']
	},
	{
		name: 'outputcsv',
		type: 'Streaming',
		category: 'Data Export',
		description: 'Outputs search results to a CSV file.',
		syntax: 'outputcsv [append=<bool>] [create_empty=<bool>] [singlefile=<bool>] [usexml=<bool>] <filename>',
		requiredArgs: 1,
		optionalArgs: 4,
		examples: ['... | outputcsv results.csv', '... | outputcsv append=true singlefile=true output.csv'],
		relatedCommands: ['outputlookup', 'inputcsv']
	},
	{
		name: 'outputlookup',
		type: 'Streaming',
		category: 'Data Export',
		description: 'Writes search results to a static lookup table file or KV store collection.',
		syntax: 'outputlookup [append=<bool>] [create_empty=<bool>] [createinapp=<bool>] [max=<int>] [key_field=<field>] [create_context=<context>] <filename>',
		requiredArgs: 1,
		optionalArgs: 6,
		examples: ['... | outputlookup users_lookup', '... | outputlookup append=true key_field=user_id users_lookup'],
		relatedCommands: ['inputlookup', 'lookup', 'outputcsv']
	},
	{
		name: 'outputtext',
		type: 'Streaming',
		category: 'Data Export',
		description: 'Outputs search results to text files.',
		syntax: 'outputtext [usexml=<bool>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['... | outputtext', '... | outputtext usexml=false'],
		relatedCommands: ['outputcsv']
	},
	{
		name: 'overlap',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Finds events that overlap in time and groups them.',
		syntax: 'overlap [<overlap-options>] <field-list>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | overlap start_time end_time', '... | overlap startfield=start endfield=end by host'],
		relatedCommands: ['transaction', 'concurrency']
	},
	{
		name: 'pivot',
		type: 'Generating',
		category: 'Data Model',
		description: 'Retrieves data from a data model dataset.',
		syntax: 'pivot <datamodel-name> <dataset-name> <cell-methods> [<row-split>] [<column-split>] [<filter>] [<limit>]',
		requiredArgs: 3,
		optionalArgs: 4,
		examples: ['| pivot Authentication Authentication count(Authentication) AS "Count" SPLITROW user'],
		relatedCommands: ['datamodel', 'tstats']
	},
	{
		name: 'predict',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'Uses time series algorithms to predict future values of a field.',
		syntax: 'predict <field-list> [AS <newfield>] [algorithm=<algo>] [future_timespan=<int>] [holdback=<int>] [period=<int>] [<predict-options>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | predict count', '... | predict sales AS predicted_sales future_timespan=30 period=7'],
		relatedCommands: ['trendline', 'autoregress', 'x11']
	},
	{
		name: 'rangemap',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Maps numerical field values to categorical ranges.',
		syntax: 'rangemap [default=<value>] [field=<field>] <range-list>',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | rangemap field=status low=0-299 medium=300-499 high=500-599 critical=600-999', '... | rangemap field=bytes default=unknown small=0-1000 medium=1000-10000 large=10000-100000'],
		relatedCommands: ['case', 'eval']
	},
	{
		name: 'rare',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Returns the least common field values. Opposite of the top command.',
		syntax: 'rare [<limit>] [<rare-options>] <field-list> [by <field-list>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | rare status', '... | rare 5 user by host', '... | rare limit=20 clientip showperc=true'],
		relatedCommands: ['top', 'stats', 'chart']
	},
	{
		name: 'regex',
		type: 'Streaming',
		category: 'Filtering',
		description: 'Filters results to those matching a regular expression.',
		syntax: 'regex (<field>=<regex> | <field>!=<regex> | <regex>)...',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | regex _raw="error|failed|exception"', '... | regex user_agent!=".*bot.*"', '... | regex source="/var/log/.*\\\\.log"'],
		relatedCommands: ['rex', 'where', 'search']
	},
	{
		name: 'relevancy',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'Calculates a relevancy score for search results.',
		syntax: 'relevancy [<relevancy-options>]',
		requiredArgs: 0,
		optionalArgs: 5,
		examples: ['... | relevancy'],
		relatedCommands: ['anomalies']
	},
	{
		name: 'rename',
		type: 'Streaming',
		category: 'Field Operations',
		description: 'Renames one or more fields. Supports wildcard-based bulk renaming.',
		syntax: 'rename <wc-field> AS <wc-field> [<wc-field> AS <wc-field>]...',
		requiredArgs: 2,
		optionalArgs: -1,
		examples: ['... | rename user AS username', '... | rename src_ip AS source_ip, dst_ip AS dest_ip', '... | rename SESS_* AS session_*'],
		relatedCommands: ['eval', 'fields', 'table']
	},
	{
		name: 'replace',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Replaces values in specified fields that match a string.',
		syntax: 'replace (<string> WITH <string>)... [IN <field-list>]',
		requiredArgs: 2,
		optionalArgs: -1,
		examples: ['... | replace 0 WITH Critical, 1 WITH High, 2 WITH Medium IN priority', '... | replace "unknown" WITH "N/A" IN user, host, source'],
		relatedCommands: ['eval', 'rex', 'regex']
	},
	{
		name: 'rex',
		type: 'Streaming',
		category: 'Field Extraction',
		description: 'Extract fields using regular expressions. Supports named capture groups and field modification.',
		syntax: 'rex [field=<field>] [max_match=<int>] [mode=sed] (<regex-expression> | <sed-expression>)',
		requiredArgs: 1,
		optionalArgs: 3,
		examples: ['... | rex field=_raw "(?<user>\\w+)@(?<domain>\\w+\\.\\w+)"', '... | rex "From: (?<email>\\S+)"', '... | rex mode=sed "s/Error/Warning/g"'],
		relatedCommands: ['regex', 'extract', 'erex']
	},
	{
		name: 'reltime',
		type: 'Streaming',
		category: 'Time',
		description: 'Converts time values into a relative time representation.',
		syntax: 'reltime [field=<field>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['... | reltime', '... | reltime field=_time'],
		relatedCommands: ['convert']
	},
	{
		name: 'require',
		type: 'Streaming',
		category: 'Filtering',
		description: 'Requires that specified fields exist and are non-null in events.',
		syntax: 'require <field-list>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | require user, action', '... | require clientip status'],
		relatedCommands: ['where', 'search', 'fields']
	},
	{
		name: 'rest',
		type: 'Generating',
		category: 'Admin',
		description: 'Access REST API endpoints and return results as search events.',
		syntax: 'rest <rest-api-path> [splunk_server=<host>] [splunk_server_group=<server-group>] [timeout=<int>] [count=<int>]',
		requiredArgs: 1,
		optionalArgs: 4,
		examples: ['| rest /services/server/info', '| rest /services/saved/searches count=0'],
		relatedCommands: ['search']
	},
	{
		name: 'return',
		type: 'Generating',
		category: 'Data Manipulation',
		description: 'Returns a calculated field value as the only result.',
		syntax: 'return [<count>] [<field-list> | $<field>]',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | return $count', '... | return total_bytes'],
		relatedCommands: ['eval', 'stats']
	},
	{
		name: 'reverse',
		type: 'Dataset Processing',
		category: 'Data Manipulation',
		description: 'Reverses the order of search results.',
		syntax: 'reverse',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['... | reverse'],
		relatedCommands: ['sort', 'head', 'tail']
	},
	{
		name: 'rtorder',
		type: 'Streaming',
		category: 'Real-time',
		description: 'Ensures events are processed in descending time order for real-time searches.',
		syntax: 'rtorder',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['... | rtorder'],
		relatedCommands: ['sort']
	},
	{
		name: 'run',
		type: 'Unknown',
		category: 'Other',
		description: 'Runs a saved search and returns results.',
		syntax: 'run <savedsearch-name>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['| run my_saved_search'],
		relatedCommands: ['savedsearch', 'loadjob']
	},
	{
		name: 'savedsearch',
		type: 'Generating',
		category: 'Data Input',
		description: 'Returns results from a saved search.',
		syntax: 'savedsearch <savedsearch-name> [<search-modifiers>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['| savedsearch "Top Errors Report"', '| savedsearch my_alerts earliest=-1h'],
		relatedCommands: ['loadjob', 'run']
	},
	{
		name: 'script',
		type: 'Streaming',
		category: 'Advanced',
		description: 'Runs an external script and returns the output.',
		syntax: 'script <script-name> <arg1> <arg2> ...',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | script python custom_processor.py', '... | script perl my_script.pl arg1 arg2'],
		relatedCommands: ['map']
	},
	{
		name: 'scrub',
		type: 'Streaming',
		category: 'Security',
		description: 'Anonymizes sensitive data by replacing values with hash values.',
		syntax: 'scrub [<scrub-options>] [<field-list>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | scrub email credit_card', '... | scrub public=true ssn'],
		relatedCommands: ['anonymize']
	},
	{
		name: 'search',
		type: 'Generating',
		category: 'Search',
		description: 'Primary command for retrieving events from indexes. Usually implicit at the start of a search.',
		syntax: 'search <search-expression>',
		requiredArgs: 0,
		optionalArgs: 100,
		examples: ['search index=main error', 'search source="/var/log/*" status!=200', 'search earliest=-7d latest=now index=web_logs host=prod*'],
		relatedCommands: ['where', 'regex', 'tstats']
	},
	{
		name: 'searchtxn',
		type: 'Generating',
		category: 'Transaction',
		description: 'Finds transaction events that match search results.',
		syntax: 'searchtxn [<txn-options>] <search-terms>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | searchtxn session_id=12345'],
		relatedCommands: ['transaction']
	},
	{
		name: 'selfjoin',
		type: 'Transforming',
		category: 'Data Manipulation',
		description: 'Joins results with itself.',
		syntax: 'selfjoin <field> [max=<int>] [keepsingle=<bool>] [overwrite=<bool>]',
		requiredArgs: 1,
		optionalArgs: 3,
		examples: ['... | selfjoin user_id', '... | selfjoin host max=1 keepsingle=false'],
		relatedCommands: ['join', 'transaction']
	},
	{
		name: 'sendalert',
		type: 'Streaming',
		category: 'Alerting',
		description: 'Invokes a custom alert action.',
		syntax: 'sendalert <alert_action> [param.<name>=<value>]...',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | sendalert email', '... | sendalert slack param.channel="#alerts" param.message="Alert triggered"'],
		relatedCommands: ['sendemail']
	},
	{
		name: 'sendemail',
		type: 'Streaming',
		category: 'Alerting',
		description: 'Emails search results to specified recipients.',
		syntax: 'sendemail to=<email-list> [<email-options>...]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | sendemail to="admin@example.com"', '... | sendemail to="team@example.com" subject="Alert: High CPU" message="CPU exceeded threshold"'],
		relatedCommands: ['sendalert']
	},
	{
		name: 'set',
		type: 'Transforming',
		category: 'Data Manipulation',
		description: 'Performs set operations (union, diff, intersect) on search results.',
		syntax: 'set <set-operation> [<subsearch>]',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | set union [search index=security]', '... | set diff [search index=main status=200]', '... | set intersect [| inputlookup users.csv]'],
		relatedCommands: ['append', 'join', 'multisearch']
	},
	{
		name: 'setfields',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Sets field values to specified values for all events.',
		syntax: 'setfields <field>=<value> [<field>=<value>]...',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | setfields environment="production"', '... | setfields status="processed" updated_by="system"'],
		relatedCommands: ['eval', 'fillnull']
	},
	{
		name: 'sichart',
		type: 'Transforming',
		category: 'Visualization',
		description: 'Summary-indexing version of chart command.',
		syntax: 'sichart [<chart-options>] <stats-agg-term>... [BY <row-split> <column-split>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | sichart count by host'],
		relatedCommands: ['chart', 'sistats']
	},
	{
		name: 'sirare',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Summary-indexing version of rare command.',
		syntax: 'sirare [<sirare-options>] <field-list>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | sirare status by host'],
		relatedCommands: ['rare', 'sistats']
	},
	{
		name: 'sistats',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Summary-indexing version of stats command.',
		syntax: 'sistats [<stats-options>] <stats-agg-term>... [BY <field-list>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | sistats count by source', '... | sistats avg(bytes) max(duration) by host'],
		relatedCommands: ['stats', 'sichart']
	},
	{
		name: 'sitimechart',
		type: 'Transforming',
		category: 'Visualization',
		description: 'Summary-indexing version of timechart command.',
		syntax: 'sitimechart [<timechart-options>] <stats-agg-term>... [BY <split-by-clause>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | sitimechart span=1h count', '... | sitimechart span=1d avg(bytes) by sourcetype'],
		relatedCommands: ['timechart', 'sistats']
	},
	{
		name: 'sitop',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Summary-indexing version of top command.',
		syntax: 'sitop [<sitop-options>] <field-list>',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | sitop limit=20 user', '... | sitop 10 status by host'],
		relatedCommands: ['top', 'sistats']
	},
	{
		name: 'snowevent',
		type: 'Streaming',
		category: 'Integration',
		description: 'Creates events in ServiceNow.',
		syntax: 'snowevent [<servicenow-options>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | snowevent'],
		relatedCommands: ['snowincident', 'sendalert']
	},
	{
		name: 'snoweventstream',
		type: 'Streaming',
		category: 'Integration',
		description: 'Streams events to ServiceNow in real-time.',
		syntax: 'snoweventstream [<servicenow-options>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | snoweventstream'],
		relatedCommands: ['snowevent', 'snowincident']
	},
	{
		name: 'snowincident',
		type: 'Streaming',
		category: 'Integration',
		description: 'Creates incidents in ServiceNow.',
		syntax: 'snowincident [<servicenow-options>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | snowincident'],
		relatedCommands: ['snowevent', 'sendalert']
	},
	{
		name: 'snowincidentstream',
		type: 'Streaming',
		category: 'Integration',
		description: 'Streams incidents to ServiceNow in real-time.',
		syntax: 'snowincidentstream [<servicenow-options>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | snowincidentstream'],
		relatedCommands: ['snowincident', 'snowevent']
	},
	{
		name: 'sort',
		type: 'Streaming',
		category: 'Presentation',
		description: 'Sorts search results by one or more fields in ascending or descending order.',
		syntax: 'sort [<limit>] [<sort-by-clause>]... [<sort-options>]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | sort -count', '... | sort 100 +status, -_time', '... | sort 0 host, source desc', '... | sort limit=50 -bytes'],
		relatedCommands: ['reverse', 'head', 'tail']
	},
	{
		name: 'spath',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Extracts fields from structured data formats like JSON and XML.',
		syntax: 'spath [input=<field>] [output=<field>] [path=<datapath>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | spath', '... | spath input=response output=status path=data.status', '... | spath path=users{}.email output=emails'],
		relatedCommands: ['rex', 'extract', 'xmlkv']
	},
	{
		name: 'strcat',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Concatenates string values into a new field.',
		syntax: 'strcat [allrequired=<bool>] <source-fields>... <dest-field>',
		requiredArgs: 2,
		optionalArgs: 1,
		examples: ['... | strcat firstname " " lastname fullname', '... | strcat protocol "://" host ":" port url'],
		relatedCommands: ['eval']
	},
	{
		name: 'stats',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Calculates aggregate statistics over result sets, such as average, count, and sum. Produces a statistical table with one row per unique BY clause combination.',
		syntax: 'stats [<stats-options>] <stats-agg-term>... [BY <field-list>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | stats count', '... | stats avg(bytes) by host', '... | stats count, avg(duration), max(bytes) by status', '... | stats dc(user) AS unique_users sum(sales) AS total_sales by product'],
		relatedCommands: ['eventstats', 'streamstats', 'chart', 'timechart', 'top']
	},
	{
		name: 'streamstats',
		type: 'Centralized Streaming',
		category: 'Stats & Aggregation',
		description: 'Calculates statistics for each event at the time the event is seen. Similar to stats but runs incrementally.',
		syntax: 'streamstats [<stats-options>] <stats-agg-term>... [BY <field-list>] [<window-option>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | streamstats count', '... | streamstats avg(bytes) window=10', '... | streamstats sum(sales) AS running_total by region current=false'],
		relatedCommands: ['stats', 'eventstats', 'accum']
	},
	{
		name: 'table',
		type: 'Transforming',
		category: 'Presentation',
		description: 'Retains only the specified fields and returns results in tabular format.',
		syntax: 'table <field-list>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | table _time host status bytes', '... | table user action result'],
		relatedCommands: ['fields', 'transpose']
	},
	{
		name: 'tags',
		type: 'Streaming',
		category: 'Data Enrichment',
		description: 'Annotates events with tags based on field values.',
		syntax: 'tags [<tag-options>] [<field-list>]',
		requiredArgs: 0,
		optionalArgs: 5,
		examples: ['... | tags', '... | tags outputfield=tag host source'],
		relatedCommands: ['search', 'eval']
	},
	{
		name: 'tail',
		type: 'Streaming',
		category: 'Filtering',
		description: 'Returns the last N events from search results.',
		syntax: 'tail [<N>]',
		requiredArgs: 0,
		optionalArgs: 1,
		examples: ['... | tail 20', '... | tail 100'],
		relatedCommands: ['head', 'reverse', 'sort']
	},
	{
		name: 'timechart',
		type: 'Transforming',
		category: 'Visualization',
		description: 'Creates time-series chart. Performs statistical aggregation against time.',
		syntax: 'timechart [<timechart-options>] <stats-agg-term>... [by <field>] [<bin-options>]',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['... | timechart count', '... | timechart span=1h avg(bytes) by status', '... | timechart limit=10 useother=false sum(sales) by product'],
		relatedCommands: ['chart', 'timewrap', 'bin']
	},
	{
		name: 'timewrap',
		type: 'Transforming',
		category: 'Time',
		description: 'Compares data over time by overlaying different time periods.',
		syntax: 'timewrap [<timewrap-series>] [<timewrap-options>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | timechart count | timewrap 1d', '... | timechart avg(response_time) | timewrap 7d series=short'],
		relatedCommands: ['timechart', 'trendline']
	},
	{
		name: 'tojson',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Converts events or fields to JSON format.',
		syntax: 'tojson [<field-list>] [output=<field>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | tojson', '... | tojson user, status output=json_data', '... | tojson output=event_json'],
		relatedCommands: ['fromjson', 'spath', 'eval']
	},
	{
		name: 'top',
		type: 'Transforming',
		category: 'Stats & Aggregation',
		description: 'Returns the most common field values. Shows frequency count and percentage.',
		syntax: 'top [<limit>] [<top-options>] <field-list> [by <field-list>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | top status', '... | top 10 user by host', '... | top limit=20 clientip showperc=false'],
		relatedCommands: ['rare', 'stats', 'chart']
	},
	{
		name: 'transaction',
		type: 'Dataset Processing',
		category: 'Transaction',
		description: 'Groups events into transactions based on constraints like time and matching field values.',
		syntax: 'transaction <field-list> [<transaction-options>...]',
		requiredArgs: 1,
		optionalArgs: 15,
		examples: ['... | transaction session_id maxspan=30m', '... | transaction user startswith="login" endswith="logout" maxevents=100'],
		relatedCommands: ['join', 'selfjoin', 'searchtxn']
	},
	{
		name: 'transpose',
		type: 'Transforming',
		category: 'Presentation',
		description: 'Reformats rows as columns and columns as rows.',
		syntax: 'transpose [<int>] [column_name=<field>] [header_field=<field>] [include_empty=<bool>]',
		requiredArgs: 0,
		optionalArgs: 4,
		examples: ['... | transpose', '... | transpose column_name=metric header_field=host', '... | transpose 0'],
		relatedCommands: ['table', 'untable', 'xyseries']
	},
	{
		name: 'trendline',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'Computes moving averages and polynomial trends.',
		syntax: 'trendline <trendtype><period>(<field>) [AS <newfield>]',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | trendline sma5(count) AS trend', '... | trendline wma10(sales) AS weighted_avg', '... | trendline sma2(cpu_usage) ema3(memory_usage)'],
		relatedCommands: ['predict', 'autoregress', 'x11']
	},
	{
		name: 'trim',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Removes leading and trailing whitespace from field values.',
		syntax: 'trim <field> [<trim-chars>]',
		requiredArgs: 1,
		optionalArgs: 1,
		examples: ['... | trim username', '... | trim description "\\\\"\\\'\\\\s"'],
		relatedCommands: ['eval', 'replace']
	},
	{
		name: 'tscollect',
		type: 'Streaming',
		category: 'Data Export',
		description: 'Writes events to a tsidx file for more efficient searches.',
		syntax: 'tscollect [namespace=<string>] [<tscollect-options>...]',
		requiredArgs: 0,
		optionalArgs: 10,
		examples: ['... | tscollect namespace=summary_index'],
		relatedCommands: ['collect', 'tstats']
	},
	{
		name: 'tstats',
		type: 'Generating',
		category: 'Stats & Aggregation',
		description: 'Performs stats-like aggregations on accelerated data models, tsidx files, or metric indexes.',
		syntax: 'tstats [<tstats-options>] <stats-agg-term>... [FROM <datamodel> | WHERE <clause>] [BY <field-list>] [<span-clause>]',
		requiredArgs: 1,
		optionalArgs: 15,
		examples: ['| tstats count WHERE index=main by source', '| tstats summariesonly=true count FROM datamodel=Authentication BY Authentication.user', '| tstats prestats=true avg(All_Traffic.bytes) WHERE index=network span=1h | timechart avg(All_Traffic.bytes)'],
		relatedCommands: ['stats', 'mstats', 'pivot']
	},
	{
		name: 'typeahead',
		type: 'Generating',
		category: 'Search',
		description: 'Returns typeahead information for interactive searches.',
		syntax: 'typeahead <prefix> [<typeahead-options>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['| typeahead prefix=error index=main'],
		relatedCommands: ['search']
	},
	{
		name: 'typelearner',
		type: 'Transforming',
		category: 'Data Extraction',
		description: 'Generates field extractions based on example events.',
		syntax: 'typelearner <field>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | typelearner _raw'],
		relatedCommands: ['extract', 'rex', 'erex']
	},
	{
		name: 'typer',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Calculates the eventtypes for events.',
		syntax: 'typer',
		requiredArgs: 0,
		optionalArgs: 0,
		examples: ['... | typer'],
		relatedCommands: ['search']
	},
	{
		name: 'union',
		type: 'Generating',
		category: 'Data Manipulation',
		description: 'Merges results from multiple datasets.',
		syntax: 'union [<union-options>...] [<subsearch>]...',
		requiredArgs: 1,
		optionalArgs: 10,
		examples: ['| union [search index=main] [search index=security]', '| union maxtime=30 [inputlookup users.csv] [search index=directory]'],
		relatedCommands: ['append', 'multisearch', 'join']
	},
	{
		name: 'uniq',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Removes duplicate events based on field values. Like dedup but centralized.',
		syntax: 'uniq [<uniq-options>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['... | sort _time | uniq', '... | uniq'],
		relatedCommands: ['dedup']
	},
	{
		name: 'untable',
		type: 'Transforming',
		category: 'Presentation',
		description: 'Converts tabular data to name-value pair format.',
		syntax: 'untable <x-field> <y-name-field> <y-data-field>',
		requiredArgs: 3,
		optionalArgs: 0,
		examples: ['... | untable host metric value', '... | stats count by source status | untable source status count'],
		relatedCommands: ['transpose', 'xyseries', 'table']
	},
	{
		name: 'x11',
		type: 'Transforming',
		category: 'ML & Analytics',
		description: 'Enables you to determine the trend and seasonal patterns in your data using the X-11 method.',
		syntax: 'x11 <field> [<x11-options>]',
		requiredArgs: 1,
		optionalArgs: 5,
		examples: ['... | x11 sales', '... | x11 count trend=true season=true'],
		relatedCommands: ['predict', 'trendline', 'autoregress']
	},
	{
		name: 'xmlkv',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Extracts field-value pairs from XML-formatted data.',
		syntax: 'xmlkv [maxinputs=<int>] [<field>]',
		requiredArgs: 0,
		optionalArgs: 2,
		examples: ['... | xmlkv', '... | xmlkv maxinputs=10000 response'],
		relatedCommands: ['spath', 'xpath', 'kvform']
	},
	{
		name: 'xmlunescape',
		type: 'Streaming',
		category: 'Data Manipulation',
		description: 'Unescapes XML characters in field values.',
		syntax: 'xmlunescape <field>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | xmlunescape html_content'],
		relatedCommands: ['xmlkv', 'spath']
	},
	{
		name: 'xpath',
		type: 'Streaming',
		category: 'Data Extraction',
		description: 'Extracts values from XML data using XPath expressions.',
		syntax: 'xpath [field=<field>] [outfield=<field>] <xpath-expression>',
		requiredArgs: 1,
		optionalArgs: 2,
		examples: ['... | xpath "//user/name" outfield=username', '... | xpath field=xml_data "//item/@id"'],
		relatedCommands: ['spath', 'xmlkv']
	},
	{
		name: 'walklex',
		type: 'Generating',
		category: 'Index Management',
		description: 'Walks the lexicon of indexed fields and returns term statistics.',
		syntax: 'walklex [type=<field-type>] [<field>] [prefix=<string>]',
		requiredArgs: 0,
		optionalArgs: 3,
		examples: ['| walklex type=term user', '| walklex prefix=error'],
		relatedCommands: ['metadata', 'typeahead']
	},
	{
		name: 'where',
		type: 'Streaming',
		category: 'Filtering & Searching',
		description: 'Filters search results using eval expressions. Uses the same expression syntax as the eval command.',
		syntax: 'where <eval-expression>',
		requiredArgs: 1,
		optionalArgs: 0,
		examples: ['... | where status >= 400', '... | where bytes > 1000 AND method="POST"', '... | where isnotnull(user) AND len(user) > 5', '... | where like(host, "prod%")'],
		relatedCommands: ['eval', 'search', 'regex']
	},
	{
		name: 'xyseries',
		type: 'Transforming',
		category: 'Presentation',
		description: 'Converts results into a tabular format suitable for graphing.',
		syntax: 'xyseries <x-field> <y-name-field> <y-data-field>',
		requiredArgs: 3,
		optionalArgs: 0,
		examples: ['... | xyseries _time host bytes', '... | stats count by source status | xyseries source status count'],
		relatedCommands: ['chart', 'transpose', 'untable']
	}
];

/**
 * Lookup helper function to find command by name
 */
export function getSPLCommand(name: string): SPLCommand | undefined {
	return SPL_COMMANDS.find(cmd => cmd.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get parameter definitions for a command
 */
export function getCommandParameters(name: string): ParameterDefinition[] {
	const cmd = getSPLCommand(name);
	return cmd?.parameters || [];
}
