// ------------------------------- DATA FETCHING below ----------------------------------------------
const endpointOne = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataDay.json'; // Data from a Day - 08:00h
const endpointTwo = 'https://raw.githubusercontent.com/ralfz123/frontend-data/main/d3/data/dataEve.json'; // Data from an Eve - 20:00h

// Fetching data - Receiving data using fetch()
const dataDay = fetch(endpointOne).then((response) => response.json()); // Parses JSON data
const dataEve = fetch(endpointTwo).then((response) => response.json()); // Parses JSON data

// ------------------------------- STATES below ----------------------------------------------
// Global variable
// let combinedData = []; 

// Global variable
let cleanCombinedData;

// Current dataset
// let selectedData = combinedData;

// Global variable - TIME OF THE DAY
let timeOfDay;

// Global variable - AVAILABILITY
// let availabilityState = 'available';

// ------------------------------- FUNCTIONS INVOKING (HOISTING) below ----------------------------------------------

// filteren van dataset();
// D3 map();
// D3 map dots plotten();

// ------------------------------- FUNCTIONS below ----------------------------------------------


// Getting both datasets through an Promise.all (is solved when all promises above get resolved)
Promise.all([dataDay, dataEve]).then((response) => {
	let [dataset1, dataset2] = response;
	// filteredDataset(dataset1, dataset2); // Cleans the data
	// plottingDots(combinedData[0]); // Assign the DAY data to the 'producing-dots' function
	// // selectedData = combinedData[0] // Set default value to global variable
	// console.log("Default data (DAY):", combinedData[0])
	
	cleanCombinedData = filteredDataset(dataset1, dataset2); 
	console.log('cleanCombinedData =', cleanCombinedData)
	// plottingDots(cleanCombinedData [0]); 
	// selectedData = cleanCombinedData [0];
	// console.log("Default data (DAY):", cleanCombinedData [0]);	
});

// Clean data - makes new array with needed data variables
function filteredDataset(dataDay, dataEve) {
	const cleanDataDay = dataDay.map((element) => {
		return {
			timeOfday: 'day',
			point: element.point,
			status: element.status,
		}
	});

	const cleanDataEve = dataEve.map((element) => {
		return {
			timeOfday: 'eve',
			point: element.point,
			status: element.status,
		}
	});

	// Push two cleaned arrays into one empty array (https://dzone.com/articles/ways-to-combine-arrays-in-javascript)
	// combinedData.push(cleanDataDay, cleanDataEve)
	return [cleanDataDay, cleanDataEve];
};

// ------------------------------- D3 MAP  ----------------------------------------------
// Thanks for help @Vuurvos1 & @RowinRuizendaal

// Fetch map of The Netherlands via external source
function mapHolland() {
	return fetch(
		'https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson'
	)
		.then((res) => res.json())
		.then((hollandMapData) => {
			console.log('MAP created!')
			return hollandMapData;
		});
};

// Drawing the map using D3 and the hollandMapData
mapHolland().then((hollandMapData) => {
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
		.scale(50000)
		.center([5.116667, 52.17]);
		
	const pathGenerator = path.projection(projection);

	const gemeentes = g
		.append('g')
		.attr('class', 'gemeentes')
		.attr('fill', '#444')
		.attr('cursor', 'grab')
		.selectAll('path')
		.data(topojson.feature(hollandMapData, hollandMapData.objects.gemeente_2020).features)
		.join('path')
		.on('click', clicked)
		.attr('d', path);

	svg.call(zoom);

	function reset() {
		gemeentes.transition().style('fill', null);
		svg.transition()
			.duration(750)
	}

	function clicked(event, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d);
		event.stopPropagation();
		gemeentes.transition().style('fill', null);
		// d3.select(this).transition().style('fill', 'rgb(107, 105, 105)');
		d3.select(this).transition().style('fill', 'rgb(150, 150, 150)');
		svg.transition()
			.duration(750)
	}

	// Not needing - Zoom function
	function zoomed(event) {
		const { transform } = event;
		g.attr('transform', transform);
		g.attr('stroke-width', 1 / transform.k);
	}
});

// ------------------------------- D3 * DATA PLOTS  ----------------------------------------------

