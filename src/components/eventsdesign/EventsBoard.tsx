import React, { useMemo, useState } from 'react';
import { Event } from '../../lib/supabase';
import { formatTime12h, isRegistrationClosed, registrationDeadline } from '../../lib/utils';
import { eventCategory } from './useEventsData';
import PastEventsMarquee from './PastEventsMarquee';

type Tab = 'upcoming' | 'past';

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

const StatusChip = ({ status }: { status: string }) => {
  if (status === 'live')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
        Live
      </span>
    );
  if (status === 'upcoming')
    return (
      <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
        Upcoming
      </span>
    );
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/50">
      Past
    </span>
  );
};

function EventCard({ event, onOpen }: { event: Event; onOpen?: (e: Event) => void }) {
  const hasImage = !!event.image_url;
  const open = event.status === 'upcoming' || event.status === 'live';
  const closed = isRegistrationClosed(event);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-black/55 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-md transition-all duration-200 hover:ring-[#f4d03f]/40">
      <div className={`relative w-full ${hasImage ? 'aspect-video' : 'h-36 bg-white/5'}`}>
        {hasImage ? (
          <img src={event.image_url} alt={event.title} className="h-full w-full object-cover opacity-85" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-9 w-9 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute right-3 top-3">
          <StatusChip status={event.status} />
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#f4d03f]">
          {eventCategory(event)}
        </span>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-white">{event.title}</h3>

        <dl className="mt-4 space-y-1.5 text-[13px] text-white/60">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Date</dt>
            <svg className="h-4 w-4 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <dd>
              {event.date} • {formatTime12h(event.time)}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Location</dt>
            <svg className="h-4 w-4 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentWidth" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <dd className="truncate">{event.location}</dd>
          </div>
        </dl>

        <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-white/55">{event.description}</p>

        {open && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {closed ? (
              <span className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-full bg-white/10 px-6 text-[11px] font-black uppercase tracking-widest text-white/40 ring-1 ring-white/15">
                Registrations closed
              </span>
            ) : (
              <a
                href={`/registration-design/${event.id}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f4d03f] px-6 text-[11px] font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
              >
                {event.status === 'live' ? 'Join raid' : 'Register'}
              </a>
            )}
            {onOpen && (
              <button
                onClick={() => onOpen(event)}
                className="inline-flex h-10 items-center justify-center rounded-full px-5 text-[11px] font-black uppercase tracking-widest text-white/70 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
              >
                Details
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function EventsBoard({
  live,
  upcoming,
  past,
  loading,
  onSelectEvent,
  paused,
}: {
  live: Event[];
  upcoming: Event[];
  past: Event[];
  loading: boolean;
  onSelectEvent?: (e: Event) => void;
  paused?: boolean;
}) {
  const [tab, setTab] = useState<Tab>('upcoming');

  const shown = useMemo(() => {
    const order = (a: Event, b: Event) => a.date.localeCompare(b.date);
    return tab === 'past' ? past : [...live, ...upcoming].sort(order);
  }, [tab, live, upcoming, past]);

  const counts: Record<Tab, number> = {
    upcoming: live.length + upcoming.length,
    past: past.length,
  };

  return (
    <section className="relative z-10 w-full">
      <div className="absolute inset-0">
        <img src="/events-deisgn.png" alt="Aura-7F quest board" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {/* tabs */}
        <div className="mb-9 flex flex-col items-center gap-4 pt-12">
          <div className="flex gap-2 rounded-full bg-black/55 p-1 ring-1 ring-white/15 backdrop-blur-md">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                    active ? 'bg-[#f4d03f] text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t.label}
                  <span className={`text-[10px] ${active ? 'text-black/60' : 'text-white/40'}`}>
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="py-24 text-center text-sm font-bold uppercase tracking-widest text-white/50">Loading quests…</p>
        ) : shown.length === 0 ? (
          <div className="rounded-2xl bg-black/40 py-20 text-center ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-sm font-bold text-white/40">
              {tab === 'upcoming' ? 'No upcoming quests. Rest by the fire.' : 'No past quests yet.'}
            </p>
          </div>
        ) : tab === 'past' ? (
          <PastEventsMarquee events={shown} onSelectEvent={onSelectEvent} paused={paused} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((e) => (
              <EventCard key={e.id} event={e} onOpen={onSelectEvent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function EventDialog({
  event,
  onClose,
}: {
  event: Event | null;
  onClose: () => void;
}) {
  if (!event) return null;
  const past = event.status === 'ended' || event.status === 'completed';
  const closed = isRegistrationClosed(event);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#1c1917]/95 p-6 shadow-2xl ring-1 ring-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#f4d03f]">
          {past ? 'Event details' : 'Quest accepted?'}
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">{event.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{event.description}</p>

        <dl className="mt-5 space-y-2 border-t border-white/10 pt-5 text-[13px] text-white/60">
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Category</dt>
            <dd className="text-right text-white/80">{eventCategory(event)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Date</dt>
            <dd className="text-right text-white/80">
              {event.date} · {formatTime12h(event.time)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Location</dt>
            <dd className="truncate text-right text-white/80">{event.location}</dd>
          </div>
          {event.attendees && (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Raiders</dt>
              <dd className="truncate text-right text-white/80">{event.attendees}</dd>
            </div>
          )}
          {event.rating && (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Rating</dt>
              <dd className="truncate text-right text-white/80">{event.rating}</dd>
            </div>
          )}
          {!past && (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/40">Registrations close</dt>
              <dd className="truncate text-right text-white/80">
                {closed ? 'Closed' : (registrationDeadline(event)?.toLocaleString() ?? 'Open')}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-7 flex gap-3">
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-full text-[12px] font-bold uppercase tracking-widest text-[#f4d03f] ring-1 ring-white/20 transition-colors hover:bg-white/10"
          >
            {past ? 'Close' : 'Retreat'}
          </button>
          {!past && !closed && (
            <a
              href={`/registration-design/${event.id}`}
              className="h-10 flex-1 rounded-full bg-[#f4d03f] text-center text-[12px] font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
            >
              Sign up
            </a>
          )}
        </div>
      </div>
    </div>
  );
}