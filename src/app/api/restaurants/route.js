import mongoose from "mongoose";
import { connectionUrl } from "@/app/lib/db";
import { Restaurants } from "@/app/lib/RestaurantModel";
import { NextResponse } from "next/server";

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return; // Already connected
  }

  try {
    // console.log("Connecting to MongoDB...", connectionUrl);
    await mongoose.connect(connectionUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    // console.error("MongoDB connection error: ", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch data from the restaurant collection
    const data = await Restaurants.find();

    // Return data if found
    return NextResponse.json({
      result: data,
      message: "Fetching data successfully",
    });
  } catch (error) {
    // console.error("Error fetching data:", error);
    return NextResponse.json({
      result: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
}
