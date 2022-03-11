const Constants = require("../constants/CustomHeader")
const CustomError = require("../types/Error")
const fetch = require("node-fetch")
const url_patern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;

class WebRequest {
    constructor(httpMethod, options) {
        this.options = options;
        this._validateOptions(options)
        this.method = httpMethod;
        this.executed = 0;
        this.errored = false;
        this.request = Constants.REQUEST_CREATING
    }

    delay(n) {
        return new Promise(function(resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    /**
     *Builds this Http request
     * @param {forceBuild} forceBuild If you want to force the build of this request
     * @returns {void}
     * @private
     */
    build(forceBuild = {}) {
        const options = this.options
        const method = this.method
        for (this.executed; this.executed < this.options.repeat; this.executed++) {
            if (this.errored > 10) return new CustomError("More than 10 failed requests. Stopping...")
            try {
                console.debug("[Web request] Attempting to " + method + " the following Url:  " + options.targetUrl + "")
                fetch(options.targetUrl).then(req => {
                    console.debug(`Got ${req.status}`)

                })
            } catch (error) {
                this.errored++
                    return new CustomError(error)
            }
            this.delay(this.options.requestDelay)
        }
    }

    async _validateOptions(options) {
        if (!url_patern.test(options.targetUrl)) return new CustomError("The provided URl for the the \"createHttpRequest\" is not a valid url!")
        if (typeof(options.defaultSettings) !== "boolean") return new CustomError("An error has occured while creating the http request:\n\"defaultSettings\" is not provided or is not a boolean. Must be true/false")
        if (typeof(options.repeat) !== "number") return new CustomError("An error has occured while creating the http request:\n\"number\" is not provided or is not a valid number")
        if (typeof(options.requestDelay) !== "number") return new CustomError("An error has occured while creating the http request:\n\"requestDelay\" is not provided or is not a valid number")
        if (options.requestDelay < 0 || options.requestDelay > 60000) return new CustomError("The repeat option is not in the 0-6000 range.")
        if (options.repeat < 0 || options.repeat > 50000) return new CustomError("The repeat option is not in the 0-5000 range.")
        return true
    }
}
module.exports = WebRequest