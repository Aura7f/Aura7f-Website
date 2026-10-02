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
      let newStatus = event.status;
      if (now >= startTime && event.status === 'upcoming') newStatus = 'live';
      if (endTime && now >= endTime && event.status === 'live') newStatus = 'ended';
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

  const live = useMemo(() => events.filter((e) => e.status === 'live'), [events]);
  const upcoming = useMemo(() => events.filter((e) => e.status === 'upcoming'), [events]);
  const past = useMemo(
    () => events.filter((e) => e.status === 'ended' || e.status === 'completed'),
    [events]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(eventCategory(e)));
    return Array.from(set).filter(Boolean).sort();
  }, [events]);

  return { events, loading, live, upcoming, past, categories };
}