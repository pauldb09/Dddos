const CustomError = require("../types/Error")

class CustomHeader {
    constructor(options) {
        this.build = Boolean;
        this.library = "bas" | "got" | "ddos-guard";
        this.requestHeader = "";
        if (!options.requestHeader || !options.library) return new CustomError("[Custom header] Please provide all arguments. See https://github.com/pauldb09/Dddos-Example/blob/main/constants/CustomHeader.js")
        if (typeof(options.requestHeader) !== "object") return new CustomError("[Custom Header] the requestHeader option must be an object, use same params as request module")
        if (!["got", "ddos-guard", "base"].includes(options.library)) return new CustomError("[Custom Header] the library provided is not valid! must be got, ddos-guard or base")
        return { content: options.requestHeader, build: true, framework: options.library }
    }
}
module.exports = CustomHeader