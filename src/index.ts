import { ExtendedClient } from "./structures/Client.js";
import { env } from "./config/env.js";
import { loadHandlers } from "./handler/index.js";

const client = new ExtendedClient();

await loadHandlers(client);

await client.login(env.token);
