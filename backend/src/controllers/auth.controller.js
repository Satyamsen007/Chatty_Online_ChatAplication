import ApiError from '../helper/ApiError.js'
import ApiResponse from "../helper/ApiResponse.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import cloudinary from "cloudinary";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { configDotenv } from 'dotenv';

configDotenv();

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
                password: Math.random().toString(36).slice(-8), // Random password
                isVerified: true // Google accounts are pre-verified
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

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
                sameSite: "strict"
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
            sameSite: "strict"
        })
        .json(new ApiResponse(200, user, "User logged in successfully"));
});


export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict"
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

export const googleAuth = asyncHandler(async (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});

export const googleAuthCallback = asyncHandler(async (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false
    })(req, res, async () => {
        try {
            const user = req.user;
            if (!user) {
                throw new Error('No user profile received from Google');
            }

            const token = generateToken(user._id);

            // Set cookie and redirect to frontend
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.redirect(process.env.FRONTEND_URL);
        } catch (error) {
            console.error('Google auth error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    });
});