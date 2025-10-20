# geom

## Description

The `geom` command adds a field, named geom, to each result. This field contains geographic data structures for polygon geometry in JSON. These geographic data structures are used to create choropleth map visualizations.

![6.3.0 choropleth screenshot divergent us states.png](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/aed2ce7e-129c-4fbc-9652-3e42fe05978f?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJhZWQyY2U3ZS0xMjljLTRmYmMtOTY1Mi0zZTQyZmUwNTk3OGYiLCJleHAiOjE3NjEwNjAxMjIsImp0aSI6ImYyNTQ5Y2MwNDg0ZjQzNWRiNmMwMzZiNjUzYTRjNGM3IiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.f0jrsm04vmg6VGPP2ZqVnVtM9atJbUawYDZKYKA4jKc)

For more information about choropleth maps, see [Mapping data](/en/?resourceId=Splunk_Viz_Choroplethmaps) in the *Dashboards and Visualizations* manual.

## Syntax

geom [<featureCollection>] [allFeatures=<boolean>] [featureIdField=<string>] [gen=<double>] [min\_x=<double>] [min\_y=<double>] [max\_x=<double>] [max\_y=<double>]

### Required arguments

None.

### Optional arguments

featureCollection

Syntax: <geo\_lookup>

Description: Specifies the geographic lookup file that you want to use. Two geographic lookup files are included by default with Splunk software: `geo_us_states` and `geo_countries`. You can install your own geographic lookups from KMZ or KLM files. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geom#id_04994adf_96ec_463f_a001_c526210226fb__Usage) for more information.

allFeatures

Syntax: allFeatures=<bool>

