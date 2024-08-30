import { SellerModel } from "../models/user/seller.schema.js";
import { BuyerModel } from "../models/user/buyer.schema.js";
import { updateBuyerIsSellerProp } from "./buyer.service.js";

const getSellerByEmail = async (email) => {
    const seller = await SellerModel.findOne({ email }).exec();
    return seller;
};

const createSeller = async (sellerData, req) => {
    try {
        const createdSeller = await SellerModel.create(sellerData);
        const sellId = createdSeller._id;
        updateBuyerIsSellerProp(req.currentUser.email, sellId);


        return createdSeller;
    } catch (error) {
        throw new Error("Failed to create seller: " + error.message);
    }
};

const isSeller = async (email) => {
    const isSell = await BuyerModel.findOne({ email }).exec();
    console.log(isSell);
    if (isSell.isSeller) {
        return true;
    }
    return false;

}

const updateTotalGigsCount = async (sellerId) => {
    const count = await GigModel.countDocuments({ sellerId }).exec();

    await SellerModel.updateOne({ _id: sellerId }, { $inc: { totalGigs: count } }).exec();
}
export {
    getSellerByEmail,
    createSeller,
    isSeller,
    updateTotalGigsCount
};