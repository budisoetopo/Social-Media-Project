'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Avatar_Image } from '../../../public/images/imageHandler';
import { X, Loader2 } from 'lucide-react';

function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Sync form state with user data when page loads or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
    setErrorMessage('');
  }, [user, isModalOpen]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage('');

    try {
      // Call the update function in your auth store
      if (updateProfile) {
        const dataToSubmit = { ...formData };

        // If password is empty, remove it from the payload entirely
        if (!dataToSubmit.password) {
          delete dataToSubmit.password;
        }
        const result = updateProfile(dataToSubmit);

        if (result && !result.success) {
          throw new Error(result.message || 'Failed to update profile');
        }
      } else {
        throw new Error('updateProfile function is missing in authStore');
      }

      setIsModalOpen(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />

      <main className='flex-grow max-w-6xl w-full mx-auto px-4 pt-32 pb-16'>
        <div className='flex flex-col md:flex-row gap-8'>
          <ProfileSidebar />

          {/* Main Content Area */}
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>Profile</h1>

            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 max-w-2xl'>
              {/* Profile Avatar */}
              <div className='w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-8 relative'>
                <Image
                  src={user?.avatar || Avatar_Image}
                  alt='User Avatar'
                  fill
                  className='object-cover'
                />
              </div>

              {/* User Info Display */}
              <div className='flex flex-col gap-6 mb-8'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 border-b border-gray-50 pb-2'>
                  <span className='text-gray-500 text-sm font-medium w-32'>
                    Name
                  </span>
                  <span className='text-gray-900 font-medium sm:text-right flex-1'>
                    {user?.name || 'John Doe'}
                  </span>
                </div>

                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 border-b border-gray-50 pb-2'>
                  <span className='text-gray-500 text-sm font-medium w-32'>
                    Email
                  </span>
                  <span className='text-gray-900 font-medium sm:text-right flex-1'>
                    {user?.email || 'johndoe@email.com'}
                  </span>
                </div>

                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4'>
                  <span className='text-gray-500 text-sm font-medium w-32'>
                    Nomor Handphone
                  </span>
                  <span className='text-gray-900 font-medium sm:text-right flex-1'>
                    {user?.phone || '081234567890'}
                  </span>
                </div>
              </div>

              {/* Update Button triggers modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className='w-full bg-[#DA2E28] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full transition-colors'
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Update Profile Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdating}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <X size={24} />
            </button>

            <h2 className='text-xl font-bold text-gray-900 mb-6'>
              Update Profile
            </h2>

            {errorMessage && (
              <div className='mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg'>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black'
                  required
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black'
                  required
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black'
                  required
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  New Password{' '}
                  <span className='text-gray-400 font-normal'>
                    (Leave blank to keep current)
                  </span>
                </label>
                <input
                  type='password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black'
                  placeholder='••••••••'
                  disabled={isUpdating}
                />
              </div>

              <button
                type='submit'
                disabled={isUpdating}
                className='w-full flex items-center justify-center gap-2 bg-[#DA2E28] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full mt-2 transition-colors disabled:opacity-70'
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
