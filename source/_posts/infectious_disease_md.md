---
template: post.html
title: 'COVID-19, Primary Care, and Infectious Disease Physicians in NC'
date: 2020-03-05T00:00:00.000Z
author: 'Julie Spero, Heather Wilson, Evan Galloway'
hide: true
permalink: /infectious_disease_md
teaserText: 'COVID-19, Primary Care, and Infectious Disease Physicians in NC'
teaserImage: /images/posts/md_id_map_sample.png
keywords: 'physician, covid-19, coronavirus, infectious disease'
additionalStyleSheets:
  - mapbox-gl.css
mainClass: content
---
* The first case of coronavirus (COVID-19) has been [documented in NC](https://www.newsobserver.com/news/local/article240750876.html).  The spread has sparked concerns about public health infrastructure. Adults aged 65 and older are especially vulnerable to coronaviruses and the subsequent respiratory infections they can cause. 
* During an epidemic like this one, primary care is the entry point to testing and to referral if more intensive and specialized care is necessary.
* In North Carolina, [primary care clinicians are unevenly distributed](https://nchealthworkforce.unc.edu/physician_growth_metro/), with access worsening in rural areas.  The populations of [rural communities are older](https://nchealthworkforce.unc.edu/percent_65_and_older_map/) than those in urban areas.  Local primary care clinicians are a critical first access point for patients with COVID-19 symptoms.  
*  Infectious disease (ID) physicians will also play a role in managing NC’s response to COVID-19.  ID physicians diagnose and treat infectious diseases, consult with other physicians, and develop prevention strategies to reduce transmission.
*  In 2018, 211 NC physicians reported that infectious disease was their primary area of practice.  Many are associated with academic health centers and may do research or work in public health in addition to seeing patients.
*  For more information on the epidemic in NC, please see the [NC's Department of Health and Human Services coronavirus website](https://www.ncdhhs.gov/divisions/public-health/coronavirus-disease-2019-covid-19-response-north-carolina).

<h5>Physicians with a Primary Area of Practice of Infectious Disease, North Carolina, 2018</h5>
<div id="map" style="height:400px;max-width:800px;margin:auto;"></div>

 <script src='/javascript/mapbox-gl.js'></script>

 <p style="font-size:1rem;margin-top:10px;">Notes: Data include active, licensed physicians in practice in North Carolina as of October 31, 2018 who are not residents-in-training and are not employed by the Federal government. Physician data are derived from the North Carolina Medical Board. County estimates are based on primary practice location. Population census data and estimates are downloaded from the North Carolina Office of State Budget and Management via NC LINC and are based on US Census data.</p>

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
// 'circle-color': [
// 'step',
// ['get', 'point_count'],
// '#dadaeb',
// 20,
// '#bcbddc',
// 40,
// '#9e9ac8',
// 60,
// '#807dba',
// 80,
// '#6a51a3',
// 100,
// '#4a1486',
// ],
'circle-color': [
"interpolate-hcl",
 ["linear"],   
  ['get', 'point_count'],
  0, "HSL(240, 30%, 89%)",
  82, "HSL(258, 34%, 48%)"
],
"circle-radius": [
  "sqrt", ["*", ["get", "point_count"], 32]    
]
// 'circle-radius': [
// 'step',
// ['get', 'point_count'],
// 20,
// 100,
// 30,
// 750,
// 40 
// ]
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