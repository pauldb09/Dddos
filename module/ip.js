const EventEmitter = require('node:events');
const CustomError = require("../types/Error")


class ipManager extends EventEmitter {
    constructor(options) {
        super();
        if (!options.timeout || typeof(options.timeout) !== "number") return new CustomError("The timeout provided for ip switcher is not valid")
        this.options = options;
        this._ready = false;
        this.isReady = false;
    }

    async build() {
        if (this._ready) return new CustomError("Requested to build the client but it's already ready.")
        this._ready = true;
        this.isReady = true
        this.emit("clientReady", true)
        return this
    }

    async switchIp(requestId = {}) {

    }

    async getBetterIp(options = {}) {

    }
}
module.exports = ipManager