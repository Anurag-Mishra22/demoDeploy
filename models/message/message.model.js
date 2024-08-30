import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
    conversationId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    senderUsername: { type: String, index: true },
    receiverUsername: { type: String, index: true },
    fileUrl: { type: String, default: '' },
    file: { type: String, default: '' },
    fileType: { type: String, default: '' },
    fileSize: { type: String, default: '' },
    fileName: { type: String, default: '' },
    gigId: { type: String, default: '' },
    hasOffer: { type: Boolean, default: false },
    offer: {
        gigTitle: { type: String, default: '' },
        price: { type: Number, default: 0 },
        description: { type: String, default: '' },
        deliveryInDays: { type: Number, default: 0 },
        oldDeliveryDate: { type: String, default: '' },
        newDeliveryDate: { type: String, default: '' },
        accepted: { type: Boolean, default: false },
        cancelled: { type: Boolean, default: false }
    },
}, {
    timestamps: true
});

const MessageModel = mongoose.model("Message", MessageSchema)
export { MessageModel };