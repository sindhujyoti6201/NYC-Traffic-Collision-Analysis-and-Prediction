// script.js
(async function() {
  const zipGeo = await fetch("../nyc-zip-code-tabulation-areas-polygons.geojson").then(r => r.json());

  const parsePolyline = d =>
    d.coordinates.trim().split(" ").map(pt => {
      const [lat, lon] = pt.split(",").map(Number);
      return [lon, lat];
    });

  function computeClusters(daily) {
    const roll = d3.rollup(
      daily,
      grp => ({
        avgSpeed: d3.mean(grp, d => d.speed_mph),
        street: grp[0].street
      }),
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

  const tip = d3.select("#tooltip");

  async function render(dateStr) {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    const utcSelected = Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const elapsedDays = Math.floor((utcToday - utcSelected) / (1000 * 60 * 60 * 24));

    const traffic_json = await fetch(`http://localhost:5002/api/traffic?days=${elapsedDays}&limit=35000`)
      .then(res => res.json());
    const traffic = traffic_json.data || [];
    // const daily = traffic.filter(d => d.timestamp && d.timestamp.startsWith(dateStr));
    const daily = traffic;
    if (!daily.length) {
      d3.select("#vis").selectAll("*").remove();
      return;
    }

    const clusters = computeClusters(daily);
    const width = 1100, height = 800;
    const projection = d3.geoMercator().fitSize([width, height], zipGeo);
    const path = d3.geoPath(projection);

    const speeds = daily.map(d => d.speed_mph);
    const color = d3.scaleSequential()
      .domain([d3.max(speeds), d3.min(speeds)])
      .interpolator(d3.interpolateRdYlGn);

    d3.select("#vis").selectAll("*").remove();
    const svg = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height);

    const boroughs = Array.from(
      d3.group(zipGeo.features, f => f.properties.borough),
      ([borough, feats]) => ({ borough, collection: { type: "FeatureCollection", features: feats } })
    );

    svg.append("g").selectAll("path.borough")
      .data(boroughs).join("path")
      .attr("d", d => path(d.collection))
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("stroke-width", 2);

    svg.append("g").selectAll("path.neighborhood")
      .data(zipGeo.features).join("path")
      .attr("d", path)
      .attr("fill", "#eee")
      .attr("stroke", "#999");

    svg.append("g").selectAll("text.borough-label")
      .data(boroughs).join("text")
      .attr("x", d => projection(d3.geoCentroid(d.collection))[0])
      .attr("y", d => projection(d3.geoCentroid(d.collection))[1])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(d => d.borough);

    const pts = clusters.flatMap(d =>
      d.coords.map(pt => ({ pt, avgSpeed: d.avgSpeed, street: d.street }))
    );
    svg.append("g").selectAll("circle")
      .data(pts).join("circle")
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

  const dp = document.getElementById("datePicker");
  dp.addEventListener("change", () => render(dp.value));
  render(dp.value);
})();
