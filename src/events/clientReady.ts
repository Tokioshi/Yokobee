import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Events,
    TextChannel,
} from "discord.js";
import type { Event } from "../structures/Event.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[Client] Logged in as ${client.user.tag}`);
    },
} satisfies Event<Events.ClientReady>;
