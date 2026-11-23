'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, User } from 'lucide-react';

function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // BottomNav will show if user scrolls down more than 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Fixed at the bottom, centered, with a floating pill design
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-86.25 md:w-90 max-w-md z-50 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100' // Visible state
          : 'translate-y-24 opacity-0 pointer-events-none' // Hidden state
      }`}
    >
      <div className='bg-neutral-950 backdrop-blur-lg border border-neutral-900 rounded-full shadow-2xl w-86.25 md:w-90 h-16 md:h-20'>
        <div className='flex items-center justify-between px-2.875 md:px-4.25 mt-1.5 md:mt-3.5'>
          {/* Home Button */}
          <div className='w-23.5'>
            <Link
              href='/'
              className={`flex flex-col items-center gap-1 transition-colors ${
                pathname === '/'
                  ? 'text-primary-200'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Home
                size={24}
                className={`w-5 h-5 md:w-6 md:h-6 ${pathname === '/' ? 'fill-primary-200' : ''}`}
              />
              <span className='text-base leading-7.5 tracking-[-0.02em] font-bold text-primary-200'>
                Home
              </span>
            </Link>
          </div>

          {/* Create Post Button (Blue/Purple Circle) */}
          <div className='flex items-center'>
            <Link
              href='/create'
              className='flex items-center justify-center w-11 md:w-12 h-11 md:h-12 bg-primary-300 hover:bg-primary-200 rounded-full text-neutral-25 shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 border-4 border-[#050505]'
              aria-label='Create Post'
            >
              <Plus className='w-5.5 md:w-6 h-5.5 md:h-6' />
            </Link>
          </div>

          {/* Profile Button */}
          <div className='w-23.5'>
            <Link
              href='/profile'
              className={`flex flex-col items-center gap-1 transition-colors ${
                pathname === '/profile'
                  ? 'text-neutral-25'
                  : 'text-base-white hover:text-neutral-500'
              }`}
            >
              <User
                className={`w-5 h-5 md:w-6 md:h-6 ${pathname === '/profile' ? 'fill-white' : ''}`}
              />
              <span className='text-base leading-7.5 tracking-[-0.02em] font-normal'>
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
