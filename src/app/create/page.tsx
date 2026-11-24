'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, Image as ImageIcon, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Maximum file size is 5 MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only .jpg, .png, and .webp files are allowed');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      // TEMPORARY HARDCODED TOKEN FROM YOUR CURL COMMAND
      const hardcodedToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoiWGlhbyBZYW4iLCJpYXQiOjE3OTU1MDIzMDksImV4cCI6MTc5NjEwNzEwOX0.0KcFIJfeTphR3fJbZ0SsvoEhqXvAVV-LnmTGOdCn7Zo';

      const formData = new FormData();
      formData.append('caption', caption);
      if (file) {
        formData.append('image', file);
      }

      const response = await axios.post(
        'https://be-social-media-api-production.up.railway.app/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${hardcodedToken}`,
            accept: '*/*',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/');
    },
    onError: (err: any) => {
      console.error('Mutation Error:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Failed to create post.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image for your post.');
      return;
    }
    setError(null);
    createPostMutation.mutate();
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
          <h1 className='text-xl font-bold'>
            Create New Post (Isolation Test)
          </h1>
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
              accept='.jpg,.jpeg,.png,.webp'
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
            disabled={createPostMutation.isPending}
            className='mt-4 w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-purple-600 text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50'
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className='animate-spin' size={20} />
                Posting...
              </>
            ) : (
              'Share Post'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
