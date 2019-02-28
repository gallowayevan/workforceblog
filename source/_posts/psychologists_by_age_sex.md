---
template: post.html
title: North Carolina Psychologists by Age and Sex
date: 2019-02-26T00:00:00.000Z
author: Evan Galloway
hide: true
permalink: /psychologists_by_age_sex
teaserText: >-
  A quarter of psychologists are 65 or older, but a large and mostly female
  cohort are earlier in their careers.
teaserImage: /images/posts/psychologists_by_age_sex_2017.png
keywords: 'psychologists, age, sex, population pyramid'
mainClass: content
---
<ul>

<li>Nearly a quarter of psychologists are 65 or older (compare this to physicians where only ~12% are 65 or older).</li>

<li>60% of the psychologists who are 65 or older are male, but 70% of those younger than 65 are female.</li>

<li>New entrants to the profession are predominantly women.  Four out of five psychologists aged 45 or younger are female.</li>


</ul>
<div id='viewof-layout' class="control"></div>
<div id='chart'></div>

<script type=module>

import {Runtime, Inspector} from "https://unpkg.com/@observablehq/runtime@3/dist/runtime.js";
import define from "https://api.observablehq.com/@gallowayevan/population-structure-for-north-carolina-psychologists-20.js?v=3";
  
  const renders = {
    "viewof layout": "#viewof-layout",
    "chart": "#chart"
  };

  for (let i in renders)
    renders\[i] = document.querySelector(renders\[i]);

const runtime = new Runtime();
const main = runtime.module(define, name => {
if (renders\[name]){
      return new Inspector(renders\[name]);
    } else {
        return true;
    }
});

</script>
