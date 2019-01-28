---
template: post.html
title: 'Which counties have older populations? How will the age distribution change over time?'
date: 2019-01-28
author: 'Evan Galloway'
hide: true
permalink: /percent_65_and_older_map
teaserText: >-
  What percentage of the residents in your county are 65 and older?
teaserImage: /images/posts/county_physician_beeswarm.png
keywords: 'demographics, general population'
mainClass: content
customStyle: >- 
    svg {
        max-width:100%;
        height:auto;
    }
---
<div id='chart-title'></div>
<div id='viewof-year'></div>
<div id='beeswarm' ></div>
Data derived from North Carolina Office of State Budget and Management (OSBM) estimates and projections and physician licensure data from the North Carolina Health Professions Data System (from licensure data provided by the North Carolina Medical Board). Metro and nonmetro delineations are from the United States Office of Management and Budget and applied to Census data.

<script type="module">
  // Load the Observable runtime and inspector.
  import {Runtime, Inspector} from "https://unpkg.com/@observablehq/notebook-runtime?module";

  import notebook from "/county_physician_beeswarm/county_physician_beeswarm.js";


  const renders = {
    "chart-title": "#chart-title",
    "viewof year": "#viewof-year",
    "beeswarm": "#beeswarm",
  };

  for (let i in renders)
    renders[i] = document.querySelector(renders[i]);

  Runtime.load(notebook, (variable) => {
    if (renders[variable.name]){
      return new Inspector(renders[variable.name]);
    } else {return true;}
  });


//   document.querySelector('.blog').appendChild(document.querySelector('.byline'));
</script>
