const start = require('./src/app.ts');
async function main() {
  const {status, error} = await start();
  if (!status) {
    console.log(error);
  }
}

main();
