import { ExtendedClient } from "./structures/Client.js";
import { env } from "./config/env.js";
import { loadHandlers } from "./handler/index.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const client = new ExtendedClient();

await loadHandlers(client);

await client.login(env.token);
