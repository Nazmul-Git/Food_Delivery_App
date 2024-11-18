const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the restaurant
const RestaurantModel = new Schema({
  username: {
    type: String,
  },
  restaurantName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  restaurantType: {
    type: String,
  },
  password: {
    type: String,
  },
});

// Check if the model is already defined, otherwise define it
// Using the singular "Restaurant" for model name and plural "restaurants" for the collection
export const RestaurantsSchema = mongoose.models.restaurants || mongoose.model('restaurants', RestaurantModel);
