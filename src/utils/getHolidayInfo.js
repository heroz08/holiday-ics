const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')
const moment = require("moment");
const path = require('path');

async function getHolidayInfo(year) {
    this.year = year
    const href = await search()
    const holidayInfo = await getPageInfoByUrl(href)
    return holidayInfo
}

async function search() {
    const searchUrl = 'http://sousuo.gov.cn/s.htm';
    const params = {
        title: this.year,
        t: 'paper',
        advance: true,
        q: "假期",
        pcodeJiguan: "国办发明电",
        puborg: "国务院办公厅",

    }
    const resp = await axios.get(searchUrl, {params})
    const $ = cheerio.load(resp.data)
    const href = cheerio.load($('.result .res-list')[0])(' h3 a').attr('href')
    return href
}

async function getPageInfoByUrl(href) {
    const condition = ['一、', '二、', '三、', '四、', '五、', '六、', '七、'];
    const filter = []
    const resp = await axios.get(href)
    const $ = cheerio.load(resp.data)
    const infoWrap = $('.b12c p')
    for (let i = 0; i < infoWrap.length; i++) {
        const p = infoWrap[i]
        const c = cheerio.load(p)
        condition.forEach(co => {
            const text = c.text()
            if (text.includes(co)) {
                filter.push(text)
            }
        })
    }
    return dealTextInfo(filter)
}

function dealTextInfo(arr) {
    const info = []
    const deReg = /[\u4e00-\u9fa5]{2,3}：/
    const startReg = /(\d{4}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}至|\d{1,2}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}至|\d{1,2}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}放)/
    const endReg = /(至\d{1,2}[\u4e00-\u9fa5]{1}(\d{1,2}[\u4e00-\u9fa5]{1}|)放|至\d{4}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}(\d{1,2}[\u4e00-\u9fa5]{1}|)放)/
    const monthReg = /^\d{1,2}-/
    const workReg = /\d{1,2}[\u4e00-\u9fa5]{1}\d{1,2}[\u4e00-\u9fa5]{1}（[\u4e00-\u9fa5]{3}）/g
    arr.forEach(text => {
        const obj = {}
        obj.name = text.match(deReg)?.[0].slice(0, -1)
        obj.start = text.match(startReg)?.[0].slice(0, -1).replace(/(日|月)/g, '-').slice(0,-1)
        if(obj.start.includes('年')) { // 2022年12-31 这种情况
            const tempDate = obj.start.split('年');
            obj.start = tempDate[1];
            obj.startYear = tempDate[0];
        }
        const month = obj.start.match(monthReg)?.[0]
        const endDate = text.match(endReg)

        if (endDate) {
            let temp = endDate[0].replace(/(日|月)/g, '-').slice(1,-2)
            if(temp.includes('年')){ // 2023年1-2 这种情况
                const tempDate = temp.split('年')
                temp = tempDate[1];
                obj.endYear = tempDate[0];
            }
            const tempArr = temp.split('-')
            if(tempArr.length > 1) { // 带月份的情况 跨月情况
                obj.end = temp
            } else { // 同月
                obj.end = (month + temp)
            }
        }
        const workDays = text.match(workReg)
        obj.workDays = workDays ? workDays.map(day => (day.slice(0, -5)).replace(/(日|月)/g, '-').slice(0,-1)) : []
        obj.desc = text.replace(/[\u4e00-\u9fa5]{1}、[\u4e00-\u9fa5]{2,3}：/, '')
        obj.start = moment(obj.start, 'M-D').format('MM-DD');
        obj.end = obj.end && moment(obj.end, 'M-D').format('MM-DD');
        info.push(obj)
    })
    createJson(info)
    return info
}


function createJson(arr) {
    const tagPath = path.resolve(__dirname, `../../json/${this.year}.json`)
    console.log(tagPath,'path', path.join(__dirname,`../../json/${this.year}.json`));
    fs.appendFile(`../../json/${this.year}.json`, JSON.stringify(arr), (err) => {
        if (err) {
            console.log(__dirname,'dirname');
            console.log(err);
            throw err;
            return;
        }
    })
}

// getHolidayInfo(2022)

module.exports = getHolidayInfo
