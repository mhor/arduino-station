#!/usr/bin/env node

"use strict";

const config = require("config");
const five = require("johnny-five");
const ArduinoStation = require("./src/arduino-station");
const spawn = require( 'child_process' ).spawnSync;

const board = new five.Board({
    repl: false,
});

board.on("ready", () => {
    const lcd = new five.LCD(config.get('arduino'));
    lcd.useChar("box1");
    lcd.print("App is starting");
    board.info("APP", "starting");

    const arduinoStation = new ArduinoStation(board, lcd);
    arduinoStation.init();
    arduinoStation.execute(0);

    config.get('commands').forEach((command) => {
        const button = new five.Button(command.pin);
        button.on(command.action, () => {
            spawn(command.command, command.args);
        });
    });
});
