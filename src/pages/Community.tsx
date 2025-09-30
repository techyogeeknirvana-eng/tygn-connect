import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Star,
  Pin,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with actual database
  const boards = [
    { id: "all", name: "All Discussions", count: 1247, color: "primary" },
    { id: "dsa", name: "Data Structures & Algorithms", count: 342, color: "secondary" },
    { id: "web-dev", name: "Web Development", count: 298, color: "accent" },
    { id: "projects", name: "Project Showcase", count: 156, color: "primary" },
    { id: "placements", name: "Placements & Careers", count: 189, color: "secondary" },
    { id: "general", name: "General Discussion", count: 234, color: "accent" },
    { id: "help", name: "Help & Support", count: 89, color: "primary" },
  ];

  const posts = [
    {
      id: 1,
      title: "How to optimize this recursive solution for maximum subarray?",
      board: "dsa",
      boardName: "DSA",
      author: "Arjun Kumar",
      authorAvatar: "AK",
      createdAt: "2024-01-12T10:30:00",
      upvotes: 23,
      answers: 8,
      views: 156,
      tags: ["Dynamic Programming", "Arrays", "Optimization"],
      isPinned: false,
      hasAcceptedAnswer: true,
      excerpt: "I'm working on the maximum subarray problem and my recursive solution is timing out on large inputs. Can someone help me optimize this?",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "🚀 Built a real-time chat app with Socket.io and React!",
      board: "projects",
      boardName: "Projects",
      author: "Priya Sharma",
      authorAvatar: "PS",
      createdAt: "2024-01-12T09:15:00",
      upvotes: 45,
      answers: 12,
      views: 289,
      tags: ["React", "Socket.io", "Real-time", "Node.js"],
      isPinned: false,
      hasAcceptedAnswer: false,
      excerpt: "Just finished my first real-time application! It supports group chats, file sharing, and emoji reactions. Would love your feedback!",
      difficulty: "Advanced"
    },
    {
      id: 3,
      title: "📌 TYGN Weekly Contest #47 - Discussion Thread",
      board: "general",
      boardName: "General",
      author: "TYGN Team",
      authorAvatar: "TT",
      createdAt: "2024-01-11T18:00:00",
      upvotes: 67,
      answers: 34,
      views: 892,
      tags: ["Contest", "Weekly", "Discussion"],
      isPinned: true,
      hasAcceptedAnswer: false,
      excerpt: "Discuss solutions, share approaches, and connect with fellow participants. How did you solve problem C?",
      difficulty: "All Levels"
    },
    {
      id: 4,
      title: "Need advice on choosing between multiple job offers",
      board: "placements",
      boardName: "Placements",
      author: "Rahul Verma",
      authorAvatar: "RV",
      createdAt: "2024-01-11T14:22:00",
      upvotes: 18,
      answers: 15,
      views: 234,
      tags: ["Career Advice", "Job Offers", "Decision Making"],
      isPinned: false,
      hasAcceptedAnswer: true,
      excerpt: "I have offers from Microsoft, Google, and a promising startup. How do I evaluate and choose the best option for my career?",
      difficulty: "Career"
    },
    {
      id: 5,
      title: "Understanding React useEffect cleanup functions",
      board: "web-dev",
      boardName: "Web Dev",
      author: "Sneha Patel",
      authorAvatar: "SP",
      createdAt: "2024-01-11T11:45:00",
      upvotes: 31,
      answers: 6,
      views: 178,
      tags: ["React", "Hooks", "useEffect", "JavaScript"],
      isPinned: false,
      hasAcceptedAnswer: true,
      excerpt: "When exactly are useEffect cleanup functions called? I'm seeing some memory leaks in my component and suspect it's related to cleanup.",
      difficulty: "Intermediate"
    }
  ];

  const mentors = [
    { name: "Arjun Kumar", expertise: "System Design, Backend", avatar: "AK", rating: 4.9, sessions: 156 },
    { name: "Priya Sharma", expertise: "Frontend, React", avatar: "PS", rating: 4.8, sessions: 134 },
    { name: "Rahul Verma", expertise: "DSA, Competitive Programming", avatar: "RV", rating: 4.9, sessions: 198 },
    { name: "Sneha Patel", expertise: "Machine Learning, AI", avatar: "SP", rating: 4.7, sessions: 89 },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesBoard = selectedBoard === "all" || post.board === selectedBoard;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBoard && matchesSearch;
  });

  const handlePostQuestion = () => {
    toast({
      title: "Question Posted!",
      description: "Your question has been posted to the community.",
    });
  };

  const handleUpvote = (postTitle: string) => {
    toast({
      title: "Upvoted!",
      description: `Upvoted "${postTitle}"`,
    });
  };

  const getTimeDifference = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-heading font-bold">Community Forum</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Connect with fellow coders, ask questions, share projects, and learn together. Get help from mentors and contribute to the community's growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Boards & Mentors */}
          <div className="lg:col-span-1 space-y-6">
            {/* Discussion Boards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Discussion Boards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => setSelectedBoard(board.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedBoard === board.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-muted hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{board.name}</div>
                        <div className="text-xs text-neutral-400">{board.count} posts</div>
                      </div>
                      {selectedBoard === board.id && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Mentors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span>Featured Mentors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentors.map((mentor) => (
                  <div key={mentor.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {mentor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{mentor.name}</p>
                      <p className="text-xs  truncate">{mentor.expertise}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-neutral-400 text-neutral-400" />
                          <span>{mentor.rating}</span>
                        </div>
                        <span >•</span>
                        <span >{mentor.sessions} sessions</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Mentors
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12.5K</div>
                  <div className="text-xs text-muted-foreground">Active Members</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-secondary">1.2K</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div>
                    <div className="font-bold text-accent">3.4K</div>
                    <div className="text-xs text-muted-foreground">Answers</div>
                  </div>
                  <div>
                    <div className="font-bold text-primary">892</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="font-bold text-secondary">156</div>
                    <div className="text-xs text-muted-foreground">Mentors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions" className="text-neutral-300">Discussions</TabsTrigger>
                <TabsTrigger value="ask" className="text-neutral-300">Ask Question</TabsTrigger>
                <TabsTrigger value="blog" className="text-neutral-300">Blog & Stories</TabsTrigger>
              </TabsList>

              {/* Discussions */}
              <TabsContent value="discussions" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="unanswered">Unanswered</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="card-interactive">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                              {post.authorAvatar}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                {post.isPinned && <Pin className="w-4 h-4 text-accent" />}
                                <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                                  {post.title}
                                </h3>
                                {post.hasAcceptedAnswer && (
                                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>by {post.author}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="outline" className="text-xs">{post.boardName}</Badge>
                                </div>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{getTimeDifference(post.createdAt)}</span>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground">{post.excerpt}</p>

                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <button 
                                className="flex items-center space-x-1 hover:text-primary transition-colors"
                                onClick={() => handleUpvote(post.title)}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.upvotes}</span>
                              </button>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.answers} answers</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{post.views} views</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Discussion
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Ask Question */}
              <TabsContent value="ask" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Ask the Community</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="question-board">Select Board *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose appropriate board" />
                          </SelectTrigger>
                          <SelectContent>
                            {boards.slice(1).map((board) => (
                              <SelectItem key={board.id} value={board.id}>
                                {board.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="question-title">Question Title *</Label>
                        <Input 
                          id="question-title" 
                          placeholder="Be specific and descriptive" 
                        />
                      </div>

                      <div>
                        <Label htmlFor="question-description">Detailed Description *</Label>
                        <Textarea 
                          id="question-description" 
                          placeholder="Provide context, what you've tried, expected vs actual results..."
                          className="min-h-[150px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="question-tags">Tags (comma-separated)</Label>
                        <Input 
                          id="question-tags" 
                          placeholder="e.g. react, javascript, api, debugging" 
                        />
                      </div>

                      <div>
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <span>Tips for Great Questions</span>
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Be specific about the problem you're facing</li>
                        <li>• Include relevant code snippets or error messages</li>
                        <li>• Mention what you've already tried</li>
                        <li>• Use appropriate tags to reach the right audience</li>
                      </ul>
                    </div>

                    <Button onClick={handlePostQuestion} className="w-full" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Question
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blog & Stories */}
              <TabsContent value="blog" className="space-y-6">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Blog & Success Stories</h3>
                  <p className="text-muted-foreground mb-6">
                    Share your coding journey, project experiences, and success stories with the community.
                  </p>
                  <Button size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Write a Blog Post
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;