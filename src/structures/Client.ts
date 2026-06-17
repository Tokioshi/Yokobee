import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command } from "./Command.js";

export class ExtendedClient extends Client {
    public commands: Collection<string, Command>;

    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds],
        });

        this.commands = new Collection<string, Command>();
    }
}
