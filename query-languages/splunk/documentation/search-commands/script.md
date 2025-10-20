# script

## Description

Calls an external python program that can modify or generate search results.

Splunk Cloud Platform

You must create a private app that contains your custom script. If you are a Splunk Cloud administrator with experience creating private apps, see [Manage private apps in your Splunk Cloud Platform deployment](/en/?resourceId=SplunkCloud_Admin_PrivateApps) in the *Splunk Cloud Admin Manual*. If you have not created private apps, contact your Splunk account representative for help with this customization.

Splunk Enterprise

Scripts must be declared in the commands.conf file and be located in the $SPLUNK\_HOME/etc/apps/<app\_name>/bin/ directory. The script is executed using $SPLUNK\_HOME/bin/python.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

script <script-name> [<script-arg>...] [maxinputs=<int>]

### Required arguments

script-name

Syntax: <string>

Description: The name of the scripted search command to run, as defined in the commands.conf file.

### Optional arguments

maxinputs

Syntax: maxinputs=<int>

Description: Specifies how many of the input results are passed to the script per invocation of the command. The `script` command is invoked repeatedly in increments according to the `maxinputs` argument until the search is complete and all of the results have been displayed. Do not change the value of `maxinputs` unless you know what you are doing.

Default: 50000

script-arg

Syntax: <string> ...

Description: One or more arguments to pass to the script. If you are passing multiple arguments, delimit each argument with a space.

## Usage

The `script` command is effectively an alternative way to invoke custom search commands.
See [Create custom search commands for apps in Splunk Cloud Platform or Splunk Enterprise](https://dev.splunk.com/enterprise/docs/devtools/customsearchcommands) in the *Developer Guide* on the Developer Portal.

The following search:

| script commandname

is the same as this search:

| commandname

Note: Some functions of the script command have been removed over time. The explicit choice of Perl or Python as an argument is no longer functional and such an argument is ignored. If you need to write Perl search commands, you must declare them as Perl in the commands.conf file. This is not recommended, as you need to determine a number of underdocumented things about the input and output formats. Additionally, support for the etc/searchscripts directory has been removed. Search commands must be located in the bin directory of an app in your Splunk deployment. For more information about creating custom search commands for apps in Splunk Cloud Platform or Splunk Enterprise, see the *Developer Guide for Splunk Cloud Platform and Splunk Enterprise*.

## Examples

### Example 1:

Run the Python script "myscript" with arguments, myarg1 and myarg2; then, email the results.

... | script myscript myarg1 myarg2 | sendemail to=david@splunk.com
