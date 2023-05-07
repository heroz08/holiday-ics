
const fs = require('fs/promises');
const path = require('path');
const moment = require('moment');

export default function holiday(request, response) {
  try {
    console.log(request.query, request.body);
    response.json({
      res: request,
      resp: response
    })
    // const { day } = request.body;
    // const [y] = day.split('-');
    // const jsonData = await fs.readFile(path.resolve(__dirname, '../public/json/' + y + '.json'));
    // const isHoliday = JSON.parse(jsonData.toString()).some(item => {
    //   const { startYear, endYear, start, end } = item;
    //   const startDay = (startYear || y) + '-' + start;
    //   const endDay = (endYear || y) + '-' + (end || start);
    //   const momentDay = moment(day);
    //   return momentDay.isBetween(startDay, endDay, 'day', '[]');
    // });
    // response.json({ isHoliday, success: true, message: '成功' });
  } catch (e) {
    response.json({ success: false, message: e });
  }
}
