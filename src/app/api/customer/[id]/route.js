import { connectionUrl } from "@/app/lib/db";
import FoodItem from "@/app/lib/FoodModel";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const id = await params.id;
    await mongoose.connect(connectionUrl);
    const details = await RestaurantsSchema.findOne({ _id: id });
    const foodItems = await FoodItem.find({ restaurantId: id })
    return NextResponse.json({ success: true, details, foodItems });
}