import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Divider, TextField, Alert
} from '@mui/material';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import cartService from '../services/cartService';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      // In a real app, you'd get the CustomerId from an Auth context
      const orderData = {
        customerId: 1, // Placeholder
        notes: `Order for ${cartItems.length} items. Total: $${cartTotal}`,
      };
      
      const response = await cartService.submitOrder(orderData);
      alert('Order placed successfully! Order ID: ' + response.orderId);
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <FaShoppingCart size={80} color="#ddd" style={{ marginBottom: '20px' }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/" 
          size="large"
          sx={{ mt: 2, backgroundColor: '#2d6a4f', '&:hover': { backgroundColor: '#1b4332' } }}
        >
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/80x100'} 
                            alt={item.name} 
                            style={{ width: 60, height: 80, objectFit: 'cover' }} 
                          />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        ${(item.discountPrice || item.price).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <FaMinus size={12} />
                          </IconButton>
                          <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FaPlus size={12} />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        ${((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                          <FaTrash size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button 
              startIcon={<FaArrowLeft />} 
              component={Link} 
              to="/"
              sx={{ mt: 3, color: '#666' }}
            >
              Continue Shopping
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>${cartTotal.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 600 }}>Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={4}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2d6a4f' }}>
                  ${cartTotal.toLocaleString()}
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  backgroundColor: '#2d6a4f', 
                  py: 1.5,
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#1b4332' } 
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
              
              <Box mt={3}>
                <Alert severity="info" icon={false} sx={{ fontSize: '0.8rem' }}>
                  Shipping and taxes calculated at checkout. Free shipping on orders over $100.
                </Alert>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShoppingCartPage;
