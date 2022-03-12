const CustomHeader = require("./CustomHeader.js")
const CustomError = require("../types/Error")

class ClientOptions {
    constructor(options) {
        this.supportsHttp = Boolean;
        this.rotatingIp = Boolean;
        this.httpMethod = "GET" | "POST";
        this.websites = Array;
        this.isSafe = Boolean;
        this.autoScrapeConfig = { enabled: Boolean, file: String }
        if (options.autoScrapeConfig && options.autoScrapeConfig.enabled) {
            let configFile;
            try {
                configFile = require(options.autoScrapeConfig.file)
            } catch (error) {
                return new CustomError("An error has occured while creating the client:\nThe file provided for autoScrape config was not found (" + options.autoScrapeConfig.file + ")")
            }
            options = configFile
        }
        if (typeof(options.supportsHttp) !== "boolean") return new CustomError("An error has occured while creating the client:\n\"supportsHttp\" is not a boolean. Must be true/false")
        if (typeof(options.rotatingIp) !== "boolean") return new CustomError("An error has occured while creating the client:\n\"rotatingIp\" is not provided or is not a boolean. Must be true/false")
        if (options.header && typeof(options.header) != CustomHeader) return new CustomError("An error has occured while creating the client:\n\"hearder\" is not a valide custom header")
        return options;
    }
}
module.exports = ClientOptions