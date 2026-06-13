import React from 'react';

const ShopHeader = ({ count }) => {
  return (
    <div className="flex justify-between items-center mb-lg border-b border-outline-variant pb-md">
      <span className="text-label-sm uppercase tracking-widest text-secondary font-semibold">{count || 0} Distinctive Pieces</span>
      <div className="flex items-center gap-md">
        <label className="text-label-sm uppercase tracking-widest text-secondary">Sequence:</label>
        <select className="bg-transparent border-none text-label-sm uppercase tracking-widest font-bold focus:ring-0 cursor-pointer">
          <option>New Arrivals</option>
          <option>Value: Ascending</option>
          <option>Value: Descending</option>
        </select>
      </div>
    </div>
  );
};

export default ShopHeader;
