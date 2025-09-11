import { Link } from "react-router-dom";
import { Mail, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <div className="font-heading font-bold text-lg">
                <span className="text-primary">TYGN</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering coders, building community, driving innovation across India.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/notes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Study Notes
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Job Openings
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Coding Quizzes
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <span>Study Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <span>Feedback Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/badges" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Badges & Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:techyogeeknirvana@gmail.com"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>techyogeeknirvana@gmail.com</span>
              </a>
              <p className="text-sm text-muted-foreground">
                Have questions or suggestions? We'd love to hear from you!
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 TechYOGeek Nirvana. Built by the community, for the community.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Fostering innovation and collaboration in India's coding ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;