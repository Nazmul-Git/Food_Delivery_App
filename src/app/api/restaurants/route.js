import { connectionUrl } from "@/app/lib/db";
import { RestaurantsSchema } from "@/app/lib/RestaurantModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET() {
  await mongoose.connect(connectionUrl)
  const data = await RestaurantsSchema.find();
  console.log(data);
  return NextResponse.json({ signedUsers: data });
}


export async function POST(req) {
  let payload = await req.json();
  let signedUser;
  let success = false;
  await mongoose.connect(connectionUrl);

  if (payload.login){
    signedUser = await RestaurantsSchema.findOne({ email: payload.email, password: payload.password });
    if(signedUser){
      success= true;
    }
  }
  else {
    const restaurant = new RestaurantsSchema(payload);
    signedUser = await restaurant.save();
    if(signedUser){
      success= true;
    }
  }

  // console.log(signedUser);
  return NextResponse.json({ signedUser, success: true });
}