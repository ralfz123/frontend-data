// Here comes the data plots code

// API fetch
// Cleaning data
// Transforming data

//
const endpointOne = 'https://opendata.rdw.nl/resource/b3us-f26s.json'; // API endpoint - Charging Points
const selectedColumn = 'chargingpointcapacity';

// Fetching data - API
fetchingData(endpointOne).then((dataRDW) => {
	const getChargingCapacityArray = newDataArray(dataRDW, selectedColumn);
	console.log('Charging Capacity is:', getChargingCapacityArray);

	// Checks if the unique key is present - Sam was helping me
	const key = 'maximumvehicleheight';
	let missing = false;

	for (let i of dataRDW) {
		if (!i[key]) {
			missing = true;
		}
	}
	console.log(key, "is missing:", missing);
});

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

		if (item[key] <= 0) {
			// When item is lower than or equal to 0, return null
			// console.log('Negative or zero value');
			return null;
		} else {
			return item[key];
		}
	});
}