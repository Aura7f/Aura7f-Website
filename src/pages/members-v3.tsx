import { useEffect, useRef, useState } from 'react'
import TopNav from '../components/homedesign/TopNav'
import Footer from '../components/homedesign/Footer'

export default function MembersV3() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [frameHeight, setFrameHeight] = useState(800)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const resizeFrame = () => {
      try {
        const document = frame.contentDocument
        if (!document) return
        const height = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0)
        setFrameHeight(height)
      } catch {
        // Keep the fallback height if the preview becomes cross-origin.
      }
    }

    frame.addEventListener('load', resizeFrame)
    resizeFrame()

    const interval = window.setInterval(resizeFrame, 500)
    return () => {
      frame.removeEventListener('load', resizeFrame)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#101114]">
      <TopNav />
      <main className="relative w-full pt-[61px]">
        <iframe
          ref={frameRef}
          src="/sections/section-pocket-heroes/preview.html"
          title="Pocket Quest · Heroes"
          className="block w-full border-0"
          style={{ height: `${frameHeight}px` }}
          loading="eager"
          allow="fullscreen"
        />
      </main>
      <Footer />
    </div>
  )
}
