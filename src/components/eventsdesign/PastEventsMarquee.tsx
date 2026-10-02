import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Event } from '../../lib/supabase';
import { formatTime12h } from '../../lib/utils';
import { eventCategory } from './useEventsData';

function MarqueeCard({ event, onSelect }: { event: Event; onSelect?: (e: Event) => void }) {
  return (
    <div className="group relative h-[320px] w-[280px] shrink-0">
      <button
        type="button"
        onClick={() => onSelect?.(event)}
        className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-black/55 text-left shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-md transition-all duration-200 hover:ring-[#f4d03f]/50"
      >
        <div className="relative h-36 w-full shrink-0">
          <img
            src={event.image_url || '/events-deisgn.png'}
            alt={event.title}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f4d03f]">
              {eventCategory(event)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">{event.title}</h3>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/45">
            {event.date} · {formatTime12h(event.time)}
          </p>
          <span className="mt-auto inline-flex h-8 items-center justify-center rounded-full bg-[#f4d03f] px-5 text-[10px] font-black uppercase tracking-widest text-black opacity-0 transition-all duration-200 group-hover:opacity-100">
            See details
          </span>
        </div>
      </button>
    </div>
  );
}

export default function PastEventsMarquee({
  events,
  onSelectEvent,
  paused,
}: {
  events: Event[];
  onSelectEvent?: (e: Event) => void;
  paused?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [duration, setDuration] = useState(30);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const measure = () => {
      const w = firstRef.current?.offsetWidth ?? 0;
      const vw = wrapRef.current?.clientWidth ?? 0;
      if (!w) return;
      setCopies(Math.min(6, Math.max(2, Math.ceil(vw / w) + 1)));
      setDuration(Math.max(20, Math.round(w / 45)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [events.length]);

  const track = useMemo(
    () => Array.from({ length: copies }, (_, c) => c),
    [copies]
  );

  return (
    <div
      ref={wrapRef}
      className="events-marquee relative z-30 w-full overflow-visible"
      aria-label="Past events"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        className="events-marquee-track flex w-max gap-5 py-6"
        style={
          {
            '--marquee-copies': copies,
            '--marquee-duration': `${duration}s`,
            animationPlayState: hovered || paused ? 'paused' : 'running',
          } as React.CSSProperties
        }
      >
        {track.map((c) => (
          <div
            key={c}
            ref={c === 0 ? firstRef : undefined}
            className="flex shrink-0 gap-5"
            aria-hidden={c > 0}
          >
            {events.map((e) => (
              <MarqueeCard key={`${c}-${e.id}`} event={e} onSelect={onSelectEvent} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
