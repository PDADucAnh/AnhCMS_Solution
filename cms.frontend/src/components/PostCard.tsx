import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/apiUtils';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const imageUrl = getImageUrl(post.imageUrl);

    return (
        <div className="group cursor-pointer flex flex-col h-full">
            <div className="aspect-[4/3] overflow-hidden mb-md bg-surface-container relative">
                <Link to={`/blog/${post.id}`}>
                    <img 
                        src={imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={post.title}
                    />
                </Link>
            </div>
            <div className="flex items-center gap-2 text-secondary text-[10px] mb-2 uppercase tracking-widest font-medium">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>{post.createdDate ? new Date(post.createdDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
            </div>
            <h3 className="font-display-xl text-xl mb-sm group-hover:text-secondary transition-colors duration-300 uppercase tracking-tighter font-bold">
                <Link to={`/blog/${post.id}`} className="text-primary text-decoration-none hover:text-secondary transition-colors duration-300">{post.title}</Link>
            </h3>
            {/* Safe-truncated summary */}
                <p className="card-text text-secondary text-justify mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {post.summary ? `${post.summary.substring(0, 100)}...` : 'Discover style tips and fashion insights to elevate your look...'}
                </p>
            <div className="mt-auto">
                <Link 
                    to={`/blog/${post.id}`}
                    className="font-label-sm text-[10px] uppercase tracking-[0.3em] pb-1 text-decoration-none text-primary font-bold btn-link-luxury"
                >
                    Read Narrative →
                </Link>
            </div>
        </div>
    );
}

export default PostCard;
