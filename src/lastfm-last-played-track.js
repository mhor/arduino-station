const isOnline = require('is-online');

function LastFmLastPlayedTrack(lastfm, lastfmUsername, duration, enabled) {
    this.type = 'LastFmLastPlayedTrack';
    this.recentTrackLastfm = null;
    this.duration = duration;
    this.enabled = enabled;
    this.lastfmUsername = lastfmUsername;
    this.lastfm = lastfm;
    this.lastPlayedTrack = null;
}

LastFmLastPlayedTrack.prototype.init = function() {
    this.recentTrackLastfm = this.lastfm.stream(this.lastfmUsername);

    var self = this;
    this.recentTrackLastfm.on("lastPlayed", function(track) {
        self.lastPlayedTrack = track;
    });

    this.recentTrackLastfm.start();
}

LastFmLastPlayedTrack.prototype.execute = function(board, lcd) {
    var artist = this.lastPlayedTrack.artist["#text"];
    var track = this.lastPlayedTrack.name;
    var album = this.lastPlayedTrack.album["#text"];

    lcd.clear()
        .cursor(0, 0).print(track.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .cursor(1, 0).print(artist.substring(0,16).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    ;

    board.info("LCD", "Lastfm (last track)", {"artist": artist, "track": track});
}

LastFmLastPlayedTrack.prototype.isEnabled = function() {
    if (this.lastPlayedTrack !== null) {
        return true;
    }
    return false;
}

module.exports = LastFmLastPlayedTrack;
