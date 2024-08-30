// import { getDocumentCount } from '@gig/elasticsearch';

import { createGig, getGig, getGigs } from '../services/gig.service.js';
import createError from "../utils/createError.js";



const gigCreate = async (req, res, next) => {
    if (!req.currentUser.isSeller) {
        return next(createError(403, "Only sellers can create a gig!"));
    }

    try {
        // Log the request body to debug the issue
        console.log("Request body:", req.body);

        // Remove commas from the price string and convert it to a number
        const price = Number(req.body.price.replace(/,/g, ''));

        // Check if price is a valid number
        if (isNaN(price)) {
            return next(createError(400, "Invalid price format"));
        }

        const gig = {
            ...req.body,
            sellerId: req.currentUser.sellerId,
            username: req.currentUser.username,
            email: req.currentUser.email,
            price
        }

        const createdGig = await createGig(gig);



        res.status(201).json({ message: 'Gig created successfully.', gig: createdGig });
    } catch (err) {
        console.error("Error creating gig:", err);  // Added logging
        next(createError(500, "Failed to create gig"));
    }
};

export const gigGet = async (req, res, next) => {

    try {
        const gig = await getGig(req.params.id);
        if (!gig) next(createError(404, "Gig not found!"));
        res.status(200).send(gig);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const gigsGet = async (req, res, next) => {
    const q = req.body.filter;
    console.log(q);
    // const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...(q.subCat && { subCat: { $in: q.subCat } }),  // Handle array filtering
        ...((q.price && q.price.length === 2) && {  // Handle min and max price range
            price: {
                $gte: q.price[0],  // min price
                $lte: q.price[1],  // max price
            }
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };
    try {
        const gigs = await getGigs(filters, q);
        res.status(200).send(gigs);
    } catch (err) {
        next(err);
    }
};


export { gigCreate };