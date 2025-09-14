import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizBuilder: React.FC = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    topic: '',
    startAt: '',
    endAt: '',
    timeLimit: 30
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!quizData.title || !quizData.topic) {
      toast.error('Please fill in quiz title and topic');
      return;
    }

    if (questions.some(q => !q.question || q.options.some(opt => !opt))) {
      toast.error('Please complete all questions and options');
      return;
    }

    try {
      // Temporarily store quiz data until tables are created
      console.log('Quiz data to save:', {
        ...quizData,
        questions,
        createdAt: new Date().toISOString()
      });

      toast.success('Quiz saved successfully (pending tables creation)');
      
      // Reset form
      setQuizData({
        title: '',
        description: '',
        topic: '',
        startAt: '',
        endAt: '',
        timeLimit: 30
      });
      setQuestions([{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]);
    } catch (err) {
      console.error('Error saving quiz:', err);
      toast.error('Failed to save quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Quiz Builder</h1>
          <p className="text-muted-foreground">Create engaging quizzes for the community</p>
        </div>

        {/* Quiz Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic/Subject</Label>
                <Input
                  id="topic"
                  value={quizData.topic}
                  onChange={(e) => setQuizData({...quizData, topic: e.target.value})}
                  placeholder="e.g., Data Structures"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quizData.description}
                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                placeholder="Brief description of the quiz"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAt">Start Date & Time</Label>
                <Input
                  id="startAt"
                  type="datetime-local"
                  value={quizData.startAt}
                  onChange={(e) => setQuizData({...quizData, startAt: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAt">End Date & Time</Label>
                <Input
                  id="endAt"
                  type="datetime-local"
                  value={quizData.endAt}
                  onChange={(e) => setQuizData({...quizData, endAt: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({...quizData, timeLimit: parseInt(e.target.value)})}
                  min="5"
                  max="180"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Questions
              <Badge variant="outline">{questions.length} Questions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Question {qIndex + 1}
                    {questions.length > 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question here"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4 text-primary"
                        />
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1"
                        />
                        {question.correctAnswer === oIndex && (
                          <Badge variant="secondary" className="text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addQuestion}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button onClick={handleSave} size="lg" className="min-w-32">
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;