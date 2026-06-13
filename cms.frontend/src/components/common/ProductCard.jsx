import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton, Chip } from '@mui/material';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { id, name, price, imageUrl, discountPrice, isSale } = product;
  const { addToCart } = useCart();

  return (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', '&:hover .product-actions': { opacity: 1 } }}>
      {isSale && (
        <Chip 
          label="SALE" 
          color="error" 
          size="small" 
          sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }} 
        />
      )}
      
      <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ width: '100%', paddingTop: '133%', position: 'relative', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
          <img 
            src={imageUrl || 'https://via.placeholder.com/300x400?text=Product'} 
            alt={name}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              padding: '12px' 
            }}
          />
        </Box>
      </Link>

      <Box 
        className="product-actions"
        sx={{ 
          position: 'absolute', 
          top: '40%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          display: 'flex', 
          gap: 1, 
          opacity: 0, 
          transition: 'opacity 0.3s' 
        }}
      >
        <IconButton 
          component={Link} 
          to={`/product/${id}`}
          sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#2d6a4f', color: '#fff' } }}
        >
          <FaEye size={18} />
        </IconButton>
        <IconButton 
          onClick={() => addToCart(product)}
          sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#2d6a4f', color: '#fff' } }}
        >
          <FaShoppingCart size={18} />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
          Category Name
        </Typography>
        <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, minHeight: '3em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: '#2d6a4f' } }}>
            {name}
          </Typography>
        </Link>
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          {discountPrice ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#2d6a4f' }}>
                ${discountPrice.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999' }}>
                ${price.toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#2d6a4f' }}>
              ${price.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
      <Box p={2} pt={0}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={() => addToCart(product)}
          startIcon={<FaShoppingCart />}
          sx={{ 
            borderColor: '#2d6a4f', 
            color: '#2d6a4f', 
            '&:hover': { backgroundColor: '#2d6a4f', color: '#fff', borderColor: '#2d6a4f' } 
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
