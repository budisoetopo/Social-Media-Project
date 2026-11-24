'use client';

import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import PostCard from '@/features/timeline/components/PostCard';
import { usePosts } from '@/features/auth/hooks/usePosts';
import { useAuthStore } from '@/store/authStore';
import { User, Loader2, AlertCircle } from 'lucide-react';

function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const { data: posts, isLoading, isError } = usePosts();

  return (
    <div className='min-h-screen bg-base-black text-neutral-25 font-sans selection:bg-primary-300 selection:text-neutral-25'>
      <Navbar />
      <main className='max-w-xl mx-auto pt-20 pb-32'>
        {/* Loading State */}
        {isLoading && (
          <div className='flex flex-col items-center justify-center py-20 text-neutral-500'>
            <Loader2 className='w-8 h-8 animate-spin mb-4 text-[#8b5cf6]' />
            <p>Loading timeline...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className='flex flex-col items-center justify-center py-20 text-red-500'>
            <AlertCircle className='w-8 h-8 mb-4' />
            <p>Failed to load posts. Check console for details.</p>
          </div>
        )}

        {/* Empty State */}
        {posts && posts.length === 0 && (
          <div className='text-center py-20 text-neutral-500'>
            <p>No posts yet. Click the + button to create one!</p>
          </div>
        )}

        {/* Success State */}
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default Home;
