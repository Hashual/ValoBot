const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GetLastSeasionStatistic, GetPlayerData } = require('../../API/valoStatsAPI.js');
const { GetMessage } = require('../../Fonctions/getId.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player-stats')
        .setDescription('Afficher les statistiques d\'un joueur')
        .addStringOption(option => option.setName('joueur').setDescription('Le joueur dont vous souhaitez afficher les statistiques').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const joueur = interaction.options.getString('joueur');
        const etiquette = await GetPlayerData(joueur);
        const stats = await GetLastSeasionStatistic(joueur);
        console.log(stats);
        GetMessage(interaction.client, interaction.guild);
        if (!etiquette) return interaction.editReply(`Le joueur ${joueur} n'existe pas`);

        const Embed = new EmbedBuilder()
            .setTitle(`${etiquette.name} ${stats.metadata.shortName}`)
            .setColor('#000000')
            .setThumbnail(stats.stats.rank.metadata.iconUrl)  
            .setFields(
                {
                    name : 'Kills',
                    value : `${stats.stats.kills.displayValue}`,
                    inline : true
                },
                {
                    name : 'Morts',
                    value : `${stats.stats.deaths.displayValue}`,
                    inline : true
                },
                {
                    name : 'Assists',
                    value : `${stats.stats.assists.displayValue}`,
                    inline : true
                },
                {
                    name : 'Victoires',
                    value : `${stats.stats.matchesWon.displayValue}`,
                    inline : true
                },
                {
                    name : 'Défaites',
                    value : `${stats.stats.matchesLost.displayValue}`,
                    inline : true
                },
                {
                    name : 'MVP',
                    value : `${stats.stats.mVPs.displayValue}`,
                    inline : true
                },


            ) 
            .setFooter({ text: 'Informations fournies par tracker.gg' })
            .setTimestamp();
        interaction.editReply({ embeds: [Embed] });
    },

};

