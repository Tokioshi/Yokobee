import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/Command.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Check bot latency."),

    async execute(interaction) {
        await interaction.reply("Pinging...");

        const sent = await interaction.fetchReply();

        const botLatency = sent.createdTimestamp - interaction.createdTimestamp;

        const apiLatency = interaction.client.ws.ping;

        await interaction.editReply({
            content: `🏓 Pong!\n` + `Bot: ${botLatency}ms\n` + `API: ${apiLatency}ms`,
        });
    },
} satisfies Command;
