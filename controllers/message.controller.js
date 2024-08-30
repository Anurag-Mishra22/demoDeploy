import createError from "../utils/createError.js";
import { MessageModel } from "../models/message/message.model.js";
import { ConversationModel } from "../models/conversation/conversation.model.js";

export const createMessage = async (req, res, next) => {

    const newMessage = new MessageModel({
        conversationId: req.body.conversationId,
        userId: req.currentUser.id,
        desc: req.body.desc,
    });
    try {
        const savedMessage = await newMessage.save();
        await ConversationModel.findOneAndUpdate(
            { id: req.body.conversationId },
            {
                $set: {
                    readBySeller: req.currentUser.isSeller,
                    readByBuyer: !req.currentUser.isSeller,
                    lastMessage: req.body.desc,
                },
            },
            { new: true }
        );

        res.status(201).send("hello");
    } catch (err) {
        next(err);
    }
};
export const getMessages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find({ conversationId: req.params.id });
        res.status(200).send(messages);
    } catch (err) {
        next(err);
    }
};