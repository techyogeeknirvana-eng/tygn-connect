import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import tygn_logo from "@/assets/tygn-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/notes" },
    { name: "Events", href: "/events" },
    { name: "Jobs", href: "/jobs" },
    { name: "Quizzes", href: "/quizzes" },
    { name: "Community", href: "/community" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 lg:px-6 h-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={tygn_logo} 
              alt="TYGN Logo" 
              className="h-8 w-8"
            />
            <div className="font-heading font-bold text-xl">
              <span className="text-primary">TYGN</span>
              <span className="text-muted-foreground text-sm ml-2">B.Tech Student Community</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-white hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog', '_blank')}
            >
              Feedback
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.open('https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing', '_blank')}
            >
              Drive Notes
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {userProfile?.full_name || user.email}
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" className="glow-primary" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border border-border rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  Feedback
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    window.open('https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  Drive Notes
                </Button>
                {!user && (
                  <Button size="sm" className="w-full glow-primary" onClick={() => window.location.href = '/auth'}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;