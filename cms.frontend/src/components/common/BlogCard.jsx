import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Link } from '@mui/material';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const BlogCard = ({ post }) => {
  const { title, imageUrl, createdDate, categoryName } = post;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, boxShadow: 'none', border: '1px solid #eee' }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl || 'https://via.placeholder.com/400x250?text=Blog+Post'}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="caption" sx={{ color: '#2d6a4f', fontWeight: 600, textTransform: 'uppercase' }}>
            {categoryName || 'Fashion'}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <FaCalendarAlt size={12} color="#999" />
            <Typography variant="caption" color="text.secondary">
              {new Date(createdDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {title}
        </Typography>
        <Link 
          href="#" 
          sx={{ 
            color: '#333', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': { color: '#2d6a4f' }
          }}
        >
          Read More <FaChevronRight size={10} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
