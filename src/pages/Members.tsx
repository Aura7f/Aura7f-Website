import React, { useState, useEffect } from 'react'
import MemberCardMDB from '../components/MemberCardMDB'
import { supabase } from '../lib/supabase'
import { Crown, Shield } from 'lucide-react'

// Members page reads the same Admin Dashboard source (public.users table,
// read-only). Clan page data (Clan API) is never used here.
// Role values match the Admin Dashboard role picker (case-insensitive):
// captains are stored as 'captain bash', bottom group as 'Legacy Basher'.
const normRole = (role: any) => (role || '').trim().toLowerCase()
const isCaptainBash = (m: any) => {
  const r = normRole(m?.role)
  return r === 'captain bash' || r === 'captain basher'
}
const isLegacyBash = (m: any) => normRole(m?.role) === 'legacy basher'

export default function Members() {
  const [adminMembers, setAdminMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async function fetchMembers() {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, external_name, avatar_url, role, is_clan_member')
          .order('username', { ascending: true })
        if (error) throw error
        setAdminMembers(data || [])
      } catch (err: any) {
        setError(err?.message || 'Could not load members.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const captains = adminMembers.filter(isCaptainBash)
  const legacy = adminMembers.filter(isLegacyBash)
  const rest = adminMembers.filter((m) => !isCaptainBash(m) && !isLegacyBash(m))

  const avatarFor = (m: any) =>
    m.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(m.external_name || m.username || 'Member')}&background=0f0518&color=ffd700&size=256`
  const displayName = (m: any) => m.external_name || m.username || 'Unknown member'

  if (loading) {
    return (
      <div id="members-title" className="relative min-h-screen pb-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-amber-100/60 font-cinzel animate-pulse">Summoning the Guild...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="members-title" className="relative min-h-screen pb-12">
      {/* Header */}
      <section className="text-center px-4 pt-12 pb-16 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/20 bg-black/30 backdrop-blur text-amber-400 text-xs font-cinzel font-bold tracking-widest uppercase">
        </div>
        <h1 className="text-4xl sm:text-6xl font-cinzel font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          Members of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Aura</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-300 font-lato text-lg">
          {error
            ? error
            : adminMembers.length === 0
              ? 'No members found.'
              : `${adminMembers.length} member${adminMembers.length === 1 ? '' : 's'}`}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-20">
        {!error && adminMembers.length > 0 && (
          <>
            {captains.length > 0 && (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-amber-500/5 rounded-3xl blur-xl"></div>
                <div className="relative text-center mb-10">
                  <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2 drop-shadow-lg" />
                  <h2 className="text-3xl font-cinzel font-bold text-white">Captain Bashers</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                  {captains.map((m: any) => (
                    <div key={m.id || m.username} className="transform hover:-translate-y-2 transition-transform duration-300">
                      <MemberCardMDB
                        compact={true}
                        compactSize="large"
                        name={displayName(m)}
                        title={m.role || 'member'}
                        avatar={avatarFor(m)}
                        isCaptain={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div>
                <div className="text-center mb-10">
                  <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h2 className="text-2xl font-cinzel font-bold text-slate-200">Members</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {rest.map((m: any) => (
                    <div key={m.id || m.username}>
                      <MemberCardMDB
                        compact={true}
                        compactSize="large"
                        name={displayName(m)}
                        title={m.role || 'member'}
                        avatar={avatarFor(m)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {legacy.length > 0 && (
              <div>
                <div className="text-center mb-10">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h2 className="text-2xl font-cinzel font-bold text-slate-200">Legacy Bashers</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {legacy.map((m: any) => (
                    <div key={m.id || m.username}>
                      <MemberCardMDB
                        compact={true}
                        compactSize="large"
                        name={displayName(m)}
                        title={m.role || 'Legacy Basher'}
                        avatar={avatarFor(m)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
