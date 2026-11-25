'use client';

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { usePosts } from '@/features/auth/hooks/usePosts';
import {
  Settings,
  Edit3,
  Camera,
  Loader2,
  User as UserIcon,
  Grid3X3,
  Bookmark,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth } = useAuthStore();
  const { data: allPosts, isLoading } = usePosts();

  // View State
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to Login Page if not logged in
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  // Filter posts created by the current user
  const userPosts = useMemo(() => {
    if (!allPosts || !user) return [];
    return allPosts.filter((post) => post.user.username === user.username);
  }, [allPosts, user]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    return {
      posts: userPosts.length,
      followers: 354, // Mocked (replace with API data if available)
      following: 821, // Mocked (replace with API data if available)
      likes: totalLikes,
    };
  }, [userPosts]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateProfile = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('bio', bio);
      if (file) {
        formData.append('avatar', file);
      }

      const response = await fetch(
        'https://be-social-media-api-production.up.railway.app/api/me',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            accept: '*/*',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update Zustand store with the new user data
      const updatedUser = data.data?.user || data.user || data.data;

      // Merge new avatar URL with existing user data
      const newAvatarUrl =
        updatedUser?.avatar || updatedUser?.avatarUrl || data.data?.avatarUrl;

      setAuth(
        {
          ...user,
          name,
          username,
          phone,
          bio,
          avatar: newAvatarUrl,
        },
        token
      );

      setIsEditing(false);
      setFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(
        err.message.includes('Invalid token')
          ? 'Backend bug: Invalid token. The API cannot authenticate this route yet.'
          : err.message
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className='min-h-screen bg-base-black text-neutral-25 font-sans'>
      <Navbar />

      <main className='max-w-3xl mx-auto pt-20 pb-32 px-4'>
        {isEditing ? (
          <div className='bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-white'>Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className='text-sm text-neutral-400 hover:text-white transition'
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className='flex flex-col gap-5'
            >
              {/* Avatar Upload */}
              <div className='flex flex-col items-center gap-4 mb-2'>
                <div className='relative w-28 h-28 rounded-full overflow-hidden border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center'>
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt='Preview'
                      fill
                      className='object-cover'
                    />
                  ) : user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt='User'
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <UserIcon size={40} className='text-neutral-600' />
                  )}
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer'
                  >
                    <Camera size={24} className='text-white' />
                  </button>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className='hidden'
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='text-xs text-[#8b5cf6] hover:text-purple-400 font-medium'
                >
                  Change Profile Photo
                </button>
              </div>

              {/* Form Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-neutral-400'>
                    Name
                  </label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#8b5cf6] focus:outline-none'
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-neutral-400'>
                    Username
                  </label>
                  <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#8b5cf6] focus:outline-none'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-neutral-400'>
                  Phone
                </label>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#8b5cf6] focus:outline-none'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-neutral-400'>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder='Write a short bio...'
                  rows={3}
                  className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#8b5cf6] focus:outline-none resize-none'
                />
              </div>

              {error && (
                <p className='text-red-500 text-sm text-center'>{error}</p>
              )}

              <button
                type='submit'
                disabled={isUpdating}
                className='mt-2 w-full py-3 bg-[#8b5cf6] hover:bg-purple-600 rounded-xl text-sm font-bold text-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50'
              >
                {isUpdating ? (
                  <Loader2 className='animate-spin' size={18} />
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className='animate-in fade-in duration-300'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-8'>
              <div className='relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center shrink-0'>
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt='User'
                    fill
                    className='object-cover'
                  />
                ) : (
                  <UserIcon size={48} className='text-neutral-600' />
                )}
              </div>

              <div className='flex flex-col items-center md:items-start flex-1'>
                <div className='flex flex-col md:flex-row items-center gap-4 mb-3 w-full justify-center md:justify-start'>
                  <h1 className='text-xl font-bold text-white'>
                    {user?.username}
                  </h1>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setIsEditing(true)}
                      className='px-5 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2'
                    >
                      <Edit3 size={14} /> Edit profile
                    </button>
                    <button className='p-1.5 text-neutral-400 hover:text-white transition'>
                      <Settings size={22} />
                    </button>
                  </div>
                </div>

                <p className='text-sm font-bold text-white mb-2'>
                  {user?.name}
                </p>

                <p className='text-sm text-neutral-400 text-center md:text-left max-w-md mb-4 leading-relaxed'>
                  {user?.bio ||
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                </p>

                <div className='hidden md:flex gap-8 mt-2'>
                  <div className='flex items-baseline gap-1.5'>
                    <span className='font-bold text-white'>{stats.posts}</span>
                    <span className='text-sm text-neutral-400'>Posts</span>
                  </div>
                  <div className='flex items-baseline gap-1.5'>
                    <span className='font-bold text-white'>
                      {stats.followers}
                    </span>
                    <span className='text-sm text-neutral-400'>Followers</span>
                  </div>
                  <div className='flex items-baseline gap-1.5'>
                    <span className='font-bold text-white'>
                      {stats.following}
                    </span>
                    <span className='text-sm text-neutral-400'>Following</span>
                  </div>
                  <div className='flex items-baseline gap-1.5'>
                    <span className='font-bold text-white'>{stats.likes}</span>
                    <span className='text-sm text-neutral-400'>Likes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile stats */}
            <div className='md:hidden flex justify-between items-center bg-neutral-900/50 rounded-xl p-4 mb-6 border border-neutral-800'>
              <div className='flex flex-col items-center'>
                <span className='font-bold text-white text-lg'>
                  {stats.posts}
                </span>
                <span className='text-xs text-neutral-400'>Posts</span>
              </div>
              <div className='w-px h-8 bg-neutral-800'></div>
              <div className='flex flex-col items-center'>
                <span className='font-bold text-white text-lg'>
                  {stats.followers}
                </span>
                <span className='text-xs text-neutral-400'>Followers</span>
              </div>
              <div className='w-px h-8 bg-neutral-800'></div>
              <div className='flex flex-col items-center'>
                <span className='font-bold text-white text-lg'>
                  {stats.following}
                </span>
                <span className='text-xs text-neutral-400'>Following</span>
              </div>
              <div className='w-px h-8 bg-neutral-800'></div>
              <div className='flex flex-col items-center'>
                <span className='font-bold text-white text-lg'>
                  {stats.likes}
                </span>
                <span className='text-xs text-neutral-400'>Likes</span>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex border-t border-neutral-800 mb-1'>
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-t-2 ${
                  activeTab === 'posts'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Grid3X3 size={16} /> My Posts
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-t-2 ${
                  activeTab === 'saved'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Bookmark size={16} /> Saved
              </button>
            </div>

            {/* Grid Content */}
            <div className='pt-1'>
              {isLoading ? (
                <div className='flex justify-center py-20'>
                  <Loader2 className='animate-spin text-[#8b5cf6]' size={32} />
                </div>
              ) : activeTab === 'posts' ? (
                userPosts.length > 0 ? (
                  <div className='grid grid-cols-3 gap-1 md:gap-2'>
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        className='relative aspect-square bg-neutral-900 overflow-hidden rounded-sm md:rounded-md group cursor-pointer'
                      >
                        <Image
                          src={post.image}
                          alt='Post'
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4'>
                          <span className='flex items-center gap-1 text-white font-bold text-sm'>
                            <span className='text-red-500 fill-red-500'>♥</span>{' '}
                            {post.likes}
                          </span>
                          <span className='flex items-center gap-1 text-white font-bold text-sm'>
                            💬 {post.comments}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-20 text-neutral-500'>
                    <ImageIcon size={48} className='mb-4 opacity-20' />
                    <p>You haven&apos;t posted anything yet.</p>
                  </div>
                )
              ) : (
                <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
                  <Bookmark size={48} className='mb-4 text-neutral-600' />
                  <h3 className='text-lg font-bold text-white mb-2'>
                    Your story starts here
                  </h3>
                  <p className='text-sm text-neutral-400 mb-6 max-w-xs'>
                    When you save posts by clicking the bookmark icon, they will
                    appear here to view later.
                  </p>
                  <Link
                    href='/'
                    className='px-6 py-2.5 bg-[#8b5cf6] hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors'
                  >
                    Find Posts
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
