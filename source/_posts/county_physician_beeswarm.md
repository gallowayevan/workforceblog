---
template: post.html
title: 'How has the physician supply changed over time in North Carolina counties?'
date: 2018-05-08
author: 'Evan Galloway'
hide: false
permalink: /county_physician_beeswarm
teaserText: >-
  Investigate the supply of North Carolina physicians with an interactive beeswarm plot.
teaserImage: /images/posts/county_physician_beeswarm.png
keywords: 'beeswarm, interactive, physicians, longitudinal'
mainClass: content
customStyle: >- 
  .counties.selected {
        stroke: #a2677d;
        fill-opacity: 0.85;
        stroke-width: 6px;
    }
    
    .counties {
      stroke: #fff;
      stroke-width: 2px;
    }
    
    .counties.metro {
      fill:#bdbdbd;
    }
    
    .counties.nonmetro {
      fill:#67a28c;
    }

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
