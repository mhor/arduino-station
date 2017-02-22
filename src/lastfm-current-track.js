const isOnline = require('is-online');

function LastFmCurrentTrack(lastfm, lastfmUsername, duration, enabled) {
    this.type = 'LastFmCurrentTrack';
    this.lastfm = lastfm;
    this.nowPlayingTrack = null;
    this.recentTrackLastfm = null;
    this.lastfmUsername = lastfmUsername;
    this.duration = duration;
    this.enabled = enabled;
}

LastFmCurrentTrack.prototype.init = function() {
    this.recentTrackLastfm = this.lastfm.stream(this.lastfmUsername);

    var self = this;
    this.recentTrackLastfm.on("nowPlaying", function(track) {
        self.nowPlayingTrack = track;
    });

    this.recentTrackLastfm.start();
}

LastFmCurrentTrack.prototype.execute = function(board, lcd) {
    var artist = this.nowPlayingTrack.artist["#text"];
    var track = this.nowPlayingTrack.name;
    var album = this.nowPlayingTrack.album["#text"];

    lcd.clear()
        .cursor(0, 0).print(track.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .cursor(1, 0).print(artist.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    ;

    board.info("LCD", "lastfm (current track)", {"artist": artist, "track": track});
}

LastFmCurrentTrack.prototype.isEnabled = function() {
    if (this.nowPlayingTrack !== null) {
        return true;
    }
    return false;
}

module.exports = LastFmCurrentTrack;
