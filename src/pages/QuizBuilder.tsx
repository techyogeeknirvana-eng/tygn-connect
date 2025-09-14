import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Trash2, Save, Eye, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
        : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim() || !quizTopic.trim() || questions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all quiz details and add at least one question.",
        variant: "destructive"
      });
      return;
    }

    // Validate questions
    const invalidQuestions = questions.filter(q => 
      !q.question.trim() || 
      q.options.some(opt => !opt.trim()) ||
      q.correctAnswer < 0 || 
      q.correctAnswer >= q.options.length
    );

    if (invalidQuestions.length > 0) {
      toast({
        title: "Invalid Questions",
        description: "Please ensure all questions have content, all options are filled, and correct answers are selected.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('quizzes')
        .insert({
          title: quizTitle,
          topic: quizTopic,
          description: quizDescription,
          questions: questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer
          })),
          created_by: user?.id,
          status: 'published'
        });

      if (error) throw error;

      toast({
        title: "Quiz Created!",
        description: "Your quiz has been successfully created and published."
      });

      // Reset form
      setQuizTitle('');
      setQuizTopic('');
      setQuizDescription('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-orange-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Settings className="w-4 h-4" />
              <span>Admin Quiz Builder</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create <span className="text-primary">Interactive Quizzes</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build engaging quizzes for your community with multiple choice questions and instant feedback.
            </p>
          </div>

          {/* Quiz Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>Set up the basic details for your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title *</Label>
                  <Input
                    id="quiz-title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., JavaScript Fundamentals Quiz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-topic">Topic/Category *</Label>
                  <Select onValueChange={setQuizTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="node">Node.js</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="data-structures">Data Structures</SelectItem>
                      <SelectItem value="system-design">System Design</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description (Optional)</Label>
                <Textarea
                  id="quiz-description"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Brief description of what this quiz covers..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Questions ({questions.length})</CardTitle>
                <CardDescription>Add multiple choice questions to your quiz</CardDescription>
              </div>
              <Button onClick={addQuestion} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="w-16 h-16 mx-auto mb-4" />
                  <p>No questions added yet. Click "Add Question" to get started.</p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Question {index + 1}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Answer Options *</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                              className="text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={saveQuiz}
              disabled={isCreating || !quizTitle || !quizTopic || questions.length === 0}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-button"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creating Quiz...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save & Publish Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizBuilder;