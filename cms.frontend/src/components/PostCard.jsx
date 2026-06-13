import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7224";

function PostCard({ post }) {
    const imageUrl = post.imageUrl?.startsWith('http') 
        ? post.imageUrl 
        : `${IMAGE_BASE_URL}${post.imageUrl || ''}`;

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
            <div className="flex items-center gap-2 text-secondary text-[10px] mb-2 uppercase tracking-widest font-bold">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>{post.createdDate ? new Date(post.createdDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'New Editorial'}</span>
            </div>
            <h3 className="font-display-xl text-xl mb-sm group-hover:text-secondary transition-colors uppercase tracking-tighter font-bold">
                <Link to={`/blog/${post.id}`} className="text-primary text-decoration-none hover:text-secondary transition-colors">{post.title}</Link>
            </h3>
            <p className="text-secondary text-sm line-clamp-2 mb-md text-justify serif italic leading-relaxed">
                {post.summary || 'Elevating the everyday through minimalist design and uncompromising quality. Discover the essence of modern fashion.'}
            </p>
            <div className="mt-auto">
                <Link 
                    to={`/blog/${post.id}`}
                    className="font-label-sm text-[10px] uppercase tracking-[0.3em] border-b border-primary pb-1 hover:text-secondary transition-colors text-decoration-none text-primary font-bold"
                >
                    Read Narrative →
                </Link>
            </div>
        </div>
    );
}

export default PostCard;
