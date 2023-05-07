export default function handle(req,res){
  res.send('hello ' +  req.query.name)
}
