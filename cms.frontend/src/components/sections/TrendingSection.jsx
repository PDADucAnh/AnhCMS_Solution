import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const TrendingSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                height: '500px', 
                backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: '#2d6a4f', fontWeight: 600, mb: 2, textTransform: 'uppercase' }}>
              Trending Now
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.2 }}>
              The Modern Aesthetic: Minimalist Fashion 2026
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              This season, it's all about clean lines, neutral tones, and versatile pieces that transition seamlessly from day to night. Discover how to build a timeless wardrobe that reflects your unique personality while staying ahead of the trends.
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>1</Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Sustainable Materials & Ethical Sourcing</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>2</Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Bold Silhouettes & Oversized Fits</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>3</Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Tech-Infused Fabrics for Active Lifestyles</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                mt: 5,
                backgroundColor: '#1a1a1a', 
                color: '#fff', 
                px: 5, 
                py: 2,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#333' } 
              }}
            >
              Explore Trends
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TrendingSection;
