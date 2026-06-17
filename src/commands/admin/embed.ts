import {
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    LabelBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags,
    EmbedBuilder,
} from "discord.js";
import type { Command } from "../../structures/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Mange embed, simply as that")
        .addSubcommand((sub) => sub.setName("create").setDescription("Create an embed"))
        .addSubcommand((sub) =>
            sub
                .setName("edit")
                .setDescription("Edit an embed")
                .addStringOption((opt) =>
                    opt
                        .setName("message_id")
                        .setDescription("The message ID where it's contained embed")
                        .setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "create":
                await interaction.showModal(
                    new ModalBuilder()
                        .setTitle("Create an Embed")
                        .setCustomId("embed_create")
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Color")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("embed_color")
                                        .setStyle(TextInputStyle.Short),
                                ),
                        )
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Title")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("embed_title")
                                        .setStyle(TextInputStyle.Short),
                                ),
                        )
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Description")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("embed_description")
                                        .setStyle(TextInputStyle.Paragraph),
                                ),
                        )
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Image URL")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("embed_image")
                                        .setStyle(TextInputStyle.Short)
                                        .setRequired(false),
                                ),
                        ),
                );
                return;
            case "edit":
                const message_id = interaction.options.getString("message_id", true);

                if (!interaction.channel) {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("Channel not found. Where were we?"),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                let targetMessage;

                try {
                    targetMessage = await interaction.channel?.messages.fetch(message_id);
                } catch (error) {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "Failed to fetch the message. Probably unknow message.",
                                ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                if (
                    targetMessage?.author.id !== interaction.client.user.id ||
                    !targetMessage?.embeds.length
                ) {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "I cannot find the embed, or the message is not sent by me.",
                                ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                const existingEmbed = targetMessage?.embeds[0];

                console.log(existingEmbed)

                interaction.showModal(
                    new ModalBuilder()
                        .setTitle("Edit an Embed")
                        .setCustomId(`embed_edit:${message_id}`)
                        .addLabelComponents(
                            new LabelBuilder().setLabel("Color").setTextInputComponent(
                                new TextInputBuilder()
                                    .setCustomId("embed_color")
                                    .setStyle(TextInputStyle.Short)
                                    .setValue(existingEmbed.hexColor || ""),
                            ),
                        )
                        .addLabelComponents(
                            new LabelBuilder().setLabel("Title").setTextInputComponent(
                                new TextInputBuilder()
                                    .setCustomId("embed_title")
                                    .setStyle(TextInputStyle.Short)
                                    .setValue(existingEmbed.title || ""),
                            ),
                        )
                        .addLabelComponents(
                            new LabelBuilder().setLabel("Description").setTextInputComponent(
                                new TextInputBuilder()
                                    .setCustomId("embed_description")
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setValue(existingEmbed.description || ""),
                            ),
                        )
                        .addLabelComponents(
                            new LabelBuilder().setLabel("Image").setTextInputComponent(
                                new TextInputBuilder()
                                    .setCustomId("embed_image")
                                    .setStyle(TextInputStyle.Short)
                                    .setValue(existingEmbed.image?.url || "")
                                    .setRequired(false),
                            ),
                        ),
                );
                return;
        }
    },
} satisfies Command;
