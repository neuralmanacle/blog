export interface Project {
  imageSrc: string
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  projectUrl?: string
}

export const projects: Project[] = [
  {
    imageSrc:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Granular%20audio%20synthesizer%20interface%20with%20waveform%20grain%20particles%20visualization%2C%20JUCE%20C%2B%2B%20plugin%20design%2C%20minimal%20retro%20aesthetic%2C%20dark%20background&image_size=landscape_16_9",
    title: "Drizel — Granular Synthesizer",
    description:
      "Granular audio engine with real-time grain windowing, pitch-shift and density controls.",
    techStack: ["JUCE", "C++"],
    githubUrl: "https://github.com/neuralmanacle/drizel",
  },
  {
    imageSrc:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Real-time%20audio%20FFT%20spectrum%20analyzer%20visualization%2C%20colorful%20frequency%20bars%20with%20logarithmic%20scale%2C%20Hann%20Hamming%20Blackman%20windowing%2C%20canvas-based%20DSP%20display&image_size=landscape_16_9",
    title: "FFT Visualizer",
    description:
      "Real-time spectrum analyzer with variable windowing (Hann, Hamming, Blackman) and logarithmic frequency scale.",
    techStack: ["Web Audio API", "Canvas", "DSP"],
    githubUrl: "https://github.com/neuralmanacle/fft-visualizer",
  },
  {
    imageSrc:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Procedural%20game%20audio%20footstep%20synthesis%20system%2C%20terrain%20surface%20classification%20layers%2C%20Wwise%20middleware%20integration%2C%20dynamic%20sound%20texture%20variation%20diagram&image_size=landscape_16_9",
    title: "Procedural Footstep Engine",
    description:
      "Layered surface-aware footstep synthesis with terrain classification and dynamic texture variation.",
    techStack: ["C++", "Game Audio", "Wwise"],
    githubUrl:
      "https://github.com/neuralmanacle/procedural-footstep-engine",
  },
  {
    imageSrc:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Audio%20DSP%20experiments%20notebook%2C%20filter%20oscillator%20waveshaper%20signal%20flow%20diagrams%2C%20Faust%20MATLAB%20JUCE%20development%20environment%2C%20vintage%20audio%20lab%20equipment%20aesthetic&image_size=landscape_16_9",
    title: "Audio DSP Experiments",
    description:
      "A living notebook of filters, oscillators, waveshapers, and measured impulse responses.",
    techStack: ["JUCE", "Faust", "MATLAB"],
    githubUrl: "https://github.com/neuralmanacle/audio-dsp-experiments",
  },
]
