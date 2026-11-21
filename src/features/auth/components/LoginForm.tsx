'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { Logo } from '../../../../public/images/imageHandler';

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
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await login.mutateAsync(values);
    } catch (err: any) {
      console.error('[login] failed →', err);
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'Login failed';
      setError(message);
    }
  };

  return (
    <div className='relative flex justify-center items-center min-h-screen min-w-screen overflow-hidden bg-[#050505] font-sans'>
      {/* Purple gradient glow at the bottom */}
      <div className='pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/3 rounded-full bg-purple-600/30 blur-[120px]' />

      {/* Login Form */}
      <div className='relative z-10 w-98.25 md:w-111.5 py-10 px-6'>
        <div className='mx-auto w-full'>
          {/* Logo */}
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
          <div>
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
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {/* Eye Icon kept as is */}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm leading-7 tracking-[-0.03em] text-accent-red'>
                Text Helper
              </p>
            )}
          </div>

          {error && <p className='text-center text-sm text-red-500'>{error}</p>}

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
