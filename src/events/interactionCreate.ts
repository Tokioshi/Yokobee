import {
    EmbedBuilder,
    Events,
    MessageFlags,
    ChannelType,
    LabelBuilder,
    ModalBuilder,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
    TextChannel,
    PermissionFlagsBits,
} from "discord.js";
import type { Event } from "../structures/Event.js";
import type { ExtendedClient } from "../structures/Client.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const client = interaction.client as ExtendedClient;
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                await interaction.reply({
                    content: "Command not found.",
                    ephemeral: true,
                });
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(
                    `[Command Error] ${interaction.commandName}`,
                    error,
                );

                const payload = {
                    content:
                        "Something went wrong while executing this command.",
                    ephemeral: true,
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(payload);
                } else {
                    await interaction.reply(payload);
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "suggestion") {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const suggest = interaction.fields.getTextInputValue("suggest");

                const channel = interaction.client.channels.cache.get(
                    "1516419487065444534",
                );

                if (channel && channel instanceof TextChannel) {
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("DarkBlue")
                                .setAuthor({
                                    name: `Suggestion from ${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({
                                        size: 512,
                                        extension: "png",
                                    }),
                                })
                                .setThumbnail(
                                    interaction.user.displayAvatarURL({
                                        size: 512,
                                        extension: "png",
                                    }),
                                )
                                .setDescription(suggest)
                                .addFields(
                                    {
                                        name: "Suggester",
                                        value: `${interaction.user}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Time",
                                        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                                        inline: true,
                                    },
                                ),
                        ],
                    });

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Green")
                                .setDescription(
                                    "Your suggestion has been recorded, thanks!",
                                ),
                        ],
                    });
                    return;
                }

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                "Seems like I can't find the channel to forward your message.\nPlease report this issue to the developer for further assistance.",
                            ),
                    ],
                });
            }

            if (interaction.customId === "embed_create") {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const embed_color =
                    interaction.fields.getTextInputValue("embed_color");
                const embed_title =
                    interaction.fields.getTextInputValue("embed_title");
                const embed_description =
                    interaction.fields.getTextInputValue("embed_description");
                const embed_image =
                    interaction.fields.getTextInputValue("embed_image");

                if (
                    !interaction.channel ||
                    interaction.channel.type !== ChannelType.GuildText
                ) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "This channel is not a text channel.",
                                ),
                        ],
                    });
                    return;
                }

                if (!/^#?[0-9A-F]{6}$/i.test(embed_color)) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "The color need to be a valid hex code, e.g: #FF0000",
                                ),
                        ],
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(embed_color as `#${string}`)
                    .setTitle(embed_title)
                    .setDescription(embed_description);

                if (embed_image) {
                    embed.setImage(embed_image);
                }

                try {
                    await interaction.channel.send({
                        embeds: [embed],
                    });

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Green")
                                .setDescription("Successfully sent the embed!"),
                        ],
                    });
                } catch (error) {
                    console.log("Error when sending the embed:", error);

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "Failed when sending the embed. Refer to the console.",
                                ),
                        ],
                    });
                }
            }

            if (interaction.customId === "open_ticket") {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(
                                "Creating your ticket, please wait...",
                            ),
                    ],
                    flags: MessageFlags.Ephemeral,
                });

                try {
                    const channel = await interaction.guild?.channels
                        .create({
                            name: `ticket-${interaction.user.username}`,
                            topic: `Created by ${interaction.user}`,
                            parent: "1516825539825107105",
                            permissionOverwrites: [
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        })
                        .then(async (ch) => {
                            await ch.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("#374dc2")
                                        .setAuthor({
                                            name: `Ticket ${interaction.user.username}`,
                                            iconURL:
                                                interaction.user.displayAvatarURL(
                                                    {
                                                        size: 512,
                                                        extension: "png",
                                                    },
                                                ),
                                        })
                                        .setDescription(
                                            `Here is the detail if your information that you just create:`,
                                        )
                                        .addFields(
                                            {
                                                name: "Issue",
                                                value: `${interaction.fields.getTextInputValue("issue_description")}`,
                                            },
                                            {
                                                name: "Additional",
                                                value: `${interaction.fields.getTextInputValue("additional_information") ? interaction.fields.getTextInputValue("additional_information") : "None"}`,
                                            },
                                        )
                                        .setFooter({ text: "Creation Time" })
                                        .setTimestamp(),
                                ],
                            });

                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Green")
                                        .setDescription(
                                            `Your ticket is ready at ${ch}!`,
                                        ),
                                ],
                            });
                        });
                } catch (error) {
                    console.error("Error when creating a ticket:", error);

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "Something went wrong when creating the ticket.",
                                ),
                        ],
                    });
                    return;
                }
            }

            if (interaction.customId.startsWith("embed_edit:")) {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const [, messageId] = interaction.customId.split(":");
                const embed_color = interaction.fields
                    .getTextInputValue("embed_color")
                    .trim();
                const embed_title = interaction.fields
                    .getTextInputValue("embed_title")
                    .trim();
                const embed_description = interaction.fields
                    .getTextInputValue("embed_description")
                    .trim();
                const embed_image =
                    interaction.fields.getTextInputValue("embed_image") || null;

                if (!/^#?[0-9A-F]{6}$/i.test(embed_color)) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    "The color need to be a valid hex code, e.g: #FF0000",
                                ),
                        ],
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(embed_color as `#${string}`)
                    .setTitle(embed_title)
                    .setDescription(embed_description);

                if (embed_image) {
                    try {
                        embed.setImage(embed_image);
                    } catch (_) {}
                }

                let targetMessage;

                try {
                    targetMessage =
                        await interaction.channel?.messages.fetch(messageId);
                } catch (error) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Failed")
                                .setDescription(
                                    "Failed to edit the embed. The message might have been deleted.",
                                ),
                        ],
                    });
                    return;
                }

                await targetMessage?.edit({
                    embeds: [embed],
                });

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription("The embed successfully edited!"),
                    ],
                });
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === "suggest") {
                interaction.showModal(
                    new ModalBuilder()
                        .setTitle("Suggestion")
                        .setCustomId("suggestion")
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "Your suggestion is important to improve our bot. Please use your kind word when filling those suggestion field. We all appreciate your time for suggesting your idea for our bot.",
                            ),
                        )
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Your Suggestion")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("suggest")
                                        .setStyle(TextInputStyle.Paragraph),
                                ),
                        ),
                );
            }

            if (interaction.customId === "open_ticket") {
                interaction.showModal(
                    new ModalBuilder()
                        .setTitle("Ticket Form")
                        .setCustomId("open_ticket")
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Your Issue")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("issue_description")
                                        .setStyle(TextInputStyle.Paragraph),
                                ),
                        )
                        .addLabelComponents(
                            new LabelBuilder()
                                .setLabel("Additional Information")
                                .setTextInputComponent(
                                    new TextInputBuilder()
                                        .setCustomId("additional_information")
                                        .setStyle(TextInputStyle.Paragraph)
                                        .setRequired(false),
                                ),
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "Need to share more details? Once you click submit, you can upload any additional files or information directly inside your new ticket.",
                            ),
                        ),
                );
            }
        }
    },
} satisfies Event<Events.InteractionCreate>;
