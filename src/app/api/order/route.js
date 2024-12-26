import { connectionUrl } from "@/app/lib/db";
import OrderModel from "@/app/lib/OrdersModel";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
    const userId = req.nextUrl.searchParams.get('id');
    const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;
    const skip = parseInt(req.nextUrl.searchParams.get('skip')) || 0;  
    // console.log(userId, limit, skip);

    await mongoose.connect(connectionUrl);
    
    let success = false;
    let orders = await OrderModel.find({ user_Id: userId })
        .skip(skip)
        .limit(limit);    

    if (orders) {
        let restaurantData = await Promise.all(
            orders.map(async (item) => {
                let restauranInfo = {};
                restauranInfo.data = await RestaurantsSchema.findOne({ _id: item.restaurantId });
                restauranInfo.paymentMethod = item.paymentMethod;
                restauranInfo.amount = item.amount;
                restauranInfo.status = item.status;
                restauranInfo.date = new Date();
                return restauranInfo;
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