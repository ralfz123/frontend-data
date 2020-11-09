// Thanks to Rowin Ruizendaal (https://vizhub.com/RowinRuizendaal/a5b317fd87454217b99812661a296022) for the projection
import d3 from 'd3';
import topojson from 'topojson';
import nlData from '/nltopo.js';

const dummydata = {
  latitude: '52.0039482',
  longitude: '4.4426398'
}

console.log(dummydata.latitude)

nlData().then((data) => {
  const path = d3.geoPath();
  const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);
  
  const width = 975;
	const height = 610;

	const svg = d3.select("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset);
	
  
  const g = svg.append('g');

  const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
  const pathGenerator = path.projection(projection);

 const gemeentes = g
    .append('g')
    .attr('fill', '#444')
    .attr('cursor', 'pointer')
    .selectAll('path')
    .data(topojson.feature(data, data.objects.gemeente_2020).features)
    .join('path')
    .on('click', clicked)
    .attr('d', path)



  gemeentes.append('g')
  	.attr('transform', ({ longitude, latitude }) => `translate(${projection([longitude, latitude]).join(",")})`)
  	.append('circle')
  	.attr('r', 2)
  
  console.log(gemeentes)

  svg.call(zoom);

  function reset() {
    gemeentes.transition().style('fill', null);
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    gemeentes.transition().style('fill', null);
    d3.select(this).transition().style('fill', 'red');
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
  }

  function zoomed(event) {
    const { transform } = event;
    g.attr('transform', transform);
    g.attr('stroke-width', 1 / transform.k);
  }
});