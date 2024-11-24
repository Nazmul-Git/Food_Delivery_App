const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the restaurant
const RestaurantModel = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10,15}$/, "Phone number must be between 10 to 15 digits"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    restaurantType: {
      type: String,
      required: [true, "Restaurant type is required"],
      enum: ["italian", "mexican", "asian", "american", "vegetarian"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Restaurant image URL is required"],
    },
    description: {
      type: String,
      required: [true, "Restaurant description is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export const RestaurantsSchema =
  mongoose.models.restaurants || mongoose.model("restaurants", RestaurantModel);
