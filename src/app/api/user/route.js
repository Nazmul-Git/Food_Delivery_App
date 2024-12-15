import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from "@/app/lib/db";
import UserModel from "@/app/lib/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload = await req.json();
    let success = false;
    let signedUser = null;
    let token = null;

    try {
        // Connect to MongoDB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(connectionUrl);
        }

        if (payload) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(payload.password, 10); 

            // Create a new user document
            signedUser = new UserModel({
                fullName: payload.fullName,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                password: hashedPassword,
            });

            // Save the user to the database
            await signedUser.save();

            // Ensure JWT_SECRET is available
            const secret = process.env.JWT_SECRET || "fallback-secret";
            // console.log('secret key ',secret)

            // Generate JWT token after successful user registration
            token = jwt.sign(
                { userId: signedUser._id, email: signedUser.email },
                secret,
                { expiresIn: '1d' } 
            );
            // console.log(token)
            success = true;
        }
    } catch (err) {
        console.error("Error:", err.message);
        return NextResponse.json({ error: "Error saving user!", details: err.message });
    }

    // Return the user data, success flag, and token
    return NextResponse.json({ signedUser, success, token });
}
