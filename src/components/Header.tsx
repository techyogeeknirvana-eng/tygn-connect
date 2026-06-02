import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Sparkles, ExternalLink, MessageSquareText } from "lucide-react";
import tygn_logo from "@/assets/tygn-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useIsModerator } from "@/hooks/useIsModerator";
import { NotificationBell } from "@/components/NotificationBell";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/notes" },
    { name: "Events", href: "/events" },
    { name: "Jobs", href: "/jobs" },
    { name: "Quizzes", href: "/quizzes" },
    { name: "Community", href: "/community" },
    { name: "Resume AI", href: "/resume-checker" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-cyan-400/15 bg-[#05060d]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
          : "border-b border-transparent bg-[#05060d]/40 backdrop-blur-md"
      }`}
    >
      {/* Animated neon top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] overflow-hidden">
        <div className="h-full w-1/2 animate-[shimmer_3s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      </div>

      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-md transition group-hover:bg-cyan-400/60" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-gradient-to-br from-[#0b1226] to-[#05060d] shadow-[inset_0_0_12px_rgba(34,211,238,0.25)]">
                <img src={tygn_logo} alt="TYGN" className="h-7 w-7 object-contain" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-heading text-lg font-extrabold tracking-wide bg-gradient-to-r from-cyan-300 via-white to-yellow-300 bg-clip-text text-transparent">
                TECHYOGEEK
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                Nirvana · B.Tech Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] px-1.5 py-1 backdrop-blur">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active ? "text-[#05060d]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-300 to-yellow-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog",
                  "_blank"
                )
              }
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:border-cyan-300/40 hover:text-white"
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              Feedback
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing",
                  "_blank"
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/20"
            >
              Drive Notes
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            {user && <NotificationBell />}

            {user ? (
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-yellow-300 text-[11px] font-bold text-[#05060d]">
                  {(userProfile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-xs font-medium text-white/80">
                  {userProfile?.full_name || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="ml-1 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-300 to-yellow-300 px-4 py-1.5 text-xs font-bold text-[#05060d] shadow-[0_0_20px_rgba(250,204,21,0.35)] transition hover:shadow-[0_0_30px_rgba(34,211,238,0.55)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sign In
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/80 transition hover:text-white md:ml-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden pb-4"
            >
              <div className="mt-2 rounded-2xl border border-white/10 bg-[#05060d]/90 p-2 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-cyan-300/20 to-yellow-300/20 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform?usp=dialog",
                        "_blank"
                      );
                      setIsMenuOpen(false);
                    }}
                  >
                    Feedback
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.open(
                        "https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing",
                        "_blank"
                      );
                      setIsMenuOpen(false);
                    }}
                  >
                    Drive Notes
                  </Button>
                  {!user ? (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-300 to-yellow-300 px-4 py-2 text-sm font-bold text-[#05060d]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Sign In
                    </Link>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
