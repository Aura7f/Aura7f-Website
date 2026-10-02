import React, { useCallback, useMemo } from 'react';
import Stack from '../reactbits/Stack';
import { eventCategory } from './useEventsData';
import type { Event } from '../../lib/supabase';

export default function EventsStack({
  events,
  activeIndex,
  onIndexChange,
  size = 320,
}: {
  events: Event[];
  activeIndex: number;
  onIndexChange: (i: number) => void;
  size?: number;
}) {
  // Stack's top card id is 1-based and shifts as cards cycle.
  const handleTopChange = useCallback(
    (id: number) => {
      onIndexChange(id - 1);
    },
    [onIndexChange]
  );

  if (events.length === 0) return null;

  // Stable identity so Stack's internal order is not reset on every parent render.
  const cards = useMemo(
    () =>
      events.map((e) => (
        <div key={e.id} className="coc-card">
          <div className="coc-card-inner">
            <img src={e.image_url || '/events-deisgn.png'} alt={e.title} />
          </div>
          <div className="coc-card-label">
            <span className="cat">{eventCategory(e)}</span>
            <span className="ttl">{e.title}</span>
          </div>
        </div>
      )),
    [events]
  );

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label="Event gallery"
    >
      <Stack
        randomRotation={false}
        sensitivity={160}
        sendToBackOnClick
        autoplay
        autoplayDelay={4000}
        pauseOnHover
        animationConfig={{ stiffness: 240, damping: 22 }}
        onTopChange={handleTopChange}
        cards={cards}
      />

      {/* dots */}
      <div className="pointer-events-none absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
        {events.map((e, i) => (
          <span
            key={e.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-[#f4d03f]' : 'w-1.5 bg-white/35'
            }`}
          />
        ))}
      </div>
    </div>
  );
}