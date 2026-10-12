"use client"

import Link from "next/link"
import RevealOnView from "@/components/reveal-on-view"
import ArticleTags from "@/components/article-tags"

export default function ArticlePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <RevealOnView intensity="soft">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-mono"
            >
              ← Back
            </Link>

            <p className="text-sm font-mono text-neutral-500 dark:text-white/40">
              July 4, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Post-Meta Effect
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              A month or two ago I decided to permanently remove myself from Meta. The results of this exit are staggering.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                A month or two ago I decided to permanently remove myself from Meta. The results of this exit are staggering. I can feel the healing that is happening to my brain. Meta is just a business that exploits basic human psychological caveats to make profits and do a feedforward loop aiming at inducing addictive behaviors for the users.
              </p>
              <p>
                This unethical privacy breach is hypernormalized. It all started with a person creating an algorithm for ranking women on their campus. I have made a firm decision to never look back. I could say I have quit WhatsApp for an 80% chance. The choice of downloading Instagram around 2018 was the dumbest choice of my entire life.
              </p>
              <p>
                I knew the harms of it, but I still did it to fit in. My mental health really took a toll as I became a slave to &quot;Insta&quot;nt gratification. The reason why notifications are red is because humans are prone to the color. In a primal sense, red signals blood, which in turn signals a threat, so the human nervous system automatically becomes prone to reacting.
              </p>
              <p>
                My attention span was barely five seconds, and now I have pushed it to a range of 10-15 seconds. Our generation is in a constant fight against privacy, autonomy, and authenticity. My biggest fear was how I could be an artist if I left Instagram. The fun fact is, leaving Instagram is the king move for an artist, as it will help them to truly focus and protect their art and create scarcity.
              </p>
              <p>
                My real art is coming out, and it is slow and growing. The background job in the brain of &quot;Oh, I need to perform for this set of audience&quot; is killed. What remains is a healing heart ready for art. A lot of social media is soft porn. I can&apos;t even think of AI Slop. It will take me a couple of years to totally get rid of social media from my nervous system, and it is worth the wait. I&apos;m improving my focus, which is very needed to become a strong engineer proficient in writing various programming languages. Remote work demands extreme discipline and focus.
              </p>
              <p>
                Thinking for yourself is a luxurious habit in this new age. The consumerism and fake status-seeking pursuits are truly sad to watch. As Tyler Durden mentioned in Fight Club.
              </p>
              <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 italic my-6 text-neutral-600 dark:text-neutral-400">
                &quot;We buy things we don’t need with money we don’t have to impress people we don’t like.&quot;
              </blockquote>
              <p>
                Humans are wired for evaluating each other&apos;s status to understand their standing in the dominance hierarchy; this is evolutionary, as no being wants to be the last and die off. This is the WhatsApp &quot;Status&quot; and Instagram &quot;Story&quot; design. If I achieve a perceived status of being rich, then my brain won&apos;t even put any effort into real status-seeking long-term goals. I don&apos;t think an average person can read long-form content or finish a book in this age. We are all turning into cyborgs.
              </p>
              <p>
                The coming of generative AI is the epitome of information overload. It is very scary when I take a step back and look at how the end of this decade would turn out.
              </p>
              <p>
                Programming is a discipline, and skills need to be sharpened each moment to stay relevant. Deep problems require deeper focus. It is an extremely bad trade to be on social media for our deep focus.
              </p>
              <div className="pt-4">
                <a
                  href="https://youtu.be/3E7hkPZ-HTk?si=ybH5kwKEtvT1ndgJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-900 hover:text-black underline dark:text-neutral-200 dark:hover:text-white"
                >
                  Watch: Quit social media | Dr. Cal Newport | TEDxTysons
                </a>
              </div>
            </div>

            <ArticleTags />

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href="/"
                className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-mono"
              >
                ← Back to Index
              </Link>
            </div>
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
