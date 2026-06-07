import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tygn_logo from '@/assets/tygn-logo.png';

const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

const Auth = () => {
  const { signInWithGoogle, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.email === ADMIN_EMAIL) navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Google sign-in failed', description: (error as any).message ?? 'Try again.', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05060f] text-white flex items-center justify-center p-4">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)' }}
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.3), transparent 70%)' }}
          animate={{ x: [0, -60, 0], y: [0, -80, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-300/70"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -60, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-yellow-300 opacity-60 blur-sm" />
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="p-8 text-center">
            <div className="mx-auto mb-5 relative w-24 h-24">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/30 to-yellow-300/40 blur-md" />
              <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-cyan-300/40 bg-black p-2 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <img src={tygn_logo} alt="TYGN" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">TYGN Network Access</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-300 bg-clip-text text-transparent">
              Enter the Network
            </h1>
            <p className="text-white/60 text-sm mt-2 mb-8">
              Authenticate with your Google identity to join the B.Tech operator collective.
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={isLoading}
              className="group relative w-full h-12 rounded-xl overflow-hidden disabled:opacity-60"
            >
              <span className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300 blur opacity-70 group-hover:opacity-100 transition" />
              <span className="relative flex items-center justify-center gap-3 h-full rounded-xl bg-[#0a0a18] border border-white/20 text-white font-semibold">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </span>
            </button>

            <div className="mt-8 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
              <Tag icon={ShieldCheck} label="Encrypted" />
              <Tag icon={Zap} label="Real-time" />
              <Tag icon={Sparkles} label="Cyber" />
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/40">
              Google sign-in only · No passwords stored
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Tag = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex flex-col items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] py-2">
    <Icon className="h-3 w-3 text-cyan-300" />
    <span className="text-white/60">{label}</span>
  </div>
);

export default Auth;
