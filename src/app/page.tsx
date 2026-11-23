'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/features/timeline/components/PostCard';
import { mockPosts } from '@/lib/mockPosts';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // OPTIONAL: Protect the homepage so only logged-in users can see the timeline
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Prevent flash of content before redirect
  if (!isAuthenticated) return null;

  return (
    <div className='min-h-screen bg-black text-white font-sans selection:bg-primary-300 selection:text-white'>
      {/* 1. INCLUDE NAVBAR HERE */}
      <Navbar />

      {/* 2. MAIN TIMELINE CONTENT */}
      {/* Added pt-20 (padding-top) so the fixed navbar doesn't overlap the feed */}
      <main className='max-w-xl mx-auto pt-20 pb-24'>
        {/* Optional: Add a "Create Post" input box at the top like typical social apps */}
        <div className='px-4 py-4 border-b border-neutral-900 mb-4'>
          <div className='flex items-center gap-3 bg-neutral-900/50 rounded-full px-4 py-2.5 border border-neutral-800 cursor-text'>
            <div className='w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden'>
              <img
                src='https://i.pravatar.cc/150?u=currentuser'
                alt='My Profile'
                className='w-full h-full object-cover'
              />
            </div>
            <span className='text-neutral-500 text-sm'>
              What's on your mind?
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
