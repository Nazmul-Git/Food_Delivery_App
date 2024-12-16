import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, },
  email: { type: String, required: true, unique: true },
  phone: { type: String, },
  address: { type: String, },
  password: { type: String, },
  image: { type: String },
  socialAuth: { type: Boolean, default: false }
}, { timestamps: true });

const UserModel = mongoose.models.users || mongoose.model('users', userSchema);

export default UserModel;
