import React from 'react';

interface ShopHeaderProps {
  count: number;
  page?: number;
  pageSize?: number;
}

const ShopHeader = ({ count, page = 1, pageSize = 9 }: ShopHeaderProps) => {
  const from = count > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, count);
  return (
    <div className="flex justify-between items-center mb-stack-lg pb-4 border-b border-surface-variant">
      <p className="font-body-md text-body-md text-on-surface-variant">
        {count > 0 ? `Showing ${from}-${to} of ${count} results` : 'No results'}
      </p>
      <div className="flex items-center gap-2">
        <span className="font-label-md text-label-md text-on-surface">Sort by:</span>
        <select className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded px-3 py-1 focus:ring-primary focus:border-primary outline-none transition-colors">
          <option>Featured</option>
          <option>Price, low to high</option>
          <option>Price, high to low</option>
          <option>New Arrivals</option>
        </select>
      </div>
    </div>
  );
};

export default ShopHeader;
