import React from 'react';
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
  if (events.length === 0) return null;

  return (
    <section className="relative z-10 flex min-h-[60vh] items-center px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl flex justify-start">
        {/* CoC card stack only, aligned left and bigger */}
        <EventsStack events={events} activeIndex={active} onIndexChange={onIndexChange} size={400} />
      </div>
    </section>
  );
}