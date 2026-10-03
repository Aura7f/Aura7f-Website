import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/home-design' },
    { label: 'Members', href: '/members' },
    { label: 'Events', href: '/events-design' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-white/15 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <a href="/home-design" className="flex items-center">
            <img
              src="/navicon.png"
              alt="Aura-7F"
              className="h-9 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            />
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] z-20 border-b border-white/15 bg-black/95 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col px-4 py-4 space-y-2">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-black uppercase tracking-widest text-white/75 transition-colors hover:bg-white/10 hover:text-[#f4d03f]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
