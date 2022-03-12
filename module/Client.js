const ClientOptions = require("../constants/ClientOptions.js")
const WebRequest = require("../types/WebRequest")
const EventEmitter = require('node:events');
const CustomError = require("../types/Error")


class Client extends EventEmitter {
    constructor(options) {
        super();
        this._ready = false;
        this.isReady = false;
        this.requests = new Map()
        this.options = new ClientOptions(options)
    }

    async build() {
        if (this._ready) return new CustomError("Requested to build the client but it's already ready.")
        this._ready = true;
        this.isReady = true
        this.emit("clientReady", true)
        return this
    }

    async reBuildRequest(requestId = {}) {
        if (!requestId) return new CustomError("Please provide a requestId for the reBuildRequest function")
        const req = this.requests.get(requestId)
        if (!req) return new CustomError("No request found with this ID")
        if (req.status == 2) return new CustomError("This webrequest is alreay built and ready")
        return req.rebuild()
    }

    async createHttpRequest(options = {}) {
        const request = new WebRequest(this, options)
        this.requests.set(request._uid, request)
        return request.build()
    }
}
module.exports = Client