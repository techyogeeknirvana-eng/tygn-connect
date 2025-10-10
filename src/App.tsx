import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Notes from "./pages/Notes";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Community from "./pages/Community";
import Quizzes from "./pages/Quizzes";
import QuizBuilder from "./pages/QuizBuilder";
import ResumeChecker from "./pages/ResumeChecker";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/events" element={<Events />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/quiz-builder" element={<QuizBuilder />} />
            <Route path="/resume-checker" element={<ResumeChecker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
