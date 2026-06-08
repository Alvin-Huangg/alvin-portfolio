'use client'

import { useState, useEffect } from 'react'
import MacTitleBar from './MacTitleBar'
import Sidebar from './Sidebar'
import SpotifyWidget from './SpotifyWidget'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarHidden(true)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <MacTitleBar
        sidebarHidden={sidebarHidden}
        onToggleSidebar={() => setSidebarHidden(h => !h)}
      />

      {/* Mobile backdrop — tap to close sidebar */}
      {!sidebarHidden && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarHidden(true)}
          aria-hidden="true"
        />
      )}

      {/* Spotify widget — hidden on mobile */}
      <div className="spotify-fixed w-[230px] xl:w-[260px] 2xl:w-[290px] hidden md:block">
        <SpotifyWidget />
      </div>

      <div className="flex max-w-[920px] xl:max-w-[1200px] 2xl:max-w-[1500px] 3xl:max-w-[1900px] 4xl:max-w-[2200px] mx-auto w-full px-4 md:px-8 flex-1">
        <Sidebar hidden={sidebarHidden} onClose={() => setSidebarHidden(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 pt-5 pb-8 md:pt-7 md:pb-12 min-w-0 transition-[padding] duration-500 ease-in-out focus:outline-none ${
            !isMobile && sidebarHidden ? 'pl-0' : 'pl-0 md:pl-10'
          }`}
          aria-label="Main content"
        >
          <div
            style={{
              zoom: !isMobile && sidebarHidden ? 1.12 : 1.05,
              transition: 'zoom 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
