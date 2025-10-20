# geomfilter

## Description

Use the geomfilter command to specify points of a bounding box for clipping choropleth maps.

For more information about choropleth maps, see ["Mapping data"](/en/?resourceId=Splunk_Viz_Choroplethmaps) in the *Dashboards and Visualizations* Manual.

## Syntax

geomfilter [min\_x=<float>] [min\_y=<float>] [max\_x=<float>] [max\_y=<float>]

### Optional arguments

min\_x

Syntax: min\_x=<float>

Description: The x coordinate of the bounding box's bottom-left corner, in the range [-180, 180].

Default: -180

min\_y

Syntax: min\_y=<float>

Description: The y coordinate of the bounding box's bottom-left corner, in the range [-90, 90].

Default: -90

max\_x

Syntax: max\_x=<float>

Description: The x coordinate of the bounding box's up-right corner, in the range [-180, 180].

Default: 180

max\_y

Syntax: max\_y=<float>

Description: The y coordinate of the bounding box's up-right corner, in the range [-90, 90].

Default: max\_y=90

## Usage

The geomfilter command accepts two points that specify a bounding box for clipping choropleth maps. Points that fall outside of the bounding box will be filtered out.

## Examples

Example 1: This example uses the default bounding box, which will clip the entire map.

...| geomfilter

Example 2: This example clips half of the whole map.

...| geomfilter min\_x=-90 min\_y=-90 max\_x=90 max\_y=90

## See also

[geom](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geom#d6234352_194c_47bd_8e7d_ae17c5690eb2__geom)
