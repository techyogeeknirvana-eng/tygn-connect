import React, { useState, useEffect} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechGates = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-1000 ease-in-out ${
      isOpen ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
    }`}>
      {/* Top Gate */}
      <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary via-primary-glow to-transparent border-b-2 border-primary-glow transition-transform duration-1000 ease-in-out ${
        isOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-20 h-20 bg-card border-2 border-primary-glow rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Bottom Gate */}
      <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary via-primary-glow to-transparent border-t-2 border-primary-glow transition-transform duration-1000 ease-in-out ${
        isOpen ? 'translate-y-full' : 'translate-y-0'
      }`}>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 bg-card border-2 border-primary-glow rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Left Gate */}
      <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary via-primary-glow to-transparent border-r-2 border-primary-glow transition-transform duration-1000 ease-in-out ${
        isOpen ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 bg-card border-2 border-primary-glow rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Right Gate */}
      <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary via-primary-glow to-transparent border-l-2 border-primary-glow transition-transform duration-1000 ease-in-out ${
        isOpen ? 'translate-x-full' : 'translate-x-0'
      }`}>
        <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 bg-card border-2 border-primary-glow rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Center Logo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className={`text-center transition-all duration-1000 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          <h1 className="text-6xl font-heading font-bold text-primary-foreground mb-4 animate-pulse">
            TechYOGeek Nirvana
          </h1>
          <div className="text-2xl font-medium text-white">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = () => {

  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [gatesOpen, setGatesOpen] = useState(false);

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    branch: '',
    semester: 1
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setGatesOpen(true);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signUpData.email, 
        signUpData.password, 
        signUpData.fullName,
        signUpData.phoneNumber,
        signUpData.branch, 
        signUpData.semester
      );
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your account was created successfully and is pending admin approval.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Redirecting to Google",
          description: "Choose your Google account to continue.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setGatesOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <>
      <TechGates isOpen={gatesOpen} />
      
      <div className={`min-h-screen flex items-center justify-center  p-4`}>
        <Card className="w-full max-w-md border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-primary">Welcome to TYGN</CardTitle>
            <CardDescription className="text-lg">
              Empowering Coders. Building Community.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="user-signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="user-signin" className='text-neutral-200'>User Login</TabsTrigger>
                <TabsTrigger value="admin-signin" className='text-neutral-200'>Admin Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user-signin" className="space-y-4">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4 mt-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={signInData.email}
                          onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={signInData.password}
                          onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full border-border hover:bg-accent"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4 mt-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={signUpData.fullName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+91 1234567890"
                          value={signUpData.phoneNumber}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          required
                        />
                      </div>
                  
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="branch">Branch</Label>
                          <Select onValueChange={(value) => setSignUpData(prev => ({ ...prev, branch: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CSE">Computer Science</SelectItem>
                              <SelectItem value="IT">Information Technology</SelectItem>
                              <SelectItem value="ECE">Electronics & Communication</SelectItem>
                              <SelectItem value="EE">Electrical Engineering</SelectItem>
                              <SelectItem value="ME">Mechanical Engineering</SelectItem>
                              <SelectItem value="CE">Civil Engineering</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="semester">Semester</Label>
                          <Select onValueChange={(value) => setSignUpData(prev => ({ ...prev, semester: parseInt(value) }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8].map(sem => (
                                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-success hover:opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full border-border hover:bg-accent"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="admin-signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Admin Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Auth;