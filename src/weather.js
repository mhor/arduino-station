var moment = require("moment");

const isOnline = require('is-online');

function Weather(forecast, lat, long, name, duration, enabled) {
  this.type = 'Weather';
  this.forecast = forecast;
  this.lat = lat;
  this.long = long;
  this.city = name;
  this.duration = duration;
  this.enabled = enabled;
}

Weather.prototype.init = function() {
}

Weather.prototype.execute = function(board, lcd) {
    var city = this.city;
    var lat = this.lat;
    var long = this.long;
    this.forecast.get([this.lat, this.long], function(err, weather) {
      if(err) {
          return console.dir(err);
      }

      var temp = weather.currently.temperature + ":box1: (" + weather.currently.summary + ")";
      board.info("LCD", "weather", {"city": city, "weather": weather, "temp": temp});
      lcd.clear()
        .cursor(0, 0).print(city.substring(0,16))
        .cursor(1, 0).print(temp.substring(0,20))
      ;
  });
}

Weather.prototype.isEnabled = function() {
    return true;
}

module.exports = Weather;
