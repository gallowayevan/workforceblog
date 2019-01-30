---
template: post.html
title: Which North Carolina counties have older populations?
date: 2019-01-28T00:00:00.000Z
author: 'Evan Galloway, Julie Spero'
hide: false
permalink: /percent_65_and_older_map
teaserText: What percentage of the residents in your county are 65 and older?
teaserImage: /images/posts/percent_65_and_older_map.png
keywords: 'demographics, general population'
mainClass: content
---
<ul>
<li> Use the slider bar below the map to scroll through years 2000 to 2037 and see the changes by county.

<li>The proportion of the population who are older than 65 has grown faster in rural counties than in urban counties, particularly in the Western and Northeastern regions of the state.</li>

<li>Counties with larger metropolitan areas tend to have a greater proportion of younger residents.</li>

<li>Hoke and Onslow counties both have strong ties to large military bases (Fort Bragg and Camp LeJeune) and are also projected to have the lowest proportions of adults 65 and older in the state by 2037.</li>
</ul>
<div id='map'></div>
<div id='viewof-year'></div>

<script type=module>

import {Runtime, Inspector} from "https://unpkg.com/@observablehq/runtime@3/dist/runtime.js";
import define from "https://api.observablehq.com/@gallowayevan/percent-65-and-older-north-carolina.js?v=3";
  
  const renders = {
    "viewof year": "#viewof-year",
    "map": "#map",
  };

  for (let i in renders)
    renders[i] = document.querySelector(renders[i]);

const runtime = new Runtime();
const main = runtime.module(define, name => {
if (renders[name]){
      return new Inspector(renders[name]);
    } 
});

</script>
