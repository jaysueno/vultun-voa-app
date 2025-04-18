import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export interface UserWithRole extends User {
  role?: 'customer' | 'staff' | 'admin';
}

export function useUser() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      if (initialUser) {
        // Get user role from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', initialUser.id)
          .single();
        
        setUser({
          ...initialUser,
          role: userData?.role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    getInitialUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          ...session.user,
          role: userData?.role
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
} 