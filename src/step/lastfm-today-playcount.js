const Step = require("./step");

class LastFmTodayPlaycount extends Step {
    constructor(lastfm, lastfmUsername, duration, enabled) {
        super("LastFmTodayPlaycount", duration, enabled);

        this.lastfmUsername = lastfmUsername;
        this.lastfm = lastfm;
    }

    execute(board, lcd) {
        var todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        const request = this.lastfm.request("user.getrecenttracks", {
            "user": this.lastfmUsername,
            "limit": 1,
            "from": todayMidnight.getTime() / 1000,
            "to": Math.floor(new Date().getTime() / 1000),
            handlers: {
                success: (data) => {
                    const playcount = data["recenttracks"]["@attr"]["total"];
                    lcd.clear()
                        .cursor(0, 0).print("Today Playcount")
                        .cursor(1, 0).print(playcount)
                    ;

                    board.info("LCD", "Lastfm (Today playcount)", {"playcount": playcount});
                }
            }
        });
    }

    isEnabled() {
        if (super.isEnabled() !== true) {
            return false;
        }

        return true;
    }
}

module.exports = LastFmTodayPlaycount;
