import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Mic, MicOff, Send, Sparkles, Play, RotateCcw, Trophy, TrendingUp,
  Target, Brain, MessageSquare, Zap, ChevronRight, Volume2, VolumeX, Loader2,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "dsa" | "hr" | "system_design" | "behavioral";
type Difficulty = "easy" | "medium" | "hard";

interface Report {
  overallScore: number;
  verdict: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
  scoreBreakdown: { technical: number; communication: number; problemSolving: number; confidence: number };
  questionReviews: { question: string; answerRating: number; idealAnswer?: string; feedback: string }[];
}

const MODES: { id: Mode; label: string; Icon: any; desc: string }[] = [
  { id: "dsa", label: "DSA / Coding", Icon: Brain, desc: "LeetCode-style problems with hints" },
  { id: "system_design", label: "System Design", Icon: Target, desc: "Scale, tradeoffs, architecture" },
  { id: "hr", label: "HR Round", Icon: MessageSquare, desc: "Motivation & culture fit" },
  { id: "behavioral", label: "Behavioral", Icon: Zap, desc: "STAR stories & leadership" },
];

const COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Uber", "Flipkart", "Razorpay", "Zomato", "Startup"];

export default function InterviewSimulator() {
  const [stage, setStage] = useState<"setup" | "live" | "report">("setup");
  const [mode, setMode] = useState<Mode>("dsa");
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOut, setVoiceOut] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (stage === "live") {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [stage]);

  const speak = (text: string) => {
    if (!voiceOut || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  };

  const startInterview = async () => {
    setStage("live");
    setElapsed(0);
    setMessages([]);
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-simulator", {
        body: { action: "chat", mode, company, role, difficulty, questionCount, messages: [{ role: "user", content: "Please begin the interview with a brief intro and your first question." }] },
      });
      if (error) throw error;
      const reply = data.reply;
      setMessages([{ role: "assistant", content: reply }]);
      speak(reply);
    } catch (e: any) {
      toast.error(e.message || "Failed to start interview");
      setStage("setup");
    } finally {
      setSending(false);
    }
  };

  const sendAnswer = async () => {
    if (!input.trim() || sending) return;
    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-simulator", {
        body: { action: "chat", mode, company, role, difficulty, questionCount, messages: next },
      });
      if (error) throw error;
      setMessages([...next, { role: "assistant", content: data.reply }]);
      speak(data.reply);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  const toggleMic = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return toast.error("Speech recognition not supported in this browser");
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        final += e.results[i][0].transcript;
      }
      setInput((prev) => (prev + " " + final).trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  };

  const endAndGetReport = async () => {
    if (messages.length < 2) return toast.error("Answer at least one question first");
    setGeneratingReport(true);
    window.speechSynthesis?.cancel();
    try {
      const { data, error } = await supabase.functions.invoke("interview-simulator", {
        body: { action: "report", mode, company, role, difficulty, messages },
      });
      if (error) throw error;
      setReport(data);
      setStage("report");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const reset = () => {
    setStage("setup");
    setMessages([]);
    setReport(null);
    setElapsed(0);
    window.speechSynthesis?.cancel();
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  // ==================== SETUP ====================
  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Sparkles className="w-3 h-3 mr-1" /> AI-Powered · Voice-enabled</Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent">
              AI Interview Simulator
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Live mock interviews with a senior AI interviewer. Voice or text. Get a real scorecard, verdict, and personalized action plan at the end.
            </p>
          </motion.div>

          <Card className="p-6 md:p-8 border-primary/10">
            <label className="text-sm font-semibold mb-3 block">1. Pick your round</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    mode === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <m.Icon className={`w-5 h-5 mb-2 ${mode === m.id ? "text-primary" : ""}`} />
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Target company</label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COMPANIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy · Intern</SelectItem>
                    <SelectItem value="medium">Medium · SDE-1</SelectItem>
                    <SelectItem value="hard">Hard · Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm font-semibold mb-2 block">Questions: {questionCount}</label>
              <input type="range" min={3} max={10} value={questionCount} onChange={(e) => setQuestionCount(+e.target.value)} className="w-full accent-primary" />
            </div>

            <Button onClick={startInterview} disabled={sending} size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:opacity-90">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Start Interview
            </Button>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { Icon: Mic, title: "Speak or type", desc: "Real-time voice recognition" },
              { Icon: Volume2, title: "Interviewer speaks back", desc: "Feels like a real Zoom round" },
              { Icon: Trophy, title: "Full scorecard", desc: "Verdict, ratings, action plan" },
            ].map((f) => (
              <div key={f.title} className="p-4 rounded-lg border border-border/50 bg-card/30">
                <f.Icon className="w-5 h-5 text-primary mb-2" />
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==================== REPORT ====================
  if (stage === "report" && report) {
    const verdictColor: Record<string, string> = {
      strong_hire: "bg-green-500/20 text-green-400 border-green-500/30",
      hire: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      lean_hire: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      no_hire: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      strong_no_hire: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-background to-primary/5">
        <div className="mx-auto max-w-4xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <Badge className={verdictColor[report.verdict]}>{report.verdict.replace(/_/g, " ").toUpperCase()}</Badge>
                  <h2 className="text-3xl font-bold mt-2 font-heading">Scorecard</h2>
                  <p className="text-sm text-muted-foreground">{company} · {role} · {mode.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">{report.overallScore}</div>
                  <div className="text-xs text-muted-foreground">OVERALL / 100</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{report.summary}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Object.entries(report.scoreBreakdown).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1"><span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span><span className="font-mono">{v}</span></div>
                    <Progress value={v} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3 text-green-500"><TrendingUp className="w-4 h-4" /><h3 className="font-semibold">Strengths</h3></div>
              <ul className="space-y-2 text-sm">{report.strengths.map((s, i) => <li key={i} className="flex gap-2"><ChevronRight className="w-3 h-3 mt-1 shrink-0 text-green-500" />{s}</li>)}</ul>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3 text-orange-500"><Target className="w-4 h-4" /><h3 className="font-semibold">Weaknesses</h3></div>
              <ul className="space-y-2 text-sm">{report.weaknesses.map((s, i) => <li key={i} className="flex gap-2"><ChevronRight className="w-3 h-3 mt-1 shrink-0 text-orange-500" />{s}</li>)}</ul>
            </Card>
          </div>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-primary" /><h3 className="font-semibold">Your 7-day action plan</h3></div>
            <ol className="space-y-2 text-sm">{report.actionPlan.map((s, i) => <li key={i} className="flex gap-3"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">{i + 1}</span>{s}</li>)}</ol>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-4">Question-by-question review</h3>
            <div className="space-y-4">
              {report.questionReviews.map((q, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex justify-between gap-4 mb-1">
                    <div className="text-sm font-medium">{q.question}</div>
                    <Badge variant="outline">{q.answerRating}/10</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{q.feedback}</p>
                  {q.idealAnswer && <details className="text-xs mt-2"><summary className="cursor-pointer text-primary">Show ideal answer</summary><p className="mt-2 text-foreground/70">{q.idealAnswer}</p></details>}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1"><RotateCcw className="w-4 h-4 mr-2" />Try another round</Button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIVE ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex flex-col">
      <div className="border-b border-border/50 backdrop-blur bg-card/50 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-red-500" /></span>
              <span className="font-semibold text-sm">LIVE · {company}</span>
              <Badge variant="outline" className="text-xs">{mode.toUpperCase()}</Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono">{mm}:{ss}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setVoiceOut((v) => !v)}>{voiceOut ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</Button>
            <Button size="sm" variant="outline" onClick={endAndGetReport} disabled={generatingReport}>
              {generatingReport ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Scoring…</> : <><Trophy className="w-3 h-3 mr-1" />End & Score</>}
            </Button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50"
                }`}>
                  {m.role === "assistant" && <div className="text-[10px] uppercase tracking-wider text-primary mb-1 font-bold">Interviewer</div>}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {sending && <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" /><span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.15s]" /><span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.3s]" /></div>}
        </div>
      </div>

      <div className="border-t border-border/50 bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex gap-2 items-end">
            <Button size="icon" variant={listening ? "default" : "outline"} onClick={toggleMic} className={listening ? "animate-pulse bg-red-500 hover:bg-red-600" : ""}>
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
              placeholder={listening ? "Listening… speak now" : "Type your answer or use the mic"}
              className="min-h-[52px] max-h-40 resize-none"
              disabled={sending}
            />
            <Button size="icon" onClick={sendAnswer} disabled={sending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
