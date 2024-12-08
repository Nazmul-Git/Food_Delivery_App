import bcrypt from 'bcryptjs';
import { connectionUrl } from '@/app/lib/db';
import DeliveryUserModel from '@/app/lib/DeliveryUserModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  let payload = await req.json();
  let signedUser;
  let success = false;

  await mongoose.connect(connectionUrl);

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    
    const user = new DeliveryUserModel({
      ...payload,
      password: hashedPassword, 
    });

    signedUser = await user.save();

    if (signedUser) {
      success = true;
    }
  } catch (err) {
    // console.error('Error saving user:', err);
    return NextResponse.json({ error: 'Error saving user!' });
  }

  return NextResponse.json({ signedUser, success });
}
