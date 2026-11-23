'use client';

import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import PostCard from '@/features/timeline/components/PostCard';
import { mockPosts } from '@/lib/mockPosts';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

function Home() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className='min-h-screen bg-black text-neutral-25 font-sans selection:bg-primary-300 selection:text-neutral-25'>
      <Navbar />
      <main className='max-w-xl mx-auto pt-20 pb-32'>
        {/* "Create Post" input box */}
        <div className='px-4 py-4 border-b border-neutral-900 mb-4'>
          <div className='flex items-center gap-3 bg-neutral-900/50 rounded-full px-4 py-2.5 border border-neutral-800 cursor-text'>
            {/* Avatar Logic */}
            <div className='w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center text-neutral-400 shrink-0'>
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt='User'
                  className='w-full h-full object-cover'
                />
              ) : (
                <User size={18} />
              )}
            </div>
            <span className='text-neutral-500 text-sm'>
              {isAuthenticated
                ? "What's on your mind?"
                : 'Log in to share your thoughts...'}
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default Home;
