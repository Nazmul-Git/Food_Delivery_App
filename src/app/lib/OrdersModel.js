const mongoose = require('mongoose');

// Create a schema for the order item
const ordersSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,  
    },
    foodItemId: {
        type: String,
        required: true, 
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,  
    },
    delivery_Id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        required: true, 
    },
    amount: {
        type: Number,  
        required: true,  
    },
    paymentMethod: {
        type: String,
        required: true,  
    },
}, {
    timestamps: true,
});

// Create a model based on the schema
const OrderModel = mongoose.models.orders || mongoose.model('orders', ordersSchema);

module.exports = OrderModel;
