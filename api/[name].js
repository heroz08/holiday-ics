export default function handle(req,res){
  console.log(req.query.name);
  res.send('hello' +  req.query.name)
}
