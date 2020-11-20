// ------------------------------- DATA FETCH below ----------------------------------------------
const endpointOne = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataDay.json'; // Data from a Day - 08:00h
const endpointTwo = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataEve.json'; // Data from a Eve - 20:00h

// Fetching data
// Receiving data using fetch()
const dataDay = fetch(endpointOne).then((response) => response.json()); // Parses JSON data
const dataEve = fetch(endpointTwo).then((response) => response.json()); // Parses JSON data

// Getting both datasets through an Promise.all (is solved when all promises above get resolved)
Promise.all([dataDay, dataEve]).then((response) => {
	let [dataset1, dataset2] = response;
	filteredDataset(dataset1, dataset2);
});

// Clean data - makes new array with needed data variables
function filteredDataset(dataDay, dataEve) {
	const cleanDataDay = dataDay.map((element) => {
		const object = {};
		object.point = element.point;
		object.status = element.status;

		return object;
	});

	const cleanDataEve = dataEve.map((element) => {
		const object = {};
		object.point = element.point;
		object.status = element.status;

		return object;
	});

	const combinedData = [cleanDataDay, cleanDataEve]; // Transforming the terminology to the normal word 'data'
	// console.log('Real data:', combinedData);

	// ------------------------------- D3 MAP below ----------------------------------------------
	// Thanks for help Rowin Ruizendaal (https://github.com/RowinRuizendaal/frontend-data)

	// Fetch map of The Netherlands via external source
	function nlData() {
		return fetch(
			'https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson'
		)
			.then((res) => res.json())
			.then((data) => {
				return data;
			});
	}

	nlData().then((data) => {
		const path = d3.geoPath();
		const zoom = d3.zoom().scaleExtent([1, 30]).on('zoom', zoomed); // Zoom function

		const width = 975;
		const height = 610;

		const svg = d3
			.select('svg')
			.attr('viewBox', [0, 0, width, height])
			.on('click', reset);

		const g = svg.append('g');

		const projection = d3
			.geoMercator()
			.scale(6000)
			.center([5.116667, 52.17]);
			// .center([52.206720, 5.154676]);
		const pathGenerator = path.projection(projection);

		const gemeentes = g
			.append('g')
			.attr('class', 'gemeentes')
			.attr('fill', '#444')
			.attr('cursor', 'pointer')
			.selectAll('path')
			.data(topojson.feature(data, data.objects.gemeente_2020).features)
			.join('path')
			.on('click', clicked)
			.attr('d', path);

		// gemeentes
		// 	.append('g')
		// 	.attr(
		// 		'transform',
		// 		({ lng, lat }) =>
		// 			`translate(${projection([lng, lat]).join(',')})`
		// 	)
		// 	.append('circle')
		// 	.attr('r', 3);

		// console.log("Gemeentes:", gemeentes);

		svg.call(zoom);

		function reset() {
			gemeentes.transition().style('fill', null);
			svg.transition()
				.duration(750)
				.call(
					d3.zoom.transform,
					d3.zoomIdentity,
					d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
				);
		}

		function clicked(event, d) {
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			event.stopPropagation();
			gemeentes.transition().style('fill', null);
			d3.select(this).transition().style('fill', 'rgb(107, 105, 105)');
			svg.transition()
				.duration(750)
				.call(
					zoom.transform,
					d3.zoomIdentity
						.translate(width / 2, height / 2)
						.scale(
							Math.min(
								8,
								0.9 /
									Math.max(
										(x1 - x0) / width,
										(y1 - y0) / height
									)
							)
						)
						.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
					d3.pointer(event, svg.node())
				);
		}

		// Not needing - Zoom function
		function zoomed(event) {
			const { transform } = event;
			g.attr('transform', transform);
			g.attr('stroke-width', 1 / transform.k);
		}
	
		dots(combinedData[0]);
		console.log("Default (first) input data = DAG:", combinedData[0])
		// console.log("combinedData:", combinedData)
	});

	// ------------------------------- D3 DATA PLOTS below ----------------------------------------------

	// Formatter for map plots
	function dots (dotData) {
		const g = d3.select('g')
		const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
	
		g.selectAll('circle')
		.data(dotData
		// 	, function(dayTime) {

		// 	let theDayTime = 'day';
		// 	if (theDayTime == 'day'){
		// 		console.log("Day clicked", combinedData[0])
		// 		 combinedData[0];
		// 	} else {
		// 		 combinedData[1];
		// 	}

		// 	let availability = 'available'
		// 	if (availability !== 'available') {
		// 		return combinedData[0].filter(function(d){ return Number(d.status.charging) > 0 && Number(d.status.available >= 0)})
				
		// 	}
		// }
		)
		.enter()
		.append('circle')
		.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
		.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
		.attr('r', '.2px')
		.attr('class', 'circle')
		.attr('fill', 'rgba(10,10,230,0.623)')
		.attr('stroke', 'rgb(10,10,235)')
				

	// Update pattern for the data plots after a clicked filterbutton
	function reassignDots(data, color, strokeColor) {
		const dots = g.selectAll('circle') 
						.data(data) // Assign new data to the dots

		dots
			.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
			.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
			.attr('fill', color)
			.attr('stroke', strokeColor)

		dots.enter()
			.append('circle')
			.attr('r', '.2px')
			.attr('fill', color)
			.attr('stroke', strokeColor)
			.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
			.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
					
		dots.exit()
			.remove()
		}
	
	// Filter buttons in markup
	const filterOptions = d3.select('.filter-option')
	
	// Filteroption "Beschikbaar"
	.select('input#available')
	.on("click", function clicking() {
		console.log('"Available" clicked')
		updatingMapAvailable(dotData)
	});
	
	// Filteroption "Bezet"
	d3.select('input#busy')
	.on("click", function clicking() {
		console.log('"Busy" clicked')
		updatingMapBusy(dotData)
	});

	// Filteroption "Overdag"
	d3.select('input#day')
	.on("click", function clicking() {
		console.log('"Day" clicked')
		handleClickTimeOfDay("day") // Day data
	});

	// Filteroption "'s Avonds"
	d3.select('input#eve')
	.on("click", function clicking() {
		console.log('"Eve" clicked')
		handleClickTimeOfDay("eve") // Eve data switch
		});

	// Filter data to show available chargingpoints
	function updatingMapAvailable(data) {
	const availableValues = data.filter(function(d){ return (Number(d.status.available) > 0) && (Number(d.status.charging) >= 0)})
	console.log("Beschikbaar:", availableValues)
	reassignDots(availableValues, "rgba(34, 219, 13, 0.349)", "rgb(34, 219, 13)")
	}

	// Filter option - Show available and busy chargingpoints
	function updatingMapBusy(data) {
	const chargingValues = data.filter(function(d){ return Number(d.status.charging) > 0 && Number(d.status.available >= 0)})
	console.log("Bezet:", chargingValues)
	reassignDots(chargingValues, "rgba(201, 14, 14, 0.541)", "rgb(179, 0, 0)")
	}

	// Filter option Time Of Day - On click choose dataset to determine which time of day it is
	function handleClickTimeOfDay(timeOfDay) {
		if (timeOfDay == 'day') {
			console.log("This is DAY", combinedData[0])
			dots(combinedData[0]);
		} else {
			console.log("This is EVE", combinedData[1])
			dots(combinedData[1]);
		}
	}


}}