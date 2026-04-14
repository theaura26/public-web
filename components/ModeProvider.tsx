'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Theme = 'night' | 'day' | 'nature'
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
  const [theme, setTheme] = useState<Theme>('night')
  const [viewMode, setViewMode] = useState<ViewMode>('human')

  return (
    <ModeContext.Provider value={{ theme, setTheme, viewMode, setViewMode }}>
      <div data-theme={theme} data-view={viewMode}>
        {children}
      </div>
    </ModeContext.Provider>
  )
}
