import React from 'react';

const CartTable = ({ items, onUpdateQuantity, onRemove }) => {
  const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7111";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-[10px] uppercase text-secondary tracking-[0.2em] bg-surface-container-low font-bold">
              <th className="px-lg py-4">Item Nomenclature</th>
              <th className="px-lg py-4 text-center">Acquisition Value</th>
              <th className="px-lg py-4 text-center">Manifest Quantity</th>
              <th className="px-lg py-4 text-right">Total</th>
              <th className="px-lg py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map((item) => {
              const imageUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`;
              return (
                <tr key={item.id} className="table-row-hover transition-colors">
                  <td className="px-lg py-6">
                    <div className="flex items-center gap-lg">
                      <div className="size-20 flex-shrink-0 bg-surface-container overflow-hidden border border-outline-variant">
                        <img 
                          src={imageUrl || 'https://via.placeholder.com/100x125'} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-body-md font-bold uppercase tracking-tight block">
                            {item.name}
                        </span>
                        <span className="text-[10px] text-outline uppercase tracking-widest block">ID: #LX-PRD-{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-6 text-center text-body-md serif">
                    {item.price.toLocaleString()} ₫
                  </td>
                  <td className="px-lg py-6">
                    <div className="flex items-center justify-center gap-md">
                      <button 
                        className="size-8 flex items-center justify-center border border-outline-variant bg-transparent text-secondary hover:text-primary hover:border-primary transition-all outline-none" 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        className="size-8 flex items-center justify-center border border-outline-variant bg-transparent text-secondary hover:text-primary hover:border-primary transition-all outline-none" 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-lg py-6 text-right font-bold serif text-lg">
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </td>
                  <td className="px-lg py-6 text-right">
                    <button 
                      className="bg-transparent border-0 text-error hover:text-red-800 transition-colors p-2 outline-none" 
                      onClick={() => onRemove(item.id)}
                    >
                      <span className="material-symbols-outlined">delete_outline</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartTable;
