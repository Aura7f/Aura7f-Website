import React from 'react';

export default function EventsTopNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 border-b border-white/15 bg-black/55 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <a href="/events-design" className="flex items-center">
          <img
            src="/navicon.png"
            alt="Aura-7F"
            className="h-9 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          />
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { label: 'Home', href: '/home-design' },
            { label: 'Members', href: '/members' },
            { label: 'Events', href: '/events-design' },
            { label: 'Projects', href: '/projects' },
            { label: 'About', href: '/about' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-colors hover:bg-white/10 ${
                l.label === 'Events'
                  ? 'bg-white/15 text-[#f4d03f]'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login-design"
            className="ml-2 rounded-lg bg-[#f4d03f] px-4 py-2 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}