"use strict";
/**
 * Auto-generated SPL Command Parameter Definitions
 * Generated from COMMANDS_ANALYSIS.json
 * DO NOT EDIT MANUALLY - Run generate-command-parameters.py to regenerate
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONVERT_PARAMS = exports.COLLECT_PARAMS = exports.COFILTER_PARAMS = exports.CLUSTER_PARAMS = exports.CHART_PARAMS = exports.BUCKETDIR_PARAMS = exports.BUCKET_PARAMS = exports.BIN_PARAMS = exports.AUTOREGRESS_PARAMS = exports.ASSOCIATE_PARAMS = exports.ARULES_PARAMS = exports.APPENDPIPE_PARAMS = exports.APPENDCOLS_PARAMS = exports.APPEND_PARAMS = exports.ANOMALYDETECTION_PARAMS = exports.ANOMALOUSVALUE_PARAMS = exports.ANOMALIES_PARAMS = exports.ANALYZEFIELDS_PARAMS = exports.ADDTOTALS_PARAMS = exports.ADDCOLTOTALS_PARAMS = exports.ACCUM_PARAMS = exports.ABSTRACT_PARAMS = void 0;
const spl_parameter_types_1 = require("./spl-parameter-types");
// abstract command parameters
exports.ABSTRACT_PARAMS = [
    {
        name: 'maxterms',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxterms=<int>',
        description: `The maximum number of terms to match. Accepted values are 1 to 1000.`,
        valueType: 'int',
        defaultValue: '1000'
    },
    {
        name: 'maxlines',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxlines=<int>',
        description: `The maximum number of lines to match. Accepted values are 1 to 500.`,
        valueType: 'int',
        defaultValue: '10'
    },
];
// accum command parameters
exports.ACCUM_PARAMS = [
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<string>',
        description: `The name of the field that you want to calculate the accumulated sum for. The field must contain numeric values.`,
        valueType: 'string'
    },
    {
        name: 'newfield',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: false,
        syntax: '<string>',
        description: `The name of a new field where you want the results placed.`,
        valueType: 'string'
    },
];
// addcoltotals command parameters
exports.ADDCOLTOTALS_PARAMS = [
    {
        name: 'wc-field-list',
        type: spl_parameter_types_1.ParameterType.MULTI_VALUE,
        required: false,
        syntax: '<field> ...',
        description: `A space delimited list of valid field names. The addcoltotals command calculates the sum only for the fields in the list you specify.`,
        valueType: 'field'
    },
    {
        name: 'labelfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'labelfield=<fieldname>',
        description: `Specify a field name to add to the result set.`,
        valueType: 'fieldname',
        defaultValue: 'none'
    },
    {
        name: 'label',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'label=<string>',
        description: `Used with the labelfield argument to add a label in the summary event.`,
        valueType: 'string',
        defaultValue: 'Total'
    },
];
// addtotals command parameters
exports.ADDTOTALS_PARAMS = [
    {
        name: 'field-list',
        type: spl_parameter_types_1.ParameterType.MULTI_VALUE,
        required: false,
        syntax: '<field> ...',
        description: `One or more numeric fields, delimited with a space. Only the fields specified in the <field-list> are summed.`,
        valueType: 'field'
    },
    {
        name: 'row',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'row=<bool>',
        description: `Specifies whether to calculate the sum of the <field-list> for each event.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
    {
        name: 'col',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'col=<bool>',
        description: `Specifies whether to add a new event, referred to as a summary event, at the bottom of the list of events.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'fieldname',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'fieldname=<field>',
        description: `Used to specify the name of the field that contains the calculated sum of the field-list for each event.`,
        valueType: 'field',
        defaultValue: 'Total'
    },
    {
        name: 'labelfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'labelfield=<field>',
        description: `Used to specify a field for the summary event label.`,
        valueType: 'field',
        defaultValue: 'none'
    },
    {
        name: 'label',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'label=<string>',
        description: `Used to specify a row label for the summary event.`,
        valueType: 'string',
        defaultValue: 'Total'
    },
];
// analyzefields command parameters
exports.ANALYZEFIELDS_PARAMS = [
    {
        name: 'classfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: true,
        syntax: 'classfield=<field>',
        description: `For best results, classfield should have two distinct values, although multiclass analysis is possible.`,
        valueType: 'field'
    },
];
// anomalies command parameters
exports.ANOMALIES_PARAMS = [
    {
        name: 'threshold',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'threshold=<num>',
        description: `A number to represent the upper limit of expected or normal events.`,
        valueType: 'num',
        defaultValue: '0.01'
    },
    {
        name: 'labelonly',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'labelonly=<bool>',
        description: `Specifies if you want the output result set to include all events or only the events that are above the threshold value.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'normalize',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'normalize=<bool>',
        description: `Specifies whether or not to normalize numeric text in the fields.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
    {
        name: 'maxvalues',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxvalues=<num>',
        description: `Specifies the size of the sliding set of previous events to include when determining the unexpectedness of a field value.`,
        valueType: 'num',
        defaultValue: '100'
    },
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'field=<field>',
        description: `The field to analyze when determining the unexpectedness of an event.`,
        valueType: 'field',
        defaultValue: '_raw'
    },
    {
        name: 'denylist',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'denylist=<filename>',
        description: `The name of a CSV file that contains a list of events that are expected and should be ignored.`,
        valueType: 'filename'
    },
    {
        name: 'denylistthreshold',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'denylistthreshold=<num>',
        description: `Specifies a similarity score threshold for matching incoming events to denylisted events.`,
        valueType: 'num',
        defaultValue: '0.05'
    },
];
// anomalousvalue command parameters
exports.ANOMALOUSVALUE_PARAMS = [
    {
        name: 'maxanofreq',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxanofreq=<float>',
        description: `Maximum anomalous frequency is expressed as a floating point number between 0 and 1.`,
        valueType: 'float',
        defaultValue: '0.05'
    },
    {
        name: 'minnormfreq',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'minnormfreq=<float>',
        description: `Minimum normal frequency is expressed as a floating point number between 0 and 1.`,
        valueType: 'float',
        defaultValue: '0.01'
    },
    {
        name: 'minsupcount',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'minsupcount=<int>',
        description: `Minimum supported count must be a positive integer.`,
        valueType: 'int',
        defaultValue: '100'
    },
    {
        name: 'minsupfreq',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'minsupfreq=<float>',
        description: `Minimum supported frequency is expressed as a floating point number between 0 and 1.`,
        valueType: 'float',
        defaultValue: '0.05'
    },
    {
        name: 'action',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'action=annotate | filter | summary',
        description: `Specify whether to return the anomaly score (annotate), filter out events that are not anomalous values (filter), or return a summary of anomaly statistics (summary).`,
        valueType: 'string',
        defaultValue: 'filter'
    },
    {
        name: 'pthresh',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'pthresh=<num>',
        description: `Probability threshold (as a decimal) that has to be met for a value to be considered anomalous.`,
        valueType: 'num',
        defaultValue: '0.01'
    },
];
// anomalydetection command parameters
exports.ANOMALYDETECTION_PARAMS = [
    {
        name: 'method',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'method = histogram | zscore | iqr',
        description: `Select the method of anomaly detection.`,
        valueType: 'string',
        defaultValue: 'method=histogram'
    },
    {
        name: 'action',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'action = filter | annotate | summary | remove | transform',
        description: `The actions and defaults depend on the method that you specify.`,
        valueType: 'string'
    },
    {
        name: 'pthresh',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'pthresh=<num>',
        description: `Used with method=histogram or method=zscore. Sets the probability threshold, as a decimal number, that has to be met for an event to be deemed anomalous.`,
        valueType: 'num'
    },
    {
        name: 'cutoff',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'cutoff=<bool>',
        description: `Sets the upper bound threshold on the number of anomalies. This option applies to only the histogram method.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
];
// append command parameters
exports.APPEND_PARAMS = [
    {
        name: 'subsearch',
        type: spl_parameter_types_1.ParameterType.POSITIONAL,
        required: true,
        syntax: '[subsearch]',
        description: `A secondary search where you specify the source of the events that you want to append. The subsearch must be enclosed in square brackets.`,
        valueType: 'string'
    },
    {
        name: 'extendtimerange',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'extendtimerange=<boolean>',
        description: `Specifies whether to include the subsearch time range in the time range for the entire search.`,
        valueType: 'boolean',
        defaultValue: 'false'
    },
    {
        name: 'maxtime',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxtime=<int>',
        description: `The maximum time, in seconds, to spend on the subsearch before automatically finalizing.`,
        valueType: 'int',
        defaultValue: '60'
    },
    {
        name: 'maxout',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxout=<int>',
        description: `The maximum number of result rows to output from the subsearch.`,
        valueType: 'int',
        defaultValue: '50000'
    },
];
// appendcols command parameters
exports.APPENDCOLS_PARAMS = [
    {
        name: 'subsearch',
        type: spl_parameter_types_1.ParameterType.POSITIONAL,
        required: true,
        syntax: '<subsearch>',
        description: `A secondary search added to the main search.`,
        valueType: 'subsearch'
    },
    {
        name: 'override',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'override=<bool>',
        description: `If the override argument is false, and if a field is present in both a subsearch result and the main result, the main result is used.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'maxtime',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxtime=<int>',
        description: `The maximum time, in units of seconds, to spend on the subsearch before automatically finalizing.`,
        valueType: 'int',
        defaultValue: '60'
    },
    {
        name: 'maxout',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxout=<int>',
        description: `The maximum number of result rows to output from the subsearch.`,
        valueType: 'int',
        defaultValue: '50000'
    },
    {
        name: 'timeout',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'timeout=<int>',
        description: `The maximum time, in units of seconds, to wait for subsearch to fully finish.`,
        valueType: 'int',
        defaultValue: '60'
    },
];
// appendpipe command parameters
exports.APPENDPIPE_PARAMS = [
    {
        name: 'run_in_preview',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'run_in_preview=<bool>',
        description: `Specifies whether or not display the impact of the appendpipe command in the preview.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
    {
        name: 'subpipeline',
        type: spl_parameter_types_1.ParameterType.POSITIONAL,
        required: false,
        syntax: '<subpipeline>',
        description: `A list of commands that are applied to the search results from the commands that occur in the search before the appendpipe command.`,
        valueType: 'subpipeline'
    },
];
// arules command parameters
exports.ARULES_PARAMS = [
    {
        name: 'field-list',
        type: spl_parameter_types_1.ParameterType.MULTI_VALUE,
        required: true,
        syntax: '<field> <field> ...',
        description: `The list of field names. At least two fields must be specified.`,
        valueType: 'field'
    },
    {
        name: 'sup',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'sup=<int>',
        description: `Specify a support limit. Associations with computed support levels smaller than this value are not included in the output results.`,
        valueType: 'int',
        defaultValue: '3'
    },
    {
        name: 'conf',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'conf=<float>',
        description: `Specify a confidence limit. Associations with a confidence (expressed as Strength field) are not included in the output results.`,
        valueType: 'float',
        defaultValue: '0.5'
    },
];
// associate command parameters
exports.ASSOCIATE_PARAMS = [
    {
        name: 'supcnt',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'supcnt=<num>',
        description: `Specifies the minimum number of times that the reference key=reference value combination must appear.`,
        valueType: 'num',
        defaultValue: '100'
    },
    {
        name: 'supfreq',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'supfreq=<num>',
        description: `Specifies the minimum frequency of reference key=reference value combination as a fraction of the number of total events.`,
        valueType: 'num',
        defaultValue: '0.1'
    },
    {
        name: 'improv',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'improv=<num>',
        description: `Specifies a limit, or minimum entropy improvement, for the target key.`,
        valueType: 'num',
        defaultValue: '0.5'
    },
];
// autoregress command parameters
exports.AUTOREGRESS_PARAMS = [
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<string>',
        description: `The name of a field. Most usefully a field with numeric values.`,
        valueType: 'string'
    },
    {
        name: 'p',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'p=<int> | p=<int>-<int>',
        description: `Specifies which prior events to copy values from. You can specify a single integer or a numeric range.`,
        valueType: 'int',
        defaultValue: '1'
    },
    {
        name: 'newfield',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: false,
        syntax: '<field>',
        description: `If p is set to a single integer, the newfield argument specifies a field name to copy the single field value into.`,
        valueType: 'field'
    },
];
// bin command parameters
exports.BIN_PARAMS = [
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<field>',
        description: `Specify a field name.`,
        valueType: 'field'
    },
    {
        name: 'bins',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'bins=<int>',
        description: `Sets the maximum number of bins to discretize into.`,
        valueType: 'int',
        defaultValue: '100'
    },
    {
        name: 'minspan',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'minspan=<span-length>',
        description: `Specifies the smallest span granularity to use automatically inferring span from the data time range.`,
        valueType: 'span-length'
    },
    {
        name: 'span',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'span = <log-span> | <span-length>',
        description: `Sets the size of each bin, using a span length based on a logarithm-based span or based on time.`,
        valueType: 'log-span'
    },
    {
        name: 'start',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'start=<num>',
        description: `Sets the minimum extents for numerical bins.`,
        valueType: 'num'
    },
    {
        name: 'end',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'end=<num>',
        description: `Sets the maximum extents for numerical bins.`,
        valueType: 'num'
    },
    {
        name: 'aligntime',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'aligntime=(earliest | latest | <time-specifier>)',
        description: `Align the bin times to something other than base UTC time (epoch 0).`,
        valueType: 'time-specifier'
    },
];
// bucket command parameters
exports.BUCKET_PARAMS = [
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<field>',
        description: `Specify a field name.`,
        valueType: 'field'
    },
];
// bucketdir command parameters
exports.BUCKETDIR_PARAMS = [
    {
        name: 'pathfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: true,
        syntax: 'pathfield=<field>',
        description: `Specify a field name that has a path value.`,
        valueType: 'field'
    },
    {
        name: 'sizefield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: true,
        syntax: 'sizefield=<field>',
        description: `Specify a numeric field that defines the size of bucket.`,
        valueType: 'field'
    },
    {
        name: 'countfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'countfield=<field>',
        description: `Specify a numeric field that describes the count of events.`,
        valueType: 'field'
    },
    {
        name: 'maxcount',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'maxcount=<int>',
        description: `Specify the total number of events to bucket.`,
        valueType: 'int'
    },
    {
        name: 'sep',
        type: spl_parameter_types_1.ParameterType.POSITIONAL,
        required: false,
        syntax: '<char>',
        description: `The separating character. Specify either a forward slash / or double back slashes \\.`,
        valueType: 'char'
    },
];
// chart command parameters
exports.CHART_PARAMS = [
    {
        name: 'stats-agg-term OR sparkline-agg-term OR eval-expression',
        type: spl_parameter_types_1.ParameterType.MULTI_VALUE,
        required: true,
        syntax: '<stats-func>(<evaled-field> | <wc-field>) [AS <wc-field>] | <sparkline-agg> [AS <wc-field>] | (<eval-expression>)',
        description: `A statistical aggregation function, sparkline aggregation function, or eval expression.`,
        valueType: 'stats-func'
    },
    {
        name: 'agg',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'agg=<stats-agg-term>',
        description: `Specify an aggregator or function.`,
        valueType: 'stats-agg-term'
    },
    {
        name: 'cont',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'cont=<bool>',
        description: `Specifies if the bins are continuous.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
    {
        name: 'format',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'format=<string>',
        description: `Used to construct output field names when multiple data series are used in conjunction with a split-by-field.`,
        valueType: 'string'
    },
    {
        name: 'limit',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'limit=(top | bottom) <int>',
        description: `Only valid when a column-split is specified. Use the limit option to specify the number of results that should appear in the output.`,
        valueType: 'int',
        defaultValue: 'top 10'
    },
    {
        name: 'sep',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'sep=<string>',
        description: `Used to construct output field names when multiple data series are used in conjunctions with a split-by field.`,
        valueType: 'string'
    },
    {
        name: 'dedup_splitvals',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'dedup_splitvals=<boolean>',
        description: `Specifies whether to remove duplicate values in multivalued BY clause fields.`,
        valueType: 'boolean',
        defaultValue: 'false'
    },
];
// cluster command parameters
exports.CLUSTER_PARAMS = [
    {
        name: 't',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 't=<num>',
        description: `Sets the cluster threshold, which controls the sensitivity of the clustering.`,
        valueType: 'num',
        defaultValue: '0.8'
    },
    {
        name: 'delims',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'delims=<string>',
        description: `Configures the set of delimiters used to tokenize the raw string.`,
        valueType: 'string'
    },
    {
        name: 'showcount',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'showcount=<bool>',
        description: `If showcount=false, indexers cluster its own events before clustering on the search head.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'countfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'countfield=<field>',
        description: `Name of the field to which the cluster size is to be written if showcount=true is true.`,
        valueType: 'field',
        defaultValue: 'cluster_count'
    },
    {
        name: 'labelfield',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'labelfield=<field>',
        description: `Name of the field to write the cluster number to.`,
        valueType: 'field',
        defaultValue: 'cluster_label'
    },
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'field=<field>',
        description: `Name of the field to analyze in each event.`,
        valueType: 'field',
        defaultValue: '_raw'
    },
    {
        name: 'labelonly',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'labelonly=<bool>',
        description: `Select whether to preserve incoming events and annotate them with the cluster they belong to (labelonly=true) or output only the cluster fields as new events (labelonly=false).`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'match',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'match=(termlist | termset | ngramset)',
        description: `Select the method used to determine the similarity between events.`,
        valueType: 'string',
        defaultValue: 'termlist'
    },
];
// cofilter command parameters
exports.COFILTER_PARAMS = [
    {
        name: 'field1',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<field>',
        description: `The name of field.`,
        valueType: 'field'
    },
    {
        name: 'field2',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: true,
        syntax: '<field>',
        description: `The name of a field.`,
        valueType: 'field'
    },
];
// collect command parameters
exports.COLLECT_PARAMS = [
    {
        name: 'index',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: true,
        syntax: 'index=<string>',
        description: `Name of the summary index where the events are added. The index must exist before the events are added.`,
        valueType: 'string'
    },
    {
        name: 'addinfo',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'addinfo=<bool>',
        description: `Use this option to specify whether to prefix search time and time-range information fields on to each summary index event.`,
        valueType: 'bool',
        defaultValue: 'true (events index/raw), false (metrics index)'
    },
    {
        name: 'addtime',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'addtime=<bool>',
        description: `Use this option to specify whether to prefix a time field on to each event.`,
        valueType: 'bool',
        defaultValue: 'true (events index), false (metrics index)'
    },
    {
        name: 'file',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'file=<string>',
        description: `The file name where you want the events to be written.`,
        valueType: 'string',
        defaultValue: '<random-number>_events.stash'
    },
    {
        name: 'host',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'host=<string>',
        description: `The name of the host that you want to specify for the events.`,
        valueType: 'string'
    },
    {
        name: 'marker',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'marker=<string>',
        description: `A string, usually of key-value pairs, to append to each event written out.`,
        valueType: 'string'
    },
    {
        name: 'output_format',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'output_format=[raw | hec]',
        description: `Specifies the output format for the summary indexing.`,
        valueType: 'string',
        defaultValue: 'raw'
    },
    {
        name: 'run_in_preview',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'run_in_preview=<bool>',
        description: `Controls whether the collect command is enabled during preview generation.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'spool',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'spool=<bool>',
        description: `If set to true, the summary indexing file is written to the Splunk spool directory.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
    {
        name: 'source',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'source=<string>',
        description: `The name of the source that you want to specify for the events.`,
        valueType: 'string'
    },
    {
        name: 'sourcetype',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'sourcetype=<string>',
        description: `The name of the source type that you want to specify for the events.`,
        valueType: 'string',
        defaultValue: 'stash'
    },
    {
        name: 'testmode',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'testmode=<bool>',
        description: `Toggle between testing and real mode.`,
        valueType: 'bool',
        defaultValue: 'false'
    },
    {
        name: 'timeformat',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'timeformat=<string>',
        description: `Controls the format of the timestamp that is written to the stash file before it is indexed.`,
        valueType: 'string',
        defaultValue: '%m/%d/%Y %H:%M:%S %z'
    },
    {
        name: 'uselb',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'uselb=<bool>',
        description: `Controls how line breaks are used to split events.`,
        valueType: 'bool',
        defaultValue: 'true'
    },
];
// convert command parameters
exports.CONVERT_PARAMS = [
    {
        name: 'convert-function',
        type: spl_parameter_types_1.ParameterType.POSITIONAL,
        required: true,
        syntax: 'auto() | ctime() | dur2sec() | memk() | mktime() | mstime() | none() | num() | rmcomma() | rmunit()',
        description: `Functions to use for the conversion.`,
        valueType: 'auto() | ctime() | dur2sec() | memk() | mktime() | mstime() | none() | num() | rmcomma() | rmunit()'
    },
    {
        name: 'timeformat',
        type: spl_parameter_types_1.ParameterType.NAMED,
        required: false,
        syntax: 'timeformat=<string>',
        description: `Specify the output format for the converted time field. The timeformat option is used by ctime and mktime functions.`,
        valueType: 'string',
        defaultValue: '%m/%d/%Y %H:%M:%S'
    },
    {
        name: 'field',
        type: spl_parameter_types_1.ParameterType.FIELD,
        required: false,
        syntax: '<string>',
        description: `Creates a new field with the name you specify to place the converted values into.`,
        valueType: 'string'
    },
];
//# sourceMappingURL=spl-command-parameters.js.map