'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  FileCheck, Upload, Target, CheckCircle, XCircle, Lightbulb,
  Sparkles, Loader2, AlertTriangle, Code2,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - vite worker import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

interface Analysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  formattingIssues: string[];
  grammarIssues?: string[];
  weakBullets?: string[];
  technicalSkills: string[];
  scoreBreakdown: { keywords: number; formatting: number; impact: number; clarity: number };
}

const ResumeChecker = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 10MB.', variant: 'destructive' });
      return;
    }
    setParsing(true);
    setFileName(file.name);
    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const buf = await file.arrayBuffer();
        const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((it: any) => it.str).join(' ') + '\n';
        }
      } else if (file.name.endsWith('.docx')) {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        text = result.value;
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        toast({ title: 'Unsupported file', description: 'Use PDF, DOCX, or TXT.', variant: 'destructive' });
        setParsing(false);
        return;
      }
      setResumeText(text.trim());
      toast({ title: 'Resume parsed', description: `${text.length} characters extracted.` });
    } catch (err: any) {
      toast({ title: 'Parsing failed', description: err.message, variant: 'destructive' });
    } finally {
      setParsing(false);
    }
  };

  const analyze = async () => {
    if (!resumeText.trim() || resumeText.length < 100) {
      toast({ title: 'Resume too short', description: 'Upload or paste a fuller resume.', variant: 'destructive' });
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText, jobDesc },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis(data as Analysis);
      toast({ title: 'Analysis complete', description: `Score: ${(data as Analysis).atsScore}/100` });
    } catch (err: any) {
      toast({ title: 'Analysis failed', description: err.message, variant: 'destructive' });
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? 'from-emerald-400 to-teal-400' : s >= 60 ? 'from-amber-400 to-orange-500' : 'from-rose-500 to-red-500';

  return (
    <div className="min-h-screen bg-[#05060f] text-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div className="relative container mx-auto px-4 py-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-4">
            <Sparkles className="w-4 h-4 text-violet-300" />
            <span className="text-xs uppercase tracking-[0.25em] text-violet-200">AI Resume Analyzer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            Your Resume, ATS-Ready
          </h1>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Smart parsing + Lovable AI grading for keywords, formatting, impact and clarity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5 text-violet-300" /> Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-violet-400/60 hover:bg-white/5 transition-colors">
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFile} className="hidden" />
                  {parsing ? (
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-violet-300" />
                  ) : (
                    <>
                      <FileCheck className="w-8 h-8 mx-auto text-white/40 mb-2" />
                      <p className="text-sm text-white/70">
                        {fileName || 'Drop or choose a PDF / DOCX / TXT (max 10MB)'}
                      </p>
                    </>
                  )}
                </label>
                {resumeText && (
                  <p className="mt-3 text-xs text-emerald-300">✓ {resumeText.length} chars loaded</p>
                )}
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-cyan-300" /> Job Description (optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={6}
                  placeholder="Paste a job description for tailored keyword analysis…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                />
              </CardContent>
            </GlassCard>

            <Button
              onClick={analyze}
              disabled={analyzing || parsing || !resumeText}
              className="relative w-full h-12 rounded-md font-semibold overflow-hidden group disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />
              <span className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-400 blur-xl opacity-50 group-hover:opacity-90 transition-opacity" />
              <span className="relative flex items-center justify-center">
                {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing with AI…</>
                  : <><Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis</>}
              </span>
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} className="space-y-6"
                >
                  {/* Score */}
                  <GlassCard>
                    <CardContent className="pt-6 text-center">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">ATS Score</p>
                      <div className={`text-7xl font-extrabold bg-gradient-to-br ${scoreColor(analysis.atsScore)} bg-clip-text text-transparent`}>
                        {analysis.atsScore}
                      </div>
                      <Progress value={analysis.atsScore} className="mt-4 h-2 bg-white/10" />
                      <p className="mt-3 text-sm text-white/70 max-w-md mx-auto">{analysis.summary}</p>
                    </CardContent>
                  </GlassCard>

                  {/* Breakdown */}
                  <GlassCard>
                    <CardHeader><CardTitle className="text-white text-base">Score Breakdown</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(analysis.scoreBreakdown).map(([k, v]) => (
                        <div key={k}>
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span className="capitalize">{k}</span><span>{v}/100</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${v}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full bg-gradient-to-r ${scoreColor(v)}`}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </GlassCard>

                  <ListCard title="Strengths" icon={<CheckCircle className="w-4 h-4" />} accent="text-emerald-300" items={analysis.strengths} />
                  <ListCard title="Improvements" icon={<Lightbulb className="w-4 h-4" />} accent="text-amber-300" items={analysis.improvements} />

                  {analysis.missingKeywords?.length > 0 && (
                    <GlassCard>
                      <CardHeader><CardTitle className="flex items-center gap-2 text-rose-300 text-base"><XCircle className="w-4 h-4" /> Missing Keywords</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((k, i) => (
                          <Badge key={i} className="bg-rose-500/10 border border-rose-500/30 text-rose-200">{k}</Badge>
                        ))}
                      </CardContent>
                    </GlassCard>
                  )}

                  {analysis.matchedKeywords?.length > 0 && (
                    <GlassCard>
                      <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-300 text-base"><CheckCircle className="w-4 h-4" /> Matched Keywords</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {analysis.matchedKeywords.slice(0, 30).map((k, i) => (
                          <Badge key={i} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">{k}</Badge>
                        ))}
                      </CardContent>
                    </GlassCard>
                  )}

                  {analysis.technicalSkills?.length > 0 && (
                    <GlassCard>
                      <CardHeader><CardTitle className="flex items-center gap-2 text-violet-200 text-base"><Code2 className="w-4 h-4" /> Detected Technical Skills</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {analysis.technicalSkills.map((k, i) => (
                          <Badge key={i} className="bg-violet-500/10 border border-violet-500/30 text-violet-200">{k}</Badge>
                        ))}
                      </CardContent>
                    </GlassCard>
                  )}

                  {analysis.formattingIssues?.length > 0 && (
                    <ListCard title="Formatting Issues" icon={<AlertTriangle className="w-4 h-4" />} accent="text-orange-300" items={analysis.formattingIssues} />
                  )}
                  {analysis.weakBullets && analysis.weakBullets.length > 0 && (
                    <ListCard title="Weak Bullet Points" icon={<AlertTriangle className="w-4 h-4" />} accent="text-yellow-300" items={analysis.weakBullets} />
                  )}
                  {analysis.grammarIssues && analysis.grammarIssues.length > 0 && (
                    <ListCard title="Grammar Notes" icon={<AlertTriangle className="w-4 h-4" />} accent="text-pink-300" items={analysis.grammarIssues} />
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GlassCard>
                    <CardContent className="text-center py-20">
                      <FileCheck className="w-16 h-16 mx-auto text-white/20 mb-4" />
                      <h3 className="text-xl font-bold text-white">Ready to analyze</h3>
                      <p className="text-white/50 mt-2 text-sm">Upload your resume, optionally paste a JD, and let AI grade it.</p>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlassCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="border-white/10 bg-white/[0.04] backdrop-blur-md">{children}</Card>
);

const ListCard = ({ title, icon, accent, items }: { title: string; icon: React.ReactNode; accent: string; items: string[] }) => (
  <GlassCard>
    <CardHeader>
      <CardTitle className={`flex items-center gap-2 ${accent} text-base`}>{icon} {title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm text-white/80">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${accent.replace('text-', 'bg-')}`} />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </GlassCard>
);

export default ResumeChecker;
