'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Avatar_Image, Logo } from '../../../public/images/imageHandler';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    router.push('/login');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-neutral-800 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md py-3'
          : 'bg-[#050505] py-4'
      }`}
    >
      {/* Note: Adjusted max-w to match the timeline width (max-w-xl) if you want it centered, 
          or keep max-w-360 for full width. I kept your original styling. */}
      <div className='w-full max-w-360 mx-auto px-4 md:px-30 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='text-2xl font-bold flex items-center gap-3.75 text-white'>
            <img
              src={Logo}
              alt='Sociality Logo'
              className='h-7 w-7 object-contain'
            />
            Sociality
          </div>
        </Link>

        {/* Right Side */}
        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <div className='flex items-center gap-4'>
              {/* CHANGED: Replaced Shopping Cart with Notifications */}
              <button className='relative p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-white'>
                <Bell size={18} />
                <span className='absolute top-0 right-0 bg-[#8b5cf6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full translate-x-1/4 -translate-y-1/4'>
                  3
                </span>
              </button>

              <div className='relative' ref={menuRef}>
                <button
                  type='button'
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <div className='w-8 h-8 rounded-full bg-neutral-800 overflow-hidden relative border border-neutral-700'>
                    <Image
                      src={user?.avatar || Avatar_Image}
                      alt='User'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <span className='text-sm font-medium text-white hidden sm:block'>
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div
                    role='menu'
                    className='absolute right-0 mt-4 w-60 bg-[#111111] rounded-2xl shadow-xl border border-neutral-800 p-4 z-50'
                  >
                    <Link
                      href='/profile'
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center gap-3 mb-4 px-2 p-2 -m-2 rounded-xl hover:bg-neutral-800/50 transition-colors cursor-pointer'
                    >
                      <div className='w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden relative shrink-0'>
                        <Image
                          src={user?.avatar || Avatar_Image}
                          alt='User'
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='overflow-hidden'>
                        <h3 className='font-bold text-white text-sm truncate'>
                          {user?.name || 'User'}
                        </h3>
                        <p className='text-xs text-neutral-400 truncate'>
                          View Profile
                        </p>
                      </div>
                    </Link>

                    {/* Navigation Links */}
                    <ul className='flex flex-col gap-1 border-t border-neutral-800 pt-3'>
                      <li>
                        <Link
                          href='/profile'
                          onClick={() => setIsMenuOpen(false)}
                          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors'
                        >
                          <UserIcon size={18} className='text-neutral-500' />
                          <span className='font-medium'>My Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href='/settings'
                          onClick={() => setIsMenuOpen(false)}
                          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors'
                        >
                          <Settings size={18} className='text-neutral-500' />
                          <span className='font-medium'>Settings</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          type='button'
                          onClick={handleSignOut}
                          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-red-500 hover:bg-neutral-800/50 transition-colors text-left'
                        >
                          <LogOut size={18} className='text-neutral-500' />
                          <span className='font-medium'>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link
                href='/login'
                className='px-6 py-2 text-sm font-medium border border-neutral-700 text-white rounded-full hover:bg-neutral-800 transition-colors'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='px-6 py-2 text-sm font-medium bg-[#8b5cf6] text-white rounded-full hover:bg-purple-700 transition-colors'
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
