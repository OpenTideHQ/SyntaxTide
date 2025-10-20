# map

## Description

The `map` command is a looping operator that runs a search repeatedly for each input event or result. You can run the map command on a [saved search](https://docs.splunk.com/Splexicon:Savedsearch) or an [ad hoc search](https://docs.splunk.com/Splexicon:Adhocsearch).

This command is considered risky because, if used incorrectly, it can pose a security risk or potentially lose data when it runs. As a result, this command triggers SPL safeguards. See [SPL safeguards for risky commands](/en/?resourceId=Splunk_Security_SPLsafeguards) in *Securing the Splunk Platform*.

## Syntax

The required syntax is in bold.

map

(<searchoption> | <savedsplunkoption>)

[maxsearches=int]

### Required arguments

You must specify either <savedsplunkoption> or <searchoption>.

<savedsplunkoption>

Syntax: <string>

Description: The name of a saved search to run for each input result.

Default: No default.

<searchoption>

Syntax: search="<string>"

Description: An ad hoc search to run for each input result. For example:

`...| map search="search index=_internal earliest=$myearliest$ latest=$mylatest$"`.

Default: No default.

### Optional arguments

maxsearches

Syntax: maxsearches=<int>

Description: The maximum number of searches to run. A message is generated if there are more search results than the maximum number that you specify. Zero ( 0 ) does not equate to unlimited searches.

Default: 10

## Usage

The `map` command is a dataset processing command. See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

A subsearch can be initiated through a search command such as the `map` command. See [Initiating subsearches with search commands](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the Splunk Cloud Platform *Search Manual*.

### Known limitations

You cannot use the `map` command after an `append` or `appendpipe` command in your search pipeline.

### Variable for field names

When using a saved search or a literal search, the `map` command supports the substitution of $variable$ strings that match field names in the input results. A search with a string like $count$, for example, will replace the variable with the value of the `count` field in the input search result.

When using the `map` command in a dashboard `<form>`, use double dollar signs ($$) to specify a variable string. For example, `$$count$$`. See [Dashboards and forms](/en/?resourceId=Splunk_Viz_Overviewofdashboards).

Certain variables for field names might conflict with token names and produce unpredictable search results. For example, the following are some variables for field names that might conflict with token names:

* $alert.expires$
* $alert.severity$
* $cron\_schedule$
* $description$
* $name$
* $search$
* $username$

### Search ID field

The `map` command also supports a search ID field, provided as $\_serial\_id$. The search ID field will have a number that increases incrementally each time that the search is run. In other words, the first run search will have the ID value 1, and the second 2, and so on.

## Basic examples

### 1. Invoke the map command with a saved search

error | localize | map mytimebased\_savedsearch

### 2. Map the start and end time values

... | map search="search starttimeu::$start$ endtimeu::$end$" maxsearches=10

### 3. Use the map command with a subsearch

For complex [ad hoc searches](https://docs.splunk.com/Splexicon:Adhocsearch), use a subsearch for your `map` search. Alternatively, you can escape double quotation marks with backslashes ( \" ) in your ad hoc `map` search, as shown in example 4.

You can use a subsearch with the `map` command like this:

| makeresults count=4
| streamstats count
| eval field="hello".count
| map
[ makeresults
| eval pony=1,field="$field$",serial="$\_serial\_id$",hello="buttercup"]

The search results look something like this:

| \_time | field | hello | pony | serial |
| --- | --- | --- | --- | --- |
| 2024-01-04 17:23:42 | hello1 | buttercup | 1 | 1 |
| 2024-01-04 17:23:42 | hello2 | buttercup | 1 | 2 |
| 2024-01-04 17:23:42 | hello3 | buttercup | 1 | 3 |
| 2024-01-04 17:23:42 | hello4 | buttercup | 1 | 4 |

### 4. Use the map command by escaping double quotation marks

As an alternative to example 3, you can escape double quotation marks with backslashes ( \" ) in your `map` ad hoc searches like this:

| makeresults count=4
| eval field="hello"
| map search="| makeresults | eval pony=1,field=\"$field$\",serial=\"$\_serial\_id$\",hello=\"buttercup\" "

The search results look something like this:

| \_time | field | hello | pony | serial |
| --- | --- | --- | --- | --- |
| 2024-01-04 17:23:42 | hello | buttercup | 1 | 1 |
| 2024-01-04 17:23:42 | hello | buttercup | 1 | 2 |
| 2024-01-04 17:23:42 | hello | buttercup | 1 | 3 |
| 2024-01-04 17:23:42 | hello | buttercup | 1 | 4 |

## Extended examples

### 1. Use a Sudo event to locate the user logins

This example illustrates how to find a Sudo event and then use the `map` command to trace back to the computer and the time that users logged on before the Sudo event. Start with the following search for the Sudo event.

sourcetype=syslog sudo | stats count by user host

This search returns a table of results.

| User | Host | Count |
| --- | --- | --- |
| userA | serverA | 1 |
| userB | serverA | 3 |
| userA | serverB | 2 |

Pipe these results into the `map` command, substituting the username.

sourcetype=syslog sudo | stats count by user host | map search="search index=ad\_summary username=$user$ type\_logon=ad\_last\_logon"

It takes each of the three results from the previous search and searches in the `ad_summary` index for the logon event for the user. The results are returned as a table.

| \_time | computername | computertime | username | usertime |
| --- | --- | --- | --- | --- |
| 10/12/16 8:31:35.00 AM | Workstation$ | 10/12/2016 08:25:42 | userA | 10/12/2016 08:31:35 AM |

(Thanks to Splunk user [Alacercogitatus](http://splunk-base.splunk.com/users/3659/alacercogitatus) for this example.)

## See also

Commands

[gentimes](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/gentimes#id_781f5cf5_e839_4232_b212_7d8ee644214a__gentimes)

[search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search)
