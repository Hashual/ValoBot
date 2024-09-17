const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getArmes } = require('../../API/valoInfosAPI.js');
const { stringSimilarity } = require('string-similarity-js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('skins-info')
        .setDescription('Afficher les informations d\'un skin')
        .addStringOption(option => option.setName('skin').setDescription('Le skin que vous souhaitez afficher').setRequired(true))
        .addStringOption(option => option.setName('arme').setDescription('L\'arme dont vous souhaitez afficher le skin').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        
        let arme = interaction.options.getString('arme');
        if (arme == 'couteau' || arme == 'cut'  || arme == 'knife') arme = 'Mêlée';
        const armes = await getArmes();
        const armeInfo = armes.find(s => s.displayName.toLowerCase() === arme.toLowerCase());
        if (!armeInfo) return interaction.editReply(`L'arme ${arme} n'existe pas`);
        console.log(armes)
        
        const skin = (interaction.options.getString('skin').match(/((.*))/)?.[1]).toLowerCase();
        const skinSimilarities = armeInfo.skins.map( a => {
            return {
                data: a,
                similarity: stringSimilarity((a.displayName.match(/((.*))/)?.[1] ?? "").replaceAll('(', '').replaceAll(')', ''), skin)
            }
        }).sort((a, b) => b.similarity - a.similarity);
        
        if (skinSimilarities[0].similarity < 0.2) return interaction.editReply(`Le skin ${skin} n'existe pas`);
        const skinInfo = skinSimilarities[0].data;
        const rows = [];

        const skinName = skinInfo.displayName.match(/((.*))/)?.[1] ?? "";
        console.log(skinName, skinInfo, skinInfo.displayName, skinInfo.displayName.match(/((.*))/));
        const skinsWithSameName = armeInfo.skins.filter(s => s.displayName.match(/((.*))/)?.[1] === skinName);
        if (skinsWithSameName.length > 1) {

            const skinsList = new SelectMenuBuilder()
                .setCustomId('skinsList')
                .setPlaceholder('Choisissez un skin')
                .setMinValues(1)
                .setMaxValues(1);

            skinsWithSameName.forEach(s => {
                skinsList.addOptions({
                    label: s.displayName,
                    value: s.uuid
                })
            });

            const row = new ActionRowBuilder()
                .addComponents(skinsList);
            rows.push(row)
        }


        const chromaPrecedent = new ButtonBuilder()
            .setCustomId('chromaPrecedent')
            .setLabel('Chroma Précédent')
            .setStyle(ButtonStyle.Primary);

        const chromaSuivant = new ButtonBuilder()
            .setCustomId('chromaSuivant')
            .setLabel('Chroma suivant')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(chromaPrecedent, chromaSuivant);
        rows.push(row)

        const Embed = new EmbedBuilder()
            .setTitle(skinInfo.displayName)
            .setColor('#000000')
            .setImage(skinInfo.displayIcon ?? skinInfo.fullRender)
            .setFooter({text: 'Informations fournies par valorant-api.com'})
            .setTimestamp();
        interaction.editReply({ embeds: [Embed], components: rows });

        const reponse = await interaction.fetchReply();
        const collector = reponse.createMessageComponentCollector({time: 60000});
        let index = 0;
        collector.on('collect', async i => {
            if (i.customId === "chromaPrecedent") {
                if (index === 0) index = skinInfo.chromas.length - 1;
                else index--;
            }else if (i.customId === "chromaSuivant") {
                if (index === skinInfo.chromas.length - 1) index = 0;
                else index++;
            }

            const Embed = new EmbedBuilder()
                .setTitle(skinInfo.chromas[index].displayName)
                .setColor('#000000')
                .setImage(skinInfo.chromas[index].displayIcon ?? skinInfo.chromas[index].fullRender)
                .setFooter({text: 'Informations fournies par valorant-api.com'})
                .setTimestamp();
            i.update({ embeds: [Embed] });
        });


        }
}
