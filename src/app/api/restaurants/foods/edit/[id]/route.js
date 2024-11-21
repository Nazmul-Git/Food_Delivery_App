import mongoose from "mongoose";
import { connectionUrl } from "@/app/lib/db";
import FoodSchema from "@/app/lib/FoodModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        let success = false;
        const { id } = await params;
        // console.log("Restaurant ID:", id);

        await mongoose.connect(connectionUrl);

        const data = await FoodSchema.findOne({ _id: id });
        // console.log("Food items fetched:", data);
        if (data) {
            success = true;
        }

        return NextResponse.json({ data, success });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch food items", success: false });
    } finally {
        await mongoose.connection.close();
    }
}


// PUT method to update a food item
export async function PUT(request, { params }) {
    try {
        let success = false;
        const { id } = params;
        const payload = await request.json();

        await mongoose.connect(connectionUrl);

        const updatedFoodItem = await FoodSchema.findByIdAndUpdate(
            { _id: id },
            {
                foodName: payload.foodName,
                description: payload.description,
                price: payload.price,
                category: payload.category,
                imagePath: payload.imagePath,
            },
            { new: true } // Return the updated document
        );

        if (updatedFoodItem) {
            success = true;
        }

        return NextResponse.json({ updatedFoodItem, success });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update food item", success: false });
    } finally {
        await mongoose.connection.close();
    }
}