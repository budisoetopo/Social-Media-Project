'use client';

import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react';
import { Post } from '@/lib/mockPosts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className='flex flex-col gap-3 w-full bg-black pb-6 border-b border-neutral-900'>
      {/* Header: User Info */}
      <div className='flex items-center justify-between px-2'>
        <div className='flex items-center gap-3'>
          <div className='relative w-9 h-9 rounded-full overflow-hidden border border-neutral-800'>
            <Image
              src={post.user.avatar}
              alt={post.user.name}
              fill
              className='object-cover'
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-neutral-25 leading-tight'>
              {post.user.name}
            </span>
            <span className='text-xs text-neutral-500'>
              @{post.user.username}
            </span>
          </div>
        </div>

        <button className='text-neutral-400 hover:text-white transition-colors'>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image Area */}
      {/* Using aspect ratio to match the Figma's mostly square/portrait feel */}
      <div className='relative w-full aspect-[4/5] sm:aspect-square overflow-hidden rounded-md sm:rounded-xl border border-neutral-900'>
        <Image
          src={post.image}
          alt='Post content'
          fill
          className='object-cover'
        />
      </div>

      {/* Actions Area */}
      <div className='flex flex-col gap-2 px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button className='text-neutral-400 hover:text-primary-300 transition-colors'>
              <Heart size={24} />
            </button>
            <button className='text-neutral-400 hover:text-white transition-colors'>
              <MessageCircle size={24} />
            </button>
            <button className='text-neutral-400 hover:text-white transition-colors'>
              <Send size={24} />
            </button>
          </div>
          <button className='text-neutral-400 hover:text-white transition-colors'>
            <Bookmark size={24} />
          </button>
        </div>

        {/* Likes Count */}
        <span className='text-sm font-semibold text-neutral-25'>
          {post.likes.toLocaleString()} likes
        </span>

        {/* Caption */}
        <p className='text-sm text-neutral-300 leading-relaxed'>
          <span className='font-bold text-neutral-25 mr-2'>
            {post.user.username}
          </span>
          {post.caption}
        </p>

        {/* Comments Count & Time */}
        <div className='flex items-center gap-2 text-xs text-neutral-500 mt-1'>
          <span>View all {post.comments} comments</span>
          <span>•</span>
          <span>{post.timeAgo} ago</span>
        </div>
      </div>
    </article>
  );
}
