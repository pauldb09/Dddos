const BaseError = require("../constants/BaseError")

class CustomError {
    constructor(error) {
        if (BaseError.error) {
            throw new Error(BaseError.error)
        } else {
            if (typeof error == "string") {
                throw new Error(error)
            } else {
                throw new Error("An uknown error has occured! " + error + "")
            }
        }
    }
}
module.exports = CustomError;