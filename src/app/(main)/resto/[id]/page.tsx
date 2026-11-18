'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Plus, Minus, Share2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRestaurantDetail } from '@/features/auth/hooks/useRestaurantDetail';
import {
  useCart,
  useAddToCart,
  useUpdateCart,
  useRemoveFromCart,
} from '@/features/auth/hooks/useCart';

function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: restaurant, isLoading, isError } = useRestaurantDetail(id);
  const { data: cartData } = useCart();

  // ✅ ADD THIS: Log the cart data every time it updates
  console.log('🛒 CART DATA IN DETAIL PAGE:', cartData);

  const getItemQuantity = (menuId: string) => {
    if (!cartData) return 0;

    const allItems = cartData.flatMap((group: any) => group.items || []);

    const item = allItems.find(
      (i: any) => String(i.menu?.id) === String(menuId)
    );
    return item ? item.quantity : 0;
  };

  const getCartItemId = (menuId: string) => {
    if (!cartData) return null;
    const allItems = cartData.flatMap((group: any) => group.items || []);

    const item = allItems.find(
      (i: any) => String(i.menu?.id) === String(menuId)
    );
    return item ? item.id : null; // This returns the 933, 932 cart item ID
  };

  const addMutation = useAddToCart();
  const updateMutation = useUpdateCart();
  const removeMutation = useRemoveFromCart();

  const [activeTab, setActiveTab] = useState('All Menu');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  if (isLoading)
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col'>
        <Navbar />
        <div className='flex-grow pt-28 text-center'>Loading...</div>
        <Footer />
      </div>
    );
  if (isError || !restaurant)
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col'>
        <Navbar />
        <div className='flex-grow pt-28 text-center text-red-500'>
          Error loading restaurant.
        </div>
        <Footer />
      </div>
    );

  const menus = Array.isArray(restaurant.menus)
    ? restaurant.menus
    : Array.isArray(restaurant.menu)
      ? restaurant.menu
      : [];
  const reviews = Array.isArray(restaurant.reviews) ? restaurant.reviews : [];
  const restaurantName = restaurant.name || 'Unknown Restaurant';
  const restaurantLogo =
    restaurant.logo || restaurant.image || '/images/bk_logo.svg';

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />

      <main className='flex-grow pt-24 pb-16'>
        <div className='max-w-312.5 mx-auto px-4 md:px-6'>
          {/* HERO IMAGES */}
          <div className='grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4 mb-8 h-auto md:h-100'>
            <div className='relative h-64 md:h-full w-full rounded-lg overflow-hidden'>
              <img
                src='/images/main_dish1.png'
                alt='Main Dish 1'
                className='absolute inset-0 w-full h-full object-cover'
              />
            </div>
            <div className='flex flex-col gap-4 h-64 md:h-full'>
              <div className='relative hidden md:flex h-75.5 w-full rounded-lg overflow-hidden'>
                <img
                  src='/images/Hero.png'
                  alt='Main Dish 1A'
                  className='absolute inset-0 w-full h-full object-cover'
                />
              </div>
              <div className='grid grid-cols-2 gap-4 flex-1'>
                <div className='relative hidden md:flex w-full h-37 rounded-lg overflow-hidden'>
                  <img
                    src='/images/main_dish2.png'
                    alt='Main Dish 2'
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                </div>
                <div className='relative hidden md:flex w-full h-37 rounded-lg overflow-hidden'>
                  <img
                    src='/images/main_dish3.png'
                    alt='Main Dish 3'
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className='flex items-start justify-between -mt-70 md:mt-25 mb-10 pb-6 border-b border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 rounded-xl overflow-hidden relative shrink-0'>
                <img
                  src={restaurantLogo}
                  alt='Logo'
                  className='absolute inset-0 w-full h-full object-cover'
                />
              </div>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                  {restaurantName}
                </h1>
                <div className='flex items-center text-sm text-gray-500 mt-1 gap-2'>
                  <div className='flex items-center text-yellow-400'>
                    <Star size={16} className='fill-yellow-400' />
                    <span className='font-semibold text-gray-900 ml-1'>
                      {restaurant.star || restaurant.rating || 0}
                    </span>
                  </div>
                  <span>•</span>
                  <span>
                    {restaurant.place || restaurant.location || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition'>
              <Share2 size={16} /> Share
            </button>
          </div>

          {/* Menu Section */}
          <div className='mb-16'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Menu</h2>

            <div className='flex gap-2 mb-6'>
              {['All Menu', 'Food', 'Drink'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {menus.length === 0 ? (
              <p className='text-gray-500 text-sm'>
                No menus available for this restaurant.
              </p>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
                {menus.map((item: any) => {
                  const quantity = getItemQuantity(item.id);
                  const cartItemId = getCartItemId(item.id);
                  const itemName = item.name || item.menu_name || 'Menu Item';
                  const itemPrice = item.price || item.menu_price || 0;
                  const itemImage =
                    item.image || item.menu_picture || '/placeholder.png';

                  return (
                    <div key={item.id} className='flex flex-col'>
                      <div className='relative w-full aspect-square rounded-2xl overflow-hidden mb-3'>
                        <img
                          src={itemImage}
                          alt={itemName}
                          className='absolute inset-0 w-full h-full object-cover'
                        />
                      </div>
                      <h3 className='font-semibold text-gray-900 text-sm'>
                        {itemName}
                      </h3>

                      <div className='flex items-center justify-between mt-2'>
                        <span className='font-bold text-gray-900 text-sm'>
                          {formatPrice(itemPrice)}
                        </span>

                        {quantity === 0 ? (
                          <button
                            onClick={() => {
                              addMutation.mutate({
                                restaurantId: restaurant.id,
                                menuId: item.id,
                                quantity: 1,
                              });
                            }}
                            disabled={addMutation.isPending}
                            className='flex items-center gap-1 px-4 py-1 rounded-full text-xs font-semibold transition-all bg-[#C40000] text-white hover:bg-red-800 disabled:opacity-50'
                          >
                            <Plus size={14} /> Add
                          </button>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => {
                                if (quantity > 1) {
                                  updateMutation.mutate({
                                    id: cartItemId,
                                    quantity: quantity - 1,
                                  });
                                } else {
                                  removeMutation.mutate(cartItemId);
                                }
                              }}
                              className='w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            >
                              <Minus size={14} />
                            </button>

                            <span className='text-sm font-semibold min-w-[12px] text-center'>
                              {quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: cartItemId,
                                  quantity: quantity + 1,
                                })
                              }
                              className='w-7 h-7 flex items-center justify-center rounded-full bg-[#C40000] text-white hover:bg-red-800'
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* REVIEWS SECTION */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Review</h2>
            <div className='flex items-center gap-2 mb-6'>
              <Star size={18} className='text-yellow-400 fill-yellow-400' />
              <span className='font-bold text-gray-900'>
                {restaurant.star || restaurant.rating || 0}
              </span>
              <span className='text-gray-500 text-sm'>
                ({reviews.length} Ulasan)
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className='text-gray-500 text-sm'>No reviews yet.</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className='flex gap-4 pb-6 border-b border-gray-100'
                  >
                    <div className='w-12 h-12 rounded-full overflow-hidden relative shrink-0 bg-gray-200'>
                      <img
                        src={
                          review.user?.avatar || '/images/default_avatar.png'
                        }
                        alt={review.user?.name || 'User'}
                        className='absolute inset-0 w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-gray-900 text-sm'>
                        {review.user?.name || 'Anonymous'}
                      </h4>
                      <p className='text-xs text-gray-400 mt-0.5 mb-1'>
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : 'Recently'}
                      </p>
                      <div className='flex gap-0.5 mb-2'>
                        {[...Array(review.star || 5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className='text-yellow-400 fill-yellow-400'
                          />
                        ))}
                      </div>
                      <p className='text-gray-600 text-sm leading-relaxed'>
                        {review.comment || review.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RestaurantDetailPage;
