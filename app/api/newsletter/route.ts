import { NextRequest, NextResponse } from "next/server"

const BUTTONDOWN_ENDPOINT = "https://api.buttondown.email/v1/subscribers"

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(request: NextRequest) {
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
  const email = String(form.email ?? "").trim().toLowerCase()
  const honeypot = String(form.website ?? "").trim()

  if (honeypot) {
    return NextResponse.json({ message: "Request rejected." }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 })
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY is not configured")
    return NextResponse.json({ message: "Newsletter signup is not configured yet." }, { status: 500 })
  }

  try {
    const response = await fetch(BUTTONDOWN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const status = response.status

    if (status === 409) {
      return NextResponse.json({ message: "You're already subscribed." }, { status: 409 })
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Buttondown request failed:", status, errorText)
      return NextResponse.json({ message: "Unable to subscribe right now." }, { status: 502 })
    }

    return NextResponse.json({ message: "You're subscribed." }, { status: 200 })
  } catch (error) {
    console.error("Unexpected Buttondown failure:", error)
    return NextResponse.json({ message: "Unable to subscribe right now." }, { status: 500 })
  }
}
