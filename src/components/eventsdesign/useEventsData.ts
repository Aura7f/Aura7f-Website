import { useEffect, useMemo, useState } from 'react';
import { supabase, Event } from '../../lib/supabase';

export const eventCategory = (e: Event): string =>
  e.tag === 'Other' && e.custom_category ? e.custom_category : e.tag;

const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    return new Date(`${dateStr} ${timeStr}`);
  } catch {
    return new Date();
  }
};

// An event counts as over once its window has closed: after end_time when set,
// otherwise after its start time. Anything an admin marked live stays live.
const isEventOver = (e: Event, now: Date): boolean => {
  if (e.status === 'ended' || e.status === 'completed') return true;
  if (e.status === 'live') return false;
  const start = parseEventDateTime(e.date, e.time);
  const end = e.end_time ? parseEventDateTime(e.date, e.end_time) : null;
  return now >= (end ?? start);
};

const isEventRunning = (e: Event, now: Date): boolean => {
  if (e.status === 'ended' || e.status === 'completed') return false;
  const start = parseEventDateTime(e.date, e.time);
  const end = e.end_time ? parseEventDateTime(e.date, e.end_time) : null;
  return now >= start && (end ? now < end : e.status === 'live');
};

const checkEventStatuses = async () => {
  try {
    const now = new Date();
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .in('status', ['upcoming', 'live']);
    if (!events) return;
    for (const event of events) {
      const startTime = parseEventDateTime(event.date, event.time);
      const endTime = event.end_time ? parseEventDateTime(event.date, event.end_time) : null;
      const started = now >= startTime;
      const over = !!endTime && now >= endTime;

      let newStatus = event.status;
      // Only promote upcoming -> live while we are inside the event window, so a
      // date edit (e.g. moving an event into the past) never demotes it to ended.
      if (event.status === 'upcoming' && started && !over) newStatus = 'live';
      // Only events already marked live can wind down, and only after their end time.
      if (event.status === 'live' && over) newStatus = 'ended';

      if (newStatus !== event.status) {
        await supabase.from('events').update({ status: newStatus }).eq('id', event.id);
      }
    }
  } catch (err) {
    console.error('Error checking event statuses:', err);
  }
};

export default function useEventsData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      setEvents(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEventStatuses().then(() => fetchEvents());
    const interval = setInterval(() => {
      checkEventStatuses().then(() => fetchEvents());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const live = useMemo(() => events.filter((e) => isEventRunning(e, new Date())), [events]);
  const past = useMemo(() => events.filter((e) => isEventOver(e, new Date())), [events]);
  const upcoming = useMemo(
    () => events.filter((e) => !isEventOver(e, new Date()) && !isEventRunning(e, new Date())),
    [events]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(eventCategory(e)));
    return Array.from(set).filter(Boolean).sort();
  }, [events]);

  return { events, loading, live, upcoming, past, categories };
}