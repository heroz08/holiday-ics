const start = require('../../src/app');``

exports.handler = async function (event, context) {
  // your server-side functionality
  console.log(event, context, 233);
  const {status, error } = await start();
  console.log('\n---------------------------------------------------\n');
  console.log(status, error, 899);
  if(status) {
    return {
      statusCode: 200,
      body: JSON.stringify({ code: 200, data: true, message: '更新成功！' }),
    }
  } else {
    console.log(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ code: 500, data: false, message: error }),
    }
  }
};
