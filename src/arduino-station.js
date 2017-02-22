var config = require("config");

var Forecast = require("forecast");
var LastFmNode = require("lastfm").LastFmNode;

var Datetime = require('./datetime');
var LastFmCurrentTrack = require('./lastfm-current-track');
var LastFmLastPlayedTrack = require('./lastfm-last-played-track');
var Weather = require('./weather');

function ArduinoStation(board, lcd) {
    this.sequences = [];
    this.loop = true;
    this.board = board;
    this.lcd = lcd;
    this.lastfm = null;
    this.forecast = null;
    this.LastFmNode = null;
}

ArduinoStation.prototype.init = function() {
    this.forecast = new Forecast({
      service: "darksky",
      key: config.get("darksky.key"),
      units: "celcius",
      cache: true,
      ttl: {
        minutes: 60
      }
    });

    this.lastfm = new LastFmNode({
      api_key: config.get("lastfm.key"),
      secret: null,
      useragent: null
    });

    var self = this;
    config.get('steps').forEach(function(step) {
        switch(step.plugin_name) {
            case 'datetime':
                var datetime = new Datetime(step.duration, step.enabled);
                datetime.init();
                self.sequences.push(datetime);
                break;
            case 'lastfm-last-played-track':
                var lastFmLastPlayedTrack = new LastFmLastPlayedTrack(self.lastfm, step.username, step.duration, step.enabled);
                lastFmLastPlayedTrack.init();
                self.sequences.push(lastFmLastPlayedTrack);
                break;
            case 'lastfm-current-track':
                var lastFmCurrentTrack = new LastFmCurrentTrack(self.lastfm, step.username, step.duration, step.enabled);
                lastFmCurrentTrack.init();
                self.sequences.push(lastFmCurrentTrack);
                break;
            case 'weather':
                var weather = new Weather(self.forecast, step.lat, step.long, step.city, step.duration, step.enabled);
                weather.init();
                self.sequences.push(weather);
                break;
        }
    });
}

ArduinoStation.prototype.execute = function(step) {

    var name = this.sequences[step].type;
    var enabled = this.sequences[step].isEnabled();
    var duration = this.sequences[step].duration;

    if (enabled === true) {
        this.board.info("APP", "Run method " + name + " for " + duration + " milliseconds");
        this.sequences[step].execute(this.board, this.lcd);
    } else {
        duration = 0;
    }

    step++;
    if (step === this.sequences.length) {
        if (this.loop) {
            step = 0;
        } else {
            // We"re done!
            process.exit(0);
        }
    }

    this.board.wait(
        duration,
        (function() {this.execute(step);}).bind(this)
    );
}

module.exports = ArduinoStation;
