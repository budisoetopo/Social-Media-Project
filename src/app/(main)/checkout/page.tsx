'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  useCart,
  useUpdateCart,
  useRemoveFromCart,
} from '@/features/auth/hooks/useCart';
import { useCheckout } from '@/features/auth/hooks/useOrder';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validations/order';
import { MapPin, Plus, Minus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const { data: cartData, isLoading } = useCart();
  const updateMutation = useUpdateCart();
  const removeMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'BNI',
      deliveryAddress: 'JL. Sudirman No. 25, Jakarta Pusat, 10220',
      phone: '0812-3456-7890',
    },
  });

  const selectedPayment = watch('paymentMethod');

  const formatPrice = (price: number) => {
    return `Rp${(price || 0).toLocaleString('id-ID')}`;
  };

  if (isLoading)
    return (
      <div className='pt-28 text-center min-h-screen'>
        <Navbar />
        Loading...
      </div>
    );

  if (!cartData || cartData.length === 0) {
    return (
      <div className='min-h-screen bg-[#F8F9FA] flex flex-col font-sans'>
        <Navbar />
        <div className='flex-grow flex flex-col items-center justify-center pt-24'>
          <p className='text-gray-500 mb-4'>Your cart is empty.</p>
          <Link
            href='/'
            className='bg-[#C40000] text-white px-6 py-2 rounded-full font-semibold hover:bg-red-800 transition'
          >
            Find Food
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // CALCULATIONS (Fixed to be mathematically correct)
  const subtotal = cartData.reduce((acc: number, group: any) => {
    return (
      acc +
      group.items.reduce(
        (sum: number, item: any) =>
          sum + (item.menu?.price || 0) * item.quantity,
        0
      )
    );
  }, 0);

  const deliveryFee = 10000;
  const serviceFee = 1000;
  const total = subtotal + deliveryFee + serviceFee;
  const totalItems = cartData.reduce(
    (acc: number, group: any) => acc + group.items.length,
    0
  );

  const onSubmit = (values: CheckoutFormValues) => {
    const restaurantsPayload = cartData.map((group: any) => ({
      restaurantId: group.restaurant.id,
      items: group.items.map((item: any) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
      })),
    }));

    checkoutMutation.mutate(
      {
        payload: {
          deliveryAddress: values.deliveryAddress,
          phone: values.phone,
          paymentMethod: values.paymentMethod,
          notes: values.notes || '',
          restaurants: restaurantsPayload,
        },
        summary: {
          price: subtotal,
          deliveryFee: deliveryFee,
          serviceFee: serviceFee,
          items: totalItems,
          paymentMethod: values.paymentMethod,
        },
      },
      {
        onSuccess: () => {
          cartData.forEach((group: any) => {
            group.items.forEach((item: any) => {
              removeMutation.mutate(item.id); // <--- CALLS DELETE /api/cart/{id}
            });
          });

          clearCart();

          queryClient.setQueryData(['cart'], []);
        },
      }
    );
  };

  return (
    <div className='min-h-screen bg-white flex flex-col font-sans'>
      <Navbar />

      <main className='flex-grow pt-28 pb-16'>
        <div className='max-w-6xl mx-auto px-4 md:px-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8'>Checkout</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start'
          >
            {/* LEFT COLUMN: Address & Items */}
            <div className='space-y-6'>
              {/* Delivery Address Card */}
              <div className='bg-white border border-gray-200 rounded-3xl p-6'>
                <div className='flex items-start gap-3 mb-6'>
                  <MapPin className='text-[#C40000] mt-1' size={20} />
                  <div>
                    <h2 className='font-bold text-gray-900'>
                      Delivery Address
                    </h2>
                    <p className='text-sm text-gray-600 mt-1'>
                      {watch('deliveryAddress')}
                    </p>
                    <p className='text-sm text-gray-600 mt-1'>
                      {watch('phone')}
                    </p>
                  </div>
                </div>
                <button
                  type='button'
                  className='px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition'
                >
                  Change
                </button>
              </div>

              {/* Cart Items Card */}
              {cartData.map((group: any) => (
                <div
                  key={group.restaurant.id}
                  className='bg-white border border-gray-200 rounded-3xl p-6'
                >
                  {/* Restaurant Header */}
                  <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-lg overflow-hidden bg-orange-100 flex items-center justify-center'>
                        <img
                          src={group.restaurant.logo || '/placeholder.png'}
                          alt='logo'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <h3 className='font-bold text-gray-900 text-lg'>
                        {group.restaurant.name}
                      </h3>
                    </div>
                    <Link href={`/resto/${group.restaurant.id}`}>
                      <button
                        type='button'
                        className='px-4 py-1.5 border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 transition'
                      >
                        Add item
                      </button>
                    </Link>
                  </div>

                  {/* Items List */}
                  <div className='space-y-6'>
                    {group.items.map((item: any) => (
                      <div key={item.id} className='flex items-center gap-4'>
                        <div className='w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-50'>
                          <img
                            src={item.menu?.image || '/placeholder.png'}
                            alt={item.menu?.foodName}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900 text-sm'>
                            {item.menu?.foodName}
                          </h4>
                          <p className='font-bold text-gray-900 mt-1'>
                            {formatPrice(item.menu?.price)}
                          </p>
                        </div>
                        <div className='flex items-center gap-3'>
                          <button
                            type='button'
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateMutation.mutate({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                });
                              } else {
                                removeMutation.mutate(item.id);
                              }
                            }}
                            className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50'
                          >
                            <Minus size={16} className='text-gray-600' />
                          </button>
                          <span className='font-bold text-gray-900 text-sm w-4 text-center'>
                            {item.quantity}
                          </span>
                          <button
                            type='button'
                            onClick={() =>
                              updateMutation.mutate({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            className='w-8 h-8 rounded-full bg-[#C40000] flex items-center justify-center hover:bg-red-800'
                          >
                            <Plus size={16} className='text-white' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: Payment & Summary */}
            <div className='space-y-6'>
              {/* Payment Method */}
              <div className='bg-white border border-gray-200 rounded-3xl p-6'>
                <h2 className='font-bold text-gray-900 mb-4'>Payment Method</h2>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(val) => setValue('paymentMethod', val)}
                  className='space-y-3'
                >
                  {[
                    { id: 'BNI', name: 'Bank Negara Indonesia', logo: 'BNI' },
                    { id: 'BRI', name: 'Bank Rakyat Indonesia', logo: 'BRI' },
                    { id: 'BCA', name: 'Bank Central Asia', logo: 'BCA' },
                    { id: 'MANDIRI', name: 'Mandiri', logo: 'mandiri' },
                  ].map((bank) => (
                    <div
                      key={bank.id}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${selectedPayment === bank.id ? 'border-[#C40000] bg-red-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className='flex items-center gap-3'>
                        {/* Fallback logo styling if you don't have the actual images */}
                        <div className='w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-blue-800'>
                          {bank.logo}
                        </div>
                        <Label
                          htmlFor={bank.id}
                          className='text-sm font-medium cursor-pointer'
                        >
                          {bank.name}
                        </Label>
                      </div>
                      <RadioGroupItem
                        value={bank.id}
                        id={bank.id}
                        className='text-[#C40000] border-gray-400'
                      />
                    </div>
                  ))}
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className='text-red-500 text-xs mt-2'>
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <div className='bg-white border border-gray-200 rounded-3xl p-6'>
                <h2 className='font-bold text-gray-900 mb-4'>
                  Payment Summary
                </h2>

                <div className='space-y-3 text-sm mb-6'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Price ({totalItems} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Service Fee</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>

                  <div className='border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-gray-900 text-base'>
                    <span>Total</span>
                    {/* ✅ CALCULATION FIXED: Subtotal + Delivery + Service */}
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={checkoutMutation.isPending}
                  className='w-full bg-[#C40000] text-white font-bold py-3.5 rounded-full hover:bg-red-800 transition disabled:opacity-70'
                >
                  {checkoutMutation.isPending ? 'Processing...' : 'Buy'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
