const ics = require('ics');
const fs = require('fs');

const moment = require('moment');
const getHolidayInfo = require('./getHolidayInfo');

const currentYear = 2020;


function createIcs(events) {
  const {errors, value}  = ics.createEvents(events);
  if (errors) {
    console.log(errors);
    return;
  }

  fs.writeFile('event.ics', value, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

function  createEvents(allHolidayInfo) {
  const events = [];
  allHolidayInfo.forEach(obj => {
    if (obj.isholiday || obj.isWork) {

      const startDate = obj.date.split('-');
      const endDate = moment(obj.date).add(1,  'day').format('YYYY-M-D').split('-');

      const event = {
        start: startDate,
        end: endDate,
        title: obj.name,
        status: 'CONFIRMED',
        productId: 'hzy@hzhyang.com',
        description: (obj.type ? obj.type : '') + (obj.desc ? ' ' +obj.desc : ''),
      }
      events.push(event);
    }
  });
  // console.log(events)
  return events;
}



function getAllDayinYear () {
  const startDay = moment().year(currentYear).startOf('year');
  const endDay = moment().year(currentYear + 1).startOf('year');
  const diffDay = endDay.diff(startDay, 'day');

  const allDayInCurrentYearArr = [];

  for (i = 0; i < diffDay; i++) {
    const obj = {};
    const _startDay = moment().year(currentYear).startOf('year');
    obj.date = _startDay.add(i, 'day').format('YYYY-M-D');
    allDayInCurrentYearArr.push(obj);
  }
  return allDayInCurrentYearArr;
}


function read () {
  const read = new Promise((resolve, reject) => {
    fs.readFile(`./json/${currentYear}.json`, 'utf8',(err, data) => {
      if(err) reject(err)
      resolve(JSON.parse(data))
    })
  })
  return read
}

function exist () {
  const exist = new Promise((resolve, reject) => {
    fs.stat(`./json/${currentYear}.json`, (err, stats) => {
      resolve(stats)
    })
  })
  return exist
}



async function getHoliday (allDaysInYear) {
  let holiday = []
  const stats = await exist()
  if(!stats) {
    holiday = await getHolidayInfo(currentYear)
  } else {
    holiday = await read()
  }
  holiday.forEach(item => {
    const start = moment(`${currentYear}-${item.start}`)
    if(item.end) {
      const end = moment(`${currentYear}-${item.end}`)
      allDaysInYear.forEach(_item => { // 放假日子
        if(moment(_item.date).isBetween(start, end, 'day', [])) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc
        }
      })
    } else {
      allDaysInYear.forEach(_item => { // 放假日子
        if(_item.date === start) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc
        }
      })
    }
    // work
    if(item.workDays.length) {
      item.workDays.forEach(workDate => {
        const index = getIndexInArr(allDaysInYear, `${currentYear}-${workDate}`);
        if (index !== -1) {
          const _item = allDaysInYear[index];
          _item.name = '上班--' + item.name + '--补班';
          _item.isWork = true;
          _item.type = '班';
          _item.desc = item.desc
        }
      })
    }
  })
  return allDaysInYear;
}

function getIndexInArr (arr, item) {
  const len = arr.length;
 for (i = 0; i <  len; i++) {
   if (arr[i].date === item) {
     return i;
   }
 }
 return -1;
}


async function start() {
  const allDayInCurrentYearArr = getAllDayinYear();
  const allHolidayInfo = await getHoliday(allDayInCurrentYearArr);
  const events = createEvents(allHolidayInfo);
  createIcs(events);
}

start();
