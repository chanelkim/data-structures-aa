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
        
        // --------------------- WRITE JSON FILE ---------------------
        // inspiration: muonius/msdv-data-structures
        // source: https://github.com/muonius/msdv-data-structures/blob/master/week02/week02.js
        console.log(result.Info.address);
        meetings.push(result.Info.address);
    }
});

fs.writeFileSync('/home/ec2-user/environment/data/addr/m09-address.json', JSON.stringify(meetings));


// --------------------- MAIN FUNCTION ---------------------
function rowObject(data) {
    index.push(data);
    
    // OBJECT {info, details, times[]}
    // inspiration: miaomiaorepo/dataStructure
    // source: https://github.com/miaomiaorepo/dataStructure/blob/main/parsing-aa-data/aa02.js
    const zone = {
        item: index.length,
        Info: {},
        Details: {},
        Times: []
    };

    // --------------------- MEETING INFO ---------------------
    // splits html into raw info, raw details, raw times
    function rawRowSplitter(html) {
        let htmlSplits = html.split('style=');
        return htmlSplits.slice(2, 5);
        // [2] = meeting info -> becomes [0]
        // [3] = meeting details -> becomes [1]
        // [4] = meeting times -> becomes [2]
    };
    const splitRow = rawRowSplitter(data); // stores array
        
    // stores array [collects raw info + raw details as metadata]
    const metaData = splitRow[0].concat(splitRow[1]);
        // [0] = meeting info
        // [1] = meeting details
        
    // stores array [splits raw info only]
    const meetingInfo = metaData.split('<br>');
        
    // INFO OBJECT {venue, name, address, hint, detail}
    const info = {
        venue: '',
        name1: '',
        name2: '',
        address: {},
        // hint: '',
        addressHint: '',
        locationDetail: ''
    };
        
        // INFO PARSING
        let venue = meetingInfo[0].replace('</h4>', '').replace('\"margin:0;padding:0;\">', '');
        let name1 = meetingInfo[1].split('<b>')[1].split('<br />')[0].replace('</b>', '').split('<br>')[0].split("-")[0].trim()
        let name2 = meetingInfo[1].split('<b>')[1].split('<br />')[0].replace('</b>', '').split('<br>')[0].split("-")[1].trim()
        let hint = meetingInfo[3].startsWith('(')
        let addressHint = meetingInfo[3].split(')')[0].slice(1)
        let detail = meetingInfo[2].replace(/\t|\n|\v|\r|\f/g, '').trim().split(',')[1].trim()
        
        info.venue = venue
        info.name1 = name1
        info.name2 = name2
        // info.hint = hint
        info.addressHint = addressHint
        info.locationDetail = detail
        
        // ADDRESS PARSING
        let addressLine1 = meetingInfo[2].replace(/\t|\n|\v|\r|\f/g, '').trim().split(',')[0]
        let city = 'New York'
        let state = 'NY'
        let zipcode = (meetingInfo[3].split(')')[1].replace(('\n'), '').replace('NY ', '').trim())*1
        let address = {addressLine1, city, state, zipcode}
        
    info.address = address
    
    
    // --------------------- MEETING DETAILS ---------------------    
    // stores array [split raw details only]
    const meetingDetails = meetingInfo[5].replace('<div class="detailsBox"> ', '').replace(/\t|\n|\v|\r|\f/g, '').split('</div');
        
    // MEETING DETAILS OBJECT {details content, wheelchair, special interest}
    const details = {
        detailsContent: '',
        wheelchair: '',
        specialInterest: '',
    };
        
        // DETAILS PARSING
        let content = meetingDetails[0].trim()
        let wheelchairString = 'wheelchair'
        let wheelchairAccess = metaData.includes(wheelchairString)
        let specialInterestString = 'Special'
        let specialInterest = splitRow[2].includes(specialInterestString)
        
    details.detailsContent = content
    details.wheelchair = wheelchairAccess
    details.specialInterest = specialInterest
    
    
    // --------------------- MEETING TIMES ---------------------
    // inspiration: ryanabest/data-structures
    // source: https://github.com/ryanabest/data-structures/blob/master/week2/week2.js
        
    // stores array [split raw times only]
    const meetingHours = splitRow[2]
        // [2] = meeting times
        
    // call and assign Key functions
    const codes = codeKey();
    const days = dayKey();
     // return the key from the object
    const findKeys = (obj, key) => obj[key]    
        
        // variables for for loop
        let hourNumber = -1;
        let hourList = meetingHours.split('<br>');
        hourList = hourList.map(function(h) {return cleaner(h)} );
        hourList = hourList.filter(event => event !== '');
            
        let hourTime = []
        let hourType = []
        let hourSpecial = []
        
        // for loop for multiple meetings
        for (let j = 0; j < hourList.length; j++) {
            let subString = hourList[j].substring(0,7);
            if (subString === 'Meeting') {
                hourType.push({
                    listing: hourNumber + 1,
                    hourCode: hourList[j].replace('Meeting Type</b> ','').substring(0, 2).trim(),
                    hourType: findKeys(codes, hourList[j].replace('Meeting Type</b> ','').substring(0, 2).trim())
                })
                continue;
            } else if (subString === 'Special') {
                hourSpecial.push({
                    listing: hourNumber + 1,
                    specialInterest: hourList[j].replace('Special Interest</b> ', '')
                })
            } else {
                hourNumber++;
                hourTime.push({
                    listing: hourNumber + 1,
                    hourDay: findKeys(days, hourList[j].substring(0, 3)),
                    hourStart: cleaner(hourList[j].split('</b>')[1].split('<b>')[0]),
                    hourEnd: cleaner(hourList[j].split('</b>')[hourList[j].split('</b>').length - 1])
                });
            }
        };
        
        let hourData = {
            count: hourTime.length,
            Hours: hourTime,
            Types: hourType,
            Special: hourSpecial
        }
        
    zone.Times.push(hourData)
    
    zone.Info = info;
    zone.Details = details;
    zone.Times = hourData;
    
return zone;

};

