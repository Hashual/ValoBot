const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getArmes } = require('../../API/valoInfosAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('armes-info')
        .setDescription('Afficher les informations d\'une arme')
        .addStringOption(option => option.setName('arme').setDescription('L\'arme dont vous souhaitez afficher les informations').setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply();
        const arme = interaction.options.getString('arme');
        const armes = await getArmes();
        const armeInfo = armes.find(a => a.displayName.toLowerCase() === arme.toLowerCase());
        if (!armeInfo) return interaction.editReply(`L'arme ${arme} n'existe pas`);
        
        console.log(armeInfo)

        const Embed = new EmbedBuilder()
            .setTitle(armeInfo.displayName)
            .setColor('#000000')
            .setThumbnail(armeInfo.displayIcon)
            .setFields(
                {
                    name: 'Nom',
                    value: armeInfo.displayName,
                    inline: true
                },
                {
                    name: 'Prix',
                    value: armeInfo.shopData.cost.toString(),
                    inline: true
                },
                { 
                    name : '     ',
                    value: '     ',
                    inline: true
                },
                {
                    name:'Dégats tête(0m)',
                    value:'**'+armeInfo.weaponStats.damageRanges[0].headDamage.toString()+'**',
                    inline: true
                },
                {
                    name:'Dégats corps(0m)',
                    value:'  **'+armeInfo.weaponStats.damageRanges[0].bodyDamage.toString()+'**',
                    inline: true
                },
                {
                    name:'Dégats jambes(0m)',
                    value:'  **'+armeInfo.weaponStats.damageRanges[0].legDamage.toString()+'**',
                    inline: true
                },
                {
                    name: 'Cadence de tir',
                    value: armeInfo.weaponStats.fireRate.toString()+' balles/s',
                    inline: true
                },
                {
                    name: '  '+'Capacité du chargeur',
                    value: armeInfo.weaponStats.magazineSize.toString(),
                    inline: true
                },
                {
                    name: '  '+'Temps de recharge',
                    value: armeInfo.weaponStats.reloadTimeSeconds.toString()+'s',
                    inline: true
                }
            )
            .setFooter({text: 'Informations fournies par valorant-api.com'})
            .setTimestamp();
        interaction.editReply({ embeds: [Embed]});
    }
}