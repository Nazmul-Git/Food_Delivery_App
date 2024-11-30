import { connectionUrl } from "@/app/lib/db";
import OrderModel from "@/app/lib/OrdersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req){
    const payload = await req.json();
    await mongoose.connect(connectionUrl);
    let success = false;
    const orderObj = new OrderModel(payload);
    const result = await orderObj.save();
    if(result){
        success = true;
    }
    return NextResponse.json({result , success});
}