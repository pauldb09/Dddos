const ClientOptions = require("../constants/ClientOptions.js")
const WebRequest = require("../types/WebRequest")
const CustomError = require("../types/Error")


class Client {
    constructor(options) {
        this._ready = false
        this.isReady = false
        this.options = new ClientOptions(options)
    }

    async build() {
        if (this._ready) throw new CustomError("Requested to build the client but it's already ready.")
        this._ready = true;
        this.isReady = true
        return this
    }

    async createHttpRequest(options = {}) {
        const request = new WebRequest(this.options.httpMethod, options)
        return request.build()
    }
}
module.exports = Client