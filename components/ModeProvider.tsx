'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

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
  const [theme, setThemeState] = useState<Theme>('day')
  const [viewMode, setViewModeState] = useState<ViewMode>('human')

  // Hydrate persisted preferences after mount (avoids SSR mismatch by
  // keeping the initial render at the defaults and updating once
  // localStorage is reachable).
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const t = window.localStorage.getItem('aura:theme')
      if (t === 'day' || t === 'night') setThemeState(t)
      const v = window.localStorage.getItem('aura:view')
      if (v === 'human' || v === 'agent') setViewModeState(v)
    } catch {}
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try { window.localStorage.setItem('aura:theme', t) } catch {}
  }, [])
  const setViewMode = useCallback((v: ViewMode) => {
    setViewModeState(v)
    try { window.localStorage.setItem('aura:view', v) } catch {}
  }, [])

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
