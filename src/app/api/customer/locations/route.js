import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  // Ensure that the database connection is established first
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(connectionUrl);
  }

  try {
    let result = await RestaurantsSchema.find();
    
    // Capitalizing the first letter of the address and removing duplicates
    result = result.map(item => item?.address?.charAt(0).toUpperCase() + item.address.slice(1));
    result = [...new Set(result)];

    return NextResponse.json({ result, success: true });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
