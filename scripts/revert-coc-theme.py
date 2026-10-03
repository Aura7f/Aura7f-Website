import re

with open('src/pages/registration-design.tsx', 'r') as f:
    content = f.read()

# Reverse script for apply-coc-theme.py

# Replace TopNav with FantasyNavbar (reversed)
content = content.replace("import FantasyNavbar from '../components/FantasyNavbar';", "import TopNav from '../components/homedesign/TopNav';")
content = content.replace("<FantasyNavbar />", "<TopNav />")

# Update fieldClass (reversed)
old_field = "'mt-2 h-12 w-full rounded-xl bg-black/50 px-4 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60'"
new_field = "'mt-2 h-12 w-full rounded-xl bg-[#fffcf5] border-[3px] border-[#a08460] px-4 text-sm font-bold text-[#3d271d] shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] outline-none transition-all placeholder:text-[#a08460]/70 focus:border-[#5a4231] focus:ring-0'"
content = content.replace(new_field, old_field)

# Update textarea class explicitly which is hardcoded (reversed)
old_textarea = 'className="mt-2 w-full rounded-xl bg-black/50 px-4 py-3 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60"'
new_textarea = 'className="mt-2 w-full rounded-xl bg-[#fffcf5] border-[3px] border-[#a08460] px-4 py-3 text-sm font-bold text-[#3d271d] shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] outline-none transition-all placeholder:text-[#a08460]/70 focus:border-[#5a4231] focus:ring-0"'
content = content.replace(new_textarea, old_textarea)

# Update labelClass (reversed)
old_label = "'text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80'"
new_label = "'text-[12px] font-black uppercase tracking-[0.1em] text-[#5a4231] [text-shadow:0_1px_0_rgba(255,255,255,0.7)]'"
content = content.replace(new_label, old_label)

# Replace backgrounds and text colors for cards (reversed)
old_card_bg = 'bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md'
new_card_bg = 'bg-[#f3e5cd] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7),inset_0_0_0_4px_#3a271d,inset_0_0_20px_rgba(91,64,51,0.5)] border-4 border-[#5b4033] relative overflow-hidden'
content = content.replace(new_card_bg, old_card_bg)

# The left card Title (reversed)
content = content.replace('text-[12px] font-black uppercase tracking-[0.2em] text-[#7a573b]', 'text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4d03f]')
content = content.replace('text-4xl font-black uppercase tracking-wide text-[#f4d03f] [text-shadow:0_3px_0_#3a271d,0_-1px_0_#3a271d,1px_0_0_#3a271d,-1px_0_0_#3a271d]', 'text-3xl font-black uppercase tracking-wide text-white sm:text-4xl')

# Subtitles (date/location) (reversed)
# Note: Reversing `text-[#5b4033] font-bold` back to `text-white/50` is tricky if it conflicts.
content = content.replace('text-[#5b4033] font-bold', 'text-white/50')
# Wait, this will reverse the other usages of text-[#5b4033] font-bold too. We'll handle conflicts later if needed.

# The right card titles (reversed)
# In the original script I did:
# content = re.sub(r'text-white/4[05]', 'text-[#7a573b] font-bold', content)
# content = re.sub(r'text-white/5[05]', 'text-[#7a573b] font-bold', content)
# content = re.sub(r'text-white/6[05]', 'text-[#5b4033] font-bold', content)
# content = re.sub(r'text-white/7[05]', 'text-[#3a271d] font-bold', content)
# It's better to just manually find the lines and replace them in the specific locations or use exact strings.
content = content.replace('text-[#7a573b] font-bold', 'text-white/40') # Approximations, might need manual fixing
content = content.replace('text-[#3a271d] font-bold', 'text-white/75')

