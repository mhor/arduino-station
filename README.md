# Arduino Station

## Summary

A simple Arduino project driven by [johnny-five](http://johnny-five.io/), to print some usefull information on LCD screen.

## Schema

![ArduinoStationSchema](/docs/arduino-station.png)

Fritzing diagram: [arduino-station.fzz](/docs/arduino-station.fzz)

## Installation

[Install Firmata on your Arduino](http://www.instructables.com/id/Arduino-Installing-Standard-Firmata/)
Then:

```bash
$ git clone git@github.com:mhor/arduino-station.git
$ npm install
$ node app.js
```

## Plugins:

### Global Plugins configuration:

- ```plugin_name```: step type
- ```enabled```: enabled step
- ```duration```: duration of step

### Datetime:

```json
{
    "plugin_name": "datetime",
    "enabled": true,
    "duration": 5000,
    "format": {
        "date": "LLLL",
        "time": "llll"
    }
}
```

- ```format.date```: Moment.js format of first line
- ```format.time```: Moment.js format of second line

### Wheather:

```json
{
    "plugin_name": "weather",
    "enabled": true,
    "duration": 5000,
    "city": "Paris",
    "lat": 48.8534100,
    "long": 2.3488000
}
```

- ```city```: This text will be print on first line
- ```lat```: Latitude needed
- ```long```: Longitude needed

### LastFM last played track

```json
{
    "plugin_name": "lastfm-last-played-track",
    "enabled": true,
    "duration": 5000,
    "username": "mhor_"
}
```

- ```username```: username of LastFM account

### LastFM current track

```json
{
    "plugin_name": "lastfm-current-track",
    "enabled": true,
    "duration": 5000,
    "username": "mhor_"
}
```

- ```username```: username of LastFM account

## Other Configuration:

```json
{
	"arduino": {
		"controller": "PCF8574",
		"rows": 2,
		"cols": 16
	},
	"lastfm": {
		"key": "d41d8cd98f00b204e9800998ecf8427e"
	},
	"darksky": {
		"key": "d41d8cd98f00b204e9800998ecf8427e"
	}
}
```

- ```arduino```: your arduino lcd configuration passed on LCD [construction](http://johnny-five.io/api/lcd/#parameters)
- ```lastfm.key```: Your [LastFM](https://www.last.fm/home) key
- ```darksky.key```: Your [Darksky](https://darksky.net) key

See full example configuration [here](config/default.json.dist)

## License

See ```LICENSE``` for more information
