---
template: post.html
title: COVID-19
date: 2020-03-05
author: 'Julie Spero, Heather Wilson, Evan Galloway'
hide: true
permalink: /infectious_disease_md
teaserText: COVID-19
teaserImage: /images/posts/md_id_map_sample.png
keywords: physician, covid-19, coronavirus, infectious disease
mainClass: content
additionalStyleSheets: ['mapbox-gl.css']
---


<div id="map" style="height:400px;max-width:800px;margin:auto;"></div>


 <script src='/javascript/mapbox-gl.js'></script>
<script>
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FsbG93YXlldmFuIiwiYSI6ImNqanJlendzeTJ2MGIza3M0bzdzaGx5ZW8ifQ.Baz1Ju09q2mNHqw1gUbbSQ';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [-80.1, 35.4],
minZoom: 6, 
zoom: 6,
maxZoom: 10
});
map.on('load', function() {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('id_md', {
type: 'geojson',
data:
'/data/infectious_disease_md_points.json',
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});

map.addLayer({
id: 'clusters',
type: 'circle',
source: 'id_md',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'#dadaeb',
20,
'#bcbddc',
40,
'#9e9ac8',
60,
'#807dba',
80,
'#6a51a3',
100,
'#4a1486',
],
'circle-radius': [
'step',
['get', 'point_count'],
20,
100,
30,
750,
40
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'id_md',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'id_md',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#dadaeb',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#4a1486'
}
});

});
</script>