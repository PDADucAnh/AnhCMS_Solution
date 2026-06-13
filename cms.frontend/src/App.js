import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import { CartProvider } from './context/CartContext';

// Create a custom theme for AnhCMS.Fashion
const theme = createTheme({
  palette: {
    primary: {
      main: '#2d6a4f', // Forest green
    },
    secondary: {
      main: '#1a1a1a', // Dark charcoal
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Fashion style usually uses sharp corners
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/store" element={<HomePage />} />
              <Route path="/blog" element={<HomePage />} />
              <Route path="/about" element={<HomePage />} />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
