'use client';

import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return null;
}
