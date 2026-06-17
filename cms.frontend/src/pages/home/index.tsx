import React, { useState } from 'react';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';

function Home() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const handleSelectCategory = (id: number | null) => {
        setSelectedCategoryId(id);
    };

    return (
        <div className="bg-background text-on-background font-body-md antialiased pt-20">
            <main className="max-w-[1440px] mx-auto">
                {/* Hero Section */}
                <HeroBanner />

                {/* Featured Categories / Menu */}
                <CategoryMenu 
                    onSelectCategory={handleSelectCategory} 
                    activeId={selectedCategoryId} 
                />

                {/* Trending Products Grid */}
                <ProductGrid categoryId={selectedCategoryId} />

                {/* Fashion Trends Section */}
                <LatestBlog />
            </main>

        </div>
    );
}

export default Home;
