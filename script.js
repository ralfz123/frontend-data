console.log('Connection works');
chargingPointsData = 'https://opendata.rdw.nl/resource/b3us-f26s.json';


// Fetching data - API
fetch(chargingPointsData)
    .then(res => res.json())
    .then(data => console.log("Data is:", data))
    .catch(error => console.log('ERROR'))

// Clean & Transform data
//    - transform random/incorrect data in NULL

// Combine datasets
//    - Filter out which columns I do not use
