import React, { useState } from 'react';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Facebook,
  MessageSquare,
  Youtube,
  Github,
  Users,
  Swords,
  Crown,
  Sparkles,
  Shield,
  BookOpen,
  Zap,
  Target,
  Star,
} from 'lucide-react';

/* ---------------------------------- data ---------------------------------- */

const reviews = [
  {
    quote:
      '"Aura-7F is a beaut of a developer clan, with new ideas that make it feel extremely polished and refined."',
    source: 'TechToPlay',
  },
  {
    quote:
      '"Clashing our way to glory — one war win, one merged PR at a time. Absurdly fun fellowship."',
    source: 'SlideToPlay',
  },
  {
    quote:
      '"The Code of Aura actually ships. Alliance, Wisdom, Glory, Magic — all maxed out."',
    source: 'ClanVerdict',
  },
];

const awards = [
  { top: 'Best', bottom: 'Clan', style: 'from-yellow-300 to-yellow-500 text-[#3a271d] rounded-full -rotate-6' },
  { top: 'IGN', bottom: 'Choice', style: 'from-red-500 to-red-700 text-white rounded-lg rotate-3' },
  { top: 'Must', bottom: 'Have', style: 'from-blue-400 to-blue-600 text-white rounded-full -rotate-3' },
  { top: '90', bottom: 'out of 100', style: 'from-green-400 to-green-600 text-white rounded border-2 border-white rotate-6' },
];

const clanShots: Record<'clan' | 'wars', string[]> = {
  clan: ['/home1.png', '/members.png', '/gallery.png'],
  wars: ['/events.png', '/projects.png', '/home2.png'],
};

const features = [
  { icon: <Shield className="size-5 text-amber-700" />, title: 'Alliance', text: 'Unbreakable bonds, seamless teamwork.' },
  { icon: <BookOpen className="size-5 text-amber-700" />, title: 'Wisdom', text: 'Ancient scrolls shared with all.' },
  { icon: <Crown className="size-5 text-amber-700" />, title: 'Glory', text: 'Legendary status in every artifact.' },
  { icon: <Sparkles className="size-5 text-amber-700" />, title: 'Magic', text: 'Spells of code from the void.' },
  { icon: <Zap className="size-5 text-amber-700" />, title: 'Ascension', text: 'Always upgrading. Never idle.' },
  { icon: <Target className="size-5 text-amber-700" />, title: 'Precision', text: 'Every strike planned to the second.' },
];

/* --------------------------------- pieces --------------------------------- */

const ParchmentDivider = () => (
  <div className="flex justify-center my-8 px-4">
    <div className="w-3/4 h-[2px] bg-[#d5c3aa] border-b border-white" />
  </div>
);

const ChunkyButton: React.FC<{
  children: React.ReactNode;
  variant?: 'gold' | 'brown' | 'dark';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'brown', className = '', onClick }) => {
  const styles =
    variant === 'gold'
      ? 'bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d]'
      : variant === 'dark'
        ? 'bg-gradient-to-b from-[#4a382c] to-[#2a1e16] text-white'
        : 'bg-gradient-to-b from-[#8b7565] to-[#5a483a] text-white';
  return (
    <button
      onClick={onClick}
      className={`${styles} font-black py-2 px-6 rounded-full border-2 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider text-sm ${className}`}
    >
      {children}
    </button>
  );
};

