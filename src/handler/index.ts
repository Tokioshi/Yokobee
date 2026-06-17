import type { ExtendedClient } from "../structures/Client.js";
import { loadCommands } from "./commands.js";
import { loadEvents } from "./events.js";

export async function loadHandlers(client: ExtendedClient) {
    await loadCommands(client);
    await loadEvents(client);
}
