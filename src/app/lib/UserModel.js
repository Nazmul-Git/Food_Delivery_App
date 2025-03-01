import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_Id: {type: String},
  fullName: { type: String, },
  email: { type: String, required: true, unique: true },
  phone: { type: String, },
  address: { type: String, },
  password: { type: String, },
  image: { type: String },
  userType: { type: String },
  socialAuth: { type: Boolean, default: false }
}, { timestamps: true });

const UserModel = mongoose.models.users || mongoose.model('users', userSchema);

export default UserModel;
