import { EmbedBuilder, GuildMember, InteractionContextType, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Look into someone's avatar or yours")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("The user you want to look up their avatar")
                .setRequired(false),
        )
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const member = (interaction.options.getMember("user") || interaction.member) as GuildMember;

        const avatar = member.displayAvatarURL({
            size: 512,
            extension: "png",
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("DarkBlue")
                    .setTitle(`${member.displayName}'s Avatar`)
                    .setImage(avatar),
            ],
        });
    },
} satisfies Command;
