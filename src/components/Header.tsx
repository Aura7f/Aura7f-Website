import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info, Menu, X, LogIn, LogOut, Settings, Sparkles, Scroll, Crown, Sword, Code, Flag, Brain, Gem, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ui/ThemeToggle'
import { Navbar, NavBody, MobileNav } from './ui/resizable-navbar'
import { handleDiscordLogin } from '../lib/utils'
import { supabase } from '../lib/supabase'
import MemberCardMDB from './MemberCardMDB'
import { Footer } from './index'

const navItems = [
  { to: '/home', icon: Home, label: 'Home', scrollId: 'home-title' },
  { to: '/newhome', icon: Gem, label: 'NewHome', scrollId: 'home-title' },
  { to: '/about', icon: Scroll, label: 'Lore', scrollId: 'about-title' },
  { to: '/members', icon: Users, label: 'Clan', scrollId: 'members-title' },
  { to: '/events', icon: Sword, label: 'Quests', scrollId: 'events-title' },
  { to: '/projects', icon: Code, label: 'Projects', scrollId: 'projects-title' },
  { to: '/milestones', icon: Flag, label: 'Milestones', scrollId: 'milestones-title' },
  { to: '/quiz/auth', icon: Brain, label: 'Quiz', scrollId: '' },
  { to: '/gallery', icon: Sparkles, label: 'Gallery', scrollId: '' }
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme } = useTheme()
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [hideHeader, setHideHeader] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [adminMembers, setAdminMembers] = useState<any[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)
  const membersSectionRef = useRef<HTMLElement | null>(null)
  const lastScrollY = useRef(0)

  const handleNavClick = (e: React.MouseEvent, to: string, scrollId: string) => {
    e.preventDefault()
    if (location.pathname === to) {
      const element = document.getElementById(scrollId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      navigate(to)
      setTimeout(() => {
        const element = document.getElementById(scrollId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Members section reads the same Admin Dashboard source (public.users table,
  // read-only). Clan page data (Clan API) is never used here.
  // Role values match the Admin Dashboard role picker (case-insensitive):
  // captains are stored as 'captain bash', bottom group as 'Legacy Basher'.
  const normRole = (role: any) => (role || '').trim().toLowerCase()
  const isCaptainBash = (m: any) => {
    const r = normRole(m?.role)
    return r === 'captain bash' || r === 'captain basher'
  }
  const isLegacyBash = (m: any) => normRole(m?.role) === 'legacy basher'

  const toggleMembersSection = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    setMobileMenuOpen(false)
    if (membersOpen) {
      setMembersOpen(false)
      return
    }
    setMembersOpen(true)
    if (adminMembers.length === 0 && !membersLoading) {
      setMembersLoading(true)
      setMembersError(null)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, external_name, avatar_url, role, is_clan_member')
          .order('username', { ascending: true })
        if (error) throw error
        setAdminMembers(data || [])
      } catch (err: any) {
        setMembersError(err?.message || 'Could not load members.')
      } finally {
        setMembersLoading(false)
      }
    }
    if (membersSectionRef.current) {
      membersSectionRef.current.scrollTop = 0
    }
  }

  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset
      if (currentScrollY < 50) {
        setHideHeader(false)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideHeader(true)
      } else if (currentScrollY < lastScrollY.current) {
        setHideHeader(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setHideHeader(false)
    lastScrollY.current = 0
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    setMembersOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-active')
    } else {
      document.body.classList.remove('mobile-menu-active')
    }
    return () => document.body.classList.remove('mobile-menu-active')
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <>
      <Navbar>
        <NavBody>
          {/* Logo - Left */}
          <Link to="/home" aria-label="Home" className="flex items-center gap-3 z-10 group mr-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300 relative bg-black">
                <img
                  src="/Aura-7f.png"
                  alt="Aura-7F logo"
                  className="w-12 h-12 object-cover opacity-90 group-hover:opacity-100"
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    if (!img.src.endsWith('.png')) img.src = '/Aura-7f.png'
                  }}
                />
              </div>
            </div>
            <span className="text-lg font-cinzel font-bold tracking-widest text-amber-100 group-hover:text-amber-400 transition-colors duration-300 drop-shadow-md whitespace-nowrap">
              AURA<span className="text-amber-500">-7F</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(({ to, icon: Icon, label, scrollId }) => (
                <React.Fragment key={to}>
                  <NavLink
                    to={to}
                    onClick={(e) => { setMembersOpen(false); handleNavClick(e, to, scrollId); }}
                    className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-cinzel font-medium tracking-wide relative overflow-hidden group whitespace-nowrap
                    ${isActive && !membersOpen
                        ? 'text-amber-400 bg-amber-900/20 shadow-[0_0_15px_rgba(251,191,36,0.1)] border border-amber-500/20'
                        : 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
                      }`}>
                    <Icon size={16} className={`transition-transform duration-300 group-hover:rotate-12 ${location.pathname === to && !membersOpen ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-200'}`} />
                    <span>{label}</span>
                    {location.pathname === to && !membersOpen && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"></div>}
                  </NavLink>
                  {label === 'Clan' && (
                    <button
                      type="button"
                      onClick={toggleMembersSection}
                      aria-label="Members"
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-cinzel font-medium tracking-wide relative overflow-hidden group whitespace-nowrap cursor-pointer
                      ${membersOpen
                        ? 'text-amber-400 bg-amber-900/20 shadow-[0_0_15px_rgba(251,191,36,0.1)] border border-amber-500/20'
                        : 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
                      }`}
                    >
                      <Shield size={16} className={`transition-transform duration-300 group-hover:rotate-12 ${membersOpen ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-200'}`} />
                      <span>Members</span>
                      {membersOpen && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"></div>}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Auth buttons - Right */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 p-2 text-amber-100/70 hover:text-amber-300 transition-colors"
                  title="Dashboard"
                >
                  <Settings size={18} />
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    navigate('/home')
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-red-900/20 border border-red-500/20 text-red-300 rounded-full hover:bg-red-900/40 hover:border-red-500/40 transition-all duration-300 font-cinzel text-xs tracking-wider"
                >
                  <LogOut size={14} />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleDiscordLogin}
                className="flex items-center gap-2 px-6 py-2 bg-amber-600/10 border border-amber-500/40 text-amber-400 rounded-full font-cinzel font-semibold tracking-wider hover:bg-amber-600/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 group"
              >
                <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                <span className="text-xs">LOGIN</span>
              </button>
            )}
          </div>
        </NavBody>

        <MobileNav className="lg:hidden">
          <div className="flex items-center justify-between w-full px-4">
            {/* Mobile Logo */}
            <Link to="/home" aria-label="Home" className="flex items-center gap-3 z-10 group">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-amber-500/30 bg-black">
                <img src="/Aura-7f.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-cinzel font-bold tracking-widest text-amber-100">
                AURA<span className="text-amber-500">-7F</span>
              </span>
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown content linked to same state */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 mx-4 p-5 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-2xl flex flex-col gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50">
              {navItems.map(({ to, icon: Icon, label, scrollId }) => (
                <React.Fragment key={to + '-mobile'}>
                  <NavLink
                    to={to}
                    onClick={(e) => {
                      setMembersOpen(false)
                      handleNavClick(e, to, scrollId)
                      setMobileMenuOpen(false)
                    }}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive && !membersOpen
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-amber-200'
                      }`}
                  >
                    <Icon size={18} />
                    <span className="font-cinzel font-medium">{label.toUpperCase()}</span>
                  </NavLink>
                  {label === 'Clan' && (
                    <button
                      type="button"
                      onClick={toggleMembersSection}
                      aria-label="Members"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left
                        ${membersOpen
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-amber-200'
                      }`}
                    >
                      <Shield size={18} />
                      <span className="font-cinzel font-medium">MEMBERS</span>
                    </button>
                  )}
                </React.Fragment>
              ))}
              <div className="h-[1px] bg-white/10 my-2"></div>
              {user ? (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-amber-200">
                    <Settings size={18} /> <span className="font-cinzel">DASHBOARD</span>
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); navigate('/home') }} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full text-left">
                    <LogOut size={18} /> <span className="font-cinzel">LOGOUT</span>
                  </button>
                </>
              ) : (
                <button onClick={(e) => { setMobileMenuOpen(false); handleDiscordLogin(e); }} className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-lg font-cinzel text-sm font-bold">
                  <LogIn size={16} /> LOGIN
                </button>
              )}
            </div>
          )}
        </MobileNav>
      </Navbar>
      {membersOpen && (() => {
        const captains = adminMembers.filter(isCaptainBash)
        const legacy = adminMembers.filter(isLegacyBash)
        const rest = adminMembers.filter((m) => !isCaptainBash(m) && !isLegacyBash(m))
        const avatarFor = (m: any) =>
          m.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(m.external_name || m.username || 'Member')}&background=0f0518&color=ffd700&size=256`
        const displayName = (m: any) => m.external_name || m.username || 'Unknown member'
        return (
          <section
            ref={membersSectionRef}
            id="members-section"
            className="fixed inset-0 z-40 overflow-y-auto bg-[#05020a] pt-24 pb-12"
          >
            <div className="text-center px-4 pt-4 pb-12 relative z-10">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/20 bg-black/30 backdrop-blur text-amber-400 text-xs font-cinzel font-bold tracking-widest uppercase">
              </div>
              <h1 className="text-4xl sm:text-6xl font-cinzel font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                Members of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Aura</span>
              </h1>
              <p className="max-w-2xl mx-auto text-slate-300 font-lato text-lg">
                {membersLoading
                  ? 'Summoning the members…'
                  : `${adminMembers.length} member${adminMembers.length === 1 ? '' : 's'}`}
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-20">
              {membersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                </div>
              ) : membersError ? (
                <p className="text-sm text-red-400 font-lato py-10 text-center">{membersError}</p>
              ) : adminMembers.length === 0 ? (
                <p className="text-sm text-slate-400 font-lato py-10 text-center">No members found.</p>
              ) : (
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
            <Footer />
          </section>
        )
      })()}
    </>
  )
}
