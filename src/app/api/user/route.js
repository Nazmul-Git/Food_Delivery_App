import { connectionUrl } from '@/app/lib/db';
import UserModel from '@/app/lib/UserModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// API Route for User Registration (POST)
export async function POST(req) {
  let payload = await req.json();
  let signedUser;
  let success = false;
  await mongoose.connect(connectionUrl);

  const user = new UserModel(payload);
  signedUser = await user.save();
  if (signedUser) {
    success = true;
  }
  // console.log(signedUser);
  return NextResponse.json({ signedUser, success });
}
