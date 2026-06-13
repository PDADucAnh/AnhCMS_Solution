import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1a1a1a', color: '#fff', pt: 6, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#2d6a4f', fontWeight: 700, mb: 2 }}>
              AnhCMS.Fashion
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2, lineHeight: 1.8 }}>
              Experience the latest fashion trends with AnhCMS.Fashion. We provide high-quality clothing for men and women, ensuring style and comfort in every piece.
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton sx={{ color: '#fff', '&:hover': { color: '#2d6a4f' } }}><FaFacebookF /></IconButton>
              <IconButton sx={{ color: '#fff', '&:hover': { color: '#2d6a4f' } }}><FaInstagram /></IconButton>
              <IconButton sx={{ color: '#fff', '&:hover': { color: '#2d6a4f' } }}><FaTwitter /></IconButton>
              <IconButton sx={{ color: '#fff', '&:hover': { color: '#2d6a4f' } }}><FaYoutube /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Policies */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Quick Links & Policies
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="#" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: '#2d6a4f' } }}>Shipping Policy</Link>
              <Link href="#" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: '#2d6a4f' } }}>Warranty Policy</Link>
              <Link href="#" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: '#2d6a4f' } }}>Privacy Policy</Link>
              <Link href="#" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: '#2d6a4f' } }}>Terms of Service</Link>
              <Link href="#" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: '#2d6a4f' } }}>Return & Exchange</Link>
            </Box>
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <FaMapMarkerAlt style={{ marginTop: '4px', color: '#2d6a4f' }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  123 Fashion Street, District 1, Ho Chi Minh City, Vietnam
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <FaPhoneAlt color="#2d6a4f" />
                <Typography variant="body2" sx={{ color: '#aaa' }}>+84 123 456 789</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <FaEnvelope color="#2d6a4f" />
                <Typography variant="body2" sx={{ color: '#aaa' }}>support@anhcms.fashion</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: '#333' }} />

        <Box display="flex" justifyContent="center">
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} AnhCMS.Fashion. All rights reserved. Designed by Pham Duc Anh.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
