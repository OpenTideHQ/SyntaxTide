/**
 * Auto-generated SPL Command Parameter Definitions
 * Generated from COMMANDS_ANALYSIS.json
 * DO NOT EDIT MANUALLY - Run generate-command-parameters.py to regenerate
 */

import { ParameterDefinition, ParameterType } from './spl-parameter-types';

// abstract command parameters
export const ABSTRACT_PARAMS: ParameterDefinition[] = [
	{
		name: 'maxterms',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxterms=<int>',
		description: `The maximum number of terms to match. Accepted values are 1 to 1000.`,
		valueType: 'int',
		defaultValue: '1000'
	},
	{
		name: 'maxlines',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxlines=<int>',
		description: `The maximum number of lines to match. Accepted values are 1 to 500.`,
		valueType: 'int',
		defaultValue: '10'
	},
];

// accum command parameters
export const ACCUM_PARAMS: ParameterDefinition[] = [
	{
		name: 'field',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<string>',
		description: `The name of the field that you want to calculate the accumulated sum for. The field must contain numeric values.`,
		valueType: 'string'
	},
	{
		name: 'newfield',
		type: ParameterType.FIELD,
		required: false,
		syntax: '<string>',
		description: `The name of a new field where you want the results placed.`,
		valueType: 'string'
	},
];

// addcoltotals command parameters
export const ADDCOLTOTALS_PARAMS: ParameterDefinition[] = [
	{
		name: 'wc-field-list',
		type: ParameterType.MULTI_VALUE,
		required: false,
		syntax: '<field> ...',
		description: `A space delimited list of valid field names. The addcoltotals command calculates the sum only for the fields in the list you specify.`,
		valueType: 'field'
	},
	{
		name: 'labelfield',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'labelfield=<fieldname>',
		description: `Specify a field name to add to the result set.`,
		valueType: 'fieldname',
		defaultValue: 'none'
	},
	{
		name: 'label',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'label=<string>',
		description: `Used with the labelfield argument to add a label in the summary event.`,
		valueType: 'string',
		defaultValue: 'Total'
	},
];

// addtotals command parameters
export const ADDTOTALS_PARAMS: ParameterDefinition[] = [
	{
		name: 'field-list',
		type: ParameterType.MULTI_VALUE,
		required: false,
		syntax: '<field> ...',
		description: `One or more numeric fields, delimited with a space. Only the fields specified in the <field-list> are summed.`,
		valueType: 'field'
	},
	{
		name: 'row',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'row=<bool>',
		description: `Specifies whether to calculate the sum of the <field-list> for each event.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
	{
		name: 'col',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'col=<bool>',
		description: `Specifies whether to add a new event, referred to as a summary event, at the bottom of the list of events.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'fieldname',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'fieldname=<field>',
		description: `Used to specify the name of the field that contains the calculated sum of the field-list for each event.`,
		valueType: 'field',
		defaultValue: 'Total'
	},
	{
		name: 'labelfield',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'labelfield=<field>',
		description: `Used to specify a field for the summary event label.`,
		valueType: 'field',
		defaultValue: 'none'
	},
	{
		name: 'label',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'label=<string>',
		description: `Used to specify a row label for the summary event.`,
		valueType: 'string',
		defaultValue: 'Total'
	},
];

// analyzefields command parameters
export const ANALYZEFIELDS_PARAMS: ParameterDefinition[] = [
	{
		name: 'classfield',
		type: ParameterType.NAMED,
		required: true,
		syntax: 'classfield=<field>',
		description: `For best results, classfield should have two distinct values, although multiclass analysis is possible.`,
		valueType: 'field'
	},
];