// --------------------- HELPER FUNCTIONS ---------------------
// cleans meeting hour html string
function cleaner(html) {
    return html.replace('border-bottom:1px', '').replace('solid #e3e3e3;width:350px;\"', '').replace('valign="top">', '').replace('<b>', '').replace('</td>', '').replace('<td', '').replaceAll('/\s\s+/g|\t|\n|\v|\r|\f/g', '').replace('\"', '').trim()
};

// get meeting type from abbreviations
// example: findKeys(codes, 'OD')
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

// get day of the week from shortnames
// example: findKeys(days, 'Sun')
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

// --------------------- ZOOM RECORDING ---------------------
// This function logs the trs to console
// var meetings = []; // empty array container
// function logTrs (tr) {
//     // console.log(tr)
//     // console.log('*************')
//     meetings.push(tr)
//     console.log(meetings.length)
// }

/* NOTES:
--------------------- STEP 1 ---------------------
STEP 1: Use cheerio to access the table rows in data
install cheerio package - similar to python's beautiful soup package, this is for javascript, allows to parse through text, reads through text and offers various meethods to be able to parse over the text; best at moving around a HTML document
using fs to read a file, rather than write a file
sync methods presses pause button before moving on
$ (dollar sign) variable - best practice to use $ specifically when making selections, there's data in here in which I can make a selection; parses through every legitimate htmk tag, instead of long text file, holding an object by text tags

--------------------- STEP 2 ---------------------
STEP 2: insert parsing function to apply to all table rows

--------------------- TR COUNTS ---------------------
m01.txt: 22
m02.txt: 29
m03.txt: 74
m04.txt: 53
m05.txt: 28
m06.txt: 63
m07.txt: 53
m08.txt: 26
m09.txt: 4
m10.txt: 22
*/