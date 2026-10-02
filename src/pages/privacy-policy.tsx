import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Film, ShieldCheck, Users } from 'lucide-react';
import TopNav from '../components/homedesign/TopNav';
import Footer from '../components/homedesign/Footer';

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'Who we are',
    body: [
      'Aura-7F (Aura 7f) is BashClan 1 of Byte Bash Blitz, a student-run tech community. This policy explains what happens to the information you give us when you register for an event, quiz or project showcase.',
    ],
  },
  {
    title: 'What we collect',
    body: [
      'Registration details: your name, email address, and the slot or day you pick.',
      'For project showcases only: registration number, department, year, section, clan, project title, project category and project description.',
      'Technical details: the consents you tick (privacy policy accepted, media usage accepted) and the timestamp of that consent.',
      'We never ask for passwords, payment details or government ID.',
    ],
  },
  {
    title: 'Why we use it',
    body: [
      'To run the event: confirm your spot, hold your slot, and contact you if something changes.',
      'To publish results, attendance counts and rosters for the clan.',
      'To keep an auditable record of who agreed to what.',
    ],
  },
  {
    title: 'Photos, videos and streaming',
    body: [
      'Events are recorded and streamed on our YouTube channel, and photos or clips are posted on our Instagram and other social accounts.',
      'Photos may include you, your screen, your project or your work in the room.',
      'Participant name lists may be shared on our social media and in event recap posts.',
      'This is optional. If you do not tick the media consent box, we will not publish your name or your photo. You can still attend.',
    ],
  },
  {
    title: 'Who we share it with',
    body: [
      'Our Supabase database (secure storage), our Google Sheet registration ledger when configured, and Discord only if you log in with Discord.',
      'Nobody else. We do not sell data and we do not run ads.',
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      'Registration records are kept for event administration and archived records of the clan.',
      'You can ask us to delete your record at any time by mailing aura7f.bytebashblitz@gmail.com and we will remove what we are not legally required to keep.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Ask what we hold about you, ask us to correct it, ask us to delete it, or ask us to stop using your media.',
      'Withdraw consent at any time by mailing the same address — future posts stop immediately.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'Questions, deletions or consent requests: aura7f.bytebashblitz@gmail.com',
    ],
  },
];

const HIGHLIGHTS = [
  {
    icon: Camera,
    title: 'Photos & reels',
    body: 'Event photos and short clips may appear on Instagram and YouTube.',
  },
  {
    icon: Film,
    title: 'Streaming',
    body: 'Sessions are recorded and streamed on our YouTube channel.',
  },
  {
    icon: Users,
    title: 'Name lists',
    body: 'Participant names may be shared in recaps and social posts.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      <div className="absolute inset-0">
        <img src="/bg-meta.png" alt="Aura-7F village" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <TopNav />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4d03f]">Legal scroll</span>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.1em] text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
          Aura-7F · BashClan 1 of Byte Bash Blitz. Read this before you register — the registration form asks you
          to accept it.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl bg-black/55 p-5 ring-1 ring-white/15 backdrop-blur-md">
              <Icon className="h-5 w-5 text-[#f4d03f]" />
              <h2 className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-white">{title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-8 rounded-3xl bg-black/55 p-6 ring-1 ring-white/15 backdrop-blur-md sm:p-10">
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#f4d03f]">
                <ShieldCheck className="h-4 w-4" /> {title}
              </h2>
              <div className="mt-3 space-y-3">
                {body.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-white/65">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            to="/events-design"
            className="rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
          >
            Back to events
          </Link>
          <p className="text-[11px] text-white/35">Last updated: October 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
