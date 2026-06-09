import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SUPPORT_EMAIL = 'techyogeeknirvana@gmail.com';

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: 'Fill all fields', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent(`TYGN Connect — message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    toast({ title: 'Opening your mail app…', description: 'Send the draft to reach the TYGN team.' });
  };

  return (
    <div className="bg-[#05060f] text-white">
      <section className="relative overflow-hidden px-6 pt-20 pb-12">
        <div className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[520px] rounded-full opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.18), transparent 70%)' }} />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-fuchsia-200">
            <MessageSquare className="h-3.5 w-3.5" /> Contact
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold md:text-5xl">Talk to the TYGN team.</h1>
          <p className="mt-4 max-w-2xl text-white/65">
            Questions, feedback, partnership requests, or you want to contribute notes? Drop us a note —
            we read everything.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <Mail className="h-5 w-5 text-cyan-300" />
              <h3 className="mt-3 font-heading text-lg font-semibold">Email</h3>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-1 block text-sm text-cyan-300 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <MessageSquare className="h-5 w-5 text-fuchsia-300" />
              <h3 className="mt-3 font-heading text-lg font-semibold">Community</h3>
              <p className="mt-1 text-sm text-white/60">
                The fastest way to get help is to ask in the in-app community channel.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-white/60">Your name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-white/[0.04] border-white/10 text-white" placeholder="Aarav Sharma" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/60">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-white/[0.04] border-white/10 text-white" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/60">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                className="mt-1 bg-white/[0.04] border-white/10 text-white" placeholder="Tell us anything…" />
            </div>
            <Button type="submit"
              className="w-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
              <Send className="mr-1 h-4 w-4" /> Send message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
