import bcrypt from 'bcryptjs';
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
    try {
      loggedUser = await DeliveryUserModel.findOne({ phone: payload.phone });
      
      if (loggedUser && await bcrypt.compare(payload.password, loggedUser.password)) {
        success = true;
      }
    } catch (err) {
      // console.error('Error during login:', err);
      return NextResponse.json({ error: "Error during login!" });
    }
  }

  return NextResponse.json({ loggedUser, success });
}
