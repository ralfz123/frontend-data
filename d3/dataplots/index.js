// This file contains all code that is used for the dataviz, except the code for the map projection ('../projection')
// import {d3, json} from 'd3';
// import topojson from 'topojson';
// import nlData from '/nltopo.js';

const endpointOne = '../data/dataDay.json'; // Data from a Day - 08:00h
const endpointTwo = '../data/dataEve.json'; // Data from a Eve - 20:00h

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
	console.log('Real data:', combinedData);
	// }
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

	const dummyData = [
		{
			areamanagerid: '988',
			areaid: '988_STAT',
			paymentmethod: 'pin',
			pricePerHour: '0.00',
			areadesc: 'Parkeergarage Stationsplein (Weert)',
			location: {
				longitude: '5.705462804',
				latitude: '51.249263663',
			},
		},
		{
			areamanagerid: '268',
			areaid: '268_PRNOO',
			paymentmethod: 'Maestro',
			pricePerHour: '1.05',
			areadesc: 'Garage Keizer Karel (Nijmegen)',
			location: {
				longitude: '5.857931044',
				latitude: '51.842372259',
			},
		},
	];

	console.log('Dummy data:', dummyData);

	nlData().then((data) => {
		const path = d3.geoPath();
		// const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed); // Zoom function

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

		// svg.call(zoom);

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
		console.log("combinedData:", combinedData)
	});

	// ------------------------------- D3 DATA PLOTS below ----------------------------------------------

	// Formatter for map plots
	

	function dots (realData) {
		const g = d3.select('svg')
		.append('g')
	   const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
	// console.log('real data', realData)
	// console.log(realData[0])
	
	g.selectAll('circle')
		.data(realData[0])
		.enter()
		.append('circle')
		.attr('class', 'circles')
		.attr('cx', function (d) {
			console.log(d)
			return projection([d.point.lng, d.point.lat])[0];
		})
		.attr('cy', function (d) {
			return projection([d.point.lng, d.point.lat])[1];
		})
		.attr('r', '4px')
		.attr('fill', '#e94560');
	// .on('mouseover', handleMouseOver)
	// .on('mousemove', mouseMove)
	// .on('mouseout', handleMouseOut)
	// .on('click', showDetail);
	}
}
// ------------------------------- Rest functions below ----------------------------------------------

// Filter option dataviz - On click fetch data to determine which time of day it is
// function handleClick(timeOfDay) {
// 	const endpoint = timeOfDay === 'day' ? endpointOne : endpointTwo;

// 	fetchingData(endpoint).then((res) => {
// 		console.log(`It's currently ${timeOfDay} time`)
// 		console.log(res.data)
// 	});
// }

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
