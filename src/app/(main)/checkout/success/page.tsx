'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { Suspense } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Logo_Red } from '../../../../../public/images/imageHandler';

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();

  useEffect(() => {
    clearCart();
    queryClient.setQueryData(['cart'], []);
  }, [clearCart, queryClient]);

  return (
    <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow flex flex-col items-center justify-center pt-28 pb-16 px-4'>
        {/* Top Logo */}
        <div className='flex items-center gap-3 mb-8'>
          <img
            src={Logo_Red}
            alt='Foody Logo'
            className='h-10 w-10 object-contain'
          />
          <span className='text-[2rem] font-extrabold text-gray-900 tracking-tight'>
            Foody
          </span>
        </div>

        <Suspense
          fallback={<div className='text-gray-500'>Loading receipt...</div>}
        >
          <ReceiptContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function ReceiptContent() {
  const searchParams = useSearchParams();

  // Extract data from url
  const price = Number(searchParams.get('price')) || 0;
  const deliveryFee = Number(searchParams.get('delivery')) || 0;
  const serviceFee = Number(searchParams.get('service')) || 0;
  const totalItems = Number(searchParams.get('items')) || 0;

  const paymentParam = searchParams.get('payment');
  const paymentMap: Record<string, string> = {
    BNI: 'Bank Negara Indonesia',
    BRI: 'Bank Rakyat Indonesia',
    BCA: 'Bank Central Asia',
    MANDIRI: 'Mandiri',
  };

  const paymentMethod = paymentParam
    ? paymentMap[paymentParam] || paymentParam
    : 'Bank Transfer';

  // Calculation
  const total = price + deliveryFee + serviceFee;

  const formatPrice = (value: number) => {
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className='bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-[380px] w-full relative overflow-hidden'>
      {/* Top Section */}
      <div className='pt-10 pb-8 px-8 text-center'>
        <div className='w-16 h-16 bg-[#40A82E] rounded-full flex items-center justify-center mx-auto mb-5'>
          <Check size={36} className='text-white' strokeWidth={3} />
        </div>
        <h1 className='text-xl font-bold text-gray-900 mb-2'>
          Payment Success
        </h1>
        <p className='text-sm text-gray-500'>
          Your payment has been successfully processed.
        </p>
      </div>

      {/* Ticket Cutouts (Left & Right) */}
      <div className='absolute -left-3 top-[165px] w-6 h-6 bg-[#F8F9FA] rounded-full'></div>
      <div className='absolute -right-3 top-[165px] w-6 h-6 bg-[#F8F9FA] rounded-full'></div>

      {/* Dashed Divider */}
      <div className='border-t border-dashed border-gray-200 mx-6'></div>

      {/* Receipt Details Section */}
      <div className='p-8 space-y-4'>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-500'>Date</span>
          <span className='font-bold text-gray-900'>
            {new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            ,{' '}
            {new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-500'>Payment Method</span>
          <span className='font-bold text-gray-900'>{paymentMethod}</span>
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-500'>Price ( {totalItems} items )</span>
          <span className='font-bold text-gray-900'>{formatPrice(price)}</span>
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-500'>Delivery Fee</span>
          <span className='font-bold text-gray-900'>
            {formatPrice(deliveryFee)}
          </span>
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-500'>Service Fee</span>
          <span className='font-bold text-gray-900'>
            {formatPrice(serviceFee)}
          </span>
        </div>
      </div>

      {/* Second Set of Ticket Cutouts */}
      <div className='absolute -left-3 bottom-[88px] w-6 h-6 bg-[#F8F9FA] rounded-full'></div>
      <div className='absolute -right-3 bottom-[88px] w-6 h-6 bg-[#F8F9FA] rounded-full'></div>

      {/* Dashed Divider */}
      <div className='border-t border-dashed border-gray-200 mx-6'></div>

      {/* Total Section */}
      <div className='p-8 pb-10'>
        <div className='flex justify-between items-center mb-6'>
          <span className='text-gray-600 text-sm'>Total</span>
          <span className='font-extrabold text-gray-900 text-lg'>
            {formatPrice(total)}
          </span>
        </div>

        <Link href='/orders'>
          <button className='w-full bg-[#C40000] text-white font-bold py-3.5 rounded-full hover:bg-red-800 transition text-sm'>
            See My Orders
          </button>
        </Link>
      </div>
    </div>
  );
}
