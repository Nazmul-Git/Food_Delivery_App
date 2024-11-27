import React from 'react';
import { GiCrossMark } from "react-icons/gi";
import { FaPlus, FaMinus } from "react-icons/fa";


export default function CartItem({ item, updateQuantity, handleRemoveItem, limitDescription }) {
    const { _id, foodName, price, description, quantity } = item;

    return (
        <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div className="flex items-center space-x-4">
                <button onClick={() => handleRemoveItem(item._id)} className='bg-red-700 p-1'> <GiCrossMark /> </button>
                <img src={item.imagePath} alt={foodName} className="w-20 h-20 object-cover rounded-md" />
                <div className="text-gray-800">
                    <h3 className="font-semibold">{foodName}</h3>
                    <p className="text-gray-600">${price}</p>
                    <p className="text-gray-600">{limitDescription(description)}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    className="bg-gray-300 font-bold text-gray-800 px-3 py-1 rounded-full"
                    onClick={() => updateQuantity(_id, 'decrease')}
                >
                    <FaMinus />
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                    className="bg-gray-300 font-bold text-gray-800 px-3 py-1 rounded-full"
                    onClick={() => updateQuantity(_id, 'increase')}
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
}
