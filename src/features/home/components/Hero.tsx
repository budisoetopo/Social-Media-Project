'use client'; // 1. MUST HAVE THIS

import { useState } from 'react';
import { Search } from 'lucide-react';
import { imageHandler } from '../../../../public/images/imageHandler';

// 2. Define the prop
interface HeroProps {
  onSearch: (query: string) => void;
}

function Hero({ onSearch }: HeroProps) {
  // 3. State to hold the text
  const [query, setQuery] = useState('');

  // 4. Function that runs when you press Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stops page from refreshing
    console.log('✅ 1. Hero Form Submitted. Query:', query); // Debug log

    if (onSearch) {
      onSearch(query); // Sends the query to page.tsx
    }
  };

  return (
    <div className='w-full bg-[#0a0a0a] flex flex-col items-center'>
      <section
        className='relative w-full max-w-360 mx-auto aspect-[16/9] flex flex-col items-center justify-center text-center px-4'
        style={{
          backgroundImage: `url('${imageHandler('/images/Hero.png')}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/50'></div>

        <div className='relative z-10 w-full max-w-2xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Explore Culinary Experiences
          </h1>
          <p className='text-gray-200 mb-8 text-sm md:text-base'>
            Search and refine your choice to discover the perfect restaurant.
          </p>

          {/* 5. WRAP THE INPUT IN A FORM */}

          {/* DUMMY TEST FORM */}
          <form
            onSubmit={handleSubmit}
            className='relative w-full max-w-lg mx-auto flex gap-2'
          >
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='w-full pl-11 pr-4 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg'
              placeholder='Search restaurants, food and drink'
            />
          </form>
        </div>
      </section>
    </div>
  );
}

export default Hero;
