// This file contains all code that is used for the dataviz, except the code for the map projection ('../projection')
// shout out to Sam Landsdaal

const endpointOne = '../data/dataDay.json'; // Data from a Day - 08:00h
const endpointTwo = '../data/dataEve.json'; // Data from a Eve - 20:00h

// const statusAvailable = 'available'; // Available Charging points
// const statusCharging = 'charging'; // Busy Charging points

// Fetching data
// Receiving data using fetch()

const dataDay = fetch(endpointOne).then((response) => response.json());
const dataEve = fetch(endpointTwo).then((response) => response.json());

Promise.all([dataDay, dataEve]).then((response) => {
	let [dataset1, dataset2] = response;
	filteredDataset(dataset1, dataset2);
});

function filteredDataset(dataDay, dataEve) {
	const cleanDataDay = dataDay.data.map((element) => {
		const object = {};
		object.point = element.point;
		object.status = element.status;

		return object;
	});

	const cleanDataEve = dataEve.data.map((element) => {
		const object = {};
		object.point = element.point;
		object.status = element.status;

		return object;
	});
	console.log(cleanDataDay, cleanDataEve);
}

// ------------------------------------------------------------------------------------

// Rest functions

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
