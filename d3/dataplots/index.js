// Here comes the data plots code

// API fetch
// Cleaning data
// Transforming data

// 
const endpointOne = 'https://opendata.rdw.nl/resource/b3us-f26s.json'; // API endpoint - Charging Points (dataset 1)
// const selectedColumn = 'areaid';
// NPR dataset has also Charging POints data - Discuss if I'm going to use that dataset. It contains all my needed variables.
//          - accesspointlocation (long,lat) + PlaatsNaam is in it, but not at each place.
//          - capacity && chargingPointCapacity, but not at each place.

// Fetching data - API
fetchingData(endpointOne).then((dataRDW) => {
	// const getAreaIdArray = newStringDataArray(dataRDW, selectedColumn);
	const getCapacityArray = newDataArray(dataRDW, 'chargingpointcapacity');
	// const uniqueUsageValue = listUnique(getAreaIdArray);
	// console.log('AreaId is:', getAreaIdArray);
	console.log('Charging Capacity is:', getCapacityArray);
	// console.log('unique', uniqueUsageValue);

	// const emptyStringsInAreas = countValuesInArray(getAreaIdArray, '');
	// console.log('empty strings in area', emptyStringsInAreas);
	// return getUsageIdArray;
});
//   .then((getUsageIdArray) => {
//     processData(getUsageIdArray);
//   });

// Receiving data using fetch()
async function fetchingData(url) {
	try {
		const response = await fetch(url); // Waits till the data is fetched
		const data = await response.json(); // Waits till the data is formatted to JSON
		return data; // Returns the JSON data
	} catch {
		console.log(err); // Catches and shows an error when it's occurring
	}
}

// Filter and transform data - Make a new Array based on an unique key and checks if value is correct
function newDataArray(dataArray, key) {
	return dataArray.map((item) => {
		item[key] = Number(item[key]); // Makes all items from unique key a NUMBER type.

		if (item[key] <= 0) { // When item is lower than or equal to 0, return null
			console.log('Negative or zero value');
			return null;
		} else {
			return item[key];
		}
	});
}

// NOT DONE YET Filter string data - Make a new Array based on an unique key and checks if value is correct
function newStringDataArray(dataArray, key) {
	return dataArray.map((item) => {
		item[key] = item[key];
		// console.log(item[key])

		if (item[key] === ('')) {
			console.log('Empty string');
			console.log(item)	
			return null;
		} else {
			return item[key];
		}
	});
}