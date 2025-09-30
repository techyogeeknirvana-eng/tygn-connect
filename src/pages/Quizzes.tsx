'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, Users, Trophy, Play, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: any;
  start_at: string;
  end_at: string;
  status: string;
  created_at: string;
}

const Quizzes = () => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 700, 
      easing: 'ease-out-quart' 
    });
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to load quizzes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date().getTime();
    const startTime = new Date(quiz.start_at).getTime();
    const endTime = new Date(quiz.end_at).getTime();
    
    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'closed';
    return 'live';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-500 text-white pulse-glow">Live</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="border-tygn-yellow text-tygn-yellow">Upcoming</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    const status = getQuizStatus(quiz);
    if (status === 'live') {
      toast({
        title: "Starting Quiz",
        description: `Good luck with "${quiz.title}"!`,
      });
      // Here you would navigate to the quiz page
    } else if (status === 'upcoming') {
      toast({
        title: "Quiz Not Started",
        description: "This quiz hasn't started yet. Check back later!",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Quiz Closed",
        description: "This quiz has ended. Look out for future quizzes!",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-tygn-bg">
      {/* <Header /> */}
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="inline-flex items-center space-x-2 bg-tygn-blue/10 text-tygn-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              <span className="uppercase tracking-wide">Coding Quizzes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-tygn-blue uppercase tracking-wide mb-4">
              Test Your Programming Skills
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Challenge yourself with curated coding quizzes designed to test your knowledge and help you prepare for technical interviews.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center shadow-lg" data-aos="zoom-in" data-aos-delay="200">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-tygn-yellow mx-auto mb-2" />
                <div className="text-2xl font-bold text-tygn-blue">{quizzes.length}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Available Quizzes</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" data-aos="zoom-in" data-aos-delay="300">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-tygn-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-tygn-blue">1200+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Students Participated</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" data-aos="zoom-in" data-aos-delay="400">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-tygn-yellow mx-auto mb-2" />
                <div className="text-2xl font-bold text-tygn-blue">5-15</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Minutes per Quiz</div>
              </CardContent>
            </Card>
          </div>

          {/* Quizzes List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tygn-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <Card className="text-center py-16" data-aos="fade-up">
              <CardContent>
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-tygn-blue mb-2">No Quizzes Available</h3>
                <p className="text-gray-600 mb-6">
                  Check back soon for new coding challenges and quizzes!
                </p>
                <Button 
                  variant="outline" 
                  className="border-tygn-blue text-tygn-blue hover:bg-tygn-blue hover:text-white"
                  onClick={() => window.open('https://chat.whatsapp.com/GVwxFiceNyuKr2a3OuQFHN', '_blank')}
                >
                  Join Community for Updates
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-tygn-blue uppercase tracking-wide mb-6" data-aos="fade-up">
                Available Quizzes
              </h2>
              
              <div className="grid gap-6">
                {quizzes.map((quiz, index) => {
                  const status = getQuizStatus(quiz);
                  return (
                    <Card 
                      key={quiz.id} 
                      className={`shadow-lg hover:shadow-xl transition-all duration-300 ${status === 'live' ? 'ring-2 ring-green-200' : ''}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-tygn-blue uppercase tracking-wide">
                                {quiz.title}
                              </h3>
                              {getStatusBadge(status)}
                            </div>
                            
                            {quiz.topic && (
                              <p className="text-gray-600 mb-3">Topic: {quiz.topic}</p>
                            )}
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                <span>{quiz.questions?.length || 0} questions</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(quiz.start_at).toLocaleDateString()} - {new Date(quiz.end_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Created: {new Date(quiz.created_at).toLocaleDateString()}
                          </div>
                          
                          <Button
                            onClick={() => handleStartQuiz(quiz)}
                            disabled={status === 'closed'}
                            className={`px-6 py-2 font-bold uppercase tracking-wide transition-all duration-300 ${
                              status === 'live' 
                                ? 'bg-tygn-yellow text-tygn-blue hover:scale-105 pulse-glow' 
                                : status === 'upcoming'
                                ? 'bg-tygn-blue text-white hover:bg-tygn-blue/90'
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                          >
                            {status === 'live' ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Now
                              </>
                            ) : status === 'upcoming' ? (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Coming Soon
                              </>
                            ) : (
                              'Quiz Ended'
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Quizzes;