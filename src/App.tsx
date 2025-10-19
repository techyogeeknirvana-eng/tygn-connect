import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import StartupAnimation from "./components/StartupAnimation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Notes from "./pages/Notes";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Quizzes from "./pages/Quizzes";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ResumeChecker from "./pages/ResumeChecker";
import { UserApprovalStatus } from "./components/UserApprovalStatus";
import { useIsAdmin } from "./hooks/useIsAdmin";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, isApproved, userProfile } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [showStartup, setShowStartup] = useState(true);
  const [startupComplete, setStartupComplete] = useState(false);

  useEffect(() => {
    // Check if startup has been shown before
    const hasSeenStartup = sessionStorage.getItem('startupShown');
    if (hasSeenStartup) {
      setShowStartup(false);
      setStartupComplete(true);
    }
  }, []);

  const handleStartupComplete = () => {
    sessionStorage.setItem('startupShown', 'true');
    setShowStartup(false);
    setStartupComplete(true);
  };

  if (showStartup && !startupComplete) {
    return <StartupAnimation onComplete={handleStartupComplete} />;
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  // Admins bypass approval requirement
  const needsApproval = !isAdmin && userProfile && !isApproved && userProfile.approval_status !== 'approved';
  
  if (needsApproval) {
    return <UserApprovalStatus />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notes" 
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-checker"
                element={
                  <ProtectedRoute>
                    <ResumeChecker/>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
