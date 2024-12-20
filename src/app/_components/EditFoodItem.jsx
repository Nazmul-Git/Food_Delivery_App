'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditFoodItem = ({ params }) => {
    const router = useRouter();
    const { id } = params; // Extracting id directly from params

    // Initialize state for form fields
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch food item data when the id is available
    useEffect(() => {
        if (id) {
            handleLoadedItemData();
        }
    }, [id]);

    const handleLoadedItemData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/dashboard/${id}`);
            const data = await response.json();

            if (response.ok && data.success) {
                const { foodName, description, price, category, imagePath } = data;
                setFoodName(foodName);
                setDescription(description);
                setPrice(price);
                setCategory(category);
                setImagePath(imagePath);
            } else {
                setErrorMessage('Failed to fetch food item details.');
            }
        } catch (error) {
            console.error('Error loading item data:', error);
            setErrorMessage('An error occurred while fetching the food item.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/dashboard/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ foodName, description, price, category, imagePath }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage('Food item updated successfully!');
                setTimeout(() => router.push('/restaurants/dashboard'), 2000); // Navigate to dashboard after success
            } else {
                setErrorMessage(data.message || 'Failed to update food item.');
            }
        } catch (error) {
            // console.error('Error updating food item:', error);
            setErrorMessage('An error occurred while updating the food item.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white/50 backdrop-blur-lg p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Edit Food Item</h2>
                {errorMessage && (
                    <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-md">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 text-green-600 bg-green-100 border border-green-300 rounded-md">{successMessage}</div>
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
                        <label htmlFor="price" className="block text-gray-700 font-medium">Price</label>
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
                        <label htmlFor="imagePath" className="block text-gray-700 font-medium">Image URL</label>
                        <input
                            type="text"
                            id="imagePath"
                            value={imagePath}
                            onChange={(e) => setImagePath(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter the image URL"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    >
                        Update Food Item
                    </button>
                    <button
                        type="button"
                        className="w-full py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 focus:ring-2 focus:ring-gray-300"
                        onClick={() => router.push('../dashboard')}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFoodItem;
