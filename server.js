var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var request = require('request');


var listCities = [];

app.use(express.static("public"));
   
app.get('/', function (req, res) {
  res.render('home', {list : listCities
  });
});

app.listen(8080, function () {
  console.log('Server actif sur port 8080');
});

app.get('/add', function (req, res) {
  console.log(req.query);
  var weatherWS = "http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=7cd587cc573892a9a5e7b1f3ae9f9773&units=metric&lang=fr";
 


  request(weatherWS, function (error, response, body) {
    
    console.log('error:', error); // Print the error if one occurred 
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    console.log('body:', body); // Print the HTML for the Google homepage.
    var jsResult = JSON.parse(response.body);
    var weatherInfo =  {city : "",icon : "",weather:"",tmax :"",tmin:""};
    weatherInfo.city = jsResult.name;
    weatherInfo.icon = "http://openweathermap.org/img/w/" + jsResult.weather[0].icon + ".png";
    weatherInfo.weather = jsResult.weather[0].description;
    weatherInfo.tmax = jsResult.main.temp_max + " °C";
    weatherInfo.tmin = jsResult.main.temp_min + " °C";

    listCities.push(weatherInfo);
    res.render('home', {list : listCities
  }); 
  });
 
});

app.get('/delete', function (req, res) {
  listCities.splice(req.query.index,1);
  res.render('home', {list:listCities
  });
});

function renderWeatherWS(ws){

}