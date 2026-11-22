'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUsers } from '@/lib/auth';

import RegisterForm from '@/features/auth/components/RegisterForm';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();

  const handleSubmit = (event: React.InputEvent) => {
    event.preventDefault(); // stop the page from reloading

    // 1. Check that all fields are filled.
    if (!name || !email || !password) {
      setMessage('Please fill in every field.');
      return;
    }

    // 2. Try to save the user.
    const success = saveUsers({ name, email, password });

    if (success) {
      setMessage('Registration successful! You can now log in.');
      // Optionally send the user to the login page after 2 seconds.
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setMessage('This email is already registered. Try another one.');
    }
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-white'>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
