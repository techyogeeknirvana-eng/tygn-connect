import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  Users, 
  Target,
  Play,
  Award,
  Zap,
  Brain,
  Code2,
  Star,
  ChevronRight,
  Gift,
  Medal,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Quizzes = () => {
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  // Mock data - will be replaced with actual database
  const quizzes = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      description: "Test your knowledge of arrays, linked lists, trees, graphs, and dynamic programming",
      difficulty: "Intermediate",
      questions: 25,
      timeLimit: 30,
      points: 100,
      participants: 1247,
      prize: "DSA Master Badge + ₹500 voucher",
      category: "Programming",
      tags: ["DSA", "Algorithms", "Coding"],
      isActive: true,
      featured: true
    },
    {
      id: 2,
      title: "React & JavaScript Fundamentals",
      description: "Modern React concepts, hooks, state management, and JavaScript ES6+ features",
      difficulty: "Beginner",
      questions: 20,
      timeLimit: 25,
      points: 80,
      participants: 892,
      prize: "Frontend Pro Badge + Swag Kit",
      category: "Web Development",
      tags: ["React", "JavaScript", "Frontend"],
      isActive: true,
      featured: false
    },
    {
      id: 3,
      title: "System Design Basics",
      description: "Scalability, databases, caching, load balancing, and distributed systems",
      difficulty: "Advanced",
      questions: 15,
      timeLimit: 20,
      points: 120,
      participants: 456,
      prize: "System Architect Badge + ₹1000 voucher",
      category: "System Design",
      tags: ["System Design", "Architecture", "Scalability"],
      isActive: true,
      featured: true
    },
    {
      id: 4,
      title: "Weekly Mega Quiz #47",
      description: "Mixed topics: DSA, Web Dev, Machine Learning, and System Design",
      difficulty: "All Levels",
      questions: 50,
      timeLimit: 60,
      points: 200,
      participants: 2341,
      prize: "₹5000 Cash Prize + Special Recognition",
      category: "Mixed",
      tags: ["Weekly", "Mixed Topics", "Big Prize"],
      isActive: true,
      featured: true,
      isMegaQuiz: true
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Arjun Kumar", score: 2450, badge: "Quiz Legend", avatar: "AK" },
    { rank: 2, name: "Priya Sharma", score: 2380, badge: "Quiz Master", avatar: "PS" },
    { rank: 3, name: "Rahul Verma", score: 2290, badge: "Quiz Expert", avatar: "RV" },
    { rank: 4, name: "Sneha Patel", score: 2156, badge: "Quiz Pro", avatar: "SP" },
    { rank: 5, name: "Vikash Singh", score: 2098, badge: "Quiz Enthusiast", avatar: "VS" },
  ];

  const userStats = {
    totalQuizzes: 12,
    averageScore: 78,
    badges: 5,
    currentStreak: 7,
    rank: 42,
    points: 1250
  };

  const badges = [
    { name: "Quiz Rookie", description: "Complete your first quiz", earned: true, icon: "🎯" },
    { name: "Speed Runner", description: "Complete a quiz in under 10 minutes", earned: true, icon: "⚡" },
    { name: "Perfect Score", description: "Get 100% in any quiz", earned: true, icon: "🏆" },
    { name: "DSA Master", description: "Excel in Data Structures quiz", earned: true, icon: "🧠" },
    { name: "Frontend Pro", description: "Master React/JS fundamentals", earned: true, icon: "💻" },
    { name: "Quiz Legend", description: "Reach top 10 on leaderboard", earned: false, icon: "👑" },
  ];

  const handleStartQuiz = (quizTitle: string) => {
    toast({
      title: "Starting Quiz",
      description: `Good luck with "${quizTitle}"! Give your best!`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-secondary";
      case "Intermediate": return "text-accent";
      case "Advanced": return "text-destructive";
      default: return "text-primary";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold">Coding Quizzes for Prizes</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Challenge yourself with coding quizzes, earn points, unlock badges, and win exciting prizes. Test your knowledge and compete with fellow coders!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats & Leaderboard */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{userStats.points}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{userStats.badges}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">#{userStats.rank}</div>
                    <div className="text-xs text-muted-foreground">Rank</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-glow">{userStats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">{userStats.averageScore}%</span>
                  </div>
                  <Progress value={userStats.averageScore} className="h-2" />
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {userStats.totalQuizzes} Quizzes Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-accent" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <div key={user.rank} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-gradient-energy text-accent-foreground' :
                      user.rank === 2 ? 'bg-gradient-success text-secondary-foreground' :
                      user.rank === 3 ? 'bg-gradient-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank <= 3 ? (
                        user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        user.rank
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.score} points</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span>My Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {badges.map((badge) => (
                    <div 
                      key={badge.name}
                      className={`p-2 text-center rounded-lg border transition-colors ${
                        badge.earned 
                          ? 'bg-secondary/10 border-secondary text-secondary' 
                          : 'bg-muted/50 border-muted text-muted-foreground'
                      }`}
                    >
                      <div className="text-lg mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Quiz List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Quizzes */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center space-x-2">
                <Star className="w-6 h-6 text-accent" />
                <span>Featured Quizzes</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {quizzes.filter(quiz => quiz.featured).map((quiz) => (
                  <Card key={quiz.id} className={`card-interactive ${quiz.isMegaQuiz ? 'border-accent shadow-glow' : ''}`}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {quiz.isMegaQuiz && <Crown className="w-4 h-4 text-accent" />}
                              <h3 className="text-lg font-semibold">{quiz.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                          </div>
                        </div>

                        {/* Quiz Info */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                          <Badge variant="secondary">{quiz.category}</Badge>
                          {quiz.isMegaQuiz && (
                            <Badge className="bg-gradient-energy">Mega Quiz</Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                              <Brain className="w-4 h-4" />
                              <span>{quiz.questions}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{quiz.timeLimit}m</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Time Limit</div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{quiz.participants}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Participants</div>
                          </div>
                        </div>

                        {/* Prize */}
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Gift className="w-4 h-4 text-accent" />
                            <span className="font-medium text-sm">Prize</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{quiz.prize}</p>
                        </div>

                        {/* Action */}
                        <Button 
                          className="w-full" 
                          variant={quiz.isMegaQuiz ? "hero" : "default"}
                          onClick={() => handleStartQuiz(quiz.title)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz ({quiz.points} points)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Quizzes */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center space-x-2">
                <Code2 className="w-6 h-6 text-primary" />
                <span>All Quizzes</span>
              </h2>
              
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            {quiz.isMegaQuiz && <Crown className="w-4 h-4 text-accent" />}
                            <h3 className="text-lg font-semibold">{quiz.title}</h3>
                            {quiz.featured && <Star className="w-4 h-4 text-accent fill-accent" />}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{quiz.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Brain className="w-4 h-4" />
                              <span>{quiz.questions} questions</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{quiz.timeLimit} minutes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{quiz.participants} participants</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                              {quiz.difficulty}
                            </Badge>
                            <Badge variant="secondary">{quiz.category}</Badge>
                            {quiz.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{quiz.points}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                          <Button onClick={() => handleStartQuiz(quiz.title)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quiz Tips */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span>Quiz Tips & Tricks</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Read questions carefully before answering</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Use process of elimination for multiple choice</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Time management is crucial for high scores</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Review study materials before attempting</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Practice regularly to maintain your streak</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Join weekly mega quizzes for bigger prizes</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;