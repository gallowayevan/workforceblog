---
template: post.html
title: Psychologists are getting older, but the younger cohort is mostly female.
date: 2019-02-26
author: 'Evan Galloway, Julie Spero'
hide: true
permalink: /psychologists_by_age_sex
teaserText: Psychologists are getting older, but the younger cohort is mostly female.
teaserImage: /images/posts/psychologists_by_age_sex_2017.png
keywords: 'psychologists, age, sex, population pyramid'
mainClass: content
---
<ul>
<li> Toggle between stacked and grouped views of the data on sex.</li>
</ul>
<div id='viewof-layout'></div>
<div id='chart'></div>

<script type=module>

import {Runtime, Inspector} from "https://unpkg.com/@observablehq/runtime@3/dist/runtime.js";
import define from "https://api.observablehq.com/@gallowayevan/population-structure-for-north-carolina-psychologists-20.js?v=3";
  
  const renders = {
    "viewof layout": "#viewof-layout",
    "chart": "#chart",
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

