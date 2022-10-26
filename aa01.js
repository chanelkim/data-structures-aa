// npm install axios
// mkdir data

const fs = require('fs');
const axios = require('axios');

/* NOTE:
Via terminal -
1. created new 'raw' folder inside 'data' folder (mkdir command)
2. moved raw .txt files into 'raw folder' (mv command)
*/

// // DATASET for ZONE 1 ------------------------
// axios
//   .get('https://parsons.nyc/aa/m01.html')
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//     fs.writeFileSync('/home/ec2-user/environment/data/m01.txt', res.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
  
// // DATASET for ZONE 2 ------------------------
//   axios
//   .get('https://parsons.nyc/aa/m02.html')
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//     fs.writeFileSync('/home/ec2-user/environment/data/m02.txt', res.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
  
// // DATASET for ZONE 3 ------------------------
//   axios
//   .get('https://parsons.nyc/aa/m03.html')
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//     fs.writeFileSync('/home/ec2-user/environment/data/m03.txt', res.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
  
// // DATASET for ZONE 4 ------------------------
//   axios
//   .get('https://parsons.nyc/aa/m04.html')
//   .then(res => {
//     console.log(`statusCode: ${res.status}`);
//     console.log(res.data);
//     fs.writeFileSync('/home/ec2-user/environment/data/m04.txt', res.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
  
  // // DATASET for ZONE 5 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m05.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m05.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  
  // // DATASET for ZONE 6 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m06.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m06.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });    
  
  // // DATASET for ZONE 7 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m07.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m07.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  
  // // DATASET for ZONE 8 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m08.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m08.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  
  // // DATASET for ZONE 9 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m09.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m09.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  
  // // DATASET for ZONE 10 ------------------------
  // axios
  // .get('https://parsons.nyc/aa/m10.html')
  // .then(res => {
  //   console.log(`statusCode: ${res.status}`);
  //   console.log(res.data);
  //   fs.writeFileSync('/home/ec2-user/environment/data/m10.txt', res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  // });    
  
/* NOTES:
--------------------- STEP 1 ---------------------
STEP 1: installing axios, writing the data file via axios
npm - 'node package manger' - allows us to add packages
axios package - allows to simulate being a user in the browser programatically; here, we're using it to just get a webpage
after installing library, must use "require" to load library and stored in a variable
fs - 'file system' is part of the base install of node, automatically installed by node; still need to be stored in a variable
libraries take the tasks that take many lines of code and use underlying methods to do complex things
in order to access what's in the library, we have to refer to the variable
every library is a javascript object, and within the object, there are attributes, functions, methods; the 'get.' method retrieves/calls a URL and stores what's in that URL in another object
chaining another method,'then.'' take that 'response' (res) and put it in an object that console logs the response status

--------------------- STEP 2 ---------------------
STEP 2: creating the data folder
mkdir data - 'make directory' creates a new folder called 'data'

RESULT:
Grabbed the data from the homepage and saved it locally (a complicated save as)

--------------------- LINUX COMMANDS ---------------------
ls 'list' see directories' content
cd 'change directory'
*/