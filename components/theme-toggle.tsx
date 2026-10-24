"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cycleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  if (!mounted) return null

  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={cycleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:bg-[length:200%_100%] hover:[background-image:var(--site-accent)] hover:text-[#0D0D0D] dark:border-neutral-700 dark:text-white dark:hover:bg-white/3 dark:hover:text-transparent dark:hover:bg-clip-text dark:hover:[background-image:var(--site-accent)]"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export default React.memo(ThemeToggle)
