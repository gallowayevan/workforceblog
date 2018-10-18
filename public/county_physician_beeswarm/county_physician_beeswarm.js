// URL: https://beta.observablehq.com/@gallowayevan/counties-by-rate-per-10k-of-physicians-north-carolina-year/2
// Title: Counties by Rate Per 10k of Physicians, North Carolina, ${year}
// Author: Evan Galloway (@gallowayevan)
// Version: 903
// Runtime version: 1

const m0 = {
  id: "bf11568d582ecb74@903",
  variables: [
    {
      inputs: ["md","year"],
      name: "chart-title",
      value: (function(md,year){return(
md`##### Counties by Physicians Per 10k of Population, North Carolina, ${year}
Green dots and counties are nonmetro/rural counties. Hover on dots to get county name and value. Click on dots to follow over time. Hover or click on map to see linked dots. Use slider to move across years.\n`
)})
    },
    {
      name: "beeswarm",
      inputs: ["DOM","width","height","d3","xAxis","fadeTransition","map","legendContent"],
      value: (function(DOM,width,height,d3,xAxis,fadeTransition,map,legendContent)
{
  const svgNode = DOM.svg(width, height);

  const g = d3.select(svgNode).append("g")
  .call(xAxis);

  fadeTransition(d3.select(svgNode),g,xAxis);

  const inset = svgNode.appendChild(map.node());
  d3.select(inset).attr("transform", "scale(0.4), translate(10,10)");

  const legend = svgNode.appendChild(legendContent);
  d3.select(legend).attr("transform", `translate(${width * .73},${width * .025})`);

  d3.select(svgNode).append("text")
    .attr("x", width * .75)
    .attr("y", height * .91)
    .style("font-size", "14px")
    .text("Physicians per 10,000 population");
  
  return svgNode;
}
)
    },
    {
      name: "viewof year",
      inputs: ["slider","maxYear"],
      value: (function(slider,maxYear){return(
slider({
  min: 2000, 
  max: maxYear, 
  step: 1, 
  value: maxYear, 
  title: "Year of Data", 
})
)})
    },
    {
      name: "year",
      inputs: ["Generators","viewof year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof totalOrRate",
      inputs: ["DOM"],
      value: (function(DOM){return(
DOM.select(["rate","total"])
)})
    },
    {
      name: "totalOrRate",
      inputs: ["Generators","viewof totalOrRate"],
      value: (G, _) => G.input(_)
    },
    {
      name: "dodge",
      inputs: ["x"],
      value: (function(x){return(
(data, radius, padding) => {
  //https://beta.observablehq.com/@mbostock/d3-beeswarm-ii
  const circles = data.map(function(d){ 
    let currentX = d.value == 0 ? x(0.2) : x(d.value);
    return {x: currentX, data: d}}).sort((a, b) => a.x - b.x);
  const epsilon = 1e-3;
  let head = null, tail = null;

  // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y) {
    let a = head;
    while (a) {
      if ((radius * 2 + padding - epsilon) ** 2 > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true;
      }
      a = a.next;
    }
    return false;
  }
  
  // Place each circle sequentially.
  for (const b of circles) {
    
    // Remove circles from the queue that can’t intersect the new circle b.
    while (head && head.x < b.x - (radius * 2 + padding)) head = head.next;
    
    // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, b.y = 0)) {
      let a = head;
      b.y = Infinity;
      do {
        let y1 = a.y + Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);
        let y2 = a.y - Math.sqrt((radius * 2 + padding) ** 2 - (a.x - b.x) ** 2);
        if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
        if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
        a = a.next;
      } while (a);
    }
    
    // Add b to the queue.
    b.next = null;
    if (head === null) head = tail = b;
    else tail = tail.next = b;
  }
  
  return circles;
}
)})
    },
    {
      name: "chart",
      inputs: ["d3","beeswarm","totalOrRate","dodgedData","radius","height","fadeDuration","width","dispatch"],
      value: (function(d3,beeswarm,totalOrRate,dodgedData,radius,height,fadeDuration,width,dispatch)
{
  const chartSvg = d3.select(beeswarm);

  let currentFormatter = totalOrRate == "rate" ? d3.format(",.3r") : d3.format(",");

  const update = chartSvg
  .selectAll(".circleGroup")
  .data(dodgedData, d => d.name);

  const enter = update.enter()
  .append("g")
  .attr("class", "circleGroup");

  const circles = enter.append("circle")
  .attr("r", radius)
  .attr("fill", d=> d.metro == "metro" ? "#bdbdbd" : "#67a28c")
  .attr("cx", d => d.x)
  .attr("cy", d => height / 1.4 + d.y)
  .attr("class", d => `${d.name == 'New Hanover' ? 'New-Hanover' : d.name} circles`);

  circles.attr("opacity",0)
    .transition()
    .duration(fadeDuration)
    .attr("opacity", 1);


  // circles
  //     .append("title")
  //     .text(d => d.name + "\n" + currentFormatter(d.value));

  enter.append("text").attr("visibility", "hidden").attr("class", "annotation");

  const clickText = enter.merge(update).select("text")
  .attr("dy", -14)
  .attr("dx", -4)
  .style("font-family", "arial, sans-serif")
  .style("font-size", "1.8rem")
  .style("fill", "#fff")
  .style("font-weight", "bold")
  .style('pointer-events', 'none')
  .text(d=>d.name + ": " + currentFormatter(d.value))
  .transition()
  .ease(d3.easeCubicOut)
  .duration(750)
  .attr("x", function(d){
    let currentX = d.x;
    d.x - 2 + +this.getBBox().width > width ? 
      currentX = d.x - +this.getBBox().width + 8: 
    currentX = d.x + 5;
    return currentX;
  })
  .attr("y", d => height / 1.4 + d.y);

  enter.insert("rect", "text").attr("visibility", "hidden").attr("class", "annotation");;

  const clickRect = enter.merge(update).select("rect")
  .attr("width", function(d){return d3.select(this.parentNode).select("text").node().getBBox().width+10})
  .attr("height", function(d){return d3.select(this.parentNode).select("text").node().getBBox().height+10})
  .attr("rx", 3)
  .attr("ry", 3)
  .attr("fill", "#bdbdbd")
  .attr("fill-opacity", 0.8)
  .style('pointer-events', 'none')
  .transition()
  .ease(d3.easeCubicOut)
  .duration(750)
  .attr("x", function(d){
    let currentX = d.x;
    d.x - 2 + +this.getAttribute("width") - 10 > width ? 
      currentX = d.x - +this.getAttribute("width") + 5 : 
    currentX = d.x - 4;
    return currentX;
  })
  .attr("y", d => height / 1.4 + d.y - 36);


  update.select(".circles") 
    .transition()
    .ease(d3.easeCubicOut)
    .duration(750)
    .attr("cx", d => d.x)
    .attr("cy", d => height / 1.4 + d.y);

  enter.merge(update).select(".circles").on("click", function(d){
    dispatch.call("clicked", this, d.name);
  })
    .on("mouseover", function(d) {
    dispatch.call("hoverIn", this, d.name)
  })
    .on("mouseout", function(d) {
    dispatch.call("hoverOut", this, d.name)
  });

  dispatch.on("hoverIn.beeswarm", function(d){
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const currentItem = d3.select(`circle.${d}`);
    if(!currentItem.node().classList.contains("clicked")){
      currentItem.attr("stroke", "#a2677d").attr("stroke-width", 3);
      d3.select(currentItem.node().parentNode).selectAll(".annotation").attr("visibility", "visible");
      currentItem.node().parentNode.parentNode.appendChild(currentItem.node().parentNode);
    } 
  });
  dispatch.on("hoverOut.beeswarm", function(d){
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const currentItem = d3.select(`circle.${d}`);
    if(!currentItem.node().classList.contains("clicked")){
      // console.log(currentItem.node().classList.contains("clicked"));    
      currentItem.attr("stroke", "none");
      d3.select(currentItem.node().parentNode).selectAll(".annotation").attr("visibility", "hidden");
    }
  });

  dispatch.on("clicked.beeswarm", function(d){
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const currentItem = d3.select(`circle.${d}`);
    if(currentItem.node().classList.toggle("clicked")){
      currentItem.attr("stroke", "#a2677d").attr("stroke-width", 3);
      d3.select(currentItem.node().parentNode).selectAll(".annotation").attr("visibility", "visible");
      currentItem.node().parentNode.parentNode.appendChild(currentItem.node().parentNode);
    } else {
      currentItem.attr("stroke", "none");
      d3.select(currentItem.node().parentNode).selectAll(".annotation").attr("visibility", "hidden");
    }
  });


  update.select("title")
    .text(d => d.name + "\n" + currentFormatter(d.value));

  const exit = update.exit().remove();


}
)
    },
    {
      name: "dispatch",
      inputs: ["d3"],
      value: (function(d3){return(
d3.dispatch("hoverIn", "hoverOut", "clicked")
)})
    },
    {
      name: "dodgedData",
      inputs: ["dodge","dataYear","totalOrRate","radius","padding"],
      value: (function(dodge,dataYear,totalOrRate,radius,padding)
{
const data = dodge(dataYear.map(function(d){return {name: d.county, value: d[totalOrRate], metro: d.metro}}), radius, padding);
  
  return data.map(function(d){
  	return{
    x : d.x,
    y : d.y,
    name : d.data.name,
    metro : d.data.metro,   
	value : d.data.value
    }
  });

}
)
    },
    {
      name: "dataYear",
      inputs: ["allData","year"],
      value: (function(allData,year){return(
allData.filter(d=>d.year == year)
)})
    },
    {
      name: "allData",
      inputs: ["d3","omb_metro_map_2015"],
      value: (function(d3,omb_metro_map_2015){return(
d3.csv(`https://data-dept-healthworkforce.cloudapps.unc.edu/data/region/spec023.csv`, function(d){
if(d.type != 'county') return null;
  return {county : d.region,
  	year : +d.year,
    total : +d.total,
  	rate : +d.providerRate,
  	metro : omb_metro_map_2015.get(d.region.toUpperCase())
    };
})
)})
    },
    {
      name: "maxYear",
      inputs: ["d3","allData"],
      value: (function(d3,allData){return(
d3.max(allData, d=>d.year)
)})
    },
    {
      name: "x",
      inputs: ["d3","allData","totalOrRate","margin","width"],
      value: (function(d3,allData,totalOrRate,margin,width){return(
d3.scaleLinear()
    .domain([0, d3.max(allData, d => d[totalOrRate])])
    .range([margin.left, width - margin.right])
)})
    },
    {
      name: "xAxis",
      inputs: ["height","margin","d3","x","tickValues"],
      value: (function(height,margin,d3,x,tickValues){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.format(",.1r")).tickValues(tickValues))
)})
    },
    {
      name: "tickValues",
      inputs: ["totalOrRate","d3"],
      value: (function*(totalOrRate,d3)
{
  yield totalOrRate == "rate" ? 
   d3.range(0,120,10) :
   [0,10,50,200,400,1000,2000,3000]
}
)
    },
    {
      name: "height",
      value: (function(){return(
400
)})
    },
    {
      name: "width",
      value: (function(){return(
960
)})
    },
    {
      name: "radius",
      value: (function(){return(
5
)})
    },
    {
      name: "padding",
      value: (function(){return(
1.5
)})
    },
    {
      name: "fadeDuration",
      value: (function(){return(
1500
)})
    },
    {
      name: "fadeTransition",
      inputs: ["fadeDuration"],
      value: (function(fadeDuration){return(
function fadeTransition(svg, g, axis) {
  //https://beta.observablehq.com/@mbostock/dont-transition-units
  var t = svg.transition().duration(fadeDuration); // Define a transition.
  g.transition(t).attr("opacity", 0).remove(); // Fade-out the old.
  g = svg.append("g").attr("opacity", 0).call(axis); // Add the new.
  g.transition(t).attr("opacity", 1); // Fade-in the new.
}
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 30, bottom: 30, left: 20}
)})
    },
    {
      name: "style",
      inputs: ["html"],
      value: (function(html){return(
html`<style>
  .counties.selected {
    stroke: #a2677d;
    fill-opacity: 0.85;
    stroke-width: 5px;
}

.counties {
  stroke: #fff;
  stroke-width: 1px;
}

.counties.metro {
  fill:#bdbdbd;
}

.counties.nonmetro {
  fill:#67a28c;
}
</style>`
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("https://d3js.org/d3.v5.min.js")
)})
    },
    {
      name: "nc",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://cdn.rawgit.com/gallowayevan/1b6056fdccb0aa0d860cbdee2bdf7597/raw/a7a6f4d80d077e74152e6c3196abdec9b899eb76/ncmap.json")
)})
    },
    {
      name: "map",
      inputs: ["d3","width","nc","DOM","omb_metro_map_2015","dispatch"],
      value: (function(d3,width,nc,DOM,omb_metro_map_2015,dispatch)
{

  const height = 400;

  const projection = d3
  .geoAlbers()
  .rotate([0, 62, 0])
  .fitSize([width-40, height], nc);

  const path = d3.geoPath(projection);

  const svg = d3.select(DOM.svg(width, height))
  .style("width", "100%")
  .style("height", "auto"); 

  const svgChild = svg.append("g").attr("class", "inset");

  svgChild.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "none")
    .attr("stroke", "#bdbdbd");

  svgChild.append("g")
    .selectAll("path")
    .data(nc.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("transform", "translate(20, 0)")
    .attr("class", d=> `${d.properties.county == 'New Hanover' ? 'New-Hanover' : d.properties.county} counties ${omb_metro_map_2015.get(d.properties.county.toUpperCase())}`)
  // .attr("stroke", "#fff")
  // .style("stroke-width", 3)
  //   .style("fill", function(d){
  //       let fill = "#bdbdbd"
  // if(omb_metro_map_2015.get(d.properties.county.toUpperCase()) == "nonmetro"){
  //       fill = "#67a28c";
  //       }
  // return fill;
  //       })
    .on("mouseover", function(d) {
    dispatch.call("hoverIn", this, d.properties.county)
  })
    .on("mouseout", function(d) {
    dispatch.call("hoverOut", this, d.properties.county)
  })
    .on("click", function(d){
    dispatch.call("clicked", this, d.properties.county)
  });

  dispatch.on("hoverIn.map", function(d) {
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const hoverItem = d3.select(`path.${d}`);
    hoverItem.node().parentNode.appendChild(hoverItem.node());
    hoverItem.classed("selected", true);            
  });
  dispatch.on("hoverOut.map", function(d) {
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const hoverItem = d3.select(`path.${d}`);
    if(!hoverItem.node().classList.contains("clicked")){
      hoverItem.classed("selected", false);
    }
  });
  dispatch.on("clicked.map", function(d){
    d = d == 'New Hanover' ? 'New-Hanover' : d;
    const currentItem = d3.select(`path.${d}`);
    if(currentItem.node().classList.toggle("clicked")){
      currentItem.classed("selected", true);
    } else {
      currentItem.classed("selected", false);
    }
  });



  return svgChild;
}
)
    },
    {
      name: "legendContent",
      inputs: ["svg"],
      value: (function(svg){return(
svg`<g class = cells><g id="legend-zero" class="cell" transform="translate(0,15)"><rect class="swatch" height="20" width="20" transform="translate(2,0)" fill="#67a28c" stroke="#fff" style=" stroke-width: 1; "></rect><text id="legend-text-zero" class="legend-label" fill="#000" transform="translate(27, 14)">Nonmetro (54 counties)</text></g></g>`
)})
    },
    {
      name: "omb_metro_map_2015",
      value: (function(){return(
new Map([["ALAMANCE","metro"],["ALEXANDER","metro"],["ALLEGHANY","nonmetro"],["ANSON","nonmetro"],["ASHE","nonmetro"],["AVERY","nonmetro"],["BEAUFORT","nonmetro"],["BERTIE","nonmetro"],["BLADEN","nonmetro"],["BRUNSWICK","metro"],["BUNCOMBE","metro"],["BURKE","metro"],["CABARRUS","metro"],["CALDWELL","metro"],["CAMDEN","nonmetro"],["CARTERET","nonmetro"],["CASWELL","nonmetro"],["CATAWBA","metro"],["CHATHAM","metro"],["CHEROKEE","nonmetro"],["CHOWAN","nonmetro"],["CLAY","nonmetro"],["CLEVELAND","nonmetro"],["COLUMBUS","nonmetro"],["CRAVEN","metro"],["CUMBERLAND","metro"],["CURRITUCK","metro"],["DARE","nonmetro"],["DAVIDSON","metro"],["DAVIE","metro"],["DUPLIN","nonmetro"],["DURHAM","metro"],["EDGECOMBE","metro"],["FORSYTH","metro"],["FRANKLIN","metro"],["GASTON","metro"],["GATES","metro"],["GRAHAM","nonmetro"],["GRANVILLE","nonmetro"],["GREENE","nonmetro"],["GUILFORD","metro"],["HALIFAX","nonmetro"],["HARNETT","nonmetro"],["HAYWOOD","metro"],["HENDERSON","metro"],["HERTFORD","nonmetro"],["HOKE","metro"],["HYDE","nonmetro"],["IREDELL","metro"],["JACKSON","nonmetro"],["JOHNSTON","metro"],["JONES","metro"],["LEE","nonmetro"],["LENOIR","nonmetro"],["LINCOLN","metro"],["MCDOWELL","nonmetro"],["MACON","nonmetro"],["MADISON","metro"],["MARTIN","nonmetro"],["MECKLENBURG","metro"],["MITCHELL","nonmetro"],["MONTGOMERY","nonmetro"],["MOORE","nonmetro"],["NASH","metro"],["NEW HANOVER","metro"],["NORTHAMPTON","nonmetro"],["ONSLOW","metro"],["ORANGE","metro"],["PAMLICO","metro"],["PASQUOTANK","nonmetro"],["PENDER","metro"],["PERQUIMANS","nonmetro"],["PERSON","metro"],["PITT","metro"],["POLK","nonmetro"],["RANDOLPH","metro"],["RICHMOND","nonmetro"],["ROBESON","nonmetro"],["ROCKINGHAM","metro"],["ROWAN","metro"],["RUTHERFORD","nonmetro"],["SAMPSON","nonmetro"],["SCOTLAND","nonmetro"],["STANLY","nonmetro"],["STOKES","metro"],["SURRY","nonmetro"],["SWAIN","nonmetro"],["TRANSYLVANIA","nonmetro"],["TYRRELL","nonmetro"],["UNION","metro"],["VANCE","nonmetro"],["WAKE","metro"],["WARREN","nonmetro"],["WASHINGTON","nonmetro"],["WATAUGA","nonmetro"],["WAYNE","metro"],["WILKES","nonmetro"],["WILSON","nonmetro"],["YADKIN","metro"],["YANCEY","nonmetro"]])
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, getValue, format, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range", title, description, submit, format,
    attributes: {min, max, step, value},
    getValue
  });
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, format, submit, options} = config;
  if (!form) form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 14px sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 12px; font-style: italic;">${description}</div>`);
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = format ? format(value) : value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "bf11568d582ecb74@903",
  modules: [m0,m1]
};

export default notebook;
