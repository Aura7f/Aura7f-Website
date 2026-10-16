import React from 'react';
import { Crown, Shield } from 'lucide-react';
import { avatarFor, displayName } from './useMembersData';

function MemberCard({ member, isCaptain = false }: { member: any; isCaptain?: boolean }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-black/55 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-md transition-all duration-200 hover:ring-[#f4d03f]/40">
      <div className="flex flex-col items-center p-6 text-center">
        <div
          className={`relative rounded-full p-1 ${
            isCaptain
              ? 'bg-gradient-to-br from-[#f4d03f] via-[#e0be36] to-[#7e5a00] shadow-[0_0_18px_rgba(244,208,63,0.35)]'
              : 'bg-gradient-to-br from-white/25 to-white/5'
          }`}
        >
          <div className="h-24 w-24 overflow-hidden rounded-full bg-black">
            <img
              src={avatarFor(member)}
              alt={displayName(member)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {isCaptain && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-black bg-[#f4d03f] p-1.5 text-black">
              <Crown size={14} fill="black" />
            </div>
          )}
        </div>

        <h3 className={`mt-4 text-lg font-bold leading-tight ${isCaptain ? 'text-[#f4d03f]' : 'text-white'}`}>
          {displayName(member)}
        </h3>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/50">
          {member.role || 'member'}
        </p>
        {member.username && member.external_name && member.username !== member.external_name && (
          <p className="mt-1 text-xs text-white/35">@{member.username}</p>
        )}
      </div>
    </article>
  );
}

export default function MembersBoard({
  captains,
  rest,
  legacy,
  total,
  loading,
  error,
}: {
  captains: any[];
  rest: any[];
  legacy: any[];
  total: number;
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className="relative z-10 w-full">
      {/* ------- home-design theme section backdrop (same as ClanProfile) ------- */}
      <div className="absolute inset-0">
        <img
          src="/bg-meta2.png"
          alt="Aura-7F village lanes"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-10">
        {/* title */}
        <div className="mb-10 flex flex-col items-center gap-3 pt-12 text-center">
          <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-white">
            Clan Roster
          </span>
          <h2 className="text-3xl font-black uppercase tracking-wide text-white drop-shadow-lg sm:text-4xl">
            Members of <span className="text-[#f4d03f]">Aura</span>
          </h2>
          <div className="h-[2px] w-24 rounded-full bg-[#f4d03f]/60" />
          <p className="text-sm text-white/60">
            {loading
              ? 'Summoning the clan…'
              : error
                ? error
                : total === 0
                  ? 'No members found.'
                  : `${total} member${total === 1 ? '' : 's'}`}
          </p>
        </div>

        {loading ? (
          <p className="py-24 text-center text-sm font-bold uppercase tracking-widest text-white/50">
            Loading clan…
          </p>
        ) : error ? (
          <div className="rounded-2xl bg-black/40 py-20 text-center ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-sm font-bold text-white/40">{error}</p>
          </div>
        ) : total === 0 ? (
          <div className="rounded-2xl bg-black/40 py-20 text-center ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-sm font-bold text-white/40">No members found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {captains.length > 0 && (
              <div>
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                  <Crown className="h-8 w-8 text-[#f4d03f] drop-shadow-lg" />
                  <h3 className="text-2xl font-black uppercase tracking-wide text-white">
                    Captain Bashers
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#f4d03f] to-transparent" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {captains.map((m: any) => (
                    <MemberCard key={m.id || m.username} member={m} isCaptain={true} />
                  ))}
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div>
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                  <Shield className="h-8 w-8 text-white/60" />
                  <h3 className="text-xl font-black uppercase tracking-wide text-white/85">Members</h3>
                  <div className="h-px w-20 bg-white/20" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((m: any) => (
                    <MemberCard key={m.id || m.username} member={m} />
                  ))}
                </div>
              </div>
            )}

            {legacy.length > 0 && (
              <div>
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                  <Shield className="h-8 w-8 text-purple-300/70" />
                  <h3 className="text-xl font-black uppercase tracking-wide text-white/85">
                    Legacy Bashers
                  </h3>
                  <div className="h-px w-20 bg-white/20" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {legacy.map((m: any) => (
                    <MemberCard key={m.id || m.username} member={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
