import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Trophy, 
  Users, 
  Zap, 
  Award,
  TrendingUp,
  FileText,
  Code2,
  Target,
  Sparkles
} from "lucide-react";

const Home = () => {
  const [userName] = useState("Coder"); // Will be replaced with actual auth
  const [userStats] = useState({
    points: 1250,
    badges: 8,
    streak: 15,
    rank: 42
  });

  const highlights = {
    latestNotes: [
      { title: "DSA - Trees and Graphs", semester: "3", subject: "DSA", downloads: 234 },
      { title: "Operating Systems - Process Management", semester: "4", subject: "OS", downloads: 189 },
      { title: "Database - SQL Queries", semester: "5", subject: "DBMS", downloads: 156 },
    ],
    upcomingEvents: [
      { title: "CodeChef Contest", date: "2024-01-15", organizer: "CodeChef", type: "Contest" },
      { title: "React Workshop", date: "2024-01-20", organizer: "TYGN", type: "Workshop" },
      { title: "Google DevFest", date: "2024-01-25", organizer: "GDG", type: "Conference" },
    ],
    announcements: [
      "🎉 New Quiz section launched with exciting prizes!",
      "📚 Semester 6 notes now available in Drive",
      "🏆 Monthly coding contest results are out",
      "🤝 Mentor program applications open",
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-heading font-bold">
                Welcome back, <span className="text-primary">{userName}</span>! 
                <Sparkles className="inline-block w-8 h-8 ml-2 text-accent" />
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ready to level up your coding journey? Explore notes, join events, tackle quizzes, and connect with fellow innovators.
              </p>
            </div>

            {/* User Stats */}
            <div className="flex justify-center space-x-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{userStats.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-secondary">{userStats.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-accent">{userStats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary-glow">#{userStats.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/notes">
                <Button variant="hero" size="lg" className="group">
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="lg" className="group">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Upcoming Events
                </Button>
              </Link>
              <Link to="/quizzes">
                <Button variant="energy" size="lg" className="group">
                  <Trophy className="w-5 h-5 group-hover:bounce transition-transform" />
                  Take Quiz
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" size="lg" className="group">
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Join Discussion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Latest Notes */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Latest Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.latestNotes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{note.title}</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">Sem {note.semester}</Badge>
                        <Badge variant="secondary" className="text-xs">{note.subject}</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{note.downloads}</span>
                    </div>
                  </div>
                ))}
                <Link to="/notes">
                  <Button variant="outline" className="w-full">
                    View All Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">{event.organizer}</Badge>
                        <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Link to="/events">
                  <Button variant="outline" className="w-full">
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Announcements & Achievements */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span>Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.announcements.map((announcement, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm">{announcement}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recent Achievement</span>
                    <Award className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">You earned "Quiz Master" badge!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-heading font-bold">Explore TYGN Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your coding journey, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/notes" className="group">
              <Card className="card-interactive h-full">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Study Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    Access semester-wise notes, upload your own, and help the community grow.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/events" className="group">
              <Card className="card-interactive h-full">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-success flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-semibold">Events & Hackathons</h3>
                  <p className="text-sm text-muted-foreground">
                    Participate in coding contests, workshops, and networking events.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/jobs" className="group">
              <Card className="card-interactive h-full">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-energy flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold">Job Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover internships, full-time roles, and freelance projects.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/quizzes" className="group">
              <Card className="card-interactive h-full">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Coding Quizzes</h3>
                  <p className="text-sm text-muted-foreground">
                    Test your skills, earn points, and win exciting prizes.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-heading font-bold">Ready to Code Your Future?</h2>
            <p className="text-muted-foreground">
              Join thousands of students who are already building their careers with TYGN. Share knowledge, grow together, and achieve your coding dreams.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog', '_blank')}
              >
                <Target className="w-5 h-5" />
                Give Feedback
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.open('https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing', '_blank')}
              >
                <Code2 className="w-5 h-5" />
                Access Drive
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;