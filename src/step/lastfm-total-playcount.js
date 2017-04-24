const Step = require("./step");

class LastFmTotalPlaycount extends Step {
    constructor(lastfm, lastfmUsername, duration, enabled) {
        super("LastFmTotalPlaycount", duration, enabled);

        this.lastfmUsername = lastfmUsername;
        this.lastfm = lastfm;
    }

    execute(board, lcd) {
        var request = this.lastfm.request("user.getrecenttracks", {
            'user': this.lastfmUsername,
            'limit': 1,
            handlers: {
                success: (data) => {
                    const playcount = data["recenttracks"]["@attr"]["total"];
                    lcd.clear()
                        .cursor(0, 0).print("Total Playcount")
                        .cursor(1, 0).print(playcount)
                    ;

                    board.info("LCD", "Lastfm (total playcount)", {"playcount": playcount});
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

module.exports = LastFmTotalPlaycount;
