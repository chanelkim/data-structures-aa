// PROBLEM SOLVING
// Step 1: consolidate tamu addresses from each zone
// Expected Result: a single .json file as an array
// Step 2: eliminate repeated addresses by using a matching function
// Expected Result: single instance of each address

// ITEMS
// mXX-address.json = objects from function with addressLine1, addressLine2, city, state, zipcode
// mXX-tamu.json = arrays of objects with streetAddr, lat, long, matchScore

const fs = require('fs'),
    querystring = require('querystring'),
    async = require('async')
const cheerio = require('cheerio');
    
// create empty array for consolidated tamu addresses
// let meetingAddresses = []

// load tamu files
const m01 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m01-tamu.json'));
const m02 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m02-tamu.json'));
const m03 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m03-tamu.json'));
const m04 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m04-tamu.json'));
const m05 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m05-tamu.json'));
const m06 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m06-tamu.json'));
const m07 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m07-tamu.json'));
const m08 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m08-tamu.json'));
const m09 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m09-tamu.json'));
const m10 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/addr/m10-tamu.json'));
const meetingAddresses = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10]
console.log(meetingAddresses.length)
console.log(meetingAddresses[0].length,
            meetingAddresses[1].length,
            meetingAddresses[2].length,
            meetingAddresses[3].length,
            meetingAddresses[4].length,
            meetingAddresses[5].length,
            meetingAddresses[6].length,
            meetingAddresses[7].length,
            meetingAddresses[8].length,
            meetingAddresses[9].length)

// function addrCollector() {
//     meetingAddresses.push(addr)
//     return meetingAddresses
// };

fs.writeFileSync('/home/ec2-user/environment/data/addr/aa-addresses.json', JSON.stringify(meetingAddresses));

// addrCollector()