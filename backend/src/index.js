import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import groupRoutes from "./routes/group.route.js";
import groupMessageRoutes from "./routes/groupMessage.route.js";
import { connectDB } from "./lib/db.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { app, server } from "./lib/socket.js";
// Load environment variables before any other code
dotenv.config();


const PORT = process.env.PORT || 5003;

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    sameSite: "none",
    secure: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// API Routes - These should come before the static file serving
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/group-messages", groupMessageRoutes);


// Error handling middleware should be last
app.use(errorHandler);

// Start server only after successful database connection
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();