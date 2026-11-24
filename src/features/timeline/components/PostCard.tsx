'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User as UserIcon,
} from 'lucide-react';
import { MappedPost } from '../../auth/hooks/usePosts';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface PostCardProps {
  post: MappedPost;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle Save/Bookmark
  const handleSave = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsSaved(!isSaved);
    // TODO: Add API call to save/unsave post here later
  };

  // Handle Like, Comment, Send interactions
  const handleAction = (action: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    console.log(`Action triggered: ${action}`);
    // TODO: Add API calls for like, comment, send here later
  };

  return (
    <article className='flex flex-col gap-3 w-full bg-black pb-6 border-b border-neutral-900'>
      {/* Header: User Info */}
      <div className='flex items-center justify-between px-2'>
        <div className='flex items-center gap-3'>
          <div className='relative w-9 h-9 rounded-full overflow-hidden border border-neutral-800 bg-neutral-800 flex items-center justify-center'>
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <UserIcon size={16} className='text-neutral-500' />
            )}
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-bold text-neutral-25 leading-tight'>
              {post.user.name}
            </span>
            <span className='text-xs text-neutral-400 mt-0.5'>
              {post.timeAgo} ago
            </span>
          </div>
        </div>

        <button className='text-neutral-400 hover:text-white transition-colors'>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image Area */}
      <div className='relative w-full aspect-4/5 sm:aspect-square overflow-hidden rounded-md sm:rounded-xl border border-neutral-900'>
        <Image
          src={post.image}
          alt='Post content'
          fill
          className='object-cover'
        />

        {/* Bookmark Icon on bottom right of the picture */}
        <button
          onClick={handleSave}
          className='absolute bottom-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-neutral-25 transition-all z-10'
        >
          <Bookmark size={22} className={isSaved ? 'fill-neutral-25' : ''} />
        </button>
      </div>

      {/* Actions Area */}
      <div className='flex flex-col gap-2 px-2'>
        {/* Heartshaped Like Buttons with Counts */}
        <div className='flex items-center gap-5 mt-1'>
          <button
            onClick={() => handleAction('like')}
            className='flex items-center gap-1.5 text-neutral-400 hover:text-red-500 transition-colors group'
          >
            <Heart size={24} className='group-hover:fill-red-500' />
            <span className='text-sm font-medium'>{post.likes}</span>
          </button>

          <button
            onClick={() => handleAction('comment')}
            className='flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors'
          >
            <MessageCircle size={24} />
            <span className='text-sm font-medium'>{post.comments}</span>
          </button>

          <button
            onClick={() => handleAction('send')}
            className='flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors'
          >
            <Send size={24} />
            {/* Assuming you add 'shares' to your mapped post type, defaulting to 0 for now */}
            <span className='text-sm font-medium'>{post.shares || 0}</span>
          </button>
        </div>

        {/* Caption with Show More */}
        {post.caption && post.caption.length > 0 && (
          <div className='mt-1'>
            <p
              className={`text-sm text-neutral-300 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
            >
              <span className='font-bold text-neutral-25 mr-2'>
                {post.user.username}
              </span>
              {post.caption}
            </p>

            {/* Show "Show more" if the caption is more than 80 characters */}
            {post.caption.length > 80 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='text-xs text-neutral-500 hover:text-white mt-1 transition-colors'
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
