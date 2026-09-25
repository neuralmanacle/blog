export interface Article {
  date: string
  title: string
  href: string
  takeaway: string
  tags?: string[]
  content?: string
}

export type FieldNote = Article & { number: number; readingTime: string }

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
    date: "August 6, 2026",
    title: "Discovering Osho",
    href: "/articles/discovering-osho",
    takeaway: "Knowing is not a destination but the expansion of consciousness; it is a journey.",
    tags: ["writing", "spirituality", "yoga"],
  },
  {
    date: "July 27, 2026",
    title: "A Train to Bikaner",
    href: "/articles/a-train-to-bikaner",
    takeaway: "Reflections from a train journey to Bikaner.",
    tags: ["travel", "writing"],
  },
  {
    date: "July 27, 2026",
    title: "The Black Sheep",
    href: "",
    takeaway: "Please remember those years were golden, just like the Japanese craft of Kintsugi.",
    tags: ["poetry"],
    content: `As we breathe the soot of our past
When in the quiet dark we weep
I see you and hear you think about me
and when you leave some words unsaid

For the body we burnt in our pasts
and the parts we bury of our present
and the shadows which will prey in future
could we look into each others eyes?

In your eyes I see the chains of the past
and in your soul I breathe love
and when you are alone I have my prayers
for us to live and let live in our hearts

As we remember and forget the wasted time
and when we go in circles over lost time
please remember those years were golden
Just like the japanese craft of Kintsugi`,
  },
  {
    date: "July 27, 2026",
    title: "One Last Time",
    href: "",
    takeaway: "Withered with time lay your wounds, only for me to pick my shattered soul.",
    tags: ["poetry"],
    content: `Withered with time lay your wounds
Only for me to pick my shattered soul
And as the world ends, what left is a soul
A soul which needs to be filled with love

And I carry on with my soul on my sleeves
With a heart which was in your nourishment
And I walk my path washing the sins away
Only to look back and remember your face

Oh my love, it's too late now as I was dead
In the soul's search for meaning did I? 
Did I kill a part of you, or your soul?
I beg to a higher being for your integration

As I trudge this winter hoping only a summer
Just a summer if we had met again
A summer with drinks and tunes to fill our hearts
For it to only wash our souls one more time?

One last time.`,
  },
  {
    date: "July 20, 2026",
    title: "A responsible \"hippie.\"",
    href: "/articles/a-responsible-hippie",
    takeaway: "A responsible hippie is rich enough to take care of themselves and create money for the betterment of the community also.",
    tags: ["writing", "spirituality", "ethics", "yoga"],
  },
  {
    date: "July 19, 2026",
    title: "A F*cked Family & Society",
    href: "/articles/a-f-cked-family-and-society",
    takeaway: "The typical Indian family is a control system, and financial freedom is the trump card.",
    tags: ["writing", "ethics", "spirituality", "yoga"],
  },
  {
    date: "July 17, 2026",
    title: "The Sun",
    href: "",
    takeaway: "Repressed are his desires and emotions as he is casted into his said role.",
    tags: ["poetry"],
    content: `Repressed are his desires and emotions
as he is casted into his said role
to the generation of trauma passed
and it is his burden of life
watching his soul corrode into sparks
the sparks of this system to which
he stands as the chaste sun, the pillar
holding the burden of patriarchy.`,
  },
  {
    date: "July 17, 2026",
    title: "Diamond",
    href: "",
    takeaway: "She wept in silence with a sigh, blaming the fault in her stars.",
    tags: ["poetry"],
    content: `She wept in silence with a sigh
blaming the fault in her stars
Wearing the blood red chains of control
as she prayed to the divine feminine`,
  },
  {
    date: "July 17, 2026",
    title: "Witches vs Patriarchy",
    href: "/articles/witches-vs-patriarchy",
    takeaway: "There are only two sides one could pick: either that of the witch or that of the dreaded patriarchy.",
    tags: ["writing", "ethics", "spirituality", "yoga"],
  },
  {
    date: "July 17, 2026",
    title: "Remnants of My Desires",
    href: "",
    takeaway: "Remnants of my desires lay flat for the withered rain to take me away.",
    tags: ["poetry"],
    content: `Remnants of my desires lay flat
for the withered rain to take me away
The slow song of a distant bird
has no way but to enter my soul
As I lay flat losing my breath
seldom did I realize that I must
I must only listen to the beats of my heart`,
  },
  {
    date: "July 17, 2026",
    title: "A Fleeting Glance",
    href: "",
    takeaway: "A fleeting glance upon your Shakti energy, crafted shockwaves of my serpent energy.",
    tags: ["poetry"],
    content: `A fleeting glance upon your Shakti energy
Crafted shockwaves of my serpent energy
The sky of the dawn and the shadows at night
remains still as I look into your past`,
  },
  {
    date: "July 14, 2026",
    title: "These Are The Times",
    href: "",
    takeaway: "These are the times of struggle, periods of estrangement.",
    tags: ["poetry"],
    content: `These are the times.
the times of struggle
periods of estrangement
strangled by strings
the strings woven by fate
the keen and the meek
the wise and the miser
streets of rebellion
coated with stains of time
These are the times
These are the times`,
  },
  {
    date: "July 14, 2026",
    title: "Churned Are The Masses",
    href: "",
    takeaway: "Oblique are the upcoming times, maybe now is the precursor to a war.",
    tags: ["poetry"],
    content: `churned are the masses
into objects and machines
only to have a fate of ending soon.
for they have already been dead,
when they decided to not think,
when they were denied
from their own freedom of thought.
oblique are the upcoming times
maybe now is the precursor to a war
the power has been misused
by those who are powerless
to their own selves`,
  },
  {
    date: "July 13, 2026",
    title: "All The Judgement is Inside You Baby.",
    href: "/articles/judgement",
    takeaway: "Oh come on!! ft Chandler.",
    tags: ["writing", "spirituality", "yoga"],
  },
  {
    date: "July 13, 2026",
    title: "I live in India but I'm English.",
    href: "/articles/on-being-english",
    takeaway: "This is the postcolonial cognitive dissonance.",
    tags: ["writing", "spirituality", "ethics"],
  },
  {
    date: "July 13, 2026",
    title: "Ego Dissolution Through Carnatic Vocal Training",
    href: "/articles/ego-dissolution",
    takeaway: "At the age of nearly 26, I crushed my ego by starting Carnatic vocal training.",
    tags: ["writing", "spirituality", "yoga", "focus"],
  },
  {
    date: "July 11, 2026",
    title: "Destroy Patriarchy, Not The Planet.",
    href: "/articles/destory-patriarchy",
    takeaway: "What are man and woman? What are Shiva and Shakti? What are feminine and masculine?",
    tags: ["writing", "ethics", "focus", "manhood", "spirituality", "yoga"],
  },
  {
    date: "July 5, 2026",
    title: "Aren't you tired of this night cardio?",
    href: "/articles/quit-porn",
    takeaway: "The below are my personal opinions, and not everything is scientifically backed.",
    tags: ["writing", "ethics", "focus", "manhood", "rehabilitation", "spirituality", "yoga"],
  },
  {
    date: "July 4, 2026",
    title: "Post-Meta Effect",
    href: "/articles/leaving-meta",
    takeaway: "A month or two ago I decided to permanently remove myself from Meta. The results of this exit are staggering.",
    tags: ["writing", "ethics", "focus", "quit-social-media", "manhood"],
  },
  {
    date: "July 2, 2026",
    title: "Deep Learning (for Audio) with Python Course Notes",
    href: "/articles/dl-audio-py",
    takeaway: "Notes and implementation of a basic Multilayer Perceptron from scratch using NumPy.",
    tags: ["archives", "tech", "deep-learning", "python", "neural-networks"],
  },
  {
    date: "June 22, 2026",
    title: "AI is a Buzzword: Why?",
    href: "/articles/ai-buzzword-why",
    takeaway: "An exploration of AI as a dystopian sales gimmick and the shift to agent-driven computing.",
    tags: ["archives", "futurism", "writing", "ethics", "socio-economic"],
  },
  {
    date: "June 7, 2026",
    title: "Google Vertex AI Custom Endpoint Fix",
    href: "/articles/google-param-validation",
    takeaway: "fixed Google Vertex AI multi-region endpoint resolution logic in langchainjs to prevent connection errors.",
    tags: ["archives", "langchain", "vertex-ai"],
  },
  {
    date: "May 31, 2026",
    title: "Supporting Big Int Type",
    href: "/articles/supporting-big-int-type",
    takeaway: "solved web assembly FFI boundary serialization problem in deepagentjs quickjs provider.",
    tags: ["archives", "wasm", "typescript"],
  },
  {
    date: "May 27, 2026",
    title: "Adding Kimi Code Support to CodeGraph: Deep Dive into Local MCP Semantic Indexing",
    href: "/articles/kimi-agent",
    takeaway: "integrated Kimi CLI targets into the CodeGraph MCP server semantic indexing and installer targets.",
    tags: ["archives", "mcp", "semantic-indexing"],
  },
  {
    date: "May 25, 2026",
    title: "Scoped Agent Isolation @agentmemory",
    href: "/articles/scoped-agent-isolation",
    takeaway: "implemented dual-pass search filtering and agent state isolation boundaries to mitigate contextual token pollution.",
    tags: ["archives", "agent-memory", "context-isolation"],
  },
  {
    date: "May 23, 2026",
    title: "Flagging Ingested Duplicates @gbrain",
    href: "/articles/ingesting-overlapping-duplicates",
    takeaway: "resolved duplicate page ingestion bugs in gbrain CLI using content hash checks and unique slug validations.",
    tags: ["archives", "cli", "hashing"],
  },
  {
    date: "May 22, 2026",
    title: "Historical Profiles for Nuclear Site Layers",
    href: "/articles/historical-profiles",
    takeaway: "added rich operational metadata and details accordions inside map tooltips with optimized dismiss timings.",
    tags: ["archives", "tech", "gis", "map-visualization", "ui-ux"],
  },
  {
    date: "May 21, 2026",
    title: "Vosk as a Local STT Provider",
    href: "/articles/vosk-stt-provider",
    takeaway: "built an offline, lightweight speech-to-text pipeline utilizing Kaldi stream processing to preserve edge memory footprints.",
    tags: ["archives", "tech", "speech-to-text", "kaldi", "edge-computing"],
  },
  {
    date: "May 19, 2026",
    title: "Aggregating Anthropic Streams in LangChain.js",
    href: "/articles/aggregating-anthropic-streams",
    takeaway: "resolved streaming frame type validation errors by standardizing mergeable base delta mappings in core.",
    tags: ["archives", "langchain", "streaming"],
  },
].reverse();

