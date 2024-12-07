import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
    let address = params.address;
    let success = false;
    await mongoose.connect(connectionUrl);
    let filter = { address: { $regex: new RegExp(address, 'i') } };
    const result = await DeliveryUserModel.find(filter);
    if(result) success=true;
    return NextResponse.json({ result, success });
}