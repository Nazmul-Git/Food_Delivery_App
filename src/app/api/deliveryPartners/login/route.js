import { connectionUrl } from "@/app/lib/db";
import DeliveryUserModel from "@/app/lib/DeliveryUserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  let payload = await req.json();
  let loggedUser;
  let success = false;
  await mongoose.connect(connectionUrl);
  if (payload) {
    loggedUser = await DeliveryUserModel.findOne({ phone: payload.phone, password: payload.password });
    if (loggedUser) {
      success = true;
    }
  }

  return NextResponse.json({ loggedUser, success });
}