Description: Specifies that the output include every geometric feature in the feature collection. When a shape has no values, any aggregate fields, such as `average` or `count`, display zero when this argument is used. Additional rows are appended for each feature that is not already present in the search results when this argument is used. See [Examples](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geom#id_9d508da5_34e2_468c_bc69_408b826442bb__Examples).

Default: false

featureIdField

Syntax: featureIdField=<field>

Description: If the event contains the featureId in a field named something other than "featureId", use this option to specify the field name.

gen

Syntax: gen=<double>

Description: Specifies generalization, in the units of the data. For example, `gen=0.1` generalizes, or reduces the size of, the geometry by running the Douglass Puiker Ramer algorithm on the polygons with a parameter of 0.1 degrees.

Default: 0.1

min\_x

Syntax: min\_x=<double>

Description: The X coordinate for the bottom-left corner of the bounding box for the geometric shape. The range for the coordinate is -180 to 180. See [Usage](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/geom#id_04994adf_96ec_463f_a001_c526210226fb__Usage) for more information.

Default: -180

min\_y

Syntax: min\_y=<double>

Description: The Y coordinate for the bottom-left corner of the bounding box for the geometric shape. The range for the coordinate is -90 to 90.

Default: -90

max\_x

Syntax: max\_x=<double>

Description: The X coordinate for the upper-right corner of the bounding box for the geometric shape. The range for the coordinate -180 to 180.

Default: 180

max\_y

Syntax: max\_y=<double>

Description: The Y coordinate for the upper-right corner of the bounding box for the geometric shape. The range is -90 to 90.

Default: 90

## Usage

### Specifying a lookup

To use your own lookup file in Splunk Enterprise, you can define the lookup in Splunk Web or edit the `transforms.conf` file. If you use Splunk Cloud Platform, use Splunk Web to define lookups.

Define a geospatial lookup in Splunk Web

1. To create a geospatial lookup in Splunk Web, you use the Lookups option in the Settings menu. You must add the lookup file, create a lookup definition, and can set the lookup to work automatically. See [Define a geospatial lookup in Splunk Web](/en/?resourceId=Splunk_Knowledge_DefineageospatiallookupinSplunkWeb) in the *Knowledge Manager Manual*.

Configure a geospatial lookup in transforms.conf

1. Edit the `%SPLUNK_HOME%\etc\system\local\transforms.conf` file, or create a new file named `transforms.conf` in the `%SPLUNK_HOME%\etc\system\local` directory, if the file does not already exist. See [How to edit a configuration file](/en/?resourceId=Splunk_Admin_Howtoeditaconfigurationfile) in the *Admin Manual*.
2. Specify the name of the lookup stanza in the `transforms.conf` file for the `featureCollection` argument.
3. Set `external_type=geo` in the stanza. See [Configure geospatial lookups](/en/?resourceId=Splunk_Knowledge_Configuregeospatiallookups) in the *Knowledge Manager Manual*.

### Specifying no optional arguments

When no arguments are specified, the `geom` command looks for a field named `featureCollection` and a field named `featureIdField` in the event. These fields are present in the default output from a geoindex lookup.

### Clipping the geometry

The `min_x`, `min_y`, `max_x`, and `max_y` arguments are used to clip the geometry. Use these arguments to define a bounding box for the geometric shape. You can specify the minimum rectangle corner (`min_x`, `min_y`) and the maximum rectangle corner (`max_x`, `max_y`). By specifying the coordinates, you are returning only the data within those coordinates.

### Testing lookup files

You can use the `inputlookup` command to verify that the geometric features on the map are correct. The syntax is `| inputlookup <your_lookup>`.

For example, to verify that the geometric features in built-in `geo_us_states` lookup appear correctly on the choropleth map:

1. Run the following search:

   | inputlookup geo\_us\_states
2. On the Visualizations tab, change to a Choropleth Map.
3. zoom in to see the geometric features. In this example, the states in the United States.

### Testing geometric features

You can create an arbitrary result to test the geometric features.

To show how the output appears with the `allFeatures` argument, the following search creates a simple set of fields and values.

| stats count | eval featureId="California" | eval count=10000 | geom geo\_us\_states allFeatures=true

* The search uses the `stats` command, specifying the `count` field. A single result is created that has a value of zero ( 0 ) in the `count` field.
* The `eval` command is used to add the `featureId` field with value of California to the result.
* Another `eval` command is used to specify the value 10000 for the `count` field. You now have a single result with two fields, `count` and `featureId`.

* When the `geom` command is added, two additional fields are added, `featureCollection` and `geom`.

The following image shows the results of the search on the Statistics tab.

![This image shows the results of the search on the Statistics tab. There are four columns: count, featureCollection, featureId, and geom. The state of California is listed first because it has a count. All of the other states are listed in alphabetical order because they have a count of zero, which is the result of specifying the allFeatures argument.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/e13b096a-5a89-47ff-ad49-7de57c3b7971?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJlMTNiMDk2YS01YTg5LTQ3ZmYtYWQ0OS03ZGU1N2MzYjc5NzEiLCJleHAiOjE3NjEwNjAxMjIsImp0aSI6ImVmYmNiZDI3NWEwODRmODZiZjJjOGU5ZTYxMzVlYjVmIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.LUE6FD7ouJKxvYo9jhA4Rdtqixb1HMW6lk1Sx2NnXUk)

The following image shows the results of the search on the Visualization tab. Make sure that the map is a Choropleth Map. This image is zoomed in to show more detail.

![This image shows the results of the search on the Visualization tab. The state of California is highlighted. Because the allFeatures argument is used, all of the other stats in the collection have an outline around their geometric features.](https://splunk.deploy.heretto.com/v4/deployments/lbx3FHoDR4kUISPo5g64/object/bfce3109-525e-4f54-8a6b-3ef28f0dafa8?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2pvcnNlay5jb20vZXpkX29yZ2FuaXphdGlvbiI6InNwbHVuayIsImh0dHBzOi8vam9yc2VrLmNvbS9lemQvb2JqZWN0X3V1aWQiOiJiZmNlMzEwOS01MjVlLTRmNTQtOGE2Yi0zZWYyOGYwZGFmYTgiLCJleHAiOjE3NjEwNjAxMjIsImp0aSI6ImQ5YzVhOWUzYzAwYTQ2ZmM5ZjMzZDBiNjE5YjEwZTAyIiwiaHR0cHM6Ly9qb3JzZWsuY29tL2V6ZF9maWxlc2V0IjoiRUJieWh6Uk1kcW43NGFCZzkyNEgifQ.xKbPDEQ8dAXDh6kHszC_LibdIZBKhlQOC9v_c-6SOAo)

## Examples

### 1. Use the default settings

When no arguments are provided, the `geom` command looks for a field named featureCollection and a field named featureId in the event. These fields are present in the default output from a geospatial lookup.

...| geom

### 2. Use the built-in geospatial lookup

This example uses the built-in `geo_us_states` lookup file for the `featureCollection`.

...| geom geo\_us\_states

### 3. Specify a field that contains the featureId

This example uses the built-in `geo_us_states` lookup and specifies `state` as the `featureIdField`. In most geospatial lookup files, the feature IDs are stored in a field called *featureId*. Use the `featureIdField` argument when the event contains the feature IDs in a field named something other than "featureId".

...| geom geo\_us\_states featureIdField="state"

### 4. Show all geometric features in the output

The following example specifies that the output include every geometric feature in the feature collection. If no value is present for a geometric feature, zero is the default value. Using the `allFeatures` argument causes the choropleth map visualization to render all of the shapes.

...| geom geo\_us\_states allFeatures=true

### 5. Use the built-in countries lookup

The following example uses the built-in `geo_countries` lookup. This search uses the `lookup` command to specify shorter field names for the latitude and longitude fields. The `stats` command is used to count the feature IDs and renames the `featureIdField` field as `country`. The `geom` command generates the information for the chloropleth map using the renamed field `country`.

... | lookup geo\_countries latitude AS lat, longitude AS long | stats count BY featureIdField AS country | geom geo\_countries featureIdField="country"

### 6. Specify the bounding box for the geometric shape

This example uses the `geom` command attributes that enable you to clip the geometry by specifying a bounding box.

... | geom geo\_us\_states featureIdField="state" gen=0.1 min\_x=-130.5 min\_y=37.6 max\_x=-130.1 max\_y=37.7

## See also

[Mapping data](/en/?resourceId=Splunk_Viz_Choroplethmaps) in the *Dashboards and Visualizations* manual.
