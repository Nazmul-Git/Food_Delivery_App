import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from '@/app/lib/db';
import DeliveryUserModel from '@/app/lib/DeliveryUserModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  let payload = await req.json();
  let signedUser;
  let success = false;

  await mongoose.connect(connectionUrl);

  try {
    // Check if the phone number already exists
    const existingUser = await DeliveryUserModel.findOne({ phone: payload.phone });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number is already in use.',
        },
        { status: 400 }
      );
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Create the new user with the hashed password
    const user = new DeliveryUserModel({
      ...payload,
      password: hashedPassword,
      userType: 'deliveryUser',
    });

    signedUser = await user.save();

    if (signedUser) {
      success = true;

      // Generate JWT token after user is saved
      const token = jwt.sign(
        { userId: signedUser._id, fullName: signedUser.fullName, phone: signedUser.phone },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Optionally, you could exclude sensitive information like the password
      const userWithoutPassword = { ...signedUser.toObject() };
      delete userWithoutPassword.password;

      // Return the signed user and token
      return NextResponse.json({
        success,
        signedUser: userWithoutPassword,
        token,
      });
    }
  } catch (err) {
    console.error('Error saving user:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Error saving user!',
      },
      { status: 500 }
    );
  } finally {
    mongoose.connection.close();
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Signup failed!',
    },
    { status: 400 }
  );
}
