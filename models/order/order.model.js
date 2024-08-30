import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
    {
        gigId: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        sellerId: {
            type: String,
            required: true,
        },
        buyerId: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        payment_intent: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["inProgress", "completed"],
            default: "inProgress",
        },
    },
    {
        timestamps: true,
    }
);

// Create the index
OrderSchema.index({ payment_intent: 1 }, { unique: true });

const OrderModel = mongoose.model("Order", OrderSchema);

export { OrderModel };