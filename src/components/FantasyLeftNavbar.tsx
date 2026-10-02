import React, { useState, useEffect } from 'react';
import DiscordLoginModal from './DiscordLoginModal';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FantasyLeftNavbar() {
    const [showDiscordLogin, setShowDiscordLogin] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [isExiting, setIsExiting] = useState(false);
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => {
            setIsEntering(false);
        }, 1000);
        return () => clearTimeout(t);
    }, []);

    const handleNavClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        if (location.pathname === url) return;
        if (url.startsWith('http')) {
            window.open(url, '_blank');
            return;
        }

        setIsExiting(true);
        setTimeout(() => {
            navigate(url);
        }, 500);
    };

    const leftCloudClass = isExiting ? "translate-x-0" : (isEntering ? "translate-x-0" : "-translate-x-[130%]");
    const rightCloudClass = isExiting ? "translate-x-0" : (isEntering ? "translate-x-0" : "translate-x-[130%]");

    return (
        <>
            <nav className="fixed top-0 left-0 h-full w-24 sm:w-32 md:w-40 z-40 pointer-events-auto flex flex-col items-center py-6"
                 style={{ 
                     backgroundImage: "url('/leftnav1.png')", 
                     backgroundSize: 'cover', 
                     backgroundPosition: 'left top',
                     backgroundRepeat: 'no-repeat',
                     filter: 'drop-shadow(10px 0 20px rgba(0,0,0,0.8))'
                 }}>
                
                <div className="flex flex-col items-center gap-6 md:gap-8 h-full justify-center mt-8">
                    {[
                        { id: 'Home', url: '/newhome', img: '/home2.png', imgClass: 'scale-[1.4]' },
                        { id: 'Events', url: '/newevents', img: '/events1.png', imgClass: 'scale-[1.4]' },
                        { id: 'Projects', url: '/newprojects', img: '/projects1.png', imgClass: 'scale-[1.4]' },
                        { id: 'Members', url: '/newmembers', img: '/members.png', imgClass: 'scale-[1.4]' },
                        { id: 'Gallery', url: '/newgallery', img: '/gallery.png', imgClass: 'scale-[1.4]' },
                    ].map((btn) => {
                        const isActive = location.pathname.startsWith(btn.url);
                        return (
                            <a
                                key={btn.id}
                                href={btn.url}
                                onClick={(e) => handleNavClick(e, btn.url)}
                                className="relative flex flex-col items-center group
                                           transition-transform duration-300 hover:scale-110 active:scale-95"
                            >
                                {isActive && btn.img ? (
                                    <div className="relative w-12 sm:w-16 md:w-20 overflow-visible flex items-center justify-center 
                                                    drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300"
                                        style={{ aspectRatio: "auto" }}>
                                        <img
                                            src={btn.img}
                                            alt={btn.id}
                                            className={`w-full h-auto object-contain ${btn.imgClass || ""}`}
                                        />
                                    </div>
                                ) : btn.img ? (
                                    <div className="relative w-12 sm:w-16 md:w-20 overflow-visible flex items-center justify-center 
                                                    drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300 opacity-80 hover:opacity-100"
                                        style={{ aspectRatio: "auto" }}>
                                        <img
                                            src={btn.img}
                                            alt={btn.id}
                                            className={`w-full h-auto object-contain ${btn.imgClass || ""}`}
                                        />
                                    </div>
                                ) : (
                                    <span className="font-cinzel text-amber-100/70 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase
                                                         group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]
                                                         drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-colors duration-300">
                                        {btn.id}
                                    </span>
                                )}
                            </a>
                        );
                    })}

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDiscordLogin(true);
                        }}
                        className="relative flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 mt-4"
                    >
                        <div className="relative w-16 sm:w-20 md:w-24 overflow-hidden flex items-center justify-center 
                                        drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300"
                            style={{ aspectRatio: "918 / 377" }}>
                            <img
                                src="/login.png"
                                alt="Login"
                                className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-[52%]"
                                style={{ width: "148.8%", height: "180%" }}
                            />
                        </div>
                    </button>
                </div>

                <DiscordLoginModal
                    isOpen={showDiscordLogin}
                    onClose={() => setShowDiscordLogin(false)}
                    onLoginSuccess={() => setShowDiscordLogin(false)}
                    title="Guild Authentication"
                    subtitle="Login to access all features"
                />
            </nav>

            {/* Clash of Clans Style Cloud Battle Screen Transition */}
            <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden h-[100dvh]">
                <div className="absolute inset-0 w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <div
                        className={`absolute top-0 bottom-0 left-0 w-[52vw] bg-[#f8f9fa] flex flex-col justify-center items-end
                                    transition-transform duration-500 ease-in-out ${leftCloudClass}`}
                    >
                        <div className="absolute top-[-5vh] bottom-[-5vh] right-0 w-[10vh] pointer-events-none flex flex-col justify-between overflow-visible">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="absolute bg-[#f8f9fa] rounded-full w-[15vh] h-[15vh]"
                                    style={{ top: `${i * 6 - 5}vh`, right: '-7.5vh' }}>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`absolute top-0 bottom-0 right-0 w-[52vw] bg-[#f8f9fa] flex flex-col justify-center items-start
                                    transition-transform duration-500 ease-in-out ${rightCloudClass}`}
                    >
                        <div className="absolute top-[-5vh] bottom-[-5vh] left-0 w-[10vh] pointer-events-none flex flex-col justify-between overflow-visible">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="absolute bg-[#f8f9fa] rounded-full w-[15vh] h-[15vh]"
                                    style={{ top: `${i * 6 - 5}vh`, left: '-7.5vh' }}>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 delay-200 z-50
                                ${isExiting || isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                >
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full blur-[60px] opacity-60 animate-pulse"></div>
                        <img
                            src="/logonew.png"
                            alt="Aura Battle"
                            className="relative w-64 md:w-96 h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
