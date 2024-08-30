import mongoose from "mongoose";
const { Schema } = mongoose;

const GigSchema = new Schema(
    {
        sellerId: {
            type: String,
            required: true,
        },
        username: { type: String, required: true },
        email: { type: String, required: true },
        title: {
            type: String,
            required: true,
        },
        tags: [{ type: String }],
        desc: {
            type: String,
            required: true,
        },
        descJson: {
            type: String,
            required: true,
        },
        totalStars: {
            type: Number,
            default: 0,
        },
        starNumber: {
            type: Number,
            default: 0,
        },
        cat: {
            type: String,
            required: true,
        },
        subCat: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        cover: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: false,
        },
        shortTitle: {
            type: String,
            required: true,
        },
        shortDesc: {
            type: String,
            required: true,
        },
        reviewSummary: {
            type: String,
            required: false,
            default: "",
        },
        deliveryTime: {
            type: Number,
            required: false,
            default: 1,
        },
        revisionNumber: {
            type: Number,
            required: false,
            default: 0,
        },
        features: {
            type: [String],
            required: false,
        },
        orderCompleted: {
            type: Number,
            default: 0,
        },
        expectedDelivery: { type: String, default: '' },
        active: { type: Boolean, default: true },
        sortId: { type: Number },

        views: {
            type: Number,
            default: 0,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        avgTimeOnPage: {
            type: Number,
            default: 0,
        },
        scrollDepth: {
            type: Number,
            default: 0,
        },
        feedback: {
            type: [String], // or a more complex schema if feedback needs to be structured
            default: [],
        },
        conversionRate: {
            type: Number,
            default: 0,
        },
        engagementScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const GigModel = mongoose.model('Gig', GigSchema);
export { GigModel };