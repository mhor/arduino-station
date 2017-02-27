const Step = require("./step");

module.exports = class LastFmCurrentTrack extends Step {
    constructor(lastfm, lastfmUsername, duration, enabled) {
        super("LastFmCurrentTrack", duration, enabled);

        this.lastfm = lastfm;
        this.nowPlayingTrack = null;
        this.recentTrackLastfm = null;
        this.lastfmUsername = lastfmUsername;
    }

    init() {
        this.recentTrackLastfm = this.lastfm.stream(this.lastfmUsername);

        const self = this;
        this.recentTrackLastfm.on("nowPlaying", (track) => {
            self.nowPlayingTrack = track;
        });

        this.recentTrackLastfm.start();
    }

    execute(board, lcd) {
        const artist = this.nowPlayingTrack.artist["#text"];
        const track = this.nowPlayingTrack.name;
        const album = this.nowPlayingTrack.album["#text"];

        lcd.clear()
            .cursor(0, 0).print(track.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            .cursor(1, 0).print(artist.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        ;

        board.info("LCD", "lastfm (current track)", {"artist": artist, "track": track});
    }

    isEnabled() {
        if (super.isEnabled() !== true) {
            return false;
        }

        if (this.nowPlayingTrack) {
            return true;
        }
        return false;
    }
}
