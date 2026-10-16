import * as fs from 'fs';
import * as path from 'path';

function createWavBuffer(durationSec: number, frequencies: number[], sampleRate = 22050): Buffer {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const totalSamples = Math.floor(sampleRate * durationSec);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate audio samples: introductory chime + soft ambient acoustic museum pad
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Museum guide chime (intro in first 1.5 seconds: two gentle bell tones)
    let chime = 0;
    if (t < 0.6) {
      const chimeEnvelope = Math.exp(-t * 5.0);
      chime = (Math.sin(2 * Math.PI * 587.33 * t) + 0.5 * Math.sin(2 * Math.PI * 1174.66 * t)) * chimeEnvelope * 0.35;
    } else if (t < 1.5) {
      const t2 = t - 0.6;
      const chimeEnvelope = Math.exp(-t2 * 4.0);
      chime = (Math.sin(2 * Math.PI * 880.0 * t2) + 0.4 * Math.sin(2 * Math.PI * 1760.0 * t2)) * chimeEnvelope * 0.35;
    }

    // Gentle harmonic ambient pad for the rest of the guide
    let pad = 0;
    const padEnvelope = t < 1.5 ? Math.min(1, t / 1.5) : (t > durationSec - 2 ? Math.max(0, (durationSec - t) / 2) : 1);
    for (let f = 0; f < frequencies.length; f++) {
      const freq = frequencies[f];
      // Subtle detune and slow LFO vibrato
      const lfo = Math.sin(2 * Math.PI * 0.2 * t + f);
      const wave = Math.sin(2 * Math.PI * (freq + lfo * 0.5) * t) * (0.15 / (f + 1));
      pad += wave;
    }

    const mixedSample = (chime * 0.7 + pad * padEnvelope * 0.5);
    // Soft limiter
    const clamped = Math.max(-0.95, Math.min(0.95, mixedSample));
    const intSampleLeft = Math.floor(clamped * 32767);
    const intSampleRight = Math.floor(clamped * 32767 * 0.98); // slight stereo offset

    buffer.writeInt16LE(intSampleLeft, offset);
    buffer.writeInt16LE(intSampleRight, offset + 2);
    offset += 4;
  }

  return buffer;
}

const audioTracks = [
  { id: 'starry-night', duration: 15, freqs: [220, 277.18, 329.63, 440] }, // A major / cosmic
  { id: 'girl-pearl-earring', duration: 15, freqs: [261.63, 329.63, 392.00, 523.25] }, // C major / pure light
  { id: 'thorn-necklace', duration: 15, freqs: [220, 261.63, 329.63, 415.3] }, // A minor / emotional
  { id: 'third-of-may', duration: 15, freqs: [196, 246.94, 293.66, 392] }, // G / dramatic
  { id: 'impression-sunrise', duration: 15, freqs: [293.66, 369.99, 440, 587.33] }, // D major / morning mist
  { id: 'judith-holofernes', duration: 15, freqs: [246.94, 311.13, 369.99, 493.88] }, // B / intense
  { id: 'milkmaid', duration: 15, freqs: [261.63, 329.63, 392.00, 493.88] }, // Cmaj7 / calm domestic
  { id: 'cezanne-sainte-victoire', duration: 15, freqs: [220, 277.18, 329.63, 440] }, // Provence
  { id: 'joconde', duration: 15, freqs: [261.63, 311.13, 392.00, 523.25] }, // Renaissance sfumato
  { id: 'caravaggio-matthieu', duration: 15, freqs: [196, 233.08, 293.66, 392] }, // Tenebrism
  { id: 'general-guide', duration: 15, freqs: [261.63, 329.63, 392.00, 523.25] },
];

const outDir = path.resolve('public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const track of audioTracks) {
  const filePath = path.join(outDir, `${track.id}.wav`);
  const buf = createWavBuffer(track.duration, track.freqs);
  fs.writeFileSync(filePath, buf);
  console.log(`Generated audio: ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
}
