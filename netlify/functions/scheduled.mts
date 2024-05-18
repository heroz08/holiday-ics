import type { Config } from "@netlify/functions"
const shell  = require('shelljs');

export default async (req: Request) => {
  const { next_run } = await req.json()
  console.log("Received event! Next invocation at:", next_run)
  console.log('start scheduled!')
  shell.exec('npm run start', function(code: any, stdout: any, stderr: any) {
    console.log('Exit code:', code);
    if (code === 0) {
      console.log('Program output:', stdout);
      console.log('end scheduled!')
    } else {
      console.log('Program stderr:', stderr);
    }
  });
}

export const config: Config = {
  schedule: "@yearly"
}
