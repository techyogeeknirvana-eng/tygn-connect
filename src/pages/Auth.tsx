import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User as UserIcon, Phone, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

const Auth = () => {
  const { signIn, signUp, signInWithGoogle, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '', password: '', confirmPassword: '',
    fullName: '', phoneNumber: '', branch: '', semester: 1,
  });

  useEffect(() => {
    if (user) {
      if (user.email === ADMIN_EMAIL) navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    setIsLoading(false);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back', description: 'Authentication successful.' });
      if (signInData.email === ADMIN_EMAIL) navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({ title: 'Password mismatch', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(
      signUpData.email, signUpData.password,
      signUpData.fullName, signUpData.phoneNumber,
      signUpData.branch, signUpData.semester
    );
    setIsLoading(false);
    if (error) toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    else toast({ title: 'Account created', description: 'Pending admin approval.' });
  };

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
        <Loader2 className="h-12 w-12 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05060f] text-white flex items-center justify-center p-4">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }}
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.30), transparent 70%)' }}
          animate={{ x: [0, -60, 0], y: [0, -80, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-300/60"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Glow border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 opacity-60 blur-sm" />
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-violet-300" />
              <span className="text-xs uppercase tracking-[0.3em] text-violet-300/80">TYGN Access</span>
            </div>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Enter the Network
            </h1>
            <p className="text-center text-white/60 text-sm mt-2 mb-6">
              Sign in or join the TechYOGeek Nirvana community
            </p>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-white/5 border border-white/10">
                <TabsTrigger value="signin" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-200">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-200">Sign Up</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="signin" key="signin">
                  <motion.form
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSignIn} className="space-y-4 mt-6"
                  >
                    <NeonField icon={Mail} label="Email" type="email"
                      value={signInData.email}
                      onChange={(v) => setSignInData((p) => ({ ...p, email: v }))} />
                    <NeonField icon={Lock} label="Password" type="password"
                      value={signInData.password}
                      onChange={(v) => setSignInData((p) => ({ ...p, password: v }))} />
                    <NeonButton loading={isLoading} type="submit">
                      <Shield className="w-4 h-4 mr-2" />
                      Sign In
                    </NeonButton>
                    <Divider />
                    <GoogleButton onClick={handleGoogle} loading={isLoading} />
                    <p className="text-[11px] text-white/40 text-center pt-2">
                      Admin? Sign in with <span className="text-violet-300">{ADMIN_EMAIL}</span> to access the dashboard.
                    </p>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" key="signup">
                  <motion.form
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSignUp} className="space-y-3 mt-6"
                  >
                    <NeonField icon={UserIcon} label="Full Name"
                      value={signUpData.fullName}
                      onChange={(v) => setSignUpData((p) => ({ ...p, fullName: v }))} />
                    <NeonField icon={Mail} label="Email" type="email"
                      value={signUpData.email}
                      onChange={(v) => setSignUpData((p) => ({ ...p, email: v }))} />
                    <NeonField icon={Phone} label="Phone Number" type="tel"
                      value={signUpData.phoneNumber}
                      onChange={(v) => setSignUpData((p) => ({ ...p, phoneNumber: v }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-white/60 mb-1 block">Branch</Label>
                        <Select onValueChange={(v) => setSignUpData((p) => ({ ...p, branch: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {['CSE','IT','ECE','EE','ME','CE','Other'].map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-white/60 mb-1 block">Semester</Label>
                        <Select onValueChange={(v) => setSignUpData((p) => ({ ...p, semester: parseInt(v) }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Sem" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6,7,8].map((s) => (
                              <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <NeonField icon={Lock} label="Password" type="password"
                      value={signUpData.password}
                      onChange={(v) => setSignUpData((p) => ({ ...p, password: v }))} />
                    <NeonField icon={Lock} label="Confirm Password" type="password"
                      value={signUpData.confirmPassword}
                      onChange={(v) => setSignUpData((p) => ({ ...p, confirmPassword: v }))} />
                    <NeonButton loading={isLoading} type="submit">
                      Create Account
                    </NeonButton>
                    <Divider />
                    <GoogleButton onClick={handleGoogle} loading={isLoading} />
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NeonField = ({
  icon: Icon, label, value, onChange, type = 'text',
}: { icon: any; label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div className="group">
    <Label className="text-xs text-white/60 mb-1 block">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-violet-300 transition-colors" />
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-violet-400/60 focus-visible:border-violet-400/60 h-11"
      />
    </div>
  </div>
);

const NeonButton = ({ children, loading, type = 'button', onClick }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    className="relative w-full h-11 rounded-md font-semibold text-white overflow-hidden group disabled:opacity-60"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />
    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-400 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
    <span className="relative flex items-center justify-center">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </span>
  </button>
);

const Divider = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-transparent px-2 text-white/40">Or</span></div>
  </div>
);

const GoogleButton = ({ onClick, loading }: { onClick: () => void; loading: boolean }) => (
  <button
    type="button" onClick={onClick} disabled={loading}
    className="w-full h-11 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-white/90"
  >
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    Continue with Google
  </button>
);

export default Auth;
