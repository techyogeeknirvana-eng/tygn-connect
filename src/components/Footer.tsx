import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ExternalLink, Linkedin, Send, Sparkles } from "lucide-react";
import tygn_logo from "@/assets/tygn-logo.png";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed!", description: `We'll send updates to ${email}.` });
    setEmail("");
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-cyan-400/15 bg-[#05060d] text-white/70 dark:bg-[#05060d] light:bg-slate-50">
      {/* glow accents */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="container relative mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand + Newsletter */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/30 to-yellow-300/40 blur-md" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/40 bg-black p-1 shadow-[0_0_25px_rgba(34,211,238,0.45)]">
                  <img src={tygn_logo} alt="TYGN logo" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="leading-tight">
                <p className="font-heading text-lg font-extrabold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-300 bg-clip-text text-transparent">
                  TECHYOGEEK NIRVANA
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-fuchsia-300/70">
                  B.Tech Student Community · India
                </p>
              </div>
            </div>
            <p className="text-sm text-white/55 max-w-md">
              A premium community for India's next generation of engineers — notes, missions, jobs, AI tools, and real conversations. Built by operators, for operators.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md focus-within:border-cyan-300/50 transition"
            >
              <Sparkles className="ml-3 h-4 w-4 text-cyan-300 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com — get mission updates"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none py-1.5"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-300 to-yellow-300 px-4 py-1.5 text-xs font-bold text-[#05060d] shadow-[0_0_18px_rgba(34,211,238,0.45)] transition hover:shadow-[0_0_28px_rgba(250,204,21,0.55)]"
              >
                <Send className="h-3.5 w-3.5" />
                Join
              </button>
            </form>

            <div className="flex items-center gap-2 pt-2">
              <SocialIcon href="https://www.linkedin.com/in/techyogeek-nirvana-834b92309/" label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/techyogeek_nirvana/" label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ" label="WhatsApp">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                </svg>
              </SocialIcon>
              <a
                href="mailto:techyogeeknirvana@gmail.com"
                className="ml-2 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-cyan-300 transition"
              >
                <Mail className="h-3.5 w-3.5" />
                techyogeeknirvana@gmail.com
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">Platform</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/notes">Study Notes</FooterLink>
              <FooterLink to="/events">Events & Hackathons</FooterLink>
              <FooterLink to="/jobs">Jobs & Internships</FooterLink>
              <FooterLink to="/quizzes">Coding Quizzes</FooterLink>
              <FooterLink to="/community">Community Forum</FooterLink>
              <FooterLink to="/resume-checker">AI Resume Lab</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300/80">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition"
                >
                  Study Drive <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfHPqCVP1kSVkBKk90qrwQSBDURqqqpKVwoVex1_mALa8MgsA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition"
                >
                  Feedback Form <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition"
                >
                  WhatsApp Community <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-300/80">// signal</p>
              <p className="mt-1 text-sm text-white/70">
                Want to ship something with us?
                <a href="mailto:techyogeeknirvana@gmail.com" className="ml-1 text-cyan-300 hover:text-cyan-200 underline underline-offset-2">Get in touch →</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} TechYOGeek Nirvana — Built by the community, for the community.
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            India · Status: <span className="text-emerald-400">● Online</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-white/60 hover:text-white transition-colors relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-cyan-300 hover:after:w-full after:transition-all">
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-300/60 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.4)]"
  >
    {children}
  </a>
);

export default Footer;
