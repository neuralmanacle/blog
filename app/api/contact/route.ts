import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const rateLimitWindowMs = 60_000
const rateLimitMaxRequests = 5
const requestTimestamps = new Map<string, number[]>()

const sanitizeText = (value: string, maxLength: number) => {
  const trimmed = value.replace(/\s+/g, " ").trim()
  return trimmed.slice(0, maxLength)
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isRateLimited = (ip: string) => {
  const timestamps = requestTimestamps.get(ip) ?? []
  const now = Date.now()
  const recent = timestamps.filter((timestamp) => now - timestamp < rateLimitWindowMs)

  if (recent.length >= rateLimitMaxRequests) {
    requestTimestamps.set(ip, recent)
    return true
  }

  recent.push(now)
  requestTimestamps.set(ip, recent)
  return false
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again in a minute." },
      { status: 429 }
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 })
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 })
  }

  const form = payload as Record<string, unknown>
  const honeypot = String(form.website ?? "").trim()
  const name = sanitizeText(String(form.name ?? ""), 100)
  const email = String(form.email ?? "").trim()
  const message = sanitizeText(String(form.message ?? ""), 2000)

  if (honeypot) {
    return NextResponse.json({ message: "Request rejected." }, { status: 400 })
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ message: "Please provide your name." }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 })
  }

  if (!message || message.length < 10) {
    return NextResponse.json({ message: "Please include a message with at least 10 characters." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const targetEmail = process.env.CONTACT_EMAIL || "neuralmanacle@gmail.com"
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Neural Manacle <onboarding@resend.dev>"

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured")
    return NextResponse.json({ message: "Email service is not configured yet." }, { status: 500 })
  }

  try {
    const resend = new Resend(apiKey)

    const result = await resend.emails.send({
      from: fromEmail,
      to: [targetEmail],
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <h3>New message from Neural Manacle</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
      text: `New message from Neural Manacle\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (result.error) {
      console.error("Resend send failed:", result.error)
      return NextResponse.json({ message: "Message could not be sent right now." }, { status: 502 })
    }

    return NextResponse.json({ message: "Message sent. Thank you." }, { status: 200 })
  } catch (error) {
    console.error("Unexpected contact email failure:", error)
    return NextResponse.json({ message: "Message could not be sent right now." }, { status: 500 })
  }
}
