import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material';
import BlogCard from '../common/BlogCard';
import postService from '../../services/postService';
import { FaArrowRight } from 'react-icons/fa';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch blog posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}>
      <CircularProgress sx={{ color: '#2d6a4f' }} />
    </Box>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={5}>
          <Box>
            <Typography variant="h6" sx={{ color: '#2d6a4f', fontWeight: 600, mb: 1, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Our Journal
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Latest Fashion News
            </Typography>
          </Box>
          <Button 
            endIcon={<FaArrowRight />} 
            sx={{ 
              color: '#333', 
              fontWeight: 600,
              '&:hover': { backgroundColor: 'transparent', color: '#2d6a4f' } 
            }}
          >
            View All News
          </Button>
        </Box>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {posts.slice(0, 3).map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <BlogCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BlogSection;
