import bcrypt from 'bcryptjs';
import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET handler to fetch all restaurants
export async function GET() {
  await mongoose.connect(connectionUrl);
  const data = await RestaurantsSchema.find(); 
  // console.log(data); 
  return NextResponse.json({ restaurants: data });
}

// POST handler for login or creating a new restaurant
export async function POST(req) {
  let payload = await req.json();
  let signedUser = null; 
  let success = false;

  await mongoose.connect(connectionUrl);

  if (payload.login) {
    // Attempt to log in the user (restaurant)
    const restaurant = await RestaurantsSchema.findOne({ email: payload.email });

    if (restaurant && await bcrypt.compare(payload.password, restaurant.password)) {
      // Password match
      signedUser = restaurant;
      success = true;
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
    } catch (err) {
      console.error('Error saving restaurant:', err);
      return NextResponse.json({ error: 'Error saving restaurant!' });
    }
  }

  return NextResponse.json({ signedUser, success });
}
