#!/usr/bin/env node
'use strict';

const winston = require('winston');
var config = require('config');
var five = require("johnny-five");

var board = new five.Board();
var board = new five.Board();

board.on("ready", function() {
  var lcd = new five.LCD({ pins: [7, 8, 9, 10, 11, 12] });
  lcd.print("App is starting");

  while (true) {
      this.wait(10000, function() {
        lcd.clear().cursor(0, 0).print("weather");
      });

      var currentlyScrobbling = false;
      if(currentlyScrobbling === true) {
          this.wait(10000, function() {
              lcd.clear().cursor(0, 0).print("lastfm (current track)");
          });
      }

      this.wait(10000, function() {
        lcd.clear().cursor(0, 0).print("lastfm (last track)");
      });
  }
});