// Formatter for map plots
function plottingDots (dotData) {
	const g = d3.select('g')
	const projection = d3.geoMercator().scale(50000).center([5.116667, 52.17]);

	g.selectAll('circle')
	.data(dotData)
	.enter()
	.append('circle')
	.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
	.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
	.attr('r', '1px')
	.attr('class', 'circle')
	.attr('fill', 'rgba(10,10,230,0.623)')
	.attr('stroke', 'rgb(4, 4, 218)')

	console.log('Mapdots are plotted!')
};			

// ------------------------------- D3 * REASSIGNING DATA PLOTS  --------------------------------------


// Update pattern for the data plots after a clicked filter button
function reassignDots(data, color, strokeColor) {
	const projection = d3.geoMercator().scale(50000).center([5.116667, 52.17]);
	const plottingDots = d3.selectAll('circle')
							.data(data) // Assign new data to the plottingDots

	plottingDots
		.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
		.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
		.attr('fill', color)
		.attr('stroke', strokeColor)

	plottingDots.enter()
		.append('circle')
		.attr('r', '1px')
		.attr('fill', color)
		.attr('stroke', strokeColor)
		.attr('cx', function (d) {return projection([d.point.lng, d.point.lat])[0];})
		.attr('cy', function (d) {return projection([d.point.lng, d.point.lat])[1];})
				
	plottingDots.exit()
		.remove()
};
	
// ------------------------------- FILTER BUTTONS  ----------------------------------------------

// Filter buttons in markup
d3.select('.filter-buttons')

// Filter button - "Overdag"
d3.select('input#day')
.on("click", function clicking() {
	console.log('"Day" clicked');
	handleClickTimeOfDay("day"); // Day data switch
});

// Filter button - "'s Avonds"
d3.select('input#eve')
.on("click", function clicking() {
	console.log('"Eve" clicked');
	handleClickTimeOfDay("eve"); // Eve data switch
});

// Filter button - "Beschikbaar"
d3.select('input#available')
.on("click", function clicking() {
	console.log("selectedTimeOfDayData (current data):", selectedTimeOfDayData);
	availabilityChecker("available");
	});

// Filter button - "Bezet"
d3.select('input#busy')
.on("click", function clicking() {
	console.log("selectedTimeOfDayData (current data):", selectedTimeOfDayData);
	availabilityChecker("busy");

});

// ------------------------------- UPDATING AVAILABILITY  ----------------------------------------------

// Filter data to show available charging points
function updatingMapAvailable(data) {
	plottingDots(data); // Reset to default (all chargingpoints)
	const availableValues = data.filter(function(d){ return (Number(d.status.available) > 0) && (Number(d.status.charging) >= 0)})
	console.log("Available (filtered):", availableValues);
	reassignDots(availableValues, "rgba(34, 219, 13, 0.349)", "rgb(34, 219, 13)");
};

// ------------------------------- UPDATING BUSY  ------------------------------------------------------

// Filter data to show busy charging points
function updatingMapBusy(data) {
	plottingDots(data); // Reset to default (all chargingpoints)
	const busyValues = data.filter(function(d){ return Number(d.status.charging) > 0 && Number(d.status.available >= 0)})
	console.log("Busy (filtered):", busyValues);
	reassignDots(busyValues, "rgba(201, 14, 14, 0.541)", "rgb(228, 3, 3)");
};

// ------------------------------- TIME OF DAY CHECKER  ----------------------------------------------

// Filter option Time Of Day - On click choose dataset to determine which time of day it is
function handleClickTimeOfDay(timeOfDay) {
	if (timeOfDay == 'day') {
		timeOfDay = 'day';
		console.log("DAY", cleanCombinedData[0]);
		selectedTimeOfDayData = cleanCombinedData[0];
		plottingDots(selectedTimeOfDayData);
	} else {
		timeOfDay = 'eve';
		console.log("EVE", cleanCombinedData[1]);
		selectedTimeOfDayData = cleanCombinedData[1];
		plottingDots(selectedTimeOfDayData);
	}
};

// ------------------------------- AVAILABILITY CHECKER  ----------------------------------------------

// Function that checks state of the key (availability)
function availabilityChecker(clickedValue) {
	console.log('Clicked value =', clickedValue);

	if (clickedValue == 'available'){
		// plottingDots(cleanCombinedData[0]) // Reset to default
		updatingMapAvailable(selectedTimeOfDayData);
	} else {
		// plottingDots(cleanCombinedData[0]) // Reset to default
		updatingMapBusy(selectedTimeOfDayData)
	}
};