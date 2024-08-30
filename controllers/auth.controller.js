import { BuyerModel } from "../models/user/buyer.schema.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        // Check if username or email already exists
        const existingBuyer = await BuyerModel.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingBuyer) {
            return next(createError(400, "Username or Email already exists!"));
        }

        // Hash password
        const hash = bcrypt.hashSync(req.body.password, 5);

        // Create a new buyer
        const newBuyer = new BuyerModel({
            ...req.body,
            password: hash,
        });

        // Save buyer to the database
        await newBuyer.save();
        res.status(201).send("Buyer has been created.");
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const buyer = await BuyerModel.findOne({ username: req.body.username });

        if (!buyer) return next(createError(404, "Buyer not found!"));

        const isCorrect = bcrypt.compareSync(req.body.password, buyer.password);
        if (!isCorrect)
            return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign(
            {
                id: buyer._id,
                isSeller: buyer.isSeller,
                username: buyer.username,
                email: buyer.email,
                sellerId: buyer.sellerId,
            },
            process.env.JWT_KEY
        );

        const { password, ...info } = buyer._doc;
        res
            .cookie("accessToken", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,

            })
            .status(200)
            .send(info);
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res) => {
    res
        .clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .send("Buyer has been logged out.");
};
