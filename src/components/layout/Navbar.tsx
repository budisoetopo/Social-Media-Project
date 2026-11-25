'use client';

import { useState, useEffect, useRef, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  Search,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Logo } from '../../../public/images/imageHandler';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

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

  // Ctrl+K focuses the search bar
  useEffect(() => {
    const onShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.matchMedia('(min-width: 768px)').matches) {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        } else {
          setIsMobileSearchOpen(true);
          setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
        }
      }
    };
    document.addEventListener('keydown', onShortcut);
    return () => document.removeEventListener('keydown', onShortcut);
  }, []);

  // Escape + body scroll lock for mobile search overlay
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prev;
    };
  }, [isMobileSearchOpen]);

  // Search submit handler
  const handleSearch = (e?: SubmitEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-neutral-800 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md py-3'
            : 'bg-[#050505] py-4'
        }`}
      >
        <div className='w-full max-w-360 mx-auto px-4 md:px-30 flex items-center justify-between relative'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='text-2xl leading-9 font-bold flex items-center gap-2.75 text-neutral-25'>
              <img
                src={Logo}
                alt='Sociality Logo'
                className='h-7 w-7 object-contain'
              />
              Sociality
            </div>
          </Link>

          {/* Centered Search Bar */}
          <form
            role='search'
            onSubmit={handleSearch}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-87.5 md:max-w-112.5 hidden md:block'
          >
            <div className='relative w-full'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500'
                size={18}
              />
              <input
                ref={searchInputRef}
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation();
                    setSearchQuery('');
                    e.currentTarget.blur();
                  }
                }}
                placeholder='Search posts, people, or tags...'
                aria-label='Search'
                className='w-full bg-[#141414] border border-neutral-800 rounded-full py-2.5 pl-11 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all'
              />

              {/* ✅ ADDED: clear button OR ⌘K hint */}
              {searchQuery ? (
                <button
                  type='button'
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label='Clear search'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white'
                >
                  <X size={16} />
                </button>
              ) : (
                <kbd className='absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 border border-neutral-700 rounded'>
                  ⌘K
                </kbd>
              )}
            </div>
          </form>

          {/* Right Side */}
          <div className='flex items-center gap-4'>
            {/* Mobile search trigger */}
            <button
              type='button'
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label='Open search'
              className='md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-neutral-25'
            >
              <Search size={18} />
            </button>

            {isAuthenticated ? (
              <div className='flex items-center gap-4'>
                <button className='relative p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-neutral-25'>
                  <Bell size={18} />
                </button>

                <div className='relative' ref={menuRef}>
                  <button
                    type='button'
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <div className='w-8 h-8 rounded-full bg-neutral-800 overflow-hidden relative border border-neutral-700 flex items-center justify-center text-neutral-400'>
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt='User'
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <UserIcon size={16} />
                      )}
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
                        <div className='w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden relative shrink-0 text-neutral-400'>
                          {user?.avatar ? (
                            <Image
                              src={user.avatar}
                              alt='User'
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <UserIcon size={20} />
                          )}
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

      {/* Full-screen mobile search overlay */}
      {isMobileSearchOpen && (
        <div className='fixed inset-0 z-60 bg-[#050505] md:hidden'>
          <form
            role='search'
            onSubmit={handleSearch}
            className='flex items-center gap-3 px-4 py-4 border-b border-neutral-800'
          >
            <button
              type='button'
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              aria-label='Close search'
              className='p-2 text-neutral-400 hover:text-white'
            >
              <X size={20} />
            </button>
            <div className='relative flex-1'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500'
                size={18}
              />
              <input
                ref={mobileSearchInputRef}
                type='search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search posts, people, or tags...'
                aria-label='Search'
                className='w-full bg-[#141414] border border-neutral-800 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all'
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Navbar;
