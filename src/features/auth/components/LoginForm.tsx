'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { Logo } from '../../../../public/images/imageHandler';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = (values: LoginFormValues) => {
    setError(null);

    login.mutate(values, {
      onSuccess: () => {
        router.push('/');
      },
      onError: (err: any) => {
        console.error('Login error:', err);

        const backendMessage =
          err?.response?.data?.message || err?.response?.data?.error;
        const validationErrors = err?.response?.data?.errors;

        if (validationErrors && typeof validationErrors === 'object') {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey];
          setError(
            Array.isArray(firstErrorMessage)
              ? firstErrorMessage[0]
              : String(firstErrorMessage)
          );
        } else {
          setError(
            backendMessage || err?.message || 'Invalid email or password'
          );
        }
      },
    });
  };

  return (
    <div className='flex justify-center items-center bg-transparent'>
      <div className='absolute z-1 min-h-screen min-w-screen overflow-hidden bg-linear-to-tr from-primary-300 via-[#050505] via-40% to-base-black font-sans'></div>
      <div className='absolute z-1 min-h-screen min-w-screen overflow-hidden bg-linear-to-tl opacity-50 from-primary-200 via-[#050505] via-40% to-base-black font-sans'></div>
      {/* Login Form */}
      <div className='relative z-10 rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] shadow-2xl w-98.25 md:w-111.5 py-10 px-6'>
        <div className='mx-auto w-full'>
          {/* Logo and Social Media Name */}
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
            Welcome Back
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
                type='text'
                id='username'
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

          {/* Password */}
          <div>
            <label
              htmlFor='Password'
              className='text-sm leading-7 tracking-[-0.02em] font-bold text-neutral-25'
            >
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Password'
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

          {/* Login button */}
          <button
            type='submit'
            disabled={login.isPending}
            className='mt-2 w-full rounded-full bg-primary-300 py-3 text-base leading-7.5 tracking-[-0.02em] font-semibold text-neutral-25 transition-colors hover:bg-primary-200 disabled:opacity-70'
          >
            {login.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Register link */}
        <p className='mt-4 text-center text-base leading-7.5 tracking-[-0.02em] text-neutral-25'>
          Don't have an account?{' '}
          <button
            type='button'
            onClick={() => router.push('/register')}
            className='font-semibold text-primary-200 hover:text-primary-300 transition-colors'
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
