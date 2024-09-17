const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { getCompetences } = require('../../API/valoInfosAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('agent-competences')
        .setDescription('Afficher les compétences d\'un agent')
        .addStringOption(option => option.setName('agent').setDescription('L\'agent dont vous souhaitez afficher les compétences').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const agent = interaction.options.getString('agent');
        const competences = await getCompetences();
        const agentCompetences = competences.find(a => a.displayName.toLowerCase() === agent.toLowerCase());
        if (!agentCompetences) return interaction.editReply(`L'agent ${agent} n'existe pas`);

        const precedent = new ButtonBuilder()
            .setCustomId('precedent')
            .setLabel('Précédent')
            .setStyle(ButtonStyle.Primary);
        
        const suivant = new ButtonBuilder()
            .setCustomId('suivant')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(precedent, suivant);

        const Embed = new EmbedBuilder()
            .setTitle(agentCompetences.displayName)
            .setColor('#' + agentCompetences.backgroundGradientColors[0].slice(0,6))
            .setThumbnail(agentCompetences.displayIcon)
            .setFields(
                {
                    name: 'Compétence 1',
                    value: agentCompetences.abilities[0].displayName,
                    inline: false
                },
                {
                    name: 'Description',
                    value: agentCompetences.abilities[0].description,
                    inline: false
                }
            )
            .setFooter({text: 'Informations fournies par valorant-api.com'})
            .setTimestamp();
            
        interaction.editReply({ embeds: [Embed], components: [row] });
        const reponse = await interaction.fetchReply();
        const collector = reponse.createMessageComponentCollector({time: 60000});
        let index = 0;
        collector.on('collect', async i => {
            if (i.customId === 'precedent') {
                if (index === 0) index = agentCompetences.abilities.length - 1;
                else index--;
            } else if (i.customId === 'suivant') {
                if (index === agentCompetences.abilities.length - 1) index = 0;
                else index++;
            }

            const Embed = new EmbedBuilder()
                .setTitle(agentCompetences.displayName)
                .setColor('#' + agentCompetences.backgroundGradientColors[0].slice(0,6))
                .setThumbnail(agentCompetences.displayIcon)
                .setFields(
                    {   
                        name: 'Compétence ' + (index + 1),
                        value: agentCompetences.abilities[index].displayName,
                        inline: false
                    },
                    {
                        name: 'Description',
                        value: agentCompetences.abilities[index].description,
                        inline: false
                    }
                )
                .setFooter({text: 'Informations fournies par valorant-api.com'})
                .setTimestamp();
            i.update({ embeds: [Embed] });
        });
        

    }
}