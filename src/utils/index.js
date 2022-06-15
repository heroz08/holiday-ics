const fs = require("fs");
const path = require("path");
const moment = require('moment');
const ics = require('ics');

function getIndexInArr (arr, item) {
  const len = arr.length;
  for (let i = 0; i <  len; i++) {
    if (arr[i].date === item) {
      return i;
    }
  }
  return -1;
}

function read (_path) {
  const read = new Promise((resolve, reject) => {
    fs.readFile(_path, 'utf8',(err, data) => {
      if(err) reject(err)
      resolve(JSON.parse(data))
    })
  })
  return read
}

function exist (_path) {
  const exist = new Promise((resolve, reject) => {
    fs.stat(_path, (err, stats) => {
      resolve(stats)
    })
  })
  return exist
}


function createIcs(_path, name, events) {
  const tempPath = path.resolve(_path,name + '.ics')
  const {errors, value}  = ics.createEvents(events);
  if (errors) {
    console.log(errors);
    return;
  }
  fs.writeFile(tempPath, value, (err) => {
    if (err) throw err;
    console.log(name + '-- file has been saved!');
  });
}


function getAllDayinYear (currentYear) {
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


module.exports = {
  getIndexInArr, read, exist, createIcs,getAllDayinYear
}
