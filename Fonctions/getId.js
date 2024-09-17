const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { token_bot } = require('../config/config.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {


    GetMessage : async (client, guild) => {
        let lastPick = 100
        let listMessages =[]
        while (lastPick != 100) {
            let messagesTmp = await guild.channels.cache.get('1179729772088152114').messages.fetch({limit: lastPick, cache: true})
            listMessages = listMessages.concat(messagesTmp)
            lastPick = messagesTmp.size
        }
        console.log(listMessages)
        return listMessages
    }
}
