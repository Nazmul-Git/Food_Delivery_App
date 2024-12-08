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
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(connectionUrl);
        }

        if (payload) {
            // Find the user by email
            loggedUser = await UserModel.findOne({ email: payload.email });

            // Verify the password
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

        // If login is unsuccessful
        return NextResponse.json({ success, error: "Invalid email or password!" }, { status: 401 });

    } catch (err) {
        console.error("Error:", err.message);
        return NextResponse.json({ error: "Error processing login!", details: err.message }, { status: 500 });
    }
}
