import {Stats} from 'fs';
import {EventAttributes} from 'ics';
import {Moment} from 'moment';
import {
  AllDayInCurrentYearArr,
  ArrayT,
  DayConfig,
  DayInfo,
  Temp,
} from './interface';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ics = require('ics');
const currentYear = require('../config');

function getIndexInArr<T extends ArrayT>(arr: Array<T>, item: string): number {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i].date === dateAddZero(item)) {
      return i;
    }
  }
  return -1;
}

function dateAddZero(date: string): string {
  const arr = date.split('-');
  return arr
    .map(a => {
      return a.length > 1 ? a : '0' + a;
    })
    .join('-');
}

function read(_path: string): Promise<any> {
  const read = new Promise((resolve, reject) => {
    fs.readFile(
      _path,
      'utf8',
      (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      }
    );
  });
  return read;
}

function exist(_path: string) {
  const exist = new Promise((resolve, reject) => {
    fs.stat(_path, (err: NodeJS.ErrnoException | null, stats: Stats) => {
      resolve(stats);
    });
  });
  return exist;
}

function createIcs(_path: string, name: string, events: EventAttributes[]) {
  const tempPath = path.resolve(_path, name + '.ics');
  const {errors, value} = ics.createEvents(events);
  if (errors) {
    console.log(errors);
    throw errors;
  }
  fs.writeFile(tempPath, value, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      throw err;
    }
    console.log(name + '-- file has been saved!');
  });
}

function getAllDayinYear(currentYear: number): AllDayInCurrentYearArr {
  const startDay: Moment = moment().year(currentYear).startOf('year');
  const endDay: Moment = moment()
    .year(currentYear + 1)
    .startOf('year');
  const diffDay: number = endDay.diff(startDay, 'day');

  const allDayInCurrentYearArr: AllDayInCurrentYearArr = [];

  for (let i = 0; i < diffDay; i++) {
    const obj: DayInfo = {date: ''};
    const _startDay = moment().year(currentYear).startOf('year');
    obj.date = _startDay.add(i, 'day').format('YYYY-MM-DD');
    allDayInCurrentYearArr.push(obj);
  }
  return allDayInCurrentYearArr;
}

function getMonthSunday(month: number, index: number): string {
  const date: Moment = moment(currentYear + '-01-01')
    .month(month - 1)
    .startOf('month');
  const firstDay: number = date.day() || 7;
  const days = 7 - firstDay + 7 * (index - 1);
  date.add(days, 'day');
  return date.format('MM-DD');
}

function listCreateMap(list: DayConfig[]) {
  const key = 'date';
  const keys = list.map(item => item[key]);
  const map = list.reduce((pre: Temp, next) => {
    pre[next[key]] = next;
    return pre;
  }, {});
  return [keys, map];
}

module.exports = {
  getIndexInArr,
  read,
  exist,
  createIcs,
  getAllDayinYear,
  getMonthSunday,
  listCreateMap,
};
