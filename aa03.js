"use strict"

// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    axios = require('axios'),
    async = require('async'),
    dotenv = require('dotenv');

// using dotenv to mask TAMU api key
dotenv.config({path:'tamu.env'});
const API_KEY = process.env.API_KEY;
console.log(process.env);

// dotenv.config();
// const API_KEY = 'INSERT_YOUR_KEY_HERE';
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m10-address.json'));
// let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"]; // manual test entry

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value.addressLine1,
        city: "New York",
        state: "NY",
        zip: value.zipcode,
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
        try {
            // 		const response = await got(apiRequest);
            console.log(apiRequest)

            // 		const response = await axios.get(apiRequest);

            axios.get(apiRequest)
                .then(function(response) {
                    // handle success
                    // meetingsData.push(response.data); // gives back all data
                    // console.log(response.data)
                    
                    // push only relevant data into an object
                    let thisData = {}
                    thisData.streetAddr = response.data.InputAddress.StreetAddress;
                    thisData.lat = response.data.OutputGeocodes[0].OutputGeocode.Latitude;
                    thisData.long = response.data.OutputGeocodes[0].OutputGeocode.Longitude;
                    thisData.matchScore = response.data.OutputGeocodes[0].OutputGeocode.MatchScore;
                    console.log(response.data)
                    meetingsData.push(thisData);
                    

                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });

        }
        catch (error) {
            console.log(error.response);
        }
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/addr/m10-tamu.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
    console.log(`Number of source addresses: ${addresses.length}`);
});

/* NOTES:
--------------------- STEP 1 ---------------------
Step 1: Install additional libraries

--------------------- STEP 2 ---------------------
Step 2: Use async library to create URL which retrieves a valid response from the API
'meetingsData' - empty array for geocoded data
'addresses' - small test array that will be modified later with our data
'async' - operate in a particular order (not the typical of javascript)
'eachSeries' - an 'async' method wher 'series' means array
parameters - provide the list of addresses and provide the callback function
returns query object which holds the parameters of a given query
'?' begins the query string

--------------------- STEP 3 ---------------------
Step 3: programmatically copy the URL output using axios
'data' - does not include metadata
push response into meetingsData array

--------------------- DEBUGGING  ---------------------
log match scores, look at the low match scores
*/