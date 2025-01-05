import { connectionUrl } from "@/app/lib/db";
import FoodItem from "@/app/lib/FoodModel";
import OrderModel from "@/app/lib/OrdersModel";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
    const userId = req.nextUrl.searchParams.get('id');

    await mongoose.connect(connectionUrl);
    
    let success = false;
    let orders = await OrderModel.find({ user_Id: userId });

    if (orders) {
        let restaurantData = await Promise.all(
            orders.map(async (item) => {
                let restaurantInfo = {};

                // Fetch restaurant details
                restaurantInfo.data = await RestaurantsSchema.findOne({ _id: item.restaurantId });

                // Fetch food item details based on foodItemId
                const foodItemIds = item.foodItemId.split(',');
                const foodItems = await FoodItem.find({ _id: { $in: foodItemIds } });

                restaurantInfo.foods = foodItems.map(food => ({
                    name: food.foodName,
                    category:food.category,
                    description: food.description,
                    price: food.price,
                    image: food.imagePath,
                }));

                restaurantInfo.paymentMethod = item.paymentMethod;
                restaurantInfo.amount = item.amount;
                restaurantInfo.status = item.status;
                restaurantInfo.date = item.createdAt;

                return restaurantInfo;
            })
        );
        orders = restaurantData;
        success = true;
    }
    
    return NextResponse.json({ orders, success });
}

export async function POST(req) {
    const payload = await req.json();
    await mongoose.connect(connectionUrl);
    let success = false;
    const orderObj = new OrderModel(payload);
    const result = await orderObj.save();
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success });
}
