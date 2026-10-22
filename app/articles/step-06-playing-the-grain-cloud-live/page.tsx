import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import CodeBlock from "@/components/code-block"
import RevealOnView from "@/components/reveal-on-view"

const tableClass =
  "w-full min-w-[36rem] border-collapse text-left font-sans text-base"
const headClass = "bg-neutral-100 dark:bg-white/5"
const cellClass = "p-3"
const rowClass = "border-b border-neutral-200 dark:border-white/10"
const articleLinkClass =
  "text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"

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
              October 22, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 6: Playing the Grain Cloud Live
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Taking Drizel from an offline render into a live JUCE audio
              callback.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In{" "}
                <Link
                  href="/articles/step-05-from-one-grain-to-a-texture"
                  className={articleLinkClass}
                >
                  Step 5
                </Link>
                , Drizel could schedule overlapping grains and write their
                texture to a WAV file. That proved the cloud could be rendered,
                but it did not yet play as an instrument.
              </p>
              <p>
                Step 6 connects that same grain cloud to JUCE&apos;s audio
                callback. A WAV can now be loaded in the plugin, and the sound
                can be shaped while it plays. The new challenge is not just
                generating audio: it is doing predictable work on the audio
                thread while sample loading and parameter changes happen
                elsewhere.
              </p>
              <p>
                This is Layer 5, the real-time engine milestone in the Drizel
                roadmap. It is not the later promptable-modulation layer, and
                passing automated tests does not yet complete all of Layer
                5&apos;s exit criteria.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                From file renderer to live instrument
              </h2>
              <p>
                The previous step asked for an output duration, rendered that
                many frames, and saved them. A plugin has no such fixed render:
                the host repeatedly asks for the next block of samples, and
                that callback has a deadline. If it blocks or does unpredictable
                work, the result can be an audible dropout.
              </p>
              <p>
                So the engine keeps the existing grain cloud, but divides the
                surrounding work by thread. The worker loads and prepares a
                sample. The audio callback only renders from data that is
                already ready. The editor presents controls and loading status;
                it does not own the audio engine.
              </p>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-sans text-base dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                  The live path
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center text-neutral-600 dark:text-neutral-300">
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-white/15">
                    Load and prepare on worker
                  </span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">
                    Publish prepared sample
                  </span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">
                    Render block in callback
                  </span>
                </div>
              </div>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What the controls do
              </h2>
              <p>
                The first version keeps the instrument intentionally small. It
                plays continuously when enabled; MIDI notes are not needed.
                Each grain is 100 ms long, uses a Hann envelope, and spreads
                across stereo. The controls are:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Control</th>
                      <th className={cellClass}>Range</th>
                      <th className={cellClass}>What it changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}>
                      <td className={cellClass}>Position</td>
                      <td className={cellClass}>0–1</td>
                      <td className={cellClass}>
                        Where grains start in the sample, not a moving playhead
                      </td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Pitch</td>
                      <td className={cellClass}>−24 to +24 semitones</td>
                      <td className={cellClass}>
                        Grain playback rate, corrected for sample and output
                        rates
                      </td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Density</td>
                      <td className={cellClass}>1–100 grains/s</td>
                      <td className={cellClass}>
                        How often new grains are started
                      </td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Output gain</td>
                      <td className={cellClass}>0–1</td>
                      <td className={cellClass}>
                        Smoothed level after the cloud is mixed
                      </td>
                    </tr>
                    <tr>
                      <td className={cellClass}>Play</td>
                      <td className={cellClass}>On/off</td>
                      <td className={cellClass}>
                        Smoothly mutes the output; the scheduler keeps running
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Position is a location in the source, rather than a cursor that
                scans from start to finish. Near the end of a file, reads are
                zero-padded instead of wrapping back to the beginning. The
                existing linear interpolator also retains its pitch-shifting
                aliasing limitations.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Keep loading away from the callback
              </h2>
              <p>
                Opening a WAV involves file access, decoding, scanning the
                samples, and preparing window tables. None of that belongs in
                the audio callback. Instead, the worker builds a complete
                prepared sample and cloud, then publishes that packet for the
                audio thread to adopt.
              </p>
              <p>
                Ownership matters because grains borrow the sample data and
                window tables. Those objects must stay at a stable address and
                remain alive for as long as any grain might read them. The
                engine therefore transfers exclusive ownership through
                single-slot atomic mailboxes; it does not treat an atomic raw
                pointer as if it were safe shared ownership.
              </p>
              <ol className="list-decimal space-y-2 pl-6 marker:text-emerald-300">
                <li>
                  The control side queues a file path and request revision. The
                  worker decodes the file and prepares its data.
                </li>
                <li>
                  The worker publishes the completed packet. If a newer request
                  makes it obsolete, the worker can discard it.
                </li>
                <li>
                  When the callback sees a pending packet, it fades the output
                  down over 10 ms before taking ownership at silence.
                </li>
                <li>
                  It retires the previous packet for the worker to reclaim, then
                  fades back in over 10 ms.
                </li>
              </ol>
              <p>
                This is a short dip, not a seamless crossfade. If the worker
                has not reclaimed the old packet yet, the callback postpones a
                swap rather than waiting, deleting data, or overwriting an
                uncollected retirement slot. Slow loading or reclamation can
                extend the dip.
              </p>
              <p>
                A failed load is reported in the status line and leaves the
                currently playing sample in place. Sample preparation is
                bounded to 256 MiB per decoded sample, although the old,
                pending, and in-progress samples can temporarily coexist, so
                total use can exceed that single-sample limit.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Smooth changes without rebuilding the cloud
              </h2>
              <p>
                A control can change between audio blocks. Jumping directly to
                a new value can create an abrupt change in the sound, so the
                processor reads parameter targets once per block and smooths
                them over 20 ms as it renders frames:
              </p>
              <CodeBlock
                language="cpp"
                code={`current += (1.0 - std::exp(-1.0 / (sampleRate * 0.020)))
    * (target - current);`}
              />
              <p>
                Position, pitch, and density are passed to the cloud as they
                move toward their targets. Existing grains keep the values they
                started with; new values affect grains launched afterwards.
                Output gain and Play smooth the final mix.
              </p>
              <p>
                The cloud prepares its conservative gain at the maximum
                supported density of 100 grains per second. The live density
                control can move down from that ceiling, but cannot exceed it.
                This avoids changing the prepared gain abruptly while density
                moves, though sparse textures may consequently sound quieter.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What the callback does not do
              </h2>
              <p>
                The callback handles the actual block length supplied by the
                host, renders stereo output, and averages the channels for a
                mono destination. It also clears unused channels and checks
                that the output remains finite and within the configured
                bounds.
              </p>
              <p>
                The rendering path avoids file I/O, locks, allocation,
                deallocation, logging, window creation, source scans, UI calls,
                and thread creation. Atomic pointer and float operations are
                checked for lock-freedom at compile time. A worker thread
                handles loading and reclamation; the processor owns the worker
                and engine beyond the lifetime of the editor window.
              </p>
              <p>
                Avoiding those operations is necessary engineering for a
                real-time audio path, but it is not a guarantee that every host,
                device, and buffer size will meet its deadline. That needs
                measurement on the target system.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                State, formats, and things still to do
              </h2>
              <p>
                The plugin stores its parameter values and the path of the
                selected sample in host state, not a copy of the audio. On
                restore it queues another background load. The file therefore
                needs to remain at its saved location; a missing file is
                reported as an error. An empty path restores a silent source.
              </p>
              <p>
                The loader accepts supported mono or stereo PCM16, PCM24, and
                float32 WAV files. Grain length, alternate interpolation, MIDI,
                modulation routing, and a full preset or sample-browser design
                remain later work. The linear interpolator&apos;s aliasing
                limitation also remains.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Build and try it
              </h2>
              <p>
                On macOS, open <code>drizel.jucer</code> in Projucer, save or
                regenerate the Xcode project, and build the Standalone, VST3,
                or AU target. The project includes the WAV adapter and core
                headers. Alternatively, with JUCE 8.0.15 available:
              </p>
              <CodeBlock
                language="sh"
                code={`cmake -S . -B build-plugin \\
  -DDRIZEL_JUCE_PATH=../JUCE \\
  -DDRIZEL_BUILD_PLUGIN=ON \\
  -DCMAKE_BUILD_TYPE=Release
cmake --build build-plugin --parallel 2
ctest --test-dir build-plugin --output-on-failure`}
              />
              <p>
                The CMake plugin build is opt-in; without the plugin flag, the
                default configuration builds the command-line experiments and
                tests. Plugin products are written under{" "}
                <code>build-plugin/DrizelPlugin_artefacts/</code> and are not
                installed automatically.
              </p>
              <p>
                Load a WAV, wait for the Ready status, then try moving Position,
                Pitch, and Density during playback. Use a source with audible
                material near its beginning, or move Position to a section that
                contains sound.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What has been verified
              </h2>
              <p>
                The recorded checks on October 22, 2026, include a Debug CMake
                build against JUCE 8.0.15 with all eight CTest entries passing.
                Processor and editor translation units also passed a strict
                GCC C++17 syntax check against the JUCE headers. The engine
                passed AddressSanitizer and UndefinedBehaviorSanitizer checks;
                leak detection was disabled in that environment.
              </p>
              <p>
                An optimized engine run rendered 480,000 frames—10 seconds at
                48 kHz and maximum density—in about 0.066 seconds on a shared
                Linux runner. That aggregate throughput number is not a
                worst-case callback timing measurement.
              </p>
              <p>
                The automated tests cover sample-rate changes, irregular frame
                groups, smooth muting, sample replacement, obsolete packets,
                invalid controls, concurrent publication and reclamation, and
                guards against allocating or deleting on the simulated audio
                thread. They exercise the framework-independent callback path,
                not a physical audio device. A linked plugin and host have not
                been validated by the syntax check.
              </p>
              <p>
                Before calling the real-time milestone complete, the remaining
                work includes worst-case callback timing at 64, 128, 256, and
                512 samples on the target machine; extended listening; host
                save and reload; rapid file swaps; device changes; and checking
                for zipper noise. Hardware listening and deadline measurements
                still matter.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                From a texture to an instrument
              </h2>
              <p>
                Step 6 brings the offline grain cloud to the point where it can
                respond to live controls. The callback renders prepared audio;
                the worker owns the expensive preparation and cleanup; and
                ownership handoffs keep borrowed sample data alive across the
                boundary.
              </p>
              <p>
                The next milestone is not simply adding more controls. First,
                the engine needs listening and timing tests on the machine and
                hosts it is meant to serve. Real-time behavior is something to
                measure, not infer from a successful build.
              </p>
              <p>
                Drizel is an open-source granular synthesis project:{" "}
                <a
                  href="https://github.com/neuralmanacle/drizel"
                  target="_blank"
                  rel="noreferrer"
                  className={articleLinkClass}
                >
                  github.com/neuralmanacle/drizel
                </a>
                .
              </p>

              <p className="text-base text-neutral-500 dark:text-neutral-400">
                Series note: blog Step 6 corresponds to Layer 5, the real-time
                engine, in the Drizel dependency roadmap. Promptable modulation
                is a later Layer 6 milestone.
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
