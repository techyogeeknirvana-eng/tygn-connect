'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Upload, Target, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ResumeChecker = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 700, 
      easing: 'ease-out-quart' 
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a TXT, PDF, or Word document.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // For plain text files
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setResumeText(text);
          toast({
            title: "Resume Uploaded!",
            description: "Resume text extracted successfully."
          });
          setIsAnalyzing(false);
        };
        reader.readAsText(file);
      } else {
        // For PDF and Word files - show message
        toast({
          title: "File uploaded",
          description: "PDF/Word parsing available! Please paste text manually or use TXT for now.",
        });
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process the file. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
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
    if (score >= 60) return 'text-tygn-yellow';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS systems.';
    if (score >= 60) return 'Good! Your resume has decent ATS compatibility with room for improvement.';
    return 'Needs improvement. Consider adding more relevant keywords from the job description.';
  };

  return (
    <div className="min-h-screen bg-tygn-bg">
      {/* <Header /> */}
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="inline-flex items-center space-x-2 bg-tygn-blue/10 text-tygn-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileCheck className="w-4 h-4" />
              <span className="uppercase tracking-wide">ATS Resume Checker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-tygn-blue uppercase tracking-wide mb-4">
              Optimize Your Resume for ATS Systems
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get instant feedback on how well your resume matches job descriptions and improve your chances of passing through ATS filters.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-tygn-blue uppercase tracking-wide">
                    <Upload className="w-5 h-5" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your resume as TXT, PDF, or Word document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="resume-upload">Choose File</Label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".txt,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="block w-full mt-2 text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-tygn-yellow file:text-tygn-blue hover:file:bg-tygn-yellow/90 file:cursor-pointer border border-gray-200 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supports TXT, PDF, and Word documents (max 5MB)
                      </p>
                    </div>
                    
                    {resumeText && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-aos="fade-in">
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

              <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-tygn-blue uppercase tracking-wide">
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
                className="w-full bg-tygn-yellow text-tygn-blue hover:bg-tygn-yellow/90 font-bold uppercase tracking-wide py-4"
                size="lg"
                data-aos="fade-up" 
                data-aos-delay="400"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-tygn-blue border-t-transparent mr-2" />
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
                  <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="500">
                    <CardHeader>
                      <CardTitle className="text-center text-tygn-blue uppercase tracking-wide">ATS Compatibility Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <Progress value={score} className="w-full h-4" />
                      <p className="text-sm text-gray-600">
                        {getScoreMessage(score)}
                      </p>
                    </CardContent>
                  </Card>

                  {matchedKeywords.length > 0 && (
                    <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 uppercase tracking-wide">
                          <CheckCircle className="w-5 h-5" />
                          Matched Keywords ({matchedKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {matchedKeywords.slice(0, 20).map((keyword, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 transition-colors">
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
                    <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 uppercase tracking-wide">
                          <XCircle className="w-5 h-5" />
                          Missing Keywords ({missingKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {missingKeywords.slice(0, 15).map((keyword, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 transition-colors">
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

                  <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-tygn-blue uppercase tracking-wide">
                        <Lightbulb className="w-5 h-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                          <span>Include more keywords from the job description naturally in your experience section</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                          <span>Use exact phrases from the job posting when describing your skills</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                          <span>Consider adding a skills section with relevant technical keywords</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                          <span>Ensure your resume is in a simple, ATS-friendly format</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="500">
                  <CardContent className="text-center py-16">
                    <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-tygn-blue mb-2 uppercase tracking-wide">Ready to Analyze</h3>
                    <p className="text-gray-600">
                      Upload your resume and paste a job description to get started with the ATS analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResumeChecker;