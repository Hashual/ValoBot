const { REST, Routes, Client, Events, Collection } = require('discord.js');
const { app_id, guildId, token_bot } = require('./config/config.json');
const fs = require('node:fs');
const path = require('node:path');

/**
 * @param {Client} client
 */
module.exports = (client) => {
	client.commands = new Collection();
	const commands = [];
	const commandFolderPath = path.join(__dirname, 'commandes');
	// Grab all the command files from the commands directory you created earlier
	const commandFolders = fs.readdirSync(commandFolderPath)
		.filter(file => fs.lstatSync(path.join(commandFolderPath, file)).isDirectory())
		.map(folder => path.join(commandFolderPath, folder) )

	for (const folder of commandFolders) {
	
		// Grab all the command files from the commands directory you created earlier
		const commandFiles = fs.readdirSync(folder).filter(file => file.endsWith('.js'));
	
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(folder, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {

				commands.push(command.data.toJSON());

				// Set the new commands in the client
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
	
	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(token_bot);
	
	// and deploy your commands!
	client.on(Events.ClientReady, async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: commands },
			);
	
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})
	
	// Call command callback at interaction create
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
	
		const command = interaction.client.commands.get(interaction.commandName);
	
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	
		await command.execute(interaction);

} )};