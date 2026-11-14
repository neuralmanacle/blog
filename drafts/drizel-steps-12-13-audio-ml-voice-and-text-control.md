# Steps 12–13: From Audio ML to Voice and Text Control

> I tested whether a classifier could find better grain starts, then built a way to describe how those starts should move through a sample.

Load a guitar recording into Drizel and hold a note. If the grains keep landing near the pick attack, the repeated click can become part of the texture. Move the starts into the ringing string and the same grain settings can sound smoother. Now move **Position** while you play: the texture changes because the instrument is searching a different part of the recording.

Those are two separate decisions. Step 12 asked whether machine learning could improve **which point Drizel chooses**. Step 13 asked how I could describe **where to look over time** without moving Position by hand.

## Step 12 — Can a classifier find better grain starts?

Step 11 gave Drizel a signal-processing baseline. In Sustain mode, the instrument looks near the current Position for audible frames with relatively little spectral change. For Step 12, I trained offline classifiers to label analysis frames as **attack**, **tonal**, **noise**, or **silence**. I then connected an experimental model-based selector to the listening prototype: an eligible frame labeled tonal could supply a grain start.

The model reused the Step 10 analysis. Each frame has nine features, including level, onset strength, spectral centroid, spectral flatness, changes since the previous frame, and zero-crossing rate. I labeled marked onsets and ringing sections from instrument recordings, selected background excerpts as noise, and digital silence as silence. Mixed ambience and uncertain tails could stay unlabeled rather than forcing a questionable class.

### Keeping the evaluation honest

Neighboring analysis frames overlap, so a random frame split would put nearly identical material into both training and evaluation. I instead held out whole recordings and grouped related clips. The Oculus recordings stayed together, as did the generated noise and silence. Feature scaling was fit on the training data within each fold.

The aggregate test score looked encouraging at first:

| Model | Expanded-corpus macro-F1 | Held-out Meta ambience noise recall | Independent rain frames labeled noise |
| --- | ---: | ---: | ---: |
| Majority baseline | 0.015 | 100.0% | 388 / 388 |
| Fixed DSP classification rules | 0.457 | 0.0% | 0 / 388 |
| Softmax regression | 0.729 | 12.4% | 41 / 388 |
| Small tanh network | 0.708 | 10.8% | 1 / 388 |

Macro-F1 summarizes class-level precision and recall without letting the largest class dominate the average. Noise recall answers a narrower question: of the frames labeled noise, how many did the model call noise? The two measures tell different stories here.

Synthetic clips supplied 3,102 of the 3,628 scored frames, so the pooled result was heavily influenced by generated material. On the Meta holdout, softmax recognized most of the waterfall as noise, but noise recall stayed below 6.3% on each rain clip. On a separate rain recording by ezwa, it labeled 347 of 388 frames as silence. [Independent rain recording](https://commons.wikimedia.org/wiki/File:Rain_(1).ogg)

The majority baseline's perfect rain recall is not evidence that it learned rain: that excerpt contained only noise labels, and the baseline guessed noise throughout. A metric can be correct while saying little about how a model will behave on a different recording.

### Listening to the selector, not just the score

I compared the Step 11 Sustain selector with the experimental softmax selector using the same Position sweep and grain settings. In the model version, a tonal-labeled eligible frame could provide the start. If no frame qualified, the grain used the requested Position.

On the rain demo, all 120 launches took that fallback. The sound in that comparison therefore came from the fallback behavior, not from model-selected rain frames.

I also compared two guitar and two piano excerpts from the Oculus pack, which had been excluded from model fitting. I listened blind, revealed the order, then listened again with the audio swapped. Acoustic guitar was the only excerpt where softmax sounded more sustained in both orders. Electric guitar and both pianos were ties on the second pass.

That is one promising acoustic-guitar result, not enough evidence to replace the DSP selector. **Step 12 ended with model deployment deferred.** Drizel continues to use the Step 11 selector.

## Step 13 — Describe how the grains should move

Step 12 explored where an individual grain should begin. Step 13 explored how the search region itself should travel while playing.

I first rendered three kinds of Position movement on the same guitar excerpt:

- **Cyclic** sweeps through a region, then wraps to its beginning.
- **Stepped** repeats a direction pattern: one move forward, then two moves back.
- **Irregular** varies jump distance and timing using a repeatable random sequence.

The patterns make Position more than a static knob. Cyclic movement revisits the whole region in order. A stepped pattern creates a deliberate back-and-forth motion. Irregular movement breaks up the repetition while remaining reproducible.

### From a phrase to an editable preview

Once I could hear the patterns on the guitar, I added a command preview with a small movement vocabulary. The phrase I used was **“make the grain more chaotic and stepped.”**

Drizel interprets that as a stepped scan with variation around the base jump distance and interval. The direction pattern remains forward, back, back; “chaotic” adds variation rather than replacing that pattern. The preview exposes the region, interval, step size, and both variation amounts. If a policy is already active, “more” raises the variation amounts within their limits. I can edit either value before applying it.

The command field uses an explicit **Preview → Apply** flow:

1. **Preview** interprets the phrase and fills editable settings. The current movement keeps running.
2. I can inspect or adjust the proposed values.
3. **Apply** sends a validated numeric policy to the audio engine at a block boundary.

The audio engine advances the policy locally and uses its existing Position smoothing. If I change the sample or recall a preset while a preview is open, I need to preview again before applying it. **Manual scan** returns Position control to the waveform and knob.

The phrase matcher is local and limited to the supported movement vocabulary. This is not an open-ended conversation with the plugin: the preview makes the numeric interpretation visible, and applying it remains a separate choice.

### Adding voice without making it a hidden control path

In the macOS standalone app, **Hold to talk** places an editable transcript in the same command field. Apple’s on-device speech recognizer handles transcription. Drizel’s local phrase matcher interprets the resulting text; I review the preview and decide whether to apply it.

Voice therefore follows the same path as typed input:

**speech → editable transcript → local interpretation → preview → apply**

The recognizer does not directly move the scan. I can correct the transcript, change the proposed values, or leave the active movement untouched.

### Recalling a movement

The preset stores the accepted numeric settings, not the original sentence or transcript. Recall restarts the pattern from its initial phase and fixed seed, so I can bring back the movement without typing or speaking the command again.

I completed the standalone walkthrough with typed commands, preview and apply, preset recall, and Hold to talk. The macOS VST3 builds with typed command support. Live compatibility in a DAW is a separate check; a successful build alone does not establish that workflow.

## What I’d keep playing

On a picked guitar sample, **Sustain** can favor ringing material while a **stepped scan with variation** moves the search region. Sustain answers where a grain should start near Position. The scan answers how Position should move. I can hear and adjust the two decisions separately.

That is where Drizel landed after these steps. The classifier remains an offline experiment. The movement policy is a control I can play, edit, and recall in the standalone instrument.
