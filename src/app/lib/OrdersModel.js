const mongoose = require('mongoose');

// Create a schema for the food item
const ordersSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId
    },
    foodItemId: {
        type: String
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    delivery_Id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String,
    },
    amount: {
        type: String,
    },
}, {
    timestamps: true,
});

// Create a model based on the schema
const OrderModel = mongoose.models.orders || mongoose.model('orders', ordersSchema);

module.exports = OrderModel;
