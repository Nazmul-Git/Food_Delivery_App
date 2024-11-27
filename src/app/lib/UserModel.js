import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true},
}, { timestamps: true });

userSchema.virtual('confirmPassword').get(function() {
    return this._confirmPassword;
  }).set(function(value) {
    this._confirmPassword = value;
  });

const UserModel = mongoose.models.users || mongoose.model('users', userSchema);

export default UserModel;
