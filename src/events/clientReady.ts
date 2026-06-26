import { Events } from "discord.js";
import { env } from "../config/env.js";
import type { Event } from "../structures/Event.js";
import mongoose from "mongoose";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[Client] Logged in as ${client.user.tag}`!);

        try {
            mongoose.connect(env.mongoURL);
            console.log("[Database] MongoDB connected successfully!")
        } catch (error) {
            console.error("Faild connecting to the database:", error);
        }
    },
} satisfies Event<Events.ClientReady>;
