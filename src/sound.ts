import { keyToNote } from "./constants";

const audioCtx = new AudioContext();

const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
compressor.knee.setValueAtTime(40, audioCtx.currentTime);
compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
compressor.connect(audioCtx.destination);

function noteToFrequency(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function playNote(note: number, durationSeconds: number) {
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
  filter.connect(compressor);
  const gain = audioCtx.createGain();
  gain.connect(filter);
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.01,
    audioCtx.currentTime + durationSeconds,
  );
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.connect(gain);
  oscillator.frequency.setValueAtTime(
    noteToFrequency(note),
    audioCtx.currentTime,
  );
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + durationSeconds);
}
