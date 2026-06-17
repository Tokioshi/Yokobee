import { REST, Routes } from "discord.js";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { env } from "./config/env.js";
import type { Command } from "./structures/Command.js";

const commands = [];
const commandsPath = path.join(process.cwd(), "src", "commands");
const categories = await readdir(commandsPath);

for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = await readdir(categoryPath);

    for (const file of commandFiles) {
        if (!file.endsWith(".ts")) continue;

        const filePath = path.join(categoryPath, file);
        const commandModule = await import(`file://${filePath}`);
        const command = commandModule.default as Command;

        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(env.token);

await rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), {
    body: commands,
});

console.log(`[Deploy] Registered ${commands.length} command(s).`);
