"use client"

import Link from "next/link"
import Image from "next/image"
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
              August 6, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Discovering Osho
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Knowing is not a destination but the expansion of consciousness; it is a journey.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                Osho says that knowing is not a destination but the expansion of consciousness; it is a journey. This mystic and godman has certainly taken away my attention through his avant-garde futuristic aesthetic and the magnificent and formidable aura. Osho is beyond words, as he is multidimensional. Osho is a direction, an energy, and a vibe. He has the Kalkiesque energy; I have coined that term. The youth need a spiritual purpose in this dooming world, and this energy definitely moves towards that.
              </p>

              <p>
                The energy is that of warm hands of protective uplifting vibrations, which are intense ripples passing through the soul body. There is no room for paranormality but a laser-focused path towards superconsciousness. I&apos;m volunteering as a young saadhak (seer) in an obscure and enchanted tapobhumi (meditative land) near a highway and miles away from the city of Bikaner, Rajasthan, India.
              </p>

              <div className="my-8 w-full">
                <Image
                  src="/ashram.jpeg"
                  alt="Amar Yoga Peeth Ashram"
                  width={1200}
                  height={800}
                  className="w-full h-72 md:h-[400px] object-cover rounded-xl border border-neutral-200 dark:border-neutral-800"
                />
              </div>

              <p>
                My internet access is slow and unstable, which is not at all triggering me, as it is a sign to move offline and hug the trees around, connect with the nature. To burn the harmful layers that are creating a disconnect between the above and below.
              </p>

              <p>
                Osho unlocked many dimensions of reality, especially regarding art. He says there are two types of art: one is subjective and the other is objective. Subjective art, in short, is a result of anguish, and objective art is rooted in beauty and the submission of ego, for example, the monument of the{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Taj_Mahal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-medium"
                >
                  Taj Mahal
                </a>{" "}
                (
                <a
                  href="https://www.youtube.com/watch?v=MmABwjWz0dQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-medium"
                >
                  video on subjective vs objective art
                </a>
                ).
              </p>

              <p>
                Attracting OSHO in my life is the reward of several months of my spiritual practices. The ashram feels enchanted with his energy, all thanks to the founder and Reiki master{" "}
                <a
                  href="https://www.amaryogapeeth.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-medium"
                >
                  Swami Sanjiv Kashyap (Amar Yoga Peeth)
                </a>{" "}
                and their student Ritika who is my closest friend.
              </p>

              <p>
                I&apos;m naturally spreading OSHO&apos;s light to people who could tune in to his frequency. OSHO is not for a weak-spirited person; he is the so-called &quot;rich man&apos;s guru.&quot; He had a collection of Rolls-Royces inside Rajneeshpuram as an object of attraction so that he could spread his light to the devotees. A psychological trick.
              </p>

              <p>
                OSHO for starters in my opinion is{" "}
                <a
                  href="https://youtu.be/rGzE4t71zsQ?si=TkGexCWIwtT4Wce3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-medium"
                >
                  this discourse on YouTube
                </a>
                :
              </p>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden my-6 border border-neutral-200 dark:border-neutral-800 grayscale">
                <iframe
                  src="https://www.youtube.com/embed/rGzE4t71zsQ"
                  title="OSHO for starters"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 grayscale"
                  style={{ filter: "grayscale(100%)" }}
                />
              </div>

              <blockquote className="border-l-2 border-neutral-400 dark:border-neutral-600 pl-4 my-6 italic text-neutral-600 dark:text-neutral-400">
                &quot;It is sure that OSHO can click with Generations beyond Gen-Z especially Gen-Alpha and Gen-Beta. His timeless lesson for the future of humanity to move towards individualism and liberation.&quot;
              </blockquote>
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
