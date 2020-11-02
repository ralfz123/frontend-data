const endpointOne = 'https://opendata.rdw.nl/resource/b3us-f26s.json'; // API endpoint - Charging Points (dataset 1)
const selectedColumn = 'areaid';
// NPR dataset has also Charging POints data - Discuss if I'm going to use that dataset. It contains all my needed variables. And accesspointlocation (long,lat) + PlaatsNaam is in it, but not at each place. 


// fetch(endpointOne)
//     .then(res => res.json()) // Translates to JSON format
//     .then(data => console.log("Data is:", data)) // Logging the retrieved data
//     .catch(error => console.log('ERROR')) // Catches and shows an error when it's occurring


// Fetching data - API
fetchingData(endpointOne)
  .then((dataRDW) => {
    const getAreaIdArray = newDataArray(dataRDW, selectedColumn);
    const getCapacityArray = newDataArray(dataRDW, 'capacity');
    // const uniqueUsageValue = listUnique(getAreaIdArray);
    console.log("AreaId is:", getAreaIdArray);
    console.log("Charging Capacity is:", getCapacityArray);
    // console.log('unique', uniqueUsageValue);

    // const emptyStringsInAreas = countValuesInArray(getAreaIdArray, '');
    // console.log('empty strings in area', emptyStringsInAreas);
    // return getUsageIdArray;
  })
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

// Filter data - Make a new Array based on an unique key
function newDataArray(dataArray, key) { 
  return dataArray.map((item) => item[key]);
}



// Clean & Transform data
//    - transform random/incorrect data in NULL

// Combine datasets
//    - Filter out which columns I do not use
//