export interface Article {
  date: string
  title: string
  href: string
  takeaway: string
  tags?: string[]
  content?: string
}

export type FieldNote = Article & { number: number; readingTime: string }

export function mergeArticlesWithLocalFallbacks(
  remoteArticles: Article[] | null | undefined,
): Article[] {
  if (!remoteArticles || remoteArticles.length === 0) return articles

  const remoteHrefs = new Set(
    remoteArticles.map((article) => article.href).filter(Boolean),
  )
  const missingLocalArticles = articles.filter(
    (article) => article.href && !remoteHrefs.has(article.href),
  )

  return [...remoteArticles, ...missingLocalArticles]
}

const INCLUDE_TAGS = new Set([
  "tech", "dsp", "juce", "c++", "game-audio", "audio", "deep-learning",
  "speech-to-text","vertex-ai", "agent-memory",
  "meetup", "python", "neural-networks"
])

const EXCLUDE_TAGS = new Set([
  "poetry", "spirituality", "yoga", "ethics", "travel", "writing",
  "manhood", "rehabilitation", "quit-social-media", "socio-economic",
  "archives",
])

export function getFieldNotes(): FieldNote[] {
  const filtered = articles.filter((article) => {
    if (!article.tags || article.tags.length === 0) return false

    const hasIncludeTag = article.tags.some((tag) => INCLUDE_TAGS.has(tag))
    const hasExcludeTag = article.tags.some((tag) => EXCLUDE_TAGS.has(tag))

    if (hasExcludeTag && !hasIncludeTag) return false
    if (!hasIncludeTag) return false

    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })

  return sorted.map((article, index) => {
    const combined = `${article.title} ${article.takeaway}`
    let wordCount = 0
    try {
      wordCount = combined.trim().split(/\s+/).filter(Boolean).length
    } catch {
      wordCount = 0
    }

    let readingTime: string
    if (wordCount > 0) {
      const minutes = Math.ceil(wordCount / 200)
      const clamped = Math.max(minutes, 2)
      readingTime = `${clamped} min read`
    } else {
      readingTime = "3 min read"
    }

    return {
      ...article,
      number: index + 1,
      readingTime,
    }
  })
}

export const articles: Article[] = [
  {
    date: "November 11, 2026",
    title: "Step 11: Teaching Drizel Where to Start a Grain",
    href: "/articles/step-11-teaching-drizel-where-to-start-a-grain",
    takeaway:
      "How Drizel measures transients, sustain, and brightness to guide grain starts while keeping real-time playback predictable.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "November 9, 2026",
    title: "Step 10: Offline Sample Analysis",
    href: "/articles/step-10-offline-sample-analysis",
    takeaway: "How an offline Python analyzer maps a WAV into sample coordinates, waveform and spectral features, and a plot for feature-guided grain selection.",
    tags: ["tech", "dsp", "juce", "audio", "python", "c++"],
  },
  {
    date: "November 5, 2026",
    title: "Step 9: Making Drizel a Playable Granular Instrument",
    href: "/articles/step-09-making-drizel-a-playable-granular-instrument",
    takeaway: "How MIDI note priority, velocity envelopes, expressive controllers, and presets turn Drizel's grain cloud into a playable instrument.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 25, 2026",
    title: "Step 8: From One LFO to a Modulation System",
    href: "/articles/step-08-building-a-modulation-system",
    takeaway: "How reusable modulation sources, explicit routes, and shared parameter handling can grow Drizel beyond its first LFO.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 24, 2026",
    title: "Step 7: Giving Sound Movement with Modulation",
    href: "/articles/step-07-giving-sound-movement-with-modulation",
    takeaway: "How an LFO drives position and pitch, and how clamping, smoothing, and real-time constraints shape modulation in Drizel.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 22, 2026",
    title: "Step 6: Playing the Grain Cloud Live",
    href: "/articles/step-06-playing-the-grain-cloud-live",
    takeaway: "How Drizel connects its offline grain cloud to a JUCE audio callback, safely hands off samples, and smooths live controls.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 19, 2026",
    title: "Step 5: From One Grain to a Texture",
    href: "/articles/step-05-from-one-grain-to-a-texture",
    takeaway: "How grain density, overlap-add, a fixed pool, and seeded variation turn individual grains into an offline stereo texture.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 18, 2026",
    title: "Step 4: Playing One Grain",
    href: "/articles/step-04-playing-one-grain",
    takeaway: "How a grain reads a short sample slice at a chosen pitch, applies a window, and renders a single event.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 13, 2026",
    title: "Adding 4 Point Hermite Interpolation",
    href: "/articles/four-point-hermite-interpolation",
    takeaway: "How four-point Hermite interpolation estimates fractional audio samples and complements grain windowing.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "October 13, 2026",
    title: "Step 3: Window Shapes and Interpolation",
    href: "/articles/step-03-window-shapes-and-interpolation",
    takeaway: "How Hann and triangle windows smooth grain edges, and how linear interpolation reads between audio samples.",
    tags: ["tech", "dsp", "juce", "audio"],
  },
  {
    date: "October 8, 2026",
    title: "Introducing Drizel",
    href: "/articles/introducing-drizel",
    takeaway: "A granular synthesizer project built in JUCE, exploring DSP, sample processing, and a live AI modulation roadmap.",
    tags: ["tech", "dsp", "juce", "audio", "c++"],
  },
  {
    date: "September 25, 2026",
    title: "Learning C++",
    href: "/articles/learning-to-code",
    takeaway: "A practical note on learning C++ with the right discipline, intuition, and production mindset.",
    tags: ["tech", "dsp", "audio", "c++"],
  },
  {
    date: "August 26, 2026",
    title: "AES August '26 Seminar Summary",
    href: "/articles/audio-engineering-comm-conf-aug-26",
    takeaway: "A few yet valuable insights from the seminar hosted by the Audio Engineering Society on August '26.",
    tags: ["tech", "dsp", "meetup"],
  },
  {
    date: "July 2, 2026",
    title: "Deep Learning (for Audio) with Python Course Notes",
    href: "/articles/dl-audio-py",
    takeaway: "Notes and implementation of a basic Multilayer Perceptron from scratch using NumPy.",
    tags: ["archives", "tech", "deep-learning", "python", "neural-networks"],
  },
].reverse();
