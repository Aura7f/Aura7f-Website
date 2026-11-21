import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Clock,
  Crown,
  Database,
  Loader2,
  Radio,
  RefreshCw,
  Search,
  Timer,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type RangeKey = '7d' | '30d' | '90d' | 'all';

interface VoiceSession {
  id: string;
  session_id: string;
  discord_user_id: string;
  username: string | null;
  display_name: string | null;
  clan_name: string | null;
  guild_id: string | null;
  voice_channel_id: string | null;
  join_time: string;
  leave_time: string | null;
  duration_seconds: number | null;
  session_date: string;
  created_at: string;
}

interface DayBucket {
  date: string;
  seconds: number;
  sessions: number;
  users: Set<string>;
}

interface AttendanceMember {
  id: string;
  name: string;
  clan: string;
  seconds: number;
  sessions: number;
  firstJoin: string;
  lastLeave: string;
}

interface DailyRow extends DayBucket {
  topMember: string;
  topMemberSeconds: number;
  members: AttendanceMember[];
}

interface LeaderEntry {
  id: string;
  name: string;
  clan: string;
  seconds: number;
  sessions: number;
  lastSeen: string;
}

const IST = 'Asia/Kolkata';

const CLAN_STYLES: Record<string, { text: string; chip: string; bar: string; dot: string }> = {
  AURA: {
    text: 'text-amber-300',
    chip: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    bar: 'from-amber-600 to-amber-300',
    dot: 'bg-amber-400',
  },
  BELMONT: {
    text: 'text-purple-300',
    chip: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    bar: 'from-purple-600 to-purple-300',
    dot: 'bg-purple-400',
  },
  LUMINA: {
    text: 'text-cyan-300',
    chip: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    bar: 'from-cyan-600 to-cyan-300',
    dot: 'bg-cyan-400',
  },
  SHADASTRIA: {
    text: 'text-emerald-300',
    chip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    bar: 'from-emerald-600 to-emerald-300',
    dot: 'bg-emerald-400',
  },
  Unassigned: {
    text: 'text-slate-300',
    chip: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
    bar: 'from-slate-600 to-slate-300',
    dot: 'bg-slate-400',
  },
};

const clanStyle = (clan: string) => CLAN_STYLES[clan] || CLAN_STYLES.Unassigned;

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const todayKey = toDateKey(new Date());

function formatDuration(seconds: number) {
  const value = Math.max(0, Math.round(seconds || 0));
  if (value < 60) return `${value}s`;
  const hours = Math.floor(value / 3600);
  const minutes = Math.round((value % 3600) / 60);
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  return `${minutes}m`;
}

function formatCompact(seconds: number) {
  const hours = (seconds || 0) / 3600;
  if (hours >= 100) return `${Math.round(hours)}h`;
  return `${hours.toFixed(1)}h`;
}

function formatSessionDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function formatJoinTime(value: string) {
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: IST,
  });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatTimeRange(start: string, end: string) {
  return `${formatJoinTime(start)} – ${formatJoinTime(end)}`;
}

function groupByClan(members: AttendanceMember[]) {
  const groups = new Map<string, AttendanceMember[]>();
  members.forEach((member) => {
    const list = groups.get(member.clan) || [];
    list.push(member);
    groups.set(member.clan, list);
  });
  return Array.from(groups.entries()).sort(
    (a, b) =>
      b[1].reduce((sum, member) => sum + member.seconds, 0) -
      a[1].reduce((sum, member) => sum + member.seconds, 0)
  );
}

