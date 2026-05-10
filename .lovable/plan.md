# TYGN → Cyber Innovation OS

This is a very large transformation (13 major sections + global animation overhaul). Shipping it all in one pass would produce shallow, broken UI. I'll scope it into phases so each one lands polished.

## Phase 1 — Foundation & Hero (this round)
1. **Design system overhaul** (`index.css`, `tailwind.config.ts`)
   - Dark cyber palette: deep void bg `#05060A`, panel `#0B0F1A`, neon cyan `#22D3EE`, signature yellow `#FACC15`, magenta accent `#E879F9`
   - New tokens: `--surface`, `--surface-elevated`, `--neon-cyan`, `--neon-yellow`, `--neon-magenta`, `--grid-line`
   - Gradients: `--gradient-cyber`, `--gradient-holo`, `--gradient-terminal`
   - Shadows: `--glow-cyan`, `--glow-yellow`, `--shadow-holo`
   - Typography: JetBrains Mono (terminal/code), Space Grotesk (display), Inter (body)
   - Keyframes: `scanline`, `flicker`, `grid-drift`, `holo-shift`, `pulse-ring`, `terminal-blink`, `radar-sweep`
   - New button variants: `cyber`, `terminal`, `holo`, `ghost-neon`

2. **Global cyber chrome**
   - Persistent animated grid + noise overlay (low opacity, fixed)
   - Custom cursor glow on desktop
   - Scroll-triggered reveal helpers via Framer Motion

3. **Section 1: Immersive Hero** (`src/components/hero/CyberHero.tsx`)
   - Three.js particle field + floating wireframe nodes
   - Animated cyber grid floor (CSS perspective)
   - Glitch headline "Welcome to the Future of Student Innovation"
   - 3 CTAs: Enter TYGN, Launch Mission, Explore Labs
   - Right-side **live terminal panel** with typing animation streaming logs (member joins, AI generations, hackathon activity, threat alerts)

4. Wire into `src/pages/Index.tsx` replacing current hero, keep Header/Footer.

## Phase 2 — Mission Control + Hacker Arena (next round)
- Section 2: AI Mission Control dashboard (6 holographic feature modules)
- Section 3: Cyber Range / Hacker Arena (CTF leaderboard, terminal UI, ranks/XP)

## Phase 3 — Map, Battlefield, Skills
- Section 4: Innovation Map (animated node network, SVG/Canvas)
- Section 5: Project Battlefield (mission-style project cards)
- Section 6: Skill Evolution System (skill tree + XP)

## Phase 4 — Radar, Networking, War Room
- Section 7: Opportunity Radar (radar sweep animation)
- Section 8: AI Networking Engine (floating profile cards)
- Section 9: Digital War Room (multi-widget dashboard)

## Phase 5 — Events, Signals, Members, Footer
- Section 10: Event missions
- Section 11: AI News & Signals feed
- Section 12: Elite Member Wall
- Section 13: Futuristic Footer with terminal input

## Technical Notes
- Stack: React 18, Tailwind, Framer Motion, GSAP, three.js + @react-three/fiber@^8.18 + @react-three/drei@^9.122 (already requested earlier)
- All sections built as isolated components in `src/components/cyber/` for reusability
- Each phase ships a working preview; nothing half-built
- Existing pages (Auth, Notes, Community, Resume) keep their current functionality; only landing experience is rebuilt

## What ships now
Phase 1 only. After you preview the hero + new design system and confirm the direction, I'll roll out Phase 2.

If you'd rather I skip the phasing and ship all 13 sections in one giant pass, say so — but quality per section will drop significantly.
