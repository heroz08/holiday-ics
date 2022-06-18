const { Lunar } = require('lunar-javascript')
const currentYear = require("../config");

function toCoverLunar(date){
  const lunar = Lunar.fromDate(new Date(date));
  const [ly, ld] = lunar.toString().split('年')
  return ld
}

const map = {
  DONG_ZHI:'冬至',
  XIAO_HAN: '小寒',
  DA_HAN: '大寒',
  LI_CHUN:'立春',
  YU_SHUI:'雨水',
  JING_ZHE:'惊蛰'
}

function getJieQi(){
  const jieqi = [];
  const l = Lunar.fromDate(new Date());
  const jqs = l.getJieQiTable()
  const keys = l.getJieQiList()
  keys.forEach(key => {
    const date = jqs[key].toYmd()
    if(date.slice(0,4) === (currentYear+'')){
      const obj = {
        date: date.slice(5)  , name: map[key] || key
      }
      jieqi.push(obj)
    }
  })
  return jieqi
}

module.exports = {
  toCoverLunar, getJieQi
}
