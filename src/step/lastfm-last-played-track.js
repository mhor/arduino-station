const Step = require("./step");

class LastFmLastPlayedTrack  extends Step {
    constructor(lastfm, lastfmUsername, duration, enabled) {
        super("LastFmLastPlayedTrack", duration, enabled);

        this.recentTrackLastfm = null;
        this.lastfmUsername = lastfmUsername;
        this.lastfm = lastfm;
        this.lastPlayedTrack = null;
    }

    init() {
        this.recentTrackLastfm = this.lastfm.stream(this.lastfmUsername);

        const self = this;
        this.recentTrackLastfm.on("lastPlayed", (track) => {
            self.lastPlayedTrack = track;
        });

        this.recentTrackLastfm.start();
    }

    execute(board, lcd) {
        const artist = this.lastPlayedTrack.artist["#text"];
        const track = this.lastPlayedTrack.name;
        const album = this.lastPlayedTrack.album["#text"];

        lcd.clear()
            .cursor(0, 0).print(track.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            .cursor(1, 0).print(artist.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        ;

        board.info("LCD", "Lastfm (last track)", {"artist": artist, "track": track});
    }

    isEnabled() {
        if (super.isEnabled() !== true) {
            return false;
        }

        if (this.lastPlayedTrack) {
            return true;
        }
        return false;
    }
}

module.exports = LastFmLastPlayedTrack;
