"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) {
        setUser(user);
        setIsUserLoading(false);
      }
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, isUserLoading };
}
