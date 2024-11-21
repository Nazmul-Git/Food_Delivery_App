import React, { useState } from 'react';

export default function AddFoodItem() {
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(foodName, description, price, category, imagePath);

        // Basic validation
        if (!foodName || !description || !price || !category || !imagePath) {
            setErrorMessage('All fields are required.');
            setSuccessMessage('');
            return;
        }

        if (isNaN(price) || price <= 0) {
            setErrorMessage('Price must be a valid positive number.');
            setSuccessMessage('');
            return;
        }

        // Reset messages
        setErrorMessage('');

        let restaurantId;
        const restaurantData = JSON.parse(localStorage.getItem('restaurantUser'));
        if (restaurantData) restaurantId = restaurantData._id;
        let response = await fetch('http://localhost:3000/api/restaurants/foods', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ restaurantId, foodName, description, price, category, imagePath })
        });
        console.log(response)
        response = await response.json();
        if (response.success) {
            setSuccessMessage('Food item added successfully!');
            setFoodName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImagePath('');
        } else {
            setErrorMessage('Failed to add food list!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white/50 backdrop-blur-lg p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Add Food Item</h2>
                {errorMessage && (
                    <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-md">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 text-green-600 bg-green-100 border border-green-300 rounded-md">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="foodName" className="block text-gray-700 font-medium">Food Name</label>
                        <input
                            type="text"
                            id="foodName"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter the name of the food"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter a description of the food item"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-gray-700 font-medium">Price (in $)</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter the price"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="starter">Starter</option>
                            <option value="main_course">Main Course</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverages">Beverages</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-gray-700 font-medium">Food Image</label>
                        <input
                            type="text"
                            id="image"
                            value={imagePath}
                            onChange={(e) => setImagePath(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter the image url"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Food Item
                    </button>
                </form>
            </div>
        </div>
    );
}
