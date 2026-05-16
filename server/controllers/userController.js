import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {

    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// ==============================
// Register User
// POST: /api/users/register
// ==============================

export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(newUser._id);

        // Remove password
        newUser.password = undefined;

        // Success response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: newUser
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// ==============================
// Login User
// POST: /api/users/login
// ==============================

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password
        user.password = undefined;

        // Success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);
    
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==============================
// Get User By ID
// GET: /api/users/data
// ==============================

export const getUserById = async (req, res) => {

    try {

        const userId = req.userId;

        // Find user
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove password
        user.password = undefined;

        // Success response
        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// ==============================
// Get User Resumes
// GET: /api/users/resumes
// ==============================

export const getUserResumes = async (req, res) => {

    try {

        const userId = req.userId;

        // Find resumes
        const resumes = await Resume.find({ userId });

        return res.status(200).json({
            success: true,
            resumes
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};