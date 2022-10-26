// function evaluation for zone 03

// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');


// --------------------- RAW DATA FILE ---------------------
// load the cheerio object into a variable, `content`
// which holds data and metadata about the html file (written as txt)
// var content = fs.readFileSync('data/m09.txt');
let rawFile = 'm09'
let content = fs.readFileSync('data/raw/' + rawFile + '.txt')

// load `content` into a cheerio object
let $ = cheerio.load(content); // $ is the object based on the rawFile


// // --------------------- RAW TABLE ROWS ---------------------
let table = $('table').eq(2).find('tbody');
let index = []
let meetings = []

table.children().each(function(i, elem) {
    if ($(elem).attr("style")=="margin-bottom:10px") {
        let tr = $(elem).html(); // table row data
        let result = rowObject(tr); // RUN FUNCTION - rowObject()
        // console.log(result);
        
        // COMMENTED OUT FOR TESTING
        // --------------------- WRITE JSON FILE ---------------------
        // inspiration: muonius/msdv-data-structures
        // source: https://github.com/muonius/msdv-data-structures/blob/master/week02/week02.js
        console.log(result.Info.address);
        meetings.push(result.Info.address);
    }
});

// COMMENTED OUT FOR TESTING
fs.writeFileSync('/home/ec2-user/environment/data/addr/m09-address.json', JSON.stringify(meetings));


