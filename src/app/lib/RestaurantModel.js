const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the restaurant
const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true, // Ensure name is required
    trim: true, // Automatically trims spaces
  },
});

// Check if the model is already defined, otherwise define it
// Using the singular "Restaurant" for model name and plural "restaurants" for the collection
export const Restaurants = mongoose.models.restaurants || mongoose.model('restaurants', RestaurantSchema);
