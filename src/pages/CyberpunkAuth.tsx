import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CyberpunkAuth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [glitchText, setGlitchText] = useState('TYGN TERMINAL');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    branch: '',
    semester: 1
  });

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    const originalText = 'TYGN TERMINAL';
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const glitched = originalText
          .split('')
          .map(char => Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
          .join('');
        setGlitchText(glitched);
        
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 200);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('ACCESS GRANTED');
      } else {
        const { error } = await signUp(
          formData.email, 
          formData.password, 
          formData.fullName, 
          formData.branch, 
          formData.semester
        );
        if (error) throw error;
        toast.success('USER REGISTERED - CHECK EMAIL');
      }
    } catch (error: any) {
      toast.error(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-lines"></div>
      </div>

      {/* Scan Lines */}
      <div className="scan-lines"></div>

      {/* Main Terminal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="terminal-window max-w-md w-full">
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-btn close"></span>
              <span className="terminal-btn minimize"></span>
              <span className="terminal-btn maximize"></span>
            </div>
            <div className="terminal-title">{glitchText}</div>
          </div>

          {/* Terminal Content */}
          <div className="terminal-content">
            <div className="terminal-prompt">
              <span className="text-primary">root@tygn:</span>
              <span className="text-muted-foreground">~$</span>
              <span className="cursor">_</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="input-group">
                <label className="terminal-label">EMAIL_ADDRESS:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="terminal-input"
                  required
                />
                <div className="input-scan-line"></div>
              </div>

              <div className="input-group">
                <label className="terminal-label">PASSWORD:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="terminal-input"
                  required
                />
                <div className="input-scan-line"></div>
              </div>

              {!isLogin && (
                <>
                  <div className="input-group">
                    <label className="terminal-label">FULL_NAME:</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="terminal-input"
                      required
                    />
                    <div className="input-scan-line"></div>
                  </div>

                  <div className="input-group">
                    <label className="terminal-label">BRANCH:</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="terminal-input"
                      required
                    />
                    <div className="input-scan-line"></div>
                  </div>

                  <div className="input-group">
                    <label className="terminal-label">SEMESTER:</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.semester}
                      onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                      className="terminal-input"
                      required
                    />
                    <div className="input-scan-line"></div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="terminal-button w-full"
              >
                {loading ? (
                  <div className="loading-bars">
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  `> ${isLogin ? 'EXECUTE LOGIN' : 'REGISTER USER'}`
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-accent hover:text-primary transition-colors text-sm"
                >
                  {isLogin ? '> CREATE NEW USER' : '> EXISTING USER LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .grid-lines {
          background-image: 
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: grid-pulse 4s ease-in-out infinite;
        }

        @keyframes grid-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .scan-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            transparent 50%,
            rgba(0, 255, 65, 0.03) 50%
          );
          background-size: 100% 4px;
          animation: scan 0.1s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        .terminal-window {
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid hsl(var(--primary));
          border-radius: 8px;
          box-shadow: 
            0 0 20px rgba(0, 255, 65, 0.3),
            inset 0 0 20px rgba(0, 255, 65, 0.05);
          overflow: hidden;
        }

        .terminal-header {
          background: rgba(0, 255, 65, 0.1);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid hsl(var(--primary));
        }

        .terminal-buttons {
          display: flex;
          gap: 6px;
          margin-right: 16px;
        }

        .terminal-btn {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .terminal-btn.close { background: #ff5555; }
        .terminal-btn.minimize { background: #ffb86c; }
        .terminal-btn.maximize { background: #50fa7b; }

        .terminal-title {
          color: hsl(var(--primary));
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .terminal-content {
          padding: 24px;
          background: rgba(0, 0, 0, 0.8);
        }

        .terminal-prompt {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .input-group {
          position: relative;
        }

        .terminal-label {
          display: block;
          color: hsl(var(--primary));
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .terminal-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(0, 255, 65, 0.3);
          color: hsl(var(--primary));
          font-family: 'Courier New', monospace;
          font-size: 14px;
          padding: 12px;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s ease;
        }

        .terminal-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }

        .input-scan-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, hsl(var(--accent)), transparent);
          opacity: 0;
          animation: scan-input 2s ease-in-out infinite;
        }

        .terminal-input:focus + .input-scan-line {
          opacity: 1;
        }

        @keyframes scan-input {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .terminal-button {
          background: rgba(0, 255, 65, 0.1);
          border: 1px solid hsl(var(--primary));
          color: hsl(var(--primary));
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 14px;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .terminal-button:hover:not(:disabled) {
          background: rgba(0, 255, 65, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
        }

        .terminal-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-bars {
          display: flex;
          gap: 4px;
          justify-content: center;
          align-items: center;
        }

        .loading-bars span {
          width: 4px;
          height: 16px;
          background: hsl(var(--primary));
          animation: loading 1.2s ease-in-out infinite;
        }

        .loading-bars span:nth-child(2) { animation-delay: 0.1s; }
        .loading-bars span:nth-child(3) { animation-delay: 0.2s; }

        @keyframes loading {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default CyberpunkAuth;