# bg-white/5 and ring-white/10 for inner boxes -> bg-[#e0cdb0] border-[3px] border-[#c0a98b] (reversed)
content = content.replace('bg-[#e0cdb0] p-6 border-[3px] border-[#c0a98b] shadow-inner rounded-2xl', 'bg-white/5 p-6 ring-1 ring-white/10')
content = content.replace('bg-[#e0cdb0] px-5 py-6 border-[3px] border-[#c0a98b] shadow-inner rounded-2xl text-[#3a271d] font-bold', 'bg-white/5 px-5 py-6')
content = content.replace('bg-[#5b4033] px-3.5 py-1.5 text-[12px] font-black text-[#f4d03f] border-2 border-[#3a271d] shadow-sm uppercase tracking-wide', 'bg-black/40 px-3.5 py-1.5 text-[12px] font-bold text-white/75 ring-1 ring-white/15')
content = content.replace('bg-[#5b4033] px-3.5 py-1.5 text-[12px] font-black text-white border-2 border-[#3a271d] shadow-sm uppercase tracking-wide', 'bg-black/40 px-3.5 py-1.5 text-[12px] font-bold text-white/75 ring-1 ring-white/15')

# Steps rail (reversed)
content = content.replace('bg-[#5b4033] text-[#f4d03f] border-2 border-[#3a271d] hover:bg-[#4a3227]', 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15')
content = content.replace('bg-[#5b4033] text-white border-2 border-[#3a271d] hover:bg-[#4a3227]', 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15')
content = content.replace('bg-[#e0cdb0] text-[#7a573b] border-2 border-[#c0a98b] hover:text-[#5b4033]', 'bg-black/40 text-white/40 ring-1 ring-white/10 hover:text-white/70')
content = content.replace('bg-black/30', 'bg-black/15')
content = content.replace('bg-white/20', 'bg-white/10')

# Text color replacements for specific missing ones (reversed)
content = content.replace('text-[#f4d03f]', 'text-white')
# We need to manually fix text-white in places that should actually be text-[#f4d03f] (like the original title drop downs)
content = content.replace('text-[11px] font-bold uppercase tracking-[0.3em] text-white', 'text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4d03f]')
content = content.replace('text-[10px] font-bold uppercase tracking-[0.25em] text-white/80', 'text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80')
content = content.replace('bg-white px-8 text-xs font-black uppercase tracking-[0.2em]', 'bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-[0.2em]')
content = content.replace('bg-white px-6 py-3 text-xs font-black uppercase tracking-widest', 'bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest')
content = content.replace('text-white border-4 border-white/25 border-t-white', 'text-[#f4d03f] border-4 border-[#f4d03f]/25 border-t-[#f4d03f]')

# Buttons (reversed)
content = content.replace('btn-primary rounded-xl px-8 py-3 text-xs', 'bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]')
content = content.replace('btn-secondary h-12 rounded-xl px-6 text-xs', 'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest text-white/70 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white')

# Specific elements like day buttons (reversed)
content = content.replace('bg-[#e0cdb0] text-white/40 border-[3px] border-[#c0a98b] hover:text-white/50', 'bg-black/50 text-white/60 ring-1 ring-white/15 hover:text-white')
content = content.replace('bg-[#fffcf5] text-white/75 border-[3px] border-[#a08460] hover:border-[#5a4231] shadow-sm', 'bg-black/50 text-white/70 ring-1 ring-white/15 hover:ring-[#f4d03f]/50')
content = content.replace('cursor-not-allowed bg-[#d0c0a5] text-[#998771] border-[3px] border-[#c0a98b] opacity-70', 'cursor-not-allowed bg-black/30 text-white/25 ring-1 ring-white/10')

# Also, there's another button replacement we need to fix
content = content.replace("className='mt-8 rounded-lg btn-primary rounded-xl px-8 py-3 text-xs'", "className='mt-8 rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]'")
content = content.replace('className="mt-8 rounded-lg btn-primary rounded-xl px-8 py-3 text-xs"', 'className="mt-8 rounded-lg bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]"')

with open('src/pages/registration-design.tsx', 'w') as f:
    f.write(content)
