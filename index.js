const start = require('./src/app');
async function main (){
  const {status, error } = await start();
  if(!status) {
    console.log(error);
  }
}

main()
