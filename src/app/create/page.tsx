'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, Image as ImageIcon, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

export default function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthStore();

  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Maximum file size is 5 MB');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image for your post.');
      return;
    }
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // FIXED: Trim the token to remove any invisible newlines or spaces
    const cleanToken = token.trim();

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', file);

      // Debug exactly what is being sent
      console.log('--- FETCH REQUEST ---');
      console.log('Token length:', cleanToken.length); // Check if this matches the cURL token length
      console.log('Token sent:', `Bearer ${cleanToken}`);

      const response = await fetch(
        'https://be-social-media-api-production.up.railway.app/api/posts',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            accept: '*/*',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      // Success!
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/');
    } catch (err: any) {
      console.error('Fetch Error Caught:', err.message);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-base-black text-neutral-25 font-sans'>
      <Navbar />
      <main className='max-w-xl mx-auto pt-20 pb-32 px-4'>
        <div className='flex items-center gap-4 mb-8'>
          <Link
            href='/'
            className='p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition'
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className='text-xl font-bold'>Create New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className='w-full h-64 border-2 border-dashed border-neutral-800 hover:border-[#8b5cf6] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950'
              >
                <ImageIcon size={48} className='text-neutral-600 mb-4' />
                <p className='text-sm text-neutral-400'>
                  Click to upload an image
                </p>
              </div>
            ) : (
              <div className='relative w-full aspect-square rounded-xl overflow-hidden border border-neutral-800'>
                <Image
                  src={previewUrl}
                  alt='Preview'
                  fill
                  className='object-cover'
                />
                <button
                  type='button'
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className='absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition'
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-bold text-neutral-400'>
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='Write a caption...'
              rows={4}
              className='w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] resize-none'
            />
          </div>

          {error && (
            <div className='bg-red-500/10 border border-red-500/20 p-4 rounded-xl'>
              <p className='text-red-500 text-sm font-bold'>{error}</p>
            </div>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-4 w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              'Share Post'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
