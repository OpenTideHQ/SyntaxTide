# sendemail

## Description

Use the `sendemail` command to generate email notifications. You can email search results to specified email addresses.

You must have a Simple Mail Transfer Protocol (SMTP) server available to send email. An SMTP server is not included with the Splunk instance.

CAUTION: This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold:

sendemail to=<email\_list>

[from=<email\_list>]

[cc=<email\_list>]

[bcc=<email\_list>]

[subject=<string>]

[format=csv | table | raw]

[inline= <bool>]

[sendresults=<bool>]

[sendpdf=<bool>]

[priority=highest | high | normal | low | lowest]

[server=<string>]

[width\_sort\_columns=<bool>]

[graceful=<bool>]

[content\_type=html | plain]

[message=<string>]

[sendcsv=<bool>]

[use\_ssl=<bool>]

[use\_tls=<bool>]

[pdfview=<string>]

[papersize=letter | legal | ledger | a2 | a3 | a4 | a5]

[paperorientation=portrait | landscape]

[maxinputs=<int>]

[maxtime=<int> m | s | h | d]

[footer=<string>]

### Required arguments

to

Syntax: to=<email\_list>

Description: List of email addresses to send search results to. Specify email addresses in a comma-separated and quoted list. For example: "alex@email.com, maria@email.com, wei@email.com"

Note: The set of domains to which you can send emails can be restricted by the Allowed Domains setting on the Email Settings page. For example, that setting could restrict you to sending emails only to addresses in your organization's email domain.

For more information, see [Email notification action](/en/?resourceId=Splunk_Alert_Emailnotification) in the *Alerting Manual*.

### Optional arguments

bcc

Syntax: bcc=<email\_list>

Description: Blind courtesy copy line. Specify email addresses in a comma-separated and quoted list.

cc

Syntax: cc=<email\_list>

Description: Courtesy copy line. Specify email addresses in a comma-separated and quoted list.

content\_type

Syntax: content\_type=html | plain

Description: The format type of the email.

Default: The default value for the `content_type` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `html`.

format

Syntax: format=csv | raw | table

Description: Specifies how to format inline results.

Default: The default value for the `format` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `table`.

footer

Syntax: footer=<string>

Description: Specify an alternate email footer.

Default: The default footer is:

If you believe you've received this email in error, please see your Splunk administrator.

splunk > the engine for machine data.

Note: To force a new line in the footer, use Shift+Enter.

from

Syntax: from=<email\_list>

Description: Email address from line.

Default: "splunk@<hostname>"

inline

Syntax: inline=<boolean>

Description: Specifies whether to send the results in the message body or as an attachment. By default, an attachment is provided as a CSV file. See the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sendemail#d27e73b6_42f6_4ea6_9189_a2ee7b2c2cd4__Usage) section.

Default: The default value for the `inline` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `false`.

graceful

Syntax: graceful=<boolean>

Description: If set to true, no error is returned if sending the email fails for whatever reason. The remainder of the search continues as if the the sendemail command was not part of the search. If `graceful=false` and sending the email fails, the search returns an error.

Default: false

maxinputs

Syntax: maxinputs=<integer>

Description: Sets the maximum number of search results sent via alerts per invocation of the command. The `sendemail` command is invoked repeatedly in increments according to the `maxinputs` argument until the search is complete and all of the results have been displayed. Do not change the value of `maxinputs` unless you know what you are doing.

Default: 50000

maxtime

Syntax: maxtime=<integer>m | s | h | d

Description: The maximum amount of time that the execution of an action is allowed to take before the action is aborted.

Example: 2m

Default: no limit

message

Syntax: message=<string>

Description: Specifies the message sent in the email.

Default: The default message depends on which other arguments are specified with the `sendemail` command.

* If sendresults=false the message defaults to "Search complete."
* If sendresults=true, inline=true, and either sendpdf=false or sendcsv=false, message defaults to "Search results."
* If sendpdf=true or sendcsv=true, message defaults to "Search results attached."

paperorientation

Syntax: paperorientation=portrait | landscape

Description: The orientation of the paper.

Default: portrait

papersize

Syntax: papersize=letter | legal | ledger | a2 | a3 | a4 | a5

Description: Default paper size for PDFs. Acceptable values: letter, legal, ledger, a2, a3, a4, a5.

Default: letter

pdfview

Syntax: pdfview=<string>

Description: Name of a `view.xml` file to send as a PDF. For example, `mydashboard.xml`, `search.xml`, or `foo.xml`. Generally this is the name of a dashboard, but it could also be the name of a single page application or some other object. Specify the name only. Do not specify the filename extension. The `view.xml` files are located in `<<SPLUNK_HOME>/etc/apps/<app_name>/default/data/ui/views`.

priority

