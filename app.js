#!/usr/bin/env node

"use strict";

const winston = require("winston");
var config = require("config");
var five = require("johnny-five");
var moment = require("moment");
var Forecast = require("forecast");
var LastFmNode = require("lastfm").LastFmNode;

var lcd;
var loop = true;

var forecast = new Forecast({
  service: "darksky",
  key: config.get("darksky.key"),
  units: "celcius",
  cache: true,
  ttl: {
    minutes: 60
  }
});

var lastfm = new LastFmNode({
  api_key: config.get("lastfm.key"),
  secret: null,
  useragent: null
});

var recentTrackLastfm = lastfm.stream(config.get("lastfm.username"));

var lastPlayedTrack = null;
recentTrackLastfm.on("lastPlayed", function(track) {
    lastPlayedTrack = track;
});

var nowPlayingTrack = null;
recentTrackLastfm.on("nowPlaying", function(track) {
    nowPlayingTrack = track;
});

recentTrackLastfm.start();

var sequence = [{
    name: "Datetime",
    method: function() {
        var date = moment().format("ll");
        var time = moment().format("LT");
        lcd.clear()
            .cursor(0, 0).print(date)
            .cursor(0, 2).print(time)
        ;
        board.info("LCD", "Datetime", {"date": date, "time": time});
    },
    enable: function() {
        return true;
    },
    duration: 5000
}, {
    name: "Weather",
    method: function() {
        forecast.get([config.get("darksky.lat"), config.get("darksky.long")], function(err, weather) {
          if(err) {
              return console.dir(err);
          }

          var city = config.get("darksky.name");
          var temp = weather.currently.temperature + "° (" + weather.currently.summary + ")";
          board.info("LCD", "weather", {"city": city, "weather": weather, "temp": temp});
          lcd.clear()
            .cursor(0, 0).print(city)
            .cursor(0, 1).print(temp)
          ;
      });
    },
    enable: function() {
        return true;
    },
    duration: 5000
}, {
    name: "Lastfm (current track)",
    method: function() {
        var artist = nowPlayingTrack.artist["#text"];
        var track = nowPlayingTrack.name;
        var album = nowPlayingTrack.album["#text"];

        lcd.clear()
            .cursor(0, 0).print(track)
            .cursor(0, 1).print(artist)
        ;

        board.info("LCD", "lastfm (current track)", {"artist": artist, "track": track});
    },
    enable: function() {
        return recentTrackLastfm.isStreaming();
    },
    duration: 5000
}, {
    name: "Lastfm (last track)",
    method: function() {
        var artist = lastPlayedTrack.artist["#text"];
        var track = lastPlayedTrack.name;
        var album = lastPlayedTrack.album["#text"];

        lcd.clear()
            .cursor(0, 0).print(track)
            .cursor(0, 1).print(artist)
        ;

        board.info("LCD", "Lastfm (last track)", {"artist": artist, "track": track});
    },
    enable: function() {
        return true;
    },
    duration: 5000
}];

function execute(step) {

    var name = sequence[step].name;
    var method = sequence[step].method;
    var enabled = sequence[step].enable();
    var duration = sequence[step].duration || 3000;

    step++;

    if (enabled === true) {
        board.info("APP", "Run method " + name + "for " + duration + " milliseconds");
        method(lcd);
    } else {
        duration = 0;
    }

    if (step === sequence.length) {
        if (loop) {
            step = 0;
        } else {
            // We"re done!
            process.exit(0);
        }
    }

    board.wait(duration, function() {
        execute(step);
    });
}

var board = new five.Board({
    repl: false,
});

board.on("ready", function() {
    lcd = new five.LCD({
        pins: [7, 8, 9, 10, 11, 12]
    });
    lcd.print("App is starting");
    board.info("APP", "starting");

    execute(0);
});
