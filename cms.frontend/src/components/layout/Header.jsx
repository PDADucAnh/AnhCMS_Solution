import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, InputBase, Box, Container } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { FaSearch, FaShoppingCart, FaPhoneAlt, FaEnvelope, FaUser, FaBars } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid #ddd',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    color: '#333',
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  padding: '8px 0',
  borderBottom: '1px solid #eee',
  fontSize: '0.875rem',
}));

const Header = () => {
  const { cartCount } = useCart();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Bar */}
      <TopBar>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <FaPhoneAlt color="#2d6a4f" />
                <Typography variant="body2">Hotline: 0123 456 789</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <FaEnvelope color="#2d6a4f" />
                <Typography variant="body2">Email: support@anhcms.fashion</Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Button size="small" component={Link} to="/login" startIcon={<FaUser />}>Login</Button>
              <Button size="small" component={Link} to="/register">Register</Button>
            </Box>
          </Box>
        </Container>
      </TopBar>

      {/* Main Header */}
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: '#2d6a4f',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              AnhCMS.Fashion
            </Typography>

            <Search sx={{ flexGrow: 1, maxWidth: '500px' }}>
              <SearchIconWrapper>
                <FaSearch />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box display="flex" alignItems="center">
              <IconButton size="large" aria-label="show cart" color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="error">
                  <FaShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
              >
                <FaBars />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Navigation */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, borderBottom: '1px solid #eee' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" py={1}>
            <Button component={Link} to="/" sx={{ color: '#333', mx: 2, fontWeight: 500 }}>Home</Button>
            <Button component={Link} to="/store" sx={{ color: '#333', mx: 2, fontWeight: 500 }}>Store</Button>
            <Button component={Link} to="/blog" sx={{ color: '#333', mx: 2, fontWeight: 500 }}>News/Blog</Button>
            <Button component={Link} to="/about" sx={{ color: '#333', mx: 2, fontWeight: 500 }}>About Us</Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
