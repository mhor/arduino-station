var config = require("config");
var moment = require("moment");

function Datetime(duration, enabled) {
    this.type = 'Datetime';
    this.duration = duration;
    this.enabled = enabled;
}

Datetime.prototype.init = function() {
}

Datetime.prototype.execute = function(board, lcd) {
    var date = moment().format("ll");
    var time = moment().format("LT");
    lcd.clear()
        .cursor(0, 0).print(date.substring(0,16))
        .cursor(1, 0).print(time.substring(0,16))
    ;
    board.info("LCD", "Datetime", {"date": date, "time": time});
}

Datetime.prototype.isEnabled = function() {
    return true;
}

module.exports = Datetime;
