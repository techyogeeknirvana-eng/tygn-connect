import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface Post {
  id: string; user_id: string; author_name: string;
  title: string; content: string; board: string | null;
  created_at: string;
}
interface Comment {
  id: string; post_id: string; user_id: string;
  author_name: string; content: string; created_at: string;
}

const Community = () => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  const authorName = userProfile?.full_name || user?.email?.split("@")[0] || "Anonymous";

  const loadPosts = async () => {
    const { data } = await supabase
      .from("community_posts").select("*").order("created_at", { ascending: false }).limit(100);
    setPosts((data as Post[]) || []);
  };
  const loadComments = async () => {
    const { data } = await supabase
      .from("community_comments").select("*").order("created_at", { ascending: true });
    const grouped: Record<string, Comment[]> = {};
    (data as Comment[] | null || []).forEach((c) => {
      (grouped[c.post_id] ||= []).push(c);
    });
    setCommentsByPost(grouped);
  };

  useEffect(() => {
    loadPosts();
    loadComments();

    const channel = supabase
      .channel("community-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => loadPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_comments" }, () => loadComments())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createPost = async () => {
    if (!user) return toast({ title: "Login required", variant: "destructive" });
    if (!newPost.title.trim() || !newPost.content.trim()) return toast({ title: "Title & content required", variant: "destructive" });
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id, author_name: authorName,
      title: newPost.title.trim(), content: newPost.content.trim(), board: "general",
    });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewPost({ title: "", content: "" });
    toast({ title: "Posted!" });
  };

  const addComment = async (postId: string) => {
    const text = (newComment[postId] || "").trim();
    if (!user) return toast({ title: "Login required", variant: "destructive" });
    if (!text) return;
    const { error } = await supabase.from("community_comments").insert({
      post_id: postId, user_id: user.id, author_name: authorName, content: text,
    });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewComment((m) => ({ ...m, [postId]: "" }));
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
  };
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("community_comments").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Community</h1>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Start a discussion</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Title</Label><Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="What's on your mind?" /></div>
            <div><Label>Content</Label><Textarea rows={3} value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} placeholder="Share your thoughts…" /></div>
            <Button onClick={createPost}><Send className="w-4 h-4 mr-2" />Post</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No posts yet. Be the first!</p>
          ) : posts.map((p) => {
            const canDelete = isAdmin || user?.id === p.user_id;
            const comments = commentsByPost[p.id] || [];
            return (
              <Card key={p.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="text-xs text-muted-foreground">by {p.author_name} • {new Date(p.created_at).toLocaleString()}</p>
                    </div>
                    {canDelete && (
                      <Button variant="ghost" size="sm" onClick={() => deletePost(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{p.content}</p>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" /> {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </div>
                    {comments.map((c) => {
                      const canDelC = isAdmin || user?.id === c.user_id;
                      return (
                        <div key={c.id} className="bg-muted/40 rounded-md p-3 text-sm">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-xs">{c.author_name} <span className="text-muted-foreground font-normal">• {new Date(c.created_at).toLocaleString()}</span></p>
                              <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
                            </div>
                            {canDelC && (
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => deleteComment(c.id)}>
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-2 pt-1">
                      <Input
                        placeholder="Write a comment…"
                        value={newComment[p.id] || ""}
                        onChange={(e) => setNewComment((m) => ({ ...m, [p.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addComment(p.id); } }}
                      />
                      <Button size="sm" onClick={() => addComment(p.id)}><Send className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Community;
