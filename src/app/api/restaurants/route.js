import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET handler to fetch all restaurants
export async function GET() {
  try {
    await mongoose.connect(connectionUrl);
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
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionUrl);
    }

    if (payload.login) {
      // Attempt to log in the user (restaurant)
      const restaurant = await RestaurantsSchema.findOne({ email: payload.email });

      if (restaurant && await bcrypt.compare(payload.password, restaurant.password)) {
        // Password match
        signedUser = restaurant;
        success = true;

        // Generate JWT token
        const secret = process.env.JWT_SECRET; // Ensure this is set in .env.local
        if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");

        token = jwt.sign(
          { restaurantId: restaurant._id, email: restaurant.email },
          secret,
          { expiresIn: '1d' }
        );

        // Exclude password from the user object in the response
        const { password, ...restaurantWithoutPassword } = restaurant._doc;

        return NextResponse.json({ success, signedUser: restaurantWithoutPassword, token });
      } else {
        return NextResponse.json({ success: false, error: "Invalid email or password!" }, { status: 401 });
      }
    } else {
      // Create a new restaurant
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const restaurant = new RestaurantsSchema({
        ...payload,
        password: hashedPassword,
      });

      try {
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

        // Exclude password from the user object in the response
        const { password, ...restaurantWithoutPassword } = signedUser._doc;

        return NextResponse.json({ success, signedUser: restaurantWithoutPassword, token });
      } catch (err) {
        console.error("Error saving restaurant:", err);
        return NextResponse.json({ error: "Error saving restaurant!" }, { status: 500 });
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
    return NextResponse.json({ error: "Error processing request!", details: err.message }, { status: 500 });
  }
}
