"use client"

import { useState } from "react"

type WindowType = "hann" | "triangle" | "rect"

const windowPaths: Record<WindowType, string> = {
  hann: "M 0 100 C 30 100, 35 0, 50 0 C 65 0, 70 100, 100 100",
  triangle: "M 0 100 L 50 0 L 100 100",
  rect: "M 0 0 L 100 0 L 100 100",
}

function windowValue(position: number, type: WindowType) {
  if (type === "hann") {
    return 0.5 - 0.5 * Math.cos(2 * Math.PI * position)
  }

  if (type === "triangle") {
    return 1 - Math.abs(2 * position - 1)
  }

  return 1
}

export function WindowShapeDemo() {
  const [windowType, setWindowType] = useState<WindowType>("hann")
  const [position, setPosition] = useState(50)
  const t = position / 100
  const amplitude = windowValue(t, windowType)

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Compare grain windows
      </h3>
      <p className="font-sans text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        Move through a grain to see how each window changes its amplitude.
      </p>

      <label className="flex flex-wrap items-center gap-3 font-sans text-base text-neutral-700 dark:text-neutral-200">
        Window shape
        <select
          value={windowType}
          onChange={(event) => setWindowType(event.target.value as WindowType)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-white"
        >
          <option value="hann">Hann</option>
          <option value="triangle">Triangle</option>
          <option value="rect">No window</option>
        </select>
      </label>

      <svg
        viewBox="0 0 100 110"
        role="img"
        aria-label={`${windowType} window shape, current amplitude ${amplitude.toFixed(2)}`}
        className="h-48 w-full overflow-visible"
      >
        <path d="M 0 100 H 100 M 0 50 H 100 M 0 0 H 100" stroke="currentColor" opacity="0.15" />
        <path d={windowPaths[windowType]} fill="none" stroke="#4ade80" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <line
          x1={position}
          x2={position}
          y1={100 - amplitude * 100}
          y2="106"
          stroke="#a7f3d0"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={position}
          cy={100 - amplitude * 100}
          r="3"
          fill="#a7f3d0"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <label className="block font-sans text-base text-neutral-700 dark:text-neutral-200">
        Grain position: {t.toFixed(2)} · Amplitude: {amplitude.toFixed(2)}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="mt-2 block w-full accent-emerald-400"
          aria-label="Position within the grain"
        />
      </label>
    </section>
  )
}

export function InterpolationDemo() {
  const [position, setPosition] = useState(50)
  const t = position / 100
  const value = 0.2 + (0.8 - 0.2) * t

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Read between samples
      </h3>
      <p className="font-sans text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        Linear interpolation estimates a value between sample A (0.20) and sample B (0.80).
      </p>

      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Interpolated sample value ${value.toFixed(2)} at position ${t.toFixed(2)}`}
        className="h-40 w-full overflow-visible"
      >
        <line x1="0" y1="80" x2="100" y2="20" stroke="#4ade80" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <line
          x1={position}
          x2={position}
          y1={80 - 60 * t}
          y2="90"
          stroke="#a7f3d0"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="0" cy="80" r="3" fill="#4ade80" vectorEffect="non-scaling-stroke" />
        <circle cx="100" cy="20" r="3" fill="#4ade80" vectorEffect="non-scaling-stroke" />
        <circle cx={position} cy={80 - 60 * t} r="3.5" fill="#a7f3d0" vectorEffect="non-scaling-stroke" />
      </svg>

      <label className="block font-sans text-base text-neutral-700 dark:text-neutral-200">
        Position t: {t.toFixed(2)} · Interpolated value: {value.toFixed(2)}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="mt-2 block w-full accent-emerald-400"
          aria-label="Position between sample A and sample B"
        />
      </label>
    </section>
  )
}
