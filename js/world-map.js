/*==========================================================
TIME WELL KEPT
WORLD MAP
==========================================================*/

let tooltip;
let tooltipX = 0;
let tooltipY = 0;
let mouseX = 0;
let mouseY = 0;
let tooltipAnimation = null;

countrySummary = {};
async function renderWorldMap(watches) {
    

    const container = document.getElementById("world-map");

    if (!container) return;

    container.innerHTML = "";

    const width = container.clientWidth || 1100;
    const height = width * 0.55;

    const geojson = await d3.json("data/world.geojson");

    const projection = d3.geoNaturalEarth1()
        .fitSize([width, height], geojson);

    const path = d3.geoPath(projection);

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

  const ownedCountries = new Set(
    watches
        .map(w => w.identity.countryCode)
        .filter(Boolean)
);


tooltip = document.getElementById("map-tooltip");

watches.forEach(w => {

    const code = w.identity.countryCode;
    const country =
    w.identity.countryOfOrigin ||
    w.identity.country ||
    "";
    const brand = w.identity.brand || "Unknown";

    if (!countrySummary[code]) {

        countrySummary[code] = {
            country,
            total: 0,
            brands: {}
        };

    }

    countrySummary[code].total++;

    countrySummary[code].brands[brand] =
        (countrySummary[code].brands[brand] || 0) + 1;

});

console.log("Owned countries:", [...ownedCountries]);

console.log(geojson.features[0].properties);
console.log(geojson.features[0]);
svg.append("g")
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("id", d => d.id)
    .attr("d", path)
    .attr("class", "country")
    .attr("fill", d => ownedCountries.has(d.id) ? "#B08D57" : "#2F2F2F")
    .attr("stroke", "#555")
    .attr("stroke-width", 0.5)

.on("mouseenter", function(event, d){

    const code =
        d.properties.ISO_A2 ||
        d.properties.iso_a2 ||
        d.id;

    const summary = countrySummary[code];

    if(!summary) return;

    const brands = Object.entries(summary.brands)
        .sort((a,b)=>b[1]-a[1]);

    tooltip.innerHTML = `
        <div class="tooltip-title">
            ${summary.country}
        </div>

        <div class="tooltip-count">
           ${summary.total} WATCH${summary.total > 1 ? "ES REPRESENTED" : " REPRESENTED"}
        </div>

        ${
            brands.map(([brand,count])=>`
                <div class="tooltip-row">
                    <span class="tooltip-brand">${brand}</span>
                    <span class="tooltip-number">${count}</span>
                </div>
            `).join("")
        }
    `;

    tooltip.classList.add("visible");

    tooltipX = event.clientX;
    tooltipY = event.clientY;
    mouseX = event.clientX;
    mouseY = event.clientY;

    d3.select(this)
        .transition()
        .duration(150)
        .attr("fill","#d4af6a")
        .attr("stroke","#d8c08d")
        .attr("stroke-width",1)
        .style("filter","drop-shadow(0 0 6px rgba(176,141,87,.45))");

})

.on("mousemove", function(event){

    mouseX = event.clientX;
    mouseY = event.clientY;

    if(tooltipAnimation) return;

    tooltipAnimation = requestAnimationFrame(moveTooltip);

})

   .on("mouseleave", function(event,d){

    tooltip.classList.remove("visible");

    tooltipAnimation = null;

    const code =
        d.properties.ISO_A2 ||
        d.properties.iso_a2 ||
        d.id;

    d3.select(this)
        .transition()
        .duration(200)
        .attr(
            "fill",
            ownedCountries.has(code)
                ? "#b08d57"
                : "#2d2d2d"
        )
        .attr("stroke","#555")
        .attr("stroke-width",0.5)
        .style("filter","none");

});

}

function moveTooltip(){

    tooltipX += (mouseX - tooltipX) * 0.18;
    tooltipY += (mouseY - tooltipY) * 0.18;

    const tooltip = document.getElementById("map-tooltip");
    

    tooltip.style.left = tooltipX + "px";
    tooltip.style.top = tooltipY + "px";

    if(
        Math.abs(mouseX - tooltipX) < 0.5 &&
        Math.abs(mouseY - tooltipY) < 0.5
    ){

        tooltipAnimation = null;
        return;

    }

    tooltipAnimation = requestAnimationFrame(moveTooltip);

}