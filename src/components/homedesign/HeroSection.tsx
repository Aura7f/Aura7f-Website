import React from 'react';

export default function HeroSection() {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 lg:px-10">
      <aside className="w-full max-w-xl">
        <div className="max-w-md rounded-2xl border border-white/15 bg-black/55 px-5 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="flex items-center gap-4 px-5 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                BashClan 1
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Byte Bash Blitz
              </span>
            </div>
          </div>
          <div className="px-5 pb-6 pt-3">
            <h1 className="text-5xl font-black uppercase leading-none tracking-wide text-[#f4d03f] sm:text-6xl drop-shadow-lg">
              Aura-7F
            </h1>
            <div className="mt-3 h-[2px] w-24 rounded-full bg-[#f4d03f]/60" />
            <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-white/90">
              BashClan 1 of Byte Bash Blitz
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Towers, walls and war-banners — home of the Bashers.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
