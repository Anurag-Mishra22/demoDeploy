import createError from "../utils/createError.js";
import { OrderModel } from "../models/order/order.model.js";
import { GigModel } from "../models/gig/gig.schema.js";
import Stripe from "stripe";
import mongoose from "mongoose";

export const intent = async (req, res, next) => {
    try {
        const stripe = new Stripe(process.env.STRIPE);

        const gig = await GigModel.findById(req.params.id);
        if (!gig) {
            return next(createError(404, "Gig not found"));
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
        });


        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, "Internal Server Error"));
    }
};

export const createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log(req.body);

        const stripe = new Stripe(process.env.STRIPE);

        const gig = await GigModel.findById(req.params.gigId);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return next(createError(404, "Gig not found"));
        }

        const paymentIntentId = req.body.paymentIntent;
        if (!paymentIntentId) {
            await session.abortTransaction();
            session.endSession();
            return next(createError(400, "Payment intent ID is required"));
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
            await session.abortTransaction();
            session.endSession();
            return next(createError(400, "Invalid or failed payment intent"));
        }

        const currentUser = req.body.currentUser;
        if (!currentUser) {
            await session.abortTransaction();
            session.endSession();
            return next(createError(400, "Current user is required"));
        }

        if (currentUser.isSeller && currentUser.sellerId === gig.sellerId) {
            await session.abortTransaction();
            session.endSession();
            return next(createError(400, "You cannot order your own gig"));
        }

        // Check for an existing order with the same payment intent
        const existingOrder = await OrderModel.findOne({ payment_intent: paymentIntentId }).session(session);
        if (existingOrder) {
            await session.commitTransaction();
            session.endSession();
            return res.status(200).send(existingOrder); // Return existing order
        }

        // Create and save the new order
        const newOrder = new OrderModel({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: currentUser._id,
            sellerId: gig.sellerId,
            price: gig.price,
            payment_intent: paymentIntentId,
        });

        await newOrder.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).send(newOrder);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);

        if (error.code === 11000) { // Duplicate key error code
            return res.status(409).send({ message: "Order already exists" });
        }
        next(createError(500, "Internal Server Error"));
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({
            ...(req.currentUser.isSeller ? { sellerId: req.currentUser.sellerId } : { buyerId: req.currentUser.id }),
            // isCompleted: true,
        });

        res.status(200).send(orders);
    } catch (err) {
        next(err);
    }
};

export const confirm = async (req, res, next) => {
    try {
        const orders = await OrderModel.findOneAndUpdate(
            {
                payment_intent: req.body.payment_intent,
            },
            {
                $set: {
                    isCompleted: true,
                },
            },
            { new: true } // Return the updated document
        );

        if (!orders) {
            return res.status(404).send("Order not found.");
        }

        res.status(200).send("Order has been confirmed.");
    } catch (err) {
        next(err);
    }
};