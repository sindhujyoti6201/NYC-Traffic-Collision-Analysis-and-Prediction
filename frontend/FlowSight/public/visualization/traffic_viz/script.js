// script.js
(async function() {
  // 1. Load data
  const [traffic_json, zipGeo] = await Promise.all([
    fetch(`http://localhost:5002/api/traffic?days=450&limit=35000`).then(
      res => res.json()),
    fetch("../nyc-zip-code-tabulation-areas-polygons.geojson").then(r => r.json())
  ]);

  const traffic = traffic_json.data

  // 2. Helpers
  const parsePolyline = d =>
    d.coordinates.trim().split(" ").map(pt => {
      const [lat, lon] = pt.split(",").map(Number);
      return [lon, lat]; // swap
    });

  function computeClusters(daily) {
    const roll = d3.rollup(
      daily,
      grp => {
        return {
          avgSpeed: d3.mean(grp, d => d.speed_mph),
          street: grp[0].street
        };
      },
      d => JSON.stringify(
        parsePolyline(d).map(([lon, lat]) =>
          [Math.round(lon * 1e4) / 1e4, Math.round(lat * 1e4) / 1e4]
        )
      )
    );
    return Array.from(roll, ([key, val]) => ({
      coords: JSON.parse(key),
      avgSpeed: val.avgSpeed,
      street: val.street
    }));
  }

  // 3. Build tooltip once
  const tip = d3.select("#tooltip");

  // 4. Render function
  function render(dateStr) {
    const selectedDay = dateStr; // "YYYY-MM-DD"
    const daily = traffic.filter(d => d.timestamp.slice(0,10) === selectedDay);
    const clusters = computeClusters(daily);

    const width = 1100, height = 800;
    const projection = d3.geoMercator().fitSize([width, height], zipGeo);
    const path = d3.geoPath(projection);

    const speeds = daily.map(d => d.speed_mph);
    const color = d3.scaleSequential()
      .domain([d3.max(speeds), d3.min(speeds)])
      .interpolator(d3.interpolateRdYlGn);

    // clear & create SVG
    d3.select("#vis").selectAll("*").remove();
    const svg = d3.select("#vis")
      .append("svg")
        .attr("width", width)
        .attr("height", height);

    // borough groups
    const boroughs = Array.from(
      d3.group(zipGeo.features, f => f.properties.borough),
      ([borough, feats]) => ({ borough, collection: { type: "FeatureCollection", features: feats } })
    );

    // 1) Borough boundaries
    svg.append("g")
      .selectAll("path.borough")
      .data(boroughs)
      .join("path")
        .attr("class", "borough-boundary")
        .attr("d", d => path(d.collection))
        .attr("fill", "none")
        .attr("stroke", "#444")
        .attr("stroke-width", 2);

    // 2) Neighborhoods
    svg.append("g")
      .selectAll("path.neighborhood")
      .data(zipGeo.features)
      .join("path")
        .attr("class", "neighborhood")
        .attr("d", path)
        .attr("fill", "#eee")
        .attr("stroke", "#999");

    // borough labels
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

    // 3) Points with tooltip
    const pts = clusters.flatMap(d =>
      d.coords.map(pt => ({ pt, avgSpeed: d.avgSpeed, street: d.street }))
    );
    svg.append("g")
      .selectAll("circle")
      .data(pts)
      .join("circle")
        .attr("cx", d => projection(d.pt)[0])
        .attr("cy", d => projection(d.pt)[1])
        .attr("r", 4)
        .attr("fill", d => color(d.avgSpeed))
        .attr("opacity", 0.85)
        .on("mouseover", (event, d) => {
          tip.text(d.street).style("opacity", 1);
        })
        .on("mousemove", event => {
          tip.style("left", (event.pageX + 10) + "px")
             .style("top",  (event.pageY + 10) + "px");
        })
        .on("mouseout", () => {
          tip.style("opacity", 0);
        });
  }

  // 5. Wire up date picker
  const dp = document.getElementById("datePicker");
  dp.addEventListener("change", () => render(dp.value));
  // initial render
  render(dp.value);
})();
