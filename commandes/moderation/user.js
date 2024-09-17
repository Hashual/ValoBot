const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-description')
        .setDescription('Afficher les informations d\'un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('L\'utilisateur dont vous souhaitez afficher les informations'))
        .addBooleanOption(option => option.setName('pdp').setDescription('Afficher la photo de profil')),
    async execute(interaction) {
        // Utilise l'utilisateur spécifié ou l'utilisateur qui a saisi la commande
        const specifiedUser = interaction.options.getMember('user') || interaction.member;

        // Attends que l'utilisateur soit complètement disponible
        await specifiedUser.fetch();

        // Récupère le vrai discriminant de l'utilisateur
        const trueDiscriminator = specifiedUser.user.discriminator !== '0000' ? specifiedUser.user.discriminator : '';

        // Récupère d'autres informations sur l'utilisateur
        const userId = specifiedUser.id;
        const accountCreatedAt = specifiedUser.user.createdAt.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

        // Construit la réponse sans l'URL de la photo de profil
        let response = `
            Voici les informations de ${specifiedUser.user.username}${trueDiscriminator ? `#${trueDiscriminator}` : ''} (ID : ${userId}).
            Date de création du compte : ${accountCreatedAt}
            Qui a rejoint le serveur le : ${specifiedUser.joinedAt.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}.
        `;

        // Si l'option 'pdp' est activée, ajoute l'URL de la photo de profil
        if (interaction.options.getBoolean('pdp')) {
            const avatarUrl = specifiedUser.displayAvatarURL();
            response += `\nAvatar : ${avatarUrl}`;
        }

        // Répond avec les informations
        await interaction.reply(response);
    },
};
