'use client';

import { MapPin, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Avatar_Image } from '../../../public/images/imageHandler';

export default function ProfileSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 relative">
          <Image src={user?.avatar || Avatar_Image} alt="User" fill className="object-cover" />
        </div>
        <span className="font-semibold text-gray-800">{user?.name || 'John Doe'}</span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        <Link href="/profile" className="flex items-center gap-3 text-red-600 transition-colors">
          <MapPin size={18} />
          <span className="text-sm font-medium">Delivery Address</span>
        </Link>
        
        <Link href="/orders" className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors">
          <FileText size={18} />
          <span className="text-sm font-medium">My Orders</span>
        </Link>

        <button onClick={handleSignOut} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors mt-4 text-left">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}