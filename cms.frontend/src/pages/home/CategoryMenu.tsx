import React from 'react';
import { useProductCategories } from '../../hooks/useCategories';
import { Link } from 'react-router-dom';

interface CategoryMenuProps {
  onSelectCategory: (id: number | null) => void;
  activeId: number | null;
}

function CategoryMenu({ onSelectCategory, activeId }: CategoryMenuProps) {
    const { data: categories = [], isLoading } = useProductCategories();

    if (isLoading) return null;

    const handleCategoryClick = (id: number | null) => {
        if (onSelectCategory) {
            onSelectCategory(id);
        }
    };

    const btnClass = (isActive: boolean) =>
        'flex-shrink-0 px-lg py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all border ' +
        (isActive
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface text-secondary border-outline-variant hover:border-primary hover:text-primary');

    return (
        <section className="px-margin mb-xl">
            <div className="flex justify-between items-end mb-lg">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Explore Collections</h2>
                <Link to="/shop" className="font-label-sm text-label-sm uppercase tracking-widest hover:text-secondary transition-colors border-b border-primary pb-1 text-decoration-none text-primary">View All</Link>
            </div>

            <div className="flex gap-md overflow-x-auto no-scrollbar pb-4">
                <button
                    onClick={() => handleCategoryClick(null)}
                    className={btnClass(activeId === null)}
                >
                    All Collections
                </button>
                {(categories as any[]).map((cat: any) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={btnClass(activeId === cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CategoryMenu;
