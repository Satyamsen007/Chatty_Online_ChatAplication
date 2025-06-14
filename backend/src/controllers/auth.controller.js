import ApiError from '../helper/ApiError.js'
import ApiResponse from "../helper/ApiResponse.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import cloudinary from "cloudinary";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import { configDotenv } from 'dotenv';
configDotenv();

export const signUp = asyncHandler(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new ApiError(400, "All fields are required"));
    }
    if (password.length < 6) {
        return next(new ApiError(400, "Password must be at least 6 characters long"));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ApiError(400, "Please provide a valid email address"));
    }
    const user = await User.findOne({ email });
    if (user) {
        return next(new ApiError(400, "User already exists"));
    }
    const newUser = await User.create({ fullName, email, password });
    if (newUser) {
        // Generate JWT token for authentication and send response with user details
        const token = generateToken(newUser._id);
        await newUser.save();
        res.status(201)
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 4 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            })
            .json(
                new ApiResponse(201, newUser, "User created successfully")
            )
    } else {
        return next(new ApiError(500, "Failed to create user"));
    }
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, "All fields are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, "Invalid email or password"));
    }
    const passwordisCorrect = await user.comparePassword(password);

    if (!passwordisCorrect) {
        return next(new ApiError(400, "Invalid email or password"));
    }
    const token = generateToken(user._id);
    res.status(200)
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 4 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        })
        .json(new ApiResponse(200, user, "User logged in successfully"));
});

export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (profilePic) {
        const currentUser = await User.findById(userId);

        if (currentUser?.profilePicture && currentUser.profilePicture.includes('cloudinary')) {
            try {
                const publicId = currentUser.profilePicture.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Error deleting old profile picture:', error);
                return next(new ApiError(500, "Error deleting old profile picture"));
            }
        }
        // Upload new image
        const uploadResponse = await uploadToCloudinary(profilePic, 'user/profile-pictures');
        updateData.profilePicture = uploadResponse.secure_url;
    }

    if (fullName) {
        updateData.fullName = fullName;
    }

    if (Object.keys(updateData).length === 0) {
        return next(new ApiError(400, "No update data provided"));
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, "User not found"));
    }
    if (user?.profilePicture && user.profilePicture.includes('cloudinary')) {
        try {
            const publicId = user.profilePicture.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting profile picture:', error);
            return next(new ApiError(500, "Error deleting profile picture"));
        }
    }
    await User.findByIdAndDelete(userId);
    res.status(200)
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        })
        .json(new ApiResponse(200, user, "Account deleted successfully"));
});

