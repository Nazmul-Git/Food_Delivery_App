import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Secret key for signing the JWT (store this securely, such as in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const payload = await req.json();

    // Validate payload
    if (!payload || !payload.phone || !payload.password) {
      return NextResponse.json({ success: false, error: "Phone and password are required!" }, { status: 400 });
    }

    // Connect to the database
    await mongoose.connect(connectionUrl);

    // Find the user by phone
    const loggedUser = await DeliveryUserModel.findOne({ phone: payload.phone });

    // Check if the user exists and the password matches
    if (loggedUser && await bcrypt.compare(payload.password, loggedUser.password)) {
      // Generate JWT token after successful login
      const token = jwt.sign(
        { userId: loggedUser._id, fullName: loggedUser.fullName, phone: loggedUser.phone },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Exclude sensitive information like the password
      const userWithoutPassword = { ...loggedUser.toObject() };
      delete userWithoutPassword.password;

      // Return the logged-in user and the token
      return NextResponse.json({
        success: true,
        loggedUser: userWithoutPassword,
        token,
      }, { status: 200 });
    }

    // If credentials are invalid
    return NextResponse.json({ success: false, error: "Invalid credentials!" }, { status: 401 });

  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json({ success: false, error: "Internal server error!" }, { status: 500 });
  }
}
