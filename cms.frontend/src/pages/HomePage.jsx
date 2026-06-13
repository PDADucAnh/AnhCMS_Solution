import React from 'react';
import HeroBanner from '../components/sections/HeroBanner';
import ProductGrid from '../components/sections/ProductGrid';
import TrendingSection from '../components/sections/TrendingSection';
import BlogSection from '../components/sections/BlogSection';
import { Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box>
      <HeroBanner />
      <ProductGrid />
      <TrendingSection />
      <BlogSection />
    </Box>
  );
};

export default HomePage;
