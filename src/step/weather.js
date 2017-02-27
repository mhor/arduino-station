const Step = require("./step");
const moment = require("moment");

class Weather extends Step {
    constructor(forecast, lat, long, name, duration, enabled) {
      super("Weather", duration, enabled);

      this.forecast = forecast;
      this.lat = lat;
      this.long = long;
      this.city = name;
    }

    execute(board, lcd) {
        const city = this.city;
        const lat = this.lat;
        const long = this.long;
        this.forecast.get([this.lat, this.long], (err, weather) => {
          if(err) {
              return console.dir(err);
          }

          const temp = weather.currently.temperature + ":box1: (" + weather.currently.summary + ")";
          board.info("LCD", "weather", {"city": city, "weather": weather, "temp": temp});
          lcd.clear()
            .cursor(0, 0).print(city.substring(0,16))
            .cursor(1, 0).print(temp.substring(0,20))
          ;
      });
    }
}

module.exports = Weather;
