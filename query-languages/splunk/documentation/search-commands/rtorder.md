# rtorder

## Description

Buffers events from real-time search to emit them in ascending time order when possible.

The `rtorder` command creates a streaming event buffer that takes input events, stores them in the buffer in ascending time order, and emits them in that order from the buffer. This is only done after the current time reaches at least the span of time given by buffer\_span, after the timestamp of the event.

Events are also emitted from the buffer if the maximum size of the buffer is exceeded.

If an event is received as input that is earlier than an event that has already been emitted previously, the out of order event is emitted immediately unless the discard option is set to true. When discard is set to true, out of order events are always discarded to assure that the output is strictly in time ascending order.

## Syntax

rtorder [discard=<bool>] [buffer\_span=<span-length>] [max\_buffer\_size=<int>]

### Optional arguments

buffer\_span

Syntax: buffer\_span=<span-length>

Description: Specify the length of the buffer.

Default: 10 seconds

discard

Syntax: discard=<bool>

Description: Specifies whether or not to always discard out-of-order events.

Default: false

max\_buffer\_size

Syntax: max\_buffer\_size=<int>

Description: Specifies the maximum size of the buffer.

Default: 50000, or the `max_result_rows` setting of the [search] stanza in limits.conf.

## Examples

### Example 1:

Keep a buffer of the last 5 minutes of events, emitting events in ascending time order once they are more than 5 minutes old. Newly received events that are older than 5 minutes are discarded if an event after that time has already been emitted.

... | rtorder discard=t buffer\_span=5m

## See also

[sort](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sort#id_2a60b861_704d_4298_918f_274b501ec80d__sort)
