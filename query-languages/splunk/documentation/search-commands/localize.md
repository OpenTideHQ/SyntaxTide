# localize

## Description

The `localize` command generates results that represent a list of time contiguous event regions. An event region is a period of time in which consecutive events are separated, at most, by the `maxpause` time value. The regions found can be expanded using the `timeafter` and `timebefore` arguments.

The regions discovered by the `localize` command are meant to be fed into the `map` command. The `map` command uses a different region for each iteration.

## Syntax

localize [<maxpause>] [<timeafter>] [<timebefore>]

### Optional arguments

maxpause

Syntax: maxpause=<int>(s|m|h|d)

Description: Specify the maximum (inclusive) time between two consecutive events in a contiguous time region.

Default: 1m

timeafter

Syntax: timeafter=<int>(s|m|h|d)

Description: Specify the amount of time to add to the output endtime field (expand the time region forward in time).

Default: 30s

timebefore

Syntax: timebefore=<int>(s|m|h|d)

Description: Specify the amount of time to subtract from the output starttime field (expand the time region backwards in time).

Default: 30s

## Usage

### Expanding event ranges

You can expand the event range after the last event or before the first event in the region. These expansions are done arbitrarily, possibly causing overlaps in the regions if the values are larger than `maxpause`.

### Event region order

The regions are returned in search order, or descending time for historical searches and data-arrival order for realtime search. The time of each region is the initial pre-expanded start-time.

### Other information returned by the localize command

The `localize` command also reports:

* The number of events in the range
* The range duration in seconds
* The region density defined as the `number of events in range` divided by <range duration - `events per second`.

## Examples

### 1. Search the time range of each previous result for the term "failure"

... | localize maxpause=5m | map search="search failure starttimeu=$starttime$ endtimeu=$endtime$"

### 2: Finds suitable regions around where "error" occurs

Searching for "error" and calling the `localize` command finds suitable regions around where error occurs and passes each on to the search inside of the `map` command. Each iteration works with a specific time range to find potential transactions.

error | localize | map search="search starttimeu::$starttime$ endtimeu::$endtime$ | transaction uid,qid maxspan=1h"

## See also

[map](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/map#id_05347ef5_9f31_49fa_a0c2_01558b2effb8__map), [transaction](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/transaction#ae5d299a_e9cf_4987_b6bc_6d0b434625b4__transaction)
