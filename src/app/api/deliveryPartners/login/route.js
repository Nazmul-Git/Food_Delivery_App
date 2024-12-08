import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Secret key for signing the JWT (store this securely, such as in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  let payload = await req.json();
  let loggedUser;
  let success = false;

  await mongoose.connect(connectionUrl);

  if (payload) {
    try {
      // Find the user by phone
      loggedUser = await DeliveryUserModel.findOne({ phone: payload.phone });

      // Check if the user exists and the password is correct
      if (loggedUser && await bcrypt.compare(payload.password, loggedUser.password)) {
        success = true;

        // Generate JWT token after successful login
        const token = jwt.sign(
          { userId: loggedUser._id, fullName: loggedUser.fullName, phone: loggedUser.phone },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        // Optionally, you could exclude sensitive information like the password
        const userWithoutPassword = { ...loggedUser.toObject() };
        delete userWithoutPassword.password;

        // Return the logged-in user and the token
        return NextResponse.json({
          success,
          loggedUser: userWithoutPassword,
          token,
        });
      }
    } catch (err) {
      console.error('Error during login:', err);
      return NextResponse.json({ error: "Error during login!" });
    }
  }

  // If login fails
  return NextResponse.json({ success: false, error: "Invalid credentials!" });
}
