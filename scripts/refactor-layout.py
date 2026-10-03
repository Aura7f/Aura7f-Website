import re

with open('src/pages/registration-design.tsx', 'r') as f:
    content = f.read()

# Change max-w-4xl to max-w-7xl
content = content.replace('max-w-4xl', 'max-w-7xl')

# We want to change the structure from:
# <main ...>
#   <button ...>
#   <div className="rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">
#      <span ...>
#      ... event details ...
#      {/* ------- registered raiders ------- */}
#      ...
#      {/* ------- step rail ------- */}
#      ... form ...
#   </div>
# </main>
#
# To:
# <main ...>
#   <button ...>
#   <div className="flex flex-col lg:flex-row gap-6 items-start">
#     <div className="flex-1 w-full rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">
#        <span ...>
#        ... event details ...
#        {/* ------- step rail ------- */}
#        ... form ...
#     </div>
#     <div className="w-full lg:w-96 shrink-0 rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">
#        {/* ------- registered raiders ------- */}
#        ...
#     </div>
#   </div>
# </main>

main_div_start = '<div className="rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">'
new_main_div_start = '<div className="flex flex-col lg:flex-row gap-6 items-start">\n        <div className="flex-1 w-full rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">'

content = content.replace(main_div_start, new_main_div_start, 1)

# Now we need to extract the raiders div and move it out of the left column.
raiders_start = '          {/* ------- registered raiders ------- */}'
step_rail_start = '          {/* ------- step rail ------- */}'

raiders_idx = content.find(raiders_start)
step_rail_idx = content.find(step_rail_start)

if raiders_idx != -1 and step_rail_idx != -1:
    raiders_code = content[raiders_idx:step_rail_idx]
    
    # Remove raiders from its original position
    content = content[:raiders_idx] + content[step_rail_idx:]
    
    # We need to close the left column and insert the right column.
    # The end of the left column is the closing div right before </main>
    # Wait, instead of finding </main>, let's just find the closing tag of the main div.
    # It is right before:
    #       </main>
    # 
    #       <Footer />
    # Let's find:
    end_pattern = '        </div>\n      </main>'
    replacement = f'''        </div>
        <div className="w-full lg:w-96 shrink-0 rounded-3xl bg-black/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:p-10">
{raiders_code.rstrip()}
        </div>
      </div>
      </main>'''
    
    content = content.replace(end_pattern, replacement)

with open('src/pages/registration-design.tsx', 'w') as f:
    f.write(content)
