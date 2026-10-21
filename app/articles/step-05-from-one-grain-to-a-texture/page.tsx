import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import CodeBlock from "@/components/code-block"
import RevealOnView from "@/components/reveal-on-view"

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
              October 19, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 5: From One Grain to a Texture
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              A simple guide to scheduling, overlapping, and mixing tiny pieces of sound.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In{" "}
                <Link
                  href="/articles/step-04-playing-one-grain"
                  className="text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"
                >
                  Step 4
                </Link>
                , I brought the earlier building blocks together into a single grain: a small piece of a recording, played through an amplitude window so its beginning and end fade smoothly.
              </p>
              <p>
                That gave me one short sound. The next question is: <strong>what happens when another grain begins before the first one finishes?</strong>
              </p>
              <p>
                This is where Step 5 begins. The implementation now schedules multiple grains, keeps track of the ones still playing, and mixes their outputs into a stereo texture. It also introduces controlled variation, so every grain does not have to start at the same position or play at the same pitch.
              </p>
              <p>
                The aim of this step is an offline WAV render. Real-time plugin playback comes later.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                1. What a grain already knows how to do
              </h2>
              <p>
                A grain is a small player with its own state. It knows where to read from the source, how quickly to move through it, how long to play, and how loud its output should be.
              </p>
              <p>For each output frame, the player:</p>
              <ol className="list-decimal space-y-2 pl-6 marker:text-emerald-300">
                <li>Reads the source at its current position, using interpolation when that position falls between stored samples.</li>
                <li>Multiplies the reading by its current window value.</li>
                <li>Applies gain and panning to produce left and right samples.</li>
                <li>Advances its source position and window age.</li>
              </ol>
              <p>
                The <strong>source position</strong> tells us where we are reading from the recording. The <strong>window age</strong> tells us how far this grain has progressed through its own lifetime.
              </p>
              <p>
                These are different things. A grain can move through the source twice as quickly while keeping the same 100 ms envelope. Step 5 reuses this player. The new work is deciding when to start players and how to combine their output.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                2. Two timelines: where a grain reads and when it plays
              </h2>
              <p>This distinction helped me understand the scheduler:</p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Question</th>
                      <th className={cellClass}>Timeline</th>
                      <th className={cellClass}>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>Where does the grain begin reading?</td><td className={cellClass}>Source recording</td><td className={cellClass}>500 ms into the input WAV</td></tr>
                    <tr><td className={cellClass}>When does the grain begin playing?</td><td className={cellClass}>Output recording</td><td className={cellClass}>150 ms into the generated texture</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                A grain launched at output time 150 ms might read from source time 500 ms. The next grain might begin at output time 200 ms and read from source time 530 ms.
              </p>
              <p>
                The output moves forward one frame at a time. The starting positions chosen within the source can move around independently. In this version, grains are chosen around a fixed source position. There is no automatic scan through the whole recording yet.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                3. Density: how often a grain begins
              </h2>
              <p>
                <strong>Density means the number of grains we aim to launch per second.</strong> If the density is 20 grains per second, the nominal time between launches is:
              </p>
              <CodeBlock
                language="text"
                code={`interval = 1 / density
         = 1 / 20 seconds
         = 0.05 seconds
         = 50 milliseconds`}
              />
              <p>At an output sample rate of 48,000 frames per second:</p>
              <CodeBlock
                language="text"
                code={`interval in frames = 48,000 / 20
                   = 2,400 frames`}
              />
              <p>
                With timing variation disabled, the scheduler therefore begins a grain every 2,400 output frames. Density describes starts, not the number of grains currently playing. A grain may finish before the next begins, or several may stay active together. That depends on duration.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                4. Duration and density create overlap together
              </h2>
              <p>
                Suppose every grain lasts 100 ms and a new grain begins every 50 ms. Their lifetimes look like this:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Grain</th><th className={cellClass}>Starts at</th><th className={cellClass}>Finishes at</th><th className={cellClass}>Overlaps with</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>A</td><td className={cellClass}>0 ms</td><td className={cellClass}>100 ms</td><td className={cellClass}>B</td></tr>
                    <tr className={rowClass}><td className={cellClass}>B</td><td className={cellClass}>50 ms</td><td className={cellClass}>150 ms</td><td className={cellClass}>A, then C</td></tr>
                    <tr className={rowClass}><td className={cellClass}>C</td><td className={cellClass}>100 ms</td><td className={cellClass}>200 ms</td><td className={cellClass}>B, then D</td></tr>
                    <tr><td className={cellClass}>D</td><td className={cellClass}>150 ms</td><td className={cellClass}>250 ms</td><td className={cellClass}>C, then the next grain</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                At 75 ms, grain A is 75 ms into its life and grain B is 25 ms into its life. Both contribute to the same output frame. A useful estimate is:
              </p>
              <CodeBlock
                language="text"
                code="average active grains ≈ density × grain duration in seconds"
              />
              <p>For 100 ms grains:</p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Density</th><th className={cellClass}>Nominal interval</th><th className={cellClass}>Approximate average overlap</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>5 grains/second</td><td className={cellClass}>200 ms</td><td className={cellClass}>0.5 grains</td></tr>
                    <tr className={rowClass}><td className={cellClass}>20 grains/second</td><td className={cellClass}>50 ms</td><td className={cellClass}>2 grains</td></tr>
                    <tr><td className={cellClass}>80 grains/second</td><td className={cellClass}>12.5 ms</td><td className={cellClass}>8 grains</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                An average of 0.5 does not mean half a grain is playing. It means that, over time, the system spends part of its time with a grain active and part with none.
              </p>
              <p>
                These estimates describe steady operation without dropped events. Random lengths, timing variation, startup, and shutdown affect the moment-to-moment count. Low density can leave gaps between sounds. Increasing density gives grains more opportunities to overlap and form a sustained texture. The exact result still depends on the source and the grain settings.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                5. Overlap-add: adding sounds at the same moment
              </h2>
              <p>
                The mixer has a straightforward job: ask each grain for its next frame and add the results. For one output channel:
              </p>
              <CodeBlock
                language="text"
                code="output[n] = grainA[n] + grainB[n] + grainC[n] + ..."
              />
              <p>
                Here, <code>n</code> is the current output-frame index. Each contribution already includes that grain&apos;s interpolation, window, gain, and pan. For example, imagine these left-channel contributions at one instant:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Grain</th><th className={cellClass}>Contribution</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>A</td><td className={cellClass}>+0.20</td></tr>
                    <tr className={rowClass}><td className={cellClass}>B</td><td className={cellClass}>+0.15</td></tr>
                    <tr className={rowClass}><td className={cellClass}>C</td><td className={cellClass}>−0.10</td></tr>
                    <tr><td className={cellClass}><strong>Mixed output</strong></td><td className={cellClass}><strong>+0.25</strong></td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Audio samples are signed amplitudes. Positive and negative contributions can partly cancel, while contributions with the same sign can reinforce each other. Overlap therefore does not guarantee that every output sample becomes larger. The right channel is summed separately.
              </p>
              <p>
                This is <strong>overlap-add</strong>: grains overlap in time, and their amplitudes are added at each output frame.
              </p>
              <p>
                The windows still matter. Each grain fades in and out instead of appearing at full amplitude and stopping abruptly. However, arbitrary grain positions, lengths, and launch times do not produce a guaranteed flat sum. Smooth individual envelopes and constant overall loudness are separate concerns.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                6. One call produces one stereo frame
              </h2>
              <p>The cloud&apos;s main operation is:</p>
              <CodeBlock language="cpp" code="const auto frame = cloud.next();" />
              <p>
                <code>auto</code> lets C++ infer the returned type. <code>frame</code> contains two values: <code>frame.left</code> and <code>frame.right</code>. One call advances the whole cloud by one output frame. It does not return a complete grain or a complete audio block. At 48 kHz, 48,000 calls produce one second of stereo output. An individual grain also advances by one frame whenever the cloud asks it for its next contribution.
              </p>
              <p>The work inside a cloud tick follows this flow:</p>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-sans text-base dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">One output frame through the grain cloud</p>
                <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                  <li className="rounded-lg border border-neutral-300 p-3 dark:border-white/15">Begin one output frame</li>
                  <li className="rounded-lg border border-neutral-300 p-3 dark:border-white/15">If a launch is due, look for a free pool slot</li>
                  <li className="rounded-lg border border-neutral-300 p-3 dark:border-white/15">Start a grain or drop the launch if the pool is full</li>
                  <li className="rounded-lg border border-neutral-300 p-3 dark:border-white/15">Advance the trigger countdown</li>
                  <li className="rounded-lg border border-emerald-400/40 p-3 sm:col-span-2">Read and sum the next frame from every grain</li>
                  <li className="rounded-lg border border-emerald-400/40 p-3 sm:col-span-2">Return the left and right samples</li>
                </ol>
              </div>
              <p>
                Inactive grains return silence, so the mixer can visit the same fixed collection every time.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                7. Scheduling without accumulating timing errors
              </h2>
              <p>
                Some launch intervals fit neatly into whole output frames. Others do not. At 48 kHz, a density of 7 grains per second gives:
              </p>
              <CodeBlock language="text" code="48,000 / 7 ≈ 6,857.142857 frames between launches" />
              <p>
                The engine cannot begin a grain partway between output frames. But rounding every interval to 6,857 would repeatedly discard the fractional remainder.
              </p>
              <p>
                Instead, the scheduler keeps a floating-point countdown. Each output frame reduces it by one. When a launch is due, the scheduler adds the next interval to the existing countdown, preserving the small remainder.
              </p>
              <p>
                This spreads the necessary whole-frame timing adjustments over time. An event lands on an available output frame while the long-term spacing stays close to the requested density.
              </p>
              <p>
                The first grain is scheduled at frame zero. With a practical Hann window, its initial amplitude is zero: launching a grain and immediately producing a nonzero sample are not the same event.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                8. The grain pool: reuse a fixed number of players
              </h2>
              <p>
                Drizel uses a pool of 64 grain slots by default. A slot holds playback state: source pointers, read position, remaining duration, window age, and gain information. It does not contain a separate copy of the source recording. When a grain finishes, its slot becomes available for another launch.
              </p>
              <p>The C++ storage is:</p>
              <CodeBlock language="cpp" code="std::array<Grain, Capacity> grains_ {};" />
              <p>
                <code>std::array</code> holds a fixed number of objects. <code>Grain</code> is the object type, and <code>Capacity</code> is the number of slots chosen at compile time. The braces initialize the collection with inactive grains.
              </p>
              <p>
                This makes the maximum voice count explicit. It also avoids creating and destroying heap-allocated grain objects during rendering.
              </p>
              <p>
                If all slots are occupied, the current policy is <strong>drop new</strong>: skip the incoming grain and let the existing ones finish their envelopes.
              </p>
              <p>
                There is a musical trade-off. At very high requested densities, fewer grains will actually start. But the engine keeps its capacity limit and avoids abruptly cutting an existing grain to make room. The renderer reports accepted launches, dropped launches, and the highest active count, so this behavior is visible.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                9. Variation: making successive grains different
              </h2>
              <p>
                Scheduling identical grains at a perfectly regular interval creates a repeating pattern. Step 5 adds several ways for neighboring grains to differ. The command-line experiment uses these settings:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className="w-full min-w-[42rem] border-collapse text-left font-sans text-base">
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Parameter</th><th className={cellClass}>Variation</th><th className={cellClass}>What changes</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>Source position</td><td className={cellClass}>Up to ±50 ms around the centre</td><td className={cellClass}>Which part of the recording is read</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Pitch</td><td className={cellClass}>Up to ±3 semitones</td><td className={cellClass}>How quickly the grain moves through the source</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Pan</td><td className={cellClass}>±0.75 around centre</td><td className={cellClass}>Where the grain sits between left and right</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Duration</td><td className={cellClass}>75, 100, or 125 ms</td><td className={cellClass}>How long the grain remains active</td></tr>
                    <tr><td className={cellClass}>Launch interval</td><td className={cellClass}>±20% around the nominal interval</td><td className={cellClass}>How regularly grains begin</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Starting positions and pan values are clamped to their permitted ranges. Once a grain starts, reads beyond the source boundary follow the existing zero-padding policy.
              </p>

              <h3 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-white">Timing jitter</h3>
              <p>
                If the nominal interval is 50 ms, ±20% jitter gives intervals from approximately 40 to 60 ms before output-frame quantization. This changes when grains begin; it does not alter the audio sample rate.
              </p>
              <p>
                Density remains a nominal control: a finite randomized render can contain slightly more or fewer launches than density multiplied by duration.
              </p>

              <h3 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-white">Length variation without new allocations</h3>
              <p>
                A longer grain needs a longer envelope. Building that envelope at launch time would allocate memory and calculate its window values during playback.
              </p>
              <p>
                Instead, preparation creates three Hann tables: short, centre, and long. Each grain borrows one of them. The current length variation is deliberately discrete. It chooses from three prepared durations, rather than every possible duration in a range.
              </p>

              <h3 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-white">Random choices happen at launch</h3>
              <p>
                A grain receives its position, pitch, pan, and length when it starts. Those choices stay fixed during that grain&apos;s lifetime. This is per-grain variation. Continuously moving a parameter while a grain plays would be an additional modulation feature.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                10. A seed makes randomness repeatable
              </h2>
              <p>
                The generator uses a seed to initialize its sequence of random values. With the same input, settings, seed, and build, the renderer makes the same choices and produces the same output. That is useful when comparing changes: a difference in the sound can be traced to the setting or code being changed, rather than a completely different random sequence.
              </p>
              <p>
                Changing the seed produces another arrangement of variations. The tests check both behaviors: exact replay with the same seed, and different output with another seed. Exact bit-for-bit equality across different platforms is not promised because mathematical functions can round differently.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                11. More grains require a gain policy
              </h2>
              <p>
                When several grains reinforce one another, their sum can become large. The mixer therefore needs a deliberate gain policy.
              </p>
              <p>
                This implementation calculates a conservative gain during preparation using the longest possible grain, the shortest possible launch interval, the pool capacity, the source&apos;s measured peak amplitude, and the selected interpolation method. The first three estimate an upper bound on simultaneous grains.
              </p>
              <p>For the default 20-grain-per-second experiment:</p>
              <CodeBlock
                language="text"
                code={`nominal interval = 50 ms
shortest interval with 20% jitter = 40 ms
longest grain = 125 ms

estimated maximum overlap = ceil(125 / 40)
                          = 4 grains`}
              />
              <p>
                <code>ceil</code> means round upward. Although the nominal average overlap is around two, the conservative bound allows for four. With a master gain of 0.8, linear interpolation, and a source peak no higher than 1:
              </p>
              <CodeBlock
                language="text"
                code={`per-grain gain = 0.8 / 4
               = 0.2`}
              />
              <p>
                Windows and panning can reduce the actual output further. Hermite interpolation receives additional headroom because its curve can overshoot the stored sample values. Source peaks above 1 also reduce the prepared gain.
              </p>
              <p>
                The gain stays fixed throughout the render. Dividing by the current active count could change the level of already-playing grains whenever another grain starts or finishes—even when the new grain&apos;s window is still at zero.
              </p>
              <p>
                This policy favors predictable peak headroom. It does not guarantee equal perceived loudness between densities, and a dense render may sound quieter. It is also not a limiter: no separate stage reacts to output peaks during playback.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                12. Preparation and playback have different jobs
              </h2>
              <p>
                The implementation separates work that happens once from work repeated for every frame.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className="w-full min-w-[38rem] border-collapse text-left font-sans text-base">
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Preparation</th><th className={cellClass}>Playback</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>Validate settings and source values</td><td className={cellClass}>Check whether a launch is due</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Measure the source peak</td><td className={cellClass}>Select per-grain variations</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Build the three window tables</td><td className={cellClass}>Reuse an available grain slot</td></tr>
                    <tr className={rowClass}><td className={cellClass}>Calculate conservative gain</td><td className={cellClass}>Advance and mix grain outputs</td></tr>
                    <tr><td className={cellClass}>Initialize the random seed</td><td className={cellClass}>Return one stereo frame</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                File loading, output-buffer allocation, and WAV writing belong to the surrounding offline experiment. The rendering path has no heap allocation, file I/O, locks, or logging. Source audio and prepared windows must stay alive and unchanged while the grains borrow them.
              </p>
              <p>
                These are useful foundations for later real-time work. They do not prove that the current implementation meets an audio callback deadline on a target machine. That still needs measurement and integration testing.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                13. Let the final grains finish
              </h2>
              <p>
                Stopping new launches should not instantly silence grains that are still playing. The experiment handles these as separate events:
              </p>
              <ol className="list-decimal space-y-2 pl-6 marker:text-emerald-300">
                <li>During the requested duration, call <code>cloud.next()</code> to schedule and mix.</li>
                <li>After that duration, call <code>cloud.next(false)</code> to mix without starting new grains.</li>
                <li>Continue long enough for the longest possible grain to finish.</li>
              </ol>
              <p>
                With the experiment&apos;s 125 ms maximum grain length, a five-second request writes 5.125 seconds of audio. At 48 kHz, that is:
              </p>
              <CodeBlock language="text" code="5.125 × 48,000 = 246,000 stereo frames" />
              <p>The added tail lets the final envelopes complete naturally.</p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                14. What changed in the code
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className="w-full min-w-[42rem] border-collapse text-left font-sans text-base">
                  <thead className={headClass}>
                    <tr><th className={cellClass}>File</th><th className={cellClass}>Responsibility</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}><code>src/audio/GrainCloud.h</code></td><td className={cellClass}>Settings, preparation, fixed pool, scheduler, variations, and mixer</td></tr>
                    <tr className={rowClass}><td className={cellClass}><code>experiments/grain-cloud/main.cpp</code></td><td className={cellClass}>Load a WAV, render the cloud, finish its tail, and save a WAV</td></tr>
                    <tr className={rowClass}><td className={cellClass}><code>tests/GrainCloudTests.cpp</code></td><td className={cellClass}>Check timing, overlap sums, capacity, tails, repeatability, and gain bounds</td></tr>
                    <tr className={rowClass}><td className={cellClass}><code>CMakeLists.txt</code></td><td className={cellClass}>Build the experiment and register its tests</td></tr>
                    <tr><td className={cellClass}><code>docs/grain-cloud.md</code></td><td className={cellClass}>Explain contracts, formulas, commands, and limitations</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The existing <code>Grain</code> player remains the unit doing sample reading and windowing. The cloud coordinates many instances of it.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                15. What has been checked
              </h2>
              <p>
                The prepared implementation passed all seven CTest targets in a Linux Release build using GCC 13.3 and JUCE 8.0.15. The new core tests also passed AddressSanitizer and UndefinedBehaviorSanitizer checks, with leak detection disabled in that execution environment.
              </p>
              <p>The checks include:</p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li>Comparing mixed output against an explicit sum of overlapping Hann windows.</li>
                <li>Checking integer and fractional trigger intervals.</li>
                <li>Forcing pool overflow and verifying the drop-new counts.</li>
                <li>Stopping launches and confirming that the remaining grains drain to silence.</li>
                <li>Replaying the same seed exactly.</li>
                <li>Checking output peak bounds with randomized settings and Hermite interpolation.</li>
              </ul>
              <p>
                I rendered the examples from the project&apos;s <code>input.wav</code> using the <code>drizel_grain_cloud</code> executable. The source is 48 kHz stereo. Each render uses a 500 ms source centre, seed 42, and five seconds of triggering followed by the 125 ms grain tail. The output is 48 kHz stereo float WAV.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr><th className={cellClass}>Density</th><th className={cellClass}>Started</th><th className={cellClass}>Dropped</th><th className={cellClass}>Maximum active</th><th className={cellClass}>Output peak</th></tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}><td className={cellClass}>5 grains/s</td><td className={cellClass}>25</td><td className={cellClass}>0</td><td className={cellClass}>1</td><td className={cellClass}>0.353603</td></tr>
                    <tr className={rowClass}><td className={cellClass}>20 grains/s</td><td className={cellClass}>100</td><td className={cellClass}>0</td><td className={cellClass}>3</td><td className={cellClass}>0.0960431</td></tr>
                    <tr className={rowClass}><td className={cellClass}>80 grains/s</td><td className={cellClass}>398</td><td className={cellClass}>0</td><td className={cellClass}>11</td><td className={cellClass}>0.0446149</td></tr>
                    <tr><td className={cellClass}>1,000 grains/s</td><td className={cellClass}>3,169</td><td className={cellClass}>1,832</td><td className={cellClass}>64</td><td className={cellClass}>0.0196274</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Each render used five seconds of triggering plus the tail. The outputs had the expected frame count, finite samples, bounded peaks, and silent endpoints. The highest-density run demonstrates the pool policy: active grains stop at 64 even when the scheduler requests more.
              </p>
              <figure className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                <figcaption className="mb-2 font-sans text-base font-semibold text-neutral-800 dark:text-neutral-100">
                  Source audio — input.wav
                </figcaption>
                <audio
                  controls
                  preload="none"
                  className="w-full"
                  src="/audio/drizel-step-5-input.wav"
                  aria-label="Original input.wav source audio used for the Drizel grain-cloud examples"
                >
                  Your browser does not support WAV audio playback.
                </audio>
              </figure>
              <div className="grid gap-4">
                <figure className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                  <figcaption className="mb-2 font-sans text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    Sparse — 5 grains per second
                  </figcaption>
                  <audio
                    controls
                    preload="none"
                    className="w-full"
                    src="/audio/drizel-step-5-density-5.wav"
                    aria-label="Generated Drizel grain-cloud render at 5 grains per second"
                  >
                    Your browser does not support WAV audio playback.
                  </audio>
                </figure>
                <figure className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                  <figcaption className="mb-2 font-sans text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    Medium — 20 grains per second
                  </figcaption>
                  <audio
                    controls
                    preload="none"
                    className="w-full"
                    src="/audio/drizel-step-5-density-20.wav"
                    aria-label="Generated Drizel grain-cloud render at 20 grains per second"
                  >
                    Your browser does not support WAV audio playback.
                  </audio>
                </figure>
                <figure className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                  <figcaption className="mb-2 font-sans text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    Dense — 80 grains per second
                  </figcaption>
                  <audio
                    controls
                    preload="none"
                    className="w-full"
                    src="/audio/drizel-step-5-density-80.wav"
                    aria-label="Generated Drizel grain-cloud render at 80 grains per second"
                  >
                    Your browser does not support WAV audio playback.
                  </audio>
                </figure>
                <figure className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                  <figcaption className="mb-2 font-sans text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    Pool-limit demonstration — 1,000 grains per second
                  </figcaption>
                  <audio
                    controls
                    preload="none"
                    className="w-full"
                    src="/audio/drizel-step-5-density-1000.wav"
                    aria-label="Generated Drizel grain-cloud render at 1,000 grains per second, demonstrating the pool limit"
                  >
                    Your browser does not support WAV audio playback.
                  </audio>
                </figure>
              </div>
              <p>
                These examples use <code>input.wav</code> as the source, so the sound and source material are the same as in the command-line experiment. Listening on the target Mac and measuring worst-case real-time performance remain open.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                16. A small listening experiment
              </h2>
              <p>After applying Step 5, build and run the tests:</p>
              <CodeBlock
                language="bash"
                code={`cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure`}
              />
              <p>
                This uses the project&apos;s existing JUCE setup. A fresh build may also need <code>-DDRIZEL_JUCE_PATH=/path/to/JUCE</code>.
              </p>
              <p>Then render three densities from the same input:</p>
              <CodeBlock
                language="bash"
                code={`./build/drizel_grain_cloud input.wav sparse.wav 5 5 500 42
./build/drizel_grain_cloud input.wav medium.wav 5 20 500 42
./build/drizel_grain_cloud input.wav dense.wav 5 80 500 42`}
              />
              <p>After the output filename, the arguments are:</p>
              <CodeBlock
                language="text"
                code={`seconds   density   source_position_ms   seed
5         20        500                  42`}
              />
              <p>
                Choose a source position inside your recording. The example uses 500 ms; use an earlier position for a short file. Each output filename must be new.
              </p>
              <p>
                Listen for how clearly individual grains stand out, when the sound becomes more continuous, how the stereo placement changes, and how the final grains fade away. Compare loudness separately from texture because the conservative gain changes with the overlap bound.
              </p>
              <p>
                Repeating the same command with a new output filename should reproduce the same result. Changing the seed should produce a different arrangement.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What this step adds to Drizel
              </h2>
              <p>
                Drizel can now coordinate many small players into one offline stereo render. Each grain still reads, interpolates, windows, and advances independently. The scheduler gives it a starting time, the pool gives it a reusable slot, and the mixer gives it a place in the combined output.
              </p>
              <p>
                There is more to do: listen on the target machine, profile the busiest cases, and eventually bring the engine into the plugin&apos;s audio callback with suitable controls and smoothing.
              </p>
              <p>
                For this step, the central connection is now in place: <strong>a texture emerges from many short sounds sharing an output timeline.</strong>
              </p>
              <p>
                Drizel is an open-source granular synthesis project:{" "}
                <a
                  href="https://github.com/neuralmanacle/drizel"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"
                >
                  github.com/neuralmanacle/drizel
                </a>
                .
              </p>
              <p className="text-base text-neutral-500 dark:text-neutral-400">
                Series note: blog Step 5 corresponds to Layer 4, “Many grains,” in the dependency roadmap. Layer 5 of that roadmap is the later real-time engine milestone.
              </p>
            </div>

            <ArticleTags />

            <div className="border-t border-neutral-200 pt-12 dark:border-neutral-800">
              <Link
                href="/"
                className="text-sm font-mono text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200"
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
