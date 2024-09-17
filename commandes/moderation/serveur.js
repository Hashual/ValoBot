const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nbmembres')
		.setDescription('Afficher le nombre de membres.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`Nom du serveur :  ${interaction.guild.name},  Nombre de membres : ${interaction.guild.memberCount}`);
	},
};