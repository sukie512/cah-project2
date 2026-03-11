'use client';

import { useState } from 'react';
import { loginCustomer, registerCustomer } from '@/lib/medusa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginCustomer(form.email, form.password);
      } else {
        await registerCustomer(form);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-black uppercase mb-8">
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </h1>

      {error && (
        <p className="text-sm text-red-600 border border-red-600 px-4 py-3 mb-6">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'register' && (
          <>
            <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
            <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
          </>
        )}
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold uppercase text-sm py-3 hover:bg-gray-900 transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm mt-6 text-center">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="underline font-bold"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

function Field({
  label, name, type = 'text', value, onChange,
}: {
  label: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-bold uppercase tracking-wide">{label}</label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} required
        className="border border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
