# scrub

## Description

Anonymizes the search results by replacing identifying data - usernames, `ip` addresses, domain names, and so forth - with fictional values that maintain the same word length. For example, it might turn the string `user=carol@adalberto.com` into `user=aname@mycompany.com`. This lets Splunk users share log data without revealing confidential or personal information.

See the Usage section for more information.

## Syntax

scrub [public-terms=<filename>] [private-terms=<filename>] [name-terms=<filename>] [dictionary=<filename>] [timeconfig=<filename>] [namespace=<string>]

### Required arguments

None

### Optional arguments

public-terms

Syntax: public-terms=<filename>

Description: Specify a filename that includes the public terms NOT to anonymize.

private-terms

Syntax: private-terms=<filename>

Description: Specify a filename that includes the private terms to anonymize.

name-terms

Syntax: name-terms=<filename>

Description: Specify a filename that includes the names to anonymize.

dictionary

Syntax: dictionary=<filename>

Description: Specify a filename that includes a dictionary of terms NOT to anonymize, unless those terms are in the `private-terms` file.

timeconfig

Syntax: timeconfig=<filename>

Description: Specify a filename that includes the time configurations to anonymize.

namespace

Syntax: namespace=<string>

Description: Specify an application that contains the alternative files to use for anonymizing, instead of using the built-in anonymizing files.

## Usage

By default, the `scrub` command uses the dictionary and configuration files that are located in the `$SPLUNK_HOME/etc/anonymizer` directory. These default files can be overridden by specifying arguments to the `scrub` command. The arguments exactly correspond to the settings in the `splunk anonymize` CLI command. For details, issue the `splunk help anonymize` command.

You can add your own versions of the configuration files to the default location.

Alternatively, you can specify an application where you maintain your own copy of the dictionary and configuration files. To specify the application, use the `namespace=<string>` argument, where <string> is the name of the application that corresponds to the name that appears in the path `$SPLUNK_HOME/etc/apps/<app>/anonymizer`.

If the `$SPLUNK_HOME/etc/apps/<app>/anonymizer` directory does not exist, the Splunk software looks for the files in the `$SPLUNK_HOME/etc/slave-apps/<app>/anonymizer` directory.

The `scrub` command anonymizes all attributes, except those that start with underscore ( \_ ) except `_raw`) or start with `date_`. Additionally, the following attributes are not anonymized: `eventtype`, `linecount`, `punct`, `sourcetype`, `timeendpos`, `timestartpos`.

The `scrub` command adheres to the default `maxresultrows` limit of 50000 results. This setting is documented in the `limits.conf` file in the [searchresults] stanza. See [limits.conf](/?resourceId=Splunk_Admin_Limitsconf) in the *Admin Manual*.

## Examples

### 1. Anonymize the current search results using the default files.

... | scrub

### 2. Anonymize the current search results using the specified private-terms file.

This search uses the `abc_private-terms` file that is located in the `$SPLUNK_HOME/etc/anonymizer` directory.

... | scrub private-file=abc\_private-terms
