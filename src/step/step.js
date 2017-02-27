module.exports = class Step {
    constructor(type, duration, enabled) {
        this.type = type;
        this.duration = duration;
        this.enabled = enabled;
    }

    init() {}

    execute(board, lcd) {}

    isEnabled() {

        return this.enabled;
    }
}
