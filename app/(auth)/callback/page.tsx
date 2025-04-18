'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationError, setVerificationError] = useState<string | null>(null);

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
          router.push('/login');
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
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Error during email confirmation:', error);
        setVerificationError(error.message);
        // Wait a moment before redirecting on error
        setTimeout(() => {
          router.push('/login?error=' + encodeURIComponent(error.message));
        }, 3000);
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {verificationError ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-red-600">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{verificationError}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Verifying your email...</h2>
              <p className="text-gray-600 mb-4">Please wait while we confirm your email address.</p>
              <div className="animate-pulse flex justify-center">
                <div className="h-2 w-24 bg-indigo-200 rounded"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 