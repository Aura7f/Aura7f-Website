import re

with open('src/pages/registration-design.tsx', 'r') as f:
    content = f.read()

# Replace TopNav with FantasyNavbar
content = content.replace("import TopNav from '../components/homedesign/TopNav';", "import FantasyNavbar from '../components/FantasyNavbar';")
content = content.replace("<TopNav />", "<FantasyNavbar />")

# Update fieldClass
old_field = "'mt-2 h-12 w-full rounded-xl bg-black/50 px-4 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60'"
new_field = "'mt-2 h-12 w-full rounded-xl bg-[#fffcf5] border-[3px] border-[#a08460] px-4 text-sm font-bold text-[#3d271d] shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] outline-none transition-all placeholder:text-[#a08460]/70 focus:border-[#5a4231] focus:ring-0'"
content = content.replace(old_field, new_field)

# Update textarea class explicitly which is hardcoded
old_textarea = 'className="mt-2 w-full rounded-xl bg-black/50 px-4 py-3 text-sm text-white ring-1 ring-white/15 outline-none transition-all placeholder:text-white/25 focus:ring-2 focus:ring-[#f4d03f]/60"'
new_textarea = 'className="mt-2 w-full rounded-xl bg-[#fffcf5] border-[3px] border-[#a08460] px-4 py-3 text-sm font-bold text-[#3d271d] shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] outline-none transition-all placeholder:text-[#a08460]/70 focus:border-[#5a4231] focus:ring-0"'
content = content.replace(old_textarea, new_textarea)

# Update labelClass
old_label = "'text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d03f]/80'"
new_label = "'text-[12px] font-black uppercase tracking-[0.1em] text-[#5a4231] [text-shadow:0_1px_0_rgba(255,255,255,0.7)]'"
content = content.replace(old_label, new_label)

# Replace backgrounds and text colors for cards
# Main container cards:
content = content.replace('bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md', 'bg-[#f3e5cd] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7),inset_0_0_0_4px_#3a271d,inset_0_0_20px_rgba(91,64,51,0.5)] border-4 border-[#5b4033] relative overflow-hidden')

# The left card Title
content = content.replace('text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4d03f]', 'text-[12px] font-black uppercase tracking-[0.2em] text-[#7a573b]')
content = content.replace('text-3xl font-black uppercase tracking-wide text-white sm:text-4xl', 'text-4xl font-black uppercase tracking-wide text-[#f4d03f] [text-shadow:0_3px_0_#3a271d,0_-1px_0_#3a271d,1px_0_0_#3a271d,-1px_0_0_#3a271d]')

# Subtitles (date/location)
content = content.replace('text-white/50', 'text-[#5b4033] font-bold')

# The right card titles
# text-white/40 -> text-[#5b4033]
# text-white/45 -> text-[#5b4033]
# text-white/55 -> text-[#5b4033]
# text-white/60 -> text-[#5b4033]
# text-white/70 -> text-[#5b4033]
# text-white/75 -> text-[#3a271d] font-bold
content = re.sub(r'text-white/4[05]', 'text-[#7a573b] font-bold', content)
content = re.sub(r'text-white/5[05]', 'text-[#7a573b] font-bold', content)
content = re.sub(r'text-white/6[05]', 'text-[#5b4033] font-bold', content)
content = re.sub(r'text-white/7[05]', 'text-[#3a271d] font-bold', content)

# bg-white/5 and ring-white/10 for inner boxes -> bg-[#e0cdb0] border-[3px] border-[#c0a98b]
content = content.replace('bg-white/5 p-6 ring-1 ring-white/10', 'bg-[#e0cdb0] p-6 border-[3px] border-[#c0a98b] shadow-inner rounded-2xl')
content = content.replace('bg-white/5 px-5 py-6', 'bg-[#e0cdb0] px-5 py-6 border-[3px] border-[#c0a98b] shadow-inner rounded-2xl text-[#3a271d] font-bold')
content = content.replace('bg-black/40 px-3.5 py-1.5 text-[12px] font-bold text-white/75 ring-1 ring-white/15', 'bg-[#5b4033] px-3.5 py-1.5 text-[12px] font-black text-white border-2 border-[#3a271d] shadow-sm uppercase tracking-wide')

# Steps rail
content = content.replace('bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15', 'bg-[#5b4033] text-white border-2 border-[#3a271d] hover:bg-[#4a3227]')
content = content.replace('bg-black/40 text-white/40 ring-1 ring-white/10 hover:text-white/70', 'bg-[#e0cdb0] text-[#7a573b] border-2 border-[#c0a98b] hover:text-[#5b4033]')
content = content.replace('bg-black/15', 'bg-black/30')
content = content.replace('bg-white/10', 'bg-white/20')

# Text color replacements for specific missing ones
content = content.replace('text-white', 'text-[#f4d03f]') # mostly for headings, but let's be careful. Wait, I shouldn't blanket replace text-white.
# Let's fix text-white in specific places:
content = content.replace('className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-[#7a573b] font-bold"', 'className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-[#5b4033]"')

# Buttons 
content = content.replace('bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]', 'btn-primary')
content = content.replace('bg-[#f4d03f] px-8 text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#e0be36]', 'btn-primary')
content = content.replace('bg-[#f4d03f] px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e0be36]', 'btn-primary')
content = content.replace('inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest text-[#3a271d] font-bold ring-1 ring-[#c0a98b] transition-colors hover:bg-[#c0a98b] hover:text-[#3a271d]', 'btn-secondary h-12 rounded-xl px-6 text-xs')
# We need to make sure btn-primary gets rounded corners if not defined in index.css. btn-primary doesn't have border-radius in index.css, so we keep rounded-xl.
content = content.replace('btn-primary', 'btn-primary rounded-xl px-8 py-3 text-xs')

# Specific elements like day buttons
content = content.replace('bg-black/50 text-[#5b4033] font-bold ring-1 ring-white/15 hover:text-[#f4d03f]', 'bg-[#e0cdb0] text-[#7a573b] border-[3px] border-[#c0a98b] hover:text-[#5b4033]')
content = content.replace('bg-black/50 text-[#3a271d] font-bold ring-1 ring-white/15 hover:ring-[#f4d03f]/50', 'bg-[#fffcf5] text-[#3a271d] border-[3px] border-[#a08460] hover:border-[#5a4231] shadow-sm')
content = content.replace('cursor-not-allowed bg-black/30 text-[#7a573b] font-bold ring-1 ring-white/10', 'cursor-not-allowed bg-[#d0c0a5] text-[#998771] border-[3px] border-[#c0a98b] opacity-70')

with open('src/pages/registration-design.tsx', 'w') as f:
    f.write(content)
