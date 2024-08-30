import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
// import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import sellerRoute from "./routes/seller.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger-output.json" assert { type: "json" };
import { createServer } from "http"; // Import createServer
import { Server } from "socket.io"; // Import Server from socket.io
import { BuyerModel } from "./models/user/buyer.schema.js";
import { SellerModel } from "./models/user/seller.schema.js";

const app = express();
const httpServer = createServer(app); // Create HTTP server

app.use(cors({
    origin: ["http://localhost:3000", "http://www.localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(express.json());
app.use(cookieParser());

dotenv.config();


// Configure CORS for both HTTP and Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
}); // Initialize Socket.io server with HTTP server


var usp = io.of('/user-namespace');

usp.on('connection', async (socket) => {
    console.log('user connected');

    socket.on('authenticate', (data) => {
        const { username } = data;
        console.log(`Authenticated user with username: ${username}`);

        // Store username in socket object
        socket.username = username;

        // Update online status to true
        BuyerModel.updateOne(
            { username },
            {
                $set: {
                    online: true
                }
            }
        ).exec();
        // Seller
        SellerModel.updateOne(
            { username },
            {
                $set: {
                    online: true
                }
            }
        ).exec();
    });

    socket.on('disconnect', () => {
        // Access the stored username
        const username = socket.username;

        if (username) {
            // Update online status to false
            BuyerModel.updateOne(
                { username },
                {
                    $set: {
                        online: false
                    }
                }
            ).exec();
            console.log(`User with username ${username} disconnected`);

            SellerModel.updateOne(
                { username },
                {
                    $set: {
                        online: false
                    }
                }
            ).exec();
        } else {
            console.log('User disconnected, but username was not found.');
        }
    });
});

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("MongoDB connected!");
    } catch (error) {
        console.log(error);
    }
};

app.use("/api/auth", authRoute);
app.use("/api/seller", sellerRoute);
// app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
// app.use("/api/reviews", reviewRoute);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    console.error(err);

    return res.status(errorStatus).send(errorMessage);
});

// Start the server using httpServer
httpServer.listen(8800, () => {
    connect();
    console.log("Backend server is running!");
});
