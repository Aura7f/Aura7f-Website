import React, { useState, useEffect } from 'react';
import { Event } from '../../lib/supabase';
import { formatTime12h } from '../../lib/utils';
import { eventCategory } from './useEventsData';
import EventsStack from './EventsStack';

const StatusChip = ({ status }: { status: string }) => {
  if (status === 'live')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
        Live now
      </span>
    );
  if (status === 'upcoming')
    return (
      <span className="rounded-full bg-[#f4d03f]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#f4d03f]">
        Upcoming
      </span>
    );
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/50">
      Completed
    </span>
  );
};

export default function FeaturedCarousel({
  events,
  active,
  onIndexChange,
}: {
  events: Event[];
  active: number;
  onIndexChange: (i: number) => void;
}) {
  const [size, setSize] = useState(400);

  useEffect(() => {
    const checkSize = () => {
      // 400px default for lg, smaller on mobile
      if (window.innerWidth < 480) {
        setSize(window.innerWidth - 60); // 30px padding on each side
      } else if (window.innerWidth < 640) {
        setSize(320);
      } else {
        setSize(400);
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="relative z-10 flex min-h-[60vh] items-center px-4 pb-16 pt-28 sm:px-6 lg:px-10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl flex justify-center sm:justify-start">
        {/* CoC card stack only, aligned left (center on mobile) and responsive */}
        <EventsStack events={events} activeIndex={active} onIndexChange={onIndexChange} size={size} />
      </div>
    </section>
  );
}