// eslint-disable-next-line node/no-unpublished-require
const start = require('./build/src/app');
console.log('start');
async function main() {
  const {status, error} = await start();
  if (!status) {
    console.log(error);
  }
}
main();
