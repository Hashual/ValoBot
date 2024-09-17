const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAgents } = require('../../API/valoInfosAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('agent-info')
        .setDescription('Afficher les informations d\'un agent')
        .addStringOption(option => option.setName('agent').setDescription('L\'agent dont vous souhaitez afficher les informations').setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply();
        const agent = interaction.options.getString('agent');
        const agents = await getAgents();
        const agentInfo = agents.find(a => a.displayName.toLowerCase() === agent.toLowerCase());
        if (!agentInfo) return interaction.editReply(`L'agent ${agent} n'existe pas`);


        const Embed = new EmbedBuilder()
            .setTitle(agentInfo.displayName)
            .setColor('#' + agentInfo.backgroundGradientColors[0].slice(0,6))
            .setThumbnail(agentInfo.displayIcon)
            .setFields(
                {
                    name: 'Nom complet',
                    value: agentInfo.displayName,
                    inline: true
                },
                {
                    name: 'Type',
                    value: agentInfo.role.displayName,
                    inline: true
                },
                {
                    name: 'Biographie',
                    value: agentInfo.description,
                    inline: false
                }
            )
            .setFooter({text: 'Informations fournies par valorant-api.com'})
            .setTimestamp();

        interaction.editReply({ embeds: [Embed]});
    },
        
}