import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("button")
        .setDescription("Manage button, simply as that")
        .addSubcommand((sub) =>
            sub.setName("create").setDescription("Create a button from a embed"),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {},
} satisfies Command;
