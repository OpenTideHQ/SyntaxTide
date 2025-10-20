# noop

CAUTION: The `noop` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

The `noop` command is an internal command that you can use to debug your search. It includes several arguments that you can use to troubleshoot search optimization issues.

You cannot use the `noop` command to add comments to a search. If you are looking for a way to add comments to your search, see [Add comments to searches](/en/?resourceId=Splunk_Search_Comments) in the *Search Manual*.

## Syntax

noop [<log-level-expression>] [<appender-expression>] [set\_ttl = <timespan>] [search\_optimization = <boolean>] [search\_optimization.<optimization\_type> = <boolean>] [sample\_ratio = <int>] [<remote-log-fetch>] ...

### Required arguments

None.

### Optional arguments

appender-expression

Syntax: log\_appender = "<appender\_name>; [<attribute\_name> = <attribute\_value>], ..."

Description Identifies an appender from `log-searchprocess.log` and specifies changed values for one or more attributes that belong to that appender. These value changes apply to the search job for the lifetime of the job. They are not reused after the search finishes. The list of attribute value changes must be enclosed in quotes. See [Appender expression options](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/noop#f478989c_3cac_4260_ba13_7af11f9a0ddf__Appender_expression_options).

log-level-expression

Syntax: log\_<level> = "<channel>; ..."

Description: Sets or changes the log levels for one or more log channels at search startup. The log channel list must be double-quoted and semicolon-separated. See [Log level expression options](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/noop#f478989c_3cac_4260_ba13_7af11f9a0ddf__Log_level_expression_options).

optimization\_type

Syntax: search\_optimization.<optimization\_type> = <boolean>

Description: Turns on or off a specific type of search optimization for the search. To turn off multiple optimization types, create a comma-separated list of `search_optimization.<optimization_type>` arguments. See [Optimization type arguments](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/noop#f478989c_3cac_4260_ba13_7af11f9a0ddf__Optimization_type_arguments).

Default: true

remote-log-fetch

Syntax: remote\_log\_fetch = [\*|<indexer\_name;indexer\_name...>]

Description Downloads remote search logs from the specified list of indexers in order to troubleshoot searches. This argument overrides the `fetch_remote_search_log` setting in the limits.conf file, which is turned off by default for all searches.

To fetch remote search logs on a per-search basis, append `|noop remote_log_fetch=*` to your search.

sample\_ratio

Syntax: sample\_ratio = <int>

Description: Sets a randomly-sampled subset of results to return from a given search. It returns 1 out of every `<sample_ratio>` events. For example, if you supply `| noop sample_ratio=25`, the Splunk software returns a random sample of 1 out of every 25 events from the search result set. The `sample_ratio` argument requires that `search` be the [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) of the search to which you are applying `noop`.

The `sample_ratio` does the same thing as the event sampling feature that you can manage through Splunk Web. The difference is that it enables you to apply event sampling to a subsearch, while the Splunk Web version of event sampling is applied only to the main search. See [Event sampling](/en/?resourceId=Splunk_Search_Retrieveasamplesetofevents) in the *Search Manual*.

Default: 1

search\_optimization

Syntax: search\_optimization = <boolean>

Description: Turns on or off all optimizations for the search.

Default: true

set\_ttl

Syntax: set\_ttl = <timespan>

Description: Specifies the lifetime of the search job using time modifiers like `1d` for one day or `12h` for twelve hours. The search job lifetime is the amount of time that the job exists in the system before it is deleted. The default lifetime of an [ad hoc search](https://docs.splunk.com/Splexicon:Adhocsearch) is 10 minutes. You might use this setting to make an ad hoc search job stay in the system for 24 hours or 7 days.

### Optimization type arguments

Here are the `search_optimization.<optimization_type>` arguments that you can use with `noop`.

| search\_optimization argument | Controls |
| --- | --- |
| search\_optimization.eval\_merge | Eval merge optimization |
| search\_optimization.merge\_union | Merge union optimization |
| search\_optimization.predicate\_merge | Predicate merge optimizations |
| search\_optimization.predicate\_push | Predicate pushdown optimizations |
| search\_optimization.predicate\_split | Predicate split optimizations |
| search\_optimization.projection\_elimination | Projection elimination optimizations |
| search\_optimization.required\_field\_values | Required field value optimizations |
| search\_optimization.replace\_append\_with\_union | Replace append command with union command optimization |
| search\_optimization.replace\_stats\_cmds\_with\_tstats | Replace stats command with tstats command optimization   This optimization type is turned off by default. |
| search\_optimization.search\_flip\_normalization | Predicate flip normalization |
| search\_optimization.search\_sort\_normalization | Predicate sort normalization |

For more information about specific search optimization types, see [Built-in optimizations](/en/?resourceId=Splunk_Search_Built-inoptimization).

### Log level expression options

level

Syntax: log\_<level>

Description: Valid values are the Splunk platform internal logging levels: `debug`, `info`, `warn`, and `error`, and `fatal`. You can apply different log levels to different sets of channels.

channel

Syntax: <channel>; ...

Description: Specifies one or more log channels to apply the log level to. Use wildcards to catch all channels with a matching string of characters in their name. The list of log channels is semicolon-separated.

For example, `| noop log_debug="FastTyper;SearchParser"` runs log\_debug on the FastTyper and SearchParser channels.

### Appender expression options

appender\_name

Syntax: <string>

Description: The name of an appender from the `log-searchprocess.cfg` file. Use a wildcard `*` to identify all appenders in the `log-searchprocess.cfg` file. The `noop` parser is case-sensitive. It sends an error message if you submit an appender name with incorrect case-formatting.

attribute\_name

Syntax: maxFileSize | maxBackupIndex | ConversionPattern | maxMessageSize

Description: Attributes that can be changed for a given appender. The `noop` parser is case-sensitive, so do not change the case-formatting of these attributes. It sends an error message if you submit an appender name with incorrect case-formatting.

| Attribute name | Description | Example value |
| --- | --- | --- |
| maxFileSize | Sets the maximum size, in bytes, of a `search.log` file before it rolls. You must provide a value that is higher than the value that is currently set for the selected appender in the `log-searchprocess.cfg` file. | 250000000 |
| maxBackupIndex | Sets the maximum number of rolled `search.log` files. You must provide a value that is higher than the value that is currently set for the selected appender in the `log-searchprocess.cfg` file. | 5 |
| ConversionPattern | Specifies the log entry format. Possible variables are: %c (category), %d (date, followed by date variables in curly brackets), %m (log message),  %n (newline), %p (priority - the log level), %r (relative time, msec), %R (relative time, sec), %t (thread time), and %T (thread ID). | %d{%m-%d-%Y %H:%M:%S.%l} %-5p  %c - %m%n |
| maxMessageSize | Sets the maximum size, in bytes, of messages sent by the log. Defaults to 16384. You must provide a value that is higher than the value that is currently set for the selected appender in the `log-searchprocess.cfg` file. | 16384 |

attribute\_value

Syntax: <string>

Description: Provides an updated value for the selected appender attribute. The values you provide for the `maxFileSize`, `maxBackupIndex`, and `maxMessageSize` attributes must be higher than the values that are currently set for those attributes in the `log-searchprocess.cfg` file. In other words, if the `maxFileSize` setting for the  `searchprocessAppender` is currently set to  `10000000`, you can only submit a new `maxFileSize` value that is higher than `10000000`.

## Usage

You can use the `noop` command to enable or disable search optimizations when you run a search. Enabling or disabling search optimizations can help you troubleshoot certain kinds of search issues. For example, you might experiment with disabling and enabling search optimizations to determine whether they are causing a search to be slow to complete.

For information about managing search optimization through `limits.conf` for all of the users in your Splunk platform deployment, see [Built-in optimization](/en/?resourceId=Splunk_Search_Built-inoptimization) in the *Search Manual*.

### Managing all search optimizations with the noop command

The `noop` command can enable or disable all search optimizations for a single run of a search.

If all search optimizations are enabled for your Splunk deployment in `limits.conf`, you can add the following argument to the end of a search string to disable all optimizations when you run that search:

.... | noop search\_optimization=false

If all search optimizations are disabled for your Splunk deployment in `limits.conf`, you can add the following argument to the end of a search string to enable all search optimizations when you run that search:

.... | noop search\_optimization=true

### Managing specific search optimizations with the noop command

You can use the `optimization_type` argument to selectively disable or enable specific types of search optimization.

Here is an example of a set of `noop` arguments that disable the predicate merge and predicate pushdown optimizations for a search.

.... | noop search\_optimization.predicate\_merge=f, search\_optimization.predicate\_push=f

This example works only if you have enabled all optimizations in `limits.conf`.

When you set `enabled=false` for the `[search_optimization]` stanza in `limits.conf` you disable all search optimizations for your Splunk platform deployment. With this `limits.conf` configuration, your searches can use `noop` to enable all optimizations and selectively disable specific optimization types.

For example, if you have the `[search_optimization]` stanza set to `enabled = false` in `limits.conf`, the following search enables all optimizations except projection elimination.

index=\_internal | eval c = x \* y / z | stats count BY a, b | noop search\_optimization=true, search\_optimization.projection\_elimination=false

However, When you set `enabled=false` for the `[search_optimization]` stanza in `limits.conf`, your searches cannot enable specific optimization types unless specific conditions are met. See [How noop interoperates with limits.conf search optimization settings](/splunk-enterprise/search/spl-search-reference/10.0/internal-commands/noop#a79a48cf_1038_4e5c_a2dd_1a76ff3f757e__noop).

### How the noop command interoperates with limits.conf search optimization settings

Review how you have configured search optimization for your Splunk platform deployment in `limits.conf` before you use the `noop` command to enable or disable optimization types. The search processor respects `limits.conf` settings for optimization types only when `[search_optimization]` is enabled.

For example, if the `[search_optimization]` stanza is set to `enabled=true` in `limits.conf`, the search processor checks whether individual optimization types are enabled or disabled in `limits.conf`. On the other hand, if the `[search_optimization]` stanza is set to `enabled = false`, the search processor does not check the settings for other optimization types. It assumes all of the optimization types are set to `enabled=false`.

This search processor logic affects the way that the `noop` command works when you use it to enable or disable search optimization for an individual search.

For example, imagine that you have the following configuration in `limits.conf`:

[search\_optimization]
enabled=false
[search\_optimization::projection\_elimination]
enabled=false

With this configuration, the search processor ignores the disabled projection elimination optimization. Because `[search_optimization]` is disabled, the search processor assumes all optimizations are disabled.

Say you have this configuration, and you run the following search, which uses the `noop` command to enable search optimization:

.... | noop search\_optimization=true

When you do this, you enable search optimization, but the search processor sees that in `limits.conf`, the projection elimination optimization is disabled. It runs the search with all optimization types enabled except projection elimination.

Instead, use the `noop` command in a search to enable search optimization and selectively enable the projection elimination optimization:

.... | noop search\_optimization=true search\_optimization.projection\_elimination=true

When this search runs, it overrides both `limits.conf` settings: the setting for `[search_optimization]` and the setting for `[search_optimization::projection_elimination]`. The search runs with all optimizations enabled.

### Use noop to set debugging channels for a search

The `log_<level>` argument lets you set the debugging channel for a search at a specific log level, such as `debug` or `warn`. You might use this if you need to set the log level for a specific search but do not have CLI access to the Splunk platform implementation.

The Splunk platform changes the log level after it parses the `noop` command. It can do this before the search head parses arguments from other search commands, even if it comes after those commands in the search string. For instance, the following search properly logs some debug messages from the `makeresults` command despite the fact that it precedes the `noop` command:

| makeresults count=1 | noop log\_debug="MakeResultsProcessor"

However, the `log_<level>` argument cannot set the log level for search process components that are ahead of SPL argument processing in the order of operations. For example, `LicenseMgr` is one of those components. When you run this search, it still logs at the default level of `info` for `LicenseMgr` even though you specify `debug` in the SPL.

index=\_internal | head 1 | noop log\_debug="LicenseMgr"

If you have command-line access and you need to debug an issue with that component or ones like it, you can modify `$SPLUNK_HOME/etc/log-searchprocess.cfg` directly to set the logging level before the search is dispatched and produce more verbose output in `search.log`.

The `noop` command must be part of the streaming pipeline. Because the Splunk software performs argument parsing on the search head and then pushes the search to the indexers, make sure that the `noop` command is part of the streaming pipeline. Place the `noop` command before the first non-streaming command in the search string. An easy way to do this is to put it after the first command in the search string, which is usually `search`.

The `log_<level>` argument supports wildcard matching. You can also set different log levels for different debugging channels in the same search.

.... | noop log\_debug=Cache\* log\_info="SearchOperator:kv;SearchOperator:multikv"

For more information about logs and setting log levels for debugging channels, see [What Splunk logs about itself](/en/?resourceId=Splunk_Troubleshooting_WhatSplunklogsaboutitself) in the *Troubleshooting Manual*.

### Use noop to apply log-searchprocess.cfg appender attribute changes to a search job

For debugging purposes, you can use `noop` to apply changed attributes for `log-searchprocess.cfg` appenders to individual runs of a search. Appenders are blocks of configurations for specific sub-groups of log components. Example appenders include `searchprocessAppender`, `watchdog_appender`, and  `searchTelemetryAppender`. You can use the `*` wildcard to select all appenders.

For example, the following search changes the maximum size of the `search.log` file to 50 MB and sets the maximum number of rolled `search.log` files to 99.

.... | noop log\_appender="searchprocessAppender;maxFileSize=50000000;maxBackupIndex=99"

These changes are applied for the lifetime of that particular search. They are not saved or applied to other searches.

You can only change values for the following appender attributes: `maxFileSize`, `maxBackupIndex`, `ConversionPattern`, and `maxMessageSize`. Values you supply for `maxFileSize`, `maxBackupIndex`, and `maxMessageSize` must be higher than the current values for those appender attributes in `log-searchprocess.cfg`.

For more information about changing appender attributes for log debugging purposes, see [Enable log debugging](/en/?resourceId=Splunk_Troubleshooting_Enabledebuglogging) in the *Troubleshooting Manual*.
