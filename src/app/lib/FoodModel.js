const mongoose = require('mongoose');

// Create a schema for the food item
const foodItemSchema = new mongoose.Schema({
    restaurantId: mongoose.Schema.Types.ObjectId,
    foodName: {
        type: String,    
    },
    description: {
        type: String,  
    },
    price: {
        type: String,
    },
    category: {
        type: String,
    },
    imagePath: {
        type: String,  
    },
}, {
    timestamps: true, 
});

// Create a model based on the schema
const FoodItem =mongoose.models.foods || mongoose.model('foods', foodItemSchema);

module.exports = FoodItem;
