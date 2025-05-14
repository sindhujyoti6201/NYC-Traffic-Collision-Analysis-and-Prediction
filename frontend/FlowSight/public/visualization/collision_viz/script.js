// script.js
(async () => {
    const zipGeo = await fetch("../nyc-zip-code-tabulation-areas-polygons.geojson").then(r => r.json());
    const tip = d3.select("#tooltip");
    const dp = document.getElementById("datePicker");
  
    async function render(dateStr) {
      const selectedDate = new Date(dateStr);
      const today = new Date();
      const utcSelected = Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const elapsedDays = Math.floor((utcToday - utcSelected) / (1000 * 60 * 60 * 24));
  
      const collisionData_json = await fetch(`http://localhost:5002/api/collisions?days=${elapsedDays}&limit=35000`)
        .then(res => res.json());
      const collisionData = collisionData_json.data || [];
  
      const daily = collisionData.filter(d => {
        if (!d.timestamp) return false;
        const dDate = new Date(d.timestamp);
        return (
          dDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
          dDate.getUTCMonth() === selectedDate.getUTCMonth() &&
          dDate.getUTCDate() === selectedDate.getUTCDate()
        );
      });
  
      const width = 1100, height = 800;
      const projection = d3.geoMercator().fitSize([width, height], zipGeo);
      const path = d3.geoPath(projection);
  
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
  
      svg.append("g")
        .attr("class", "collisions")
        .selectAll("circle")
        .data(daily).join("circle")
        .attr("cx", d => projection([+d.lon, +d.lat])[0])
        .attr("cy", d => projection([+d.lon, +d.lat])[1])
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
          tip.style("left", (event.pageX + 10) + "px")
             .style("top",  (event.pageY + 10) + "px");
        })
        .on("mouseout", () => {
          tip.style("opacity", 0);
        });
    }
  
    dp.addEventListener("change", () => render(dp.value));
    render(dp.value);
  })();
  