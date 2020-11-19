// This file contains all code that is used for the dataviz, except the code for the map projection ('../projection')

// ------------------------------- DATA FETCH below ----------------------------------------------
const endpointOne = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataDay.json'; // Data from a Day - 08:00h
const endpointTwo = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataEve.json'; // Data from a Eve - 20:00h

// const statusAvailable = 'available'; // Available Charging points
// const statusCharging = 'charging'; // Busy Charging points

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
			d3.select(this).transition().style('fill', 'red');
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
	
		dots(combinedData);
		// console.log("combinedData:", combinedData)
		// dots(dataCharging)
		
	});

	// ------------------------------- D3 DATA PLOTS below ----------------------------------------------

	// Formatter for map plots
	function dots (realData) {
		const g = d3.select('g')
		const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
	
		g.selectAll('circle')
		.data(realData[0])
		.enter()
		.append('circle')
		.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
		.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
		.attr('r', '.2px')
		.attr('class', 'circle')
		.attr('fill', 'blue')
		// Assign classes to datapoints due charging availability
		// .attr('class', function filter(d) { 
		// 	if ((Number(d.status.available) > 0) && (Number(d.status.charging) >= 0) ) {
		// 		return 'availableValue'
		// 	} 
		// 	else {
		// 		return 'chargingValue'
		// 	} 
		// })

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
		updatingMapAvailable(realData[0])
	});
	
	// Filteroption "Bezet"
	d3.select('input#busy')
	.on("click", function clicking() {
		console.log('"Busy" clicked')
		updatingMapBusy(realData[0])
	});

	// // Filteroption "Overdag"
	// d3.select('input#day')
	// .on("click", function clicking() {
	// 	console.log('"Day" clicked')
	// 	handleClickTimeOfDay("day") // Day data
	// });

	// // Filteroption "'s Avonds"
	// d3.select('input#eve')
	// .on("click", function clicking() {
	// 	console.log('"Eve" clicked')
	// 	handleClickTimeOfDay("eve") // Eve data switch
	// 	});

	// Filter data to show available chargingpoints
	function updatingMapAvailable(data) {
	const availableValues = data.filter(function(d){ return (Number(d.status.available) > 0) && (Number(d.status.charging) >= 0)})
	console.log("Beschikbaar:", availableValues)
	reassignDots(availableValues, "rgba(34, 219, 13, 0.349)", "rgb(34, 219, 13)")
	}
	
	// Filter data to show busy chargingpoints
	function updatingMapBusy(data) {
	const chargingValues = data.filter(function(d){ return Number(d.status.charging) > 0 && Number(d.status.available >= 0)})
	console.log("Bezet:", chargingValues)
	reassignDots(chargingValues, "rgba(201, 14, 14, 0.753)", "rgb(179, 0, 0)")
	}

	// Filter option Time Of Day - On click choose dataset to determine which time of day it is
	// function handleClickTimeOfDay(timeOfDay) {
	// 	// const endpoint = timeOfDay === 'day' ? endpointOne : endpointTwo;
	// 	// const plots = timeOfDay === 'day' ? realData[0] : realData[1];

	// 	if (timeOfDay == 'day') {
	// 		console.log("This is DAY", realData[0])
	// 		dots(realData[0]);
	// 	} else {
	// 		console.log("This is EVE", realData[1])
	// 		dots(realData[1]);
	// 	}
		
	// 	// When multiple clicks on button, then: d3.v6.min.js:2 Uncaught TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
	// }


}}
// ------------------------------- Rest functions below ----------------------------------------------



// handleClick('day');

// const getColumns = (dataset, columns) => {
// 	return dataset.map((value) => {
// 		const data = {};

// 		for (let i = 0; i < columns.length; i++) {
// 			data[columns[i]] = value[columns[i]];
// 		}
// 		return data;
// 	});
// };

// getColumns(fetchingData(endpointOne), 'point');

// Combining 2 datasets in one Object
// async function combineData() {
// 	const dayData = await fetchingData(endpointOne)
// 	const nightData = await fetchingData(endpointTwo)

// 	// Do something to combine the data
// 	const combined = {dayData, nightData}

// 	// Return the combinedData
// 	return combined
// }

// Checks if the unique key is present - Sam was helping me
// const key = 'maximumvehicleheight';
// let missing = false;

// for (let i of dataAll) {
// 	if (!i[key]) {
// 		missing = true;
// 	}
// }
// console.log(key, "is missing:", missing);

// Filter and transform data - Make a new Array based on an unique key and checks if value is correct
// function newDataArray(dataArray, key) {
// 	return dataArray.map((item) => {
// 		item[key] = Number(item[key]); // Makes all items from unique key a NUMBER type.

// 		if (item[key] <= 0) {
// 			// When item is lower than or equal to 0, return null
// 			// console.log('Negative or zero value');
// 			return null;
// 		} else {
// 			return item[key];
// 		}
// 	});
// }
