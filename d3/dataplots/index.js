// Here comes the data plots code

// API fetch
// Cleaning data
// Transforming data

const endpointOne = ('../data/dataDay.json'); // Data from a Day - 08:00h
const endpointTwo = ('../data/dataEve.json'); // Data from a Eve - 20:00h
const statusAvailable = 'available'; // Available Charging points 
const statusCharging = 'charging'; // Busy Charging points 

// Fetching data
// Receiving data using fetch()
async function fetchingData(url) {
		const response = await fetch(url); // Waits till the data is fetched
		const data = await response.json(); // Waits till the data is formatted to JSON
		console.log(data)
		return data; // Return the JSON data
	}

fetchingData(endpointOne);
console.log(data)

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