import { connectionUrl } from "@/app/lib/db";
import FoodSchema from "@/app/lib/FoodModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const id = params.id; // Access params directly
        // console.log("Restaurant ID:", id);

        await mongoose.connect(connectionUrl);

        const data = await FoodSchema.find({ restaurantId: id });
        // console.log("Food items fetched:", data);

        const success = data.length > 0;

        return NextResponse.json({ data, success });
    } catch (error) {
        // console.error("Error fetching food items:", error);
        return NextResponse.json({ error: "Failed to fetch food items", success: false });
    } finally {
        // Close the connection after operation
        await mongoose.connection.close();
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id; // Access params directly
        // console.log("Deleting food item with ID:", id);

        await mongoose.connect(connectionUrl);

        const result = await FoodSchema.findByIdAndDelete(id);
        if (!result) {
            return NextResponse.json({ success: false, message: "Food item not found" });
        }

        return NextResponse.json({ success: true, message: "Food item deleted successfully" });
    } catch (error) {
        // console.error("Error deleting food item:", error);
        return NextResponse.json({ success: false, error: "Failed to delete food item" });
    } finally {
        await mongoose.connection.close();
    }
}
