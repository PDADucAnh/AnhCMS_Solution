import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';
import { Link } from 'react-router-dom';
import type { Category } from '../../types/category';

interface CategoryMenuProps {
  onSelectCategory: (id: number | null) => void;
  activeId: number | null;
}

function CategoryMenu({ onSelectCategory, activeId }: CategoryMenuProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data as any as Category[]);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id: number | null) => {
        if (onSelectCategory) {
            onSelectCategory(id);
        }
    };

    if (loading) return null;

    // We can use the first few categories for a bento-style grid if we wanted, 
    // but a clean horizontal scroll or elegant list is more robust for dynamic data.
    return (
        <section className="px-margin mb-xl">
            <div className="flex justify-between items-end mb-lg">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Explore Collections</h2>
                <Link to="/shop" className="font-label-sm text-label-sm uppercase tracking-widest hover:text-secondary transition-colors border-b border-primary pb-1 text-decoration-none text-primary">View All</Link>
            </div>
            
            <div className="flex gap-md overflow-x-auto no-scrollbar pb-4">
                <button
                    onClick={() => handleCategoryClick(null)}
                    className={`flex-shrink-0 px-lg py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all border ${activeId === null ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-secondary border-outline-variant hover:border-primary hover:text-primary'}`}
                >
                    All Collections
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex-shrink-0 px-lg py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all border ${activeId === cat.id ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-secondary border-outline-variant hover:border-primary hover:text-primary'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CategoryMenu;
