---
template: post.html
title: 'Click a County to Highlight'
date: 2018-10-01
author: 'Evan Galloway'
hide: true
permalink: /simple_county_map_widget
teaserText: >-
  Tools: Make a simple map of North Carolina highlighting certain counties.
teaserImage: /images/posts/county_physician_beeswarm.png
keywords: 'tools'
mainClass: content
customStyle: >-
  .control {
    display: inline-block;
    margin: 10px;
  }
  svg {
        max-width:100%;
        height:auto;
    }
---
Click on a county to highlight it. Click again to unhighlight. Choose colors below. Then download as a .png or .svg.
<div id='map'></div>
<div class='control' id='selected-color'></div>
<div class='control' id='non-selected-color' ></div>
<div class='control' id='show-names' ></div>
<div class='control' id='stroke'></div>
<div class='control' id='font-color'></div>
<div class='control' id='background-color' ></div>
<div class='control' id='download-png'></div>
<div class='control' id='download-svg'></div>

<script type="module">
  // Load the Observable runtime and inspector.
  import {Runtime, Inspector} from "https://unpkg.com/@observablehq/notebook-runtime?module";

  import notebook from "/simple_county_map_widget/simple_county_map_widget.js";


  const renders = {
    "map": "#map",
    "viewof selectedColor": "#selected-color",
    "viewof nonSelectedColor": "#non-selected-color",
    "viewof showNames": "#show-names",
    "viewof stroke": "#stroke",
    "viewof fontColor": "#font-color",
    "viewof backgroundColor": "#background-color",
    "downloadPNG": "#download-png",
    "downloadSVG": "#download-svg",
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