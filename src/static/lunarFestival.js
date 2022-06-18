const { listCreateMap }  = require('../utils/index')
const lunarDayList = [
  {
    lunar: '四月十五',
    name: '忌日',
    description: '父亲'
  },
  { lunar: '正月十五', name: '元宵节', description: '又称上元节、元夜、灯节。这是春节后的第一个月圆之夜' },
  { lunar: '二月初二', name: '龙抬头', description: '中和节在农历二月二，俗称龙抬头' },
  { lunar: '七月初七', name: '七夕节', description: '农历七月初七夜，称“七夕”，是传说中牛郎织女每年相会的日子' },
  { lunar: '七月十五', name: '中元节', description: '中元节在农历的七月十五。是传说中地官的生日，所以又称“鬼节”' },
  { lunar: '九月初九', name: '重阳节', description: '' },
  { lunar: '十月十五', name: '下元节', description: '' },
]

const [lunarDays, lunarMapList] = listCreateMap(lunarDayList, 'lunar')

module.exports = {
  lunarDays, lunarMapList
}
