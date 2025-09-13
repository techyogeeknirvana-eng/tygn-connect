import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileCheck, Upload, Target, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeChecker = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        title: "File Type Not Supported",
        description: "Please upload a .txt file. PDF/DOCX support coming soon!",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text);
      toast({
        title: "Resume Uploaded!",
        description: "Your resume has been successfully loaded."
      });
    };
    reader.readAsText(file);
  };

  const analyzeResume = () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload your resume and paste a job description.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simple keyword extraction and matching
    setTimeout(() => {
      const jdWords = jobDesc
        .toLowerCase()
        .match(/\b\w+\b/g)
        ?.filter((w) => w.length > 3) || [];

      const uniqueJDWords = Array.from(new Set(jdWords));
      const resumeLower = resumeText.toLowerCase();

      const found = uniqueJDWords.filter((word) => resumeLower.includes(word));
      const missing = uniqueJDWords.filter((word) => !resumeLower.includes(word));

      const atsScore = Math.round((found.length / uniqueJDWords.length) * 100);

      setScore(atsScore);
      setMatchedKeywords(found);
      setMissingKeywords(missing);
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete!",
        description: `Your ATS score is ${atsScore}%`
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS systems.';
    if (score >= 60) return 'Good! Your resume has decent ATS compatibility with room for improvement.';
    return 'Needs improvement. Consider adding more relevant keywords from the job description.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-orange-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileCheck className="w-4 h-4" />
              <span>ATS Resume Checker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Optimize Your Resume for <span className="text-primary">ATS Systems</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant feedback on how well your resume matches job descriptions and improve your chances of passing through ATS filters.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Upload a text file (.txt) of your resume content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="resume-upload">Choose File</Label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="block w-full mt-2 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer border border-input rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Currently supports .txt files. PDF/DOCX support coming soon!
                      </p>
                    </div>
                    
                    {resumeText && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Resume loaded successfully!</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          {resumeText.length} characters loaded
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the job description you're targeting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    rows={8}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Button 
                onClick={analyzeResume}
                disabled={isAnalyzing || !resumeText || !jobDesc}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {score !== null ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">ATS Compatibility Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <Progress value={score} className="w-full h-3" />
                      <p className="text-sm text-muted-foreground">
                        {getScoreMessage(score)}
                      </p>
                    </CardContent>
                  </Card>

                  {matchedKeywords.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          Matched Keywords ({matchedKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {matchedKeywords.slice(0, 20).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                              {keyword}
                            </Badge>
                          ))}
                          {matchedKeywords.length > 20 && (
                            <Badge variant="outline">
                              +{matchedKeywords.length - 20} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {missingKeywords.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-5 h-5" />
                          Missing Keywords ({missingKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {missingKeywords.slice(0, 15).map((keyword, index) => (
                            <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                              {keyword}
                            </Badge>
                          ))}
                          {missingKeywords.length > 15 && (
                            <Badge variant="outline">
                              +{missingKeywords.length - 15} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-accent">
                        <Lightbulb className="w-5 h-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>Include more keywords from the job description naturally in your experience section</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>Use exact phrases from the job posting when describing your skills</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>Consider adding a skills section with relevant technical keywords</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>Ensure your resume is in a simple, ATS-friendly format</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-muted-foreground">
                      Upload your resume and paste a job description to get started with the ATS analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeChecker;