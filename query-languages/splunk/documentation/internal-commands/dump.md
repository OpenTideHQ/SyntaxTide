# dump

CAUTION: The `dump` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

For Splunk Enterprise deployments, export search results to a set of chunk files on local disk.
For information about other export methods, see [Export search results](/en/?resourceId=Splunk_Search_Exportsearchresults) in the *Search Manual*.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

### Syntax

Required syntax is in bold:

dump

basefilename=<string>

[fields="<comma-delimited-string>"]

[rollsize=<number>]

[compress=<number>]

[format=<string>]

### Required arguments

basefilename

Syntax: basefilename=<string>

Description: The prefix of the export filename.

fields

Syntax: fields="<comma-delimited-string>"

Description: The list of the fields to export. The entire list must be enclosed in quotation marks. Invalid field names are ignored.

To export all fields, use a wildcard ( \* ). For example, `fields="*"`.

### Optional arguments

compress

Syntax: compress=<number>

Description: The gzip compression level. Specify a number from 0 to 9, where 0 means no compression and a higher number means more compression and slower writing speed.

Default: 2

format

Syntax: format= raw | csv | tsv | json | xml

Description: The output data format.

Default: raw

rollsize

Syntax: rollsize=<number>

Description: The minimum file size, in MB, at which point no more events are written to the file and it becomes a candidate for HDFS transfer.

Default: 63 MB

## Usage

This command exports events to a set of chunk files on local disk at "$SPLUNK\_HOME/var/run/splunk/dispatch/<sid>/dump". This command recognizes a special field in the input events, `_dstpath`, which if set is used as a path to be appended to the `dst` directory to compute the final destination path.

The `dump` command preserves the order of events as the events are received by the command.

### Capability required

The `dump` command is considered to be a potentially risky command. To use this command, you must have a role with the run\_dump capability. See [Define roles on the Splunk platform with capabilities](/en/?resourceId=Splunk_Security_Rolesandcapabilities).

For more information about risky commands, see [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards).

## Examples

Example 1: Export all events from index "bigdata" to the location "YYYYmmdd/HH/host" at "$SPLUNK\_HOME/var/run/splunk/dispatch/<sid>/dump/" directory on local disk with "MyExport" as the prefix of export filenames. Partitioning of the export data is achieved by eval preceding the dump command.

index=bigdata | eval \_dstpath=strftime(\_time, "%Y%m%d/%H") + "/" + host | dump basefilename=MyExport fields="\_time, host, source, sourcetype"

Example 2: Export all events from index "bigdata" to the local disk with "MyExport" as the prefix of export filenames.

index=bigdata | dump basefilename=MyExport fields="\_time, host, ipaddress, status"

Example 3: Export all fields from events in the \_internal index to the local disk with "TestAllFields" as the prefix of export filenames.

index=\_internal | dump basefilename=TestAllFields fields="\*" format=json
