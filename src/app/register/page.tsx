'use client';
import { RegisterForm } from '@/components/auth/RegisterForm';
import '@/styles/login.css';

export default function RegisterPage() {
  return (
    <div className="login-wrapper">
      <div className="card">
        <RegisterForm />
      </div>
    </div>
  );
}
