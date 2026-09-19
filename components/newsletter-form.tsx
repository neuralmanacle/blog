'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website: '' }),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        setMessage(payload.message || 'Unable to subscribe right now. Please try again.')
        setStatus('error')
        return
      }

      setEmail('')
      setMessage("You're subscribed.")
      setStatus('success')
    } catch (error) {
      setMessage('Unable to subscribe right now. Please try again.')
      setStatus('error')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8">
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Notes on audio software, DSP, music technology, and things I&apos;m building.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="newsletter-email" className="text-sm text-foreground">
            Email
          </Label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (status !== 'idle') {
                setStatus('idle')
                setMessage('')
              }
            }}
            placeholder="you@example.com"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
            disabled={isSubmitting}
            aria-describedby="newsletter-status"
          />
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg border border-[#F7B904] bg-[#F7B904] px-5 text-sm font-semibold text-[#0D0D0D] hover:bg-[#f8c12a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
      </form>

      <div id="newsletter-status" aria-live="polite" className="mt-4 min-h-5">
        {message ? (
          <p className={status === 'error' ? 'text-sm text-rose-500' : 'text-sm text-[#F7B904]'}>{message}</p>
        ) : null}
      </div>
    </div>
  )
}
