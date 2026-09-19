"use client"

import * as React from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface NewsletterSignupProps {
  title: string
  description: string
  archiveHref: string
  onSubmit?: (email: string) => void | Promise<void>
}

export function NewsletterSignup({
  title,
  description,
  archiveHref,
  onSubmit,
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setError(null)

    const submitFn = onSubmit ?? ((e) => console.log("Newsletter subscribe:", e))
    await submitFn(email)

    setSuccess(true)
    setError(null)
  }

  return (
    <div className="relative w-full border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-6 sm:p-8">
      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <h3 className="font-mono text-sm sm:text-base uppercase tracking-wider font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        </div>

        {success ? (
          <div className="flex items-center gap-3 py-2 sm:py-3 animate-fade-in">
            <div
              className="flex items-center justify-center rounded-full size-8 sm:size-9 shrink-0"
              style={{ backgroundColor: "#F7B904" }}
            >
              <Check className="size-4 sm:size-5 text-black" />
            </div>
            <p className="font-mono text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
              Thanks for subscribing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                aria-invalid={!!error}
                className={cn(
                  "font-mono text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100",
                  error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                )}
              />
              <Button
                type="submit"
                className="w-full sm:w-auto font-mono text-xs sm:text-sm uppercase tracking-wider text-black border border-neutral-900/20 dark:border-neutral-100/20 hover:opacity-90"
                style={{ backgroundColor: "#F7B904" }}
              >
                Subscribe
              </Button>
            </div>

            {error && (
              <p className="font-mono text-xs text-rose-600 dark:text-rose-400 animate-fade-in">
                {error}
              </p>
            )}
          </form>
        )}

        <div className="pt-2">
          <Link
            href={archiveHref}
            className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Browse the archive
          </Link>
        </div>
      </div>
    </div>
  )
}
