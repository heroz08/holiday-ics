import {JieQiObj} from './interface';

const {Lunar} = require('lunar-javascript');
const currentYear = require('../config');

function toCoverLunar(date: string): string {
  const lunar = Lunar.fromDate(new Date(date));
  const [, ld] = lunar.toString().split('年');
  return ld;
}

enum map {
  DONG_ZHI = '冬至',
  XIAO_HAN = '小寒',
  DA_HAN = '大寒',
  LI_CHUN = '立春',
  YU_SHUI = '雨水',
  JING_ZHE = '惊蛰',
}

function getJieQi(): JieQiObj[] {
  const jieQi: JieQiObj[] = [];
  const l = Lunar.fromDate(new Date());
  const jqs = l.getJieQiTable();
  const keys = l.getJieQiList();
  keys.forEach((key: string) => {
    const date: string = jqs[key].toYmd();
    if (date.slice(0, 4) === currentYear + '') {
      const obj: JieQiObj = {
        date: date.slice(5),
        name: map[key as keyof typeof map] || key,
      };
      jieQi.push(obj);
    }
  });
  return jieQi;
}

module.exports = {
  toCoverLunar,
  getJieQi,
};
