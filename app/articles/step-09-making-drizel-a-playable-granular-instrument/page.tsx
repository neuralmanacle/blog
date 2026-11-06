import type { Metadata } from "next"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import CodeBlock from "@/components/code-block"
import RevealOnView from "@/components/reveal-on-view"

function MathEquation({ markup, label }: { markup: string; label: string }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5 text-neutral-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-100">
      <math
        display="block"
        aria-label={label}
        className="mx-auto font-serif text-xl sm:text-2xl"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  )
}

const tableClass =
  "w-full min-w-[36rem] border-collapse text-left font-sans text-base"
const headClass = "bg-neutral-100 dark:bg-white/5"
const cellClass = "p-3"
const rowClass = "border-b border-neutral-200 dark:border-white/10"
const articleLinkClass =
  "text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"

export const metadata: Metadata = {
  title: "Step 9: Making Drizel a Playable Granular Instrument",
  description:
    "Adding sample-timed MIDI, note priority, velocity envelopes, expressive controllers and presets to Drizel's real-time granular synth.",
  alternates: {
    canonical: "/articles/step-09-making-drizel-a-playable-granular-instrument",
  },
}

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
              November 5, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 9: Making Drizel a Playable Granular Instrument
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Bringing MIDI, note priority, envelopes, and presets to a real-time grain cloud without losing the instrument&apos;s textural character.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In {" "}
                <Link
                  href="/articles/step-08-building-a-modulation-system"
                  className={articleLinkClass}
                >
                  Step 8
                </Link>
                , Drizel gained a modulation system and a clearer view of how a grain cloud can evolve over time. The engine could already move its source material, but the next question was musical: what should happen when I press a key?
              </p>
              <p>
                That question brings real production constraints. Which note wins if two keys overlap? How should velocity affect loudness? When the last note is released, should the sound fade out smoothly? Where does pitch bend fit into the control flow? Can a preset restore the patch without restoring a stuck note?
              </p>
              <p>
                Step 9 gives those questions concrete answers. It adds a monophonic MIDI mode, a velocity-sensitive attack and release envelope, expressive controller mappings, preset files, and the host configuration needed for MIDI input to reach the plugin.
              </p>

              <blockquote className="border-l-2 border-emerald-400/70 pl-4 text-lg italic text-neutral-600 dark:text-neutral-200">
                Source checkpoint: this article describes implementation commit {" "}
                <a
                  href="https://github.com/neuralmanacle/drizel/commit/87543785e7bff86793294e160912d79b48117f9f"
                  target="_blank"
                  rel="noreferrer"
                  className={articleLinkClass}
                >
                  8754378
                </a>
                , merged into main by {" "}
                <a
                  href="https://github.com/neuralmanacle/drizel/commit/341d211"
                  target="_blank"
                  rel="noreferrer"
                  className={articleLinkClass}
                >
                  341d211
                </a>
                .
              </blockquote>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                1. What changed for the musician?
              </h2>
              <p>
                Drizel now has two operating modes:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Mode</th>
                      <th className={cellClass}>Behaviour</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}>
                      <td className={cellClass}>Drone</td>
                      <td className={cellClass}>The existing continuous grain-cloud workflow, controlled by Output on and the engine parameters.</td>
                    </tr>
                    <tr>
                      <td className={cellClass}>MIDI</td>
                      <td className={cellClass}>The same cloud is heard through a note-controlled amplitude envelope. Channel 1 MIDI selects pitch and expression.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Drone remains the default, preserving the original load-and-play workflow. MIDI is silent until the first note and after the release envelope finishes. The new host-facing controls are <strong>midiMode</strong>, <strong>attack</strong>, <strong>release</strong>, and <strong>rootNote</strong>, all stored in the same parameter tree as the rest of the synth.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                2. One cloud, one selected note
              </h2>
              <p>
                The first design choice was the voicing model. A granular instrument could create a separate cloud for each held note, with independent envelopes and grain pools, but that would add polyphony, voice allocation, voice stealing, and more CPU work.
              </p>
              <p>
                Step 9 uses a <strong>single shared grain cloud</strong> with monophonic, last-note priority. The cloud continues rendering. MIDI changes its pitch target, selected controls, and final amplitude. Holding multiple keys does not create multiple independently playable voices.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className={tableClass}>
                  <thead className={headClass}>
                    <tr>
                      <th className={cellClass}>Action</th>
                      <th className={cellClass}>Selected note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={rowClass}>
                      <td className={cellClass}>Press 60</td>
                      <td className={cellClass}>60</td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Hold 60, press 64</td>
                      <td className={cellClass}>64</td>
                    </tr>
                    <tr className={rowClass}>
                      <td className={cellClass}>Hold 60 and 64, press 67</td>
                      <td className={cellClass}>67</td>
                    </tr>
                    <tr>
                      <td className={cellClass}>Release 67, then 64, then 60</td>
                      <td className={cellClass}>64 → 60 → no note</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The implementation keeps a fixed-capacity note stack:
              </p>
              <CodeBlock
                language="cpp"
                code={`std::array<int, 128> notes_ {};
std::array<double, 128> velocities_ {};
int count_ = 0, note_ = 60, remaining_ = 0;`}
              />
              <p>
                The update path is deliberate and bounded. When a new MIDI note arrives, the code removes any previous entry for that key before adding the new note and making it newest. That gives repeated note-ons a clear policy without introducing heap allocation or dynamic voice management in the audio callback.
              </p>
              <CodeBlock
                language="cpp"
                code={`void noteOn(int note, double velocity) noexcept
{
    if (note < 0 || note > 127) return;
    if (velocity <= 0.0) { noteOff(note); return; }
    remove(note);
    notes_[count_] = note;
    velocities_[count_++] = std::clamp(velocity, 0.0, 1.0);
    select();
}`}
              />

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                3. MIDI note numbers become playback rates
              </h2>
              <p>
                A sample-based instrument needs a reference pitch. Here, <strong>rootNote</strong> declares which MIDI note represents the untransposed source.
              </p>
              <CodeBlock
                language="cpp"
                code={`double pitchOffset(int root) const noexcept
{
    return note_ - root + bend_;
}`}
              />
              <p>
                With root 60, note 60 adds zero semitones, note 72 adds twelve, and note 48 subtracts twelve. Drizel does not detect the sample’s fundamental automatically; the user picks the source pitch that makes the sample meaningful as an instrument.
              </p>
              <MathEquation
                markup="<mrow><mi>r</mi><mo>=</mo><msup><mn>2</mn><mfrac><mi>p</mi><mn>12</mn></mfrac></msup></mrow>"
                label="Pitch conversion formula"
              />
              <p>
                The read rate is then adjusted by the source-to-output sample-rate ratio:
              </p>
              <MathEquation
                markup="<mrow><mi>r</mi><mo>_</mo><mi>read</mi><mo>=</mo><msup><mn>2</mn><mfrac><mi>p</mi><mn>12</mn></mfrac></msup><mfrac><mi>f</mi><mo>_</mo><mi>source</mi></mfrac><mfrac><mi>f</mi><mo>_</mo><mi>output</mi></mfrac></mrow>"
                label="Read rate conversion formula"
              />
              <p>
                This is granular playback-rate transposition, not a time-stretching phase vocoder. Grain duration remains specified in output frames; increasing the read rate makes each grain traverse more source material during that interval.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                4. The note envelope is linear, finite, and testable
              </h2>
              <p>
                The instrument keeps a simple amplitude envelope with a per-note attack and release. On note-on it ramps from the current level toward the target velocity; on note-off it ramps toward zero. This makes a press feel responsive without hiding the source behind excessive smoothing.
              </p>
              <CodeBlock
                language="cpp"
                code={`void ramp(double target, double seconds) noexcept
{
    target_ = target;
    remaining_ = static_cast<int>(
        std::max(1.0, std::round(seconds * rate_)));
    step_ = (target_ - envelope_) / remaining_;
}`}
              />
              <p>
                The final sample applies the exact target value to avoid tiny residual errors from accumulated floating-point arithmetic. That means release reaches exact zero after a finite number of samples. Retriggering does not reset to zero; it begins from the current level to avoid a jarring click when the user plays legato.
              </p>
              <p>
                Velocity is mapped as a linear amplitude target, so a velocity near half maximum produces roughly half the envelope scale, not half the perceived loudness. That simplicity is deliberate. This version is easy to reason about and easy to test.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                5. Sample-accurate MIDI dispatch inside the audio callback
              </h2>
              <p>
                An audio callback processes a block of frames and can receive MIDI events at arbitrary offsets. Drizel walks the event buffer while rendering samples, dispatching each event before the sample at its position:
              </p>
              <CodeBlock
                language="cpp"
                code={`while (event != eventEnd && (*event).samplePosition <= i)
{
    const auto message = *event++;
    const auto* data = message.data;
    if (useMidi && message.numBytes >= 3 && (data[0] & 0x0f) == 0)
    {
        switch (data[0] & 0xf0)
        {
            case 0x90: instrument.noteOn(data[1], data[2] / 127.0); break;
            case 0x80: instrument.noteOff(data[1]); break;
            case 0xb0: instrument.controller(data[1], data[2]); break;
            case 0xe0: instrument.pitchBend(data[1] | (data[2] << 7)); break;
            default: break;
        }
    }
}`}
              />
              <p>
                This preserves event order and avoids discarding MIDI before it can be interpreted. The implementation reads borrowed event bytes instead of constructing temporary MidiMessage objects. That keeps the callback light and avoids heap-driven message copies in the audio thread.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                6. MIDI, LFO modulation, and smoothing all work together
              </h2>
              <p>
                The voice layer is only half the story. The real synthesis path has to merge note pitch, bend, modulation source output, and live engine smoothing into one coherent target.
              </p>
              <CodeBlock
                language="cpp"
                code={`const auto targets = modulation.apply(
    useMidi ? instrument.position(pos) : pos,
    semitones,
    lfo.next());

const auto frame = engine.next(
    targets.position,
    targets.pitch + (useMidi ? instrument.pitchOffset(root) : 0.0),
    useMidi ? instrument.density(grains) : grains,
    level);`}
              />
              <p>
                The engine still uses the existing smoothing path rather than creating a second pitch-control system. That means the note is heard as a change in the cloud&apos;s ongoing behaviour rather than a discrete, abrupt retuning event. Different processes combine: the LFO and modulation route, the note pitch offset, the grain launch schedule, and the 20 ms parameter smoothing.
              </p>
              <p>
                This is one of the important design insights in the step: a note change is not a single event. It is a sequence of new target values arriving through the grain scheduler, smoothing, and overlap lifetime. The step turns that into a musically usable conversation rather than a hard-coded one-off patch.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                7. The envelope is applied at the final output
              </h2>
              <p>
                The engine already smooths gain and applies a sample-swap fade and output safety. Passing the note envelope into that gain target would add an extra smoothing stage. Instead, Step 9 multiplies the returned frame by the note envelope at the end of the block:
              </p>
              <CodeBlock
                language="cpp"
                code={`const float amplitude = useMidi
    ? static_cast<float>(instrument.nextAmplitude())
    : 1.0f;

left[i] = amplitude * (right != nullptr
    ? frame.left
    : 0.5f * (frame.left + frame.right));
if (right != nullptr)
    right[i] = amplitude * frame.right;`}
              />
              <p>
                This keeps the output exactly silent when the envelope reaches zero, while preserving stereo relationships and the current cloud activity beneath the gate. Grain activity can still be nonzero while the meter shows silence because the cloud is still generating audio that the envelope is now suppressing.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                8. Threading and reset behaviour matter as much as the notes
              </h2>
              <p>
                The implementation keeps DSP ownership narrow. MIDI dispatch, note state, grain rendering, and smoother history all stay in the audio thread. UI attachments, preset dialogs, and parameter changes live on the message thread. The loader and file preparation remain background work. That keeps the synth understandable without turning the editor into part of the real-time audio path.
              </p>
              <p>
                The reset flag is especially important when restoring state or switching modes:
              </p>
              <CodeBlock
                language="cpp"
                code={`if (resetInstrument.exchange(false) || useMidi != previousMidiMode)
    instrument.reset();
previousMidiMode = useMidi;`}
              />
              <p>
                This preserves single-thread ownership of <strong>MidiInstrument</strong>. The requested reset is communicated via an atomic flag, and the audio callback performs the actual state clear when safe.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                9. Presets reuse the host-state format
              </h2>
              <p>
                The processor already had parameter serialization, and Step 9 exposes that through .drizel preset files. The saved format includes the host parameter state, the current WAV path, and the configured patch values. It does not serialize live performance state such as the currently held notes or the exact granule scheduler state.
              </p>
              <CodeBlock
                language="cpp"
                code={`bool DrizelAudioProcessor::savePreset(const juce::File& file)
{
    juce::MemoryBlock data;
    getStateInformation(data);
    return file.replaceWithData(data.getData(), data.getSize());
}`}
              />
              <p>
                Loading validates both file size and XML structure before applying the stored state. A recalled preset restores the synth configuration and triggers the WAV load path again; it does not guarantee a sample-identical rerender of a previous performance.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                10. Build configuration is part of the feature
              </h2>
              <p>
                An instrument can contain MIDI logic and still fail to receive MIDI if its host wrapper is not configured correctly. The project must declare the processor as a synth with MIDI input enabled:
              </p>
              <CodeBlock
                language="cpp"
                code={`bool acceptsMidi() const override { return true; }
bool producesMidi() const override { return false; }`}
              />
              <CodeBlock
                language="cmake"
                code={`IS_SYNTH TRUE NEEDS_MIDI_INPUT TRUE NEEDS_MIDI_OUTPUT FALSE`}
              />
              <p>
                These declarations matter because host metadata and transport behaviour both depend on the wrapper. The plugin reports a longer tail length to account for the release envelope, and the test suite updates to cover MIDI timing and preset persistence.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                11. What the tests actually verify
              </h2>
              <p>
                Step 9 splits its checks at the same architectural boundary as the implementation. Core instrument tests verify note ordering, silence, note-on/note-off behaviour, bend handling, velocity mapping, and event-timeline invariance. Processor integration tests exercise real process blocks, preset write/read cycles, invalid preset rejection, and output gating across block boundaries.
              </p>
              <p>
                The important caveat is that passing tests establish specific behavioural guarantees, not full release readiness. The project records successful Linux Debug configurations and plugin-enabled CTest passes, while still leaving host validation, listening tests, and worst-case callback timing as future acceptance checks.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                12. A practical build and listening session
              </h2>
              <p>
                For a fresh checkout of the merged project:
              </p>
              <CodeBlock
                language="sh"
                code={`git clone https://github.com/neuralmanacle/drizel.git
cd drizel
cmake -S . -B cmake-build-step9 \
  -DDRIZEL_JUCE_PATH=../JUCE \
  -DDRIZEL_BUILD_PLUGIN=ON \
  -DCMAKE_BUILD_TYPE=Debug
cmake --build cmake-build-step9 --parallel 2
ctest --test-dir cmake-build-step9 --output-on-failure`}
              />
              <p>
                Then listen in a staged order: verify Drone mode works first, switch to MIDI mode, confirm root pitch matches the source, play octaves and overlapping notes, test soft and hard velocity, check pitch bend and CC mappings, compare release and immediate cut, and save/recall a preset. This is not just a feature check; it is a way to decide whether the control design still feels musical in real usage.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                13. DSP limitations worth hearing deliberately
              </h2>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><strong>Interpolation is not complete anti-aliasing.</strong> Linear interpolation is useful but can still fold high-frequency source content when playback speed increases.</li>
                <li><strong>Density changes texture and effective onset.</strong> More grains overlap, creating a denser cloud and changing the perceived attack.</li>
                <li><strong>Gain compensation is conservative.</strong> The synth is prepared for a maximum density but is not a perceptual loudness normalizer.</li>
                <li><strong>The envelope does not restart the source.</strong> Repeated notes do not necessarily retrigger the same waveform segment or phase.</li>
              </ul>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                14. What this step establishes
              </h2>
              <p>
                Drizel now connects musical gestures to its existing DSP engine through a small, testable instrument layer. The design decisions are explicit: one cloud, last-note priority, velocity-controlled linear ramps, sample-timed MIDI dispatch, smoothed pitch targets, and patch-based preset recall.
              </p>
              <p>
                The next work is not a rewrite; it is listening and measurement. Polyphony, sustain pedal, MPE, a more general modulation network, and a routeable envelope remain future features. For me, the significant shift in Step 9 is that Drizel&apos;s architecture now has to answer to a performance. A note has a time, a pitch, a strength, and an ending. Making those meanings precise is what turns a texture generator into an instrument.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Source and further reading
              </h2>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><a href="https://github.com/neuralmanacle/drizel/commit/87543785e7bff86793294e160912d79b48117f9f" target="_blank" rel="noreferrer" className={articleLinkClass}>Step 9 implementation commit</a></li>
                <li><a href="https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/MidiInstrument.h" target="_blank" rel="noreferrer" className={articleLinkClass}>MidiInstrument implementation</a></li>
                <li><a href="https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/PluginProcessor.cpp" target="_blank" rel="noreferrer" className={articleLinkClass}>Processor implementation</a></li>
                <li><a href="https://docs.juce.com/master/classjuce_1_1MidiBuffer.html" target="_blank" rel="noreferrer" className={articleLinkClass}>JUCE: MidiBuffer</a></li>
                <li><a href="https://docs.juce.com/master/classjuce_1_1AudioProcessorValueTreeState.html" target="_blank" rel="noreferrer" className={articleLinkClass}>JUCE: AudioProcessorValueTreeState</a></li>
              </ul>
            </div>

            <ArticleTags />
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
