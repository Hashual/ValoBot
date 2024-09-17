const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { token_bot } = require('./config/config.json');
const fs = require('node:fs');
const path = require('node:path');

const gatewayIntents = [];
for (key in GatewayIntentBits) {
	gatewayIntents.push(GatewayIntentBits[key]);
}

const partials = [];
for (key in Partials) {
	partials.push(Partials[key]);
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.setMaxListeners(0);

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	console.log(client.guilds.cache.map(g => g.name));
});

require('./deploy-command.js')(client);


// Log in to Discord with your client's token
client.login(token_bot);