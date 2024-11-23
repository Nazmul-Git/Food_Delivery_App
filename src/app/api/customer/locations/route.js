import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    await mongoose.connect(connectionUrl);
    let result = await RestaurantsSchema.find();
    result = result.map((item=>item.address.charAt(0).toUpperCase() + item.address.slice(1)));
    result = [...new Set(result.map((item)=>item))];
    return NextResponse.json({result, success: true});
}