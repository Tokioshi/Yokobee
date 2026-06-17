import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ExtendedClient } from "../structures/Client.js";
import type { Event } from "../structures/Event.js";

export async function loadEvents(client: ExtendedClient) {
    const eventsPath = path.join(process.cwd(), "src", "events");
    const eventFiles = await readdir(eventsPath);

    for (const file of eventFiles) {
        if (!file.endsWith(".ts")) continue;

        const filePath = path.join(eventsPath, file);
        const eventModule = await import(`file://${filePath}`);
        const event = eventModule.default as Event;

        if (!event?.name || !event?.execute) {
            console.warn(`[Event] Invalid event file: ${file}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(`[Event] Loaded: ${String(event.name)}`);
    }
}
