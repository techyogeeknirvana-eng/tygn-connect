import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm TYGN Bot 🤖 I can help you find notes, events, hackathons, job openings, and answer your coding questions. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickActions = [
    "Find notes for Sem 3",
    "Upcoming events",
    "Latest job openings",
    "DSA practice questions",
    "Project ideas",
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("notes") || input.includes("study")) {
      return "📚 Great! Here are some study resources:\n\n• Check our Drive Notes: [Open Drive](https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA)\n• Browse notes by semester in the Notes section\n• Upload your own notes to help the community!\n\nWhich semester or subject are you looking for?";
    }
    
    if (input.includes("event") || input.includes("hackathon")) {
      return "🎉 Awesome! Here's what's happening:\n\n• Check the Events page for upcoming hackathons\n• Submit your own events for approval\n• Set reminders for events you're interested in\n\nWant me to show you the latest events?";
    }
    
    if (input.includes("job") || input.includes("internship")) {
      return "💼 Looking for opportunities? Perfect!\n\n• Browse the Jobs section for latest openings\n• Filter by location, role type, and company\n• Submit job postings to help fellow coders\n\nWhat type of role are you interested in?";
    }
    
    if (input.includes("quiz") || input.includes("challenge")) {
      return "🧠 Ready to test your skills?\n\n• Try our coding quizzes for prizes\n• Weekly mega quizzes with special rewards\n• Earn points and badges for your profile\n\nHead to the Quizzes section to get started!";
    }
    
    if (input.includes("project") || input.includes("idea")) {
      return "💡 Looking for project inspiration?\n\n• Web development: Build a task manager with React\n• Mobile: Create a habit tracker app\n• AI/ML: Sentiment analysis tool\n• Backend: RESTful API with authentication\n\nNeed specific guidance for any of these?";
    }
    
    if (input.includes("help") || input.includes("community")) {
      return "🤝 The TYGN community is here for you!\n\n• Ask questions in our Community forum\n• Connect with mentors and peers\n• Share your success stories\n• Collaborate on projects\n\nWhat specific help do you need?";
    }
    
    return "Thanks for your message! 🚀 I'm still learning, but here's how I can help:\n\n📚 Find study notes and resources\n🎉 Discover events and hackathons\n💼 Explore job opportunities\n🧠 Suggest coding challenges\n💡 Share project ideas\n\nTry asking about any of these topics!";
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "scale-0" : "scale-100"
        } bg-gradient-primary hover:shadow-glow z-40`}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">TYGN Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isBot ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSendMessage(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(inputValue);
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                size="sm"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;