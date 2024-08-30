import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { GigModel } from '../models/gig/gig.schema.js';
import { seller } from "../controllers/seller.controller.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return next(createError(401, "You are not authenticated!"))


    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return next(createError(403, "Token is not valid!"))
        // console.log(payload)
        // console.log(req.currentUser)



        // if (payload?.sellerId) {
        //     req.currentUser = {
        //         id: payload.id,
        //         username: payload.username,
        //         email: payload.email,
        //         isSeller: payload.isSeller,
        //         sellerId: payload.sellerId
        //     };
        // } else {
        req.currentUser = {
            id: payload.id,
            username: payload.username,
            email: payload.email,
            isSeller: payload.isSeller,
            sellerId: payload.sellerId

            // };
        }
        next()
    });
};