import { useEffect, useState } from "react";

const StartupAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "✨ Booting up TechYogeek Nirvana…",
    "🐣 Waking up sleepy servers…",
    "🎒 Packing your digital backpack…",
    "📚 Stacking notes, quizzes & dreams…",
    "🎉 Sprinkling some community magic…",
    "🧁 Baking fresh ideas in the cloud oven…",
    "🛠️ Tightening bolts on the anti-cheat armor…",
    "🎭 Polishing your reaction stickers to sparkle…",
    "📸 Fluffing image pillows and document drawers…",
    "🧠 Syncing brilliance across campuses…",
    "🌈 Ready to shine? Let's build something unforgettable 💫"
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="max-w-2xl w-full px-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="animate-pulse">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
            TechYogeek Nirvana
          </h1>

          {/* Steps */}
          <div className="space-y-2 min-h-[300px]">
            {steps.slice(0, currentStep + 1).map((step, index) => (
              <div
                key={index}
                className={`text-left p-3 rounded-lg transition-all duration-300 ${
                  index === currentStep
                    ? "bg-primary/10 text-foreground animate-fade-in scale-105"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation;
