import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Grid, CircularProgress, Alert } from '@mui/material';
import ProductCard from '../common/ProductCard';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getProductCategories()
        ]);
        setProducts(productsData);
        setCategories([{ id: 0, name: 'All' }, ...categoriesData]);
      } catch (err) {
        setError('Failed to fetch data from the server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredProducts = activeTab === 0 
    ? products 
    : products.filter(p => p.categoryProductId === categories[activeTab].id);

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}>
      <CircularProgress sx={{ color: '#2d6a4f' }} />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 5 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 2 }}>
          Featured Products
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Discover our most popular items, carefully selected for quality and style.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, width: '100%' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#2d6a4f' },
              '& .MuiTab-root.Mui-selected': { color: '#2d6a4f' },
              '& .MuiTabs-flexContainer': { justifyContent: { xs: 'flex-start', md: 'center' } }
            }}
          >
            {categories.map((cat, index) => (
              <Tab key={cat.id} label={cat.name} sx={{ fontWeight: 600, px: { xs: 2, sm: 4 } }} />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {filteredProducts.slice(0, 12).map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductGrid;
