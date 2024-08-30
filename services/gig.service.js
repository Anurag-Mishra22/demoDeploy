import { GigModel } from '../models/gig/gig.schema.js';
import { SellerModel } from "../models/user/seller.schema.js";

const createGig = async (gig) => {
    const createdGig = await GigModel.create(gig);
    // if (createdGig) {
    //   const data = createdGig.toJSON?.() ;
    //   await publishDirectMessage(
    //     gigChannel,
    //     'jobber-seller-update',
    //     'user-seller',
    //     JSON.stringify({ type: 'update-gig-count', gigSellerId: `${data.sellerId}`, count: 1 }),
    //     'Details sent to users service.'
    //   );
    //   await addDataToIndex('gigs', `${createdGig._id}`, data);
    // }

    await SellerModel.updateOne(
        { _id: gig.sellerId },
        {
            $inc: { totalGigs: 1 }
        }
    ).exec();

    return createdGig;
};
const getGig = async (id) => {

    const gig = await GigModel.findById(id).exec();


    return gig;
};

const getGigs = async (filters, q) => {
    const gigs = await GigModel.find(filters).sort({ [q.sort]: -1 });
    return gigs;
}





export {
    createGig,
    getGig,
    getGigs
};