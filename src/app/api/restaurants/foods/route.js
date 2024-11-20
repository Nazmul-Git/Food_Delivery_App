import { connectionUrl } from "@/app/lib/db";
import FoodSchemaModel from "@/app/lib/FoodModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const payload = await req.json();
    await mongoose.connect(connectionUrl);
    const food = new FoodSchemaModel(payload);
    const foodData = await food.save();
    return NextResponse.json({ foodData, success: true });
}