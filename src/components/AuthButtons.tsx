'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';

export default function AuthButtons() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
      extraParams: {
        prompt: 'select_account',
      },
    });

    if (result.error) {
      toast({
        title: 'Google sign-in failed',
        description: result.error instanceof Error ? result.error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 w-48 bg-tygn-yellow/20 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={signInWithGoogle}
        className="px-8 py-3 bg-tygn-yellow text-tygn-blue font-semibold rounded-full hover:scale-[1.02] transition-all duration-200 shadow-md"
      >
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-center animate-fade-in">
      <span className="text-sm text-white/90 font-medium">
        Welcome, {user.email?.split('@')[0]}!
      </span>
      <Button 
        onClick={signOut}
        variant="outline"
        size="sm"
        className="border-white/30 text-muted hover:bg-white/10"
      >
        Sign Out
      </Button>
    </div>
  );
}