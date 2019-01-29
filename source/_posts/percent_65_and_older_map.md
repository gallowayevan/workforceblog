---
template: post.html
title: 'Which North Carolina counties have older populations?'
date: 2019-01-28
author: 'Evan Galloway, Julie Spero'
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
*The proportion of the population who are older than 65 has grown faster in rural counties than in urban counties, particularly in the Western and North Eastern regions of the state.

*Counties with larger metropolitan areas tend to have a greater proportion of younger residents.

*Both counties projected to have the lowest proportions of adults 65 and older by 2037, Hoke and Onslow, have strong ties to large military bases (Fort Bragg and Camp LeJeune). 

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
