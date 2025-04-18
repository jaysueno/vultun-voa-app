'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .single();

      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?email=${encodeURIComponent(cleanEmail)}`,
          data: { full_name: fullName }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      // Customer record creation is now handled by the database trigger
      // No need for manual insert here

      return { 
        success: true, 
        message: 'Please check your email for the confirmation link.' 
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during signup' 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) throw error;

      // Check if customer record exists
      const { data: customerData, error: customerCheckError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      // If no customer record exists, create one
      if (!customerData && !customerCheckError) {
        const { error: createError } = await supabase
          .from('customers')
          .insert({
            user_id: data.user.id,
            email: cleanEmail,
            full_name: data.user.user_metadata.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          console.error('Error creating customer record:', createError);
          throw new Error('Failed to create customer profile');
        }
      }

      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to sign in' 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const value = { user, session, loading, signUp, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
} 