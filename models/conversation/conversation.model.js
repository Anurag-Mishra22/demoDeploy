import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        sellerId: {
            type: String,
            required: true,
        },
        buyerId: {
            type: String,
            required: true,
        },
        readBySeller: {
            type: Boolean,
            required: true,
        },
        readByBuyer: {
            type: Boolean,
            required: true,
        },
        lastMessage: {
            type: String,
            required: false,
        },
        senderUsername: { type: String, required: true },
        receiverUsername: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export { ConversationModel };