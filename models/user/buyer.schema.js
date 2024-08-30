
import mongoose, { Schema } from 'mongoose';

const buyerSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: { type: String, required: false, default: '' },
        phone: {
            type: String,
            required: false,
            default: '',
        },
        country: { type: String, required: true },
        isSeller: { type: Boolean, default: false },
        sellerId: { type: String, default: '' },
        purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
        online: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        }

    },

    {
        timestamps: true
    }
);

const BuyerModel = mongoose.model('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };