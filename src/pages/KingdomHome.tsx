import React from 'react';
import { Youtube, Twitter, Facebook, MessageSquare, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const KingdomHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#c8b598] font-sans overflow-x-hidden relative py-10">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      {/* Main Container simulating the parchment scroll */}
      <div className="relative z-10 max-w-4xl mx-auto bg-[#fbf5e6] rounded-sm shadow-2xl border-4 border-[#5b4033] min-h-screen p-8 mb-20" style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 60px rgba(180, 150, 110, 0.4)'
      }}>
        
        {/* Header / Top Nav replacement */}
        <div className="flex justify-center -mt-16 mb-12">
            <div className="bg-[#5b4033] border-4 border-[#3a271d] rounded-xl px-8 py-4 text-center shadow-xl relative transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                 <h1 className="text-4xl md:text-6xl font-black text-[#f4d03f] tracking-wider uppercase" style={{ textShadow: '3px 3px 0 #3a271d, -1px -1px 0 #3a271d, 1px -1px 0 #3a271d, -1px 1px 0 #3a271d, 1px 1px 0 #3a271d' }}>
                    Aura-7F
                 </h1>
                 <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest mt-1" style={{ textShadow: '2px 2px 0 #3a271d' }}>
                    Frontiers
                 </h2>
            </div>
        </div>

        {/* Video / Hero Section */}
        <div className="relative bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl mb-12 mx-auto max-w-3xl">
            <div className="aspect-video bg-[#8c7b6c] relative flex items-center justify-center overflow-hidden rounded border-2 border-black">
               {/* Placeholder for video/hero image */}
               <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
               <button className="relative z-10 w-24 h-24 bg-[#f4d03f] rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-[#3a271d] ml-2" fill="currentColor" />
               </button>
            </div>
            
            {/* Social sidebar elements */}
            <div className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                <SocialBtn icon={<Twitter />} color="bg-[#55acee]" />
                <SocialBtn icon={<Facebook />} color="bg-[#3b5998]" />
                <SocialBtn icon={<MessageSquare />} color="bg-[#ff9900]" />
                <SocialBtn icon={<Youtube />} color="bg-[#cd201f]" />
            </div>
        </div>

        {/* Ad Banner */}
        <div className="w-full max-w-2xl mx-auto h-20 bg-[#5b4033] border-4 border-[#3a271d] rounded-lg shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center mb-12 overflow-hidden">
            <span className="text-[#3a271d] font-black text-3xl uppercase tracking-widest opacity-40">Ad Banner</span>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-8">
            <div className="w-3/4 h-[2px] bg-[#d5c3aa] border-b border-[#fff]"></div>
        </div>

        {/* Reviews and Awards */}
        <div className="grid md:grid-cols-2 gap-10 mb-12 px-4">
            <div>
                <h3 className="text-3xl font-black text-center mb-6 text-[#3a271d] uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Reviews</h3>
                <div className="flex items-center justify-between">
                    <button className="text-[#8c7b6c] hover:text-[#5b4033] transition-colors"><ChevronLeft className="w-10 h-10" strokeWidth={3} /></button>
                    <div className="text-center px-4">
                        <p className="text-[#5b4033] font-semibold text-lg mb-6 leading-snug">
                            "Aura-7F is a beaut of a developer clan, with new ideas that make it feel extremely polished and refined."
                        </p>
                        <button className="bg-gradient-to-b from-[#8b7565] to-[#5a483a] text-white font-black py-2 px-8 rounded-full border-2 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider text-sm">
                            TechToPlay
                        </button>
                    </div>
                    <button className="text-[#8c7b6c] hover:text-[#5b4033] transition-colors"><ChevronRight className="w-10 h-10" strokeWidth={3} /></button>
                </div>
                {/* Pagination dots */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                </div>
            </div>
            
            <div>
                <h3 className="text-3xl font-black text-center mb-6 text-[#3a271d] uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Our Awards!</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-[#3a271d] flex flex-col items-center justify-center shadow-lg font-black text-[10px] uppercase text-center leading-tight text-[#3a271d] transform -rotate-6">Best<br/>Clan</div>
                    <div className="w-16 h-16 bg-gradient-to-b from-red-500 to-red-700 rounded-lg border-4 border-[#3a271d] flex items-center justify-center shadow-lg font-black text-xs uppercase text-center text-white transform rotate-3">IGN<br/>Choice</div>
                    <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full border-4 border-[#3a271d] flex flex-col items-center justify-center shadow-lg font-black text-[10px] uppercase text-center leading-tight text-white transform -rotate-3">Must<br/>Have</div>
                    <div className="w-16 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded flex flex-col items-center justify-center shadow-lg font-black text-xl uppercase text-center leading-tight text-white border-2 border-white transform rotate-6">90<span className="text-[8px] font-normal">out of 100</span></div>
                </div>
            </div>
        </div>

        <div className="flex justify-center my-8">
            <div className="w-3/4 h-[2px] bg-[#d5c3aa] border-b border-[#fff]"></div>
        </div>

        {/* Features */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-12 px-4">
            <div className="flex-1 relative w-full max-w-sm mx-auto">
                <div className="bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl transform -rotate-2 relative z-0">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Feature" className="w-full aspect-square object-cover rounded border-2 border-black" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d] font-black uppercase px-6 py-2 rounded-lg border-4 border-[#3a271d] whitespace-nowrap transform rotate-2 shadow-xl text-lg w-11/12 text-center z-10">
                    An Arsenal of<br/>Elite Projects!
                </div>
            </div>
            
            <div className="flex-1">
                <h3 className="text-4xl font-black mb-3 text-[#3a271d] uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Features</h3>
                <h4 className="text-sm font-black text-[#8c7b6c] uppercase mb-4 tracking-widest">Overview</h4>
                <p className="text-[#5b4033] font-medium leading-relaxed mb-4">
                    Defend your codebase against hordes of bugs, legacy code, and other nasty problems in this epic tech packed development clan by Aura-7F.
                </p>
                <p className="text-[#5b4033] font-medium leading-relaxed mb-6">
                    Armed with a mighty arsenal of developers, designers, and crazy innovators, there is no end to the many strategies available at your disposal!
                </p>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]"></div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-center my-8">
            <div className="w-3/4 h-[2px] bg-[#d5c3aa] border-b border-[#fff]"></div>
        </div>

        {/* Screenshots */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-12 px-4">
            <div className="flex-1 order-2 md:order-1">
                <h3 className="text-4xl font-black mb-4 text-[#3a271d] uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Screenshots</h3>
                <p className="text-[#5b4033] font-medium leading-relaxed mb-6">
                    Select which version you'd like to see and then click any image to see it in its full glory.
                </p>
                <div className="flex flex-col gap-3 max-w-[200px]">
                    <button className="bg-gradient-to-b from-[#f4d03f] to-[#e5a822] text-[#3a271d] font-black py-3 px-6 rounded-lg border-4 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider">
                        Mobile
                    </button>
                    <button className="bg-gradient-to-b from-[#8b7565] to-[#5a483a] text-white font-black py-3 px-6 rounded-lg border-4 border-[#3a271d] shadow-[0_4px_0_#3a271d] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider">
                        Web View
                    </button>
                </div>
                <div className="flex gap-2 mt-6">
                    <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]"></div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                    ))}
                </div>
            </div>
            
            <div className="flex-[1.5] order-1 md:order-2 w-full">
                <div className="bg-[#3a271d] p-3 rounded-xl border-4 border-[#1f130e] shadow-2xl relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Screenshot" className="w-full h-auto rounded border-2 border-black group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-black/50 text-white font-black px-4 py-2 rounded-lg uppercase tracking-widest border-2 border-white">Click to Enlarge</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center my-8">
            <div className="w-3/4 h-[2px] bg-[#d5c3aa] border-b border-[#fff]"></div>
        </div>

        {/* Special Features */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-8 px-4">
             <div className="flex-1 relative w-full max-w-sm mx-auto">
                {/* Simulated comic books stack */}
                <div className="relative h-64">
                    <div className="absolute inset-0 transform -rotate-6 transition-transform hover:-rotate-12 cursor-pointer z-10">
                        <div className="bg-white p-1 rounded border-2 border-gray-300 shadow-lg h-full">
                            <img src="https://images.unsplash.com/photo-1612487528505-d2338264c821?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Comic 1" className="w-full h-full object-cover border border-gray-200" />
                        </div>
                    </div>
                    <div className="absolute inset-0 transform rotate-3 transition-transform hover:rotate-6 cursor-pointer z-20 top-4 left-4">
                        <div className="bg-white p-1 rounded border-2 border-gray-300 shadow-xl h-full">
                            <img src="https://images.unsplash.com/photo-1582657233895-0f37a3a14715?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Comic 2" className="w-full h-full object-cover border border-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-1">
                <h3 className="text-4xl font-black mb-2 text-[#3a271d] uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Special Features:</h3>
                <h4 className="text-xl font-black text-[#8c7b6c] uppercase mb-4 tracking-widest">Comic Book</h4>
                <p className="text-[#5b4033] font-medium leading-relaxed mb-4">
                    Based on the hit clan AURA-7F, comes this epic story that lets you live the universe of Aura in an awesome and fun experience!!!
                </p>
                <p className="text-[#5b4033] font-medium leading-relaxed mb-6">
                    Prepare yourself for this epic journey into the world of AURA-7F!!!
                </p>
                <button className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-3 border-2 border-gray-700 hover:bg-gray-800 transition-colors shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold flex flex-col items-start leading-none">
                        <span className="text-[10px] text-gray-400">Available on</span>
                        <span className="text-lg">GitHub</span>
                    </span>
                </button>
                <div className="flex gap-2 mt-6">
                    <div className="w-3 h-3 rounded-full bg-[#f4d03f] border border-[#3a271d]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#d5c3aa]"></div>
                </div>
            </div>
        </div>
        
      </div>
      
      {/* Footer */}
      <div className="bg-[#1f130e] text-[#8c7b6c] py-6 px-8 text-center text-sm border-t-4 border-[#3a271d] relative z-20 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-black text-white">A</div>
            <span className="uppercase font-bold text-[#d5c3aa] tracking-widest text-xs">Aura-7F</span>
        </div>
        <p>Copyright © 2026 Aura-7F Dev Clan. All rights reserved. | <a href="#" className="text-[#f4d03f] hover:underline">Sitemap</a></p>
        <p className="mt-2 md:mt-0 opacity-50">Site Design inspired by Kingdom Rush</p>
      </div>

    </div>
  );
};

const SocialBtn = ({ icon, color }: { icon: React.ReactNode, color: string }) => (
    <button className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-white flex items-center justify-center shadow-lg text-white hover:scale-110 transition-transform ${color}`}>
        {icon}
    </button>
);

export default KingdomHome;
