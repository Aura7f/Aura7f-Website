import React from 'react';

export default function ClanProfile() {
  return (
    <section className="relative z-10 w-full">
      <div className="absolute inset-0">
        <img
          src="/bg-meta2.png"
          alt="Aura-7F village lanes"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="max-w-xl rounded-2xl border border-white/15 bg-black/55 px-6 py-7 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <img src="/aura-7f-big.png" alt="Clan Badge" className="h-16 w-16 drop-shadow-md" />
            <div>
              <h2 className="text-3xl font-black uppercase leading-tight text-white drop-shadow-md">
                Aura-7F
              </h2>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f4d03f]">
                Byte Bash Blitz
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col rounded-lg bg-white/5 p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Clan War League</span>
              <span className="mt-1 font-black uppercase tracking-wide text-[#f4d03f]">Master I</span>
            </div>
            <div className="flex flex-col rounded-lg bg-white/5 p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Wars Won</span>
              <span className="mt-1 font-black uppercase tracking-wide text-white">1337</span>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-white/80">
            We emerged from the Byte Bash Blitz realm — a fellowship of developers united by a
            vision of greatness. In the Era of Identity we discovered our true name:{' '}
            <span className="font-bold text-[#f4d03f]">Aura</span>, the radiant energy that
            emanates from our collective mastery, and{' '}
            <span className="font-bold text-[#f4d03f]">7F</span>, the pinnacle of hexadecimal
            energy — the absolute limit of positive potential. Like a celestial body that burns
            brightest in the vast cosmos, we carry that light with us.
          </p>

          <a
            href="/about"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f4d03f] px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
          >
            View Full Profile
          </a>
        </div>
      </div>
    </section>
  );
}
