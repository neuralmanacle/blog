"use client"

import * as React from "react"
import Link from "next/link"
import RevealOnView from "@/components/reveal-on-view"
import ArticleTags from "@/components/article-tags"
import AnimatedHeading from "@/components/animated-heading"
import { animate, stagger } from "motion"

type WordToken = {
  word: string
  link?: string
}

const p1 = `What are man and woman? What are Shiva and Shakti? What are feminine and masculine? I'm passing through an intense psychedelic cleansing and deconditioning myself and healing from childhood traumas of parental neglect. Why should I be a "man," just because I was born into the body of a man? The soul has no gender, no race, and no religion other than being the soul. The soul is pure; it is the structures built to destroy the soul that should be eradicated.`

const p2 = `As a person who is exploring themselves, I realized that I'm also a huge victim of the patriarchal male gaze. I went too far and forced patriarchy into my soul only for it to bounce off my soul. Women are the worst patriarchs. It is not an individual I mustn't hate; it is patriarchy and all the other colonial forces.`

const p3 = `Once a person's energy shifts from a lower vibration to a higher one, then the consciousness moves towards the truth. Truth is feminine. Witches were burnt as they spoke the truth. As my energies are shifting, I can feel the collective feminine. I can hear whose voices are inside my head; I can uncondition myself, and it requires grit and strength to be vulnerable to myself. The external world is dangerous. Find your inner voice and create a safe space inside your head.`

const p4_segment1 = `I feel sad for women who are victims of patriarchy, like my mother, and sad that I can't help her. Speak your truth. Dark forces like pornography and people who pull the strings want to instill the control to make us their slaves. To obey the`
const link1Text = `master of puppets, ft. Metallica.`
const link1Url = `https://music.youtube.com/watch?v=xnKhsTXoKCI`

const p5 = `The voices that say this and that, the voices that put a choke on your throat—you must speak up to the world. There is nothing more beautiful and powerful than authenticity. It is very attractive from a distance. I'm unlearning the hate in me, the racism, the sexism, and all the emotions that harm my heart and throat chakra. The true inner voice or the soul is eternal. It works in a higher dimension than food and sex. Let the woman speak. She is inside you. It is better to go in silence than to speak untruthful things.`

const p6_segment1 = `My soul person from the Beatles is the silent one—George Harrison. I read that he was not given much voice, and that is what he compiled into one after the break of the band for it to become the best albums of all time,`
const link2Text = `"All Things Must Pass."`
const link2Url = `https://music.youtube.com/playlist?list=OLAK5uy_mFu6JOPH-wgtQKqOdo3uiMJU5TTvzqQLE`
const p6_segment2 = `The witch in me wants to speak the truth, and yes, I'll get assassinated some day!`

const paragraphs: WordToken[][] = [
  p1.trim().split(/\s+/).map((w) => ({ word: w })),
  p2.trim().split(/\s+/).map((w) => ({ word: w })),
  p3.trim().split(/\s+/).map((w) => ({ word: w })),
  [
    ...p4_segment1.trim().split(/\s+/).map((w) => ({ word: w })),
    ...link1Text.trim().split(/\s+/).map((w) => ({ word: w, link: link1Url })),
  ],
  p5.trim().split(/\s+/).map((w) => ({ word: w })),
  [
    ...p6_segment1.trim().split(/\s+/).map((w) => ({ word: w })),
    ...link2Text.trim().split(/\s+/).map((w) => ({ word: w, link: link2Url })),
    ...p6_segment2.trim().split(/\s+/).map((w) => ({ word: w })),
  ],
]

function AnimatedBody({
  paragraphs,
  startDelay = 0.8,
  durationPerWord = 0.8,
  staggerPerWord = 0.015,
  fromBlurPx = 8,
  fromTranslateYPx = 10,
}: {
  paragraphs: WordToken[][]
  startDelay?: number
  durationPerWord?: number
  staggerPerWord?: number
  fromBlurPx?: number
  fromTranslateYPx?: number
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return
    const wordSpans = containerRef.current.querySelectorAll<HTMLSpanElement>("[data-word]")

    wordSpans.forEach((el) => {
      el.style.opacity = "0"
      el.style.filter = `blur(${fromBlurPx}px)`
      el.style.transform = `translateY(${fromTranslateYPx}px)`
    })

    animate(
      Array.from(wordSpans),
      { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" } as any,
      {
        duration: durationPerWord,
        delay: stagger(staggerPerWord, { start: startDelay } as any),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      } as any
    )
  }, [paragraphs, startDelay, durationPerWord, staggerPerWord, fromBlurPx, fromTranslateYPx])

  return (
    <div ref={containerRef} className="article-header space-y-6 text-2xl leading-relaxed text-justify font-mono">
      {paragraphs.map((paraTokens, pIdx) => {
        const elements: React.ReactNode[] = []
        let currentLink: string | undefined = undefined
        let currentGroup: WordToken[] = []

        const pushGroup = (key: string) => {
          if (currentGroup.length === 0) return
          if (currentLink) {
            const url = currentLink
            elements.push(
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-neutral-400/40 hover:decoration-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-400 dark:decoration-neutral-700 dark:text-neutral-200 transition-colors inline-block"
              >
                {currentGroup.map((t, idx) => (
                  <span
                    key={`link-word-${idx}`}
                    data-word
                    className="inline-block will-change-transform mr-1"
                  >
                    {t.word}
                  </span>
                ))}
              </a>
            )
          } else {
            elements.push(
              ...currentGroup.map((t, idx) => (
                <span
                  key={`word-${key}-${idx}`}
                  data-word
                  className="inline-block will-change-transform mr-1 text-neutral-700 dark:text-neutral-300"
                >
                  {t.word}
                </span>
              ))
            )
          }
          currentGroup = []
        }

        paraTokens.forEach((t, idx) => {
          if (t.link !== currentLink) {
            pushGroup(`group-${pIdx}-${idx}`)
            currentLink = t.link
          }
          currentGroup.push(t)
        })
        pushGroup(`group-${pIdx}-final`)

        return (
          <p key={`p-${pIdx}`} className="leading-relaxed">
            {elements}
          </p>
        )
      })}
    </div>
  )
}

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
              July 11, 2026
            </p>

            <AnimatedHeading
              lines={['"Destroy Patriarchy,', 'Not The Planet."']}
              className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono"
              startDelay={0.1}
            />

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <AnimatedBody paragraphs={paragraphs} />

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
