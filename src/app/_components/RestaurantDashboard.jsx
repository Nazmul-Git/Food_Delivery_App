import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import YesNoModal from './YesNoModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RestaurantDashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const router = useRouter();

    const openDeleteModal = (itemId) => {
        setSelectedItemId(itemId);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setSelectedItemId(null);
    };

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true);
                const restUser = JSON.parse(localStorage.getItem('restaurantUser'));
                if (!restUser || !restUser._id) throw new Error('Invalid restaurant user data');

                const restaurantId = restUser._id;
                let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/foods/${restaurantId}`);
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
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/foods/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                toast.error('Failed to delete food item. Please try again.');
                return;
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Food item deleted successfully!');
                setFoodItems((prev) => prev.filter((item) => item._id !== id));
            } else {
                toast.error(result.message || 'Failed to delete food item');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            toast.error('An error occurred while deleting the food item.');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'dashboard':
                return (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                        <p className="text-gray-600">Welcome to your restaurant dashboard! Here you can manage food items, view statistics, and more.</p>
                    </div>
                );

            case 'foodItems':
                return foodItems.length === 0 ? (
                    <p className="text-gray-500 text-center">No food items available. Start adding some!</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-lg shadow-md text-sm sm:text-base">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-2 py-2 sm:px-4 text-left">#</th>
                                        <th className="px-2 py-2 sm:px-4 text-left">Image</th>
                                        <th className="px-2 py-2 sm:px-4 text-left">Name</th>
                                        <th className="px-2 py-2 sm:px-4 text-left hidden sm:table-cell">Description</th>
                                        <th className="px-2 py-2 sm:px-4 text-left">Price</th>
                                        <th className="px-2 py-2 sm:px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodItems.map((item, index) => (
                                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-2 py-3 sm:px-4">{index + 1}</td>
                                            <td className="px-2 py-3 sm:px-4">
                                                <img
                                                    src={item.imagePath || 'https://via.placeholder.com/80'}
                                                    alt={item.foodName}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="px-2 py-3 sm:px-4 font-semibold">{item.foodName}</td>
                                            <td className="px-2 py-3 sm:px-4 text-gray-600 hidden sm:table-cell">
                                                {item.description.length > 30
                                                    ? `${item.description.substring(0, 30)}...`
                                                    : item.description}
                                            </td>
                                            <td className="px-2 py-3 sm:px-4 font-bold text-indigo-600">
                                                ${parseFloat(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-2 py-3 md:mt-4 mt-3 sm:px-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => router.push(`/restaurants/dashboard/${item._id}`)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition text-xs sm:text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-xs sm:text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {showModal && (
                            <YesNoModal
                                isOpen={showModal} 
                                onClose={closeDeleteModal} 
                                onConfirm={() => {
                                    handleDelete(selectedItemId);
                                    closeDeleteModal();
                                }}
                                message="Are you sure you want to delete this item?"
                            />
                        )}
                    </>
                );

            case 'statistics':
                return (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                        <p className="text-gray-600">This section will display detailed statistics about your restaurant's performance.</p>
                    </div>
                );

            default:
                return <p className="text-gray-500">Invalid Tab</p>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-screen">
                <p className="text-gray-600 text-lg">Loading food items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full min-h-screen">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-indigo-600 text-white py-4 shadow-md">
                <div className="container mx-auto px-4 flex justify-between items-center flex-col sm:flex-row">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Restaurant Dashboard</h1>
                    <nav className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            className={`${currentTab === 'dashboard' ? 'bg-white text-indigo-600' : 'text-white'} px-3 py-2 sm:px-4 sm:py-2 rounded-md transition text-sm sm:text-base`}
                            onClick={() => setCurrentTab('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`${currentTab === 'foodItems' ? 'bg-white text-indigo-600' : 'text-white'} px-3 py-2 sm:px-4 sm:py-2 rounded-md transition text-sm sm:text-base`}
                            onClick={() => setCurrentTab('foodItems')}
                        >
                            Food Items
                        </button>
                        <button
                            className={`${currentTab === 'statistics' ? 'bg-white text-indigo-600' : 'text-white'} px-3 py-2 sm:px-4 sm:py-2 rounded-md transition text-sm sm:text-base`}
                            onClick={() => setCurrentTab('statistics')}
                        >
                            Statistics
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {renderContent()}
            </main>

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
}
