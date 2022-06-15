const ics = require('ics');
const fs = require('fs');
const cover= require('./lunar.js')
const moment = require('moment');
const getHolidayInfo = require('./getHolidayInfo');
const { currentYear, lunarMapList, lunarDays, otherFestival, otherFestivalDays, otherFestivalMapList} = require('./config')


function createIcs(name, events) {
  const path = './public/ics/'
  const {errors, value}  = ics.createEvents(events);
  if (errors) {
    console.log(errors);
    return;
  }

  fs.writeFile(path+ name + '.ics', value, (err) => {
    if (err) throw err;
    console.log(name + '-- file has been saved!');
  });
}

function  createEvents(allHolidayInfo) {
  const holidayEvents = [];
  const lunarEvents = [];
  allHolidayInfo.forEach(obj => {
    // 放假和补班
    if (obj.isholiday || obj.isWork) {
      const startDate = obj.date.split('-');
      const endDate = moment(obj.date).add(1,  'day').format('YYYY-M-D').split('-');

      const event = {
        start: startDate,
        end: endDate,
        title: obj.name + '--' + (obj.type === '休' ? '放假' : '补班') ,
        status: 'CONFIRMED',
        productId: 'hzy@hzhyang.com',
        description: obj.desc || '',
      }
      holidayEvents.push(event);
    }
    // 阴历
    dealLunarDays(obj.date, lunarEvents)
    // 阳历其他
    dealOtherFestival(obj.date, holidayEvents)
  });
  return {holidayEvents, lunarEvents};
}

function dealOtherFestival(date, holidayEvents) {
  const _date = date.slice(5)
  if(otherFestivalDays.includes(_date)) {
    const current= otherFestivalMapList[_date]
    const startDate = date.split('-');
    const endDate = moment(date).add(1,  'day').format('YYYY-M-D').split('-');

    const event = {
      start: startDate,
      end: endDate,
      title: current.name,
      status: 'CONFIRMED',
      productId: 'hzy@hzhyang.com',
      description: current.description || '',
    }
    holidayEvents.push(event)
  }
}

function dealLunarDays(date, lunarEvents){
  const lunar = cover(date)
  if(lunarDays.includes(lunar)) {
    const currentLunar =lunarMapList[lunar]
    const startDate = date.split('-');
    const endDate = moment(date).add(1,  'day').format('YYYY-M-D').split('-');

    const event = {
      start: startDate,
      end: endDate,
      title: currentLunar.name,
      status: 'CONFIRMED',
      productId: 'hzy@hzhyang.com',
      description: currentLunar.description || '',
    }
    lunarEvents.push(event);
  }
}


function getAllDayinYear () {
  const startDay = moment().year(currentYear).startOf('year');
  const endDay = moment().year(currentYear + 1).startOf('year');
  const diffDay = endDay.diff(startDay, 'day');

  const allDayInCurrentYearArr = [];

  for (i = 0; i < diffDay; i++) {
    const obj = {};
    const _startDay = moment().year(currentYear).startOf('year');
    obj.date = _startDay.add(i, 'day').format('YYYY-MM-DD');
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
          _item.name = item.name;
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
 for (let i = 0; i <  len; i++) {
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
  Object.keys(events).forEach(key => {
    createIcs(key, events[key])
  })
}

start();
