import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, CircularProgress, Alert, Divider, Chip } from '@mui/material';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductDetail(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}>
      <CircularProgress sx={{ color: '#2d6a4f' }} />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 5 }}>
      <Alert severity="error">{error}</Alert>
      <Button startIcon={<FaArrowLeft />} onClick={() => navigate(-1)} sx={{ mt: 2, color: '#2d6a4f' }}>
        Back to Store
      </Button>
    </Container>
  );

  if (!product) return null;

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Button 
          startIcon={<FaArrowLeft />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 4, color: '#666', '&:hover': { color: '#2d6a4f', backgroundColor: 'transparent' } }}
        >
          Back
        </Button>

        <Grid container spacing={6}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                width: '100%', 
                height: { xs: '400px', md: '600px' }, 
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {product.isSale && (
                <Chip 
                  label="SALE" 
                  color="error" 
                  sx={{ position: 'absolute', top: 20, left: 20, fontWeight: 'bold', fontSize: '1rem', px: 1 }} 
                />
              )}
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/600x800?text=Product+Image'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Product ID: #{product.id}
              </Typography>
              
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                {product.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={4}>
                {product.discountPrice ? (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d6a4f' }}>
                      ${product.discountPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="h5" sx={{ textDecoration: 'line-through', color: '#999' }}>
                      ${product.price.toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d6a4f' }}>
                    ${product.price?.toLocaleString() || 0}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.8 }}>
                {product.description || 'This premium fashion item is designed to offer both comfort and style. Crafted with high-quality materials, it ensures durability and a perfect fit for your everyday wardrobe needs. Upgrade your collection with this versatile piece.'}
              </Typography>

              <Box mt="auto">
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => addToCart(product)}
                  startIcon={<FaShoppingCart />}
                  sx={{ 
                    backgroundColor: '#2d6a4f', 
                    color: '#fff', 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#1b4332' } 
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
