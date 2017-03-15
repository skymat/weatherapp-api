var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var request = require('request');


var listCities = [];
var message = "";
const ERREUR = "ERROR";
const WARNING = "WARNING";
var msgType = "";

app.use(express.static("public"));
   
app.get('/', function (req, res) {
  reinit();
  res.render('home', {list : listCities,message,msgType
  });
});

app.listen(8080, function () {
  console.log('Server actif sur port 8080');
});

app.get('/add', function (req, res) {
  reinit();
  var weatherWS = "http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=7cd587cc573892a9a5e7b1f3ae9f9773&units=metric&lang=fr";
  request(weatherWS, function (error, response, body) {
    
    if(response != null && response != undefined){
      if (response.statusCode == "200"){
        console.log(response.body);
        var jsResult = JSON.parse(response.body);
        var weatherInfo =  {city : "",icon : "",weather:"",tmax :"",tmin:"", cityid:""};
        weatherInfo.city = jsResult.name;
        weatherInfo.icon = "http://openweathermap.org/img/w/" + jsResult.weather[0].icon + ".png";
        weatherInfo.weather = jsResult.weather[0].description;
        weatherInfo.tmax = jsResult.main.temp_max + " °C";
        weatherInfo.tmin = jsResult.main.temp_min + " °C";
        weatherInfo.cityid = jsResult.id;

        if (req.query.city.toLowerCase() != weatherInfo.city.toLowerCase()){
          message = "La ville saisie n'existe pas, mais une ville a néanmoins été proposée par le webservice : " + weatherInfo.city;
          msgType = WARNING;
        }

        listCities.push(weatherInfo);
      }
      else
      {
        message = "La ville saisie n'existe pas.";
        msgType = ERREUR;
      }
     }
   else
    {
      message = "Pas de réponse du webservice";
      msgType = WARNING;
    }
    //forecast(weatherInfo.city);
    res.render('home', {list : listCities,message,msgType}); 
  });
 
});

app.get('/delete', function (req, res) {
  reinit();
  listCities.splice(req.query.index,1);
  res.render('home', {list:listCities,message,msgType
  });
});

function reinit()
{
  message = "";
  msgType = "";
}

function forecast(city)
{
  var url = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&APPID=7cd587cc573892a9a5e7b1f3ae9f9773&units=metric&lang=fr";
  request(url, function (error, response, body) {


      if (response.statusCode == "200"){
        var jsResult = JSON.parse(response.body);
        console.log(jsResult.list);
      }
  });
}