import type { Metadata } from "next"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import CodeBlock from "@/components/code-block"
import RevealOnView from "@/components/reveal-on-view"
import VideoExplanation from "@/components/video-explanation"

export const metadata: Metadata = {
  title: "Step 8: From One LFO to a Modulation System",
  description:
    "A design for growing Drizel's first LFO into a reusable system of modulation sources, routes, and bounded parameter movement.",
  alternates: {
    canonical: "/articles/step-08-building-a-modulation-system",
  },
}

const articleLinkClass =
  "text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"
const tableClass =
  "w-full min-w-[36rem] border-collapse text-left font-sans text-base"
const headClass = "bg-neutral-100 dark:bg-white/5"
const cellClass = "p-3"
const rowClass = "border-b border-neutral-200 dark:border-white/10"

export default function ArticlePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <RevealOnView intensity="soft">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200 font-mono"
            >
              ← Back
            </Link>

            <p className="text-sm font-mono text-neutral-500 dark:text-white/40">
              October 25, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 8: From One LFO to a Modulation System
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Turning a useful first oscillator into a flexible architecture for
              movement across the grain cloud.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In{" "}
                <Link
                  href="/articles/step-07-giving-sound-movement-with-modulation"
                  className={articleLinkClass}
                >
                  Step 7
                </Link>
                , Drizel gained its first modulation source: a low-frequency
                oscillator that can move grain position or pitch. That was
                enough to make a static cloud evolve, but it also revealed the
                next design problem. If every new kind of movement needs its
                own special path through the audio engine, the system will
                become difficult to extend.
              </p>
              <p>
                Step 8 is about making modulation a shared language. A source
                produces a control signal, a route connects that signal to a
                destination, and the destination applies it within its own
                range. The LFO remains useful, but it becomes one source among
                several rather than the whole system.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                1. Separate sources from destinations
              </h2>
              <p>
                A modulation <strong>source</strong> describes how a value
                changes over time. A <strong>destination</strong> describes
                which synth parameter receives that change. They answer
                different questions, so they should not be built into one
                another.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Source</th>
                      <th className={cellClass}>Character</th>
                      <th className={cellClass}>Possible use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}>
                      <td className={cellClass}>LFO</td>
                      <td className={cellClass}>Repeating and rate-controlled</td>
                      <td className={cellClass}>A regular scan or pulse</td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Envelope</td>
                      <td className={cellClass}>Changes in response to an event</td>
                      <td className={cellClass}>A shaped rise and fall</td>
                    </tr>
                    <tr>
                      <td className={cellClass}>Random walk</td>
                      <td className={cellClass}>Slow, bounded, seeded drift</td>
                      <td className={cellClass}>Less repetitive movement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                These sources have different timing and state. An LFO advances
                its phase continuously. An envelope needs a trigger and a
                defined shape. A random walk changes its target over time and
                needs a rule for how far it may wander. The engine should not
                need to know those details; it should consume modulation
                values through a common interface.
              </p>
              <p>
                A shared interface does not mean every source behaves the
                same. It means the rest of the system can ask each source for
                its current value without knowing how that value was made.
              </p>
              <CodeBlock
                language="cpp"
                code={`class ModulationSource
{
public:
    virtual ~ModulationSource() = default;
    virtual float next() noexcept = 0;
    virtual void reset() noexcept = 0;
};`}
              />
              <p>
                This is an architectural sketch, not a claim that Drizel
                already has this interface. The actual implementation should
                choose a representation that fits the audio callback and
                avoids unnecessary dynamic dispatch or allocation there.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                2. Give modulation values clear meanings
              </h2>
              <p>
                A source value is not yet a parameter value. A normalized
                position is measured between 0 and 1, pitch is measured in
                semitones, and density is measured in grain starts per second.
                Treating all three as interchangeable numbers would make
                routing ambiguous.
              </p>
              <p>
                Each destination needs a base value, a modulation amount, and
                a mapping from the source&apos;s range into that
                destination&apos;s units. For a bipolar source and a
                normalized position, that might look like this:
              </p>
              <CodeBlock
                language="text"
                code={`position target = base position
               + source value × amount × position range

safe position = clamp(position target, 0, 1)`}
              />
              <p>
                For pitch, the same source could instead be scaled in
                semitones. A small amount might create a gentle drift; a larger
                one might sweep across a wider interval. The source stays
                reusable because the route supplies the destination-specific
                units and range.
              </p>
              <p>
                Sources can also be unipolar or bipolar. An envelope commonly
                moves from zero toward one, while the Step 7 LFO moves above
                and below zero. The route must account for that difference
                rather than quietly assuming that every source has the same
                range.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                3. Make a route small and explicit
              </h2>
              <p>
                A route can be described with three pieces: which source to
                read, which destination to affect, and how much influence to
                apply. With that boundary in place, new sources can be added
                without rewriting the grain engine for each one.
              </p>
              <CodeBlock
                language="cpp"
                code={`struct ModulationRoute
{
    ModSourceId source;
    ModDestination destination;
    float amount;
};`}
              />
              <p>
                This is also the point where multiple routes become possible.
                One slow LFO could move position while a random walk adds a
                smaller offset to spread. Their contributions can be combined
                with the base parameter, then clamped once to the destination
                range.
              </p>
              <CodeBlock
                language="text"
                code={`target = base
       + route 1 contribution
       + route 2 contribution

safe target = clamp(target, destination minimum, destination maximum)
current value = smooth(current value, safe target)`}
              />
              <p>
                The order matters. Combining routes before clamping preserves
                their intended relationship; applying the same smoothing path
                after the final target keeps the engine&apos;s response
                consistent. Destination-specific limits still decide what is
                valid.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                4. Extend movement across the grain cloud
              </h2>
              <p>
                The Step 7 prototype focuses on position and pitch. The broader
                modulation design can include density and spread as well:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li>
                  <strong>Position</strong> changes where newly launched grains
                  read from the source sample.
                </li>
                <li>
                  <strong>Pitch</strong> changes the playback rate chosen for
                  new grains.
                </li>
                <li>
                  <strong>Density</strong> changes how frequently the scheduler
                  launches grains.
                </li>
                <li>
                  <strong>Spread</strong> changes how broadly grains are
                  distributed in the stereo field.
                </li>
              </ul>
              <p>
                These parameters do not have the same units or perceptual
                effect. A route should therefore identify its destination and
                let that destination define its safe range and interpretation.
                Modulation adds motion; it should not bypass the parameter
                rules that keep the instrument predictable.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                5. Keep the audio path predictable
              </h2>
              <p>
                All of this movement eventually reaches the real-time audio
                callback. The same constraints from Step 6 and Step 7 still
                apply: no file access, blocking locks, memory allocation, or
                unpredictable work in the processing loop.
              </p>
              <p>
                A source should keep only the state it needs. The LFO needs
                phase; an envelope needs its current stage and level; a
                random walk needs its current value and random-generator
                state. Parameters can be read once per block, while the
                modulation values and smoothed targets are updated at the
                cadence required by the engine.
              </p>
              <p>
                Random movement also needs reproducible rules. A seed makes a
                random walk repeatable for tests and renders, while bounded
                steps keep it from wandering beyond its destination&apos;s
                range. Randomness can make a texture less predictable without
                making the software itself unpredictable.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                6. Test the system, not just the waveforms
              </h2>
              <p>
                Testing the LFO&apos;s sine and triangle shapes was a useful
                start. A general system needs tests for the connections between
                sources and parameters too:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li>Each source stays within its documented output range.</li>
                <li>
                  An envelope follows its trigger and stage timing rules.
                </li>
                <li>
                  Identical random-walk seeds produce identical sequences.
                </li>
                <li>
                  A route with zero amount leaves its base value unchanged.
                </li>
                <li>
                  Combined routes remain inside the destination&apos;s limits.
                </li>
                <li>
                  Adding a source does not require source-specific engine
                  branches.
                </li>
              </ul>
              <p>
                These checks establish correctness, but they do not replace
                listening. The final modulation amounts and rates need to feel
                useful across different samples, and callback timing still
                needs to be measured on the target build.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                7. A foundation for what comes next
              </h2>
              <p>
                The Drizel roadmap describes a broader modulation layer:
                reusable sources, explicit routes, and a shared path for
                smoothing the values that reach the engine. Step 7 is the
                first working increment of that layer, not its completion.
                Envelopes, seeded random walks, and routing to density and
                spread remain follow-on work.
              </p>
              <p>
                That distinction is important. A clean design is not the same
                as a finished feature, and an architecture sketch is not a
                test result. The next milestone is to implement these pieces,
                verify them with automated tests, measure their cost in the
                callback, and listen to how they shape the sound.
              </p>
              <p>
                Once sources and destinations can evolve independently, the
                grain cloud gets more than another control. It gets a
                foundation for motion that can be extended without losing
                sight of musical intent or real-time reliability.
              </p>
            </div>

            <VideoExplanation
              videoId="JgEzIlNsFfs"
              title="Step 8: Designing a Modulation System"
            />

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
