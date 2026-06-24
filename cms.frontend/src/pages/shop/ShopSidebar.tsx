import React from 'react';
import { useProductCategories } from '../../hooks/useCategories';

interface ShopSidebarProps {
  onCategoryChange: (id: number | null) => void;
  activeId: number | null;
}

const ShopSidebar = ({ onCategoryChange, activeId }: ShopSidebarProps) => {
  const { data: categories = [] } = useProductCategories();

  return (
    <div className="flex flex-col gap-stack-md">
      <div className="mb-stack-sm border-b border-surface-variant pb-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Filter By</h2>
        <button
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline bg-transparent border-0 p-0 cursor-pointer"
          onClick={() => onCategoryChange(null)}
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Division</h3>
        <div className="flex flex-col gap-2">
          <button
            className={`text-left bg-transparent border-0 p-0 font-body-md text-body-md transition-colors cursor-pointer ${
              activeId === null ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => onCategoryChange(null)}
          >
            The Full Collection
          </button>
          {(categories as any[]).map((cat: any) => (
            <button
              key={cat.id}
              className={`text-left bg-transparent border-0 p-0 font-body-md text-body-md transition-colors cursor-pointer ${
                activeId === cat.id ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
              }`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm mt-4">
        <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Price Range</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" name="price" type="radio" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Under $50</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" name="price" type="radio" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">$50 - $100</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" name="price" type="radio" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">$100 - $150</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" name="price" type="radio" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Over $150</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm mt-4">
        <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Occasion</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" type="checkbox" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Anniversary</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" type="checkbox" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Birthday</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" type="checkbox" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Sympathy</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 transition-colors" type="checkbox" />
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Just Because</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
