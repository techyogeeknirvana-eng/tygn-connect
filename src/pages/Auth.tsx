import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
          <div className="text-2xl font-medium text-primary-glow">
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
  const { signIn, signUp, loading } = useAuth();
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
          description: "Please check your email to verify your account.",
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

  return (
    <>
      <TechGates isOpen={gatesOpen} />
      
      <div className={`min-h-screen flex items-center justify-center bg-gradient-hero p-4 transition-all duration-1000 ${
        gatesOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <Card className="w-full max-w-md border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-primary">Welcome to TYGN</CardTitle>
            <CardDescription className="text-lg">
              Empowering Coders. Building Community.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Auth;