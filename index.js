const http = require("http");
const fs = require("fs");
var requests = require("requests");
const { listenerCount } = require("process");

const homeFile = fs.readFileSync("home.htm", "utf-8");
const replaceVal = (tempVal, orgVal)=>{
  orgVal.main.temp = (orgVal.main.temp-273.15).toFixed(2);;
  orgVal.main.temp_min = (orgVal.main.temp_min-273.15).toFixed(2);
  orgVal.main.temp_max = (orgVal.main.temp_max-273.15).toFixed(2);;
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  return temperature;
}

const server = http.createServer((req, res)=>{
  if(req.url == "/"){
  requests("https://api.openweathermap.org/data/2.5/weather?q=budaun&appid=d6423ef0acd512b78afc4f9ba33d89ab")
  .on('data', (chunk)=> {
    const objdata = JSON.parse(chunk);
    const arrData = [objdata];
    //console.log(arrData[0].main.temp);
    const realTimeData = arrData.map((val) => replaceVal(homeFile, val));
    const realdata1=realTimeData.join("");
    res.write(realdata1);
    //console.log(realTimeData);
})
  .on('end', (err)=> {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
}
});

server.listen(8080, "127.0.0.1");