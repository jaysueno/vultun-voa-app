'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
          return;
        }

        if (!searchParams) {
          throw new Error('No search parameters available');
        }

        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (!token || !email) {
          // If no token or email, redirect to login
          router.push('/auth/login');
          return;
        }

        if (type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token,
            type: 'signup',
            email
          });

          if (error) throw error;

          // Redirect to dashboard after successful verification
          router.push('/dashboard');
        } else {
          // Handle other verification types if needed
          router.push('/auth/login');
        }
      } catch (error: any) {
        console.error('Error during email confirmation:', error);
        router.push('/auth/login?error=' + encodeURIComponent(error.message));
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    </div>
  );
} 