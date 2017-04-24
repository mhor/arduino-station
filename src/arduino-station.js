const config = require("config");

const Forecast = require("forecast");
const LastFmNode = require("lastfm").LastFmNode;

const Datetime = require('./step/datetime');
const LastFmCurrentTrack = require('./step/lastfm-current-track');
const LastFmLastPlayedTrack = require('./step/lastfm-last-played-track');
const LastFmTodayPlaycount = require('./step/lastfm-today-playcount');
const LastFmTotalPlaycount = require('./step/lastfm-total-playcount');
const Weather = require('./step/weather');

class ArduinoStation {
    constructor(board, lcd) {
        this.sequences = [];
        this.loop = true;
        this.board = board;
        this.lcd = lcd;
        this.lastfm = null;
        this.forecast = null;
        this.LastFmNode = null;
    }

    init() {
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

        const self = this;
        config.get('steps').forEach((step) => {
            switch(step.type) {
                case 'datetime':
                    const datetime = new Datetime(
                        step.format.date,
                        step.format.time,
                        step.duration,
                        step.enabled
                    );
                    datetime.init();
                    self.sequences.push(datetime);
                    break;
                case 'lastfm-total-playcount':
                    const lastFmTotalPlaycount = new LastFmTotalPlaycount(
                        self.lastfm,
                        step.username,
                        step.duration,
                        step.enabled
                    );
                    lastFmTotalPlaycount.init();
                    self.sequences.push(lastFmTotalPlaycount);
                    break;
                case 'lastfm-today-playcount':
                    const lastFmTodayPlaycount = new LastFmTodayPlaycount(
                        self.lastfm,
                        step.username,
                        step.duration,
                        step.enabled
                    );
                    lastFmTodayPlaycount.init();
                    self.sequences.push(lastFmTodayPlaycount);
                    break;
                case 'lastfm-last-played-track':
                    const lastFmLastPlayedTrack = new LastFmLastPlayedTrack(
                        self.lastfm,
                        step.username,
                        step.duration,
                        step.enabled
                    );
                    lastFmLastPlayedTrack.init();
                    self.sequences.push(lastFmLastPlayedTrack);
                    break;
                case 'lastfm-current-track':
                    const lastFmCurrentTrack = new LastFmCurrentTrack(
                        self.lastfm,
                        step.username,
                        step.duration,
                         step.enabled
                     );
                     lastFmCurrentTrack.init();
                     self.sequences.push(lastFmCurrentTrack);
                     break;
                case 'weather':
                    const weather = new Weather(
                        self.forecast,
                        step.lat,
                        step.long,
                        step.city,
                        step.duration,
                        step.enabled
                    );
                    weather.init();
                    self.sequences.push(weather);
                    break;
            }
        });
    }

    execute(step) {
        const name = this.sequences[step].type;
        const enabled = this.sequences[step].isEnabled();
        let duration = this.sequences[step].duration;

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
            (() => { this.execute(step); }).bind(this)
        );
    }
}

module.exports = ArduinoStation;
