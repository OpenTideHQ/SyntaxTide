# findkeywords

CAUTION: The `findkeywords` command is an internal, unsupported, experimental command. See
[About internal commands](/en/?resourceId=Splunk_SearchReference_Aboutinternalcommands).

## Description

Given some integer labeling of events into groups, finds searches to generate these groups.

## Syntax

findkeywords labelfield=<field>

### Required arguments

labelfield

Syntax: labelfield=<field>

Description: A field name.

## Usage

Use the `findkeywords` command after the `cluster` command, or a similar command that groups events. The `findkeyword` command takes a set of results with a field (labelfield) that supplies a partition of the results into a set of groups. The command derives a search to generate each of these groups. This search can be saved as an [event type](https://docs.splunk.com/Splexicon:Eventtype).

## Examples

### Return logs for specific log\_level values and group the results

Return all logs where the log\_level is DEBUG, WARN, ERROR, FATAL and group the results by cluster count.

index=\_internal source=\*splunkd.log\* log\_level!=info | cluster showcount=t | findkeywords labelfield=cluster\_count

The result is a statistics table:

![Findkeywords ex1.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/729c2acb-669b-46e0-ad3c-826202e9ef00?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiI3MjljMmFjYi02NjliLTQ2ZTAtYWQzYy04MjYyMDJlOWVmMDAiLCJleHAiOjE3NjEwNjAyOTMsImp0aSI6IjU0YjNjM2MyNzUyODRkMGFhYTFhZmQ0N2I0NGE3ODViIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.LM77oa9xpChA6N2QW4i_ZrCJ61WKlcda437UebeDswQ)

The values of `groupID` are the values of `cluster_count` returned from the `cluster` command.

## See also

`cluster`, `findtypes`
