// URL: https://beta.observablehq.com/@gallowayevan/select-a-county-to-highlight
// Title: Click a county to highlight 
// Author: Evan Galloway (@gallowayevan)
// Version: 335
// Runtime version: 1

const m0 = {
  id: "02e79dfe69a3eb3d@335",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Click a county to highlight 
Play with the different color variables and then download as an image (png) or svg (e.g., for Illustrator)`
)})
    },
    {
      name: "viewof map",
      inputs: ["d3","styles","svg","topojson","nc"],
      value: (function(d3,styles,svg,topojson,nc)
{
  
  
  if(this){
   d3.select(this).select('.mapStyles').html(styles)
    
    return this;
  } else {
    
  const path = d3.geoPath();
  const newSvg = d3.select(svg`<svg width=1920 height=800 class='map'></svg>`);
  newSvg.property("value", newSvg.node());
  
  newSvg.append('style').html(styles).attr('class', 'mapStyles');
  
        newSvg.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("class", 'background');

 const counties = newSvg.append("g").attr("class", "counties")
    .selectAll(".counties")
    .data(topojson.feature(nc, nc.objects.ncmap).features);
  
    
    counties.enter().append("path")
    .attr("d", path)
    .on("click", function(d){  
    this.classList.toggle('selected');
      newSvg.dispatch("input");
  })
    .append("title")
      .text('counties');
  
  counties.enter().append('text')
    .text(d=>d.properties.county)
    .attr('transform',function(d){
    const centroid = path.centroid(d);
          return `translate(${centroid[0]},${centroid[1]})`
  })
    .style('pointer-events', 'none')
  .attr('font-size',8)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'sans-serif')
  .attr('class', 'county-names')
  
  

  return newSvg.node();
    
  }
  

    
}
)
    },
    {
      name: "map",
      inputs: ["Generators","viewof map"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selectedColor",
      inputs: ["color"],
      value: (function(color){return(
color({
  value: "#ffa477",
  title: "Color of Selected Counties"
})
)})
    },
    {
      name: "selectedColor",
      inputs: ["Generators","viewof selectedColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof nonSelectedColor",
      inputs: ["color"],
      value: (function(color){return(
color({
  value: "#b7dbff",
  title: "Color of Counties That Are Not Selected"
})
)})
    },
    {
      name: "nonSelectedColor",
      inputs: ["Generators","viewof nonSelectedColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof stroke",
      inputs: ["color"],
      value: (function(color){return(
color({
  value: "#ececec",
  title: "Color of Stroke (lines separating counties)"
})
)})
    },
    {
      name: "stroke",
      inputs: ["Generators","viewof stroke"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof showNames",
      inputs: ["checkbox"],
      value: (function(checkbox){return(
checkbox({
  description: "Click to show or hide county names.",
  options: [{ value: "toggle", label: "Show county names." }],
  value: "toggle"
})
)})
    },
    {
      name: "showNames",
      inputs: ["Generators","viewof showNames"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof fontColor",
      inputs: ["color"],
      value: (function(color){return(
color({
  value: "#333333",
  title: "Color of County Names"
})
)})
    },
    {
      name: "fontColor",
      inputs: ["Generators","viewof fontColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof backgroundColor",
      inputs: ["color"],
      value: (function(color){return(
color({
  value: "#ffffff",
  title: "Color of Background"
})
)})
    },
    {
      name: "backgroundColor",
      inputs: ["Generators","viewof backgroundColor"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["DOM","rasterize","map"],
      name: "downloadPNG",
      value: (async function(DOM,rasterize,map){return(
DOM.download(await rasterize(map), "nc_map.png", "Download as PNG")
)})
    },
    {
      inputs: ["DOM","serialize","map"],
      name: "downloadSVG",
      value: (function(DOM,serialize,map){return(
DOM.download(serialize(map), "nc_map.svg", "Download as SVG")
)})
    },
    {
      name: "styles",
      inputs: ["selectedColor","nonSelectedColor","stroke","showNames","fontColor","backgroundColor"],
      value: (function(selectedColor,nonSelectedColor,stroke,showNames,fontColor,backgroundColor){return(
`
.selected {
fill: ${selectedColor};
}
path {
fill: ${nonSelectedColor};
}

g.counties path {
stroke: ${stroke};
stroke-width: 1px;
}

.county-names {
visibility: ${showNames == 'toggle' ? 'visible' : 'hidden'};
fill: ${fontColor};
}

.background {
fill: ${backgroundColor}
}
`
)})
    },
    {
      name: "nc",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://cdn.rawgit.com/gallowayevan/376a41566ce8e6f9d344171db4b9e952/raw/29b014b584a9a062200f66cde77541dc291c821e/ncmap_pop_density_topojson.json")
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3@5')
)})
    },
    {
      name: "topojson",
      inputs: ["require"],
      value: (function(require){return(
require("topojson-client@3")
)})
    },
    {
      from: "@mbostock/saving-svg",
      name: "serialize",
      remote: "serialize"
    },
    {
      from: "@mbostock/saving-svg",
      name: "rasterize",
      remote: "rasterize"
    },
    {
      from: "@jashkenas/inputs",
      name: "color",
      remote: "color"
    },
    {
      from: "@jashkenas/inputs",
      name: "checkbox",
      remote: "checkbox"
    }
  ]
};

const m1 = {
  id: "@mbostock/saving-svg",
  variables: [
    {
      name: "serialize",
      value: (function()
{
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";
  return function serialize(svg) {
    const scale = 2;
    svg = svg.cloneNode(true);
    svg.setAttributeNS(xmlns, "xmlns", svgns);
    svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
    // svt.setAttribute('width')
    // svg.querySelector('.counties').setAttribute("transform", `scale(${scale})`);
    // svg.querySelector('rect').setAttribute("transform", `scale(${scale})`);
    const serializer = new window.XMLSerializer;
    const string = serializer.serializeToString(svg);
    return new Blob([string], {type: "image/svg+xml"});
  };
}
)
    },
    {
      name: "rasterize",
      inputs: ["DOM","serialize"],
      value: (function(DOM,serialize){return(
function rasterize(svg) {
  let resolve, reject;
  const promise = new Promise((y, n) => (resolve = y, reject = n));
  const image = new Image;
  image.onerror = reject;
  image.onload = () => {
    const rect = svg.getBoundingClientRect();
    const context = DOM.context2d(rect.width, rect.height);
    context.drawImage(image, 0, 0, rect.width, rect.height);
    context.canvas.toBlob(resolve);
  };
  image.src = URL.createObjectURL(serialize(svg));
  return promise;
}
)})
    }
  ]
};

const m2 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "color",
      inputs: ["input"],
      value: (function(input){return(
function color(config = {}) {
  let {value, title, description, submit} = config;
  if (typeof config == "string") value = config;
  if (value == null) value = '#000000';
  const form = input({
    type: "color", title, description, submit,
    attributes: {value}
  });
  if (title || description) form.input.style.margin = "5px 0";
  return form;
}
)})
    },
    {
      name: "checkbox",
      inputs: ["input","html"],
      value: (function(input,html){return(
function checkbox(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "checkbox",
    title,
    description,
    submit,
    getValue: input => {
      if (input.length)
        return Array.prototype.filter
          .call(input, i => i.checked)
          .map(i => i.value);
      return input.checked ? input.value : false;
    },
    form: html`
      <form>
        ${options.map(
          ({ value, label }) => `
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           <input type=checkbox name=input value="${value || "on"}" ${
            (formValue || []).indexOf(value) > -1 ? "checked" : ""
          } style="vertical-align: baseline;" />
           ${label}
          </label>
        `
        )}
      </form>
    `
  });
  form.output.remove();
  return form;
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
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
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
  id: "02e79dfe69a3eb3d@335",
  modules: [m0,m1,m2]
};

export default notebook;
