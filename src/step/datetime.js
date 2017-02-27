const Step = require("./step");

const config = require("config");
const moment = require("moment");

class Datetime  extends Step {
    constructor(dateFormat, timeFormat, duration, enabled) {
        super('Datetime', duration, enabled);

        this.dateFormat = dateFormat;
        this.timeFormat = timeFormat;
    }

    execute(board, lcd) {
        const date = moment().format(this.dateFormat);
        const time = moment().format(this.timeFormat);
        lcd.clear()
            .cursor(0, 0).print(date.substring(0,16))
            .cursor(1, 0).print(time.substring(0,16))
        ;
        board.info("LCD", "Datetime", {"date": date, "time": time});
    }
}

module.exports = Datetime;
