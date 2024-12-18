import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from "@/app/lib/db";
import UserModel from "@/app/lib/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    let payload = await req.json();
    let loggedUser;
    let success = false;
    let token = null;

    try {
        // Ensure database connection is active
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(connectionUrl);
        }

        // Check if it's a social authentication or regular login
        if (payload.socialAuth) {
            try {
                // Check if the user already exists in the database by email
                loggedUser = await UserModel.findOne({ email: payload.email });

                if (!loggedUser) {
                    // If the user doesn't exist, create a new one
                    loggedUser = new UserModel({
                        email: payload.email,
                        fullName: payload.fullName,
                        image: payload.image,
                        socialAuth: true, 
                    });
                    await loggedUser.save(); 
                }

                // Successful login or registration via social auth
                const { password, ...userWithoutPassword } = loggedUser._doc; 
                success = true;
                return NextResponse.json({ success, loggedUser: userWithoutPassword });

            } catch (err) {
                console.error("Error during social auth:", err.message);
                return NextResponse.json({ success, error: err.message || "Error during social authentication" }, { status: 500 });
            }
        } else {
            if (payload) {
                // Regular login with email and password
                loggedUser = await UserModel.findOne({ email: payload.email });

                if (loggedUser && await bcrypt.compare(payload.password, loggedUser.password)) {
                    success = true;

                    // Generate JWT token
                    const secret = process.env.JWT_SECRET;
                    if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");

                    token = jwt.sign(
                        { userId: loggedUser._id, email: loggedUser.email },
                        secret,
                        { expiresIn: '1d' }
                    );

                    // Exclude password from the user object returned in the response
                    const { password, ...userWithoutPassword } = loggedUser._doc;
                    return NextResponse.json({ success, loggedUser: userWithoutPassword, token });
                }
            }

            // If the login failed due to wrong email/password
            return NextResponse.json({ success, error: "Invalid email or password!" }, { status: 401 });
        }

    } catch (err) {
        console.error("Error:", err.message);
        // Handle any other unexpected errors
        return NextResponse.json({ error: "Error processing login!", details: err.message }, { status: 500 });
    }
}
