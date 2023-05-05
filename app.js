const Koa = require('koa');
const fs = require('fs/promises');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const moment = require('moment');
function startServer(){
  const app = new Koa();
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    if (ctx.request.url === '/isholiday') {
      await proxy(ctx.request.body, ctx);
    }
  });

  const proxy = async (data, ctx) => {
    const { day } = data;
    const [y] = day.split('-');
    const _path = path.join(__dirname + '/json/' + y + '.json');
    try {
      const str = await fs.readFile(_path);
      const jsonData = JSON.parse(str);
      const isHoliday = jsonData.some(item => {
        const { startYear, endYear, start, end } = item;
        const startDay = (startYear || y) + '-' + start;
        const endDay = (endYear || y) + '-' + (end || start);
        const momentDay = moment(day);
        return momentDay.isBetween(startDay, endDay, 'day', '[]');
      });
      ctx.body = { isHoliday, success: true, message: '成功' };
    } catch (e) {
      ctx.body = { success: false, message: e };
    }
  };
  app.listen(9000, () => {
    console.log('start server');
  });
}

module.exports = startServer;
