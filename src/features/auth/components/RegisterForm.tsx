'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useRegister';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/lib/validations/auth';
import { Login, Logo_Red } from '../../../../public/images/imageHandler';

function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues) => {
    setError(null);
    registerMutation.mutate(
      {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      },
      {
        onSuccess: () => router.push('/'),
        onError: (err: any) => {
          const backendMessage = err?.response?.data?.message;

          if (err?.response?.status === 409) {
            setError('This email is already registered. Please login instead.');
          } else {
            setError(backendMessage || err?.message || 'Registration failed');
          }
        },
      }
    );
  };

  return (
    <div className='flex w-full max-w-[1440px] flex-col bg-white font-sans md:h-[1024px] md:flex-row'>
      {/* Left Side Image */}
      <div className='relative h-75 w-full md:h-[1024px] md:w-[720px] md:shrink-0'>
        <img
          src={Login}
          alt='Restaurant Visual'
          className='absolute inset-0 h-full w-full object-cover object-center'
        />
      </div>

      {/* Right Side Form */}
      <div className='flex w-full flex-col justify-center overflow-y-auto p-8 md:h-[1024px] md:w-[720px] md:p-12 lg:p-16'>
        <div className='mx-auto w-full max-w-[420px]'>
          {/* Logo & Brand Name */}
          <div className='mb-8 flex items-center gap-3.75'>
            <img
              src={Logo_Red}
              alt='Foody Logo'
              className='h-7 w-7 object-contain'
            />
            <span className='text-[2rem] font-extrabold leading-10.5 text-neutral-950'>
              Foody
            </span>
          </div>

          <h1 className='mb-1 text-[1.75rem] font-extrabold leading-9.5 text-neutral-950'>
            Create an Account
          </h1>
          <p className='mb-8 text-base font-medium leading-7.5 text-neutral-950'>
            Join us and start exploring culinary experiences!
          </p>

          {/* Toggle */}
          <div className='mb-6 flex rounded-lg bg-neutral-100 p-2'>
            <button
              type='button'
              onClick={() => router.push('/login')}
              className='flex-1 rounded-md py-2 text-[0.875rem] font-medium text-neutral-500 hover:text-neutral-950 hover:font-bold transition-colors'
            >
              Sign in
            </button>
            <button
              type='button'
              className='flex-1 rounded-md bg-white py-1.25 text-base leading-7.5 font-bold text-neutral-950 shadow-sm'
            >
              Sign up
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-3'
          >
            {/* Name */}
            <div>
              <div className='relative'>
                <input
                  type='text'
                  id='name'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pt-6 pb-1 text-[0.875rem] font-normal text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('name')}
                />
                <label
                  htmlFor='name'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Name
                </label>
              </div>
              {errors.name && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className='relative'>
                <input
                  type='email'
                  id='email'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pt-6 pb-1 text-[0.875rem] font-normal text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('email')}
                />
                <label
                  htmlFor='email'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Email
                </label>
              </div>
              {errors.email && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className='relative'>
                <input
                  type='tel'
                  id='phone'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pt-6 pb-1 text-[0.875rem] font-normal text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('phone')}
                />
                <label
                  htmlFor='phone'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Number Phone
                </label>
              </div>
              {errors.phone && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pr-12 pt-6 pb-1 text-[0.875rem] font-normal text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('password')}
                />
                <label
                  htmlFor='password'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Password
                </label>
              </div>
              {errors.password && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pr-12 pt-6 pb-1 text-[0.875rem] font-normal text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('confirmPassword')}
                />
                <label
                  htmlFor='confirmPassword'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Confirm Password
                </label>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <p className='text-center text-sm text-red-500 font-medium mt-2'>
                {error}
              </p>
            )}

            {/* Register button */}
            <button
              type='submit'
              disabled={registerMutation.isPending} // ⬅️ CHANGED — no useless `?.`
              className='mt-4 w-full rounded-full bg-[#C40000] py-3 text-[16px] font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-70'
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
