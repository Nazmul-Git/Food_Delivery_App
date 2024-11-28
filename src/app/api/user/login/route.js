import { connectionUrl } from "@/app/lib/db";
import UserModel from "@/app/lib/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  let payload = await req.json();
  let loggedUser;
  let success = false;
  await mongoose.connect(connectionUrl);
  if (payload) {
    loggedUser = await UserModel.findOne({ email: payload.email, password: payload.password });
    if (loggedUser) {
      success = true;
    }
  }

  return NextResponse.json({ loggedUser, success });
}