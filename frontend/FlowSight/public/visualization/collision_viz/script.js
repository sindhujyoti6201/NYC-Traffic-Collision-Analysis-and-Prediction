// script.js
(async () => {
  // 1) Load GeoJSON & collision data
  const [collisionData_json, zipGeo] = await Promise.all([
    fetch(`http://localhost:5002/api/collisions?days=450&limit=35000`).then(
      res => res.json()),
    fetch("../nyc-zip-code-tabulation-areas-polygons.geojson").then(r => r.json())
    // .then(data => {
    //   console.log("Fetched geo data:", data);
    //   return data;
    // })
  ]);

  const collisionData = collisionData_json.data

  // 2) Tooltip & date picker
  const tip = d3.select("#tooltip");
  const dp  = document.getElementById("datePicker");
  const today = new Date().toISOString().slice(0, 10);
  dp.value = today;
  dp.addEventListener("change", () => render(dp.value));

  // 3) Render function
  function render(dateStr) {
    const width = 1100, height = 800;

    // Projection & path
    const projection = d3.geoMercator().fitSize([width, height], zipGeo);
    const path = d3.geoPath(projection);

    // Clear & create SVG
    d3.select("#vis").selectAll("*").remove();
    const svg = d3.select("#vis")
      .append("svg")
        .attr("width", width)
        .attr("height", height);

    // console.log("zipGeo:", zipGeo);
    // console.log("zipGeo.features isArray?", Array.isArray(zipGeo?.features));

    // Map: borough boundaries
    const boroughs = Array.from(
      d3.group(zipGeo.features, f => f.properties.borough),
      ([borough, feats]) => ({
        borough,
        collection: { type: "FeatureCollection", features: feats }
      })
    );

    svg.append("g")
      .selectAll("path.borough")
      .data(boroughs)
      .join("path")
        .attr("class", "borough-boundary")
        .attr("d", d => path(d.collection))
        .attr("fill", "none")
        .attr("stroke", "#444")
        .attr("stroke-width", 2);

    // Neighborhoods
    svg.append("g")
      .selectAll("path.neighborhood")
      .data(zipGeo.features)
      .join("path")
        .attr("class", "neighborhood")
        .attr("d", path)
        .attr("fill", "#eee")
        .attr("stroke", "#999");

    // Borough labels
    svg.append("g")
      .selectAll("text.borough-label")
      .data(boroughs)
      .join("text")
        .attr("class", "borough-label")
        .attr("x", d => projection(d3.geoCentroid(d.collection))[0])
        .attr("y", d => projection(d3.geoCentroid(d.collection))[1])
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text(d => d.borough);

    // Filter collisions by date
    const daily = collisionData.filter(d => d.timestamp.slice(0, 10) === dateStr);

    // Draw collision points
    svg.append("g")
      .attr("class", "collisions")
      .selectAll("circle")
      .data(daily)
      .join("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", d => 3 + Math.sqrt(+d.injured + (+d.killed) * 3) * 2)
        .attr("fill", d => d.killed === "0" ? "orange" : "red")
        .attr("fill-opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        tip.html(`
          Time: ${d.timestamp.split("T")[1]}<br>
          Injured: ${d.injured}<br>
          Killed: ${d.killed}
        `).style("opacity", 1);
      })
      .on("mousemove", event => {
        tip
          .style("left",  (event.pageX + 10) + "px")
          .style("top",   (event.pageY + 10) + "px");
      })
      .on("mouseout", () => {
        tip.style("opacity", 0);
      });
  }

  // 4) Initial draw
  render(dp.value);
})();