export default function Data() {
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>('30d');
  const [clan, setClan] = useState('ALL');
  const [query, setQuery] = useState('');
  const [visibleSessions, setVisibleSessions] = useState(12);
  const [visibleDays, setVisibleDays] = useState(8);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('daily_voice_monitor_sessions')
        .select('*')
        .order('join_time', { ascending: false })
        .limit(5000);

      if (fetchError) throw fetchError;
      setSessions((data || []) as VoiceSession[]);
    } catch (err: any) {
      setError(err?.message || 'Could not load voice data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setVisibleSessions(12);
    setExpandedDay(null);
  }, [query, range, clan]);

  const cleanSessions = useMemo(
    () =>
      sessions.filter((session) => {
        if (session.session_date > todayKey) return false;
        if (session.discord_user_id === 'test_user_verification_123') return false;
        if (session.session_id?.includes('_verify_')) return false;
        return true;
      }),
    [sessions]
  );

  const latestDate = useMemo(
    () =>
      cleanSessions.reduce(
        (latest, session) => (session.session_date > latest ? session.session_date : latest),
        ''
      ),
    [cleanSessions]
  );

  const anchorDate = latestDate || todayKey;

  const clanOptions = useMemo(() => {
    const names = new Set(cleanSessions.map((session) => session.clan_name || 'Unassigned'));
    return ['ALL', ...Array.from(names).sort()];
  }, [cleanSessions]);

  const rangeStart = useMemo(() => {
    if (range === 'all') return '0000-00-00';
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const start = new Date(`${anchorDate}T00:00:00`);
    start.setDate(start.getDate() - (days - 1));
    return toDateKey(start);
  }, [range, anchorDate]);

  const filtered = useMemo(
    () =>
      cleanSessions.filter(
        (session) =>
          session.session_date >= rangeStart &&
          (clan === 'ALL' || (session.clan_name || 'Unassigned') === clan)
      ),
    [cleanSessions, rangeStart, clan]
  );

  const stats = useMemo(() => {
    const totalSeconds = filtered.reduce(
      (sum, session) => sum + (session.duration_seconds || 0),
      0
    );
    const uniqueMembers = new Set(filtered.map((session) => session.discord_user_id)).size;
    const activeDays = new Set(filtered.map((session) => session.session_date)).size;
    const longest = filtered.reduce(
      (max, session) => Math.max(max, session.duration_seconds || 0),
      0
    );

    return {
      totalSeconds,
      sessionCount: filtered.length,
      uniqueMembers,
      activeDays,
      longest,
      averageSeconds: filtered.length ? totalSeconds / filtered.length : 0,
    };
  }, [filtered]);

  const chartData = useMemo(() => {
    if (filtered.length === 0) return [] as DayBucket[];

    const buckets = new Map<string, DayBucket>();
    filtered.forEach((session) => {
      const bucket = buckets.get(session.session_date) || {
        date: session.session_date,
        seconds: 0,
        sessions: 0,
        users: new Set<string>(),
      };
      bucket.seconds += session.duration_seconds || 0;
      bucket.sessions += 1;
      bucket.users.add(session.discord_user_id);
      buckets.set(session.session_date, bucket);
    });

    const firstDate = filtered.reduce(
      (earliest, session) =>
        session.session_date < earliest ? session.session_date : earliest,
      filtered[0].session_date
    );
    const start = range === 'all' ? firstDate : rangeStart;
    const end = latestDate || firstDate;
    const days: DayBucket[] = [];
    const cursor = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);

    while (cursor <= endDate && days.length < 120) {
      const key = toDateKey(cursor);
      days.push(
        buckets.get(key) || {
          date: key,
          seconds: 0,
          sessions: 0,
          users: new Set<string>(),
        }
      );
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [filtered, range, rangeStart, latestDate]);

  const maxDaySeconds = useMemo(
    () => chartData.reduce((max, day) => Math.max(max, day.seconds), 1),
    [chartData]
  );

  const dailyRows = useMemo(() => {
    const buckets = new Map<string, DayBucket>();
    const memberPerDay = new Map<string, Map<string, AttendanceMember>>();

    filtered.forEach((session) => {
      const bucket = buckets.get(session.session_date) || {
        date: session.session_date,
        seconds: 0,
        sessions: 0,
        users: new Set<string>(),
      };
      bucket.seconds += session.duration_seconds || 0;
      bucket.sessions += 1;
      bucket.users.add(session.discord_user_id);
      buckets.set(session.session_date, bucket);

      const dayMembers =
        memberPerDay.get(session.session_date) ||
        new Map<string, AttendanceMember>();
      const name = session.display_name || session.username || 'Unknown';
      const current = dayMembers.get(session.discord_user_id);
      if (current) {
        current.seconds += session.duration_seconds || 0;
        current.sessions += 1;
        current.name = name;
        if (!current.clan && session.clan_name) current.clan = session.clan_name;
        if (session.join_time < current.firstJoin) current.firstJoin = session.join_time;
        if ((session.leave_time || session.join_time) > current.lastLeave) {
          current.lastLeave = session.leave_time || session.join_time;
        }
      } else {
        dayMembers.set(session.discord_user_id, {
          id: session.discord_user_id,
          name,
          clan: session.clan_name || 'Unassigned',
          seconds: session.duration_seconds || 0,
          sessions: 1,
          firstJoin: session.join_time,
          lastLeave: session.leave_time || session.join_time,
        });
      }
      memberPerDay.set(session.session_date, dayMembers);
    });

    return Array.from(buckets.values())
      .map((bucket) => {
        const members = Array.from(memberPerDay.get(bucket.date)?.values() || []).sort(
          (a, b) => b.seconds - a.seconds
        );
        return {
          ...bucket,
          topMember: members[0]?.name || '',
          topMemberSeconds: members[0]?.seconds || 0,
          members,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)) as DailyRow[];
  }, [filtered]);

  const leaders = useMemo(() => {
    const entries = new Map<string, LeaderEntry>();

    filtered.forEach((session) => {
      const name = session.display_name || session.username || 'Unknown';
      const existing = entries.get(session.discord_user_id);
      if (existing) {
        existing.seconds += session.duration_seconds || 0;
        existing.sessions += 1;
        if (session.join_time > existing.lastSeen) {
          existing.lastSeen = session.join_time;
          existing.name = name;
        }
        if (existing.clan === 'Unassigned' && session.clan_name) {
          existing.clan = session.clan_name;
        }
      } else {
        entries.set(session.discord_user_id, {
          id: session.discord_user_id,
          name,
          clan: session.clan_name || 'Unassigned',
          seconds: session.duration_seconds || 0,
          sessions: 1,
          lastSeen: session.join_time,
        });
      }
    });

    return Array.from(entries.values()).sort((a, b) => b.seconds - a.seconds);
  }, [filtered]);

  const clanStats = useMemo(() => {
    const entries = new Map<
      string,
      { clan: string; seconds: number; sessions: number; users: Set<string> }
    >();

    filtered.forEach((session) => {
      const name = session.clan_name || 'Unassigned';
      const entry = entries.get(name) || {
        clan: name,
        seconds: 0,
        sessions: 0,
        users: new Set<string>(),
      };
      entry.seconds += session.duration_seconds || 0;
      entry.sessions += 1;
      entry.users.add(session.discord_user_id);
      entries.set(name, entry);
    });

    return Array.from(entries.values()).sort((a, b) => b.seconds - a.seconds);
  }, [filtered]);

  const maxClanSeconds = useMemo(
    () => clanStats.reduce((max, entry) => Math.max(max, entry.seconds), 1),
    [clanStats]
  );

  const searchedSessions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return filtered;
    return filtered.filter((session) =>
      [
        session.display_name,
        session.username,
        session.discord_user_id,
        session.clan_name,
      ].some((value) => (value || '').toLowerCase().includes(term))
    );
  }, [filtered, query]);

  const statCards = [
    {
      label: 'Voice Time',
      value: formatDuration(stats.totalSeconds),
      hint: `${formatCompact(stats.totalSeconds)} logged`,
      icon: Clock,
      accent: 'text-amber-400',
      ring: 'border-amber-500/20',
    },
    {
      label: 'Sessions',
      value: stats.sessionCount.toLocaleString('en-IN'),
      hint: `avg ${formatDuration(stats.averageSeconds)}`,
      icon: Activity,
      accent: 'text-cyan-400',
      ring: 'border-cyan-500/20',
    },
    {
      label: 'Unique Voices',
      value: stats.uniqueMembers.toLocaleString('en-IN'),
      hint: 'members heard',
      icon: Users,
      accent: 'text-purple-400',
      ring: 'border-purple-500/20',
    },
    {
      label: 'Active Days',
      value: stats.activeDays.toLocaleString('en-IN'),
      hint: `longest ${formatDuration(stats.longest)}`,
      icon: CalendarDays,
      accent: 'text-emerald-400',
      ring: 'border-emerald-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
        <p className="font-cinzel text-sm uppercase tracking-[0.3em] text-slate-400">
          Loading voice data
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <h2 className="font-cinzel text-2xl font-bold text-white">Data Unavailable</h2>
        <p className="max-w-md text-sm text-slate-400">{error}</p>
        <button
          onClick={() => fetchData()}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 font-cinzel text-xs font-bold uppercase tracking-widest text-amber-300 transition hover:bg-amber-500/20"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div id="data-title" className="relative min-h-screen pb-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-amber-900/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-900/10 blur-[140px]" />

      <section className="relative z-10 pb-8 pt-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/40 px-4 py-1.5 text-amber-300 backdrop-blur">
              <Database size={14} />
              <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.3em]">
                Data Vault
              </span>
            </div>
            <h1 className="font-cinzel text-4xl font-bold leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl">
              Voice{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Data
              </span>
            </h1>
            <p className="mt-4 max-w-2xl font-lato text-base leading-relaxed text-slate-400 sm:text-lg">
              Every voice session in the Aura-7F realm, tracked by the daily voice
              monitor. Explore activity, leaders, and clan presence across time.
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-cinzel text-xs font-bold uppercase tracking-widest text-slate-300 transition hover:border-amber-500/30 hover:text-amber-300 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </section>

      <section className="relative z-10 mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['7d', '7 Days'],
              ['30d', '30 Days'],
              ['90d', '90 Days'],
              ['all', 'All Time'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded-full px-4 py-2 font-cinzel text-[11px] font-bold uppercase tracking-widest transition ${
                range === key
                  ? 'border border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.15)]'
                  : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {clanOptions.map((option) => {
            const style = option === 'ALL' ? null : clanStyle(option);
            const active = clan === option;
            return (
              <button
                key={option}
                onClick={() => setClan(option)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition ${
                  active
                    ? option === 'ALL'
                      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                      : style?.chip
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {option !== 'ALL' && (
                  <span className={`h-1.5 w-1.5 rounded-full ${style?.dot}`} />
                )}
                {option === 'ALL' ? 'All Clans' : option}
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`group rounded-2xl border ${card.ring} bg-slate-900/40 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-slate-900/60`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                {card.label}
              </span>
              <card.icon
                size={18}
                className={`${card.accent} transition-transform duration-300 group-hover:scale-110`}
              />
            </div>
            <p className="font-cinzel text-3xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </section>

      <section className="relative z-10 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm sm:p-6 lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-cinzel text-lg font-bold text-white">
                <BarChart3 size={18} className="text-amber-400" />
                Voice Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Voice time logged per day in the selected range
              </p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-widest text-slate-500">
                  Avg Session
                </p>
                <p className="font-cinzel text-sm font-bold text-slate-200">
                  {formatDuration(stats.averageSeconds)}
                </p>
              </div>
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-widest text-slate-500">
                  Longest
                </p>
                <p className="font-cinzel text-sm font-bold text-amber-300">
                  {formatDuration(stats.longest)}
                </p>
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="flex h-52 flex-col items-center justify-center gap-2 text-slate-500">
              <Radio size={22} />
              <p className="text-sm">No sessions in this range</p>
            </div>
          ) : (
            <>
              <div className="flex h-52 items-end gap-1 overflow-x-auto pb-2">
                {chartData.map((day) => {
                  const height = Math.max(2, (day.seconds / maxDaySeconds) * 100);
                  return (
                    <div
                      key={day.date}
                      className="group relative flex h-full min-w-[8px] flex-1 flex-col justify-end"
                      title={`${formatSessionDate(day.date)} · ${formatDuration(
                        day.seconds
                      )} · ${day.sessions} sessions · ${day.users.size} members`}
                    >
                      <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-2.5 py-1.5 text-[10px] text-slate-200 shadow-xl group-hover:block">
                        <span className="font-bold text-amber-300">{formatDuration(day.seconds)}</span>
                        <span className="text-slate-500"> · </span>
                        {day.sessions} sessions
                      </div>
                      <div
                        className={`w-full rounded-t-sm bg-gradient-to-t transition-all duration-300 ${
                          day.seconds > 0
                            ? 'from-amber-600/40 via-amber-500/70 to-amber-300 group-hover:from-amber-500/60 group-hover:to-amber-200'
                            : 'bg-white/5'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-slate-600">
                <span>{formatShortDate(chartData[0].date)}</span>
                <span>{formatShortDate(chartData[chartData.length - 1].date)}</span>
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm sm:p-6">
          <h2 className="flex items-center gap-2 font-cinzel text-lg font-bold text-white">
            <Crown size={18} className="text-purple-400" />
            Clan Presence
          </h2>
          <p className="mt-1 text-xs text-slate-500">Voice time by clan in this range</p>

          <div className="mt-6 space-y-5">
            {clanStats.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No clan data</p>
            ) : (
              clanStats.map((entry) => {
                const style = clanStyle(entry.clan);
                return (
                  <div key={entry.clan}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${style.text}`}>
                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        {entry.clan}
                      </span>
                      <span className="font-cinzel text-xs font-bold text-slate-200">
                        {formatDuration(entry.seconds)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
                        style={{
                          width: `${Math.max(
                            2,
                            (entry.seconds / maxClanSeconds) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] uppercase tracking-widest text-slate-600">
                      {entry.sessions} sessions · {entry.users.size} members
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm sm:p-6 lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-cinzel text-lg font-bold text-white">
                <Activity size={18} className="text-cyan-400" />
                Session Log
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {searchedSessions.length.toLocaleString('en-IN')} sessions found
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search member, clan, or ID"
                className="w-full rounded-full border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <th className="pb-3 pr-3 font-medium">Member</th>
                  <th className="pb-3 pr-3 font-medium">Clan</th>
                  <th className="pb-3 pr-3 font-medium">Date</th>
                  <th className="pb-3 pr-3 font-medium">Joined</th>
                  <th className="pb-3 text-right font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {searchedSessions.slice(0, visibleSessions).map((session) => {
                  const name = session.display_name || session.username || 'Unknown';
                  const style = clanStyle(session.clan_name || 'Unassigned');
                  return (
                    <tr
                      key={session.id}
                      className="border-b border-white/5 text-sm last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-amber-500/20 to-purple-500/20 font-cinzel text-[10px] font-bold text-amber-200">
                            {initials(name)}
                          </div>
                          <span className="max-w-[180px] truncate font-medium text-slate-200">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.chip}`}>
                          <span className={`h-1 w-1 rounded-full ${style.dot}`} />
                          {session.clan_name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-xs text-slate-400">
                        {formatSessionDate(session.session_date)}
                      </td>
                      <td className="py-3 pr-3 text-xs text-slate-500">
                        {formatJoinTime(session.join_time)}
                      </td>
                      <td className="py-3 text-right font-cinzel text-xs font-bold text-slate-200">
                        {formatDuration(session.duration_seconds || 0)}
                      </td>
                    </tr>
                  );
                })}
                {searchedSessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                      No sessions match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {searchedSessions.length > visibleSessions && (
            <button
              onClick={() => setVisibleSessions((current) => current + 12)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 font-cinzel text-[11px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
            >
              Load more sessions
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm sm:p-6">
          <h2 className="flex items-center gap-2 font-cinzel text-lg font-bold text-white">
            <Timer size={18} className="text-amber-400" />
            Top Voices
          </h2>
          <p className="mt-1 text-xs text-slate-500">Most voice time in this range</p>

          <div className="mt-4">
            {leaders.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No leaders yet</p>
            ) : (
              leaders.slice(0, 10).map((leader, index) => {
                const style = clanStyle(leader.clan);
                return (
                  <div
                    key={leader.id}
                    className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0"
                  >
                    <span
                      className={`w-6 shrink-0 text-center font-cinzel text-sm font-bold ${
                        index === 0
                          ? 'text-amber-300'
                          : index === 1
                            ? 'text-slate-300'
                            : index === 2
                              ? 'text-orange-400'
                              : 'text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-purple-500/20 to-amber-500/20 font-cinzel text-[10px] font-bold text-amber-200">
                      {initials(leader.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {leader.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                        <span className={`h-1 w-1 rounded-full ${style.dot}`} />
                        {leader.clan} · {leader.sessions} sessions
                      </p>
                    </div>
                    <span className="font-cinzel text-xs font-bold text-amber-200/90">
                      {formatDuration(leader.seconds)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-cinzel text-lg font-bold text-white">
              <CalendarDays size={18} className="text-emerald-400" />
              Daily Voice Monitor & Attendance
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Day-by-day voice activity grouped by clan. Select a date to view the
              members present.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500">
            {dailyRows.length} active days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <th className="pb-3 pr-3 font-medium">Date</th>
                <th className="pb-3 pr-3 font-medium">Sessions</th>
                <th className="pb-3 pr-3 font-medium">Members</th>
                <th className="pb-3 pr-3 font-medium">Voice Time</th>
                <th className="pb-3 pr-3 font-medium">Top Voice</th>
                <th className="pb-3 text-right font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {dailyRows.slice(0, visibleDays).map((day) => {
                const isExpanded = expandedDay === day.date;
                return (
                  <Fragment key={day.date}>
                    <tr className="border-b border-white/5 text-sm hover:bg-white/[0.02]">
                      <td className="py-3 pr-3 font-medium text-slate-200">
                        {formatSessionDate(day.date)}
                      </td>
                      <td className="py-3 pr-3 text-slate-400">{day.sessions}</td>
                      <td className="py-3 pr-3 text-slate-400">{day.users.size}</td>
                      <td className="py-3 pr-3 font-cinzel text-xs font-bold text-amber-200/90">
                        {formatDuration(day.seconds)}
                      </td>
                      <td className="py-3 pr-3 text-slate-300">
                        {day.topMember ? (
                          <span className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 font-cinzel text-[8px] font-bold text-amber-200">
                              {initials(day.topMember)}
                            </span>
                            <span className="max-w-[220px] truncate">{day.topMember}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-600">
                              {formatDuration(day.topMemberSeconds)}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() =>
                            setExpandedDay(isExpanded ? null : day.date)
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition ${
                            isExpanded
                              ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-amber-500/30 hover:text-amber-300'
                          }`}
                        >
                          {isExpanded ? 'Hide' : 'View'}
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-white/5 bg-black/20">
                        <td colSpan={6} className="p-0">
                          <div className="px-4 py-5">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                <Users size={13} className="text-amber-400" />
                                Attendance · {day.members.length}{' '}
                                {day.members.length === 1 ? 'member' : 'members'}
                              </p>
                              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                                {formatSessionDate(day.date)}
                              </p>
                            </div>
                            <div className="space-y-5">
                              {groupByClan(day.members).map(([clanName, members]) => {
                                const style = clanStyle(clanName);
                                const clanSeconds = members.reduce(
                                  (sum, member) => sum + member.seconds,
                                  0
                                );
                                return (
                                  <div key={clanName}>
                                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                                      <p
                                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${style.text}`}
                                      >
                                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                                        {clanName}
                                        <span className="font-normal text-slate-500">
                                          · {members.length}{' '}
                                          {members.length === 1 ? 'member' : 'members'} present
                                        </span>
                                      </p>
                                      <span className="font-cinzel text-[10px] font-bold text-slate-400">
                                        {formatDuration(clanSeconds)}
                                      </span>
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      {members.map((member) => (
                                        <div
                                          key={member.id}
                                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
                                        >
                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-amber-500/20 to-purple-500/20 font-cinzel text-[10px] font-bold text-amber-200">
                                            {initials(member.name)}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="flex items-center gap-2 truncate text-xs font-medium text-slate-200">
                                              {member.name}
                                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                                                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                                Present
                                              </span>
                                            </p>
                                            <p className="mt-0.5 truncate text-[10px] tracking-wide text-slate-500">
                                              {member.sessions}{' '}
                                              {member.sessions === 1 ? 'session' : 'sessions'} ·{' '}
                                              {formatTimeRange(member.firstJoin, member.lastLeave)}
                                            </p>
                                          </div>
                                          <span className="shrink-0 font-cinzel text-[11px] font-bold text-amber-200/90">
                                            {formatDuration(member.seconds)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {dailyRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    No daily monitor data in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {dailyRows.length > visibleDays && (
          <button
            onClick={() => setVisibleDays((current) => current + 10)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 font-cinzel text-[11px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
          >
            Show more days
          </button>
        )}
      </section>

      <p className="relative z-10 mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-slate-700">
        Source: daily_voice_monitor_sessions
      </p>
    </div>
  );
}