const SocialBtn = ({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) => (
  <a
    href="/about"
    title={label}
    aria-label={label}
    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-white flex items-center justify-center shadow-lg text-white hover:scale-110 transition-transform ${color}`}
  >
    {icon}
  </a>
);

/* ---------------------------------- page ---------------------------------- */

export default function HomeV3() {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [shotTab, setShotTab] = useState<'clan' | 'wars'>('clan');
  const [shotIdx, setShotIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const shots = clanShots[shotTab];
  const currentShot = shots[shotIdx % shots.length];

  return (
    <div className="min-h-screen w-full bg-[#c8b598] relative overflow-x-clip font-lato">
      {/* faint map backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(91,64,51,0.35) 0, transparent 34%), radial-gradient(circle at 82% 18%, rgba(91,64,51,0.3) 0, transparent 30%), radial-gradient(circle at 75% 82%, rgba(91,64,51,0.3) 0, transparent 32%), repeating-linear-gradient(0deg, transparent 0 46px, rgba(91,64,51,0.18) 46px 47px), repeating-linear-gradient(90deg, transparent 0 46px, rgba(91,64,51,0.18) 46px 47px)',
        }}
      />

      {/* ------- top store bar (like GET IT NOW bar) ------- */}
      <div className="relative z-30 bg-[#1f130e] border-b-4 border-[#3a271d]">
        <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[#f4d03f] font-black text-xs uppercase tracking-widest mr-1 flex items-center gap-1">
            <Star className="size-3" fill="currentColor" /> Join now:
          </span>
          {['Discord', 'GitHub', 'Wars', 'Quests'].map((s) => (
            <a
              key={s}
              href={s === 'Wars' ? '/events' : s === 'Quests' ? '/members' : '/about'}
              className="bg-[#3a271d] hover:bg-[#5b4033] text-[#fbf5e6] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded border border-[#5b4033] transition-colors"
            >
              {s}
            </a>
          ))}
          <span className="hidden sm:inline text-[#8c7b6c] text-[11px] font-bold uppercase tracking-widest ml-2">
            Play the original!
          </span>
          <a
            href="/about"
            className="bg-[#f4d03f] text-[#3a271d] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded border-2 border-[#3a271d] hover:scale-105 transition-transform"
          >
            Aura-7F
          </a>
        </div>
      </div>

      {/* ------- peeking side characters (pure CSS, no external assets) ------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <div className="absolute left-2 top-24 -rotate-6 text-7xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">🧙</div>
        <div className="absolute left-6 top-[420px] rotate-3 text-6xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">👹</div>
        <div className="absolute left-0 top-[640px] -rotate-3 text-7xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">💀</div>
        <div className="absolute left-10 bottom-64 text-6xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">🧌</div>
        <div className="absolute right-2 top-28 rotate-6 text-7xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">🧝</div>
        <div className="absolute right-6 top-[430px] -rotate-3 text-6xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">🧟</div>
        <div className="absolute right-4 top-[660px] rotate-2 text-5xl">🚀</div>
        <div className="absolute right-10 bottom-40 text-7xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">🐉</div>
        <div className="absolute left-16 bottom-40 text-6xl">☄️</div>
      </div>

      {/* ------- parchment scroll ------- */}
      <div className="relative z-20 max-w-4xl mx-auto px-3 sm:px-6 pt-14 pb-10">
        <div
          className="relative bg-[#fbf5e6] rounded-sm border-4 border-[#5b4033] px-4 sm:px-8 py-8 shadow-2xl"
          style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 60px rgba(180,150,110,0.4)' }}
        >
          {/* logo medallion */}
          <div className="flex justify-center -mt-20 mb-8">
            <div className="bg-[#5b4033] border-4 border-[#3a271d] rounded-xl px-8 py-4 text-center shadow-xl -rotate-2">
              <h1
                className="text-4xl md:text-6xl font-black text-[#f4d03f] tracking-wider uppercase leading-none"
                style={{
                  textShadow:
                    '3px 3px 0 #3a271d, -1px -1px 0 #3a271d, 1px -1px 0 #3a271d, -1px 1px 0 #3a271d',
                }}
              >
                Aura-7F
              </h1>
              <h2
                className="text-xl md:text-2xl font-bold text-white uppercase tracking-[0.3em] mt-1"
                style={{ textShadow: '2px 2px 0 #3a271d' }}
              >
                Frontiers
              </h2>
              <p className="text-[#d5c3aa] text-[11px] font-bold uppercase tracking-widest mt-2">
                BashClan 1 of Byte Bash Blitz
              </p>
            </div>
          </div>

          {/* hero video frame */}
          <div className="relative bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl mb-8 mx-auto max-w-3xl">
            <div className="aspect-video bg-[#2a1e16] relative flex items-center justify-center overflow-hidden rounded border-2 border-black">
              {playing ? (
                <video
                  src="/hero-bg.mp4"
                  poster="/hero-bg.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <img
                    src="/hero-bg.jpg"
                    alt="Aura-7F clan battleground"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/newhome-bg.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <button
                    onClick={() => setPlaying(true)}
                    aria-label="Play clan trailer"
                    className="relative z-10 w-20 h-20 bg-[#f4d03f] rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform"
                  >
                    <Play className="w-9 h-9 text-[#3a271d] ml-1" fill="currentColor" />
                  </button>
                  <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center gap-2 text-white/90 text-xs font-bold">
                    <span className="bg-black/60 px-2 py-0.5 rounded">0:02 / 1:06</span>
                    <span className="bg-black/60 px-2 py-0.5 rounded ml-auto uppercase tracking-widest">
                      Clan trailer
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="absolute -right-4 md:-right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <SocialBtn icon={<Twitter className="size-5" />} color="bg-[#55acee]" label="Twitter" />
              <SocialBtn icon={<Facebook className="size-5" />} color="bg-[#3b5998]" label="Facebook" />
              <SocialBtn icon={<MessageSquare className="size-5" />} color="bg-[#ff9900]" label="Forums" />
              <SocialBtn icon={<Youtube className="size-5" />} color="bg-[#cd201f]" label="YouTube" />
            </div>
          </div>

          {/* announcement banner */}
          <a href="/events" className="block w-full max-w-2xl mx-auto mb-4 group">
            <div className="h-20 bg-[#5b4033] border-4 border-[#3a271d] rounded-lg shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden group-hover:bg-[#6b4d3d] transition-colors px-4 text-center">
              <span className="text-[#f4d03f] font-black text-lg sm:text-2xl uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
                ⚔ Clan wars live — 1000 echoes of victory ⚔
              </span>
            </div>
          </a>

          <ParchmentDivider />

          {/* reviews + awards */}
          <div className="grid md:grid-cols-2 gap-10 mb-4 px-2">
            <div>
              <h3
                className="text-3xl font-black text-center mb-6 text-[#3a271d] uppercase"
                style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
              >
                Reviews
              </h3>
              <div className="flex items-center justify-between gap-2 min-h-[132px]">
                <button
                  aria-label="Previous review"
                  onClick={() => setReviewIdx((reviewIdx + reviews.length - 1) % reviews.length)}
                  className="text-[#8c7b6c] hover:text-[#5b4033] transition-colors shrink-0"
                >
                  <ChevronLeft className="w-10 h-10" strokeWidth={3} />
                </button>
                <div className="text-center px-2 flex-1">
                  <p className="text-[#5b4033] font-semibold text-base mb-5 leading-snug min-h-[72px]">
                    {reviews[reviewIdx].quote}
                  </p>
                  <ChunkyButton>{reviews[reviewIdx].source}</ChunkyButton>
                </div>
                <button
                  aria-label="Next review"
                  onClick={() => setReviewIdx((reviewIdx + 1) % reviews.length)}
                  className="text-[#8c7b6c] hover:text-[#5b4033] transition-colors shrink-0"
                >
                  <ChevronRight className="w-10 h-10" strokeWidth={3} />
                </button>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to review ${i + 1}`}
                    onClick={() => setReviewIdx(i)}
                    className={`w-3 h-3 rounded-full border border-[#3a271d] ${i === reviewIdx ? 'bg-[#f4d03f]' : 'bg-[#d5c3aa]'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3
                className="text-3xl font-black text-center mb-6 text-[#3a271d] uppercase"
                style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
              >
                Our Awards!
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {awards.map((a) => (
                  <div
                    key={a.bottom}
                    className={`w-16 h-16 bg-gradient-to-b ${a.style} border-4 border-[#3a271d] flex flex-col items-center justify-center shadow-lg font-black text-[10px] uppercase text-center leading-tight transform hover:scale-110 transition-transform`}
                  >
                    {a.top}
                    <br />
                    {a.bottom}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: <Users className="size-4 mx-auto" />, v: '12+', l: 'Members' },
                  { icon: <Swords className="size-4 mx-auto" />, v: '10+', l: 'Wars won' },
                  { icon: <Crown className="size-4 mx-auto" />, v: '100%', l: 'Loyalty' },
                ].map((s) => (
                  <div key={s.l} className="bg-[#efe3cb] border-2 border-[#d5c3aa] rounded-lg py-2 px-1 text-[#5b4033]">
                    <div className="text-[#8c7b6c]">{s.icon}</div>
                    <div className="font-black text-lg leading-none mt-1">{s.v}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ParchmentDivider />

          {/* features */}
          <div className="flex flex-col md:flex-row gap-10 items-center mb-4 px-2">
            <div className="flex-1 relative w-full max-w-sm mx-auto pb-8">
              <div className="bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl -rotate-2">
                <img
                  src="/warrior.png"
                  alt="Elite towers"
                  className="w-full aspect-square object-cover rounded border-2 border-black bg-[#8c7b6c]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/projects.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d] font-black uppercase px-6 py-2 rounded-lg border-4 border-[#3a271d] whitespace-nowrap rotate-2 shadow-xl text-base w-11/12 text-center">
                An arsenal of
                <br />
                elite projects!
              </div>
            </div>

            <div className="flex-1">
              <h3
                className="text-4xl font-black mb-1 text-[#3a271d] uppercase"
                style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
              >
                Features
              </h3>
              <h4 className="text-sm font-black text-[#8c7b6c] uppercase mb-4 tracking-widest">Overview</h4>
              <p className="text-[#5b4033] font-medium leading-relaxed mb-4">
                Defend your codebase against hordes of bugs, legacy code, and nasty merge conflicts in
                this epic tech-packed development clan by Aura-7F.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {features.map((f) => (
                  <div key={f.title} className="flex items-center gap-2 bg-[#efe3cb] border border-[#d5c3aa] rounded-lg px-2 py-1.5">
                    {f.icon}
                    <div className="leading-tight">
                      <div className="text-xs font-black uppercase tracking-wider text-[#3a271d]">{f.title}</div>
                      <div className="text-[11px] text-[#5b4033] font-medium">{f.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]" />
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-[#d5c3aa]" />
                ))}
              </div>
            </div>
          </div>

          <ParchmentDivider />

          {/* screenshots */}
          <div className="flex flex-col md:flex-row gap-8 items-center mb-4 px-2">
            <div className="flex-1 order-2 md:order-1 w-full">
              <h3
                className="text-4xl font-black mb-4 text-[#3a271d] uppercase"
                style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
              >
                Screenshots
              </h3>
              <p className="text-[#5b4033] font-medium leading-relaxed mb-6 text-sm">
                Select which version you&apos;d like to see and then click any image to see it in its
                full glory.
              </p>
              <div className="flex sm:flex-col gap-3 max-w-[220px]">
                <button
                  onClick={() => {
                    setShotTab('clan');
                    setShotIdx(0);
                  }}
                  className={`${shotTab === 'clan' ? 'bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d]' : 'bg-gradient-to-b from-[#8b7565] to-[#5a483a] text-white'} font-black py-3 px-6 rounded-lg border-4 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider`}
                >
                  Clan
                </button>
                <button
                  onClick={() => {
                    setShotTab('wars');
                    setShotIdx(0);
                  }}
                  className={`${shotTab === 'wars' ? 'bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d]' : 'bg-gradient-to-b from-[#8b7565] to-[#5a483a] text-white'} font-black py-3 px-6 rounded-lg border-4 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider`}
                >
                  Wars
                </button>
              </div>
              <div className="flex gap-2 mt-6 items-center">
                {shots.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Screenshot ${i + 1}`}
                    onClick={() => setShotIdx(i)}
                    className={`w-3 h-3 rounded-full border border-[#3a271d] ${i === shotIdx % shots.length ? 'bg-[#f4d03f]' : 'bg-[#d5c3aa]'}`}
                  />
                ))}
                <button
                  onClick={() => setShotIdx((shotIdx + 1) % shots.length)}
                  className="ml-2 text-[#8c7b6c] hover:text-[#5b4033]"
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="size-5" strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="flex-[1.5] order-1 md:order-2 w-full">
              <button
                onClick={() => setShotIdx((shotIdx + 1) % shots.length)}
                className="block w-full bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl relative group cursor-pointer text-left"
              >
                <img
                  src={currentShot}
                  alt={`${shotTab} screenshot ${shotIdx + 1}`}
                  className="w-full aspect-[16/10] object-cover rounded border-2 border-black bg-[#8c7b6c] group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/60 text-white font-black px-4 py-2 rounded-lg uppercase tracking-widest border-2 border-white text-sm">
                    Click to enlarge
                  </div>
                </div>
              </button>
            </div>
          </div>

          <ParchmentDivider />

          {/* special features */}
          <div className="flex flex-col md:flex-row gap-10 items-center px-2 pb-2">
            <div className="flex-1 relative w-full max-w-sm mx-auto">
              <div className="relative h-64">
                <a href="/gallery" className="absolute inset-0 -rotate-6 hover:-rotate-12 transition-transform z-10 block">
                  <div className="bg-white p-1 rounded border-2 border-gray-300 shadow-lg h-full">
                    <img src="/gallery.png" alt="Aura comic 1" className="w-full h-full object-cover border border-gray-200 bg-[#d5c3aa]" />
                  </div>
                </a>
                <a href="/milestones" className="absolute inset-0 rotate-3 hover:rotate-6 transition-transform z-20 top-4 left-4 block">
                  <div className="bg-white p-1 rounded border-2 border-gray-300 shadow-xl h-full">
                    <img src="/members.png" alt="Aura comic 2" className="w-full h-full object-cover border border-gray-200 bg-[#d5c3aa]" />
                  </div>
                </a>
              </div>
            </div>

            <div className="flex-1">
              <h3
                className="text-3xl font-black mb-1 text-[#3a271d] uppercase"
                style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
              >
                Special features:
              </h3>
              <h4 className="text-xl font-black text-[#8c7b6c] uppercase mb-4 tracking-widest">
                Chronicles
              </h4>
              <p className="text-[#5b4033] font-medium leading-relaxed mb-4 text-sm">
                Based on the hit clan AURA-7F, comes this epic story that lets you live the universe
                of Aura in an awesome and fun experience!!!
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                <a href="/milestones" className="bg-black text-white px-4 py-2.5 rounded-xl flex items-center gap-2 border-2 border-gray-700 hover:bg-gray-800 transition-colors shadow-lg text-sm font-bold">
                  <Github className="size-5" /> Milestones
                </a>
                <a href="/events" className="bg-black text-white px-4 py-2.5 rounded-xl flex items-center gap-2 border-2 border-gray-700 hover:bg-gray-800 transition-colors shadow-lg text-sm font-bold">
                  <Swords className="size-5" /> Quests
                </a>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]" />
                <div className="w-3 h-3 rounded-full bg-[#d5c3aa]" />
                <div className="w-3 h-3 rounded-full bg-[#d5c3aa]" />
              </div>
            </div>
          </div>

          {/* get social */}
          <div className="mt-8 bg-[#efe3cb] border-2 border-[#d5c3aa] rounded-xl px-4 py-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-2">
              <SocialBtn icon={<Twitter className="size-5" />} color="bg-[#55acee]" label="Twitter" />
              <SocialBtn icon={<Facebook className="size-5" />} color="bg-[#3b5998]" label="Facebook" />
              <SocialBtn icon={<MessageSquare className="size-5" />} color="bg-[#ff9900]" label="Forums" />
              <SocialBtn icon={<Youtube className="size-5" />} color="bg-[#cd201f]" label="YouTube" />
            </div>
            <div className="text-center sm:text-left">
              <div className="font-black uppercase tracking-widest text-[#3a271d] text-sm">Get social</div>
              <p className="text-[#5b4033] text-xs font-medium">
                Love Aura-7F? Meet us on Discord, GitHub, YouTube or our Forums. Drop by and say hello!
              </p>
            </div>
            <a href="/members" className="sm:ml-auto shrink-0 bg-[#3a271d] text-[#f4d03f] font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg border-2 border-[#3a271d] hover:bg-[#5b4033] transition-colors">
              Enter guild
            </a>
          </div>
        </div>
      </div>

      {/* ------- bottom footer ------- */}
      <div className="relative z-30 bg-[#1f130e] text-[#8c7b6c] py-5 px-6 text-center text-xs border-t-4 border-[#3a271d] flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center font-black text-white text-sm">A</div>
          <span className="uppercase font-bold text-[#d5c3aa] tracking-widest">Aura-7F</span>
        </div>
        <p>
          Copyright © 2026 Aura-7F Dev Clan. All rights reserved. |{' '}
          <a href="/about" className="text-[#f4d03f] hover:underline">
            Sitemap
          </a>
        </p>
        <p className="opacity-50">Kingdom Rush–inspired home-v3</p>
      </div>
    </div>
  );
}
