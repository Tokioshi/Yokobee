import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ExtendedClient } from "../structures/Client.js";
import type { Command } from "../structures/Command.js";

export async function loadCommands(client: ExtendedClient) {
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

            if (!command?.data?.name || !command?.execute) {
                console.warn(`[Command] Invalid command file: ${file}`);
                continue;
            }

            command.category = category;
            client.commands.set(command.data.name, command);

            console.log(`[Command] Loaded: ${command.data.name}`);
        }
    }
}
