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
import { Logo } from '../../../../public/images/imageHandler';

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
  } = useForm<
    RegisterFormValues & { username?: string; confirmPassword?: string }
  >({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
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
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050505] font-sans'>
      <div className='pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/3 rounded-full bg-purple-600/30 blur-[120px]' />
      <div className='relative z-10 w-full max-w-[400px] p-6 my-8'>
        <div className='mx-auto w-full'>
          {/* Logo & Brand Name */}
          <div className='mb-6 flex items-center justify-center gap-2.75'>
            <img
              src={Logo}
              alt='Sociify Logo'
              className='h-7 w-7 object-contain'
            />
            <span className='text-[2rem] font-extrabold leading-10.5 text-white'>
              Sociality
            </span>
          </div>
          <h1 className='mb-8 text-center text-[1.75rem] font-extrabold leading-9.5 text-white'>
            Register
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            {/* Name */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='name'
                className='text-sm font-medium text-neutral-400'
              >
                Name
              </label>
              <div>
                <input
                  type='text'
                  id='name'
                  placeholder='Enter your name'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.name
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className='text-xs text-accent-red'>{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='username'
                className='text-sm font-medium text-neutral-400'
              >
                Username
              </label>
              <div>
                <input
                  type='text'
                  id='username'
                  placeholder='Enter your username'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.username
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('username' as any)}
                />
              </div>
              {errors.username && (
                <p className='text-xs text-accent-red'>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='phone'
                className='text-sm font-medium text-neutral-400'
              >
                Number Phone
              </label>
              <div>
                <input
                  type='tel'
                  id='phone'
                  placeholder='Enter your phone number'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className='text-xs text-accent-red'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-neutral-400'
              >
                Email
              </label>
              <div>
                <input
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className='text-xs text-accent-red'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-neutral-400'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  placeholder='Enter your password'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 pr-12 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300'
                >
                  {/* Eye Icon kept as is */}
                </button>
              </div>
              {errors.password && (
                <p className='text-xs text-accent-red'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-neutral-400'
              >
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  placeholder='Confirm your password'
                  className={`h-14 w-full rounded-lg border bg-neutral-950 px-4 pr-12 text-sm font-normal text-neutral-25 placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                      : 'border-neutral-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                  {...register('confirmPassword' as any)}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300'
                >
                  {/* Eye Icon kept as is */}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-xs text-accent-red'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <p className='text-center text-sm text-accent-red font-medium mt-2'>
                {error}
              </p>
            )}

            {/* Register button */}
            <button
              type='submit'
              disabled={registerMutation.isPending}
              // CHANGED: Purple button matching design
              className='mt-4 w-full rounded-full bg-[#8b5cf6] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-70'
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* ADDED: Footer link matching design */}
          <p className='mt-6 text-center text-sm text-neutral-400'>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => router.push('/login')}
              className='font-semibold text-purple-400 hover:text-purple-300 transition-colors'
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
