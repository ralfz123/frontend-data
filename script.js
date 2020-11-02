chargingPointsData = 'https://opendata.rdw.nl/resource/b3us-f26s.json'; // API endpoint - Charging Points (dataset 1)


// Fetching data - API
fetch(chargingPointsData)
    .then(res => res.json()) // Translates to JSON format
    .then(data => console.log("Data is:", data)) // Logging the retrieved data
    .catch(error => console.log('ERROR')) // Catches and shows an error when it's occurring

// Clean & Transform data
//    - transform random/incorrect data in NULL

// Combine datasets
//    - Filter out which columns I do not use
//