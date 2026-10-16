import React from 'react';
import TopNav from '../components/homedesign/TopNav';
import Footer from '../components/homedesign/Footer';
import MembersBoard from '../components/membersdesign/MembersBoard';
import useMembersData from '../components/membersdesign/useMembersData';

export default function MembersDesign() {
  const { members, captains, rest, legacy, loading, error } = useMembersData();

  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      {/* ------- home-design theme backdrop (same as Home Design page) ------- */}
      <div className="absolute inset-0 h-screen">
        <img
          src="/bg-meta.png"
          alt="Aura-7F village"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <TopNav />
      <MembersBoard
        captains={captains}
        rest={rest}
        legacy={legacy}
        total={members.length}
        loading={loading}
        error={error}
      />
      <Footer />
    </div>
  );
}
