# multisearch

## Description

The `multisearch` command is a generating command that runs multiple *streaming* searches at the same time. This command requires at least two subsearches and allows only streaming operations in each subsearch. Examples of streaming searches include searches with the following commands: `search`, `eval`, `where`, `fields`, and `rex`. For more information, see [Types of commands](/en/?resourceId=Splunk_Search_Typesofcommands) in the *Search Manual*.

## Syntax

| multisearch <subsearch1> <subsearch2> <subsearch3> ...

### Required arguments

<subsearch>

Syntax: "["search <logical-expression>"]"

Description: At least two streaming searches must be specified. See the [search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search) command for detailed information about the valid arguments for <logical-expression>.

To learn more, see [About subsearches](/en/?resourceId=Splunk_Search_Aboutsubsearches) in the *Search Manual*.

## Usage

The `multisearch` command is an [event-generating command](https://docs.splunk.com/Splexicon:Generatingcommand). See [Command types](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#a7189144_fdbc_4890_949d_4657d94c2778__Command_types).

Generating commands use a leading pipe character and should be the first command in a search.

### The multisearch command doesn't support peer selection

You can't exclude [search peers](https://docs.splunk.com/Splexicon:Searchpeer) from `multisearch` searches because the `multisearch` command connects to all peers by default. For example, the following `multisearch` search connects to the indexer called myServer even though it is excluded using `NOT`:

| multisearch
[ search index=\_audit NOT splunk\_server=myServer]

Instead of using the `multisearch` command to exclude search peers from your search, you can use other commands such as `append` with search optimization turned off. If you don't turn off search optimization, Splunk software might internally convert the `append` command to the `multisearch` command in order to optimize the search and might not exclude the search peers.

You can turn off search optimization for a specific search by including the following command at the end of your search:

|noop search\_optimization=false

For example, the following workaround uses the `append` command to exclude myServer:

index=\_internal splunk\_server=myServer
| append[| search index=\_audit]
| noop search\_optimization=false

See [Optimization settings](/en/?resourceId=Splunk_Search_Built-inoptimization) in the *Search Manual*.

### Subsearch processing and limitations

With the `multisearch` command, the events from each subsearch are interleaved. Therefore the `multisearch` command is not restricted by the subsearch limitations.

Unlike the `append` command, the `multisearch` command does not run the subsearch to completion first. The following subsearch example with the `append` command is not the same as using the `multisearch` command.

index=a | eval type = "foo" | append [search index=b | eval mytype = "bar"]

## Examples

### Example 1:

Search for events from both index a and b. Use the `eval` command to add different fields to each set of results.

| multisearch [search index=a | eval type = "foo"] [search index=b | eval mytype = "bar"]

## See also

[append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append), [join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join)
