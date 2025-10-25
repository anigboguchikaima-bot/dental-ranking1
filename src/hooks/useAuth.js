// src/hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const GUEST_KEY = 'guest_mode';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(
    () => window.localStorage.getItem(GUEST_KEY) === '1'
  );

  // Keep guest flag in localStorage
  useEffect(() => {
    if (guest) localStorage.setItem(GUEST_KEY, '1');
    else localStorage.removeItem(GUEST_KEY);
  }, [guest]);

  // Load existing session and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) setSession(data.session ?? null);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setGuest(false); // drop guest flag on explicit sign out
  }, []);

  const enableGuest = useCallback(() => setGuest(true), []);
  const disableGuest = useCallback(() => setGuest(false), []);

  const canSave = !!session; // ONLY signed-in users can save to cloud.

  return {
    session,
    user: session?.user ?? null,
    guest,
    canSave,
    loading,
    signOut,
    enableGuest,
    disableGuest,
  };
}
