const path = require('path')
const moment = require('moment');
const currentYear = require('./config')
const { lunarMapList, lunarDays } = require('./static/lunarFestival')
const { otherFestivalDays, otherFestivalMapList } = require('./static/otherFestival')
const { toCoverLunar } = require('./utils/lunar.js')
const { getIndexInArr, read, exist, createIcs, getAllDayinYear } = require('./utils/index')
const getHolidayInfo = require('./utils/getHolidayInfo');


function createEvents(allHolidayInfo) {
  const holidayEvents = [];
  const lunarEvents = [];
  allHolidayInfo.forEach(obj => {
    // 放假和补班
    if (obj.isholiday || obj.isWork) {
      const startDate = obj.date.split('-');
      const endDate = moment(obj.date).add(1, 'day').format('YYYY-M-D').split('-');

      const event = {
        start: startDate,
        end: endDate,
        title: obj.name + '--' + (obj.type === '休' ? '放假' : '补班'),
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
  return { holidayEvents, lunarEvents };
}

function dealOtherFestival(date, holidayEvents) {
  const _date = date.slice(5)
  if (otherFestivalDays.includes(_date)) {
    const current = otherFestivalMapList[_date]
    const startDate = date.split('-');
    const endDate = moment(date).add(1, 'day').format('YYYY-M-D').split('-');

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

function dealLunarDays(date, lunarEvents) {
  const lunar = toCoverLunar(date)
  if (lunarDays.includes(lunar)) {
    const currentLunar = lunarMapList[lunar]
    const startDate = date.split('-');
    const endDate = moment(date).add(1, 'day').format('YYYY-M-D').split('-');

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

async function getHoliday(allDaysInYear) {
  const tempPath = path.resolve(__dirname, `../json/${currentYear}.json`)
  let holiday = []
  const stats = await exist(tempPath)
  if (!stats) {
    holiday = await getHolidayInfo(currentYear)
  } else {
    holiday = await read(tempPath)
  }
  holiday.forEach(item => {
    const start = moment(`${item.startYear || currentYear}-${item.start}`)
    if (item.end) {
      const end = moment(`${item.endYear || currentYear}-${item.end}`)
      allDaysInYear.forEach(_item => { // 放假日子
        if (moment(_item.date).isBetween(start, end, 'day', [])) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc
        }
      })
    } else {
      allDaysInYear.forEach(_item => { // 放假日子
        if (_item.date === start) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc
        }
      })
    }
    // work
    if (item.workDays.length) {
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

async function createEventsInfo(currentYear) {
  const allDayInCurrentYearArr = getAllDayinYear(currentYear);
  const allHolidayInfo = await getHoliday(allDayInCurrentYearArr);
  return createEvents(allHolidayInfo);
}

async function start() {
  const yearList = [currentYear - 1, currentYear]
  const events = []
  try{
    for (let year of yearList) {
      const result = await createEventsInfo(year);
      events.push(result)
    }
    const [preEvents, currentEvents] = events;
    const tempPath = path.resolve(__dirname, '../public/ics')
    Object.keys(currentEvents).forEach(key => {
      createIcs(tempPath, key, [...preEvents[key], ...currentEvents[key]])
    })
    return {
      status: true
    }
  }catch (e) {
    return {
      status: false,
      error: e
    }
  }

}

module.exports = start

