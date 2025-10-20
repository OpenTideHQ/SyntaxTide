# searchtxn

## Description

Efficiently returns transaction events that match a transaction type and contain specific text.

Note: For Splunk Cloud Platform, you must create a private app that contains your transaction type definitions. If you are a Splunk Cloud administrator with experience creating private apps, see [Manage private apps in your Splunk Cloud Platform deployment](/en/?resourceId=SplunkCloud_Admin_PrivateApps) in the *Splunk Cloud Admin Manual*. If you have not created private apps, contact your Splunk account representative for help with this customization.

## Syntax

| searchtxn <transaction-name> [max\_terms=<int>] [use\_disjunct=<bool>] [eventsonly=<bool>] <search-string>

### Required arguments

<transaction-name>

Syntax: <transactiontype>

Description: The name of the transaction type stanza that is defined in `transactiontypes.conf`.

<search-string>

Syntax: <string>

Description: Terms to search for within the transaction events.

### Optional arguments

eventsonly

Syntax: eventsonly=<bool>

Description: If true, retrieves only the relevant events but does not run "| transaction" command.

Default: false

max\_terms

Syntax: maxterms=<int>

Description: Integer between 1-1000 which determines how many unique field values all fields can use. Using smaller values speeds up search, favoring more recent values.

Default: 1000

use\_disjunct

Syntax: use\_disjunct=<bool>

Description: Specifies if each term in <search-string> should be processed as if separated by an OR operator on the initial search.

Default: true

## Usage

The `searchtxn` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

### Transactions

The command works only for transactions bound together by particular field values, not by ordering or time constraints.

Suppose you have a `<transactiontype>` stanza in the `transactiontypes.conf.in` file called "email". The stanza contains the following settings.

* fields=qid, pid
* search=sourcetype=sendmail\_syslog to=root

The `searchtxn` command finds all of the events that match `sourcetype="sendmail_syslog" to=root`.

From those results, all fields that contain a qid or pid located are used to further search for relevant transaction events. When no additional qid or pid values are found, the resulting search is run:

`sourcetype="sendmail_syslog" ((qid=val1 pid=val1) OR (qid=valn pid=valm) | transaction name=email | search to=root`

## Examples

### Example 1:

Find all email transactions to root from David Smith.

| searchtxn email to=root from="David Smith"

## See also

[transaction](/en/?resourceId=Splunk_SearchReference_Transaction)
