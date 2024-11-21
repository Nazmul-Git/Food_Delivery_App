'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RestaurantDashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true);
                const restUser = JSON.parse(localStorage.getItem('restaurantUser'));
                if (!restUser || !restUser._id) throw new Error('Invalid restaurant user data');

                const restaurantId = restUser._id;
                let response = await fetch(`http://localhost:3000/api/restaurants/foods/${restaurantId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch food items');
                }
                response = await response.json();
                setFoodItems(response.data || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this food item?");
        if (!confirmDelete) return;

        try {
            setLoading(true);

            const response = await fetch(`http://localhost:3000/api/restaurants/foods/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Failed to delete food item. Please try again.");
                return;
            }

            const result = await response.json();
            if (result.success) {
                alert("Food item deleted successfully!");
                // Remove the deleted item from the UI
                setFoodItems((prev) => prev.filter((item) => item._id !== id));
            } else {
                alert(result.message || "Failed to delete food item");
            }
        } catch (error) {
            console.error("Error deleting food item:", error);
            alert("An error occurred while deleting the food item.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-600 text-lg">Loading food items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
                Restaurant Dashboard
            </h1>
            {foodItems.length === 0 ? (
                <p className="text-gray-500 text-center">No food items available. Start adding some!</p>
            ) : (
                <table className="w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Image</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item, index) => (
                            <tr
                                key={item._id}
                                className="border-b border-gray-200 hover:bg-gray-100"
                            >
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">
                                    <img
                                        src={item.imagePath || 'https://via.placeholder.com/80'}
                                        alt={item.foodName}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </td>
                                <td className="px-4 py-3 font-semibold">{item.foodName}</td>
                                <td className="px-4 py-3 text-gray-600">{item.description}</td>
                                <td className="px-4 py-3 font-bold text-indigo-600">
                                    ${parseFloat(item.price).toFixed(2)}
                                </td>
                                <td className="px-4 py-10 flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            console.log(`/restaurants/dashboard/${item._id}`);
                                            router.push(`/restaurants/dashboard/${item._id}`)}
                                        }
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
