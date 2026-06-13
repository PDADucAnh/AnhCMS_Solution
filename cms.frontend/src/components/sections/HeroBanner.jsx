import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const HeroBanner = () => {
  return (
    <Box 
      sx={{ 
        height: { xs: '400px', md: '600px' }, 
        backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, color: '#fff' }}>
        <Box maxWidth="600px">
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 2, mb: 2, textTransform: 'uppercase', color: '#2d6a4f' }}>
            New Summer Collection 2026
          </Typography>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' }, mb: 3, lineHeight: 1.1 }}>
            Define Your Style With AnhCMS
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 4, opacity: 0.9 }}>
            Explore our curated selection of modern fashion. High-quality fabrics, sustainable practices, and timeless designs.
          </Typography>
          <Box display="flex" gap={2}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                backgroundColor: '#2d6a4f', 
                color: '#fff', 
                px: 4, 
                py: 1.5,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#1b4332' } 
              }}
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                borderColor: '#fff', 
                color: '#fff', 
                px: 4, 
                py: 1.5,
                fontWeight: 600,
                '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } 
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroBanner;
