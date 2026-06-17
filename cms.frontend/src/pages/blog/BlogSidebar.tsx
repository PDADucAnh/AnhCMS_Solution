import React from 'react';
import { useBlogCategories } from '../../hooks/useCategories';
import type { Category } from '../../types/category';

interface BlogSidebarProps {
  onCategoryChange: (id: number | null) => void;
  activeId: number | null;
}

const BlogSidebar = ({ onCategoryChange, activeId }: BlogSidebarProps) => {
  const { data: categories = [] } = useBlogCategories();

  return (
    <div className="space-y-xl">
      <div className="space-y-md">
        <h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary border-b border-outline-variant pb-2">Editorial Pillars</h6>
        <ul className="space-y-sm list-none p-0">
          <li>
            <button
              className={`bg-transparent border-0 p-0 text-label-sm uppercase tracking-widest transition-all ${activeId === null ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
              onClick={() => onCategoryChange(null)}
            >
              The Full Narrative
            </button>
          </li>
          {(categories as Category[]).map((cat) => (
            <li key={cat.id}>
              <button
                className={`bg-transparent border-0 p-0 text-label-sm uppercase tracking-widest transition-all ${activeId === cat.id ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-md">
        <h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary border-b border-outline-variant pb-2">Journal Highlights</h6>
        <div className="space-y-lg">
          <div className="group cursor-pointer">
            <a href="#" className="text-body-md font-bold uppercase tracking-tight text-primary group-hover:text-secondary transition-colors text-decoration-none block mb-1 leading-tight">Mastering the Evening Silhouette</a>
            <span className="text-[10px] text-outline uppercase tracking-widest font-bold">12 June 2026</span>
          </div>
          <div className="group cursor-pointer">
            <a href="#" className="text-body-md font-bold uppercase tracking-tight text-primary group-hover:text-secondary transition-colors text-decoration-none block mb-1 leading-tight">Essential Minimalism for the Office</a>
            <span className="text-[10px] text-outline uppercase tracking-widest font-bold">10 June 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
