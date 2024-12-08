import bcrypt from 'bcryptjs';
import { connectionUrl } from "@/app/lib/db";
import UserModel from "@/app/lib/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload = await req.json();
    let success = false;
    let signedUser = null;

    await mongoose.connect(connectionUrl);

    if (payload) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(payload.password, 10); // 10 is the salt rounds

            signedUser = new UserModel({
                fullName: payload.fullName,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                password: hashedPassword,
            });

            await signedUser.save();
            success = true;
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: "Error saving user!" });
        }
    }

    return NextResponse.json({ signedUser, success });
}
