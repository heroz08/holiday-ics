const otherFestival = require('./otherFestival')
const currentYear = new Date().getFullYear();
const lunarDayList = [
  {
    lunar: '四月十五',
    name: '忌日',
    description: '父亲'
  },
  { lunar: '正月十五', name: '元宵节', description: '' },
  { lunar: '二月初二', name: '龙抬头', description: '' },
  { lunar: '三月初三', name: '上巳节', description: '' },
  { lunar: '七月初七', name: '七夕节', description: '' },
  { lunar: '七月十五', name: '中元节', description: '' },
  { lunar: '九月初九', name: '重阳节', description: '' },
  { lunar: '十月十五', name: '下元节', description: '' }
]
const lunarDays = lunarDayList.map(item => item.lunar)
const lunarMapList = lunarDayList.reduce((pre, next) => {
  pre[next.lunar] = next
  return pre
}, {})

const otherFestivalDays = otherFestival.map(item => item.date)
const otherFestivalMapList = otherFestival.reduce((pre, next) => {
  pre[next.date] = next
  return pre
}, {})
module.exports = {
  currentYear, lunarDays,  lunarMapList, otherFestival, otherFestivalDays, otherFestivalMapList
}
