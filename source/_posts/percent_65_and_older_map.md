---
template: post.html
title: 'Which counties have older populations? How will the age distribution change over time?'
date: 2019-01-28
author: 'Evan Galloway'
hide: true
permalink: /percent_65_and_older_map
teaserText: >-
  What percentage of the residents in your county are 65 and older?
teaserImage: /images/posts/percent_65_and_older_map.png
keywords: 'demographics, general population'
mainClass: content
customStyle: >- 
    svg {
        max-width:100%;
        height:auto;
    }
---
<div id='map'></div>
<div id='viewof-year'></div>

<script type="module">
  // Load the Observable runtime and inspector.
  import {Runtime, Inspector} from "https://unpkg.com/@observablehq/notebook-runtime?module";

  import notebook from "https://api.observablehq.com/@gallowayevan/percent-65-and-older-north-carolina.js";


  const renders = {
    "viewof year": "#viewof-year",
    "map": "#map",
  };

  for (let i in renders)
    renders[i] = document.querySelector(renders[i]);

  Runtime.load(notebook, (variable) => {
    if (renders[variable.name]){
      return new Inspector(renders[variable.name]);
    } else {return true;}
  });

</script>
