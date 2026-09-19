"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type FormStatus = "idle" | "submitting" | "success" | "error"

const initialForm = { name: "", email: "", message: "", website: "" }

export default function ContactForm() {
  const [status, setStatus] = React.useState<FormStatus>("idle")
  const [message, setMessage] = React.useState("")
  const [formData, setFormData] = React.useState(initialForm)

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    if (status !== "idle") setStatus("idle")
    if (message) setMessage("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === "submitting") return

    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        setMessage(payload.message || "Please check your details and try again.")
        setStatus("error")
        return
      }

      setFormData(initialForm)
      setMessage("Message sent. Thank you.")
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again in a moment.")
    }
  }

  const isDisabled = status === "submitting"

  return (
    <div className="relative group w-full pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <div className="absolute inset-x-0 bottom-0 top-6 -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--rainbow-1)] via-[var(--rainbow-3)] to-[var(--rainbow-5)] opacity-20 blur-md group-focus-within:opacity-75 transition-opacity duration-500 animate-[rainbow-flow_6s_linear_infinite] bg-[length:200%_auto]" />

      <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-[var(--rainbow-1)] via-[var(--rainbow-3)] to-[var(--rainbow-5)] bg-[length:200%_auto] animate-[rainbow-flow_6s_linear_infinite] overflow-hidden shadow-lg dark:shadow-neutral-950">
        <div className="bg-background rounded-[11px] p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-bold">
              let&apos;s connect
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              Reach out about audio software, DSP, product work, or a conversation.
            </p>
          </div>

          {status === "success" ? (
            <div className="p-8 rounded-lg bg-background/50 border border-neutral-200 dark:border-neutral-800 text-center" aria-live="polite">
              <p className="font-mono text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                Message sent. Thank you.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-3 text-[10px] uppercase font-bold tracking-wider font-mono text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(event) => handleChange("website", event.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-1">
                <label htmlFor="form-name" className="block text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                  Name
                </label>
                <input
                  id="form-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isDisabled}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#F7B904] focus:outline-none focus:ring-2 focus:ring-[#F7B904]/30 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="form-email" className="block text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                  Email
                </label>
                <input
                  id="form-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isDisabled}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#F7B904] focus:outline-none focus:ring-2 focus:ring-[#F7B904]/30 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="form-message" className="block text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                  Message
                </label>
                <textarea
                  id="form-message"
                  required
                  rows={5}
                  placeholder="Tell me about the project, idea, or conversation."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  disabled={isDisabled}
                  className="w-full resize-none rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#F7B904] focus:outline-none focus:ring-2 focus:ring-[#F7B904]/30 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2" aria-live="polite">
                {message ? (
                  <p className={cn(
                    "text-xs font-medium",
                    status === "error" ? "text-rose-500" : "text-[#F7B904]"
                  )}>
                    {message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isDisabled}
                  className={cn(
                    "inline-flex items-center justify-center rounded border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                    isDisabled
                      ? "border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-500"
                      : "border-[#F7B904] bg-[#F7B904] text-[#0D0D0D] hover:bg-[#f8c12a]"
                  )}
                >
                  {isDisabled ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
