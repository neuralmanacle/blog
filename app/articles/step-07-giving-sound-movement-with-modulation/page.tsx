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
              October 24, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 7: Giving Sound Movement with Modulation
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Building a low-frequency oscillator, routing it into the synth, and letting the grain cloud evolve over time.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In{" "}
                <Link
                  href="/articles/step-06-playing-the-grain-cloud-live"
                  className={articleLinkClass}
                >
                  Step 6
                </Link>
                , Drizel became a live granular synthesizer. We could load a sample, move the play position, change pitch, adjust density, and hear the result in real time.
              </p>
              <p>
                But the sound still felt static. The controls moved only when we moved them. We had a live grain engine, but not a system that could make it evolve on its own.
              </p>
              <p>
                This is where modulation enters the picture. Instead of manually changing a parameter every few milliseconds, we create a signal that changes it automatically. The result is a synthesizer that can drift, pulse, sweep, and slowly explore its own source material.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                1. What modulation means in practice
              </h2>
              <p>
                Modulation is the act of changing one parameter over time using another signal. In a synth, the destination might be pitch, amplitude, position, density, or pan. The source is the signal that moves it.
              </p>
              <p>
                Up to this point, Drizel used direct values like: <strong>position = 0.5;</strong> That is a fixed point in the sample. If we want a parameter to move automatically, we need a generated signal rather than a constant.
              </p>
              <p>
                The basic flow is simple:
              </p>
              <CodeBlock
                language="text"
                code={`Modulation Source
        ↓
   Modulation Amount
        ↓
Destination Parameter
        ↓
   Granular Engine
        ↓
      Audio Output`}
              />
              <p>
                The modulation signal is not the final sound itself. It is a control signal used to shape how the synth behaves over time.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                2. Low-frequency oscillators as a starting point
              </h2>
              <p>
                An oscillator is a mathematical function that moves through a cycle. A musical oscillator can produce audible tones. An LFO is slower; it does not usually create a note directly, but instead moves a control parameter.
              </p>
              <p>
                In this step, Drizel uses a simple LFO that can generate two kinds of waves:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><strong>Sine</strong>: smooth, organic movement with gradual direction changes.</li>
                <li><strong>Triangle</strong>: linear rise and fall with a sharper reversal at the peaks.</li>
              </ul>
              <p>
                Both waveforms generate values between -1 and +1. That makes them useful for bipolar modulation, where a parameter can move above and below its base value.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                3. Frequency, phase, and depth
              </h2>
              <p>
                Three concepts matter most when building an LFO:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Concept</th>
                      <th className={cellClass}>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}>
                      <td className={cellClass}>Frequency</td>
                      <td className={cellClass}>How quickly the oscillator cycles per second.</td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Phase</td>
                      <td className={cellClass}>Where we are inside the current cycle.</td>
                    </tr>
                    <tr>
                      <td className={cellClass}>Depth</td>
                      <td className={cellClass}>How strongly the modulation affects the destination.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Frequency is measured in Hz, with one cycle taking <strong>T = 1 / f</strong> seconds. A 1 Hz LFO completes a cycle each second. A 0.1 Hz LFO takes 10 seconds. That gives us a way to create slow, evolving textures instead of fast audible vibrato.
              </p>
              <p>
                Phase is the current position within the cycle. A normalized phase runs from 0 to 1, where 0.25 is a quarter cycle and 0.5 is halfway through. The sine is computed using:
              </p>
              <CodeBlock
                language="text"
                code={`L(φ) = sin(2πφ)`}
              />
              <p>
                Depth is the modulation intensity. A destination can move by a small amount or a large amount depending on how much of the LFO signal we apply. Rate says how fast it moves; depth says how much it moves.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                4. Implementing the LFO in C++
              </h2>
              <p>
                The first implementation is deliberately lightweight and framework-independent. The modulation code lives in a simple DSP helper, not inside JUCE-specific graph code.
              </p>
              <CodeBlock
                language="cpp"
                code={`enum class LfoShape
{
    sine,
    triangle
};

class Lfo
{
private:
    double sampleRate_ = 48000.0;
    double rate_ = 1.0;
    double phase_ = 0.0;
    LfoShape shape_ = LfoShape::sine;
};`}
              />
              <p>
                The key part is phase accumulation. Each sample advances the oscillator by a tiny amount, then wraps around when it exceeds one full cycle:
              </p>
              <CodeBlock
                language="cpp"
                code={`phase_ += rate_ / sampleRate_;
phase_ -= std::floor(phase_);`}
              />
              <p>
                This is how the oscillator keeps moving without growing unbounded. The phase is a stateful value, which means the LFO remembers where it left off. That is the core requirement for any repeating DSP control signal.
              </p>
              <p>
                The waveform itself is generated as the phase passes through the cycle:
              </p>
              <CodeBlock
                language="cpp"
                code={`double next() noexcept
{
    const double value =
        shape_ == LfoShape::triangle
            ? 1.0 - 4.0 * std::abs(phase_ - 0.5)
            : std::sin(6.28318530717958647692 * phase_);

    phase_ += rate_ / sampleRate_;
    phase_ -= std::floor(phase_);

    return value;
}`}
              />
              <p>
                This is intentionally minimal. It does not allocate memory, depend on the host, or block the audio thread. It is exactly the sort of thing we want in a real-time synth architecture.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                5. Modulation routing: deciding where the movement goes
              </h2>
              <p>
                Once we have a modulation signal, we still need a destination. The same LFO should be able to move pitch, position, or other parameters depending on the design. That routing choice is the next layer.
              </p>
              <CodeBlock
                language="cpp"
                code={`enum class ModDestination
{
    off,
    position,
    pitch
};`}
              />
              <p>
                The general formula is:
              </p>
              <CodeBlock
                language="text"
                code={`P_target = P_base + L(t) * D * R`}
              />
              <p>
                Here, <strong>P_base</strong> is the manual value, <strong>L(t)</strong> is the LFO output, <strong>D</strong> is modulation depth, and <strong>R</strong> is the maximum modulation range. A position modulation example becomes:
              </p>
              <CodeBlock
                language="text"
                code={`Base position = 0.5
LFO output    = +1.0
Depth         = 0.8
Range         = 0.25

P = 0.5 + (1.0 * 0.8 * 0.25)
  = 0.7`}
              />
              <p>
                The same LFO can push the grain-start position from 0.3 to 0.7, giving the synth a repeated scan through a sample. For pitch, we might use a range of ±12 semitones and scale the LFO output by depth, creating a slow pitch drift or periodic movement.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                6. Clamping and real-time safety
              </h2>
              <p>
                A parameter cannot always accept any possible modulation value. Position is valid only between 0 and 1; pitch must remain in a workable range. If modulation pushes an output beyond its valid domain, the result is not just a bad number; it can create unstable or unpredictable synth behaviour.
              </p>
              <CodeBlock
                language="cpp"
                code={`position = std::clamp(
    position + lfoValue * depth * 0.25,
    0.0,
    1.0
);

pitch = std::clamp(
    pitch + lfoValue * depth * 12.0,
    -24.0,
    24.0
);`}
              />
              <p>
                Clamping turns modulation from a loose mathematical idea into a bounded audio-control system. Every destination has a defined range, and the engine respects it.
              </p>
              <p>
                This also keeps the modulation path safe for the audio callback. The code avoids blocking operations, allocations, locks, and file access. It produces deterministic values from a small amount of state and a few arithmetic operations.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                7. Connecting modulation to JUCE
              </h2>
              <p>
                The LFO itself is framework-independent, but JUCE still owns the parameter system and the audio callback. In the plugin, we register four controls: LFO rate, depth, shape, and destination. This is handled through AudioProcessorValueTreeState.
              </p>
              <CodeBlock
                language="cpp"
                code={`lfo.setRate(lfoRate->load());

lfo.setShape(
    lfoShape->load() >= 0.5f
        ? drizel::LfoShape::triangle
        : drizel::LfoShape::sine
);`}
              />
              <p>
                The processing loop then reads the modulator output once per sample, applies the routing logic, and passes the resulting target into the granular engine.
              </p>
              <CodeBlock
                language="cpp"
                code={`for (int i = 0; i < buffer.getNumSamples(); ++i)
{
    const auto targets = modulation.apply(
        pos,
        semitones,
        lfo.next()
    );

    const auto frame = engine.next(
        targets.position,
        targets.pitch,
        grains,
        level
    );
}`}
              />
              <p>
                This creates a clean signal path: the LFO creates movement, routing decides where it lands, and the granular engine renders the result.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                8. Modulation and smoothing are different jobs
              </h2>
              <p>
                This is one of the most important ideas in the step. The engine already contains smoothing to avoid abrupt changes. That is not the same as modulation.
              </p>
              <p>
                <strong>Modulation decides where a parameter should move.</strong> <strong>Smoothing decides how quickly the current value approaches that target.</strong>
              </p>
              <p>
                The signal flow looks like this:
              </p>
              <CodeBlock
                language="text"
                code={`Base Parameter
      ↓
 + Modulation
      ↓
Modulated Target
      ↓
    Smoother
      ↓
Granular Engine`}
              />
              <p>
                In other words, modulation creates movement, while smoothing damps and shapes the transition. A fast LFO and a 20 ms smoothing time constant interact in a very real way: the smoother can lag behind the modulation source and attenuate sharp movement. That is not a bug; it is a property of the system. We can tune it later as needed.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                9. Why this matters for the grain cloud
              </h2>
              <p>
                A position LFO changes the source position chosen for newly launched grains. That means grain starts can drift across the sample instead of staying fixed at one point. The result is organic movement through the recording, almost like the instrument is scanning through a landscape of sound.
              </p>
              <p>
                A pitch LFO changes the playback rate selected for new grains. Because grains overlap, the cloud hears multiple pitch states at once. Some grains may be higher; others lower; together they form a richer texture than a single fixed pitch destination.
              </p>
              <p>
                This is especially useful for granular synthesis because the sound is already composed of many overlapping events. Modulation adds motion to that cloud without requiring a separate, expensive render pipeline.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                10. What we learn from the first modulation system
              </h2>
              <p>
                At first glance, Step 7 adds only a sine wave and a triangle wave. But the architectural shift is bigger than that. We now have a clean separation between:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><strong>Source</strong>: a signal generator like an LFO.</li>
                <li><strong>Routing</strong>: the choice of destination and depth.</li>
                <li><strong>Engine</strong>: the granuar synthesizer that consumes the control values.</li>
              </ul>
              <p>
                That separation is what enables future work: envelope generators, random-walk modulation, density modulation, spread modulation, and more flexible control policies. It also gives us a foundation for instructions that can describe musically meaningful movement, even if that is still a longer-term experiment.
              </p>
              <p>
                The key idea is simple: if we want a synthesizer to sound alive, its parameters must move. A good modulation system gives those parameters motion without sacrificing reliability or clarity in the real-time audio path.
              </p>
              <p>
                Drizel can now move through its source material on its own. This is not the final modulation roadmap, but it is a strong first step toward a more expressive and evolving instrument.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                11. The next step
              </h2>
              <p>
                The next work is to extend the modulation system beyond a single LFO and destination. We can add more sources, more routing flexibility, and clearer rules for how modulation interacts with the grain scheduler and smoothing layers. The goal is to preserve the real-time safety that made this early version useful while opening the door to richer, more musical motion.
              </p>

              <p>
                And that is exactly what makes Step 7 important: it turns Drizel from a responsive instrument into an evolving one.
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
