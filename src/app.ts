import {AllDayInCurrentYearArr, Event, EventArray, InfoArray, Result, StatusProps} from './utils/interface';
import {Moment} from 'moment';

const path = require('path');
const moment = require('moment');
const currentYear = require('./config');
const {lunarMapList, lunarDays} = require('./static/lunarFestival');
const {otherFestivalDays, otherFestivalMapList} = require('./static/otherFestival');
const {toCoverLunar} = require('./utils/lunar.js');
const {getIndexInArr, read, exist, createIcs, getAllDayinYear} = require('./utils/index');
const getHolidayInfo = require('./utils/getHolidayInfo');

function createEvents(allHolidayInfo: AllDayInCurrentYearArr): Result {
  const holidayEvents: EventArray = [];
  const lunarEvents: EventArray = [];
  allHolidayInfo.forEach(obj => {
    // 放假和补班(苹果已经有了不需要了)
    // if (obj.isholiday || obj.isWork) {
    //   const startDate = obj.date?.split('-');
    //   const endDate = moment(obj.date).add(1, 'day').format('YYYY-M-D').split('-');
    //
    //   const event: Event = {
    //     start: startDate,
    //     end: endDate,
    //     title: obj.name + '--' + (obj.type === '休' ? '放假' : '补班'),
    //     status: 'CONFIRMED',
    //     productId: 'hzy@hzhyang.com',
    //     description: obj.desc || '',
    //   };
    //   holidayEvents.push(event);
    // }
    // 阴历
    dealLunarDays(obj.date, lunarEvents);
    // 阳历其他
    dealOtherFestival(obj.date, holidayEvents);
  });
  return {holidayEvents, lunarEvents};
}

function dealOtherFestival(date: string, holidayEvents: EventArray) {
  const _date = date.slice(5);
  if (otherFestivalDays.includes(_date)) {
    const current = otherFestivalMapList[_date];
    const startDate = date.split('-');
    const endDate = moment(date).add(1, 'day').format('YYYY-M-D').split('-');

    const event = {
      start: startDate,
      end: endDate,
      title: current.name,
      status: 'CONFIRMED',
      productId: 'hzy@hzhyang.com',
      description: current.description || '',
    };
    holidayEvents.push(event);
  }
}

function dealLunarDays(date: string, lunarEvents: EventArray) {
  const lunar = toCoverLunar(date);
  if (lunarDays.includes(lunar)) {
    const currentLunar = lunarMapList[lunar];
    const startDate = date.split('-');
    const endDate = moment(date).add(1, 'day').format('YYYY-M-D').split('-');

    const event: Event = {
      start: startDate,
      end: endDate,
      title: currentLunar.name,
      status: 'CONFIRMED',
      productId: 'hzy@hzhyang.com',
      description: currentLunar.description || '',
    };
    lunarEvents.push(event);
  }
}

async function getHoliday(allDaysInYear: AllDayInCurrentYearArr) {
  const tempPath = path.resolve(__dirname, `../public/json/${currentYear}.json`);
  let holiday: InfoArray = [];
  const stats = await exist(tempPath);
  if (!stats) {
    // holiday = await getHolidayInfo(currentYear); // 不需要自己去爬了 苹果日历的中国大陆节假日已经包含 放假信息了
  } else {
    holiday = await read(tempPath);
  }
  holiday.forEach(item => {
    const start: Moment = moment(`${item.startYear || currentYear}-${item.start}`);
    if (item.end) {
      const end: Moment = moment(`${item.endYear || currentYear}-${item.end}`);
      allDaysInYear.forEach(_item => {
        // 放假日子
        if (moment(_item.date).isBetween(start, end, 'day', [])) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc;
        }
      });
    } else {
      allDaysInYear.forEach(_item => {
        // 放假日子
        if (_item.date === start.format('YYYY-MM-DD')) {
          _item.isholiday = true;
          _item.name = item.name;
          _item.type = '休';
          _item.desc = item.desc;
        }
      });
    }
    // work
    if (item.workDays?.length) {
      item.workDays.forEach(workDate => {
        const index = getIndexInArr(allDaysInYear, `${currentYear}-${workDate}`);
        if (index !== -1) {
          const _item = allDaysInYear[index];
          _item.name = item.name;
          _item.isWork = true;
          _item.type = '班';
          _item.desc = item.desc;
        }
      });
    }
  });
  return allDaysInYear;
}

async function createEventsInfo(currentYear: number): Promise<Result> {
  const allDayInCurrentYearArr: AllDayInCurrentYearArr = getAllDayinYear(currentYear);
  const allHolidayInfo = await getHoliday(allDayInCurrentYearArr);
  return createEvents(allHolidayInfo);
}

async function start(): Promise<StatusProps> {
  const yearList = [currentYear - 1, currentYear];
  const events: Result[] = [];
  try {
    for (const year of yearList) {
      const result: Result = await createEventsInfo(year);
      events.push(result);
    }
    const [preEvents, currentEvents] = events;
    const tempPath = path.resolve(__dirname, '../public/ics');
    Object.keys(currentEvents).forEach((key: string) => {
      // typeof ts 可以获取声明的类型
      // keyof 该操作符可以用于获取某种类型的所有键
      createIcs(tempPath, key, [...preEvents[key as keyof typeof preEvents], ...currentEvents[key as keyof typeof preEvents]]);
    });
    return {
      status: true,
    };
  } catch (e: any) {
    console.log(e);
    return {
      status: false,
      error: e,
    };
  }
}

module.exports = start;
