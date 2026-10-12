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
              July 19, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              A F*cked Family & Society
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              The typical Indian family is a control system, and financial freedom is the trump card.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                A dear friend of mine recently moved to a European country for a few months as an exchange student to finish his business education. He had a psychedelic experience and a life-changing culture shock, which he saw coming. He concluded after the chat we had regarding the same: &quot;As a society, we Indians are f*cked.&quot;
              </p>
              <p>
                As a 26-year-old free-spirited individual, this statement is a huge relief, as it echoes what I feel as an &quot;Indian&quot; youth. Being born in India itself is a massive trauma, which is due to being from here in the 21st century. The typical Indian family is a control system, and rather than ranting, I&apos;m rooting the problem in deep analysis. Why? English colonialism has a huge role. As a libertarian who has finally created a safe and healthy space for myself, especially from the energy drain by the Indian family and society, I release a huge sigh, and this sigh is a &quot;disease&quot; towards liberating other individuals who are victims of this family system.
              </p>
              <p>
                We are riders of the storm, and we are thrown into this world as sung by Jim Morrison. As someone who is gender fluid and identifies 70% as a woman, this manipulation tactic by family and society is toxic to my deeply expressive soul.
              </p>
              <p>
                From childhood, I wanted to run away from this energy. At 26, a mature adult with a stabler nervous system thanks to yogic practices, I&apos;m clinically removing myself from this &quot;f*cked&quot; family and society. It is a game, and financial freedom is the trump card. Money has a huge healing energy, especially for someone with serious financial traumas.
              </p>
              <p>
                The &quot;cringe&quot; that I have is a sign of growth. Cringe maxima. I&apos;m cringing my way out of this. Cognitive Behavioral Therapy and Healing is a magnanimous solution, a checkmate, a rebirth. Inshallah/Om Namaha Shivaya.
              </p>
              <p>
                There is an absolute lack of civic sense. Smart youth quietly leave the country. The majority of the youth leave the country to get away from this society. As Ambedkar mentioned, being born into a poor family is not a person&apos;s problem, but dying poor is 100% the individual&apos;s problem. Financial freedom is the only freedom, and healing the wounds is a precursor to that.
              </p>
              <p>
                Kerala is marketed as &quot;God&apos;s Own Country,&quot; but the remnants of casteism are still strong, especially in rural areas. It is soul-sucking. Families are majority hierarchical and, in short, are a control system. Most of them are dysfunctional too. Acting as the son, brother, and all other roles has corroded my soul enough to the point that I don&apos;t give a f*ck.
              </p>
              <p>
                I traded my time, energy, and peace only to waste my years. I remember Iron Maiden&apos;s song called &apos;Wasted Years&apos;, in which the singer sings—
              </p>
              <blockquote className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 py-1 italic my-4 text-neutral-600 dark:text-neutral-400 font-sans">
                <p className="leading-relaxed">
                  So, understand<br />
                  Don&apos;t waste your time always searching for those wasted years.<br />
                  Face up; make your stand.<br />
                  And realize you&apos;re living in the golden years.
                </p>
              </blockquote>
              <p>
                If I don&apos;t resist it with my each breath, then I&apos;m corrupting myself, and then I&apos;m no better than the soul-sucking system. There are no morals in a patriarchal system.
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
