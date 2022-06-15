const { Lunar} = require('lunar-javascript')

function toCoverLunar(date){
  const lunar = Lunar.fromDate(new Date(date));
  const [ly, ld] = lunar.toString().split('年')
  return ld
}

module.exports =  toCoverLunar
