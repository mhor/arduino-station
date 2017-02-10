#!/usr/bin/env node

'use strict';

const winston = require('winston');
var config = require('config');
var five = require("johnny-five");

var lcd;
var loop = true;

var sequence = [{
    name: 'Weather',
    method: function() {
        lcd.clear().cursor(0, 0).print("weather");
        board.info("LCD", 'weather');
    },
    enable: function() {
        return true;
    },
    duration: 5000
}, {
    name: 'Lastfm (current track)',
    method: function() {
        lcd.clear().cursor(0, 0).print("lastfm (current track)");
        board.info("LCD", 'lastfm (current track)');
    },
    enable: function() {
        return true;
    },
    duration: 5000
}, {
    name: 'Lastfm (last track)',
    method: function() {
        lcd.clear().cursor(0, 0).print("Lastfm (last track)");
        board.info("LCD", 'Lastfm (last track)');
    },
    enable: function() {
        return true;
    },
    duration: 5000
}];

function execute(step) {

    var method = sequence[step].method;
    var enabled = sequence[step].enable();
    var duration = sequence[step].duration || 3000;

    step++;

    if (enabled === true) {
        method(lcd);
    } else {
        duration = 0;
    }

    if (step === sequence.length) {
        if (loop) {
            step = 0;
        } else {
            // We're done!
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
    board.info('APP', 'starting');

    execute(0);
});
