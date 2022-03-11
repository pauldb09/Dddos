class CustomError {
    constructor(error) {
        if (typeof error == "string") {
            throw new Error(error)
        } else {
            throw new Error("An uknown error has occured! " + error + "")
        }
    }
}
module.exports = CustomError;