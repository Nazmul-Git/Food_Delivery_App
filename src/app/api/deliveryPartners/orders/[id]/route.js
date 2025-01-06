import { connectionUrl } from "@/app/lib/db";
import OrderModel from "@/app/lib/OrdersModel";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params; 
    console.log(id);

    // Connect to the database
    await mongoose.connect(connectionUrl);

    let success = false;

    try {
        // Fetch orders with the given delivery ID
        let orders = await OrderModel.find({ delivery_Id: id });
        if (orders.length > 0) {
            // Map restaurant info for each order
            let restaurantData = await Promise.all(
                orders.map(async (item) => {
                    let restauranInfo = {};
                    restauranInfo.data = await RestaurantsSchema.findOne({ _id: item.restaurantId });
                    restauranInfo.paymentMethod = item.paymentMethod;
                    restauranInfo.amount = item.amount;
                    restauranInfo.status = item.status;
                    restauranInfo.date = item?.data?.createdAt;
                    return restauranInfo;
                })
            );
            orders = restaurantData;
            success = true;
        }
        return NextResponse.json({ orders, success });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ orders: [], success: false, error: error.message });
    }
}
