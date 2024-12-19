import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const payload = await req.json();

    // Validate input
    if (!payload || !payload.phone || !payload.password) {
      return NextResponse.json({
        success: false,
        error: "Phone and password are required!"
      }, { status: 400 });
    }

    // Connect to the database
    await mongoose.connect(connectionUrl);

    // Find user by phone
    const loggedUser = await DeliveryUserModel.findOne({ phone: payload.phone });

    if (!loggedUser) {
      return NextResponse.json({
        success: false,
        error: "Invalid phone or password!"
      }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(payload.password, loggedUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: "Invalid phone or password!"
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: loggedUser._id,
        fullName: loggedUser.fullName,
        phone: loggedUser.phone,
      },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // Exclude sensitive data (e.g., password) from the response
    const userWithoutPassword = { ...loggedUser.toObject() };
    delete userWithoutPassword.password;

    // Return user data and token
    return NextResponse.json({
      success: true,
      loggedUser: userWithoutPassword,
      token,
    }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);

    return NextResponse.json({
      success: false,
      error: "Internal server error!"
    }, { status: 500 });
  } finally {
    // Ensure the database connection is closed
    mongoose.connection.close();
  }
}
