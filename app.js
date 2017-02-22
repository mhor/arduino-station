#!/usr/bin/env node

"use strict";

const winston = require("winston");
var config = require("config");
var five = require("johnny-five");
var ArduinoStation = require("./src/arduino-station");

var lcd;
var board = new five.Board({
    repl: false,
});

board.on("ready", function() {
    lcd = new five.LCD(config.get('arduino'));
    lcd.useChar("box1");
    lcd.print("App is starting");
    board.info("APP", "starting");

    var arduinoStation = new ArduinoStation(board, lcd);
    arduinoStation.init();
    arduinoStation.execute(0);
});
