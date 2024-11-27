import React from 'react';

export default function CartItem({ item, updateQuantity }) {
  const { _id, foodName, price, quantity } = item;

  return (
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <div className="flex items-center space-x-4">
        <img src={item.imagePath} alt={foodName} className="w-20 h-20 object-cover rounded-md" />
        <div className="text-gray-800">
          <h3 className="font-semibold">{foodName}</h3>
          <p className="text-gray-600">${price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full"
          onClick={() => updateQuantity(_id, 'decrease')}
        >
          -
        </button>
        <span className="text-lg">{quantity}</span>
        <button 
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full"
          onClick={() => updateQuantity(_id, 'increase')}
        >
          +
        </button>
      </div>
    </div>
  );
}
