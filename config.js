const currentYear = new Date().getFullYear();
const lunarDayList = [
  {
    lunar: '四月十五',
    name: '忌日',
    description: '父亲'
  }
]
const lunarDays = lunarDayList.map(item => item.lunar)
const lunarMapList = lunarDayList.reduce((pre, next) => {
  pre[next.lunar] = next
  return pre
}, {})

module.exports = {
  currentYear, lunarDays,  lunarMapList
}
