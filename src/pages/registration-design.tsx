import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  MapPin,
  ShieldCheck,
  Sparkles,
  Swords,
  Timer,
} from 'lucide-react';
import { Event, supabase } from '../lib/supabase';
import { getAvailableSlots, bookSlot } from '../lib/slotApi';
import { formatTime12h, isRegistrationClosed, registrationDeadline } from '../lib/utils';
import { getGoogleSheetsConfig, sendDataToGoogleSheetWebhook } from '../lib/googleSheetsApi';
import TopNav from '../components/homedesign/TopNav';
import Footer from '../components/homedesign/Footer';

const fieldClass =
  'mt-2 h-12 w-full rounded-xl bg-black/50 px-4 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60';

const labelClass = 'text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80';

const STEPS = [
  { n: 1, label: 'Your details' },
  { n: 2, label: 'Pick a day & slot' },
  { n: 3, label: 'Consent' },
];

export default function RegistrationDesign() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');

  const [bookingDay, setBookingDay] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    slotId: '',
    registration_no: '',
    department: '',
    year: '',
    section: '',
    clan: '',
    project_title: '',
    project_category: '',
    project_description: '',
  });
  const [consent, setConsent] = useState({ privacy: false, media: false });
  const [registered, setRegistered] = useState<{ id: string; name: string }[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingMsg, setBookingMsg] = useState('');

  const isShowcase = selectedEvent?.custom_category === 'project_showcase';
  const closed = selectedEvent ? isRegistrationClosed(selectedEvent) : false;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (data && !error) setSelectedEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const fetchSlots = async (id: string, day: number) => {
    setSlotsLoading(true);
    try {
      setAvailableSlots(await getAvailableSlots(id, day));
    } catch (err) {
      console.error(err);
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEvent?.has_slots) fetchSlots(selectedEvent.id, bookingDay);
  }, [selectedEvent, bookingDay]);

  useEffect(() => {
    if (!selectedEvent?.id) return;
    let active = true;
    const fetchRoster = async () => {
      setRosterLoading(true);
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('id, name')
          .eq('event_id', selectedEvent.id)
          .limit(500);
        if (error) {
          console.error('Roster fetch failed:', error.message);
        } else if (active && data) {
          setRegistered(
            [...data]
              .filter((r) => !!r?.name)
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setRosterLoading(false);
      }
    };
    fetchRoster();
    return () => {
      active = false;
    };
  }, [selectedEvent?.id, bookingState]);

  const validateStep = (target: number) => {
    if (target === 2) {
      if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
        setStepError('Enter your name and email to continue.');
        return false;
      }
      if (isShowcase) {
        const missing =
          !bookingForm.registration_no.trim() ||
          !bookingForm.department.trim() ||
          !bookingForm.year.trim() ||
          !bookingForm.section.trim() ||
          !bookingForm.project_title.trim() ||
          !bookingForm.project_category.trim() ||
          !bookingForm.project_description.trim();
        if (missing) {
          setStepError('Fill in every project showcase field to continue.');
          return false;
        }
      }
    }
    if (target === 3 && selectedEvent?.has_slots && !bookingForm.slotId) {
      setStepError('Choose a time slot to continue.');
      return false;
    }
    setStepError('');
    return true;
  };

  const goToStep = (target: number) => {
    if (target > step && !validateStep(target)) return;
    setStep(target);
    setStepError('');
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !bookingForm.name || !bookingForm.email) return;
    if (closed) {
      setBookingState('error');
      setBookingMsg('Registrations for this quest have closed.');
      return;
    }
    if (!consent.privacy) {
      setBookingState('error');
      setBookingMsg('Please accept the privacy policy to finish registering.');
      return;
    }
    if (selectedEvent.has_slots && !bookingForm.slotId) return;

    setBookingState('loading');

    try {
      const payload: any = {
        event_id: selectedEvent.id,
        name: bookingForm.name,
        email: bookingForm.email,
        privacy_consent: consent.privacy,
        media_consent: consent.media,
        consent_at: new Date().toISOString(),
      };

      if (isShowcase) {
        payload.registration_no = bookingForm.registration_no;
        payload.department = bookingForm.department;
        payload.year = bookingForm.year;
        payload.section = bookingForm.section;
        payload.clan = bookingForm.clan;
        payload.project_title = bookingForm.project_title;
        payload.project_category = bookingForm.project_category;
        payload.project_description = bookingForm.project_description;
      }

      const { data: regData, error: regError } = await supabase
        .from('event_registrations')
        .insert(payload)
        .select()
        .single();

      if (regError) throw regError;

      if (selectedEvent.has_slots) {
        try {
          await bookSlot(selectedEvent.id, bookingForm.slotId, bookingForm.email, regData.id);
          fetchSlots(selectedEvent.id, bookingDay);
        } catch (rpcError: any) {
          await supabase.from('event_registrations').delete().eq('id', regData.id);
          throw rpcError;
        }
      }

      const { webhookUrl } = getGoogleSheetsConfig();
      if (webhookUrl) {
        const selectedSlot = availableSlots.find((s) => s.id === bookingForm.slotId);
        const slotTimeStr = selectedSlot
          ? `${formatTime12h(selectedSlot.start_time)} - ${formatTime12h(selectedSlot.end_time)}`
          : '-';

        sendDataToGoogleSheetWebhook(webhookUrl, {
          userName: bookingForm.name,
          userEmail: bookingForm.email,
          slotTime: slotTimeStr,
          day: bookingDay,
          regNo: bookingForm.registration_no || '-',
          department: bookingForm.department || '-',
          yearSection: bookingForm.year ? `Yr ${bookingForm.year} Sec ${bookingForm.section || ''}` : '-',
          clan: bookingForm.clan || '-',
          projectTitle: bookingForm.project_title || '-',
          projectCategory: bookingForm.project_category || '-',
          projectDescription: bookingForm.project_description || '-',
          privacyConsent: consent.privacy ? 'Yes' : 'No',
          mediaConsent: consent.media ? 'Yes' : 'No',
        }).catch((e) => console.error('Google Sheet Webhook auto-sync error:', e));
      }

      setBookingState('success');
      setBookingMsg('Your name is on the ledger. See you at the raid.');
    } catch (err: any) {
      setBookingState('error');
      setBookingMsg(err.message || 'Could not secure your registration.');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
        <div className="absolute inset-0">
          <img src="/bg-meta.png" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <TopNav />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#f4d03f]/25 border-t-[#f4d03f]" />
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
        <div className="absolute inset-0">
          <img src="/bg-meta.png" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <TopNav />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-4">
          <h1 className="text-3xl font-black uppercase tracking-[0.15em] text-white">Quest not found</h1>
          <button
            onClick={() => navigate('/events-design')}
            className="rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
          >
            Back to events
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      <div className="absolute inset-0">
        <img src="/bg-meta.png" alt="Aura-7F village" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <TopNav />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <button
          onClick={() => navigate('/events-design')}
          className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[#f4d03f]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </button>

        <div className="rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4d03f]">Join the raid</span>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
            {selectedEvent.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#f4d03f]" />
              {selectedEvent.date} · {formatTime12h(selectedEvent.time)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#f4d03f]" />
              {selectedEvent.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Timer className="h-4 w-4 text-[#f4d03f]" />
              {closed
                ? 'Registrations closed'
                : `Register by ${registrationDeadline(selectedEvent)?.toLocaleString()}`}
            </span>
          </div>

          {/* ------- registered raiders ------- */}
          <div className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-4">
              <span className={labelClass}>Raiders registered</span>
              <span className="rounded-full bg-[#f4d03f]/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#f4d03f]">
                {registered.length}
              </span>
            </div>

            {rosterLoading ? (
              <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white/40">
                Loading the roster…
              </p>
            ) : registered.length === 0 ? (
              <p className="mt-4 text-sm text-white/45">No raiders yet. Be the first name on the wall.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {registered.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-full bg-black/40 px-3.5 py-1.5 text-[12px] font-bold text-white/75 ring-1 ring-white/15"
                  >
                    {r.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ------- step rail ------- */}
          <ol className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
            {STEPS.map((s) => {
              const state = s.n < step ? 'done' : s.n === step ? 'current' : 'todo';
              return (
                <li key={s.n} className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(s.n)}
                    className={`flex h-9 items-center gap-2 rounded-full px-4 text-[11px] font-black uppercase tracking-widest transition-colors ${
                      state === 'current'
                        ? 'bg-[#f4d03f] text-black'
                        : state === 'done'
                        ? 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15'
                        : 'bg-black/40 text-white/40 ring-1 ring-white/10 hover:text-white/70'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        state === 'current' ? 'bg-black/15' : 'bg-white/10'
                      }`}
                    >
                      {state === 'done' ? <Check className="h-3 w-3" /> : s.n}
                    </span>
                    {s.label}
                  </button>
                  {s.n < STEPS.length && <span className="hidden h-px w-6 bg-white/15 sm:block" />}
                </li>
              );
            })}
          </ol>

          {closed ? (
            <div className="mt-10 rounded-2xl bg-white/5 p-10 text-center ring-1 ring-white/15">
              <h2 className="text-2xl font-black uppercase tracking-[0.15em] text-white">Registrations closed</h2>
              <p className="mt-2 text-sm text-white/55">
                This quest stopped accepting raiders. Check the events page for upcoming raids.
              </p>
              <button
                onClick={() => navigate('/events-design')}
                className="mt-8 rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
              >
                Back to events
              </button>
            </div>
          ) : bookingState === 'success' ? (
            <div className="mt-10 rounded-2xl bg-[#f4d03f]/10 p-10 text-center ring-1 ring-[#f4d03f]/40">
              <Swords className="mx-auto h-10 w-10 text-[#f4d03f]" />
              <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.15em] text-white">
                Registration complete
              </h2>
              <p className="mt-2 text-sm text-white/60">{bookingMsg}</p>
              <button
                onClick={() => navigate('/events-design')}
                className="mt-8 rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
              >
                Back to events
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookSubmit} className="mt-10">
              {/* ------- STEP 1: details ------- */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Raider name</label>
                      <input
                        required
                        type="text"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        required
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="you@aura7f.in"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  {isShowcase && (
                    <div className="border-t border-white/10 pt-8">
                      <div className="mb-6 flex items-center gap-2 text-[#f4d03f]">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Project showcase</span>
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Registration no.</label>
                          <input
                            required
                            type="text"
                            value={bookingForm.registration_no}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, registration_no: e.target.value })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Department</label>
                          <input
                            required
                            type="text"
                            value={bookingForm.department}
                            onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Year &amp; section</label>
                          <div className="mt-2 flex gap-3">
                            <input
                              required
                              type="text"
                              placeholder="Year"
                              value={bookingForm.year}
                              onChange={(e) => setBookingForm({ ...bookingForm, year: e.target.value })}
                              className={`${fieldClass} mt-0`}
                            />
                            <input
                              required
                              type="text"
                              placeholder="Section"
                              value={bookingForm.section}
                              onChange={(e) => setBookingForm({ ...bookingForm, section: e.target.value })}
                              className={`${fieldClass} mt-0`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Clan</label>
                          <input
                            type="text"
                            placeholder="Optional"
                            value={bookingForm.clan}
                            onChange={(e) => setBookingForm({ ...bookingForm, clan: e.target.value })}
                            className={fieldClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Project title</label>
                          <input
                            required
                            type="text"
                            value={bookingForm.project_title}
                            onChange={(e) => setBookingForm({ ...bookingForm, project_title: e.target.value })}
                            className={fieldClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Project category</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. App Dev, Hardware, AI"
                            value={bookingForm.project_category}
                            onChange={(e) => setBookingForm({ ...bookingForm, project_category: e.target.value })}
                            className={fieldClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Project description</label>
                          <textarea
                            required
                            rows={4}
                            value={bookingForm.project_description}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, project_description: e.target.value })
                            }
                            className="mt-2 w-full rounded-xl bg-black/50 px-4 py-3 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ------- STEP 2: day + slot ------- */}
              {step === 2 && (
                <div className="space-y-8">
                  {selectedEvent.has_slots ? (
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className={labelClass}>Choose your day</span>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setBookingDay(d)}
                              className={`h-10 rounded-full px-5 text-xs font-black uppercase tracking-widest transition-colors ${
                                bookingDay === d
                                  ? 'bg-[#f4d03f] text-black'
                                  : 'bg-black/50 text-white/60 ring-1 ring-white/15 hover:text-white'
                              }`}
                            >
                              Day {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        {slotsLoading ? (
                          <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                            Fetching time slots…
                          </p>
                        ) : availableSlots.length === 0 ? (
                          <p className="text-sm font-bold uppercase tracking-widest text-white/40">
                            No slots available for this day. Try another day.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {availableSlots.map((slot) => {
                              const isFull = slot.spots_remaining <= 0;
                              const isSelected = bookingForm.slotId === slot.id;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={isFull}
                                  onClick={() => setBookingForm({ ...bookingForm, slotId: slot.id })}
                                  className={`flex flex-col items-center justify-center rounded-xl px-3 py-4 text-sm transition-all ${
                                    isFull
                                      ? 'cursor-not-allowed bg-black/30 text-white/25 ring-1 ring-white/10'
                                      : isSelected
                                      ? 'bg-[#f4d03f] text-black'
                                      : 'bg-black/50 text-white/70 ring-1 ring-white/15 hover:ring-[#f4d03f]/50'
                                  }`}
                                >
                                  <span className="text-base font-black">{formatTime12h(slot.start_time)}</span>
                                  <span className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-70">
                                    {isFull
                                      ? 'Full'
                                      : `${formatTime12h(slot.end_time)} · ${slot.spots_remaining} spots`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="rounded-2xl bg-white/5 px-5 py-6 text-sm text-white/55 ring-1 ring-white/10">
                      This event has no time slots — you are registered for the whole session. Continue to the
                      consent step.
                    </p>
                  )}
                </div>
              )}

              {/* ------- STEP 3: consent ------- */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-[#f4d03f]">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Permissions</span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                      We only store what this event needs. Please read the{' '}
                      <Link
                        to="/privacy-policy"
                        className="font-bold text-[#f4d03f] underline decoration-[#f4d03f]/40 underline-offset-4 hover:decoration-[#f4d03f]"
                      >
                        privacy policy
                      </Link>{' '}
                      before you tick the boxes.
                    </p>

                    <label className="mt-6 flex cursor-pointer items-start gap-3">
                      <input
                        required
                        type="checkbox"
                        checked={consent.privacy}
                        onChange={(e) => setConsent({ ...consent, privacy: e.target.checked })}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#f4d03f]"
                      />
                      <span className="text-[13px] leading-relaxed text-white/75">
                        I accept the privacy policy and consent to Aura-7F storing my registration details for this
                        event.
                        <span className="ml-1 text-[11px] font-bold uppercase tracking-widest text-[#f4d03f]">
                          Required
                        </span>
                      </span>
                    </label>

                    <label className="mt-4 flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={consent.media}
                        onChange={(e) => setConsent({ ...consent, media: e.target.checked })}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#f4d03f]"
                      />
                      <span className="text-[13px] leading-relaxed text-white/75">
                        I consent to being photographed, my photos/screens being posted on Instagram and other
                        socials, my name appearing in participant name lists, and this event being streamed on
                        YouTube.
                        <span className="ml-1 text-[11px] font-bold uppercase tracking-widest text-white/40">
                          Optional — skip this and we will not publish you
                        </span>
                      </span>
                    </label>

                    <p className="mt-5 flex items-start gap-2 text-[12px] leading-relaxed text-white/45">
                      <Camera className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                      You can withdraw media consent later by mailing aura7f.bytebashblitz@gmail.com.
                    </p>
                  </div>

                  {bookingState === 'error' && (
                    <p className="rounded-xl bg-red-950/50 px-4 py-3 text-center text-sm font-bold text-red-200 ring-1 ring-red-500/40">
                      {bookingMsg}
                    </p>
                  )}
                </div>
              )}

              {/* ------- nav ------- */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step - 1)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest text-white/70 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step + 1)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={bookingState === 'loading' || !consent.privacy}
                    className="h-12 rounded-xl bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#e0be36] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {bookingState === 'loading' ? 'Securing your spot…' : 'Register now'}
                  </button>
                )}
              </div>

              {stepError && (
                <p className="mt-4 text-center text-[12px] font-bold uppercase tracking-widest text-red-300">
                  {stepError}
                </p>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
