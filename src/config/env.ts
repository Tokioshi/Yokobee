import "dotenv/config";

function getEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
}

export const env = {
    token: getEnv("DISCORD_TOKEN"),
    clientId: getEnv("CLIENT_ID"),
    guildId: getEnv("GUILD_ID"),
};
