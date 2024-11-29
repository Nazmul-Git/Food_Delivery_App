import { GiCrossMark } from "react-icons/gi";
import { FaPlus, FaMinus } from "react-icons/fa6";

const CartItem = ({ item, updateQuantity, handleRemoveItem, limitDescription }) => {
    return (
        <div className="cart-item flex justify-between items-center bg-white shadow-md rounded-lg p-4 my-4 hover:scale-105 transform transition duration-200 ease-in-out">

            {/* Left section with image and item details */}
            <div className="cart-item-details flex items-center gap-6">
                <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-700 text-2xl"
                >
                    <div className="flex flex-col items-center">
                        <GiCrossMark />
                        <span className="text-sm">Cancel</span>
                    </div>
                </button>

                {/* Item Image */}
                <div className="flex-shrink-0">
                    <img
                        src={item.imagePath}
                        alt={item.foodName}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                </div>

                {/* Item Description */}
                <div className="flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{item.foodName}</h3>
                    <p className="text-sm text-gray-500">{limitDescription(item.description)}</p>
                    <span className="text-sm font-medium text-gray-700">${item.price}</span>
                </div>
            </div>

            {/* Quantity Section */}
            <div className="cart-item-actions flex items-center gap-4 bg-gray-50 rounded-lg py-2 px-4">
                {/* Decrease Button */}
                <button
                    onClick={() => updateQuantity(item._id, 'decrease')}
                    className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-200 ease-in-out"
                >
                    <FaMinus />

                </button>

                {/* Quantity */}
                <span className="text-lg font-medium text-gray-800">{item.quantity}</span>

                {/* Increase Button */}
                <button
                    onClick={() => updateQuantity(item._id, 'increase')}
                    className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-200 ease-in-out"
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
