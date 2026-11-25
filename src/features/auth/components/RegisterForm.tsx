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
import { Eye, EyeOff } from 'lucide-react';

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
    mode: 'onTouched',
  });

  const onSubmit = (values: RegisterFormValues) => {
    setError(null);

    console.log('Submitting registration with payload:', values);

    registerMutation.mutate(
      {
        name: values.name,
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
      },
      {
        onSuccess: () => {
          // Navigate to login, user can sign in
          router.push('/login?registered=1');
        },
        onError: (err: any) => {
          console.error('Registration error in component:', err);

          const backendMessage =
            err?.response?.data?.message || err?.response?.data?.error;

          const validationErrors = err?.response?.data?.errors;

          if (validationErrors && typeof validationErrors === 'object') {
            // Extract the first specific error message from the errors object
            const firstErrorKey = Object.keys(validationErrors)[0];
            const firstErrorMessage = validationErrors[firstErrorKey];
            setError(
              Array.isArray(firstErrorMessage)
                ? firstErrorMessage[0]
                : String(firstErrorMessage)
            );
          } else if (err?.response?.status === 400) {
            setError(backendMessage || 'Phone already in use.');
          } else if (err?.response?.status === 422) {
            const fieldErrors = err?.response?.data?.errors;
            if (fieldErrors && typeof fieldErrors === 'object') {
              const firstError = Object.values(fieldErrors)[0];
              setError(
                Array.isArray(firstError) ? firstError[0] : String(firstError)
              );
            } else {
              setError(
                backendMessage || 'Validation failed. Please check your input.'
              );
            }
          } else {
            setError(
              backendMessage ||
                err?.message ||
                'Registration failed. Please try again.'
            );
          }
        },
      }
    );
  };

  return (
    <div className='flex justify-center items-center bg-base-black'>
      <div className='absolute z-1 min-h-screen min-w-screen overflow-hidden bg-linear-to-tr from-primary-300 via-[#050505] via-40% to-base-black font-sans'></div>
      <div className='absolute z-1 min-h-screen min-w-screen overflow-hidden bg-linear-to-tl opacity-50 from-primary-200 via-[#050505] via-40% to-base-black font-sans'></div>
      {/* Register Form */}
      <div className='relative z-10 rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-8 shadow-2xl w-98.25 md:w-130.75 py-5 px-6'>
        <div className='mx-auto w-full'>
          {/* Logo & Social Media Name */}
          <div className='flex items-center justify-center gap-2.75'>
            <img
              src={Logo}
              alt='Sociality Logo'
              className='h-7 w-7 object-contain'
            />
            <span className='text-2xl leading-9 font-bold text-neutral-25'>
              Sociality
            </span>
          </div>
          <h1 className='my-6 flex justify-center text-2xl font-bold leading-9 text-neutral-25'>
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
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Name
              </label>
              <div>
                <input
                  type='text'
                  id='name'
                  placeholder='Enter your name'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
                </p>
              )}
            </div>

            {/* Username */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='username'
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Username
              </label>
              <div>
                <input
                  type='text'
                  id='username'
                  placeholder='Enter your username'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
                </p>
              )}
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Email
              </label>
              <div>
                <input
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='phone'
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Number Phone
              </label>
              <div>
                <input
                  type='tel'
                  id='phone'
                  placeholder='Enter your phone number'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
                </p>
              )}
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='password'
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  placeholder='Enter your password'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='confirmPassword'
                className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
              >
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  placeholder='Enter your confirm password'
                  className='py-2.25 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-base text-neutral-25 leading-7.5 tracking-[-0.02em] placeholder:text-neutral-600 placeholder:font-normal focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red'
                  {...register('confirmPassword' as any)}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                  Text Helper
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
              className='mt-2 w-full rounded-full bg-primary-300 py-3 text-base leading-7.5 tracking-[-0.02em] font-semibold text-neutral-25 transition-colors hover:bg-primary-200 disabled:opacity-70'
            >
              {registerMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          <p className='mt-4 text-center text-base leading-7.5 tracking-[-0.02em] text-neutral-25'>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => router.push('/login')}
              className='font-semibold text-primary-200 hover:text-primary-300 transition-colors'
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
