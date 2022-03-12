# Dddos-Script
This is a little script to ddos a website. This is for example purposes only. I am not responsable of what you do with it

What is ddos? Ddos is an attack on a website by sending alot of requests

# How it works?

Before starting, it's better to have a vpn/proxy installed

You must have nodeJS v16 installed on your computer. You can get it here: https://nodejs.org

The default site is kremlin.ru you can change it trough the config.js file. 

# Config Options

**ClientOptions** ( [Source code](https://github.com/pauldb09/Dddos-Example/blob/main/constants/ClientOptions.js) )

`httpMethod` : The http method you want to use to request the website. Only `GET` and `POST` are supported. If you use the post method, you will have to provide a [CustomHeader](https://github.com/pauldb09/Dddos-Example/blob/main/constants/CustomHeader.js)

`header` : The header used to request the website. Must be a [CustomHeader](https://github.com/pauldb09/Dddos-Example/blob/main/constants/CustomHeader.js)

`autoScrapeConfig` : If the client should automatically extract the config file. Provide an object like this: `{enabled:true, file:"file.js"}`. Accepts js & json files

