import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
    channelId: string;
    ownerId: string;
    claimedBy: string;
}

const ticketSchema: Schema = new Schema({
    channelId: { type: String, required: true, unique: true, index: true },
    ownerId: { type: String, required: true },
    claimedBy: { type: String, required: true },
});

const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
export default Ticket;
