import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function GET() {
  await mongoose.connect(connectionUrl)
  const data = await RestaurantsSchema.find();
  console.log(data);
  return NextResponse.json({ result: true });
}


export async function POST(req) {
  let payload = await req.json();
  await mongoose.connect(connectionUrl)
  const restaurant = new RestaurantsSchema(payload);
  const result = restaurant.save();
  return NextResponse.json({result, success: true});
}