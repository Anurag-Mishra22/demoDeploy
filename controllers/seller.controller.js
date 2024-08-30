import { createSeller, getSellerByEmail, isSeller } from '../services/seller.service.js';
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";

export const seller = async (req, res, next) => {
    try {
        console.log(req.currentUser);
        // const isSell = await isSeller(req.body.email);
        // if (!isSell) {
        //     return next(createError(400, "You are not a seller!"));
        // }

        const checkIfSellerExist = await getSellerByEmail(req.body.email);
        if (checkIfSellerExist) {
            return next(createError(400, "Seller already exists!"));
        }



        const seller = {
            profilePublicId: req.body.profilePublicId,
            fullName: req.body.fullName,
            username: req.currentUser.username,
            email: req.currentUser.email,
            profilePicture: req.body.profilePicture,
            description: req.body.description,
            country: req.body.country,
            languages: req.body.languages,
        };
        const createdSeller = await createSeller(seller, req);
        console.log(createdSeller);

        const token = jwt.sign(
            {
                id: req.currentUser.id,
                username: req.currentUser.username,
                email: req.currentUser.email,
                isSeller: true, // Now a seller
                sellerId: createdSeller._id, // Add sellerId
            },
            process.env.JWT_KEY
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(201).send("Seller created successfully.");
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getSeller = async (req, res, next) => {
    try {
        const seller = await getSellerByEmail(req.params.email);
        if (!seller) {
            return next(createError(404, "Seller not found!"));
        }
        res.status(200).json(seller);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
