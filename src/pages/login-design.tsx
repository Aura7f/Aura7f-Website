import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Sparkles, Swords } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import TopNav from '../components/homedesign/TopNav';
import Footer from '../components/homedesign/Footer';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;
const DISCORD_RETURN_PATH_KEY = 'discord_oauth_return_to';

const DiscordMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.491c-1.923-.9-3.954-1.406-6.083-1.431-.275-.038-.541.042-.689.135-.6.324-.598.325-.698.385-.245.135-1.678.813-1.678.813.3-.091.586-.182.889-.27.319-.087.615-.177.905-.245 1.816-.369 3.598-.309 5.205.236.418.14.957.314 1.466.573-1.022-.635-2.679-1.42-4.618-1.42-.393 0-.779.046-1.155.135-.077.014-.155.028-.231.043-.414.077-.828.155-1.242.232.378-.108.757-.216 1.135-.324 1.834-.477 3.636-.356 5.343.24z" />
    <path d="M4.692 6.846c.915-1.049 2.118-1.971 3.511-2.511.108 1.562.906 2.969 2.079 4.018-.975-.261-1.922-.654-2.822-1.191-.36-.227-.703-.479-1.019-.776-.233-.209-.448-.43-.648-.659-.027.077-.053.15-.08.23-.322.896-.28 1.97.183 2.868.1.19.21.37.33.54-.22-.056-.438-.12-.653-.19-.943-.313-1.78-.814-2.388-1.467-.23-.249-.431-.52-.604-.806-.141-.228-.265-.468-.369-.715-.151-.375-.237-.778-.217-1.176.01-.19.036-.378.075-.562z" />
  </svg>
);

export default function LoginDesign() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [discordBusy, setDiscordBusy] = useState(false);
  const [error, setError] = useState('');
  const handledCode = useRef<string | null>(null);

  const code = searchParams.get('code');

  const handleDiscordCallback = async (authCode: string) => {
    setDiscordBusy(true);
    setError('');
    try {
      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID || '',
          client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET || '',
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: DISCORD_REDIRECT_URI || '',
          scope: 'identify email',
        }).toString(),
      });
      if (!response.ok) throw new Error('Discord rejected the request. Try again.');
      const { access_token } = await response.json();

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { authorization: `Bearer ${access_token}` },
      });
      if (!userResponse.ok) throw new Error('Could not read your Discord profile.');
      const discordUser = await userResponse.json();

      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('discord_user_id', discordUser.id)
        .single();
      if (dbError || !dbUser)
        throw new Error('Access denied: this Discord account is not in the Aura-7F roster.');

      sessionStorage.setItem(
        'discordUser',
        JSON.stringify({
          id: discordUser.id,
          username: discordUser.username,
          email: discordUser.email,
          avatar: discordUser.avatar,
          discriminator: discordUser.discriminator,
          loginTime: new Date().toISOString(),
        })
      );
      localStorage.setItem('discordAccessToken', access_token);
      sessionStorage.removeItem(DISCORD_RETURN_PATH_KEY);

      navigate(dbUser.role?.toLowerCase() === 'captain bash' ? '/admindashboard' : '/guestdashboard', {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discord login failed.');
      setDiscordBusy(false);
    }
  };

  useEffect(() => {
    if (code && handledCode.current !== code) {
      handledCode.current = code;
      handleDiscordCallback(code);
    }
  }, [code]);

  const handleDiscordLogin = () => {
    if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
      setError('Discord is not configured yet. Add VITE_DISCORD_CLIENT_ID and VITE_DISCORD_REDIRECT_URI to .env');
      return;
    }
    sessionStorage.setItem(DISCORD_RETURN_PATH_KEY, `${window.location.pathname}${window.location.search}`);

    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.append('client_id', DISCORD_CLIENT_ID);
    url.searchParams.append('redirect_uri', DISCORD_REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'identify email');
    url.searchParams.append('prompt', 'consent');
    window.location.href = url.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    if (result.success) navigate('/admin');
    else setError(result.error || 'The gates stay shut. Check your credentials.');
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      <div className="absolute inset-0">
        <img src="/coc-nav-bg.jpg" alt="Aura-7F village" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <TopNav />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-24 pt-32">
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#2a1c0b]/95 to-[#150e06]/95 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.65)] ring-2 ring-[#f4d03f]/45 backdrop-blur-md">
            <div className="absolute inset-2 rounded-2xl border border-[#f4d03f]/20" />

            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4d03f]/10 ring-2 ring-[#f4d03f]/50">
                <ShieldCheck className="h-8 w-8 text-[#f4d03f]" />
              </span>
              <h1 className="text-coc-gold mt-5 text-3xl font-black uppercase tracking-[0.15em] sm:text-4xl">
                Guild Gate
              </h1>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
                Clash login
              </p>
            </div>

            {error && (
              <p className="relative mt-6 rounded-xl bg-red-950/60 px-4 py-3 text-center text-[13px] font-semibold text-red-200 ring-1 ring-red-500/40">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleDiscordLogin}
              disabled={loading || discordBusy}
              className="relative mt-8 flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] px-6 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(88,101,242,0.35)] transition-all hover:bg-[#4752c4] hover:shadow-[0_0_36px_rgba(88,101,242,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {discordBusy ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" /> Unlocking gates…
                </>
              ) : (
                <>
                  <DiscordMark className="h-5 w-5" /> Continue with Discord
                </>
              )}
            </button>

            <div className="relative my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/15" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">or</span>
              <span className="h-px flex-1 bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="raider@aura7f.in"
                  className="mt-2 h-12 w-full rounded-xl bg-black/50 px-4 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80">
                  Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onSubmit={handleSubmit}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-2 h-12 w-full rounded-xl bg-black/50 px-4 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60"
                />
              </div>

              <button
                type="submit"
                disabled={loading || discordBusy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f4d03f] px-6 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" /> Entering…
                  </>
                ) : (
                  <>
                    <Swords className="h-4 w-4" /> Enter the village
                  </>
                )}
              </button>
            </form>

            <p className="relative mt-6 text-center text-[11px] leading-relaxed text-white/35">
              Discord access is limited to members on the Aura-7F roster.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
