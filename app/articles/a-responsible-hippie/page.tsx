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
              July 20, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              A responsible &quot;hippie.&quot;
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              A responsible hippie is rich enough to take care of themselves and create money for the betterment of the community also.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                In the book &apos;Zahir&apos; by Paulo Coelho, there is a scene where the protagonist, who happens to be a writer, has a debatable conversation with the homeless &quot;hippies&quot; in the streets of Paris. The debate is regarding the &quot;hippie&quot; arguing about their freedom of choice of being irresponsible and contributing nothing to society and being in their bubble of libertarianism. Around two years ago I had embraced the &quot;hippie&quot; life for a short time of a few months in Arambol, Goa. It was ecstatic at first, but because evading the inner traumas and money leaves a cognitive scar on the soul, it was grueling. Haha. I was chasing &quot;hippie chicks&quot; only to be disappointed, as it is all an illusive transitory liminal space.
              </p>
              <p>
                The purpose of this article is to redefine the definition of a hippie to me and others who have reached the word that I&apos;m writing. &quot;Hippie&quot; is a short form for &quot;hipster,&quot; an unconventional counter-cultural human being. Hippies could be rich too, like the singer Zaz, who has the aesthetics of a rich hippie, and that is far better than being a delusional lost nomad hippie. I&apos;m a hipster before anything. Living in the 70&apos;s rock and roll era, smoking pot (edibles now) and too much Hendrix. Living like this in 2020&apos;s India comes with a trade, a form of alienation from the masses, which I&apos;m finally and fully accepting. I&apos;m a mystic outlaw, and some are tuned into this state. Listening to the heart without guardrails is harming the heart in the long run, as is listening to it with a focus, e.g., Mount Kailash is my focal point, and God is before taking away heartfelt action. I ask Lord Shiva, is this right? And I get an answer. Shiva is a symbol of the masculine energy and Shakti (the divine feminine—Kodungaloor Amma).
              </p>
              <p>
                It is wise to live in a commune of liberals and free-spirited individuals to cut the noise of society. A society that is extremely harmful to my energy and liberal creative flow and liberation in sexuality.
              </p>
              <p>
                A responsible hippie is rich enough to take care of themselves and create money for the betterment of the community also. That&apos;s the lesson. Ciao.
              </p>
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
