const str = `
春节（农历正月初一）；元宵节（农历正月十五）；龙抬头（农历二月初二）；上巳节（农历三月初三） ；端午节（农历五月初五）；七夕节（农历七月初七）；中元节（农历七月十五）；中秋节（农历八月十五）；重阳节（农历九月初九）；下元节（农历十月十五）`

str.split('；').forEach(item => {
  const name = item.split('（')[0]
  const date = item.split('（')[1].split('农历')[1].slice(0,-1)
  const obj = {}
  obj.lunar = date
  obj.name = name;
  obj.description = ''
  console.log(obj)
})
