export default function handle(req,res){
  console.log(req.name);
  res.send('hello' +  req.name)
}
