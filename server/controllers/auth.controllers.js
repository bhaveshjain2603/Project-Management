import mongoose from 'mongoose';
import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from '../models/auth.model.js'
import dotenv from 'dotenv';

dotenv.config()

export const createUser = async (req, res) => {

    // validate type
    const user = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required()
    })

    const { error, value } = user.validate({ name: req.body.name, email: req.body.email, password: req.body.password});
    if (error) return res.status(422).send(error)

    const { name, email, password } = req.body;
    
    try {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exixts")
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Auth({name, email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        res.status(201).json({
            success: true,
            message: "User created successfully", 
            data: { userId: newUser[0], token } 
        });
    } catch (e) {
        console.error("Server Error:", e); // ✅ This will help us debug the actual error

        return res.status(500).json({
            error: true,
            message: "Server error",
            details: e.message,  // ✅ Send the actual error message to frontend
        });

    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        res.status(200).json({
            success: true,
            message: "User logged in successfully", 
            data: { userId: user._id, token } 
        });
    } catch (e) {
        return res.status(e.statusCode || 500).json({
            error: true,
            message: e.message,
        });
    }
}