import bcrypt from 'bcryptjs';
import { connectionUrl } from "@/app/lib/db";
import UserModel from "@/app/lib/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload = await req.json();
    let loggedUser;
    let success = false;

    // Connect to MongoDB
    await mongoose.connect(connectionUrl);

    if (payload) {
        try {
            // Find the user by email
            loggedUser = await UserModel.findOne({ email: payload.email });

            // If the user is found and the password matches
            if (loggedUser && await bcrypt.compare(payload.password, loggedUser.password)) {
                success = true;
            }
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: "Error processing login!" });
        }
    }

    return NextResponse.json({ loggedUser, success });
}
