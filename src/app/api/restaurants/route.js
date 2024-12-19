import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Utility to ensure a single MongoDB connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(connectionUrl);
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("Database connection failed!");
    }
  }
}

// GET handler to fetch all restaurants
export async function GET() {
  try {
    await connectToDatabase();

    const data = await RestaurantsSchema.find();
    return NextResponse.json({ restaurants: data });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    return NextResponse.json({ error: "Error fetching restaurants!" }, { status: 500 });
  }
}

// POST handler for login or creating a new restaurant
export async function POST(req) {
  let payload = await req.json();
  let signedUser = null;
  let success = false;
  let token = null;

  try {
    await connectToDatabase();

    if (payload.login) {
      // Login flow
      const restaurant = await RestaurantsSchema.findOne({ email: payload.email });

      if (restaurant && await bcrypt.compare(payload.password, restaurant.password)) {
        signedUser = restaurant;
        success = true;

        // Generate JWT token
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");

        token = jwt.sign(
          { restaurantId: restaurant._id, email: restaurant.email },
          secret,
          { expiresIn: '1d' }
        );

        // Exclude password from the response
        const { password, ...restaurantWithoutPassword } = restaurant._doc;

        return NextResponse.json({ success, signedUser: restaurantWithoutPassword, token });
      } else {
        return NextResponse.json({ success: false, error: "Invalid email or password!" }, { status: 401 });
      }
    } else {
      // Signup flow
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const restaurant = new RestaurantsSchema({
        ...payload,
        password: hashedPassword,
      });

      signedUser = await restaurant.save();
      success = true;

      // Generate JWT token
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");

      token = jwt.sign(
        { restaurantId: signedUser._id, email: signedUser.email },
        secret,
        { expiresIn: '1d' }
      );

      // Exclude password from the response
      const { password, ...restaurantWithoutPassword } = signedUser._doc;

      return NextResponse.json({ success, signedUser: restaurantWithoutPassword, token });
    }
  } catch (err) {
    console.error("Error:", err.message);
    return NextResponse.json({ error: "Error processing request!", details: err.message }, { status: 500 });
  }
}