// anomalies command parameters
export const ANOMALIES_PARAMS: ParameterDefinition[] = [
	{
		name: 'threshold',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'threshold=<num>',
		description: `A number to represent the upper limit of expected or normal events.`,
		valueType: 'num',
		defaultValue: '0.01'
	},
	{
		name: 'labelonly',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'labelonly=<bool>',
		description: `Specifies if you want the output result set to include all events or only the events that are above the threshold value.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'normalize',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'normalize=<bool>',
		description: `Specifies whether or not to normalize numeric text in the fields.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
	{
		name: 'maxvalues',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxvalues=<num>',
		description: `Specifies the size of the sliding set of previous events to include when determining the unexpectedness of a field value.`,
		valueType: 'num',
		defaultValue: '100'
	},
	{
		name: 'field',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'field=<field>',
		description: `The field to analyze when determining the unexpectedness of an event.`,
		valueType: 'field',
		defaultValue: '_raw'
	},
	{
		name: 'denylist',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'denylist=<filename>',
		description: `The name of a CSV file that contains a list of events that are expected and should be ignored.`,
		valueType: 'filename'
	},
	{
		name: 'denylistthreshold',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'denylistthreshold=<num>',
		description: `Specifies a similarity score threshold for matching incoming events to denylisted events.`,
		valueType: 'num',
		defaultValue: '0.05'
	},
];

// anomalousvalue command parameters
export const ANOMALOUSVALUE_PARAMS: ParameterDefinition[] = [
	{
		name: 'maxanofreq',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxanofreq=<float>',
		description: `Maximum anomalous frequency is expressed as a floating point number between 0 and 1.`,
		valueType: 'float',
		defaultValue: '0.05'
	},
	{
		name: 'minnormfreq',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'minnormfreq=<float>',
		description: `Minimum normal frequency is expressed as a floating point number between 0 and 1.`,
		valueType: 'float',
		defaultValue: '0.01'
	},
	{
		name: 'minsupcount',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'minsupcount=<int>',
		description: `Minimum supported count must be a positive integer.`,
		valueType: 'int',
		defaultValue: '100'
	},
	{
		name: 'minsupfreq',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'minsupfreq=<float>',
		description: `Minimum supported frequency is expressed as a floating point number between 0 and 1.`,
		valueType: 'float',
		defaultValue: '0.05'
	},
	{
		name: 'action',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'action=annotate | filter | summary',
		description: `Specify whether to return the anomaly score (annotate), filter out events that are not anomalous values (filter), or return a summary of anomaly statistics (summary).`,
		valueType: 'string',
		defaultValue: 'filter'
	},
	{
		name: 'pthresh',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'pthresh=<num>',
		description: `Probability threshold (as a decimal) that has to be met for a value to be considered anomalous.`,
		valueType: 'num',
		defaultValue: '0.01'
	},
];

// anomalydetection command parameters
export const ANOMALYDETECTION_PARAMS: ParameterDefinition[] = [
	{
		name: 'method',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'method = histogram | zscore | iqr',
		description: `Select the method of anomaly detection.`,
		valueType: 'string',
		defaultValue: 'method=histogram'
	},
	{
		name: 'action',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'action = filter | annotate | summary | remove | transform',
		description: `The actions and defaults depend on the method that you specify.`,
		valueType: 'string'
	},
	{
		name: 'pthresh',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'pthresh=<num>',
		description: `Used with method=histogram or method=zscore. Sets the probability threshold, as a decimal number, that has to be met for an event to be deemed anomalous.`,
		valueType: 'num'
	},
	{
		name: 'cutoff',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'cutoff=<bool>',
		description: `Sets the upper bound threshold on the number of anomalies. This option applies to only the histogram method.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
];

// append command parameters
export const APPEND_PARAMS: ParameterDefinition[] = [
	{
		name: 'subsearch',
		type: ParameterType.POSITIONAL,
		required: true,
		syntax: '[subsearch]',
		description: `A secondary search where you specify the source of the events that you want to append. The subsearch must be enclosed in square brackets.`,
		valueType: 'string'
	},
	{
		name: 'extendtimerange',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'extendtimerange=<boolean>',
		description: `Specifies whether to include the subsearch time range in the time range for the entire search.`,
		valueType: 'boolean',
		defaultValue: 'false'
	},
	{
		name: 'maxtime',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxtime=<int>',
		description: `The maximum time, in seconds, to spend on the subsearch before automatically finalizing.`,
		valueType: 'int',
		defaultValue: '60'
	},
	{
		name: 'maxout',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxout=<int>',
		description: `The maximum number of result rows to output from the subsearch.`,
		valueType: 'int',
		defaultValue: '50000'
	},
];

// appendcols command parameters
export const APPENDCOLS_PARAMS: ParameterDefinition[] = [
	{
		name: 'subsearch',
		type: ParameterType.POSITIONAL,
		required: true,
		syntax: '<subsearch>',
		description: `A secondary search added to the main search.`,
		valueType: 'subsearch'
	},
	{
		name: 'override',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'override=<bool>',
		description: `If the override argument is false, and if a field is present in both a subsearch result and the main result, the main result is used.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'maxtime',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxtime=<int>',
		description: `The maximum time, in units of seconds, to spend on the subsearch before automatically finalizing.`,
		valueType: 'int',
		defaultValue: '60'
	},
	{
		name: 'maxout',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxout=<int>',
		description: `The maximum number of result rows to output from the subsearch.`,
		valueType: 'int',
		defaultValue: '50000'
	},
	{
		name: 'timeout',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'timeout=<int>',
		description: `The maximum time, in units of seconds, to wait for subsearch to fully finish.`,
		valueType: 'int',
		defaultValue: '60'
	},
];

// appendpipe command parameters
export const APPENDPIPE_PARAMS: ParameterDefinition[] = [
	{
		name: 'run_in_preview',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'run_in_preview=<bool>',
		description: `Specifies whether or not display the impact of the appendpipe command in the preview.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
	{
		name: 'subpipeline',
		type: ParameterType.POSITIONAL,
		required: false,
		syntax: '<subpipeline>',
		description: `A list of commands that are applied to the search results from the commands that occur in the search before the appendpipe command.`,
		valueType: 'subpipeline'
	},
];

// arules command parameters
export const ARULES_PARAMS: ParameterDefinition[] = [
	{
		name: 'field-list',
		type: ParameterType.MULTI_VALUE,
		required: true,
		syntax: '<field> <field> ...',
		description: `The list of field names. At least two fields must be specified.`,
		valueType: 'field'
	},
	{
		name: 'sup',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'sup=<int>',
		description: `Specify a support limit. Associations with computed support levels smaller than this value are not included in the output results.`,
		valueType: 'int',
		defaultValue: '3'
	},
	{
		name: 'conf',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'conf=<float>',
		description: `Specify a confidence limit. Associations with a confidence (expressed as Strength field) are not included in the output results.`,
		valueType: 'float',
		defaultValue: '0.5'
	},
];

// associate command parameters
export const ASSOCIATE_PARAMS: ParameterDefinition[] = [
	{
		name: 'supcnt',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'supcnt=<num>',
		description: `Specifies the minimum number of times that the reference key=reference value combination must appear.`,
		valueType: 'num',
		defaultValue: '100'
	},
	{
		name: 'supfreq',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'supfreq=<num>',
		description: `Specifies the minimum frequency of reference key=reference value combination as a fraction of the number of total events.`,
		valueType: 'num',
		defaultValue: '0.1'
	},
	{
		name: 'improv',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'improv=<num>',
		description: `Specifies a limit, or minimum entropy improvement, for the target key.`,
		valueType: 'num',
		defaultValue: '0.5'
	},
];

// autoregress command parameters
export const AUTOREGRESS_PARAMS: ParameterDefinition[] = [
	{
		name: 'field',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<string>',
		description: `The name of a field. Most usefully a field with numeric values.`,
		valueType: 'string'
	},
	{
		name: 'p',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'p=<int> | p=<int>-<int>',
		description: `Specifies which prior events to copy values from. You can specify a single integer or a numeric range.`,
		valueType: 'int',
		defaultValue: '1'
	},
	{
		name: 'newfield',
		type: ParameterType.FIELD,
		required: false,
		syntax: '<field>',
		description: `If p is set to a single integer, the newfield argument specifies a field name to copy the single field value into.`,
		valueType: 'field'
	},
];

// bin command parameters
export const BIN_PARAMS: ParameterDefinition[] = [
	{
		name: 'field',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<field>',
		description: `Specify a field name.`,
		valueType: 'field'
	},
	{
		name: 'bins',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'bins=<int>',
		description: `Sets the maximum number of bins to discretize into.`,
		valueType: 'int',
		defaultValue: '100'
	},
	{
		name: 'minspan',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'minspan=<span-length>',
		description: `Specifies the smallest span granularity to use automatically inferring span from the data time range.`,
		valueType: 'span-length'
	},
	{
		name: 'span',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'span = <log-span> | <span-length>',
		description: `Sets the size of each bin, using a span length based on a logarithm-based span or based on time.`,
		valueType: 'log-span'
	},
	{
		name: 'start',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'start=<num>',
		description: `Sets the minimum extents for numerical bins.`,
		valueType: 'num'
	},
	{
		name: 'end',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'end=<num>',
		description: `Sets the maximum extents for numerical bins.`,
		valueType: 'num'
	},
	{
		name: 'aligntime',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'aligntime=(earliest | latest | <time-specifier>)',
		description: `Align the bin times to something other than base UTC time (epoch 0).`,
		valueType: 'time-specifier'
	},
];

// bucket command parameters
export const BUCKET_PARAMS: ParameterDefinition[] = [
	{
		name: 'field',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<field>',
		description: `Specify a field name.`,
		valueType: 'field'
	},
];

// bucketdir command parameters
export const BUCKETDIR_PARAMS: ParameterDefinition[] = [
	{
		name: 'pathfield',
		type: ParameterType.NAMED,
		required: true,
		syntax: 'pathfield=<field>',
		description: `Specify a field name that has a path value.`,
		valueType: 'field'
	},
	{
		name: 'sizefield',
		type: ParameterType.NAMED,
		required: true,
		syntax: 'sizefield=<field>',
		description: `Specify a numeric field that defines the size of bucket.`,
		valueType: 'field'
	},
	{
		name: 'countfield',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'countfield=<field>',
		description: `Specify a numeric field that describes the count of events.`,
		valueType: 'field'
	},
	{
		name: 'maxcount',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'maxcount=<int>',
		description: `Specify the total number of events to bucket.`,
		valueType: 'int'
	},
	{
		name: 'sep',
		type: ParameterType.POSITIONAL,
		required: false,
		syntax: '<char>',
		description: `The separating character. Specify either a forward slash / or double back slashes \\.`,
		valueType: 'char'
	},
];

// chart command parameters
export const CHART_PARAMS: ParameterDefinition[] = [
	{
		name: 'stats-agg-term OR sparkline-agg-term OR eval-expression',
		type: ParameterType.MULTI_VALUE,
		required: true,
		syntax: '<stats-func>(<evaled-field> | <wc-field>) [AS <wc-field>] | <sparkline-agg> [AS <wc-field>] | (<eval-expression>)',
		description: `A statistical aggregation function, sparkline aggregation function, or eval expression.`,
		valueType: 'stats-func'
	},
	{
		name: 'agg',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'agg=<stats-agg-term>',
		description: `Specify an aggregator or function.`,
		valueType: 'stats-agg-term'
	},
	{
		name: 'cont',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'cont=<bool>',
		description: `Specifies if the bins are continuous.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
	{
		name: 'format',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'format=<string>',
		description: `Used to construct output field names when multiple data series are used in conjunction with a split-by-field.`,
		valueType: 'string'
	},
	{
		name: 'limit',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'limit=(top | bottom) <int>',
		description: `Only valid when a column-split is specified. Use the limit option to specify the number of results that should appear in the output.`,
		valueType: 'int',
		defaultValue: 'top 10'
	},
	{
		name: 'sep',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'sep=<string>',
		description: `Used to construct output field names when multiple data series are used in conjunctions with a split-by field.`,
		valueType: 'string'
	},
	{
		name: 'dedup_splitvals',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'dedup_splitvals=<boolean>',
		description: `Specifies whether to remove duplicate values in multivalued BY clause fields.`,
		valueType: 'boolean',
		defaultValue: 'false'
	},
];

// cluster command parameters
export const CLUSTER_PARAMS: ParameterDefinition[] = [
	{
		name: 't',
		type: ParameterType.NAMED,
		required: false,
		syntax: 't=<num>',
		description: `Sets the cluster threshold, which controls the sensitivity of the clustering.`,
		valueType: 'num',
		defaultValue: '0.8'
	},
	{
		name: 'delims',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'delims=<string>',
		description: `Configures the set of delimiters used to tokenize the raw string.`,
		valueType: 'string'
	},
	{
		name: 'showcount',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'showcount=<bool>',
		description: `If showcount=false, indexers cluster its own events before clustering on the search head.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'countfield',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'countfield=<field>',
		description: `Name of the field to which the cluster size is to be written if showcount=true is true.`,
		valueType: 'field',
		defaultValue: 'cluster_count'
	},
	{
		name: 'labelfield',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'labelfield=<field>',
		description: `Name of the field to write the cluster number to.`,
		valueType: 'field',
		defaultValue: 'cluster_label'
	},
	{
		name: 'field',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'field=<field>',
		description: `Name of the field to analyze in each event.`,
		valueType: 'field',
		defaultValue: '_raw'
	},
	{
		name: 'labelonly',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'labelonly=<bool>',
		description: `Select whether to preserve incoming events and annotate them with the cluster they belong to (labelonly=true) or output only the cluster fields as new events (labelonly=false).`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'match',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'match=(termlist | termset | ngramset)',
		description: `Select the method used to determine the similarity between events.`,
		valueType: 'string',
		defaultValue: 'termlist'
	},
];

// cofilter command parameters
export const COFILTER_PARAMS: ParameterDefinition[] = [
	{
		name: 'field1',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<field>',
		description: `The name of field.`,
		valueType: 'field'
	},
	{
		name: 'field2',
		type: ParameterType.FIELD,
		required: true,
		syntax: '<field>',
		description: `The name of a field.`,
		valueType: 'field'
	},
];

// collect command parameters
export const COLLECT_PARAMS: ParameterDefinition[] = [
	{
		name: 'index',
		type: ParameterType.NAMED,
		required: true,
		syntax: 'index=<string>',
		description: `Name of the summary index where the events are added. The index must exist before the events are added.`,
		valueType: 'string'
	},
	{
		name: 'addinfo',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'addinfo=<bool>',
		description: `Use this option to specify whether to prefix search time and time-range information fields on to each summary index event.`,
		valueType: 'bool',
		defaultValue: 'true (events index/raw), false (metrics index)'
	},
	{
		name: 'addtime',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'addtime=<bool>',
		description: `Use this option to specify whether to prefix a time field on to each event.`,
		valueType: 'bool',
		defaultValue: 'true (events index), false (metrics index)'
	},
	{
		name: 'file',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'file=<string>',
		description: `The file name where you want the events to be written.`,
		valueType: 'string',
		defaultValue: '<random-number>_events.stash'
	},
	{
		name: 'host',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'host=<string>',
		description: `The name of the host that you want to specify for the events.`,
		valueType: 'string'
	},
	{
		name: 'marker',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'marker=<string>',
		description: `A string, usually of key-value pairs, to append to each event written out.`,
		valueType: 'string'
	},
	{
		name: 'output_format',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'output_format=[raw | hec]',
		description: `Specifies the output format for the summary indexing.`,
		valueType: 'string',
		defaultValue: 'raw'
	},
	{
		name: 'run_in_preview',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'run_in_preview=<bool>',
		description: `Controls whether the collect command is enabled during preview generation.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'spool',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'spool=<bool>',
		description: `If set to true, the summary indexing file is written to the Splunk spool directory.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
	{
		name: 'source',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'source=<string>',
		description: `The name of the source that you want to specify for the events.`,
		valueType: 'string'
	},
	{
		name: 'sourcetype',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'sourcetype=<string>',
		description: `The name of the source type that you want to specify for the events.`,
		valueType: 'string',
		defaultValue: 'stash'
	},
	{
		name: 'testmode',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'testmode=<bool>',
		description: `Toggle between testing and real mode.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'timeformat',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'timeformat=<string>',
		description: `Controls the format of the timestamp that is written to the stash file before it is indexed.`,
		valueType: 'string',
		defaultValue: '%m/%d/%Y %H:%M:%S %z'
	},
	{
		name: 'uselb',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'uselb=<bool>',
		description: `Controls how line breaks are used to split events.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
];

// convert command parameters
export const CONVERT_PARAMS: ParameterDefinition[] = [
	{
		name: 'convert-function',
		type: ParameterType.POSITIONAL,
		required: true,
		syntax: 'auto() | ctime() | dur2sec() | memk() | mktime() | mstime() | none() | num() | rmcomma() | rmunit()',
		description: `Functions to use for the conversion.`,
		valueType: 'auto() | ctime() | dur2sec() | memk() | mktime() | mstime() | none() | num() | rmcomma() | rmunit()'
	},
	{
		name: 'timeformat',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'timeformat=<string>',
		description: `Specify the output format for the converted time field. The timeformat option is used by ctime and mktime functions.`,
		valueType: 'string',
		defaultValue: '%m/%d/%Y %H:%M:%S'
	},
	{
		name: 'field',
		type: ParameterType.FIELD,
		required: false,
		syntax: '<string>',
		description: `Creates a new field with the name you specify to place the converted values into.`,
		valueType: 'string'
	},
];

// inputlookup command parameters
export const INPUTLOOKUP_PARAMS: ParameterDefinition[] = [
	{
		name: 'filename',
		type: ParameterType.POSITIONAL,
		required: true,
		syntax: '<filename>',
		description: `The name of the lookup table file or KV store collection. Can include .csv extension or omit it.`,
		valueType: 'string'
	},
	{
		name: 'append',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'append=<bool>',
		description: `If set to true, appends the lookup table data to the current set of results instead of replacing it.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'start',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'start=<int>',
		description: `Specifies the starting offset to begin reading the lookup table. Used for pagination.`,
		valueType: 'int',
		defaultValue: '0'
	},
	{
		name: 'max',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'max=<int>',
		description: `Specifies the maximum number of results to return from the lookup table.`,
		valueType: 'int'
	},
	{
		name: 'strict',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'strict=<bool>',
		description: `If set to true, raises an error if the lookup file does not exist.`,
		valueType: 'bool',
		defaultValue: 'true'
	},
];

// outputlookup command parameters
export const OUTPUTLOOKUP_PARAMS: ParameterDefinition[] = [
	{
		name: 'filename',
		type: ParameterType.POSITIONAL,
		required: true,
		syntax: '<filename>',
		description: `The name of the lookup table file or KV store collection to write to. Can include .csv extension or omit it.`,
		valueType: 'string'
	},
	{
		name: 'append',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'append=<bool>',
		description: `If set to true, appends results to the existing lookup table instead of overwriting it.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'create_empty',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'create_empty=<bool>',
		description: `If set to true, creates an empty lookup table file when there are no results.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'createinapp',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'createinapp=<bool>',
		description: `If set to true, the lookup table is created in the app context instead of the user context.`,
		valueType: 'bool',
		defaultValue: 'false'
	},
	{
		name: 'max',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'max=<int>',
		description: `Specifies the maximum number of results to write to the lookup table.`,
		valueType: 'int'
	},
	{
		name: 'key_field',
		type: ParameterType.NAMED,
		required: false,
		syntax: 'key_field=<field>',
		description: `Specifies the field to use as the key for KV store collections. Used for upsert operations.`,
		valueType: 'field'
	},
];

