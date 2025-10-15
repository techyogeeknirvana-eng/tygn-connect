import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  Search,
  ThumbsUp,
  MessageCircle,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AskQuestionDialog } from "@/components/CommunityQuestion";

interface Question {
  id: string;
  title: string;
  content: string;
  file_urls: string[] | null;
  created_at: string;
  views: number;
  upvotes: number;
  user_id: string;
  user_name?: string;
}

const CommunityEnhanced = () => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_questions')
        .select(`
          *,
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const { error } = await supabase
        .from('community_questions')
        .update({ upvotes: question.upvotes + 1 })
        .eq('id', questionId);

      if (error) throw error;

      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      ));

      toast({
        title: "Upvoted!",
        description: "Thanks for your feedback."
      });
    } catch (error: any) {
      console.error('Error upvoting:', error);
      toast({
        title: "Error",
        description: "Failed to upvote.",
        variant: "destructive"
      });
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeDifference = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-heading font-bold">Community Q&A</h1>
            </div>
            <p className="text-muted-foreground">
              Ask questions, share knowledge, and help fellow developers.
            </p>
          </div>
          <AskQuestionDialog onQuestionPosted={loadQuestions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="questions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions" className="text-neutral-300">
                  All Questions
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-neutral-300">
                  Trending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Questions List */}
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading questions...</p>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to ask a question!
                      </p>
                      <AskQuestionDialog onQuestionPosted={loadQuestions} />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.map((question) => (
                      <Card key={question.id} className="card-interactive">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Question Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                                  {question.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {question.content}
                                </p>
                              </div>
                            </div>

                            {/* Attachments */}
                            {question.file_urls && question.file_urls.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {question.file_urls.map((url, index) => {
                                  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                  return (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                                    >
                                      {isImage ? (
                                        <ImageIcon className="w-3 h-3" />
                                      ) : (
                                        <FileText className="w-3 h-3" />
                                      )}
                                      <span>Attachment {index + 1}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  );
                                })}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>
                                  by {question.user_name || "Anonymous"}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{getTimeDifference(question.created_at)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{question.views} views</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpvote(question.id)}
                                  className="flex items-center space-x-1"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{question.upvotes}</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending">
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Trending questions coming soon!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-secondary">
                      {questions.reduce((sum, q) => sum + q.upvotes, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Upvotes</div>
                  </div>
                  <div>
                    <div className="font-bold text-accent">
                      {questions.reduce((sum, q) => sum + q.views, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityEnhanced;
