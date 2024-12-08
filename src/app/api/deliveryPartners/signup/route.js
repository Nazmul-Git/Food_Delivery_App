import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectionUrl } from '@/app/lib/db';
import DeliveryUserModel from '@/app/lib/DeliveryUserModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// Secret key for signing the JWT (store this securely, such as in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  let payload = await req.json();
  let signedUser;
  let success = false;

  await mongoose.connect(connectionUrl);

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Create the new user with the hashed password
    const user = new DeliveryUserModel({
      ...payload,
      password: hashedPassword,
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
    return NextResponse.json({ error: 'Error saving user!' });
  }

  return NextResponse.json({ error: 'Signup failed!' });
}