Syntax: priority=highest | high | normal | low | lowest

Description: Set the priority of the email as it appears in the email client. Lowest or 5, low or 4, high or 2, highest or 1.

Default: normal or 3

sendcsv

Syntax: sendcsv=<boolean>

Description: Specify whether to send the results with the email as an attached CSV file or not.

Default: The default value for the `sendcsv` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `false`.

sendpdf

Syntax: sendpdf=<boolean>

Description: Specify whether to send the results with the email as an attached PDF or not. For more information about generating PDFs, see ["Generate PDFs of your reports and dashboards"](/en/?resourceId=Splunk_Report_GeneratePDFsofyourreportsanddashboards) in the Reporting Manual.

Default: The default value for the `sendpdf` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `false`.

sendpng

Syntax: sendpng=<boolean>

Description: Specify whether to send the results with the email as an attached PNG or not. `sendpng` is only available for usage with Dashboard Studio. For more details, see the [Splunk Dashboard Studio](/en/?resourceId=Splunk_DashStudio_IntroFrame) manual.

Default: The default value for the `sendpng` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `false`.

sendresults

Syntax: sendresults=<boolean>

Description: Determines whether the results should be included with the email. See the [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sendemail#d27e73b6_42f6_4ea6_9189_a2ee7b2c2cd4__Usage) section.

Default: The default value for the `sendresults` argument is set in the `[email]` stanza of the `alert_actions.conf` file. The default value for a new or upgraded Splunk installation is `false`.

server

Syntax: server=<host>[:<port>]

Description: If the SMTP server is not local, use this argument to specify the SMTP mail server to use when sending emails. The <host> can be either the hostname or the IP address. You have the option to specify the SMTP <port> that the Splunk instance should connect to.

If you set `use_ssl=true`, you must specify both <host> and <port> in the `server` argument.

This setting takes precedence over the `mailserver` setting in the `alert_actions.conf` file. The default setting for `mailserver` is `localhost:25`.

Note: If an alert action is configured to send an email notification when an alert triggers, the `sendemail` command might not be able to use the server you specify in the `server` argument. The values in the Email domains setting on the Email Settings page might restrict the server you can use. The `sendemail` command uses the Mail host that is set on the Email Settings page. For more information, see [Email notification action](/en/?resourceId=Splunk_Alert_Emailnotification) in the *Alerting Manual*.

Default: localhost

subject

Syntax: subject=<string>

Description: Specifies the subject line.

Default: "Splunk Results"

use\_ssl

Syntax: use\_ssl=<boolean>

Description: Specifies whether to use SSL when communicating with the SMTP server. When set to `true`, you must also specify both the <host> and <port> in the `server` argument.

Default: false

use\_tls

Syntax: use\_tls=<boolean>

Description: Specify whether to use TLS (transport layer security) when communicating with the SMTP server (starttls).

Default: false

width\_sort\_columns

Syntax: width\_sort\_columns=<boolean>

Description: This is only valid for plain text emails. Specifies whether the columns should be sorted by their width.

Default: true

## Usage

If you set `sendresults=true` and `inline=false` and do not specify `format`, a CSV file is attached to the email.

Note: If you use fields as tokens in your `sendemail` messages, use the `rename` command to remove curly brace characters such as { and } from them before they are processed by the `sendemail` command. The `sendemail` command cannot interpret curly brace characters when they appear in tokens such as `$results$`.

### Capability requirements

To use `sendemail`, your role must have the `schedule_search` and `list_settings` capabilities.

## Examples

### 1: Send search results to the specified email

Send search results to the specified email. By default, the results are formatted as a table.

... | sendemail to="elvis@splunk.com" sendresults=true

### 2: Send search results in raw format

Send search results in a raw format with the subject "myresults".

... | sendemail to="elvis@splunk.com,john@splunk.com" format=raw subject=myresults server=mail.splunk.com sendresults=true

### 3. Include a PDF attachment, a message, and raw inline results

Send an email notification with a PDF attachment, a message, and raw inline results.

index=\_internal | head 5 | sendemail to=example@splunk.com server=mail.example.com subject="Here is an email from Splunk" message="This is an example message" sendresults=true inline=true format=raw sendpdf=true

### 4: Use email notification tokens with the sendemail command

You can use the `eval` command in conjunction with email notification tokens to customize your search results emails. The search in the following example sends an email to sample@splunk.com with a custom message that says `sample sendemail message body`.

|makeresults
|eval custommessage="sample sendemail message body"
|eval dest="sample@splunk.com"
|sendemail to="$result.dest$" message="$result.custommessage$"

See [Use tokens in email notifications](/en/?resourceId=Splunk_Alert_EmailNotificationTokens) in the Splunk Cloud Platform *Alerting Manual*.
