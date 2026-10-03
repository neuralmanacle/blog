"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cycleTheme = useCallback(() => {
    const order: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark']
    const current = (theme as 'system' | 'light' | 'dark') ?? 'system'
    const next = order[(order.indexOf(current) + 1) % order.length]
    setTheme(next)
  }, [setTheme, theme])

  if (!mounted) return null

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <button
      aria-label="Toggle theme"
      onClick={cycleTheme}
      className="inline-flex items-center justify-center rounded border px-2 py-1 text-sm bg-transparent border-neutral-300 hover:bg-[length:200%_100%] hover:[background-image:var(--site-accent)] hover:text-[#0D0D0D] text-neutral-700 dark:border-neutral-700 dark:hover:bg-white/3 dark:hover:text-transparent dark:hover:bg-clip-text dark:hover:[background-image:var(--site-accent)] dark:text-white transition-colors duration-300"
      title={`Theme: ${theme ?? 'system'}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export default React.memo(ThemeToggle)
