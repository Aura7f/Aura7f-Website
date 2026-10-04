import React, { useCallback, useMemo, useState } from 'react';
import { Event } from '../lib/supabase';
import TopNav from '../components/homedesign/TopNav';
import FeaturedCarousel from '../components/eventsdesign/FeaturedCarousel';
import EventsSectionTitle from '../components/eventsdesign/EventsSectionTitle';
import EventsBoard, { EventDialog } from '../components/eventsdesign/EventsBoard';
import useEventsData from '../components/eventsdesign/useEventsData';
import Footer from '../components/homedesign/Footer';

export default function EventsDesign() {
  const { events, loading, live, upcoming, past } = useEventsData();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Event | null>(null);

  const onIndexChange = useCallback((i: number) => setIndex(i), []);

  // Must be stable: a new array identity would reset the Stack's internal order.
  const featured = useMemo(() => [...live, ...upcoming, ...past], [live, upcoming, past]);
  const safeIndex = featured.length === 0 ? 0 : Math.min(index, featured.length - 1);

  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      {/* ------- events backdrop ------- */}
      <div className="absolute inset-0 h-screen">
        <img
          src="/event-bg.png"
          alt="Aura-7F quest board"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <TopNav />
      {/* <FeaturedCarousel events={featured} active={safeIndex} onIndexChange={onIndexChange} /> */}
      {/* <EventsSectionTitle /> */}
      <EventsBoard
        live={live}
        upcoming={upcoming}
        past={past}
        loading={loading}
        onSelectEvent={setSelected}
        paused={selected !== null}
      />
      <EventDialog event={selected} onClose={() => setSelected(null)} />
      <Footer />
    </div>
  );
}