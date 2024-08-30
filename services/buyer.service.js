import { BuyerModel } from "../models/user/buyer.schema.js";


const updateBuyerIsSellerProp = async (email, sellId) => {
    console.log(email, sellId);
    await BuyerModel.updateOne(
        { email },
        {
            $set: {
                isSeller: true,
                sellerId: sellId
            }
        }
    ).exec();
};

const updateBuyerPurchasedGigsProp = async (buyerId, purchasedGigId, type) => {
    await BuyerModel.updateOne(
        { _id: buyerId },
        type === 'purchased-gigs' ?
            {
                $push: {
                    purchasedGigs: purchasedGigId
                }
            } : {
                $pull: {
                    purchasedGigs: purchasedGigId
                }
            }
    ).exec();
};

export {
    updateBuyerIsSellerProp,
    updateBuyerPurchasedGigsProp
};