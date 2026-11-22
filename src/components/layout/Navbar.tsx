'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/features/auth/hooks/useCart';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, MapPin, FileText, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Avatar_Image, Logo } from '../../../public/images/imageHandler';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch cart data using TanStack Query
  const { data: cartData } = useCart();

  // Calculate total items safely from the grouped API response
  const cartCount =
    cartData?.reduce((total: number, group: any) => {
      return (
        total +
        group.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      );
    }, 0) || 0;

  const isLightPage =
    pathname === '/profile' ||
    pathname.startsWith('/resto') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders');

  const useDarkText = isScrolled || isLightPage;

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
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-neutral-800 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md py-3'
          : 'bg-[#050505] py-4'
      }`}
    >
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
              <Link
                href='/cart'
                className={`relative p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition ${useDarkText ? 'text-black' : 'text-white'}`}
              >
                <ShoppingBag size={18} />

                {/* Badge relies on TanStack Query data */}
                {cartCount > 0 && (
                  <span className='absolute top-0 right-0 bg-[#8b5cf6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full translate-x-1/4 -translate-y-1/4'>
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className='relative' ref={menuRef}>
                <button
                  type='button'
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <div className='w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative border border-gray-500'>
                    <Image
                      src={user?.avatar || Avatar_Image}
                      alt='User'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <span className='text-sm font-medium text-white'>
                    {user?.name || 'John Doe'}
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
                        <h3 className='font-bold text-gray-900 text-sm truncate'>
                          {user?.name || 'John Doe'}
                        </h3>
                      </div>
                    </Link>

                    {/* Navigation Links */}
                    <ul className='flex flex-col gap-1 border-t border-gray-100 pt-3'>
                      <li>
                        <Link
                          href='/profile'
                          onClick={() => setIsMenuOpen(false)}
                          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors'
                        >
                          <MapPin size={18} className='text-gray-400' />
                          <span className='font-medium'>Delivery Address</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href='/orders'
                          onClick={() => setIsMenuOpen(false)}
                          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors'
                        >
                          <FileText size={18} className='text-gray-400' />
                          <span className='font-medium'>My Orders</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          type='button'
                          onClick={handleSignOut}
                          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors text-left'
                        >
                          <LogOut size={18} className='text-gray-400' />
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
