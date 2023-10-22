import {DayConfig} from '../utils/interface';

const {getMonthSunday, listCreateMap} = require('../utils/index');
const {getJieQi} = require('../utils/lunar');
const other: DayConfig[] = [
  {
    name: '父亲节',
    date: getMonthSunday(6, 3),
    description: '6月的第3个星期日',
  },
  {
    name: '母亲节',
    date: getMonthSunday(5, 2),
    description: '5月的第2个星期日',
  },
];

// const jieqi: DayConfig[] = getJieQi();

const festival: DayConfig[] = [
  // {
  //   date: '03-08',
  //   name: '妇女节',
  // },
  // {
  //   date: '05-04',
  //   name: '青年节',
  // },
  // {
  //   date: '06-01',
  //   name: '儿童节',
  // },
  // {
  //   date: '07-01',
  //   name: '建党节',
  // },
  // {
  //   date: '08-01',
  //   name: '建军节',
  // },
  ...other,
  // ...jieqi,
];
const [otherFestivalDays, otherFestivalMapList] = listCreateMap(festival);

module.exports = {
  otherFestivalDays,
  otherFestivalMapList,
};
