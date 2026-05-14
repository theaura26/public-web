'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'

export type Theme = 'night' | 'day'
export type ViewMode = 'human' | 'agent'

const ModeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void
}>({ theme: 'night', setTheme: () => {}, viewMode: 'human', setViewMode: () => {} })

export function useMode() {
  return useContext(ModeContext)
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day')
  const [viewMode, setViewMode] = useState<ViewMode>('human')

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'night' ? 'day' : 'night')
  }, [])

  // Shake to toggle theme on mobile (iOS 13+ requires permission on first tap)
  const lastShake = useRef(0)
  const motionGranted = useRef(false)

  useEffect(() => {
    const threshold = 20
    let lastX = 0, lastY = 0, lastZ = 0
    let shakeCount = 0
    let shakeTimer = 0
    let initialized = false

    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return

      if (!initialized) {
        lastX = acc.x; lastY = acc.y; lastZ = acc.z
        initialized = true
        return
      }

      const dx = Math.abs(acc.x - lastX)
      const dy = Math.abs(acc.y - lastY)
      const dz = Math.abs(acc.z - lastZ)

      if (dx + dy + dz > threshold) {
        shakeCount++
        clearTimeout(shakeTimer)
        shakeTimer = window.setTimeout(() => { shakeCount = 0 }, 800)

        if (shakeCount >= 2) {
          const now = Date.now()
          if (now - lastShake.current > 1200) {
            lastShake.current = now
            toggleTheme()
          }
          shakeCount = 0
        }
      }

      lastX = acc.x
      lastY = acc.y
      lastZ = acc.z
    }

    const startListening = () => {
      window.addEventListener('devicemotion', onMotion)
      motionGranted.current = true
    }

    // iOS 13+ requires explicit permission via user gesture
    const DME = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }
    if (typeof DME.requestPermission === 'function') {
      const requestOnTap = () => {
        DME.requestPermission!().then((state: string) => {
          if (state === 'granted') startListening()
        }).catch(() => {})
        window.removeEventListener('touchend', requestOnTap)
      }
      window.addEventListener('touchend', requestOnTap)
      return () => {
        window.removeEventListener('touchend', requestOnTap)
        window.removeEventListener('devicemotion', onMotion)
      }
    } else {
      startListening()
      return () => window.removeEventListener('devicemotion', onMotion)
    }
  }, [toggleTheme])

  /* Agent mode: show alt-text instead of images.
     When viewMode flips to 'agent', stash each <img>'s src in a data attribute
     and clear it — the browser then paints the alt text in place of the
     missing image. When flipping back to 'human', restore the original src.
     A MutationObserver keeps newly-rendered images consistent with the mode. */
  useEffect(() => {
    const apply = (img: HTMLImageElement) => {
      if (viewMode === 'agent') {
        if (img.src && !img.dataset.origSrc) {
          img.dataset.origSrc = img.getAttribute('src') || ''
          img.removeAttribute('src')
        }
      } else {
        if (img.dataset.origSrc) {
          img.setAttribute('src', img.dataset.origSrc)
          delete img.dataset.origSrc
        }
      }
    }
    document.querySelectorAll('img').forEach(apply)

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLImageElement) apply(n)
          else if (n instanceof HTMLElement) n.querySelectorAll('img').forEach(apply)
        })
      }
    })
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [viewMode])

  return (
    <ModeContext.Provider value={{ theme, setTheme, viewMode, setViewMode }}>
      <div data-theme={theme} data-view={viewMode}>
        {children}
      </div>
    </ModeContext.Provider>
  )
}
