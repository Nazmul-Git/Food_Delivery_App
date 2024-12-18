import mongoose from 'mongoose';

const deliveryUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  street: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });


const DeliveryUserModel = mongoose.models.deliveryPartners || mongoose.model('deliveryPartners', deliveryUserSchema);

export default DeliveryUserModel;