// --------------------- MAIN FUNCTION ---------------------
function rowObject(data) {
    index.push(data);
    
    // OBJECT {info, details, times[]}
    // inspiration: miaomiaorepo/dataStructure
    // source: https://github.com/miaomiaorepo/dataStructure/blob/main/parsing-aa-data/aa02.js
    // const zone = {
    //     item: index.length,
    //     Info: {},
    //     Details: {},
    //     Times: []
    // };
    let zone = {
        item: index.length,
        htmlInfo: [],
        wheelAccess: [],
        htmlTimes: []
    };
    
    const splitRow = rawRowSplitter(data); // html split at 'style='
    getRowInfo(splitRow); // for hmtlInfo array
    getRowWheelAccess(splitRow); // for wheelAccess array
    getRowTimes(splitRow); // for htmlTimes array
    // console.zone;
    
    // --------------------- MEETING INFO ---------------------    
    // stores array [splits raw info only]
    const meetingInfo = zone.htmlInfo[0].split('<br>');
    // console.log(meetingInfo[5]); // for debugging meetingInfo splits
    // console.log(zone.htmlInfo[0]);
        
    // INFO OBJECT {venue, name, address, hint, detail}
    const info = {
        venue: '',
        name1: '',
        name2: '',
        address: {},
        // hint: '',
        addressHint: '',
        zipcode: ''
    };
        
        // INFO PARSING
        let venue = meetingInfo[0].replace('</h4>', '').replace('\"margin:0;padding:0;\">', '').replace('&amp;', 'and').trim()
        let name1 = meetingInfo[1].split('<b>')[1].split('<br />')[0].replace('</b>', '').split('<br>')[0].split("-")[0].replace('&amp;', 'and').trim()
        let name2 = meetingInfo[1].split('<b>')[1].split('<br />')[0].replace('</b>', '').split('<br>')[0].split("-")[1].trim()
        let hint = meetingInfo[3].startsWith('(')
        let addressHint = findHint(meetingInfo[3]) // findHint() helper function

        info.venue = venue
        info.name1 = name1
        info.name2 = name2
        info.hint = hint
        info.addressHint = addressHint
        // console.log(info);
        
        // ADDRESS PARSING
        let addressLine1 = meetingInfo[2].replace(/\t|\n|\v|\r|\f/g, '').trim().split(',')[0]
        let addressLine2 = meetingInfo[2].replace(/\t|\n|\v|\r|\f/g, '').trim().split(',')[1].trim()
        let city = 'New York'
        let state = 'NY'
        let zipcode = findZip(meetingInfo[3]) // findZip() helper function
        let address = {addressLine1, addressLine2, city, state, zipcode}
        
    info.address = address
    console.log(info.address);
    
    // --------------------- MEETING DETAILS ---------------------    
    // stores array [split raw details only]
    const meetingDetails = zone.htmlInfo[0]
    // .split('detailsBox"')[1]
    // .replace('>', '').replace('</div>', '').replace('</td>', '').replace('<td', '').replace(/\t|\n|\v|\r|\f/g, '').trim();
    console.log('***********');
    // console.log(meetingDetails);
        
    // MEETING DETAILS OBJECT {details content, wheelchair, special interest}
    const details = {
        detailsContent: '',
        // wheelchair: '',
        specialInterest: '',
    };
        
        // DETAILS PARSING
        let content = meetingDetails[0].trim()
        // let wheelchairString = 'wheelchair'
        // let wheelchairAccess = meetingInfo.includes(wheelchairString)
        let specialInterestString = 'Special'
        let specialInterest = data.includes(specialInterestString)
        
    details.detailsContent = content
    // details.wheelchair = wheelchairAccess
    details.specialInterest = specialInterest
    // console.log(details);
    

    // --------------------- helper functions ---------------------
    // splits html into raw info, raw details, raw times
    function rawRowSplitter(html) {
        let htmlSplits = html.split('style=');
        return htmlSplits;
    };
    
    // extracts raw info html, stores in array
    function getRowInfo (array, i) {
        for (let i = 0; i < array.length; i++) {
        let info = 'margin:0;padding:0'
        if (array[i].includes(info)) {
          zone.htmlInfo.push(array[i])
        }
      }
    }
    
    // extracts raw wheelchair html, stores in array    
    function getRowWheelAccess (array, i) {
        for (let i = 0; i < array.length; i++) {
        let wheelAccess = 'color:darkblue;'
        if (array[i].includes(wheelAccess) === true) {
            zone.wheelAccess.push('yes')
        }
      }
    }
    
    // extracts raw times html, stores in array    
    function getRowTimes (array, i) {
        for (let i = 0; i < array.length; i++) {
        let times = '#e3e3e3;width:350px;'
        if (array[i].includes(times)) {
          zone.htmlTimes.push(array[i])
        }
      }
    }
    
    // extracts and detects zipcode, cleans html
    function findZip(html) {
        let zip
        if (html.includes('NY')) {
            // zip = html.slice(-5)
            zip = Number(html.split('NY')[1].trim())
            return zip
        } 
        else if (html.includes('100')) {
            return Number(html.replace(/\t|\n|\v|\r|\f/g, '').trim().slice(-5))
            // return 'zip'
        }
    }
        
    // extracts content between parenthesis, cleans html
    function findHint(html) {
        let hint
        if (html.includes('NY')) {
            hint = html.split(')')[0].replace('(Betw.', '').replace('(Btw.', '').replace('(Betw', '').replace('(between', '').replace('&amp;', 'and').replace('(@', 'at').replace('@', 'at').replace('(Off', 'off').replace('(Enter', 'enter').replace('(', '').replace('een', '').trim()
            return hint
        } 
        else if (html.includes(')')) {
            hint = html.split(')')[0].replace('(Betw.', '').replace('(Btw.', '').replace('(Betw', '').replace('(between', '').replace('&amp;', 'and').replace('(@', 'at').replace('@', 'at').replace('(Off', 'off').replace('(Enter', 'enter').replace('(', '').replace('een', '').trim()
            return hint
        }
    }
    
    // // --------------------- MEETING TIMES ---------------------
    // // inspiration: ryanabest/data-structures
    // // source: https://github.com/ryanabest/data-structures/blob/master/week2/week2.js
        
    // // stores array [split raw times only]
    // const meetingHours = splitRow[2]
    //     // [2] = meeting times
        
    // // call and assign Key functions
    // const codes = codeKey();
    // const days = dayKey();
    //  // return the key from the object
    // const findKeys = (obj, key) => obj[key]    
        
    //     // variables for for loop
    //     let hourNumber = -1;
    //     let hourList = meetingHours.split('<br>');
    //     hourList = hourList.map(function(h) {return cleaner(h)} );
    //     hourList = hourList.filter(event => event !== '');
            
    //     let hourTime = []
    //     let hourType = []
    //     let hourSpecial = []
        
    //     // for loop for multiple meetings
    //     for (let j = 0; j < hourList.length; j++) {
    //         let subString = hourList[j].substring(0,7);
    //         if (subString === 'Meeting') {
    //             hourType.push({
    //                 listing: hourNumber + 1,
    //                 hourCode: hourList[j].replace('Meeting Type</b> ','').substring(0, 2).trim(),
    //                 hourType: findKeys(codes, hourList[j].replace('Meeting Type</b> ','').substring(0, 2).trim())
    //             })
    //             continue;
    //         } else if (subString === 'Special') {
    //             hourSpecial.push({
    //                 listing: hourNumber + 1,
    //                 specialInterest: hourList[j].replace('Special Interest</b> ', '')
    //             })
    //         } else {
    //             hourNumber++;
    //             hourTime.push({
    //                 listing: hourNumber + 1,
    //                 hourDay: findKeys(days, hourList[j].substring(0, 3)),
    //                 // hourStart: cleaner(hourList[j].split('</b>')[1]),
    //                 // .split('<b>')[0]),
    //                 hourEnd: cleaner(hourList[j].split('</b>')[hourList[j].split('</b>').length - 1])
    //             });
    //         }
    //     };
        
    //     let hourData = {
    //         count: hourTime.length,
    //         Hours: hourTime,
    //         Types: hourType,
    //         Special: hourSpecial
    //     }
        
    // zone.Times.push(hourData)
    
    zone.Info = info;
    // zone.Details = details;
    // zone.Times = hourData;
    
return zone;

};

// --------------------- HELPER FUNCTIONS ---------------------
// cleans meeting hour html string
// function cleaner(html) {
//     return html
//     .replace('border-bottom:1px', '')
//     .replace('solid #e3e3e3;width:350px;\"', '')
//     .replace('valign="top">', '')
//     .replace('<b>', '')
//     .replace('</td>', '')
//     .replace('<td', '')
//     .replaceAll('/\s\s+/g|\t|\n|\v|\r|\f/g', '')
//     .replace('\"', '')
//     .trim()
// };

function codeKey() {
  let code = {}
  code.B = 'Beginners'
  code.BB = 'Big Book'
  code.C = 'Closed Discussion'
  code.S = 'Step'
  code.T = 'Tradition'
  code.O = 'Open'
  code.OD = 'Open Discussion'
  return code
};

function dayKey() {
  let day = {}
  day.Sun = 'Sunday'
  day.Mon = 'Monday'
  day.Tue = 'Tuesday'
  day.Wed = 'Wednesday'
  day.Thu = 'Thursday'
  day.Fri = 'Friday'
  day.Sat = 'Saturday'
  return day
};
