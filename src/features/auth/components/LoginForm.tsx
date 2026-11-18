'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { Login, Logo_Red } from '../../../../public/images/imageHandler';

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
    <div className='flex w-full max-w-[1440px] flex-col bg-white font-sans md:h-[1024px] md:flex-row'>
      {/* Login Image */}
      <div className='relative h-75 w-full md:h-[1024px] md:w-[720px] md:shrink-0'>
        <img
          src={Login}
          alt='Login visual'
          className='absolute inset-0 h-full w-full object-cover object-center'
        />
      </div>

      {/* Login Form */}
      <div className='flex w-full flex-col justify-center p-8 md:w-[720px] md:p-16 lg:p-20'>
        <div className='mx-auto w-full max-w-[400px]'>
          {/* Logo */}
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
            Welcome Back
          </h1>
          <p className='mb-8 text-base font-medium leading-7.5 text-neutral-950'>
            Good to see you again! Let's eat
          </p>

          {/* Toggle */}
          <div className='mb-6 flex rounded-lg bg-neutral-100 p-2'>
            <button
              type='button'
              className='flex-1 rounded-md bg-white py-1.25 text-base leading-7.5 font-bold text-neutral-950 shadow-sm'
            >
              Sign in
            </button>
            <button
              type='button'
              onClick={() => router.push('/register')}
              className='flex-1 rounded-md py-2 text-[0.875rem] font-medium text-neutral-500 hover:text-neutral-950 hover:font-bold transition-colors'
            >
              Sign up
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            {/* Email */}
            <div>
              <div className='relative'>
                <input
                  type='email'
                  id='email'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pt-6 pb-1 text-sm font-normal text-gray-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
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

            {/* Password */}
            <div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  placeholder=' '
                  className='peer h-14 w-full rounded-lg border border-neutral-300 bg-transparent px-4 pr-12 pt-6 pb-1 text-sm font-normal text-gray-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300'
                  {...register('password')}
                />
                <label
                  htmlFor='password'
                  className='pointer-events-none absolute left-4 top-2 text-xs text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-neutral-500'
                >
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {/* Eye Icon kept as is */}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className='text-center text-sm text-red-500'>{error}</p>
            )}

            {/* Login button */}
            <button
              type='submit'
              disabled={login.isPending}
              className='mt-2 w-full rounded-full bg-[#C40000] py-3 text-[16px] font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-70'
            >
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
