import mongoose from 'mongoose';

const deliveryUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true},
}, { timestamps: true });


const DeliveryUserModel = mongoose.models.deliveryPartners || mongoose.model('deliveryPartners', deliveryUserSchema);

export default DeliveryUserModel;
