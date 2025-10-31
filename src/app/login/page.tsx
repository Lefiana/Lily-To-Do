'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import '@/styles/login.css';
export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="login-wrapper">
      <div className="card">
        <LoginForm />
      </div>
    </div>
  );
}
